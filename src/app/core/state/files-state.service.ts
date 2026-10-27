import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApiService } from '../api/auth-api.service';
import { FilesApiService } from '../api/files-api.service';
import { formatFileSize, SEARCH_SUGGESTIONS } from '../mocks/workspace.mock';
import {
  FileItem,
  FileSystemEntry,
  FileSystemEntryKind,
  FilesViewMode,
  FolderItem,
  PinnedFileView,
  PinnedFolderView,
  SearchFileHit,
  SearchFolderHit,
  SearchResultsView,
  WorkspaceFileType,
} from '../models/workspace.models';
import { HistoryStateService } from './history-state.service';
import { RoleStateService } from './role-state.service';

@Injectable({ providedIn: 'root' })
export class FilesStateService {
  private readonly filesApi = inject(FilesApiService);
  private readonly authApi = inject(AuthApiService);
  private readonly roleState = inject(RoleStateService);
  private readonly historyState = inject(HistoryStateService);

  private readonly foldersState = signal<FolderItem[]>([]);
  private readonly filesState = signal<FileItem[]>([]);
  private readonly searchedFoldersState = signal<FolderItem[] | null>(null);
  private readonly searchedFilesState = signal<FileItem[] | null>(null);
  private readonly activeFolderIdState = signal<string | null>(null);
  private readonly viewModeState = signal<FilesViewMode>('list');
  private readonly searchQueryState = signal<string>('');
  private readonly loadingState = signal<boolean>(false);

  private readonly createFolderDialogOpenState = signal<boolean>(false);
  private readonly uploadFileDialogOpenState = signal<boolean>(false);
  private readonly renameTargetState = signal<FileSystemEntry | null>(null);
  private readonly deleteTargetState = signal<FileSystemEntry | null>(null);

  readonly folders = this.foldersState.asReadonly();
  readonly files = this.filesState.asReadonly();
  readonly activeFolderId = this.activeFolderIdState.asReadonly();
  readonly viewMode = this.viewModeState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();
  readonly searchSuggestions = SEARCH_SUGGESTIONS;
  readonly isLoading = this.loadingState.asReadonly();

  readonly isCreateFolderDialogOpen = this.createFolderDialogOpenState.asReadonly();
  readonly isUploadFileDialogOpen = this.uploadFileDialogOpenState.asReadonly();
  readonly renameTarget = this.renameTargetState.asReadonly();
  readonly deleteTarget = this.deleteTargetState.asReadonly();

  readonly activeFolder = computed<FolderItem | undefined>(() => {
    const id = this.activeFolderIdState();
    if (!id) {
      return undefined;
    }
    return this.foldersState().find((folder) => folder.id === id);
  });

  readonly breadcrumbs = computed<FolderItem[]>(() => {
    return this.getFolderAncestors(this.activeFolderIdState());
  });

  readonly parentDisplayName = computed<string>(() => {
    const current = this.activeFolder();
    return current ? current.name : `Корінь групи ${this.roleState.group().name}`;
  });

  readonly rootFolders = computed<FolderItem[]>(() => {
    return this.foldersState().filter((folder) => folder.parentId === null);
  });

  readonly currentEntries = computed<FileSystemEntry[]>(() => {
    const folderId = this.activeFolderIdState();
    const childFolders = this.foldersState()
      .filter((folder) => folder.parentId === folderId)
      .map<FileSystemEntry>((folder) => ({
        id: folder.id,
        kind: 'folder',
        name: folder.name,
        ownerId: folder.createdBy,
        pinned: folder.pinned,
        updatedAt: folder.updatedAt,
        meta: `${this.getFolderTotalCount(folder.id)} елем.`,
      }));

    const childFiles = this.filesState()
      .filter((file) => file.folderId === folderId)
      .map<FileSystemEntry>((file) => ({
        id: file.id,
        kind: 'file',
        name: file.name,
        type: file.type,
        ownerId: file.ownerId,
        pinned: file.pinned,
        updatedAt: file.uploadedAt,
        meta: formatFileSize(file.sizeMb),
      }));

    return [...childFolders, ...childFiles];
  });

  readonly pinnedRootEntries = computed<FileSystemEntry[]>(() => {
    if (this.activeFolderIdState() !== null) {
      return [];
    }

    const pinnedFolders = this.foldersState()
      .filter((folder) => folder.pinned)
      .map<FileSystemEntry>((folder) => ({
        id: folder.id,
        kind: 'folder',
        name: folder.name,
        ownerId: folder.createdBy,
        pinned: true,
        updatedAt: folder.updatedAt,
        meta: `${this.getFolderTotalCount(folder.id)} елем.`,
      }));

    const pinnedFiles = this.filesState()
      .filter((file) => file.pinned)
      .map<FileSystemEntry>((file) => ({
        id: file.id,
        kind: 'file',
        name: file.name,
        type: file.type,
        ownerId: file.ownerId,
        pinned: true,
        updatedAt: file.uploadedAt,
        meta: formatFileSize(file.sizeMb),
      }));

    return [...pinnedFolders, ...pinnedFiles].slice(0, 4);
  });

  readonly pinnedFoldersView = computed<PinnedFolderView[]>(() => {
    return this.foldersState()
      .filter((folder) => folder.pinned)
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        pathLabel: this.getFolderPathLabel(folder.parentId),
        totalItemsCount: this.getFolderTotalCount(folder.id),
        createdBy: folder.createdBy,
        updatedAt: folder.updatedAt,
      }));
  });

  readonly pinnedFilesView = computed<PinnedFileView[]>(() => {
    return this.filesState()
      .filter((file) => file.pinned)
      .map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        folderId: file.folderId,
        pathLabel: this.getFolderPathLabel(file.folderId),
        sizeLabel: formatFileSize(file.sizeMb),
        uploadedAt: file.uploadedAt,
        ownerId: file.ownerId,
      }));
  });

  readonly searchResultsView = computed<SearchResultsView>(() => {
    const rawQuery = this.searchQueryState().trim();
    const normalized = rawQuery.toLowerCase();

    if (!normalized) {
      return {
        query: '',
        folders: [],
        files: [],
        totalCount: 0,
      };
    }

    const sourceFolders =
      this.searchedFoldersState() ??
      this.foldersState().filter((folder) =>
        folder.name.toLowerCase().includes(normalized)
      );

    const sourceFiles =
      this.searchedFilesState() ??
      this.filesState().filter((file) => file.name.toLowerCase().includes(normalized));

    const matchedFolders = sourceFolders.map<SearchFolderHit>((folder) => ({
      id: folder.id,
      name: folder.name,
      pathLabel: this.getFolderPathLabel(folder.parentId),
    }));

    const matchedFiles = sourceFiles.map<SearchFileHit>((file) => ({
      id: file.id,
      name: file.name,
      type: file.type,
      folderId: file.folderId,
      pathLabel: this.getFolderPathLabel(file.folderId),
      sizeLabel: formatFileSize(file.sizeMb),
      ownerId: file.ownerId,
    }));

    return {
      query: rawQuery,
      folders: matchedFolders,
      files: matchedFiles,
      totalCount: matchedFolders.length + matchedFiles.length,
    };
  });

  readonly pageTitle = computed<string>(() => {
    const folder = this.activeFolder();
    return folder ? folder.name : 'Файли групи';
  });

  readonly pageDescription = computed<string>(() => {
    const folder = this.activeFolder();
    if (folder) {
      return `${this.currentEntries().length} елем. у цій папці`;
    }
    return 'Матеріали за предметами. Усі учасники групи бачать однакову структуру.';
  });

  constructor() {
    void this.loadSnapshot();
  }

  async loadSnapshot(): Promise<void> {
    if (!this.authApi.hasToken()) {
      this.foldersState.set([]);
      this.filesState.set([]);
      return;
    }
    this.loadingState.set(true);
    try {
      const snapshot = await this.filesApi.fetchSnapshot();
      this.roleState.registerKnownAuthors(snapshot.authors);
      this.foldersState.set(snapshot.folders);
      this.filesState.set(snapshot.files);
    } catch {
      this.foldersState.set([]);
      this.filesState.set([]);
    } finally {
      this.loadingState.set(false);
    }
  }

  clear(): void {
    this.foldersState.set([]);
    this.filesState.set([]);
    this.searchedFoldersState.set(null);
    this.searchedFilesState.set(null);
    this.activeFolderIdState.set(null);
  }

  setActiveFolder(folderId: string | null): void {
    this.activeFolderIdState.set(folderId);
  }

  setViewMode(mode: FilesViewMode): void {
    this.viewModeState.set(mode);
  }

  setSearchQuery(query: string): void {
    const trimmed = query.trim();
    this.searchQueryState.set(trimmed);
    this.searchedFoldersState.set(null);
    this.searchedFilesState.set(null);

    if (!trimmed || !this.authApi.hasToken()) {
      return;
    }

    void this.filesApi
      .searchSnapshot(trimmed)
      .then((res) => {
        if (this.searchQueryState() === trimmed) {
          this.roleState.registerKnownAuthors(res.authors);
          this.searchedFoldersState.set(res.folders);
          this.searchedFilesState.set(res.files);
        }
      })
      .catch(() => undefined);
  }

  getChildFolders(parentId: string | null): FolderItem[] {
    return this.foldersState().filter((folder) => folder.parentId === parentId);
  }

  getFolderAncestors(folderId: string | null): FolderItem[] {
    const chain: FolderItem[] = [];
    const allFolders = this.foldersState();
    let current = folderId ? allFolders.find((item) => item.id === folderId) : undefined;
    while (current) {
      chain.unshift(current);
      const nextParentId = current.parentId;
      current = nextParentId ? allFolders.find((item) => item.id === nextParentId) : undefined;
    }
    return chain;
  }

  getFolderPathLabel(folderId: string | null): string {
    const ancestors = this.getFolderAncestors(folderId);
    return ancestors.length > 0
      ? ancestors.map((item) => item.name).join(' / ')
      : 'Корінь групи';
  }

  getFolderTotalCount(folderId: string): number {
    const allFolders = this.foldersState();
    const allFiles = this.filesState();

    const countRecursive = (targetId: string): number => {
      const directFolders = allFolders.filter((folder) => folder.parentId === targetId);
      const directFiles = allFiles.filter((file) => file.folderId === targetId);
      return (
        directFiles.length +
        directFolders.length +
        directFolders.reduce((sum, child) => sum + countRecursive(child.id), 0)
      );
    };

    return countRecursive(folderId);
  }

  openCreateFolderDialog(): void {
    this.createFolderDialogOpenState.set(true);
  }

  closeCreateFolderDialog(): void {
    this.createFolderDialogOpenState.set(false);
  }

  openUploadFileDialog(): void {
    this.uploadFileDialogOpenState.set(true);
  }

  closeUploadFileDialog(): void {
    this.uploadFileDialogOpenState.set(false);
  }

  openRenameDialog(entry: FileSystemEntry): void {
    this.renameTargetState.set(entry);
  }

  closeRenameDialog(): void {
    this.renameTargetState.set(null);
  }

  openDeleteDialog(entry: FileSystemEntry): void {
    this.deleteTargetState.set(entry);
  }

  closeDeleteDialog(): void {
    this.deleteTargetState.set(null);
  }

  async createFolder(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) {
      this.closeCreateFolderDialog();
      return;
    }
    await this.filesApi.createFolder({
      name: trimmed,
      parentId: this.activeFolderIdState(),
      createdBy: this.roleState.user().id,
    });
    await this.loadSnapshot();
    void this.historyState.hydrateFromApi();
    this.closeCreateFolderDialog();
  }

  async uploadFile(
    fileName?: string,
    fileType: WorkspaceFileType = 'pdf',
    sizeMb = 1.4,
    file?: File
  ): Promise<void> {
    if (!this.roleState.can().canUpload) {
      this.closeUploadFileDialog();
      return;
    }
    const resolvedName = file?.name || fileName?.trim() || 'Новий конспект.pdf';
    await this.filesApi.uploadFile({
      name: resolvedName,
      type: fileType,
      sizeMb,
      folderId: this.activeFolderIdState(),
      ownerId: this.roleState.user().id,
      file,
    });
    await this.loadSnapshot();
    void this.roleState.refreshGroupInfo();
    void this.historyState.hydrateFromApi();
    this.closeUploadFileDialog();
  }

  async downloadFile(fileId: string, fileName: string): Promise<void> {
    await this.filesApi.downloadFile(fileId, fileName);
  }

  async confirmRename(newName: string): Promise<void> {
    const target = this.renameTargetState();
    if (!target) {
      return;
    }
    const snapshot = await this.filesApi.renameEntry({
      id: target.id,
      kind: target.kind,
      name: newName,
    });
    this.roleState.registerKnownAuthors(snapshot.authors);
    this.foldersState.set(snapshot.folders);
    this.filesState.set(snapshot.files);
    void this.historyState.hydrateFromApi();
    this.closeRenameDialog();
  }

  async togglePin(entry: FileSystemEntry): Promise<void> {
    await this.togglePinById(entry.id, entry.kind);
  }

  async togglePinById(id: string, kind: FileSystemEntryKind): Promise<void> {
    if (!this.roleState.can().canPin) {
      return;
    }
    const snapshot = await this.filesApi.togglePin({ id, kind });
    this.roleState.registerKnownAuthors(snapshot.authors);
    this.foldersState.set(snapshot.folders);
    this.filesState.set(snapshot.files);
  }

  async confirmDelete(): Promise<void> {
    const target = this.deleteTargetState();
    if (!target) {
      return;
    }
    const snapshot = await this.filesApi.deleteEntry({
      id: target.id,
      kind: target.kind,
    });
    this.roleState.registerKnownAuthors(snapshot.authors);
    this.foldersState.set(snapshot.folders);
    this.filesState.set(snapshot.files);
    void this.roleState.refreshGroupInfo();
    void this.historyState.hydrateFromApi();
    this.closeDeleteDialog();
  }
}

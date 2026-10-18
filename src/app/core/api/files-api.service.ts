import { Injectable } from '@angular/core';
import {
  CreateFolderPayload,
  DeleteEntryPayload,
  FileItem,
  FolderItem,
  RenameEntryPayload,
  TogglePinPayload,
  UploadFilePayload,
} from '../models/workspace.models';
import { MOCK_FILES, MOCK_FOLDERS } from '../mocks/workspace.mock';

export interface WorkspaceFilesSnapshot {
  readonly folders: FolderItem[];
  readonly files: FileItem[];
}

@Injectable({ providedIn: 'root' })
export class FilesApiService {
  private foldersDb: FolderItem[] = MOCK_FOLDERS.map((folder) => ({ ...folder }));
  private filesDb: FileItem[] = MOCK_FILES.map((file) => ({ ...file }));

  async fetchSnapshot(): Promise<WorkspaceFilesSnapshot> {
    return Promise.resolve({
      folders: this.foldersDb.map((folder) => ({ ...folder })),
      files: this.filesDb.map((file) => ({ ...file })),
    });
  }

  async fetchFolders(): Promise<FolderItem[]> {
    return Promise.resolve(this.foldersDb.map((folder) => ({ ...folder })));
  }

  async fetchFiles(): Promise<FileItem[]> {
    return Promise.resolve(this.filesDb.map((file) => ({ ...file })));
  }

  async searchSnapshot(query: string): Promise<WorkspaceFilesSnapshot> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return Promise.resolve({ folders: [], files: [] });
    }
    return Promise.resolve({
      folders: this.foldersDb
        .filter((folder) => folder.name.toLowerCase().includes(normalized))
        .map((folder) => ({ ...folder })),
      files: this.filesDb
        .filter((file) => file.name.toLowerCase().includes(normalized))
        .map((file) => ({ ...file })),
    });
  }

  async createFolder(payload: CreateFolderPayload): Promise<FolderItem> {
    const created: FolderItem = {
      id: `f-${Date.now()}`,
      name: payload.name.trim(),
      parentId: payload.parentId,
      pinned: false,
      createdBy: payload.createdBy,
      updatedAt: 'Сьогодні',
    };
    this.foldersDb = [...this.foldersDb, created];
    return Promise.resolve({ ...created });
  }

  async uploadFile(payload: UploadFilePayload): Promise<FileItem> {
    const created: FileItem = {
      id: `file-${Date.now()}`,
      name: payload.name.trim(),
      type: payload.type,
      sizeMb: payload.sizeMb,
      folderId: payload.folderId,
      ownerId: payload.ownerId,
      pinned: false,
      uploadedAt: 'Сьогодні',
    };
    this.filesDb = [...this.filesDb, created];
    return Promise.resolve({ ...created });
  }

  async renameEntry(payload: RenameEntryPayload): Promise<WorkspaceFilesSnapshot> {
    const trimmed = payload.name.trim();
    if (!trimmed) {
      return this.fetchSnapshot();
    }

    if (payload.kind === 'folder') {
      this.foldersDb = this.foldersDb.map((folder) =>
        folder.id === payload.id ? { ...folder, name: trimmed } : folder
      );
    } else {
      this.filesDb = this.filesDb.map((file) =>
        file.id === payload.id ? { ...file, name: trimmed } : file
      );
    }

    return this.fetchSnapshot();
  }

  async togglePin(payload: TogglePinPayload): Promise<WorkspaceFilesSnapshot> {
    if (payload.kind === 'folder') {
      this.foldersDb = this.foldersDb.map((folder) =>
        folder.id === payload.id ? { ...folder, pinned: !folder.pinned } : folder
      );
    } else {
      this.filesDb = this.filesDb.map((file) =>
        file.id === payload.id ? { ...file, pinned: !file.pinned } : file
      );
    }

    return this.fetchSnapshot();
  }

  async deleteEntry(payload: DeleteEntryPayload): Promise<WorkspaceFilesSnapshot> {
    if (payload.kind === 'folder') {
      const toRemove = new Set<string>([payload.id]);
      let added = true;
      while (added) {
        added = false;
        for (const folder of this.foldersDb) {
          if (folder.parentId && toRemove.has(folder.parentId) && !toRemove.has(folder.id)) {
            toRemove.add(folder.id);
            added = true;
          }
        }
      }
      this.foldersDb = this.foldersDb.filter((folder) => !toRemove.has(folder.id));
      this.filesDb = this.filesDb.filter(
        (file) => !(file.folderId && toRemove.has(file.folderId))
      );
    } else {
      this.filesDb = this.filesDb.filter((file) => file.id !== payload.id);
    }

    return this.fetchSnapshot();
  }
}

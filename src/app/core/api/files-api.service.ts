import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CreateFolderPayload,
  DeleteEntryPayload,
  FileItem,
  FolderItem,
  MemberUser,
  RenameEntryPayload,
  TogglePinPayload,
  UploadFilePayload,
} from '../models/workspace.models';
import {
  ApiDeleteFileResponse,
  ApiDeleteFolderResponse,
  ApiFileResponse,
  ApiFilesSnapshotResponse,
  ApiFolderResponse,
  mapApiAuthorToMember,
  mapApiFileToFileItem,
  mapApiFolderToFolderItem,
} from './api.models';

export interface WorkspaceFilesSnapshot {
  readonly folders: FolderItem[];
  readonly files: FileItem[];
  readonly authors: MemberUser[];
}

@Injectable({ providedIn: 'root' })
export class FilesApiService {
  private readonly http = inject(HttpClient);

  async fetchSnapshot(): Promise<WorkspaceFilesSnapshot> {
    const res = await firstValueFrom(
      this.http.get<ApiFilesSnapshotResponse>('/api/files/snapshot')
    );
    return this.mapSnapshotResponse(res);
  }

  async fetchFolders(): Promise<FolderItem[]> {
    const snapshot = await this.fetchSnapshot();
    return snapshot.folders;
  }

  async fetchFiles(): Promise<FileItem[]> {
    const snapshot = await this.fetchSnapshot();
    return snapshot.files;
  }

  async searchSnapshot(query: string): Promise<WorkspaceFilesSnapshot> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { folders: [], files: [], authors: [] };
    }
    const params = new HttpParams().set('q', trimmed);
    const res = await firstValueFrom(
      this.http.get<ApiFilesSnapshotResponse>('/api/files/search', { params })
    );
    return this.mapSnapshotResponse(res);
  }

  async createFolder(payload: CreateFolderPayload): Promise<FolderItem> {
    const res = await firstValueFrom(
      this.http.post<ApiFolderResponse>('/api/folders', {
        name: payload.name.trim(),
        parentId: payload.parentId,
      })
    );
    return mapApiFolderToFolderItem(res);
  }

  async uploadFile(payload: UploadFilePayload & { file?: File }): Promise<FileItem> {
    const formData = new FormData();
    const fileToUpload =
      payload.file ??
      new File([new Uint8Array([37, 80, 68, 70])], payload.name.trim(), {
        type: 'application/pdf',
      });
    formData.append('file', fileToUpload, fileToUpload.name);

    let params = new HttpParams();
    if (payload.folderId) {
      params = params.set('folderId', payload.folderId);
    }

    const res = await firstValueFrom(
      this.http.post<ApiFileResponse>('/api/files/upload', formData, { params })
    );
    return mapApiFileToFileItem(res);
  }

  async downloadFile(fileId: string, fallbackName: string): Promise<void> {
    const blob = await firstValueFrom(
      this.http.get(`/api/files/${fileId}/download`, { responseType: 'blob' })
    );
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fallbackName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }

  async renameEntry(payload: RenameEntryPayload): Promise<WorkspaceFilesSnapshot> {
    const trimmed = payload.name.trim();
    if (!trimmed) {
      return this.fetchSnapshot();
    }

    if (payload.kind === 'folder') {
      await firstValueFrom(
        this.http.patch<ApiFolderResponse>(`/api/folders/${payload.id}/rename`, {
          name: trimmed,
        })
      );
    } else {
      await firstValueFrom(
        this.http.patch<ApiFileResponse>(`/api/files/${payload.id}/rename`, {
          name: trimmed,
        })
      );
    }

    return this.fetchSnapshot();
  }

  async togglePin(payload: TogglePinPayload): Promise<WorkspaceFilesSnapshot> {
    if (payload.kind === 'folder') {
      await firstValueFrom(
        this.http.patch<ApiFolderResponse>(`/api/folders/${payload.id}/pin`, {})
      );
    } else {
      await firstValueFrom(
        this.http.patch<ApiFileResponse>(`/api/files/${payload.id}/pin`, {})
      );
    }

    return this.fetchSnapshot();
  }

  async deleteEntry(payload: DeleteEntryPayload): Promise<WorkspaceFilesSnapshot> {
    if (payload.kind === 'folder') {
      await firstValueFrom(
        this.http.delete<ApiDeleteFolderResponse>(`/api/folders/${payload.id}`)
      );
    } else {
      await firstValueFrom(
        this.http.delete<ApiDeleteFileResponse>(`/api/files/${payload.id}`)
      );
    }

    return this.fetchSnapshot();
  }

  private mapSnapshotResponse(res: ApiFilesSnapshotResponse): WorkspaceFilesSnapshot {
    const authorsMap = new Map<string, MemberUser>();
    for (const folder of res.folders) {
      if (folder.author && !authorsMap.has(folder.author.id)) {
        authorsMap.set(folder.author.id, mapApiAuthorToMember(folder.author));
      }
    }
    for (const file of res.files) {
      if (file.author && !authorsMap.has(file.author.id)) {
        authorsMap.set(file.author.id, mapApiAuthorToMember(file.author));
      }
    }

    return {
      folders: res.folders.map(mapApiFolderToFolderItem),
      files: res.files.map(mapApiFileToFileItem),
      authors: Array.from(authorsMap.values()),
    };
  }
}

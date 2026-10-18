import { UiAvatarTone, UiIconName } from '@ui';

export type UserRole = 'studcurator' | 'starosta' | 'student';

export interface MemberUser {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly email: string;
  readonly role: UserRole;
  readonly canUpload: boolean;
  readonly joinedAt: string;
}

export interface MemberRowView extends MemberUser {
  readonly fullName: string;
  readonly initials: string;
  readonly avatarTone: UiAvatarTone;
  readonly roleLabel: string;
  readonly uploadStatusLabel: string;
}

export interface EditMemberPayload {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
}

export interface UpdateProfilePayload {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly email: string;
}

export interface ChangePasswordPayload {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly repeatPassword: string;
}

export interface RolePermissions {
  readonly canUpload: boolean;
  readonly canPin: boolean;
  readonly canRenameAny: boolean;
  readonly canDeleteAny: boolean;
  readonly canManageMembers: boolean;
  readonly canToggleUpload: boolean;
  readonly canEditGroup: boolean;
}

export interface RoleDemoPreset {
  readonly userId: string;
  readonly label: string;
}

export interface GroupInfo {
  readonly name: string;
  readonly faculty: string;
  readonly createdAt: string;
  readonly membersLabel: string;
  readonly storageUsedLabel: string;
  readonly storagePercent: number;
}

export interface GroupUploadSettings {
  readonly allowStudentUploads: boolean;
  readonly allowStudentRenameOwn: boolean;
  readonly maxFileSizeMb: number;
}

export interface UpdateGroupInfoPayload {
  readonly name: string;
  readonly faculty: string;
}

export type WorkspaceFileType = 'pdf' | 'docx' | 'pptx' | 'image' | 'video';

export interface FolderItem {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | null;
  readonly pinned: boolean;
  readonly createdBy: string;
  readonly updatedAt: string;
}

export interface FileItem {
  readonly id: string;
  readonly name: string;
  readonly type: WorkspaceFileType;
  readonly sizeMb: number;
  readonly folderId: string | null;
  readonly ownerId: string;
  readonly pinned: boolean;
  readonly uploadedAt: string;
}

export type FileSystemEntryKind = 'folder' | 'file';

export interface FileSystemEntry {
  readonly id: string;
  readonly kind: FileSystemEntryKind;
  readonly name: string;
  readonly type?: WorkspaceFileType;
  readonly ownerId: string;
  readonly pinned: boolean;
  readonly updatedAt: string;
  readonly meta: string;
}

export interface PinnedFolderView {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | null;
  readonly pathLabel: string;
  readonly totalItemsCount: number;
  readonly createdBy: string;
  readonly updatedAt: string;
}

export interface PinnedFileView {
  readonly id: string;
  readonly name: string;
  readonly type: WorkspaceFileType;
  readonly folderId: string | null;
  readonly pathLabel: string;
  readonly sizeLabel: string;
  readonly uploadedAt: string;
  readonly ownerId: string;
}

export interface SearchFolderHit {
  readonly id: string;
  readonly name: string;
  readonly pathLabel: string;
}

export interface SearchFileHit {
  readonly id: string;
  readonly name: string;
  readonly type: WorkspaceFileType;
  readonly folderId: string | null;
  readonly pathLabel: string;
  readonly sizeLabel: string;
  readonly ownerId: string;
}

export interface SearchResultsView {
  readonly query: string;
  readonly folders: readonly SearchFolderHit[];
  readonly files: readonly SearchFileHit[];
  readonly totalCount: number;
}

export type FilesViewMode = 'list' | 'grid';

export interface CreateFolderPayload {
  readonly name: string;
  readonly parentId: string | null;
  readonly createdBy: string;
}

export interface UploadFilePayload {
  readonly name: string;
  readonly type: WorkspaceFileType;
  readonly sizeMb: number;
  readonly folderId: string | null;
  readonly ownerId: string;
}

export interface RenameEntryPayload {
  readonly id: string;
  readonly kind: FileSystemEntryKind;
  readonly name: string;
}

export interface TogglePinPayload {
  readonly id: string;
  readonly kind: FileSystemEntryKind;
}

export interface DeleteEntryPayload {
  readonly id: string;
  readonly kind: FileSystemEntryKind;
}

export type HistoryEventKind =
  | 'file_added'
  | 'folder_created'
  | 'file_renamed'
  | 'member_added'
  | 'upload_access'
  | 'file_deleted'
  | 'role_changed'
  | 'member_removed'
  | 'group';

export type HistoryFilterKind = 'all' | 'files' | 'members' | 'access';

export interface HistoryEventItem {
  readonly id: string;
  readonly kind: HistoryEventKind;
  readonly actor: string;
  readonly text: string;
  readonly day: string;
  readonly time: string;
}

export interface HistoryEventView extends HistoryEventItem {
  readonly icon: UiIconName;
  readonly toneClass: string;
  readonly filterCategory: Exclude<HistoryFilterKind, 'all'>;
}

export interface HistoryDayGroup {
  readonly day: string;
  readonly events: readonly HistoryEventView[];
}

export interface PendingInvitation {
  readonly id: string;
  readonly email: string;
  readonly invitedAt: string;
  readonly expiresIn: string;
}

export interface UserDisplayMeta {
  readonly fullName: string;
  readonly initials: string;
  readonly avatarTone: UiAvatarTone;
}

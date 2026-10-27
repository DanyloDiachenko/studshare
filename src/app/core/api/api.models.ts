import {
  FileItem,
  FolderItem,
  GroupInfo,
  HistoryEventItem,
  HistoryEventKind,
  MemberUser,
  PendingInvitation,
  UserRole,
  WorkspaceFileType,
} from '../models/workspace.models';

export interface ApiAuthorSummaryResponse {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly role: string;
}

export interface ApiUserResponse {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly role: string;
  readonly groupId: string | null;
  readonly uploadAccess: boolean;
  readonly joinedAt: string;
  readonly invitedAt: string | null;
  readonly isEmailVerified: boolean;
}

export interface ApiAuthSuccessResponse {
  readonly accessToken: string;
  readonly user: ApiUserResponse;
}

export interface ApiSignUpRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
}

export interface ApiSignInRequest {
  readonly email: string;
  readonly password: string;
}

export interface ApiForgotPasswordRequest {
  readonly email: string;
}

export interface ApiResetPasswordRequest {
  readonly email: string;
  readonly code: string;
  readonly newPassword: string;
}

export interface ApiConfirmEmailRequest {
  readonly email: string;
  readonly code: string;
}

export interface ApiUpdateProfileRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly email: string;
}

export interface ApiChangePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly repeatPassword: string;
}

export interface ApiGroupInfoResponse {
  readonly id: string;
  readonly name: string;
  readonly faculty: string;
  readonly createdAt: string;
  readonly storageUsedBytes: number;
  readonly storageLimitBytes: number;
  readonly membersCount: number;
  readonly pendingInvitationsCount: number;
}

export interface ApiCreateGroupRequest {
  readonly name: string;
  readonly faculty: string;
}

export interface ApiUpdateGroupRequest {
  readonly name: string;
  readonly faculty: string;
}

export interface ApiDeleteGroupRequest {
  readonly confirmName: string;
}

export interface ApiFolderResponse {
  readonly id: string;
  readonly groupId: string;
  readonly parentId: string | null;
  readonly name: string;
  readonly isPinned: boolean;
  readonly author: ApiAuthorSummaryResponse;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly folders: ApiFolderResponse[];
  readonly files: ApiFileResponse[];
}

export interface ApiFileResponse {
  readonly id: string;
  readonly groupId: string;
  readonly folderId: string | null;
  readonly name: string;
  readonly extension: string;
  readonly category: string;
  readonly sizeBytes: number;
  readonly url: string;
  readonly isPinned: boolean;
  readonly author: ApiAuthorSummaryResponse;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ApiFilesSnapshotResponse {
  readonly folders: ApiFolderResponse[];
  readonly files: ApiFileResponse[];
}

export interface ApiCreateFolderRequest {
  readonly name: string;
  readonly parentId: string | null;
}

export interface ApiRenameRequest {
  readonly name: string;
}

export interface ApiDeleteFileResponse {
  readonly deletedFileId: string;
  readonly storageUsedBytes: number;
}

export interface ApiDeleteFolderResponse {
  readonly deletedFolderIds: string[];
  readonly storageUsedBytes: number;
}

export interface ApiGroupInvitationResponse {
  readonly id: string;
  readonly groupId: string;
  readonly email: string;
  readonly invitedBy: ApiAuthorSummaryResponse;
  readonly invitedAt: string;
  readonly expiresAt: string;
}

export interface ApiMembersResponse {
  readonly members: ApiUserResponse[];
  readonly invitations: ApiGroupInvitationResponse[];
}

export interface ApiSetUploadAccessRequest {
  readonly uploadAccess: boolean;
}

export interface ApiUpdateMemberRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
}

export interface ApiAssignStarostaResponse {
  readonly previousStarostaId: string | null;
  readonly newStarostaId: string;
}

export interface ApiRemoveMemberResponse {
  readonly removedUserId: string;
}

export interface ApiInviteUserRequest {
  readonly email: string;
}

export interface ApiCancelInvitationResponse {
  readonly cancelledInvitationId: string;
}

export interface ApiHistoryEventResponse {
  readonly id: string;
  readonly groupId: string;
  readonly kind: string;
  readonly actor: ApiAuthorSummaryResponse;
  readonly text: string;
  readonly createdAt: string;
}

const UK_MONTHS_SHORT = [
  'січ.',
  'лют.',
  'бер.',
  'квіт.',
  'трав.',
  'черв.',
  'лип.',
  'серп.',
  'вер.',
  'жовт.',
  'лист.',
  'груд.',
];

const UK_MONTHS_GENITIVE = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

export function mapApiRole(role: string): UserRole {
  const normalized = role.toLowerCase();
  if (normalized === 'studcurator') {
    return 'studcurator';
  }
  if (normalized === 'starosta') {
    return 'starosta';
  }
  return 'student';
}

export function mapApiCategory(category: string, extension: string): WorkspaceFileType {
  const cat = category.toLowerCase();
  if (cat === 'docx') return 'docx';
  if (cat === 'pptx') return 'pptx';
  if (cat === 'image') return 'image';
  if (cat === 'video') return 'video';
  if (cat === 'pdf') return 'pdf';

  const ext = extension.toLowerCase();
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'pptx' || ext === 'ppt') return 'pptx';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  return 'pdf';
}

export function mapApiHistoryKind(kind: string): HistoryEventKind {
  switch (kind) {
    case 'FileAdded':
      return 'file_added';
    case 'FolderCreated':
      return 'folder_created';
    case 'FileRenamed':
      return 'file_renamed';
    case 'FileDeleted':
      return 'file_deleted';
    case 'MemberAdded':
      return 'member_added';
    case 'MemberRemoved':
      return 'member_removed';
    case 'RoleChanged':
      return 'role_changed';
    case 'UploadAccess':
      return 'upload_access';
    case 'Group':
      return 'group';
    default:
      return 'file_added';
  }
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatShortDateUk(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const day = date.getDate();
  const month = UK_MONTHS_SHORT[date.getMonth()] ?? '';
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatRelativeOrShortDateUk(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const now = new Date();
  if (isSameCalendarDay(date, now)) {
    return 'Сьогодні';
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(date, yesterday)) {
    return 'Вчора';
  }
  const day = date.getDate();
  const month = UK_MONTHS_SHORT[date.getMonth()] ?? '';
  return `${day} ${month}`;
}

export function formatHistoryDayAndTimeUk(iso: string): { day: string; time: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { day: 'Сьогодні', time: '00:00' };
  }
  const now = new Date();
  let dayLabel: string;
  if (isSameCalendarDay(date, now)) {
    dayLabel = 'Сьогодні';
  } else {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (isSameCalendarDay(date, yesterday)) {
      dayLabel = 'Вчора';
    } else {
      const d = date.getDate();
      const m = UK_MONTHS_GENITIVE[date.getMonth()] ?? '';
      dayLabel = `${d} ${m}`;
    }
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return { day: dayLabel, time: `${hours}:${minutes}` };
}

export function formatExpiresInUk(expiresAtIso: string): string {
  const expires = new Date(expiresAtIso);
  if (Number.isNaN(expires.getTime())) {
    return '3 дні';
  }
  const diffMs = expires.getTime() - Date.now();
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  if (days === 1) {
    return '1 день';
  }
  if (days >= 2 && days <= 4) {
    return `${days} дні`;
  }
  return `${days} днів`;
}

export function formatStorageBytesUk(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    const rounded = Number.isInteger(gb) ? gb.toFixed(0) : gb.toFixed(1);
    return `${rounded} ГБ`;
  }
  const mb = bytes / (1024 * 1024);
  if (mb >= 0.1) {
    return `${mb.toFixed(1)} МБ`;
  }
  if (bytes === 0) {
    return '0 МБ';
  }
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

export function mapApiUserToMember(u: ApiUserResponse): MemberUser {
  const role = mapApiRole(u.role);
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    middleName: u.middleName ?? undefined,
    email: u.email,
    role,
    groupId: u.groupId,
    canUpload: role !== 'student' ? true : u.uploadAccess,
    joinedAt: formatShortDateUk(u.joinedAt),
  };
}

export function mapApiAuthorToMember(a: ApiAuthorSummaryResponse): MemberUser {
  const role = mapApiRole(a.role);
  return {
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    middleName: a.middleName ?? undefined,
    email: '',
    role,
    canUpload: true,
    joinedAt: '',
  };
}

export function mapApiGroupToGroupInfo(g: ApiGroupInfoResponse): GroupInfo {
  const storagePercent =
    g.storageLimitBytes > 0
      ? Math.min(100, Math.round((g.storageUsedBytes / g.storageLimitBytes) * 100))
      : 0;
  return {
    id: g.id,
    name: g.name,
    faculty: g.faculty,
    createdAt: formatShortDateUk(g.createdAt),
    membersLabel: `${g.membersCount} учасників · ${g.pendingInvitationsCount} запрошення`,
    storageUsedLabel: `${formatStorageBytesUk(g.storageUsedBytes)} з ${formatStorageBytesUk(g.storageLimitBytes)}`,
    storagePercent,
  };
}

export function mapApiFolderToFolderItem(f: ApiFolderResponse): FolderItem {
  return {
    id: f.id,
    name: f.name,
    parentId: f.parentId,
    pinned: f.isPinned,
    createdBy: f.author.id,
    updatedAt: formatRelativeOrShortDateUk(f.updatedAt),
  };
}

export function mapApiFileToFileItem(f: ApiFileResponse): FileItem {
  const ext = f.extension.trim();
  const hasExtensionInName =
    ext.length > 0 && f.name.toLowerCase().endsWith(`.${ext.toLowerCase()}`);
  const displayName =
    ext.length > 0 && !hasExtensionInName ? `${f.name}.${ext}` : f.name;

  return {
    id: f.id,
    name: displayName,
    type: mapApiCategory(f.category, f.extension),
    sizeMb: Math.max(0.01, f.sizeBytes / (1024 * 1024)),
    folderId: f.folderId,
    ownerId: f.author.id,
    pinned: f.isPinned,
    uploadedAt: formatRelativeOrShortDateUk(f.updatedAt),
  };
}

export function mapApiInvitationToPending(i: ApiGroupInvitationResponse): PendingInvitation {
  return {
    id: i.id,
    email: i.email,
    invitedAt: formatRelativeOrShortDateUk(i.invitedAt),
    expiresIn: formatExpiresInUk(i.expiresAt),
  };
}

export function mapApiHistoryToItem(h: ApiHistoryEventResponse): HistoryEventItem {
  const { day, time } = formatHistoryDayAndTimeUk(h.createdAt);
  const actorParts = [h.actor.lastName, h.actor.firstName, h.actor.middleName].filter(
    Boolean
  );
  return {
    id: h.id,
    kind: mapApiHistoryKind(h.kind),
    actor: actorParts.join(' '),
    text: h.text,
    day,
    time,
  };
}

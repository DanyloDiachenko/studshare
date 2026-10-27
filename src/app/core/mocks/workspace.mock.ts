import { UiAvatarTone } from '@ui';
import { GroupInfo, MemberUser, UserRole } from '../models/workspace.models';

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Студент',
  starosta: 'Староста',
  studcurator: 'Студкуратор',
};

export const SEARCH_SUGGESTIONS: readonly string[] = [
  'конспект',
  'лабораторна',
  'екзамен',
  'звіт',
];

export const EMPTY_GROUP_INFO: GroupInfo = {
  name: '',
  faculty: '',
  createdAt: '',
  membersLabel: '0 учасників · 0 запрошень',
  storageUsedLabel: '0 МБ з 1 ГБ',
  storagePercent: 0,
};

export const EMPTY_USER: MemberUser = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'student',
  groupId: null,
  canUpload: false,
  joinedAt: '',
};

const AVATAR_TONE_ORDER: readonly UiAvatarTone[] = [
  'indigo',
  'emerald',
  'rose',
  'sky',
  'violet',
  'teal',
  'orange',
];

export function formatFileSize(sizeMb: number): string {
  if (sizeMb >= 1024) {
    return `${(sizeMb / 1024).toFixed(1)} ГБ`;
  }
  if (sizeMb < 1) {
    return `${Math.round(1024 * sizeMb)} КБ`;
  }
  return `${sizeMb % 1 === 0 ? sizeMb : sizeMb.toFixed(1)} МБ`;
}

export function formatUserFullName(user: MemberUser): string {
  const full = `${user.firstName} ${user.lastName}`.trim();
  return full || user.email || 'Користувач';
}

export function formatUserInitials(user: MemberUser): string {
  const first = user.firstName?.[0] ?? '';
  const last = user.lastName?.[0] ?? '';
  const combined = `${last}${first}`.toUpperCase();
  if (combined) {
    return combined;
  }
  return (user.email?.[0] ?? 'U').toUpperCase();
}

export function getUserAvatarTone(user: MemberUser): UiAvatarTone {
  if (!user.id) {
    return AVATAR_TONE_ORDER[0];
  }
  const hash = user.id
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_TONE_ORDER[hash % AVATAR_TONE_ORDER.length];
}

import { UiIconName } from '@ui';

export interface AppNavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: UiIconName;
}

export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { href: '/files', label: 'Файли', icon: 'folder-tree' },
  { href: '/pinned', label: 'Закріплене', icon: 'pin' },
  { href: '/search', label: 'Пошук', icon: 'search' },
  { href: '/members', label: 'Учасники', icon: 'users' },
  { href: '/history', label: 'Історія', icon: 'history' },
  { href: '/settings', label: 'Група', icon: 'settings' },
];

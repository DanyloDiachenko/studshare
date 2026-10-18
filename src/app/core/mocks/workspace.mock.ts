import { UiAvatarTone } from '@ui';
import {
  FileItem,
  FolderItem,
  GroupInfo,
  HistoryEventItem,
  MemberUser,
  PendingInvitation,
  RoleDemoPreset,
  UserRole,
} from '../models/workspace.models';

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Студент',
  starosta: 'Староста',
  studcurator: 'Студкуратор',
};

export const ROLE_DEMO_PRESETS: readonly RoleDemoPreset[] = [
  { userId: 'u1', label: 'Студкуратор' },
  { userId: 'u2', label: 'Староста' },
  { userId: 'u3', label: 'Студент' },
  { userId: 'u7', label: 'Студент без права завантаження' },
];

export const SEARCH_SUGGESTIONS: readonly string[] = [
  'конспект',
  'лабораторна',
  'екзамен',
  'звіт',
];

export const MOCK_GROUP: GroupInfo = {
  name: 'ІП-44',
  faculty: 'Факультет інформатики та обчислювальної техніки',
  createdAt: '3 вересня 2026',
  membersLabel: '7 учасників · 2 запрошення',
  storageUsedLabel: '2,4 ГБ · 18 файлів',
  storagePercent: 34,
};

export const MOCK_USERS: readonly MemberUser[] = [
  {
    id: 'u1',
    firstName: 'Ірина',
    lastName: 'Коваленко',
    middleName: 'Петрівна',
    email: 'iryna.kovalenko@lpi.edu.ua',
    role: 'studcurator',
    canUpload: true,
    joinedAt: '3 вер 2026',
  },
  {
    id: 'u2',
    firstName: 'Максим',
    lastName: 'Бондаренко',
    middleName: 'Олегович',
    email: 'maksym.bondarenko@lpi.edu.ua',
    role: 'starosta',
    canUpload: true,
    joinedAt: '4 вер 2026',
  },
  {
    id: 'u3',
    firstName: 'Олена',
    lastName: 'Шевченко',
    email: 'olena.shevchenko@lpi.edu.ua',
    role: 'student',
    canUpload: true,
    joinedAt: '4 вер 2026',
  },
  {
    id: 'u4',
    firstName: 'Андрій',
    lastName: 'Мельник',
    middleName: 'Сергійович',
    email: 'andrii.melnyk@lpi.edu.ua',
    role: 'student',
    canUpload: true,
    joinedAt: '5 вер 2026',
  },
  {
    id: 'u5',
    firstName: 'Софія',
    lastName: 'Ткаченко',
    email: 'sofiia.tkachenko@lpi.edu.ua',
    role: 'student',
    canUpload: true,
    joinedAt: '6 вер 2026',
  },
  {
    id: 'u6',
    firstName: 'Дмитро',
    lastName: 'Кравець',
    email: 'dmytro.kravets@lpi.edu.ua',
    role: 'student',
    canUpload: true,
    joinedAt: '8 вер 2026',
  },
  {
    id: 'u7',
    firstName: 'Анастасія',
    lastName: 'Олійник',
    email: 'anastasiia.oliinyk@lpi.edu.ua',
    role: 'student',
    canUpload: false,
    joinedAt: '9 вер 2026',
  },
];

export const MOCK_FOLDERS: readonly FolderItem[] = [
  {
    id: 'f1',
    name: 'Життєвий цикл розробки ПЗ',
    parentId: null,
    pinned: true,
    createdBy: 'u2',
    updatedAt: '17 жов',
  },
  {
    id: 'f1a',
    name: 'Лекції',
    parentId: 'f1',
    pinned: false,
    createdBy: 'u2',
    updatedAt: '12 жов',
  },
  {
    id: 'f1b',
    name: 'Лабораторні роботи',
    parentId: 'f1',
    pinned: true,
    createdBy: 'u3',
    updatedAt: '17 жов',
  },
  {
    id: 'f1b1',
    name: 'ЛР №1 — Специфікація вимог',
    parentId: 'f1b',
    pinned: false,
    createdBy: 'u3',
    updatedAt: '2 жов',
  },
  {
    id: 'f1b2',
    name: 'ЛР №2 — Архітектура',
    parentId: 'f1b',
    pinned: false,
    createdBy: 'u4',
    updatedAt: '17 жов',
  },
  {
    id: 'f2',
    name: 'Бази даних',
    parentId: null,
    pinned: false,
    createdBy: 'u2',
    updatedAt: '15 жов',
  },
  {
    id: 'f2a',
    name: 'Конспекти',
    parentId: 'f2',
    pinned: false,
    createdBy: 'u5',
    updatedAt: '15 жов',
  },
  {
    id: 'f2b',
    name: 'Підготовка до екзамену',
    parentId: 'f2',
    pinned: false,
    createdBy: 'u6',
    updatedAt: '10 жов',
  },
  {
    id: 'f3',
    name: 'Алгоритми та структури даних',
    parentId: null,
    pinned: false,
    createdBy: 'u4',
    updatedAt: '14 жов',
  },
  {
    id: 'f4',
    name: 'Вища математика',
    parentId: null,
    pinned: true,
    createdBy: 'u2',
    updatedAt: '9 жов',
  },
  {
    id: 'f5',
    name: 'Англійська мова',
    parentId: null,
    pinned: false,
    createdBy: 'u5',
    updatedAt: '1 жов',
  },
];

export const MOCK_FILES: readonly FileItem[] = [
  {
    id: 'a1',
    name: 'Розклад сесії 2026.pdf',
    type: 'pdf',
    sizeMb: 0.4,
    folderId: null,
    ownerId: 'u2',
    pinned: true,
    uploadedAt: '16 жов',
  },
  {
    id: 'a2',
    name: 'Методичка до курсових робіт.docx',
    type: 'docx',
    sizeMb: 1.2,
    folderId: null,
    ownerId: 'u1',
    pinned: false,
    uploadedAt: '11 жов',
  },
  {
    id: 'b1',
    name: 'Лекція 1 — Вступ до SDLC.pptx',
    type: 'pptx',
    sizeMb: 6.8,
    folderId: 'f1a',
    ownerId: 'u2',
    pinned: false,
    uploadedAt: '12 жов',
  },
  {
    id: 'b2',
    name: 'Лекція 2 — Agile та Scrum.pdf',
    type: 'pdf',
    sizeMb: 2.1,
    folderId: 'f1a',
    ownerId: 'u3',
    pinned: false,
    uploadedAt: '12 жов',
  },
  {
    id: 'b3',
    name: 'Запис лекції 3.mp4',
    type: 'video',
    sizeMb: 148,
    folderId: 'f1a',
    ownerId: 'u4',
    pinned: false,
    uploadedAt: '14 жов',
  },
  {
    id: 'c1',
    name: 'Специфікація вимог — шаблон.docx',
    type: 'docx',
    sizeMb: 0.3,
    folderId: 'f1b1',
    ownerId: 'u3',
    pinned: true,
    uploadedAt: '2 жов',
  },
  {
    id: 'c2',
    name: 'Звіт ЛР1 — ІП-44.docx',
    type: 'docx',
    sizeMb: 0.8,
    folderId: 'f1b1',
    ownerId: 'u5',
    pinned: false,
    uploadedAt: '3 жов',
  },
  {
    id: 'c3',
    name: 'UML-діаграма компонентів.png',
    type: 'image',
    sizeMb: 1.6,
    folderId: 'f1b2',
    ownerId: 'u4',
    pinned: false,
    uploadedAt: '17 жов',
  },
  {
    id: 'c4',
    name: 'Звіт ЛР2 — архітектура.docx',
    type: 'docx',
    sizeMb: 1.1,
    folderId: 'f1b2',
    ownerId: 'u4',
    pinned: false,
    uploadedAt: '17 жов',
  },
  {
    id: 'd1',
    name: 'Нормалізація. Конспект.pdf',
    type: 'pdf',
    sizeMb: 3.4,
    folderId: 'f2a',
    ownerId: 'u5',
    pinned: false,
    uploadedAt: '15 жов',
  },
  {
    id: 'd2',
    name: 'SQL — шпаргалка.pdf',
    type: 'pdf',
    sizeMb: 0.9,
    folderId: 'f2a',
    ownerId: 'u6',
    pinned: false,
    uploadedAt: '13 жов',
  },
  {
    id: 'd3',
    name: 'Фото дошки — транзакції.jpg',
    type: 'image',
    sizeMb: 2.8,
    folderId: 'f2a',
    ownerId: 'u3',
    pinned: false,
    uploadedAt: '9 жов',
  },
  {
    id: 'd4',
    name: 'Питання до екзамену.docx',
    type: 'docx',
    sizeMb: 0.2,
    folderId: 'f2b',
    ownerId: 'u6',
    pinned: false,
    uploadedAt: '10 жов',
  },
  {
    id: 'e1',
    name: 'Сортування — візуалізація.pptx',
    type: 'pptx',
    sizeMb: 9.2,
    folderId: 'f3',
    ownerId: 'u4',
    pinned: false,
    uploadedAt: '14 жов',
  },
  {
    id: 'e2',
    name: 'Графи. Конспект.pdf',
    type: 'pdf',
    sizeMb: 4,
    folderId: 'f3',
    ownerId: 'u2',
    pinned: false,
    uploadedAt: '8 жов',
  },
  {
    id: 'g1',
    name: 'Границі та ряди.pdf',
    type: 'pdf',
    sizeMb: 5.5,
    folderId: 'f4',
    ownerId: 'u3',
    pinned: false,
    uploadedAt: '9 жов',
  },
  {
    id: 'g2',
    name: 'Формули — довідник.pdf',
    type: 'pdf',
    sizeMb: 1.7,
    folderId: 'f4',
    ownerId: 'u2',
    pinned: true,
    uploadedAt: '5 жов',
  },
  {
    id: 'h1',
    name: 'Unit 4 — Vocabulary.docx',
    type: 'docx',
    sizeMb: 0.3,
    folderId: 'f5',
    ownerId: 'u5',
    pinned: false,
    uploadedAt: '1 жов',
  },
];

export const MOCK_HISTORY: readonly HistoryEventItem[] = [
  {
    id: 'h1',
    kind: 'file_added',
    actor: 'Андрій Мельник',
    text: 'завантажив(ла) «Звіт ЛР2 — архітектура.docx» у «ЛР №2 — Архітектура»',
    day: 'Сьогодні',
    time: '14:32',
  },
  {
    id: 'h2',
    kind: 'folder_created',
    actor: 'Андрій Мельник',
    text: 'створив(ла) папку «ЛР №2 — Архітектура»',
    day: 'Сьогодні',
    time: '14:20',
  },
  {
    id: 'h3',
    kind: 'file_renamed',
    actor: 'Максим Бондаренко',
    text: 'перейменував(ла) «лр1_финал.docx» → «Звіт ЛР1 — ІП-44.docx»',
    day: 'Сьогодні',
    time: '10:05',
  },
  {
    id: 'h4',
    kind: 'member_added',
    actor: 'Ірина Коваленко',
    text: 'запросила bohdan.lysenko@lpi.edu.ua до групи',
    day: 'Вчора',
    time: '18:40',
  },
  {
    id: 'h5',
    kind: 'upload_access',
    actor: 'Максим Бондаренко',
    text: 'заборонив(ла) завантаження для Анастасії Олійник',
    day: 'Вчора',
    time: '16:12',
  },
  {
    id: 'h6',
    kind: 'file_deleted',
    actor: 'Олена Шевченко',
    text: 'видалив(ла) «Копія SQL.pdf»',
    day: 'Вчора',
    time: '12:48',
  },
  {
    id: 'h7',
    kind: 'role_changed',
    actor: 'Ірина Коваленко',
    text: 'призначила Максима Бондаренка старостою',
    day: '14 жов',
    time: '09:30',
  },
  {
    id: 'h8',
    kind: 'member_removed',
    actor: 'Ірина Коваленко',
    text: 'виключила користувача oleh.pavlenko@lpi.edu.ua з групи',
    day: '12 жов',
    time: '15:02',
  },
  {
    id: 'h9',
    kind: 'file_added',
    actor: 'Софія Ткаченко',
    text: 'завантажив(ла) «Нормалізація. Конспект.pdf» у «Конспекти»',
    day: '12 жов',
    time: '11:17',
  },
  {
    id: 'h10',
    kind: 'member_added',
    actor: 'Ірина Коваленко',
    text: 'додала Дмитра Кравця до групи',
    day: '8 вер',
    time: '13:00',
  },
  {
    id: 'h11',
    kind: 'group',
    actor: 'Ірина Коваленко',
    text: 'створила групу «ІП-44»',
    day: '3 вер',
    time: '10:00',
  },
];

export const MOCK_INVITATIONS: readonly PendingInvitation[] = [
  {
    id: 'p1',
    email: 'bohdan.lysenko@lpi.edu.ua',
    invitedAt: '16 жов 2026',
    expiresIn: '1 день',
  },
  {
    id: 'p2',
    email: 'yulia.savchenko@lpi.edu.ua',
    invitedAt: '17 жов 2026',
    expiresIn: '2 дні',
  },
];

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
  return `${user.firstName} ${user.lastName}`;
}

export function formatUserInitials(user: MemberUser): string {
  return `${user.lastName[0]}${user.firstName[0]}`;
}

export function getUserAvatarTone(user: MemberUser): UiAvatarTone {
  const hash = user.id
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_TONE_ORDER[hash % AVATAR_TONE_ORDER.length];
}

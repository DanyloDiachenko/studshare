# StudShare — Frontend

Клієнтська частина закритої платформи для студентської групи **«Платформа для структурування навчальних конспектів»**
(ІП-44, НТУУ «КПІ ім. Ігоря Сікорського»). Серверна частина — у репозиторії `studshare-backend`.

## Технології

Angular 21 (standalone-компоненти, signals, lazy-маршрути) · TypeScript 5.9 · Tailwind CSS 4 · RxJS 7

## Структура

```
src/app/
  core/
    api/           HTTP-клієнти: AuthApiService, FilesApiService, WorkspaceApiService
    state/         стан на signals: RoleStateService, FilesStateService, HistoryStateService
    interceptors/  authInterceptor — додає Authorization: Bearer до запитів /api
    models/        типи інтерфейсу
    mocks/         довідкові дані та форматери
  layouts/app-shell/   каркас захищених сторінок: sidebar, topbar, mobile-nav
  screens/             landing, auth (login / register / forgot-password), files, pinned,
                       search, members, history, settings, profile
  shared/ui/           UI-kit: button, input, dialog, badge, avatar, icon, switch, file-icon, page-header
  app.routes.ts        маршрути (lazy loading)
  app.config.ts        провайдери: router, HttpClient, інтерсептор
```

Шари розділено так: **api** — тільки HTTP, **state** — стан і права (`can.canUpload`, `can.canPin`, …),
**screens** — подання. Права на клієнті керують лише відображенням; остаточна перевірка — на сервері.

## Запуск

Потрібні Node.js та запущений бекенд (за замовчуванням `http://localhost:5239`).

```bash
npm install
npm start          # http://localhost:4200
```

Запити `/api` і `/uploads` проксуються на бекенд (`proxy.conf.json`). Якщо бекенд працює на іншому порту,
змініть `target` у цьому файлі.

```bash
npm run build      # виробнича збірка у dist/
```

## Команда та ролі

| Учасник | Роль | Зона відповідальності |
|---|---|---|
| Дяченко Д.О. | Frontend | screens, core/api, core/state, shared/ui, layouts |
| Давиденко Г.А. | Backend | Репозиторій `studshare-backend` |
| Настенко А.Г. | QA | Тест-кейси, перевірка UI та сумісності браузерів |

## Робота з Git

- `main` — стабільна гілка; `develop` — інтеграційна; `feature/<модуль>-<назва>` — гілка на задачу;
- злиття лише через pull request зі схваленням іншого учасника;
- повідомлення комітів: `feat|fix|docs|test|refactor: опис (#задача)`.

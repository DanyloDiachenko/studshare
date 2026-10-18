import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'StudShare — закрита платформа для студентської групи',
    loadComponent: () =>
      import('./screens/landing/landing-screen').then((m) => m.LandingScreenComponent),
  },
  {
    path: 'login',
    title: 'Вхід · StudShare',
    loadComponent: () =>
      import('./screens/auth/login-screen/login-screen').then(
        (m) => m.LoginScreenComponent
      ),
  },
  {
    path: 'register',
    title: 'Реєстрація · StudShare',
    loadComponent: () =>
      import('./screens/auth/register-screen/register-screen').then(
        (m) => m.RegisterScreenComponent
      ),
  },
  {
    path: 'forgot-password',
    title: 'Відновлення пароля · StudShare',
    loadComponent: () =>
      import('./screens/auth/forgot-password-screen/forgot-password-screen').then(
        (m) => m.ForgotPasswordScreenComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/app-shell/app-shell').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'files',
        title: 'Файли · StudShare',
        loadComponent: () =>
          import('./screens/files/files-screen').then((m) => m.FilesScreenComponent),
      },
      {
        path: 'files/:id',
        title: 'Файли · StudShare',
        loadComponent: () =>
          import('./screens/files/files-screen').then((m) => m.FilesScreenComponent),
      },
      {
        path: 'pinned',
        title: 'Закріплене · StudShare',
        loadComponent: () =>
          import('./screens/pinned/pinned-screen').then((m) => m.PinnedScreenComponent),
      },
      {
        path: 'search',
        title: 'Пошук · StudShare',
        loadComponent: () =>
          import('./screens/search/search-screen').then((m) => m.SearchScreenComponent),
      },
      {
        path: 'members',
        title: 'Учасники · StudShare',
        loadComponent: () =>
          import('./screens/members/members-screen').then(
            (m) => m.MembersScreenComponent
          ),
      },
      {
        path: 'history',
        title: 'Історія змін · StudShare',
        loadComponent: () =>
          import('./screens/history/history-screen').then(
            (m) => m.HistoryScreenComponent
          ),
      },
      {
        path: 'settings',
        title: 'Налаштування групи · StudShare',
        loadComponent: () =>
          import('./screens/settings/settings-screen').then(
            (m) => m.SettingsScreenComponent
          ),
      },
      {
        path: 'profile',
        title: 'Профіль · StudShare',
        loadComponent: () =>
          import('./screens/profile/profile-screen').then(
            (m) => m.ProfileScreenComponent
          ),
      },
    ],
  },
];

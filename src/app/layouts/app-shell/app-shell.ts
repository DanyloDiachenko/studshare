import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar';
import { AppTopbarComponent } from './components/app-topbar/app-topbar';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    AppSidebarComponent,
    AppTopbarComponent,
    MobileNavComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './app-shell.html',
})
export class AppShellComponent {}

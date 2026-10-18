import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiAvatarComponent,
  UiBadgeComponent,
  UiBrandLogoComponent,
  UiIconComponent,
} from '@ui';
import { filter } from 'rxjs';
import { APP_NAV_ITEMS } from '../../navigation.config';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    UiBrandLogoComponent,
    UiIconComponent,
    UiAvatarComponent,
    UiBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './app-sidebar.html',
})
export class AppSidebarComponent {
  protected readonly roleState = inject(RoleStateService);
  private readonly router = inject(Router);

  protected readonly navItems = APP_NAV_ITEMS;
  protected readonly currentPath = signal<string>(this.router.url.split('?')[0]);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.currentPath.set(event.urlAfterRedirects.split('?')[0]);
      });
  }

  protected isItemActive(href: string): boolean {
    const path = this.currentPath();
    return path === href || path.startsWith(`${href}/`);
  }
}

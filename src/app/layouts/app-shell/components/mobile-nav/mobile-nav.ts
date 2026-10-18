import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UiIconComponent } from '@ui';
import { filter } from 'rxjs';
import { APP_NAV_ITEMS } from '../../navigation.config';

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './mobile-nav.html',
})
export class MobileNavComponent {
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

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiAvatarComponent,
  UiBrandLogoComponent,
  UiButtonDirective,
  UiIconComponent,
} from '@ui';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterLink,
    UiBrandLogoComponent,
    UiButtonDirective,
    UiIconComponent,
    UiAvatarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeAllMenus()',
  },
  templateUrl: './app-topbar.html',
})
export class AppTopbarComponent {
  protected readonly roleState = inject(RoleStateService);
  private readonly filesState = inject(FilesStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly profileMenuContainer =
    viewChild<ElementRef<HTMLElement>>('profileMenuContainer');

  protected readonly isProfileMenuOpen = signal(false);
  protected readonly isProfileMenuRendered = signal(false);
  protected readonly profileMenuAnimState = signal<'open' | 'closed'>('closed');

  private profileCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearProfileTimer();
    });
  }

  protected toggleProfileMenu(): void {
    if (this.isProfileMenuOpen()) {
      this.closeProfileMenu();
    } else {
      this.openProfileMenu();
    }
  }

  protected closeAllMenus(): void {
    this.closeProfileMenu();
  }

  protected handleLogout(): void {
    this.closeAllMenus();
    this.roleState.logout();
    this.filesState.clear();
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    if (
      this.isProfileMenuOpen() &&
      !this.profileMenuContainer()?.nativeElement.contains(target)
    ) {
      this.closeProfileMenu();
    }
  }

  protected onSearchSubmit(event: Event, query: string): void {
    event.preventDefault();
    const trimmed = query.trim();
    void this.router.navigate(['/search'], {
      queryParams: trimmed ? { q: trimmed } : {},
    });
  }

  private openProfileMenu(): void {
    this.clearProfileTimer();
    this.isProfileMenuOpen.set(true);
    this.isProfileMenuRendered.set(true);
    this.profileMenuAnimState.set('open');
  }

  private closeProfileMenu(): void {
    if (!this.isProfileMenuOpen() && !this.isProfileMenuRendered()) {
      return;
    }
    this.isProfileMenuOpen.set(false);
    this.profileMenuAnimState.set('closed');
    this.clearProfileTimer();
    this.profileCloseTimer = setTimeout(() => {
      this.isProfileMenuRendered.set(false);
      this.profileCloseTimer = null;
    }, 120);
  }

  private clearProfileTimer(): void {
    if (this.profileCloseTimer !== null) {
      clearTimeout(this.profileCloseTimer);
      this.profileCloseTimer = null;
    }
  }
}

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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly roleMenuContainer =
    viewChild<ElementRef<HTMLElement>>('roleMenuContainer');
  private readonly profileMenuContainer =
    viewChild<ElementRef<HTMLElement>>('profileMenuContainer');

  protected readonly isRoleMenuOpen = signal(false);
  protected readonly isRoleMenuRendered = signal(false);
  protected readonly roleMenuAnimState = signal<'open' | 'closed'>('closed');

  protected readonly isProfileMenuOpen = signal(false);
  protected readonly isProfileMenuRendered = signal(false);
  protected readonly profileMenuAnimState = signal<'open' | 'closed'>('closed');

  private roleCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private profileCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearRoleTimer();
      this.clearProfileTimer();
    });
  }

  protected toggleRoleMenu(): void {
    if (this.isRoleMenuOpen()) {
      this.closeRoleMenu();
    } else {
      this.closeProfileMenu();
      this.openRoleMenu();
    }
  }

  protected toggleProfileMenu(): void {
    if (this.isProfileMenuOpen()) {
      this.closeProfileMenu();
    } else {
      this.closeRoleMenu();
      this.openProfileMenu();
    }
  }

  protected selectRoleUser(userId: string): void {
    this.roleState.setUserId(userId);
    this.closeRoleMenu();
  }

  protected closeAllMenus(): void {
    this.closeRoleMenu();
    this.closeProfileMenu();
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    if (
      this.isRoleMenuOpen() &&
      !this.roleMenuContainer()?.nativeElement.contains(target)
    ) {
      this.closeRoleMenu();
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

  private openRoleMenu(): void {
    this.clearRoleTimer();
    this.isRoleMenuOpen.set(true);
    this.isRoleMenuRendered.set(true);
    this.roleMenuAnimState.set('open');
  }

  private closeRoleMenu(): void {
    if (!this.isRoleMenuOpen() && !this.isRoleMenuRendered()) {
      return;
    }
    this.isRoleMenuOpen.set(false);
    this.roleMenuAnimState.set('closed');
    this.clearRoleTimer();
    this.roleCloseTimer = setTimeout(() => {
      this.isRoleMenuRendered.set(false);
      this.roleCloseTimer = null;
    }, 120);
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

  private clearRoleTimer(): void {
    if (this.roleCloseTimer !== null) {
      clearTimeout(this.roleCloseTimer);
      this.roleCloseTimer = null;
    }
  }

  private clearProfileTimer(): void {
    if (this.profileCloseTimer !== null) {
      clearTimeout(this.profileCloseTimer);
      this.profileCloseTimer = null;
    }
  }
}

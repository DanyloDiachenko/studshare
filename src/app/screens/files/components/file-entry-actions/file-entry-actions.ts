import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileSystemEntry } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import { UiButtonDirective, UiIconComponent } from '@ui';

interface MenuPosition {
  readonly top?: string;
  readonly bottom?: string;
  readonly right: string;
  readonly side: 'top' | 'bottom';
  readonly originClass: string;
}

@Component({
  selector: 'app-file-entry-actions',
  imports: [RouterLink, UiButtonDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
    '(window:scroll)': 'onWindowScrollOrResize()',
    '(window:resize)': 'onWindowScrollOrResize()',
  },
  templateUrl: './file-entry-actions.html',
})
export class FileEntryActionsComponent {
  protected readonly roleState = inject(RoleStateService);
  private readonly filesState = inject(FilesStateService);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private readonly triggerBtn =
    viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  readonly entry = input.required<FileSystemEntry>();
  readonly renameRequested = output<FileSystemEntry>();
  readonly togglePinRequested = output<FileSystemEntry>();
  readonly deleteRequested = output<FileSystemEntry>();

  protected readonly isOpen = signal(false);
  protected readonly isRendered = signal(false);
  protected readonly animState = signal<'open' | 'closed'>('closed');
  protected readonly menuPos = signal<MenuPosition>({
    top: '0px',
    right: '0px',
    side: 'bottom',
    originClass: 'origin-top-right',
  });

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly isOwner = computed(
    () => this.entry().ownerId === this.roleState.user().id
  );

  protected readonly canRename = computed(
    () => this.isOwner() || this.roleState.can().canRenameAny
  );

  protected readonly canDelete = computed(
    () => this.isOwner() || this.roleState.can().canDeleteAny
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearCloseTimer();
    });
  }

  protected toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  protected openMenu(): void {
    this.updatePosition();
    this.clearCloseTimer();
    this.isOpen.set(true);
    this.isRendered.set(true);
    this.animState.set('open');
  }

  protected closeMenu(): void {
    if (!this.isOpen() && !this.isRendered()) {
      return;
    }
    this.isOpen.set(false);
    this.animState.set('closed');
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.isRendered.set(false);
      this.closeTimer = null;
    }, 120);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.hostRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  protected onWindowScrollOrResize(): void {
    if (this.isOpen()) {
      this.updatePosition();
    }
  }

  protected handleRename(): void {
    this.closeMenu();
    this.renameRequested.emit(this.entry());
  }

  protected handleTogglePin(): void {
    this.closeMenu();
    this.togglePinRequested.emit(this.entry());
  }

  protected handleDelete(): void {
    this.closeMenu();
    this.deleteRequested.emit(this.entry());
  }

  protected handleDownload(): void {
    const current = this.entry();
    this.closeMenu();
    if (current.kind === 'file') {
      void this.filesState.downloadFile(current.id, current.name);
    }
  }

  private updatePosition(): void {
    const btn = this.triggerBtn()?.nativeElement;
    if (!btn || typeof window === 'undefined') {
      return;
    }
    const rect = btn.getBoundingClientRect();
    const right = `${Math.max(8, window.innerWidth - rect.right)}px`;
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedHeight = 176;

    if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
      this.menuPos.set({
        bottom: `${window.innerHeight - rect.top + 4}px`,
        right,
        side: 'top',
        originClass: 'origin-bottom-right',
      });
    } else {
      this.menuPos.set({
        top: `${rect.bottom + 4}px`,
        right,
        side: 'bottom',
        originClass: 'origin-top-right',
      });
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}

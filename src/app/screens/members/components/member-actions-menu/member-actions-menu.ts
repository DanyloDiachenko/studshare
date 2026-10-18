import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MemberRowView } from '@core/models/workspace.models';
import { UiButtonDirective, UiIconComponent } from '@ui';

export type MemberActionType = 'edit' | 'starosta' | 'remove';

export interface MemberActionEvent {
  readonly type: MemberActionType;
  readonly user: MemberRowView;
}

interface MenuPosition {
  readonly top?: string;
  readonly bottom?: string;
  readonly right: string;
  readonly side: 'top' | 'bottom';
  readonly originClass: string;
}

@Component({
  selector: 'app-member-actions-menu',
  imports: [UiButtonDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative inline-block text-left',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
    '(window:scroll)': 'onWindowScrollOrResize()',
    '(window:resize)': 'onWindowScrollOrResize()',
  },
  templateUrl: './member-actions-menu.html',
})
export class MemberActionsMenuComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private readonly triggerBtn =
    viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  readonly user = input.required<MemberRowView>();
  readonly actionSelected = output<MemberActionEvent>();

  protected readonly open = signal(false);
  protected readonly isRendered = signal(false);
  protected readonly animState = signal<'open' | 'closed'>('closed');
  protected readonly menuPos = signal<MenuPosition>({
    top: '0px',
    right: '0px',
    side: 'bottom',
    originClass: 'origin-top-right',
  });

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearCloseTimer();
    });
  }

  protected isStudcurator(): boolean {
    return this.user().role === 'studcurator';
  }

  protected toggleMenu(): void {
    if (this.isStudcurator()) {
      return;
    }
    if (this.open()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  protected openMenu(): void {
    this.updatePosition();
    this.clearCloseTimer();
    this.open.set(true);
    this.isRendered.set(true);
    this.animState.set('open');
  }

  protected closeMenu(): void {
    if (!this.open() && !this.isRendered()) {
      return;
    }
    this.open.set(false);
    this.animState.set('closed');
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.isRendered.set(false);
      this.closeTimer = null;
    }, 120);
  }

  protected emitAction(type: MemberActionType): void {
    this.closeMenu();
    this.actionSelected.emit({ type, user: this.user() });
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  protected onWindowScrollOrResize(): void {
    if (this.open()) {
      this.updatePosition();
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
    const estimatedHeight = 148;

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

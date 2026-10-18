import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { UiButtonDirective } from '../button/ui-button.directive';
import { UiIconComponent } from '../icon/ui-icon';

@Component({
  selector: 'ui-dialog',
  imports: [UiButtonDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:keydown.escape)': 'onEscape()',
  },
  templateUrl: './ui-dialog.html',
})
export class UiDialogComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly open = input<boolean>(false);
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly maxWidthClass = input<string>('sm:max-w-sm');
  readonly showCloseButton = input<boolean>(true);
  readonly openChange = output<boolean>();

  protected readonly isRendered = signal(false);
  protected readonly animState = signal<'open' | 'closed'>('closed');
  protected readonly renderedTitle = signal('');
  protected readonly renderedDescription = signal('');

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly popupClass = computed(
    () =>
      `fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-150 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 ${this.maxWidthClass()}`
  );

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const currentTitle = this.title();
      const currentDesc = this.description();

      if (isOpen) {
        this.renderedTitle.set(currentTitle);
        this.renderedDescription.set(currentDesc);
        this.clearCloseTimer();
        this.isRendered.set(true);
        this.animState.set('open');
      } else if (this.isRendered()) {
        this.animState.set('closed');
        this.clearCloseTimer();
        this.closeTimer = setTimeout(() => {
          this.isRendered.set(false);
          this.closeTimer = null;
        }, 130);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearCloseTimer();
    });
  }

  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  protected close(): void {
    this.openChange.emit(false);
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}

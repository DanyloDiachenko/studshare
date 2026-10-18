import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type UiSwitchSize = 'default' | 'sm';

@Component({
  selector: 'ui-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-switch.html',
})
export class UiSwitchComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly size = input<UiSwitchSize>('default');
  readonly ariaLabel = input<string>('');
  readonly switchId = input<string>('');
  readonly inputId = input<string>('');

  readonly checkedChange = output<boolean>();

  protected onToggle(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.checkedChange.emit(!this.checked());
  }

  protected onKeyToggle(event: Event): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.checkedChange.emit(!this.checked());
  }

  protected onInputChange(event: Event): void {
    if (this.disabled()) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}

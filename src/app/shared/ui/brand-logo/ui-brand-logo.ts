import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIconComponent } from '../icon/ui-icon';

export type UiBrandLogoVariant = 'default' | 'sidebar';

@Component({
  selector: 'ui-brand-logo',
  imports: [RouterLink, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-brand-logo.html',
})
export class UiBrandLogoComponent {
  readonly link = input<string>('/');
  readonly variant = input<UiBrandLogoVariant>('default');

  protected readonly iconBoxClass = computed(() =>
    this.variant() === 'sidebar'
      ? 'grid size-8 place-items-center rounded-lg bg-pin text-pin-foreground'
      : 'grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground'
  );

  protected readonly labelClass = computed(() =>
    this.variant() === 'sidebar' ? 'text-base text-white' : 'text-base text-foreground'
  );
}

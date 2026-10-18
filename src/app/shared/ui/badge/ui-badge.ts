import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiIconComponent, UiIconName } from '../icon/ui-icon';

export type UiBadgeVariant =
  | 'hero-pill'
  | 'curator'
  | 'studcurator'
  | 'headman'
  | 'starosta'
  | 'student';

@Component({
  selector: 'ui-badge',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-badge.html',
})
export class UiBadgeComponent {
  readonly variant = input<UiBadgeVariant>('hero-pill');
  readonly customClass = input<string>('');

  protected readonly roleIcon = computed<UiIconName | null>(() => {
    switch (this.variant()) {
      case 'curator':
      case 'studcurator':
        return 'crown';
      case 'headman':
      case 'starosta':
        return 'star';
      case 'student':
        return 'graduation-cap';
      default:
        return null;
    }
  });

  protected readonly badgeClass = computed(() => {
    if (this.variant() === 'hero-pill') {
      return 'inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground';
    }
    const extra = this.customClass();
    const sizing = extra ? extra : 'px-2 py-0.5 text-xs';
    const base = 'inline-flex items-center gap-1 rounded-full font-medium';
    let tone = 'bg-secondary text-secondary-foreground';
    switch (this.variant()) {
      case 'curator':
      case 'studcurator':
        tone = 'bg-primary/10 text-primary';
        break;
      case 'headman':
      case 'starosta':
        tone = 'bg-amber-100 text-amber-900';
        break;
    }
    return `${base} ${tone} ${sizing}`;
  });
}

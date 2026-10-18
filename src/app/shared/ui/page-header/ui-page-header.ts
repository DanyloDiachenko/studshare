import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './ui-page-header.html',
})
export class UiPageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly customClass = input<string>('');

  protected readonly headerClass = computed(() => {
    const base = 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between';
    const extra = this.customClass();
    return extra ? `${base} ${extra}` : base;
  });
}

import { computed, Directive, input } from '@angular/core';

const BASE_LABEL_CLASSES =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

@Directive({
  selector: 'label[uiLabel]',
  host: {
    'data-slot': 'label',
    '[class]': 'computedClass()',
  },
})
export class UiLabelDirective {
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly computedClass = computed(() => {
    const custom = this.userClass();
    return custom ? `${BASE_LABEL_CLASSES} ${custom}` : BASE_LABEL_CLASSES;
  });
}

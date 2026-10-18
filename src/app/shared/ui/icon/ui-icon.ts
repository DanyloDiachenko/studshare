import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type UiIconName =
  | 'book-marked'
  | 'arrow-right'
  | 'arrow-left'
  | 'folder'
  | 'pin'
  | 'pin-off'
  | 'file-text'
  | 'file-image'
  | 'file-play'
  | 'presentation'
  | 'folder-tree'
  | 'shield-check'
  | 'search'
  | 'search-x'
  | 'users'
  | 'history'
  | 'settings'
  | 'crown'
  | 'star'
  | 'graduation-cap'
  | 'eye'
  | 'house'
  | 'chevron-right'
  | 'folder-plus'
  | 'upload'
  | 'cloud-upload'
  | 'folder-open'
  | 'download'
  | 'list'
  | 'layout-grid'
  | 'ellipsis-vertical'
  | 'user-plus'
  | 'user-round'
  | 'log-out'
  | 'pencil'
  | 'trash-2'
  | 'lock'
  | 'x'
  | 'check'
  | 'clock'
  | 'mail'
  | 'rotate-cw'
  | 'user-minus'
  | 'file-plus-corner'
  | 'file-pen'
  | 'file-x-corner'
  | 'sparkles';

@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-icon.html',
})
export class UiIconComponent {
  readonly name = input.required<UiIconName>();
  readonly svgClass = input<string>('');
  readonly ariaLabel = input<string>('');

  protected readonly computedClass = computed(() => {
    const base = `lucide lucide-${this.name()}`;
    const custom = this.svgClass();
    return custom ? `${base} ${custom}` : base;
  });
}

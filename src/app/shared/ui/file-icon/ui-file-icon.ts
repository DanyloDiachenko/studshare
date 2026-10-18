import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiIconComponent, UiIconName } from '../icon/ui-icon';

export type UiFileKind =
  | 'folder'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'presentation'
  | 'pptx'
  | 'image'
  | 'video';
export type UiFileIconSize = 'md' | 'lg';

const KIND_STYLES: Record<UiFileKind, { bg: string; icon: UiIconName }> = {
  folder: { bg: 'bg-accent text-primary', icon: 'folder' },
  pdf: { bg: 'bg-red-50 text-red-600', icon: 'file-text' },
  doc: { bg: 'bg-blue-50 text-blue-600', icon: 'file-text' },
  docx: { bg: 'bg-blue-50 text-blue-600', icon: 'file-text' },
  presentation: { bg: 'bg-orange-50 text-orange-600', icon: 'presentation' },
  pptx: { bg: 'bg-orange-50 text-orange-600', icon: 'presentation' },
  image: { bg: 'bg-emerald-50 text-emerald-600', icon: 'file-image' },
  video: { bg: 'bg-violet-50 text-violet-600', icon: 'file-play' },
};

const SIZE_STYLES: Record<UiFileIconSize, string> = {
  md: 'size-9',
  lg: 'size-11',
};

@Component({
  selector: 'ui-file-icon',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-file-icon.html',
})
export class UiFileIconComponent {
  readonly kind = input.required<UiFileKind>();
  readonly size = input<UiFileIconSize>('md');
  readonly customClass = input<string>('');

  protected readonly iconName = computed(() => KIND_STYLES[this.kind()].icon);

  protected readonly boxClass = computed(() => {
    const base = `grid shrink-0 place-items-center rounded-lg ${SIZE_STYLES[this.size()]} ${KIND_STYLES[this.kind()].bg}`;
    const extra = this.customClass();
    return extra ? `${base} ${extra}` : base;
  });
}

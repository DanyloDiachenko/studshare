import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type UiAvatarSize = 'xs' | '2xs' | 'sm' | 'md' | 'default' | 'lg';
export type UiAvatarTone = 'teal' | 'orange' | 'indigo' | 'emerald' | 'rose' | 'sky' | 'violet';

const SIZE_CLASSES: Record<UiAvatarSize, string> = {
  xs: 'size-4',
  '2xs': 'size-5',
  sm: 'size-6',
  md: 'size-8',
  default: 'size-9',
  lg: 'size-10',
};

const TONE_CLASSES: Record<UiAvatarTone, string> = {
  teal: 'bg-teal-100 text-teal-800',
  orange: 'bg-orange-100 text-orange-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  rose: 'bg-rose-100 text-rose-800',
  sky: 'bg-sky-100 text-sky-800',
  violet: 'bg-violet-100 text-violet-800',
};

@Component({
  selector: 'ui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './ui-avatar.html',
})
export class UiAvatarComponent {
  readonly initials = input.required<string>();
  readonly size = input<UiAvatarSize>('default');
  readonly tone = input<UiAvatarTone>('teal');
  readonly customClass = input<string>('');

  protected readonly outerClass = computed(() => {
    const extra = this.customClass();
    const hasCustomSize = /\bsize-\S+/.test(extra);
    const sizeClass = hasCustomSize ? '' : SIZE_CLASSES[this.size()];
    const base = `group/avatar relative flex shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten`;
    return [base, sizeClass, extra].filter(Boolean).join(' ');
  });

  protected readonly fallbackClass = computed(
    () =>
      `flex size-full items-center justify-center rounded-full text-xs font-semibold ${TONE_CLASSES[this.tone()]}`
  );
}

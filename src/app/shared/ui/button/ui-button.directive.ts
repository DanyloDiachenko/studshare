import { computed, Directive, input } from '@angular/core';

export type UiButtonVariant = 'default' | 'ghost' | 'outline' | 'pin' | 'secondary' | 'destructive';
export type UiButtonSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

const BASE_CLASSES =
  "group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const VARIANT_CLASSES: Record<UiButtonVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  ghost:
    'border-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
  outline:
    'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
  pin: 'border-transparent bg-pin text-pin-foreground hover:bg-pin/90',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
};

const SIZE_CLASSES: Record<UiButtonSize, string> = {
  default:
    "rounded-lg text-sm h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
  xs: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  md: "rounded-lg text-sm gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 h-11 [&_svg:not([class*='size-'])]:size-4",
  lg: "rounded-lg text-sm gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 h-12 px-6 [&_svg:not([class*='size-'])]:size-4",
  icon: "rounded-lg text-sm size-8 [&_svg:not([class*='size-'])]:size-4",
  'icon-sm':
    "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg text-sm [&_svg:not([class*='size-'])]:size-4",
};

@Directive({
  selector: 'button[uiButton], a[uiButton]',
  host: {
    'data-slot': 'button',
    '[class]': 'computedClass()',
  },
})
export class UiButtonDirective {
  readonly variant = input<UiButtonVariant>('default');
  readonly size = input<UiButtonSize>('default');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly computedClass = computed(() => {
    const parts = [
      BASE_CLASSES,
      VARIANT_CLASSES[this.variant()],
      SIZE_CLASSES[this.size()],
      this.userClass(),
    ];
    return parts.filter(Boolean).join(' ');
  });
}

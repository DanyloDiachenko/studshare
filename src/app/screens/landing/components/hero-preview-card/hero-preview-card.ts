import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiFileIconComponent, UiFileKind, UiIconComponent } from '@ui';

export interface HeroPreviewItem {
  readonly kind: UiFileKind;
  readonly title: string;
  readonly pinned?: boolean;
  readonly meta: string;
}

@Component({
  selector: 'app-hero-preview-card',
  imports: [UiFileIconComponent, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './hero-preview-card.html',
})
export class HeroPreviewCardComponent {
  protected readonly previewItems: readonly HeroPreviewItem[] = [
    {
      kind: 'folder',
      title: 'Лекції',
      pinned: true,
      meta: '12 елем.',
    },
    {
      kind: 'folder',
      title: 'ЛР №2 — Архітектура',
      meta: '4 елем.',
    },
    {
      kind: 'pdf',
      title: 'Методичка до ЛР.pdf',
      pinned: true,
      meta: '2,4 МБ',
    },
    {
      kind: 'doc',
      title: 'Звіт ЛР1 — ІП-44.docx',
      meta: '860 КБ',
    },
    {
      kind: 'presentation',
      title: 'Презентація SQL.pptx',
      meta: '6,1 МБ',
    },
  ];
}

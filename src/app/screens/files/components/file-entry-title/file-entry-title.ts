import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileSystemEntry } from '@core/models/workspace.models';
import { UiIconComponent } from '@ui';

@Component({
  selector: 'app-file-entry-title',
  imports: [RouterLink, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './file-entry-title.html',
})
export class FileEntryTitleComponent {
  readonly entry = input.required<FileSystemEntry>();
  readonly customClass = input<string>('');

  protected readonly textClass = computed(() => {
    const base = 'truncate font-medium';
    const extra = this.customClass();
    return extra ? `${base} ${extra}` : base;
  });
}

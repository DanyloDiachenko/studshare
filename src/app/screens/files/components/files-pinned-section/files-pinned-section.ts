import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FileSystemEntry } from '@core/models/workspace.models';
import { UiFileIconComponent, UiIconComponent } from '@ui';
import { FileEntryTitleComponent } from '../file-entry-title/file-entry-title';

@Component({
  selector: 'app-files-pinned-section',
  imports: [UiIconComponent, UiFileIconComponent, FileEntryTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './files-pinned-section.html',
})
export class FilesPinnedSectionComponent {
  readonly entries = input.required<readonly FileSystemEntry[]>();
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiIconComponent } from '@ui';

@Component({
  selector: 'app-files-empty-state',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './files-empty-state.html',
})
export class FilesEmptyStateComponent {}

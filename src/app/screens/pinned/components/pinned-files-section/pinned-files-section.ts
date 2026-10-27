import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { PinnedFileView } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiFileIconComponent,
  UiIconComponent,
} from '@ui';

@Component({
  selector: 'app-pinned-files-section',
  imports: [UiFileIconComponent, UiButtonDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './pinned-files-section.html',
})
export class PinnedFilesSectionComponent {
  protected readonly roleState = inject(RoleStateService);
  protected readonly filesState = inject(FilesStateService);

  readonly files = input.required<readonly PinnedFileView[]>();
  readonly unpinRequested = output<string>();

  protected downloadFile(file: PinnedFileView): void {
    void this.filesState.downloadFile(file.id, file.name);
  }
}

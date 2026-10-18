import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { PinnedFileView } from '@core/models/workspace.models';
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

  readonly files = input.required<readonly PinnedFileView[]>();
  readonly unpinRequested = output<string>();
}

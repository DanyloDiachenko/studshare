import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  formatUserFullName,
  formatUserInitials,
  getUserAvatarTone,
} from '@core/mocks/workspace.mock';
import { FileSystemEntry, MemberUser } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import { UiAvatarComponent, UiFileIconComponent } from '@ui';
import { FileEntryActionsComponent } from '../file-entry-actions/file-entry-actions';
import { FileEntryTitleComponent } from '../file-entry-title/file-entry-title';

@Component({
  selector: 'app-files-grid-view',
  imports: [
    UiFileIconComponent,
    UiAvatarComponent,
    FileEntryTitleComponent,
    FileEntryActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './files-grid-view.html',
})
export class FilesGridViewComponent {
  protected readonly roleState = inject(RoleStateService);

  readonly entries = input.required<readonly FileSystemEntry[]>();
  readonly renameRequested = output<FileSystemEntry>();
  readonly togglePinRequested = output<FileSystemEntry>();
  readonly deleteRequested = output<FileSystemEntry>();

  protected getInitials(user: MemberUser) {
    return formatUserInitials(user);
  }

  protected getTone(user: MemberUser) {
    return getUserAvatarTone(user);
  }

  protected getFullName(user: MemberUser) {
    return formatUserFullName(user);
  }
}

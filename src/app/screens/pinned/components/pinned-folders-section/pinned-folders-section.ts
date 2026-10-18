import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  formatUserFullName,
  formatUserInitials,
  getUserAvatarTone,
} from '@core/mocks/workspace.mock';
import { MemberUser, PinnedFolderView } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiAvatarComponent,
  UiButtonDirective,
  UiFileIconComponent,
  UiIconComponent,
} from '@ui';

@Component({
  selector: 'app-pinned-folders-section',
  imports: [
    RouterLink,
    UiFileIconComponent,
    UiAvatarComponent,
    UiButtonDirective,
    UiIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './pinned-folders-section.html',
})
export class PinnedFoldersSectionComponent {
  protected readonly roleState = inject(RoleStateService);

  readonly folders = input.required<readonly PinnedFolderView[]>();
  readonly unpinRequested = output<string>();

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

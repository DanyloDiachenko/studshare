import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MemberRowView, RolePermissions } from '@core/models/workspace.models';
import { UiAvatarComponent, UiBadgeComponent, UiSwitchComponent } from '@ui';
import {
  MemberActionEvent,
  MemberActionsMenuComponent,
} from '../member-actions-menu/member-actions-menu';

export interface ToggleMemberUploadEvent {
  readonly userId: string;
  readonly canUpload: boolean;
}

@Component({
  selector: 'app-members-active-table',
  imports: [
    UiAvatarComponent,
    UiBadgeComponent,
    UiSwitchComponent,
    MemberActionsMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './members-active-table.html',
})
export class MembersActiveTableComponent {
  readonly members = input.required<readonly MemberRowView[]>();
  readonly permissions = input.required<RolePermissions>();

  readonly toggleUpload = output<ToggleMemberUploadEvent>();
  readonly memberAction = output<MemberActionEvent>();

  protected onUploadToggle(userId: string, canUpload: boolean): void {
    this.toggleUpload.emit({ userId, canUpload });
  }
}

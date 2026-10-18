import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PendingInvitation } from '@core/models/workspace.models';
import { UiButtonDirective, UiIconComponent } from '@ui';

@Component({
  selector: 'app-members-pending-list',
  imports: [UiButtonDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './members-pending-list.html',
})
export class MembersPendingListComponent {
  readonly invitations = input.required<readonly PendingInvitation[]>();
  readonly canManageMembers = input.required<boolean>();

  readonly resendInvitation = output<string>();
  readonly cancelInvitation = output<string>();
}

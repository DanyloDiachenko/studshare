import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemberUser } from '@core/models/workspace.models';
import {
  UiAvatarComponent,
  UiAvatarTone,
  UiBadgeComponent,
  UiButtonDirective,
  UiIconComponent,
} from '@ui';

@Component({
  selector: 'app-profile-summary-card',
  imports: [
    RouterLink,
    UiAvatarComponent,
    UiBadgeComponent,
    UiButtonDirective,
    UiIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './profile-summary-card.html',
})
export class ProfileSummaryCardComponent {
  readonly user = input.required<MemberUser>();
  readonly userFullName = input.required<string>();
  readonly userInitials = input.required<string>();
  readonly userAvatarTone = input.required<UiAvatarTone>();
  readonly userRoleLabel = input.required<string>();
  readonly groupName = input.required<string>();
}

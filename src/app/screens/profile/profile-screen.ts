import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChangePasswordPayload, UpdateProfilePayload } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import { UiPageHeaderComponent } from '@ui';
import { ProfilePasswordCardComponent } from './components/profile-password-card/profile-password-card';
import { ProfilePersonalDataCardComponent } from './components/profile-personal-data-card/profile-personal-data-card';
import { ProfileSummaryCardComponent } from './components/profile-summary-card/profile-summary-card';

@Component({
  selector: 'app-profile-screen',
  imports: [
    UiPageHeaderComponent,
    ProfileSummaryCardComponent,
    ProfilePersonalDataCardComponent,
    ProfilePasswordCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-screen.html',
})
export class ProfileScreenComponent {
  private readonly roleState = inject(RoleStateService);

  protected readonly user = this.roleState.user;
  protected readonly userFullName = this.roleState.userFullName;
  protected readonly userInitials = this.roleState.userInitials;
  protected readonly userAvatarTone = this.roleState.userAvatarTone;
  protected readonly userRoleLabel = this.roleState.userRoleLabel;
  protected readonly group = this.roleState.group;

  protected onSavePersonalData(payload: Omit<UpdateProfilePayload, 'id'>): void {
    void this.roleState.updateCurrentUserProfile(payload);
  }

  protected onChangePassword(payload: ChangePasswordPayload): void {
    void this.roleState.changePassword(payload);
  }
}

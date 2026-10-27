import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordPayload, UpdateProfilePayload } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiDialogComponent,
  UiInputDirective,
  UiLabelDirective,
  UiPageHeaderComponent,
} from '@ui';
import { ProfilePasswordCardComponent } from './components/profile-password-card/profile-password-card';
import { ProfilePersonalDataCardComponent } from './components/profile-personal-data-card/profile-personal-data-card';
import { ProfileSummaryCardComponent } from './components/profile-summary-card/profile-summary-card';

@Component({
  selector: 'app-profile-screen',
  imports: [
    FormsModule,
    UiPageHeaderComponent,
    UiDialogComponent,
    UiButtonDirective,
    UiInputDirective,
    UiLabelDirective,
    ProfileSummaryCardComponent,
    ProfilePersonalDataCardComponent,
    ProfilePasswordCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-screen.html',
})
export class ProfileScreenComponent {
  private readonly roleState = inject(RoleStateService);
  private readonly router = inject(Router);

  protected readonly user = this.roleState.user;
  protected readonly userFullName = this.roleState.userFullName;
  protected readonly userInitials = this.roleState.userInitials;
  protected readonly userAvatarTone = this.roleState.userAvatarTone;
  protected readonly userRoleLabel = this.roleState.userRoleLabel;
  protected readonly group = this.roleState.group;
  protected readonly hasGroup = this.roleState.hasGroup;

  protected readonly deleteDialogOpen = signal(false);
  protected readonly deletePassword = signal('');
  protected readonly deleteError = signal('');
  protected readonly isDeleting = signal(false);

  protected onSavePersonalData(payload: Omit<UpdateProfilePayload, 'id'>): void {
    void this.roleState.updateCurrentUserProfile(payload);
  }

  protected onChangePassword(payload: ChangePasswordPayload): void {
    void this.roleState.changePassword(payload);
  }

  protected openDeleteDialog(): void {
    this.deletePassword.set('');
    this.deleteError.set('');
    this.deleteDialogOpen.set(true);
  }

  protected closeDeleteDialog(): void {
    this.deletePassword.set('');
    this.deleteError.set('');
    this.deleteDialogOpen.set(false);
  }

  protected async confirmDeleteAccount(): Promise<void> {
    const password = this.deletePassword().trim();
    if (!password) {
      this.deleteError.set('Введіть пароль для підтвердження.');
      return;
    }

    this.deleteError.set('');
    this.isDeleting.set(true);

    try {
      await this.roleState.deleteAccount({ password });
      void this.router.navigate(['/login']);
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 409) {
          this.deleteError.set(
            err.error?.error ?? 'Спочатку видаліть або передайте права на групу.'
          );
        } else {
          this.deleteError.set(
            err.error?.error ?? err.error?.message ?? 'Не вдалося видалити акаунт.'
          );
        }
      } else {
        this.deleteError.set('Не вдалося видалити акаунт.');
      }
    } finally {
      this.isDeleting.set(false);
    }
  }
}

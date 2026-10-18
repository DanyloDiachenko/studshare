import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangePasswordPayload } from '@core/models/workspace.models';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';

@Component({
  selector: 'app-profile-password-card',
  imports: [FormsModule, UiButtonDirective, UiInputDirective, UiLabelDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './profile-password-card.html',
})
export class ProfilePasswordCardComponent {
  readonly changePassword = output<ChangePasswordPayload>();

  protected readonly currentPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly repeatPassword = signal('');

  protected onSubmit(): void {
    this.changePassword.emit({
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword(),
      repeatPassword: this.repeatPassword(),
    });
    this.currentPassword.set('');
    this.newPassword.set('');
    this.repeatPassword.set('');
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberUser, UpdateProfilePayload } from '@core/models/workspace.models';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';

@Component({
  selector: 'app-profile-personal-data-card',
  imports: [FormsModule, UiButtonDirective, UiInputDirective, UiLabelDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './profile-personal-data-card.html',
})
export class ProfilePersonalDataCardComponent {
  readonly user = input.required<MemberUser>();

  readonly savePersonalData = output<Omit<UpdateProfilePayload, 'id'>>();

  protected readonly lastName = signal('');
  protected readonly firstName = signal('');
  protected readonly middleName = signal('');
  protected readonly email = signal('');

  constructor() {
    effect(() => {
      const current = this.user();
      this.lastName.set(current.lastName);
      this.firstName.set(current.firstName);
      this.middleName.set(current.middleName ?? '');
      this.email.set(current.email);
    });
  }

  protected onSave(): void {
    this.savePersonalData.emit({
      lastName: this.lastName(),
      firstName: this.firstName(),
      middleName: this.middleName(),
      email: this.email(),
    });
  }
}

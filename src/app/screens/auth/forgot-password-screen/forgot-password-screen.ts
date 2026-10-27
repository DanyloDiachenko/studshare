import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '@core/api/auth-api.service';
import { UiButtonDirective, UiIconComponent, UiInputDirective, UiLabelDirective } from '@ui';
import { AuthShellComponent } from '../components/auth-shell/auth-shell';

@Component({
  selector: 'app-forgot-password-screen',
  imports: [
    FormsModule,
    RouterLink,
    UiButtonDirective,
    UiIconComponent,
    UiInputDirective,
    UiLabelDirective,
    AuthShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password-screen.html',
})
export class ForgotPasswordScreenComponent {
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);

  protected readonly email = signal('');
  protected readonly code = signal('');
  protected readonly newPassword = signal('');
  protected readonly codeSent = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      if (!this.codeSent()) {
        await this.authApi.forgotPassword({ email: this.email().trim() });
        this.codeSent.set(true);
      } else {
        await this.authApi.resetPassword({
          email: this.email().trim(),
          code: this.code().trim(),
          newPassword: this.newPassword(),
        });
        void this.router.navigateByUrl('/login');
      }
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.errorMessage.set(
          err.error?.error ?? 'Не вдалося відновити пароль.'
        );
      } else {
        this.errorMessage.set('Не вдалося відновити пароль.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

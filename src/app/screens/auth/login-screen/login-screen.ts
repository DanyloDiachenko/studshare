import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '@core/api/auth-api.service';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';
import { AuthShellComponent } from '../components/auth-shell/auth-shell';

@Component({
  selector: 'app-login-screen',
  imports: [
    FormsModule,
    RouterLink,
    UiButtonDirective,
    UiInputDirective,
    UiLabelDirective,
    AuthShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-screen.html',
})
export class LoginScreenComponent {
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly roleState = inject(RoleStateService);
  private readonly filesState = inject(FilesStateService);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      const res = await this.authApi.login({
        email: this.email().trim(),
        password: this.password(),
      });
      await Promise.allSettled([
        this.roleState.applyAuthenticatedUser(res.user),
        this.filesState.loadSnapshot(),
      ]);
      void this.router.navigateByUrl('/files');
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.errorMessage.set(
          err.error?.error ?? 'Невірний email або пароль.'
        );
      } else {
        this.errorMessage.set('Не вдалося виконати вхід.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

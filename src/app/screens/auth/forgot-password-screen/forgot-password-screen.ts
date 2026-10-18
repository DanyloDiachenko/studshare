import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiButtonDirective, UiIconComponent, UiInputDirective, UiLabelDirective } from '@ui';
import { AuthShellComponent } from '../components/auth-shell/auth-shell';

@Component({
  selector: 'app-forgot-password-screen',
  imports: [
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

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void this.router.navigateByUrl('/login');
  }
}

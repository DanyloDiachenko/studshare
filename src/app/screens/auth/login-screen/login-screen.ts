import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';
import { AuthShellComponent } from '../components/auth-shell/auth-shell';

@Component({
  selector: 'app-login-screen',
  imports: [RouterLink, UiButtonDirective, UiInputDirective, UiLabelDirective, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-screen.html',
})
export class LoginScreenComponent {
  private readonly router = inject(Router);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void this.router.navigateByUrl('/files');
  }
}

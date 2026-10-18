import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';
import { AuthShellComponent } from '../components/auth-shell/auth-shell';

@Component({
  selector: 'app-register-screen',
  imports: [RouterLink, UiButtonDirective, UiInputDirective, UiLabelDirective, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-screen.html',
})
export class RegisterScreenComponent {
  private readonly router = inject(Router);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void this.router.navigateByUrl('/files');
  }
}

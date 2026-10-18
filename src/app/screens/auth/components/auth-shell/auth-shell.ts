import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiBrandLogoComponent } from '@ui';
import { AuthAsideComponent } from '../auth-aside/auth-aside';

@Component({
  selector: 'app-auth-shell',
  imports: [UiBrandLogoComponent, AuthAsideComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './auth-shell.html',
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}

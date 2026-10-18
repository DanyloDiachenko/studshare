import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiBrandLogoComponent, UiButtonDirective } from '@ui';

@Component({
  selector: 'app-landing-header',
  imports: [RouterLink, UiBrandLogoComponent, UiButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './landing-header.html',
})
export class LandingHeaderComponent {}

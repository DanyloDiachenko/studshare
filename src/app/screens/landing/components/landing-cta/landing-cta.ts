import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonDirective } from '@ui';

@Component({
  selector: 'app-landing-cta',
  imports: [RouterLink, UiButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './landing-cta.html',
})
export class LandingCtaComponent {}

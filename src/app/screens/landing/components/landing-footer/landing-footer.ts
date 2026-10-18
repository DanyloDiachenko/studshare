import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiBrandLogoComponent } from '@ui';

@Component({
  selector: 'app-landing-footer',
  imports: [UiBrandLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './landing-footer.html',
})
export class LandingFooterComponent {}

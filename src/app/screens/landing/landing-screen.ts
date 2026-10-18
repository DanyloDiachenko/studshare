import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingCtaComponent } from './components/landing-cta/landing-cta';
import { LandingFeaturesComponent } from './components/landing-features/landing-features';
import { LandingFooterComponent } from './components/landing-footer/landing-footer';
import { LandingHeaderComponent } from './components/landing-header/landing-header';
import { LandingHeroComponent } from './components/landing-hero/landing-hero';

@Component({
  selector: 'app-landing-screen',
  imports: [
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingFeaturesComponent,
    LandingCtaComponent,
    LandingFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-screen.html',
})
export class LandingScreenComponent {}

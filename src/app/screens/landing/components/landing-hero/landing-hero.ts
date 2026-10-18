import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent, UiButtonDirective, UiIconComponent } from '@ui';
import { HeroPreviewCardComponent } from '../hero-preview-card/hero-preview-card';

@Component({
  selector: 'app-landing-hero',
  imports: [RouterLink, UiBadgeComponent, UiButtonDirective, UiIconComponent, HeroPreviewCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './landing-hero.html',
})
export class LandingHeroComponent {}

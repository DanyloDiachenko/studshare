import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiIconComponent, UiIconName } from '@ui';

export interface LandingFeatureItem {
  readonly icon: UiIconName;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-landing-features',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './landing-features.html',
})
export class LandingFeaturesComponent {
  protected readonly features: readonly LandingFeatureItem[] = [
    {
      icon: 'folder-tree',
      title: 'Єдине дерево папок',
      description: 'Предмети, лабораторні та конспекти в одній структурі, яку бачить уся група.',
    },
    {
      icon: 'pin',
      title: 'Закріплене старостою',
      description: 'Розклад, методички й дедлайни завжди зверху — ніхто не пропустить важливе.',
    },
    {
      icon: 'shield-check',
      title: 'Ролі та права',
      description: 'Студент, староста, студкуратор. Староста керує завантаженням, куратор — складом.',
    },
    {
      icon: 'search',
      title: 'Швидкий пошук',
      description: 'Знаходьте потрібний конспект за назвою серед усіх предметів групи.',
    },
    {
      icon: 'users',
      title: 'Запрошення поштою',
      description: 'Студкуратор додає одногрупників за email — доступ лише для своїх.',
    },
    {
      icon: 'history',
      title: 'Історія змін',
      description: 'Прозорий журнал: хто завантажив, перейменував чи видалив файл.',
    },
  ];
}

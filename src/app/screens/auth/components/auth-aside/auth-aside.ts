import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiIconComponent, UiIconName } from '@ui';

interface AuthHighlightItem {
  readonly icon: UiIconName;
  readonly text: string;
}

@Component({
  selector: 'app-auth-aside',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './auth-aside.html',
})
export class AuthAsideComponent {
  protected readonly highlights: readonly AuthHighlightItem[] = [
    {
      icon: 'folder-tree',
      text: 'Матеріали за предметами в одній структурі',
    },
    {
      icon: 'pin',
      text: 'Закріплені староста файли завжди під рукою',
    },
    {
      icon: 'shield-check',
      text: 'Доступ лише для запрошених учасників групи',
    },
  ];
}

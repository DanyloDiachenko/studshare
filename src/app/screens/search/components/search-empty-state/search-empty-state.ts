import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIconComponent } from '@ui';

@Component({
  selector: 'app-search-empty-state',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './search-empty-state.html',
})
export class SearchEmptyStateComponent {
  readonly query = input.required<string>();
}

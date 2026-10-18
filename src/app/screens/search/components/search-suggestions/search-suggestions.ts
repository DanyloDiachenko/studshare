import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-suggestions',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './search-suggestions.html',
})
export class SearchSuggestionsComponent {
  readonly suggestions = input.required<readonly string[]>();
}

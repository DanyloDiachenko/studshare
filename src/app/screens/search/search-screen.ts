import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesStateService } from '@core/state/files-state.service';
import {
  UiButtonDirective,
  UiIconComponent,
  UiPageHeaderComponent,
} from '@ui';
import { SearchEmptyStateComponent } from './components/search-empty-state/search-empty-state';
import { SearchResultsListComponent } from './components/search-results-list/search-results-list';
import { SearchSuggestionsComponent } from './components/search-suggestions/search-suggestions';

@Component({
  selector: 'app-search-screen',
  imports: [
    UiPageHeaderComponent,
    UiIconComponent,
    UiButtonDirective,
    SearchSuggestionsComponent,
    SearchEmptyStateComponent,
    SearchResultsListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-screen.html',
})
export class SearchScreenComponent {
  protected readonly filesState = inject(FilesStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get('q') ?? '';
      this.filesState.setSearchQuery(q);
    });
  }

  protected onSubmit(event: Event, value: string): void {
    event.preventDefault();
    const trimmed = value.trim();
    void this.router.navigate(['/search'], {
      queryParams: trimmed ? { q: trimmed } : {},
    });
  }
}

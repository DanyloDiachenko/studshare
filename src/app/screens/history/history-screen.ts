import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HistoryFilterKind } from '@core/models/workspace.models';
import { HistoryStateService } from '@core/state/history-state.service';
import { UiPageHeaderComponent } from '@ui';
import { HistoryFilterBarComponent } from './components/history-filter-bar/history-filter-bar';
import { HistoryTimelineComponent } from './components/history-timeline/history-timeline';

@Component({
  selector: 'app-history-screen',
  imports: [
    UiPageHeaderComponent,
    HistoryFilterBarComponent,
    HistoryTimelineComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history-screen.html',
})
export class HistoryScreenComponent {
  private readonly historyState = inject(HistoryStateService);

  protected readonly filterOptions = this.historyState.filterOptions;
  protected readonly activeFilter = this.historyState.activeFilter;
  protected readonly dayGroups = this.historyState.dayGroups;

  protected onFilterChange(filter: HistoryFilterKind): void {
    this.historyState.setFilter(filter);
  }
}

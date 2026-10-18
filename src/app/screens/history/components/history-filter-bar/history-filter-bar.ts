import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HistoryFilterKind } from '@core/models/workspace.models';
import { HistoryFilterOption } from '@core/state/history-state.service';

@Component({
  selector: 'app-history-filter-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './history-filter-bar.html',
})
export class HistoryFilterBarComponent {
  readonly options = input.required<readonly HistoryFilterOption[]>();
  readonly activeFilter = input.required<HistoryFilterKind>();

  readonly filterChange = output<HistoryFilterKind>();
}

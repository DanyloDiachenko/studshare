import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HistoryDayGroup } from '@core/models/workspace.models';
import { UiIconComponent } from '@ui';

@Component({
  selector: 'app-history-timeline',
  imports: [UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './history-timeline.html',
})
export class HistoryTimelineComponent {
  readonly dayGroups = input.required<readonly HistoryDayGroup[]>();
}

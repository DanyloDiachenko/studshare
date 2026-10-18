import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiButtonDirective } from '@ui';

@Component({
  selector: 'app-settings-danger-zone-card',
  imports: [UiButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './settings-danger-zone-card.html',
})
export class SettingsDangerZoneCardComponent {
  readonly canEdit = input.required<boolean>();
  readonly deleteDialogOpen = input<boolean>(false);

  readonly openDeleteDialog = output<void>();
}

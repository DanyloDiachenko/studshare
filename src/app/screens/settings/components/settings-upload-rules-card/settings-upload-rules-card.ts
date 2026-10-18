import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupUploadSettings } from '@core/models/workspace.models';
import { UiInputDirective, UiLabelDirective, UiSwitchComponent } from '@ui';

@Component({
  selector: 'app-settings-upload-rules-card',
  imports: [FormsModule, UiInputDirective, UiLabelDirective, UiSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './settings-upload-rules-card.html',
})
export class SettingsUploadRulesCardComponent {
  readonly settings = input.required<GroupUploadSettings>();
  readonly canEdit = input.required<boolean>();

  readonly settingsChange = output<Partial<GroupUploadSettings>>();

  protected onMaxSizeChange(value: number | string): void {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.settingsChange.emit({ maxFileSizeMb: parsed });
    }
  }
}

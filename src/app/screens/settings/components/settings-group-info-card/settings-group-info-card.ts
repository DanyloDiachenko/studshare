import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupInfo, UpdateGroupInfoPayload } from '@core/models/workspace.models';
import { UiButtonDirective, UiInputDirective, UiLabelDirective } from '@ui';

@Component({
  selector: 'app-settings-group-info-card',
  imports: [FormsModule, UiButtonDirective, UiInputDirective, UiLabelDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './settings-group-info-card.html',
})
export class SettingsGroupInfoCardComponent {
  readonly group = input.required<GroupInfo>();
  readonly canEdit = input.required<boolean>();

  readonly saveGroupInfo = output<UpdateGroupInfoPayload>();

  protected readonly name = signal('');
  protected readonly faculty = signal('');

  constructor() {
    effect(() => {
      const current = this.group();
      this.name.set(current.name);
      this.faculty.set(current.faculty);
    });
  }

  protected onSave(): void {
    if (!this.canEdit()) {
      return;
    }
    this.saveGroupInfo.emit({
      name: this.name(),
      faculty: this.faculty(),
    });
  }
}

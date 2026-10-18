import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupUploadSettings, UpdateGroupInfoPayload } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiDialogComponent,
  UiIconComponent,
  UiInputDirective,
  UiPageHeaderComponent,
} from '@ui';
import { SettingsDangerZoneCardComponent } from './components/settings-danger-zone-card/settings-danger-zone-card';
import { SettingsGroupInfoCardComponent } from './components/settings-group-info-card/settings-group-info-card';
import { SettingsUploadRulesCardComponent } from './components/settings-upload-rules-card/settings-upload-rules-card';

@Component({
  selector: 'app-settings-screen',
  imports: [
    FormsModule,
    UiPageHeaderComponent,
    UiIconComponent,
    UiDialogComponent,
    UiButtonDirective,
    UiInputDirective,
    SettingsGroupInfoCardComponent,
    SettingsUploadRulesCardComponent,
    SettingsDangerZoneCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-screen.html',
})
export class SettingsScreenComponent {
  private readonly roleState = inject(RoleStateService);

  protected readonly group = this.roleState.group;
  protected readonly uploadSettings = this.roleState.uploadSettings;
  protected readonly can = this.roleState.can;

  protected readonly deleteDialogOpen = signal(false);
  protected readonly deleteConfirmText = signal('');

  protected onSaveGroupInfo(payload: UpdateGroupInfoPayload): void {
    void this.roleState.updateGroupInfo(payload);
  }

  protected onUploadSettingsChange(partial: Partial<GroupUploadSettings>): void {
    void this.roleState.updateUploadSettings(partial);
  }

  protected closeDeleteDialog(): void {
    this.deleteConfirmText.set('');
    this.deleteDialogOpen.set(false);
  }

  protected confirmDeleteGroup(): void {
    this.deleteConfirmText.set('');
    this.deleteDialogOpen.set(false);
  }
}

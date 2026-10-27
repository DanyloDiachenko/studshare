import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateGroupInfoPayload } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
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
    SettingsDangerZoneCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-screen.html',
})
export class SettingsScreenComponent {
  protected readonly roleState = inject(RoleStateService);
  private readonly filesState = inject(FilesStateService);

  protected readonly group = this.roleState.group;
  protected readonly can = this.roleState.can;

  protected readonly deleteDialogOpen = signal(false);
  protected readonly deleteConfirmText = signal('');

  protected onSaveGroupInfo(payload: UpdateGroupInfoPayload): void {
    void this.roleState.updateGroupInfo(payload);
  }

  protected closeDeleteDialog(): void {
    this.deleteConfirmText.set('');
    this.deleteDialogOpen.set(false);
  }

  protected async confirmDeleteGroup(): Promise<void> {
    const confirmName = this.deleteConfirmText().trim();
    if (!confirmName) {
      return;
    }
    try {
      const deleted = await this.roleState.deleteGroup(confirmName);
      if (deleted) {
        this.filesState.clear();
      }
    } finally {
      this.deleteConfirmText.set('');
      this.deleteDialogOpen.set(false);
    }
  }
}

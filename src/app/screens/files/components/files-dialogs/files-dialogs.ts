import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { WorkspaceFileType } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiDialogComponent,
  UiIconComponent,
  UiInputDirective,
  UiLabelDirective,
} from '@ui';

@Component({
  selector: 'app-files-dialogs',
  imports: [
    UiDialogComponent,
    UiButtonDirective,
    UiLabelDirective,
    UiInputDirective,
    UiIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './files-dialogs.html',
})
export class FilesDialogsComponent {
  protected readonly filesState = inject(FilesStateService);
  protected readonly roleState = inject(RoleStateService);

  protected readonly newFolderName = signal('');
  protected readonly renameValue = signal('');
  protected readonly selectedFileName = signal('');
  private selectedFileType: WorkspaceFileType = 'pdf';
  private selectedFileSizeMb = 1.4;

  constructor() {
    effect(() => {
      const target = this.filesState.renameTarget();
      this.renameValue.set(target?.name ?? '');
    });

    effect(() => {
      if (!this.filesState.isCreateFolderDialogOpen()) {
        this.newFolderName.set('');
      }
    });

    effect(() => {
      if (!this.filesState.isUploadFileDialogOpen()) {
        this.selectedFileName.set('');
        this.selectedFileType = 'pdf';
        this.selectedFileSizeMb = 1.4;
      }
    });
  }

  protected submitCreateFolder(): void {
    void this.filesState.createFolder(this.newFolderName());
  }

  protected onFileSelected(inputEl: HTMLInputElement): void {
    const file = inputEl.files?.[0];
    if (!file) {
      return;
    }
    this.selectedFileName.set(file.name);
    this.selectedFileSizeMb = Math.max(0.1, +(file.size / (1024 * 1024)).toFixed(1));
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
      this.selectedFileType = 'docx';
    } else if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) {
      this.selectedFileType = 'pptx';
    } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      this.selectedFileType = 'image';
    } else if (lower.endsWith('.mp4') || lower.endsWith('.mov')) {
      this.selectedFileType = 'video';
    } else {
      this.selectedFileType = 'pdf';
    }
  }

  protected submitUploadFile(): void {
    void this.filesState.uploadFile(
      this.selectedFileName() || undefined,
      this.selectedFileType,
      this.selectedFileSizeMb
    );
  }

  protected submitRename(): void {
    void this.filesState.confirmRename(this.renameValue());
  }
}

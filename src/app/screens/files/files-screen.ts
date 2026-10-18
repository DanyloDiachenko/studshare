import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilesViewMode } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiIconComponent,
  UiIconName,
  UiPageHeaderComponent,
} from '@ui';
import { FilesDialogsComponent } from './components/files-dialogs/files-dialogs';
import { FilesEmptyStateComponent } from './components/files-empty-state/files-empty-state';
import { FilesGridViewComponent } from './components/files-grid-view/files-grid-view';
import { FilesListViewComponent } from './components/files-list-view/files-list-view';
import { FilesPinnedSectionComponent } from './components/files-pinned-section/files-pinned-section';
import { FolderTreeComponent } from './components/folder-tree/folder-tree';

interface ViewToggleOption {
  readonly id: FilesViewMode;
  readonly label: string;
  readonly icon: UiIconName;
}

@Component({
  selector: 'app-files-screen',
  imports: [
    RouterLink,
    UiButtonDirective,
    UiIconComponent,
    UiPageHeaderComponent,
    FolderTreeComponent,
    FilesPinnedSectionComponent,
    FilesListViewComponent,
    FilesGridViewComponent,
    FilesEmptyStateComponent,
    FilesDialogsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './files-screen.html',
})
export class FilesScreenComponent {
  protected readonly filesState = inject(FilesStateService);
  protected readonly roleState = inject(RoleStateService);
  private readonly route = inject(ActivatedRoute);

  protected readonly viewOptions: readonly ViewToggleOption[] = [
    { id: 'list', label: 'Список', icon: 'list' },
    { id: 'grid', label: 'Плитки', icon: 'layout-grid' },
  ];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const folderId = params.get('id');
      this.filesState.setActiveFolder(folderId ?? null);
    });
  }
}

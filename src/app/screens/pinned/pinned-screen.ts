import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilesStateService } from '@core/state/files-state.service';
import { UiPageHeaderComponent } from '@ui';
import { PinnedFilesSectionComponent } from './components/pinned-files-section/pinned-files-section';
import { PinnedFoldersSectionComponent } from './components/pinned-folders-section/pinned-folders-section';

@Component({
  selector: 'app-pinned-screen',
  imports: [
    UiPageHeaderComponent,
    PinnedFoldersSectionComponent,
    PinnedFilesSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pinned-screen.html',
})
export class PinnedScreenComponent {
  protected readonly filesState = inject(FilesStateService);
}

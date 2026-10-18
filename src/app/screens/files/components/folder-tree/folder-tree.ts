import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import { UiIconComponent } from '@ui';
import { FolderTreeNodeComponent } from './folder-tree-node';

@Component({
  selector: 'app-folder-tree',
  imports: [RouterLink, UiIconComponent, FolderTreeNodeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './folder-tree.html',
})
export class FolderTreeComponent {
  protected readonly filesState = inject(FilesStateService);
  protected readonly roleState = inject(RoleStateService);

  protected readonly ancestorIdSet = computed<ReadonlySet<string>>(
    () => new Set(this.filesState.breadcrumbs().map((item) => item.id))
  );
}

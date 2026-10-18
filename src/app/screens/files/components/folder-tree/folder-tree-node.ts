import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FolderItem } from '@core/models/workspace.models';
import { FilesStateService } from '@core/state/files-state.service';
import { UiIconComponent } from '@ui';

@Component({
  selector: 'app-folder-tree-node',
  imports: [RouterLink, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './folder-tree-node.html',
})
export class FolderTreeNodeComponent {
  private readonly filesState = inject(FilesStateService);

  readonly folder = input.required<FolderItem>();
  readonly depth = input.required<number>();
  readonly activeId = input.required<string | null>();
  readonly ancestorIds = input.required<ReadonlySet<string>>();

  protected readonly isExpanded = signal<boolean>(false);

  protected readonly children = computed(() =>
    this.filesState.getChildFolders(this.folder().id)
  );

  protected readonly isActive = computed(() => this.activeId() === this.folder().id);

  constructor() {
    effect(() => {
      if (this.ancestorIds().has(this.folder().id)) {
        this.isExpanded.set(true);
      }
    });
  }

  protected toggleExpand(): void {
    this.isExpanded.update((open) => !open);
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FilesStateService } from '@core/state/files-state.service';
import { RoleStateService } from '@core/state/role-state.service';
import {
  UiButtonDirective,
  UiDialogComponent,
  UiInputDirective,
  UiLabelDirective,
} from '@ui';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar';
import { AppTopbarComponent } from './components/app-topbar/app-topbar';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav';

@Component({
  selector: 'app-shell',
  imports: [
    FormsModule,
    RouterOutlet,
    UiDialogComponent,
    UiButtonDirective,
    UiInputDirective,
    UiLabelDirective,
    AppSidebarComponent,
    AppTopbarComponent,
    MobileNavComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './app-shell.html',
})
export class AppShellComponent {
  protected readonly roleState = inject(RoleStateService);
  private readonly filesState = inject(FilesStateService);

  protected readonly groupName = signal('');
  protected readonly groupFaculty = signal('');
  protected readonly createGroupError = signal('');
  protected readonly isCreatingGroup = signal(false);

  constructor() {
    effect(() => {
      if (!this.roleState.isCreateGroupDialogOpen()) {
        this.groupName.set('');
        this.groupFaculty.set('');
        this.createGroupError.set('');
      }
    });
  }

  protected async submitCreateGroup(): Promise<void> {
    const name = this.groupName().trim();
    const faculty = this.groupFaculty().trim();
    if (!name || !faculty) {
      this.createGroupError.set('Вкажіть назву групи та факультет.');
      return;
    }

    this.createGroupError.set('');
    this.isCreatingGroup.set(true);

    try {
      await this.roleState.createGroup({ name, faculty });
      await this.filesState.loadSnapshot();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.createGroupError.set(
          err.error?.error ?? err.error?.message ?? 'Не вдалося створити групу.'
        );
      } else {
        this.createGroupError.set('Не вдалося створити групу.');
      }
    } finally {
      this.isCreatingGroup.set(false);
    }
  }
}

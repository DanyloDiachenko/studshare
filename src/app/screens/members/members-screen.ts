import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EditMemberPayload } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import { UiButtonDirective, UiIconComponent, UiPageHeaderComponent } from '@ui';
import { MemberActionEvent } from './components/member-actions-menu/member-actions-menu';
import {
  MembersActiveTableComponent,
  ToggleMemberUploadEvent,
} from './components/members-active-table/members-active-table';
import { MembersDialogsComponent } from './components/members-dialogs/members-dialogs';
import { MembersPendingListComponent } from './components/members-pending-list/members-pending-list';

@Component({
  selector: 'app-members-screen',
  imports: [
    UiPageHeaderComponent,
    UiButtonDirective,
    UiIconComponent,
    MembersActiveTableComponent,
    MembersPendingListComponent,
    MembersDialogsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './members-screen.html',
})
export class MembersScreenComponent {
  protected readonly roleState = inject(RoleStateService);

  protected readonly group = this.roleState.group;
  protected readonly members = this.roleState.memberRows;
  protected readonly invitations = this.roleState.pendingInvitations;
  protected readonly can = this.roleState.can;

  protected readonly inviteDialogOpen = signal(false);
  protected readonly activeAction = signal<MemberActionEvent | null>(null);

  protected readonly headerDescription = computed(
    () =>
      `${this.members().length} учасників у групі ${this.group().name}. Староста керує доступом до завантаження, студкуратор — складом групи.`
  );

  protected onToggleUpload(event: ToggleMemberUploadEvent): void {
    void this.roleState.toggleMemberUpload(event.userId, event.canUpload);
  }

  protected onInviteMember(email: string): void {
    void this.roleState.inviteMember(email);
  }

  protected onResendInvitation(invitationId: string): void {
    void this.roleState.resendInvitation(invitationId);
  }

  protected onCancelInvitation(invitationId: string): void {
    void this.roleState.cancelInvitation(invitationId);
  }

  protected onEditMember(payload: EditMemberPayload): void {
    void this.roleState.editMember(payload);
  }

  protected onAssignStarosta(userId: string): void {
    void this.roleState.assignStarosta(userId);
  }

  protected onRemoveMember(userId: string): void {
    void this.roleState.removeMember(userId);
  }
}

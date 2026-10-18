import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditMemberPayload, MemberRowView } from '@core/models/workspace.models';
import {
  UiButtonDirective,
  UiDialogComponent,
  UiIconComponent,
  UiInputDirective,
  UiLabelDirective,
} from '@ui';
import { MemberActionEvent } from '../member-actions-menu/member-actions-menu';

@Component({
  selector: 'app-members-dialogs',
  imports: [
    FormsModule,
    UiDialogComponent,
    UiButtonDirective,
    UiIconComponent,
    UiInputDirective,
    UiLabelDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
  },
  templateUrl: './members-dialogs.html',
})
export class MembersDialogsComponent {
  readonly groupName = input.required<string>();
  readonly inviteOpen = input.required<boolean>();
  readonly activeAction = input.required<MemberActionEvent | null>();

  readonly inviteOpenChange = output<boolean>();
  readonly inviteSubmitted = output<string>();
  readonly closeAction = output<void>();
  readonly editSubmitted = output<EditMemberPayload>();
  readonly assignStarostaSubmitted = output<string>();
  readonly removeSubmitted = output<string>();

  protected readonly inviteEmail = signal('');
  protected readonly editFirstName = signal('');
  protected readonly editLastName = signal('');
  protected readonly editMiddleName = signal('');

  constructor() {
    effect(() => {
      const action = this.activeAction();
      if (action?.type === 'edit') {
        this.editFirstName.set(action.user.firstName);
        this.editLastName.set(action.user.lastName);
        this.editMiddleName.set(action.user.middleName ?? '');
      }
    });
  }

  protected activeUser(): MemberRowView | null {
    return this.activeAction()?.user ?? null;
  }

  protected submitInvite(): void {
    const email = this.inviteEmail().trim();
    if (email) {
      this.inviteSubmitted.emit(email);
      this.inviteEmail.set('');
    }
    this.inviteOpenChange.emit(false);
  }

  protected submitEdit(): void {
    const user = this.activeUser();
    if (user) {
      this.editSubmitted.emit({
        id: user.id,
        firstName: this.editFirstName(),
        lastName: this.editLastName(),
        middleName: this.editMiddleName(),
      });
    }
    this.closeAction.emit();
  }

  protected submitAssignStarosta(): void {
    const user = this.activeUser();
    if (user) {
      this.assignStarostaSubmitted.emit(user.id);
    }
    this.closeAction.emit();
  }

  protected submitRemove(): void {
    const user = this.activeUser();
    if (user) {
      this.removeSubmitted.emit(user.id);
    }
    this.closeAction.emit();
  }
}

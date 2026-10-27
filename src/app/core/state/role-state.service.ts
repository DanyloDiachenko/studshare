import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiUserResponse, mapApiUserToMember } from '../api/api.models';
import { AuthApiService } from '../api/auth-api.service';
import { WorkspaceApiService } from '../api/workspace-api.service';
import {
  EMPTY_GROUP_INFO,
  EMPTY_USER,
  formatUserFullName,
  formatUserInitials,
  getUserAvatarTone,
  ROLE_LABELS,
} from '../mocks/workspace.mock';
import {
  ChangePasswordPayload,
  DeleteAccountPayload,
  CreateGroupPayload,
  EditMemberPayload,
  GroupInfo,
  MemberRowView,
  MemberUser,
  PendingInvitation,
  RolePermissions,
  UpdateGroupInfoPayload,
  UpdateProfilePayload,
  UserRole,
} from '../models/workspace.models';
import { HistoryStateService } from './history-state.service';

@Injectable({ providedIn: 'root' })
export class RoleStateService {
  private readonly workspaceApi = inject(WorkspaceApiService);
  private readonly authApi = inject(AuthApiService);
  private readonly historyState = inject(HistoryStateService);

  private readonly currentUserState = signal<MemberUser | null>(null);
  private readonly membersState = signal<MemberUser[]>([]);
  private readonly knownAuthorsState = signal<Record<string, MemberUser>>({});
  private readonly invitationsState = signal<PendingInvitation[]>([]);
  private readonly groupState = signal<GroupInfo | null>(null);
  private readonly createGroupDialogOpenState = signal<boolean>(false);

  readonly members = this.membersState.asReadonly();
  readonly pendingInvitations = this.invitationsState.asReadonly();
  readonly isCreateGroupDialogOpen = this.createGroupDialogOpenState.asReadonly();

  readonly hasGroup = computed<boolean>(
    () => this.groupState() !== null || Boolean(this.currentUserState()?.groupId)
  );

  readonly group = computed<GroupInfo>(
    () => this.groupState() ?? EMPTY_GROUP_INFO
  );

  readonly memberRows = computed<MemberRowView[]>(() =>
    this.membersState().map((member) => ({
      ...member,
      fullName: formatUserFullName(member),
      initials: formatUserInitials(member),
      avatarTone: getUserAvatarTone(member),
      roleLabel: ROLE_LABELS[member.role],
      uploadStatusLabel:
        member.role !== 'student'
          ? 'Завжди'
          : member.canUpload
            ? 'Дозволено'
            : 'Заборонено',
    }))
  );

  readonly user = computed<MemberUser>(() => {
    const current = this.currentUserState();
    if (!current) {
      return EMPTY_USER;
    }
    return (
      this.membersState().find((item) => item.id === current.id) ?? current
    );
  });

  readonly userFullName = computed(() => formatUserFullName(this.user()));
  readonly userInitials = computed(() => formatUserInitials(this.user()));
  readonly userAvatarTone = computed(() => getUserAvatarTone(this.user()));
  readonly userRoleLabel = computed(() => ROLE_LABELS[this.user().role]);

  readonly can = computed<RolePermissions>(() => {
    const current = this.user();
    const isStudcurator = current.role === 'studcurator';
    const isStarosta = current.role === 'starosta';
    return {
      canUpload: current.canUpload,
      canPin: isStarosta,
      canRenameAny: isStarosta,
      canDeleteAny: isStarosta || isStudcurator,
      canManageMembers: isStudcurator,
      canToggleUpload: isStarosta || isStudcurator,
      canEditGroup: isStudcurator,
    };
  });

  constructor() {
    void this.hydrateFromApi();
  }

  openCreateGroupDialog(): void {
    this.createGroupDialogOpenState.set(true);
  }

  closeCreateGroupDialog(): void {
    this.createGroupDialogOpenState.set(false);
  }

  async hydrateFromApi(): Promise<void> {
    if (!this.authApi.hasToken()) {
      this.currentUserState.set(null);
      this.groupState.set(null);
      this.membersState.set([]);
      this.invitationsState.set([]);
      return;
    }

    try {
      const me = await this.workspaceApi.fetchCurrentUser();
      this.currentUserState.set(me);

      if (!me.groupId) {
        this.groupState.set(null);
        this.membersState.set([]);
        this.invitationsState.set([]);
        return;
      }

      const [groupRes, membersRes] = await Promise.allSettled([
        this.workspaceApi.fetchGroupInfo(),
        this.workspaceApi.fetchMembersBundle(),
      ]);

      if (groupRes.status === 'fulfilled') {
        this.groupState.set(groupRes.value);
      } else {
        this.groupState.set(null);
      }

      if (membersRes.status === 'fulfilled') {
        const list = membersRes.value.members;
        const hasMe = list.some((m) => m.id === me.id);
        this.membersState.set(hasMe ? list : [me, ...list]);
        this.invitationsState.set(membersRes.value.invitations);
      } else {
        this.membersState.set([me]);
        this.invitationsState.set([]);
      }
    } catch {
      return;
    }
  }

  async applyAuthenticatedUser(apiUser: ApiUserResponse): Promise<void> {
    const mapped = mapApiUserToMember(apiUser);
    this.currentUserState.set(mapped);
    await Promise.allSettled([
      this.hydrateFromApi(),
      this.historyState.hydrateFromApi(),
    ]);
  }

  async createGroup(payload: CreateGroupPayload): Promise<GroupInfo> {
    const created = await this.workspaceApi.createGroup(payload);
    this.groupState.set(created);

    const existing = this.currentUserState();
    if (existing) {
      const promoted: MemberUser = {
        ...existing,
        role: 'studcurator',
        canUpload: true,
        groupId: created.id ?? 'created',
      };
      this.currentUserState.set(promoted);
      this.membersState.set([promoted]);
      this.invitationsState.set([]);
    }

    this.closeCreateGroupDialog();
    await Promise.allSettled([
      this.hydrateFromApi(),
      this.historyState.hydrateFromApi(),
    ]);
    return created;
  }

  async refreshGroupInfo(): Promise<void> {
    if (!this.authApi.hasToken() || !this.hasGroup()) {
      return;
    }
    try {
      const group = await this.workspaceApi.fetchGroupInfo();
      this.groupState.set(group);
    } catch {
      return;
    }
  }

  registerKnownAuthors(authors: MemberUser[]): void {
    if (authors.length === 0) {
      return;
    }
    this.knownAuthorsState.update((prev) => {
      const next = { ...prev };
      for (const author of authors) {
        if (!next[author.id]) {
          next[author.id] = author;
        }
      }
      return next;
    });
  }

  getUserById(userId: string): MemberUser | undefined {
    const current = this.currentUserState();
    if (current && current.id === userId) {
      return current;
    }
    return (
      this.membersState().find((member) => member.id === userId) ??
      this.knownAuthorsState()[userId]
    );
  }

  getRoleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
  }

  logout(): void {
    this.authApi.clearToken();
    this.currentUserState.set(null);
    this.groupState.set(null);
    this.membersState.set([]);
    this.invitationsState.set([]);
    this.historyState.clear();
  }

  async toggleMemberUpload(userId: string, canUpload: boolean): Promise<void> {
    const nextValue = await this.workspaceApi.toggleMemberUpload(userId, canUpload);
    this.membersState.update((list) =>
      list.map((member) =>
        member.id === userId && member.role === 'student'
          ? { ...member, canUpload: nextValue }
          : member
      )
    );
    void this.historyState.hydrateFromApi();
  }

  async editMember(payload: EditMemberPayload): Promise<void> {
    const updated = await this.workspaceApi.editMember(payload);
    this.membersState.update((list) =>
      list.map((member) => (member.id === updated.id ? updated : member))
    );
    if (this.currentUserState()?.id === updated.id) {
      this.currentUserState.set(updated);
    }
  }

  async updateCurrentUserProfile(payload: Omit<UpdateProfilePayload, 'id'>): Promise<void> {
    const currentId = this.user().id;
    const updated = await this.workspaceApi.updateProfile({
      id: currentId,
      ...payload,
    });
    this.currentUserState.set(updated);
    this.membersState.update((list) =>
      list.map((member) => (member.id === updated.id ? updated : member))
    );
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await this.workspaceApi.changePassword(payload);
  }

  async deleteAccount(payload: DeleteAccountPayload): Promise<void> {
    await this.workspaceApi.deleteAccount(payload.password);
    this.logout();
  }

  async assignStarosta(userId: string): Promise<void> {
    const targetId = await this.workspaceApi.assignStarosta(userId);
    this.membersState.update((list) =>
      list.map((member) => {
        if (member.role === 'studcurator') {
          return member;
        }
        if (member.id === targetId) {
          return { ...member, role: 'starosta', canUpload: true };
        }
        if (member.role === 'starosta') {
          return { ...member, role: 'student' };
        }
        return member;
      })
    );
    void this.historyState.hydrateFromApi();
  }

  async removeMember(userId: string): Promise<void> {
    const removedId = await this.workspaceApi.removeMember(userId);
    this.membersState.update((list) => list.filter((member) => member.id !== removedId));
    this.syncMembersLabel();
    void this.historyState.hydrateFromApi();
  }

  async inviteMember(email: string): Promise<void> {
    const trimmed = email.trim();
    if (!trimmed) {
      return;
    }
    const created = await this.workspaceApi.inviteMember(trimmed);
    this.invitationsState.update((list) => [created, ...list]);
    this.syncMembersLabel();
  }

  async resendInvitation(invitationId: string): Promise<void> {
    const updated = await this.workspaceApi.resendInvitation(invitationId);
    this.invitationsState.update((list) =>
      list.map((inv) => (inv.id === updated.id ? updated : inv))
    );
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    const id = await this.workspaceApi.cancelInvitation(invitationId);
    this.invitationsState.update((list) => list.filter((inv) => inv.id !== id));
    this.syncMembersLabel();
  }

  async updateGroupInfo(payload: UpdateGroupInfoPayload): Promise<void> {
    const updated = await this.workspaceApi.updateGroupInfo(payload);
    this.groupState.set(updated);
    void this.historyState.hydrateFromApi();
  }

  async deleteGroup(confirmName: string): Promise<boolean> {
    const deleted = await this.workspaceApi.deleteGroup(confirmName);
    if (deleted) {
      this.groupState.set(null);
      this.membersState.set([]);
      this.invitationsState.set([]);
      const current = this.currentUserState();
      if (current) {
        this.currentUserState.set({ ...current, groupId: null });
      }
      this.historyState.clear();
    }
    return deleted;
  }

  private syncMembersLabel(): void {
    const mCount = this.membersState().length;
    const iCount = this.invitationsState().length;
    const currentGroup = this.groupState();
    if (!currentGroup) {
      return;
    }
    this.groupState.set({
      ...currentGroup,
      membersLabel: `${mCount} учасників · ${iCount} запрошення`,
    });
  }
}

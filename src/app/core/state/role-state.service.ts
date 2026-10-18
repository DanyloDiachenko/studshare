import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkspaceApiService } from '../api/workspace-api.service';
import {
  formatUserFullName,
  formatUserInitials,
  getUserAvatarTone,
  MOCK_GROUP,
  MOCK_INVITATIONS,
  MOCK_USERS,
  ROLE_DEMO_PRESETS,
  ROLE_LABELS,
} from '../mocks/workspace.mock';
import {
  ChangePasswordPayload,
  EditMemberPayload,
  GroupInfo,
  GroupUploadSettings,
  MemberRowView,
  MemberUser,
  PendingInvitation,
  RoleDemoPreset,
  RolePermissions,
  UpdateGroupInfoPayload,
  UpdateProfilePayload,
  UserRole,
} from '../models/workspace.models';

@Injectable({ providedIn: 'root' })
export class RoleStateService {
  private readonly workspaceApi = inject(WorkspaceApiService);

  private readonly membersState = signal<MemberUser[]>([...MOCK_USERS]);
  private readonly invitationsState = signal<PendingInvitation[]>([...MOCK_INVITATIONS]);
  private readonly groupState = signal<GroupInfo>({ ...MOCK_GROUP });
  private readonly uploadSettingsState = signal<GroupUploadSettings>({
    allowStudentUploads: true,
    allowStudentRenameOwn: true,
    maxFileSizeMb: 50,
  });
  private readonly presetsState = signal<RoleDemoPreset[]>([...ROLE_DEMO_PRESETS]);
  private readonly activeUserIdState = signal<string>('u1');

  readonly group = this.groupState.asReadonly();
  readonly members = this.membersState.asReadonly();
  readonly pendingInvitations = this.invitationsState.asReadonly();
  readonly uploadSettings = this.uploadSettingsState.asReadonly();
  readonly demoPresets = this.presetsState.asReadonly();

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
    const id = this.activeUserIdState();
    const list = this.membersState();
    return list.find((item) => item.id === id) ?? list[0];
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

  async hydrateFromApi(): Promise<void> {
    const [group, members, invitations, uploadSettings, presets] = await Promise.all([
      this.workspaceApi.fetchGroupInfo(),
      this.workspaceApi.fetchMembers(),
      this.workspaceApi.fetchPendingInvitations(),
      this.workspaceApi.fetchGroupUploadSettings(),
      this.workspaceApi.fetchRoleDemoPresets(),
    ]);
    this.groupState.set(group);
    this.membersState.set(members);
    this.invitationsState.set(invitations);
    this.uploadSettingsState.set(uploadSettings);
    this.presetsState.set(presets);
  }

  setUserId(userId: string): void {
    this.activeUserIdState.set(userId);
  }

  getUserById(userId: string): MemberUser | undefined {
    return this.membersState().find((member) => member.id === userId);
  }

  getRoleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
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
  }

  async editMember(payload: EditMemberPayload): Promise<void> {
    const updated = await this.workspaceApi.editMember(payload);
    this.membersState.update((list) =>
      list.map((member) =>
        member.id === updated.id
          ? {
              ...member,
              firstName: updated.firstName.trim() || member.firstName,
              lastName: updated.lastName.trim() || member.lastName,
              middleName: updated.middleName?.trim() || undefined,
            }
          : member
      )
    );
  }

  async updateCurrentUserProfile(payload: Omit<UpdateProfilePayload, 'id'>): Promise<void> {
    const currentId = this.user().id;
    const updated = await this.workspaceApi.updateProfile({
      id: currentId,
      ...payload,
    });
    this.membersState.update((list) =>
      list.map((member) =>
        member.id === updated.id
          ? {
              ...member,
              firstName: updated.firstName.trim() || member.firstName,
              lastName: updated.lastName.trim() || member.lastName,
              middleName: updated.middleName?.trim() || undefined,
              email: updated.email.trim() || member.email,
            }
          : member
      )
    );
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await this.workspaceApi.changePassword(payload);
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
  }

  async removeMember(userId: string): Promise<void> {
    const removedId = await this.workspaceApi.removeMember(userId);
    this.membersState.update((list) => list.filter((member) => member.id !== removedId));
    this.syncMembersLabel();
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
    const id = await this.workspaceApi.resendInvitation(invitationId);
    this.invitationsState.update((list) =>
      list.map((inv) =>
        inv.id === id ? { ...inv, invitedAt: 'Сьогодні', expiresIn: '3 дні' } : inv
      )
    );
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    const id = await this.workspaceApi.cancelInvitation(invitationId);
    this.invitationsState.update((list) => list.filter((inv) => inv.id !== id));
    this.syncMembersLabel();
  }

  async updateGroupInfo(payload: UpdateGroupInfoPayload): Promise<void> {
    const updated = await this.workspaceApi.updateGroupInfo(payload);
    this.groupState.update((group) => ({
      ...group,
      name: updated.name.trim() || group.name,
      faculty: updated.faculty.trim() || group.faculty,
    }));
  }

  async updateUploadSettings(partial: Partial<GroupUploadSettings>): Promise<void> {
    const nextSettings: GroupUploadSettings = {
      ...this.uploadSettingsState(),
      ...partial,
    };
    const saved = await this.workspaceApi.updateGroupUploadSettings(nextSettings);
    this.uploadSettingsState.set(saved);
  }

  private syncMembersLabel(): void {
    const mCount = this.membersState().length;
    const iCount = this.invitationsState().length;
    this.groupState.update((group) => ({
      ...group,
      membersLabel: `${mCount} учасників · ${iCount} запрошення`,
    }));
  }
}

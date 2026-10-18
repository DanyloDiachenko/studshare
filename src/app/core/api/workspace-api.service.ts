import { Injectable } from '@angular/core';
import {
  ChangePasswordPayload,
  EditMemberPayload,
  GroupInfo,
  GroupUploadSettings,
  HistoryEventItem,
  MemberUser,
  PendingInvitation,
  RoleDemoPreset,
  UpdateGroupInfoPayload,
  UpdateProfilePayload,
} from '../models/workspace.models';
import {
  MOCK_GROUP,
  MOCK_HISTORY,
  MOCK_INVITATIONS,
  MOCK_USERS,
  ROLE_DEMO_PRESETS,
} from '../mocks/workspace.mock';

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
  async fetchGroupInfo(): Promise<GroupInfo> {
    return Promise.resolve({ ...MOCK_GROUP });
  }

  async fetchGroupUploadSettings(): Promise<GroupUploadSettings> {
    return Promise.resolve({
      allowStudentUploads: true,
      allowStudentRenameOwn: true,
      maxFileSizeMb: 50,
    });
  }

  async fetchMembers(): Promise<MemberUser[]> {
    return Promise.resolve(MOCK_USERS.map((user) => ({ ...user })));
  }

  async fetchPendingInvitations(): Promise<PendingInvitation[]> {
    return Promise.resolve(MOCK_INVITATIONS.map((inv) => ({ ...inv })));
  }

  async fetchHistoryEvents(): Promise<HistoryEventItem[]> {
    return Promise.resolve(MOCK_HISTORY.map((item) => ({ ...item })));
  }

  async fetchRoleDemoPresets(): Promise<RoleDemoPreset[]> {
    return Promise.resolve(ROLE_DEMO_PRESETS.map((preset) => ({ ...preset })));
  }

  async toggleMemberUpload(_userId: string, canUpload: boolean): Promise<boolean> {
    return Promise.resolve(canUpload);
  }

  async editMember(payload: EditMemberPayload): Promise<EditMemberPayload> {
    return Promise.resolve({ ...payload });
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfilePayload> {
    return Promise.resolve({ ...payload });
  }

  async changePassword(_payload: ChangePasswordPayload): Promise<boolean> {
    return Promise.resolve(true);
  }

  async assignStarosta(userId: string): Promise<string> {
    return Promise.resolve(userId);
  }

  async removeMember(userId: string): Promise<string> {
    return Promise.resolve(userId);
  }

  async inviteMember(email: string): Promise<PendingInvitation> {
    const newInvitation: PendingInvitation = {
      id: `p_${Date.now()}`,
      email: email.trim(),
      invitedAt: 'Сьогодні',
      expiresIn: '3 дні',
    };
    return Promise.resolve(newInvitation);
  }

  async resendInvitation(invitationId: string): Promise<string> {
    return Promise.resolve(invitationId);
  }

  async cancelInvitation(invitationId: string): Promise<string> {
    return Promise.resolve(invitationId);
  }

  async updateGroupInfo(payload: UpdateGroupInfoPayload): Promise<UpdateGroupInfoPayload> {
    return Promise.resolve({ ...payload });
  }

  async updateGroupUploadSettings(settings: GroupUploadSettings): Promise<GroupUploadSettings> {
    return Promise.resolve({ ...settings });
  }

  async deleteGroup(_confirmName: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

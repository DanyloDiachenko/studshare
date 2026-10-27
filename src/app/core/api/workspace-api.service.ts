import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { firstValueFrom } from 'rxjs';
import {
  ChangePasswordPayload,
  CreateGroupPayload,
  EditMemberPayload,
  GroupInfo,
  HistoryEventItem,
  MemberUser,
  PendingInvitation,
  UpdateGroupInfoPayload,
  UpdateProfilePayload,
} from '../models/workspace.models';
import {
  ApiAssignStarostaResponse,
  ApiCancelInvitationResponse,
  ApiGroupInfoResponse,
  ApiGroupInvitationResponse,
  ApiHistoryEventResponse,
  ApiMembersResponse,
  ApiRemoveMemberResponse,
  ApiUserResponse,
  mapApiGroupToGroupInfo,
  mapApiHistoryToItem,
  mapApiInvitationToPending,
  mapApiUserToMember,
} from './api.models';

export interface MembersBundle {
  readonly members: MemberUser[];
  readonly invitations: PendingInvitation[];
}

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  async fetchCurrentUser(): Promise<MemberUser> {
    const user = await firstValueFrom(this.http.get<ApiUserResponse>('/api/auth/me'));
    return mapApiUserToMember(user);
  }

  async createGroup(payload: CreateGroupPayload): Promise<GroupInfo> {
    const created = await firstValueFrom(
      this.http.post<ApiGroupInfoResponse>('/api/groups', {
        name: payload.name.trim(),
        faculty: payload.faculty.trim(),
      })
    );
    return mapApiGroupToGroupInfo(created);
  }

  async fetchGroupInfo(): Promise<GroupInfo> {
    const group = await firstValueFrom(
      this.http.get<ApiGroupInfoResponse>('/api/groups/current')
    );
    return mapApiGroupToGroupInfo(group);
  }

  async fetchMembersBundle(): Promise<MembersBundle> {
    const response = await firstValueFrom(
      this.http.get<ApiMembersResponse>('/api/members')
    );
    return {
      members: response.members.map(mapApiUserToMember),
      invitations: response.invitations.map(mapApiInvitationToPending),
    };
  }

  async fetchMembers(): Promise<MemberUser[]> {
    const bundle = await this.fetchMembersBundle();
    return bundle.members;
  }

  async fetchPendingInvitations(): Promise<PendingInvitation[]> {
    const bundle = await this.fetchMembersBundle();
    return bundle.invitations;
  }

  async fetchHistoryEvents(category?: string): Promise<HistoryEventItem[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    const items = await firstValueFrom(
      this.http.get<ApiHistoryEventResponse[]>('/api/history', { params })
    );
    return items.map(mapApiHistoryToItem);
  }

  async toggleMemberUpload(userId: string, canUpload: boolean): Promise<boolean> {
    const updated = await firstValueFrom(
      this.http.patch<ApiUserResponse>(`/api/members/${userId}/upload-access`, {
        uploadAccess: canUpload,
      })
    );
    return updated.uploadAccess;
  }

  async editMember(payload: EditMemberPayload): Promise<MemberUser> {
    const updated = await firstValueFrom(
      this.http.patch<ApiUserResponse>(`/api/members/${payload.id}`, {
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        middleName: payload.middleName?.trim() || null,
      })
    );
    return mapApiUserToMember(updated);
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<MemberUser> {
    const updated = await firstValueFrom(
      this.http.patch<ApiUserResponse>('/api/profile', {
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        middleName: payload.middleName?.trim() || null,
        email: payload.email.trim(),
      })
    );
    return mapApiUserToMember(updated);
  }

  async changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ success: boolean }>('/api/profile/change-password', {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        repeatPassword: payload.repeatPassword,
      })
    );
    return res.success;
  }

  async assignStarosta(userId: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<ApiAssignStarostaResponse>(
        `/api/members/${userId}/assign-starosta`,
        {}
      )
    );
    return res.newStarostaId;
  }

  async removeMember(userId: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.delete<ApiRemoveMemberResponse>(`/api/members/${userId}`)
    );
    return res.removedUserId;
  }

  async inviteMember(email: string): Promise<PendingInvitation> {
    const created = await firstValueFrom(
      this.http.post<ApiGroupInvitationResponse>('/api/invitations', {
        email: email.trim(),
      })
    );
    return mapApiInvitationToPending(created);
  }

  async resendInvitation(invitationId: string): Promise<PendingInvitation> {
    const updated = await firstValueFrom(
      this.http.post<ApiGroupInvitationResponse>(
        `/api/invitations/${invitationId}/resend`,
        {}
      )
    );
    return mapApiInvitationToPending(updated);
  }

  async cancelInvitation(invitationId: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.delete<ApiCancelInvitationResponse>(`/api/invitations/${invitationId}`)
    );
    return res.cancelledInvitationId;
  }

  async updateGroupInfo(payload: UpdateGroupInfoPayload): Promise<GroupInfo> {
    const updated = await firstValueFrom(
      this.http.patch<ApiGroupInfoResponse>('/api/groups/current', {
        name: payload.name.trim(),
        faculty: payload.faculty.trim(),
      })
    );
    return mapApiGroupToGroupInfo(updated);
  }

  async deleteGroup(confirmName: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.delete<{ success: boolean }>('/api/groups/current', {
        body: { confirmName: confirmName.trim() },
      })
    );
    return res.success;
  }

  async deleteAccount(password: string): Promise<void> {
    const token = this.authApi.getToken();
    await firstValueFrom(
      this.http.delete<{ success: boolean }>('/api/profile', {
        body: { password },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
    );
  }
}

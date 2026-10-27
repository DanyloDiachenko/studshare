import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ApiAuthSuccessResponse,
  ApiConfirmEmailRequest,
  ApiForgotPasswordRequest,
  ApiResetPasswordRequest,
  ApiSignInRequest,
  ApiSignUpRequest,
  ApiUserResponse,
} from './api.models';

const ACCESS_TOKEN_STORAGE_KEY = 'studshare_access_token';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  }

  clearToken(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }

  async login(payload: ApiSignInRequest): Promise<ApiAuthSuccessResponse> {
    const response = await firstValueFrom(
      this.http.post<ApiAuthSuccessResponse>('/api/auth/login', payload)
    );
    this.setToken(response.accessToken);
    return response;
  }

  async register(payload: ApiSignUpRequest): Promise<ApiAuthSuccessResponse> {
    const response = await firstValueFrom(
      this.http.post<ApiAuthSuccessResponse>('/api/auth/register', payload)
    );
    this.setToken(response.accessToken);
    return response;
  }

  async forgotPassword(payload: ApiForgotPasswordRequest): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>('/api/auth/forgot-password', payload)
    );
  }

  async resetPassword(payload: ApiResetPasswordRequest): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.http.post<{ success: boolean }>('/api/auth/reset-password', payload)
    );
  }

  async sendVerification(email: string): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>('/api/auth/send-verification', { email })
    );
  }

  async verifyEmail(payload: ApiConfirmEmailRequest): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.http.post<{ success: boolean }>('/api/auth/verify-email', payload)
    );
  }

  async fetchMe(): Promise<ApiUserResponse> {
    return firstValueFrom(this.http.get<ApiUserResponse>('/api/auth/me'));
  }
}

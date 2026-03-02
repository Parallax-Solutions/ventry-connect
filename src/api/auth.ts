import api from '@/lib/axios';
import type { AuthResponse, LoginRequest } from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
};

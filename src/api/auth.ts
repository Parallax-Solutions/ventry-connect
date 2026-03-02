import api from '@/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: async (data: LoginRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
};

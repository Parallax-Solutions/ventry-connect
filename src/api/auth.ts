import api from '@/lib/axios';
import type { AuthResponse, LoginRequest } from '@/types';
import { isMockMode, mockLogin } from '@/mocks/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (isMockMode()) {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 400));
      return mockLogin(data.email, data.password);
    }
    return api.post<AuthResponse>('/auth/login', data).then((r) => r.data);
  },

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
};

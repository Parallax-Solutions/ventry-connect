import api from '@/lib/axios';
import { mockLogin, mockRegister } from '@/mocks/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

const IS_MOCK = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === 'http://localhost:3000';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return mockRegister(data.email, data.businessName);
    }
    return api.post<AuthResponse>('/auth/register', data).then((r) => r.data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return mockLogin(data.email, data.password);
    }
    return api.post<AuthResponse>('/auth/login', data).then((r) => r.data);
  },

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
};

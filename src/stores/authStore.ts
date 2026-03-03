import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TenantStatus, User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  tenantStatus: TenantStatus | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setTenantStatus: (tenantStatus: TenantStatus | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      tenantStatus: null,

      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true, tenantStatus: null }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setTenantStatus: (tenantStatus) =>
        set({ tenantStatus }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, tenantStatus: null }),
    }),
    {
      name: 'ventry-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        tenantStatus: state.tenantStatus,
      }),
    },
  ),
);

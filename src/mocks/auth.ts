import type { User, AuthResponse } from '@/types';

/** Demo users for testing without a backend */
export const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@ventry.io': {
    password: 'admin123',
    user: {
      id: 'user-admin-001',
      email: 'admin@ventry.io',
      role: 'VENTRY_ADMIN',
      scope: 'PLATFORM',
      status: 'ACTIVE',
      tenantId: null,
    },
  },
  'owner@barbercool.com': {
    password: 'owner123',
    user: {
      id: 'user-owner-001',
      email: 'owner@barbercool.com',
      role: 'OWNER',
      scope: 'TENANT',
      status: 'ACTIVE',
      tenantId: 'tenant-001',
    },
  },
};

const FAKE_TOKEN = 'mock-jwt-token-for-demo';
const FAKE_REFRESH = 'mock-refresh-token-for-demo';

export function mockLogin(email: string, password: string): AuthResponse {
  const entry = DEMO_USERS[email];
  if (!entry || entry.password !== password) {
    throw new Error('Invalid email or password');
  }
  return {
    user: entry.user,
    accessToken: FAKE_TOKEN,
    refreshToken: FAKE_REFRESH,
  };
}

/** Returns true when no real API URL is configured */
export const isMockMode = (): boolean => {
  const url = import.meta.env.VITE_API_URL;
  return !url || url === 'http://localhost:3000';
};

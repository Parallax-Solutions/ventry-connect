import type { AuthResponse, User } from '@/types';

const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'admin@ventry.io',
    password: 'admin123',
    user: {
      id: 'u-platform-1',
      email: 'admin@ventry.io',
      role: 'VENTRY_ADMIN',
      scope: 'PLATFORM',
      status: 'ACTIVE',
      tenantId: null,
    },
  },
  {
    email: 'owner@barbercool.com',
    password: 'owner123',
    user: {
      id: 'u-tenant-1',
      email: 'owner@barbercool.com',
      role: 'OWNER',
      scope: 'TENANT',
      status: 'ACTIVE',
      tenantId: 't-1',
    },
  },
];

export function mockLogin(email: string, password: string): AuthResponse {
  const entry = MOCK_USERS.find((u) => u.email === email && u.password === password);
  if (!entry) throw new Error('Invalid email or password');
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: entry.user,
  };
}

export function mockRegister(email: string, businessName: string): AuthResponse {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: `u-${Date.now()}`,
      email,
      role: 'OWNER',
      scope: 'TENANT',
      status: 'ACTIVE',
      tenantId: `t-${Date.now()}`,
    },
  };
}

import api from '@/lib/axios';
import type { User, CreatePlatformUserRequest, CreateTenantUserRequest } from '@/types';

export const usersApi = {
  getAll: () =>
    api.get<User[]>('/users').then((r) => r.data),

  getPlatformUsers: () =>
    api.get<User[]>('/users/platform').then((r) => r.data),

  createPlatformUser: (data: CreatePlatformUserRequest) =>
    api.post<User>('/users/platform', data).then((r) => r.data),

  createTenantUser: (data: CreateTenantUserRequest) =>
    api.post<User>('/users/tenant', data).then((r) => r.data),
};

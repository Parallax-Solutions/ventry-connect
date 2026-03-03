import api from '@/lib/axios';
import type {
  User,
  CreatePlatformUserRequest,
  CreateTenantUserRequest,
  UpdatePlatformUserRequest,
  UpdateTenantUserRequest,
} from '@/types';

export const usersApi = {
  getAll: () =>
    api.get<User[]>('/users').then((r) => r.data),

  getPlatformUsers: () =>
    api.get<User[]>('/users/platform').then((r) => r.data),

  createPlatformUser: (data: CreatePlatformUserRequest) =>
    api.post<User>('/users/platform', data).then((r) => r.data),

  createTenantUser: (data: CreateTenantUserRequest) =>
    api.post<User>('/users/tenant', data).then((r) => r.data),

  updatePlatformUser: (userId: string, data: UpdatePlatformUserRequest) =>
    api.patch<User>(`/users/platform/${userId}`, data).then((r) => r.data),

  updateTenantUser: (userId: string, data: UpdateTenantUserRequest) =>
    api.patch<User>(`/users/tenant/${userId}`, data).then((r) => r.data),
};

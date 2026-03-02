import api from '@/lib/axios';
import type { Tenant, CreateTenantRequest } from '@/types';

export const tenantsApi = {
  getAll: () =>
    api.get<Tenant[]>('/tenants').then((r) => r.data),

  getById: (id: string) =>
    api.get<Tenant>(`/tenants/${id}`).then((r) => r.data),

  create: (data: CreateTenantRequest) =>
    api.post<Tenant>('/tenants', data).then((r) => r.data),

  activate: (id: string) =>
    api.patch<Tenant>(`/tenants/${id}/activate`).then((r) => r.data),
};

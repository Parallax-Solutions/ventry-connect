import api from '@/lib/axios';
import type { Client, CreateClientRequest, UpdateClientRequest } from '@/types';

export const clientsApi = {
  getAll: () =>
    api.get<Client[]>('/clients').then((r) => r.data),

  create: (data: CreateClientRequest) =>
    api.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: UpdateClientRequest) =>
    api.patch<Client>(`/clients/${id}`, data).then((r) => r.data),

  getByPhone: (phone: string) =>
    api.get<Client>(`/clients/phone/${encodeURIComponent(phone)}`).then((r) => r.data),
};

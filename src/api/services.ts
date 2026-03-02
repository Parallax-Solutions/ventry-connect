import api from '@/lib/axios';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types';

export const servicesApi = {
  getAll: () =>
    api.get<Service[]>('/services').then((r) => r.data),

  create: (data: CreateServiceRequest) =>
    api.post<Service>('/services', data).then((r) => r.data),

  update: (id: string, data: UpdateServiceRequest) =>
    api.patch<Service>(`/services/${id}`, data).then((r) => r.data),
};

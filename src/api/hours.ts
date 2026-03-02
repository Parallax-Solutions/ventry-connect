import api from '@/lib/axios';
import type { BusinessHours } from '@/types';

export interface UpdateBusinessHoursRequest {
  hours: Array<{
    dayOfWeek: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }>;
}

export const hoursApi = {
  getAll: () =>
    api.get<BusinessHours[]>('/hours').then((r) => r.data),

  updateAll: (data: UpdateBusinessHoursRequest) =>
    api.patch<BusinessHours[]>('/hours', data).then((r) => r.data),
};

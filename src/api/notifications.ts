import api from '@/lib/axios';
import type { NotificationTemplate } from '@/types';

export interface UpsertNotificationTemplatesRequest {
  templates: Array<{
    type: string;
    template: string;
    enabled: boolean;
  }>;
}

export const notificationsApi = {
  getTemplates: () =>
    api.get<NotificationTemplate[]>('/notifications/templates').then((r) => r.data),

  upsertTemplates: (data: UpsertNotificationTemplatesRequest) =>
    api.patch<NotificationTemplate[]>('/notifications/templates', data).then((r) => r.data),
};

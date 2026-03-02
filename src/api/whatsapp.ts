import api from '@/lib/axios';
import type { WhatsAppConfig, WhatsAppSetupRequest } from '@/types';

export const whatsappApi = {
  getConfig: () =>
    api.get<WhatsAppConfig>('/whatsapp/config').then((r) => r.data),

  setup: (data: WhatsAppSetupRequest) =>
    api.post<WhatsAppConfig>('/whatsapp/setup', data).then((r) => r.data),
};

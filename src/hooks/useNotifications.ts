import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type UpsertNotificationTemplatesRequest } from '@/api/notifications';
import { toast } from 'sonner';

const NOTIFICATIONS_KEY = ['notifications', 'templates'] as const;

export function useNotificationTemplates() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: notificationsApi.getTemplates,
  });
}

export function useUpsertNotificationTemplates() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertNotificationTemplatesRequest) =>
      notificationsApi.upsertTemplates(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      toast.success('Notification templates saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save templates');
    },
  });
}

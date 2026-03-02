import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type UpsertNotificationTemplatesRequest } from '@/api/notifications';
import { useToast } from '@/hooks/use-toast';

const NOTIFICATIONS_KEY = ['notifications', 'templates'] as const;

export function useNotificationTemplates() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: notificationsApi.getTemplates,
  });
}

export function useUpsertNotificationTemplates() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpsertNotificationTemplatesRequest) =>
      notificationsApi.upsertTemplates(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      toast({ title: 'Notification templates saved' });
    },
  });
}

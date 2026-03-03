import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hoursApi, type UpdateBusinessHoursRequest } from '@/api/hours';
import { toast } from 'sonner';

const HOURS_KEY = ['hours'] as const;
const ONBOARDING_STATUS_KEY = ['onboarding', 'status'] as const;

export function useHours() {
  return useQuery({
    queryKey: HOURS_KEY,
    queryFn: hoursApi.getAll,
  });
}

export function useUpdateHours() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBusinessHoursRequest) => hoursApi.updateAll(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOURS_KEY });
      qc.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
      toast.success('Business hours saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save business hours');
    },
  });
}

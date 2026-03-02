import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hoursApi, type UpdateBusinessHoursRequest } from '@/api/hours';
import { useToast } from '@/hooks/use-toast';

const HOURS_KEY = ['hours'] as const;

export function useHours() {
  return useQuery({
    queryKey: HOURS_KEY,
    queryFn: hoursApi.getAll,
  });
}

export function useUpdateHours() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateBusinessHoursRequest) => hoursApi.updateAll(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOURS_KEY });
      toast({ title: 'Business hours saved' });
    },
  });
}

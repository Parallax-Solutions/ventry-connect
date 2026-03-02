import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import type { CreateServiceRequest, UpdateServiceRequest } from '@/types';

const SERVICES_KEY = ['services'] as const;

export function useServices() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: servicesApi.getAll,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_KEY });
      toast({ title: 'Service created successfully' });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_KEY });
      toast({ title: 'Service updated successfully' });
    },
  });
}

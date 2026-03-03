import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/api/services';
import { toast } from 'sonner';
import type { CreateServiceRequest, UpdateServiceRequest } from '@/types';

const SERVICES_KEY = ['services'] as const;
const ONBOARDING_STATUS_KEY = ['onboarding', 'status'] as const;

export function useServices() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: servicesApi.getAll,
  });
}

export function useCreateService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_KEY });
      qc.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
      toast.success('Service created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create service');
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SERVICES_KEY });
      qc.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
      toast.success('Service updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update service');
    },
  });
}

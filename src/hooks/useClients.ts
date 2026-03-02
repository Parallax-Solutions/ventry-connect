import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/api/clients';
import { toast } from 'sonner';
import type { CreateClientRequest, UpdateClientRequest } from '@/types';

const CLIENTS_KEY = ['clients'] as const;

export function useClients() {
  return useQuery({
    queryKey: CLIENTS_KEY,
    queryFn: clientsApi.getAll,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Client created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create client');
    },
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Client updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update client');
    },
  });
}

export function useClientByPhone(phone: string) {
  return useQuery({
    queryKey: [...CLIENTS_KEY, 'phone', phone],
    queryFn: () => clientsApi.getByPhone(phone),
    enabled: !!phone && phone.length >= 5,
  });
}

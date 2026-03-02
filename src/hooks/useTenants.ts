import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/api/tenants';
import { useToast } from '@/hooks/use-toast';
import type { CreateTenantRequest } from '@/types';

const TENANTS_KEY = ['tenants'] as const;

export function useTenants() {
  return useQuery({
    queryKey: TENANTS_KEY,
    queryFn: tenantsApi.getAll,
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: [...TENANTS_KEY, id],
    queryFn: () => tenantsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast({ title: 'Tenant created successfully' });
    },
  });
}

export function useActivateTenant() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => tenantsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      qc.invalidateQueries({ queryKey: [...TENANTS_KEY, id] });
      toast({ title: 'Tenant activated successfully' });
    },
  });
}

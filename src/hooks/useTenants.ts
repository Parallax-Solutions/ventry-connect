import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/api/tenants';
import { toast } from 'sonner';
import type { CreateTenantRequest, UpdateTenantRequest } from '@/types';

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

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success('Tenant created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tenant');
    },
  });
}

export function useActivateTenant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      qc.invalidateQueries({ queryKey: [...TENANTS_KEY, id] });
      toast.success('Tenant activated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to activate tenant');
    },
  });
}

export function useUpdateTenant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTenantRequest) => tenantsApi.updateMe(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success('Settings saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save settings');
    },
  });
}

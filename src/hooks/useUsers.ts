import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import type { CreatePlatformUserRequest, CreateTenantUserRequest } from '@/types';

const USERS_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: usersApi.getAll,
  });
}

export function useCreatePlatformUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePlatformUserRequest) => usersApi.createPlatformUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast({ title: 'Platform user created successfully' });
    },
  });
}

export function useCreateTenantUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTenantUserRequest) => usersApi.createTenantUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast({ title: 'Team member created successfully' });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api-errors';
import type {
  CreatePlatformUserRequest,
  CreateTenantUserRequest,
  UpdatePlatformUserRequest,
  UpdateTenantUserRequest,
} from '@/types';

const TENANT_USERS_KEY = ['users', 'tenant'] as const;
const PLATFORM_USERS_KEY = ['users', 'platform'] as const;

export function useUsers() {
  return useQuery({
    queryKey: TENANT_USERS_KEY,
    queryFn: usersApi.getAll,
  });
}

export function usePlatformUsers() {
  return useQuery({
    queryKey: PLATFORM_USERS_KEY,
    queryFn: usersApi.getPlatformUsers,
  });
}

export function useCreatePlatformUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePlatformUserRequest) => usersApi.createPlatformUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLATFORM_USERS_KEY });
      toast({ title: 'Platform user created successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Unable to create platform user',
        description: getErrorMessage(error, 'Check the form and try again'),
        variant: 'destructive',
      });
    },
  });
}

export function useCreateTenantUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTenantUserRequest) => usersApi.createTenantUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANT_USERS_KEY });
      toast({ title: 'Team member created successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Unable to create team member',
        description: getErrorMessage(error, 'Check the form and try again'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePlatformUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdatePlatformUserRequest }) =>
      usersApi.updatePlatformUser(userId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: PLATFORM_USERS_KEY });
      toast({
        title:
          variables.data.status === 'INACTIVE'
            ? 'Platform user deactivated'
            : variables.data.status === 'ACTIVE'
              ? 'Platform user activated'
              : 'Platform user updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Unable to update platform user',
        description: getErrorMessage(error, 'Check the form and try again'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTenantUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateTenantUserRequest }) =>
      usersApi.updateTenantUser(userId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: TENANT_USERS_KEY });
      toast({
        title:
          variables.data.status === 'INACTIVE'
            ? 'Team member deactivated'
            : variables.data.status === 'ACTIVE'
              ? 'Team member activated'
              : 'Team member updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Unable to update team member',
        description: getErrorMessage(error, 'Check the form and try again'),
        variant: 'destructive',
      });
    },
  });
}

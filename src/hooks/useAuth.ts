import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import type { LoginRequest, RegisterRequest } from '@/types';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);

      const destination = data.user.role === 'VENTRY_ADMIN'
        ? ROUTES.PLATFORM.TENANTS
        : ROUTES.TENANT.DASHBOARD;

      navigate(destination);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      navigate(ROUTES.TENANT.ONBOARDING);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Registration failed',
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return () => {
    logout();
    navigate(ROUTES.LOGIN);
  };
}

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import type { LoginRequest, RegisterRequest } from '@/types';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);

      const destination = data.user.role === 'VENTRY_ADMIN'
        ? ROUTES.PLATFORM.TENANTS
        : ROUTES.TENANT.DASHBOARD;

      navigate(destination);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      navigate(ROUTES.TENANT.ONBOARDING);
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

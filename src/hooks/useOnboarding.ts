import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '@/api/onboarding';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const ONBOARDING_STATUS_KEY = ['onboarding', 'status'] as const;

export function useOnboardingStatus(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ONBOARDING_STATUS_KEY,
    queryFn: () => onboardingApi.getStatus(),
    enabled: options?.enabled,
  });
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  const { setTenantStatus } = useAuthStore();

  return useMutation({
    mutationFn: () => onboardingApi.complete(),
    onSuccess: (data) => {
      setTenantStatus(data.tenantStatus);
      qc.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
      toast.success('Onboarding completed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Complete the setup before going live');
    },
  });
}

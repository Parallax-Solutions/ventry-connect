import api from '@/lib/axios';
import type { OnboardingStatus } from '@/types';

export const onboardingApi = {
  getStatus: async (): Promise<OnboardingStatus> =>
    api.get<OnboardingStatus>('/onboarding/status').then((r) => r.data),

  complete: async (): Promise<OnboardingStatus> =>
    api.post<OnboardingStatus>('/onboarding/complete').then((r) => r.data),
};

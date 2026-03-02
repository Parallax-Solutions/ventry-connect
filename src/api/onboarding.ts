import api from '@/lib/axios';
import type { OnboardingStatus } from '@/types';

export const onboardingApi = {
  getStatus: async (): Promise<OnboardingStatus> =>
    api.get<OnboardingStatus>('/onboarding/status').then((r) => r.data),
};

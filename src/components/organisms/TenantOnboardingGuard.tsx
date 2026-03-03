import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ROUTES, TENANT_SETUP_ROUTES } from '@/constants/routes';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { useAuthStore } from '@/stores/authStore';

export default function TenantOnboardingGuard() {
  const location = useLocation();
  const { user, tenantStatus, setTenantStatus } = useAuthStore();
  const { data: onboardingStatus, isLoading } = useOnboardingStatus({
    enabled: user?.scope === 'TENANT' && !!user?.tenantId,
  });

  useEffect(() => {
    if (onboardingStatus?.tenantStatus && onboardingStatus.tenantStatus !== tenantStatus) {
      setTenantStatus(onboardingStatus.tenantStatus);
    }
  }, [onboardingStatus?.tenantStatus, setTenantStatus, tenantStatus]);

  if (user?.scope !== 'TENANT') {
    return <Outlet />;
  }

  if (isLoading && !onboardingStatus && !tenantStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentTenantStatus = onboardingStatus?.tenantStatus ?? tenantStatus;
  const isSetupRoute = TENANT_SETUP_ROUTES.includes(location.pathname as typeof TENANT_SETUP_ROUTES[number]);
  const isOwner = user.role === 'OWNER';
  const isReady = currentTenantStatus === 'READY';

  if (!isOwner && location.pathname === ROUTES.TENANT.ONBOARDING) {
    return <Navigate to={ROUTES.TENANT.DASHBOARD} replace />;
  }

  if (isOwner && currentTenantStatus && !isReady && !isSetupRoute) {
    return <Navigate to={ROUTES.TENANT.ONBOARDING} replace />;
  }

  if (isOwner && isReady && location.pathname === ROUTES.TENANT.ONBOARDING) {
    return <Navigate to={ROUTES.TENANT.DASHBOARD} replace />;
  }

  return <Outlet />;
}

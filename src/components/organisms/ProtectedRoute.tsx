import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their correct panel instead of showing 403
    const fallback = user.role === 'VENTRY_ADMIN'
      ? ROUTES.PLATFORM.TENANTS
      : ROUTES.TENANT.DASHBOARD;
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

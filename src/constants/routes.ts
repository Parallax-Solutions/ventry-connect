export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PLATFORM: {
    TENANTS: '/platform/tenants',
    TENANT_DETAIL: '/platform/tenants/:id',
    USERS: '/platform/users',
  },
  TENANT: {
    DASHBOARD: '/dashboard',
    ONBOARDING: '/onboarding',
    SERVICES: '/services',
    BOOKINGS: '/bookings',
    CLIENTS: '/clients',
    TEAM: '/team',
    WHATSAPP_SETUP: '/whatsapp/setup',
    NOTIFICATIONS: '/notifications',
    BRANDING: '/branding',
    SETTINGS: '/settings',
    HOURS: '/hours',
  },
} as const;

export const TENANT_SETUP_ROUTES = [
  ROUTES.TENANT.ONBOARDING,
  ROUTES.TENANT.WHATSAPP_SETUP,
  ROUTES.TENANT.SERVICES,
  ROUTES.TENANT.HOURS,
] as const;

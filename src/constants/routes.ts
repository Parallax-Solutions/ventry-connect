export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  PLATFORM: {
    TENANTS: '/platform/tenants',
    TENANT_DETAIL: '/platform/tenants/:id',
    USERS: '/platform/users',
  },
  TENANT: {
    DASHBOARD: '/dashboard',
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

# Ventry Frontend — Progress Tracker

## ✅ Completed

### Fase 1: Dependencies + Infrastructure
- zustand, axios installed
- `src/lib/axios.ts` — Axios instance with JWT interceptor + auto-refresh on 401
- `src/stores/authStore.ts` — Zustand auth store with persist
- `src/components/organisms/ProtectedRoute.tsx` — Role-based route guard
- `src/components/molecules/ConfirmDialog.tsx` — Reusable confirm dialog with optional text field

### Fase 2: Types aligned with backend
- `src/types/index.ts` — All types uppercase, matching backend DTOs
- Legacy aliases preserved for landing page compatibility

### Fase 3: API layer + hooks
- `src/api/` — auth, tenants, services, clients, bookings, users, whatsapp
- `src/hooks/` — useAuth, useTenants, useServices, useClients, useBookings, useUsers, useWhatsAppConfig

### Fase 4: Login + routing restructure
- `src/pages/LoginPage.tsx` — Email/password with RHF+Zod, role-based redirect
- `src/constants/routes.ts` — PLATFORM + TENANT routes
- `src/App.tsx` — Protected routes by role
- `src/layouts/TenantLayout.tsx` — Role-based sidebar (replaces BackofficeLayout)
- `src/layouts/PlatformLayout.tsx` — Platform admin layout

### Fase 5: Platform admin pages
- `src/pages/platform/TenantsListPage.tsx` — Table with status badges
- `src/pages/platform/TenantDetailPage.tsx` — Detail with activate button
- `src/pages/platform/PlatformUsersPage.tsx` — Admin user management

### Fase 6 (partial): New tenant pages
- `src/pages/tenant/TeamPage.tsx` — Team member list
- `src/pages/tenant/WhatsAppSetupPage.tsx` — Setup/config view

### Fase 7: Components
- `src/components/atoms/StatusBadge.tsx` — Updated with all uppercase statuses
- `src/mocks/data.ts` — Updated to match new types

## 🔲 Remaining

- Connect pages to real API hooks (replace mock data with useQuery/useMutation)
- Dynamic onboarding checklist in DashboardPage
- Create booking form (dialog with client search, service dropdown, date/time pickers)
- Cancel booking dialog (with reason text field)
- Reschedule booking dialog
- Create client dialog
- Create tenant dialog
- Create platform user dialog
- Create tenant user dialog
- i18n: auth, platform, team, whatsapp namespaces

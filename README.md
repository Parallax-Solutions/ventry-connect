# Ventry — WhatsApp Booking Platform

Ventry is a multi-tenant SaaS platform that enables service businesses (barbershops, clinics, salons, veterinary clinics) to manage bookings, clients, and services through WhatsApp integration.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication & Roles](#authentication--roles)
- [Demo / Mock Mode](#demo--mock-mode)
- [User Guide](#user-guide)
  - [First-Time Setup (Onboarding)](#first-time-setup-onboarding)
  - [Dashboard](#dashboard)
  - [Managing Services](#managing-services)
  - [Managing Bookings](#managing-bookings)
  - [Managing Clients](#managing-clients)
  - [Team Management](#team-management)
  - [WhatsApp Setup](#whatsapp-setup)
- [Platform Admin Guide](#platform-admin-guide)
- [Design System](#design-system)
- [Internationalization (i18n)](#internationalization-i18n)
- [API Layer Pattern](#api-layer-pattern)
- [Deployment](#deployment)

---

## Architecture Overview

Ventry follows a clean **3-layer architecture**:

```
src/
├── api/          → HTTP services (pure functions, no state)
├── hooks/        → TanStack Query wrappers (cache, mutations, invalidation)
├── pages/        → Presentation layer (renders data from hooks)
├── components/   → Reusable UI (Atomic Design: atoms → molecules → organisms)
├── stores/       → Global state (Zustand — auth only)
├── layouts/      → Page shells (TenantLayout, PlatformLayout, LandingLayout)
├── types/        → TypeScript interfaces aligned with backend DTOs
├── constants/    → Route definitions, static config
├── mocks/        → Demo data and mock auth for offline development
└── i18n/         → Translations (English + Spanish)
```

**Key principles:**
- **Single Responsibility** — One hook per domain, one component per concept
- **DRY** — Shared components (`StatusBadge`, `ConfirmDialog`, `KPICard`) avoid duplication
- **Separation of Concerns** — `api/` = HTTP, `hooks/` = state + cache, `pages/` = UI
- **Type Safety** — Strict interfaces, no `any`, discriminated unions for statuses

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (auth) + TanStack Query (server state) |
| HTTP | Axios with JWT interceptor |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| i18n | i18next (EN/ES) |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd ventry

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Environment Variables

| Variable | Description | Default |
|----------|------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

When `VITE_API_URL` is not set or points to `localhost:3000`, the app automatically enters **mock mode** (no backend required).

---

## Authentication & Roles

Ventry uses JWT-based authentication with automatic token refresh.

### User Roles

| Role | Scope | Access |
|------|-------|--------|
| `VENTRY_ADMIN` | Platform | Manage all tenants and platform users |
| `OWNER` | Tenant | Full access to business settings, team, WhatsApp |
| `ADMIN` | Tenant | Manage services, bookings, clients, hours |
| `STAFF` | Tenant | View dashboard and bookings only |

### Route Protection

Routes are protected by `<ProtectedRoute allowedRoles={[...]} />`. If a user accesses a route outside their role, they are redirected to their appropriate home page.

### JWT Flow

1. User submits email + password → `POST /auth/login`
2. Receives `accessToken` + `refreshToken`
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. On `401`, interceptor attempts `POST /auth/refresh` automatically
5. If refresh fails → user is logged out and redirected to `/login`

---

## Demo / Mock Mode

When no backend is available, Ventry runs in **mock mode** with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Platform Admin | `admin@ventry.io` | `admin123` |
| Business Owner | `owner@barbercool.com` | `owner123` |

Mock mode simulates a 400ms network delay for realistic UX. All CRUD operations use local mock data.

---

## User Guide

### First-Time Setup (Onboarding)

When a business owner logs in for the first time, they are guided through a **6-step Setup Wizard**:

1. **Business Info** — Name, type, and brand color
2. **Connect WhatsApp** — Link your WhatsApp Business account
3. **Choose Preset** — Select your industry (barbershop, clinic, salon, vet) for pre-configured services
4. **Services** — Review and customize your service catalog
5. **Business Hours** — Set your weekly availability
6. **Review & Go Live** — Final review before launching

The wizard runs in a distraction-free layout (no sidebar). Once completed, you won't see it again.

### Dashboard

The main dashboard shows:
- **KPI Cards** — Today's bookings, upcoming, cancellations, active services
- **Recent Bookings** — Quick table of latest appointments
- **Quick Actions** — Shortcuts to add services, configure hours, view bookings
- **Setup Progress** — Checklist showing onboarding completion status

### Managing Services

Navigate to **Services** in the sidebar to:
- View all services with name, duration, price, and status
- Add new services with the "Add Service" button
- Edit existing services
- Toggle services active/inactive

> **Note:** Prices are stored in cents internally and displayed formatted with `Intl.NumberFormat`.

### Managing Bookings

Navigate to **Bookings** to:
- View all bookings with filters by status and service
- **Create** new bookings with client search, service selection, and date/time pickers
- **Confirm** pending bookings
- **Complete** confirmed bookings
- **Mark No-Show** for missed appointments
- **Cancel** with a mandatory reason field
- **Reschedule** with a new date and time

### Managing Clients

Navigate to **Clients** to:
- View your customer directory with contact info and booking history
- **Add** new clients with first name, last name, phone, and email
- **Edit** client details
- **Block/Unblock** clients
- Search by phone number

### Team Management

*(Owner only)* Navigate to **Team** to:
- View all team members and their roles
- **Invite** new members with email, password, and role (Admin or Staff)
- Manage team access

### WhatsApp Setup

*(Owner only)* Navigate to **WhatsApp** to:
- View current WhatsApp Business connection status
- Configure WhatsApp integration with WABA ID and phone number
- Monitor connection health

---

## Platform Admin Guide

Platform admins (`VENTRY_ADMIN`) access a separate interface at `/platform/*`:

### Tenants Management (`/platform/tenants`)
- View all registered businesses with status badges
- **Create** new tenants with name, slug, email, phone, business type, and timezone
- **View details** of individual tenants
- **Activate** pending tenants

### Tenant Statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Awaiting activation |
| `PROVISIONING` | Being set up |
| `READY` | Active and operational |
| `SUSPENDED` | Temporarily disabled |
| `DEACTIVATED` | Permanently disabled |

### Platform Users (`/platform/users`)
- Manage platform administrator accounts
- Create new admin users

---

## Design System

Ventry uses a custom design system built on shadcn/ui with semantic tokens:

- **Primary** — Teal (`#1a7a6d`)
- **Accent** — Coral for highlights
- **Status colors** — Success (green), Warning (amber), Destructive (red), Info (blue)
- **Typography** — Display font for headings, system font for body
- **Dark mode** — Full support via `next-themes`

All colors use CSS custom properties (`--primary`, `--background`, etc.) defined in `src/index.css`. Components reference tokens, never hardcoded colors.

### Key Shared Components

| Component | Purpose |
|-----------|---------|
| `StatusBadge` | Colored badge for any status (booking, tenant, client) |
| `ConfirmDialog` | Reusable confirmation with optional text field |
| `KPICard` | Metric card with icon and optional trend |
| `EmptyState` | Placeholder for empty lists |

---

## Internationalization (i18n)

Ventry supports **English** and **Spanish** with namespace-based translations:

```
src/i18n/locales/
├── en/
│   ├── common.json       → Shared labels, actions, statuses
│   ├── landing.json       → Marketing page
│   ├── backoffice.json    → Tenant panel (nav, services, bookings, etc.)
│   └── dashboard.json     → Dashboard-specific text
└── es/
    └── (same structure)
```

Language can be switched via the globe icon in the header. The selected language persists across sessions.

---

## API Layer Pattern

Every domain follows the same pattern for consistency:

```typescript
// 1. API Service (src/api/bookings.ts) — Pure HTTP
export const bookingsApi = {
  getAll: (filters?) => api.get('/bookings', { params: filters }).then(r => r.data),
  create: (data) => api.post('/bookings', data).then(r => r.data),
  confirm: (id) => api.patch(`/bookings/${id}/confirm`).then(r => r.data),
};

// 2. Hook (src/hooks/useBookings.ts) — TanStack Query wrapper
export function useBookings(filters?) {
  return useQuery({ queryKey: ['bookings', filters], queryFn: () => bookingsApi.getAll(filters) });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

// 3. Page — Just renders data from hooks
export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const confirm = useConfirmBooking();
  // ... render UI
}
```

---

## Deployment

### Via Lovable

Click **Publish** in the top-right corner of the Lovable editor.

- **Frontend changes** require clicking "Update" in the publish dialog
- **Backend changes** (edge functions, DB migrations) deploy automatically

### Custom Domain

Navigate to **Project → Settings → Domains** to connect your own domain.

---

## Routes Reference

| Path | Role | Description |
|------|------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Authentication |
| `/onboarding` | Owner | First-time setup wizard |
| `/dashboard` | Tenant | Main dashboard |
| `/services` | Tenant | Service management |
| `/bookings` | Tenant | Booking management |
| `/clients` | Tenant | Client directory |
| `/hours` | Tenant | Business hours |
| `/team` | Owner | Team management |
| `/whatsapp/setup` | Owner | WhatsApp configuration |
| `/notifications` | Tenant | Message templates |
| `/branding` | Tenant | Visual customization |
| `/settings` | Owner | General settings |
| `/platform/tenants` | Platform | Tenant management |
| `/platform/users` | Platform | Admin user management |

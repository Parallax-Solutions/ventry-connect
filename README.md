# Ventry Frontend

React + Vite frontend for Ventry, a multi-tenant operations layer for service businesses running bookings through WhatsApp.

Current scope:
- owner onboarding
- WhatsApp setup
- services, hours, clients, bookings
- notification templates
- tenant and platform backoffice

This frontend is aligned with the backend ADRs in:
- `../ventry/docs/adr/0000-product-vision.md`
- `../ventry/docs/adr/0001-auth-user-module.md`
- `../ventry/docs/adr/0002-booking-domain.md`

## Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Axios
- Tailwind CSS
- shadcn/ui
- i18next

## Project Structure

```text
src/
  api/          HTTP clients by domain
  components/   Reusable UI
  constants/    Route and app constants
  hooks/        Query and mutation hooks
  i18n/         Translation files
  layouts/      App shells
  lib/          Shared utilities and API plumbing
  pages/        Route-level screens
  stores/       Client state
  types/        Shared frontend types
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start Vite dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Tests:

```bash
npm run test
```

## Environment

Frontend variables:
- `VITE_API_URL` - backend base URL, default local backend is `http://localhost:3000`
- `VITE_ROUTER_MODE` - optional, use `hash` only if your deploy cannot rewrite SPA routes

Default expectation:
- frontend talks to the Nest backend under `/api`
- production should use `BrowserRouter` with SPA rewrites, or the backend serving `dist`

## Product Behavior

Tenant onboarding is guarded by tenant status:
- new owner tenant starts in `PROVISIONING`
- owner must complete WhatsApp, services, and hours
- `POST /onboarding/complete` moves the tenant to `READY`
- once `READY`, `/onboarding` redirects to the dashboard

Important routing notes:
- clean URLs are supported when the deploy rewrites non-API routes to `index.html`
- if the Nest backend serves the frontend build, refresh on nested routes works through its SPA fallback

## Frontend Conventions

- API calls live in `src/api`
- cache and invalidation live in `src/hooks`
- pages should stay thin and consume hooks/components
- errors from Axios are normalized in `src/lib/api-errors.ts`
- forms should prefer visible validation and inline errors over toast-only failures

## Current Gaps

Still incomplete or placeholder-heavy:
- team management UI
- platform user creation UI
- some settings/branding flows are still lightweight
- bundle splitting can be improved

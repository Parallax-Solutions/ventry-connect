

# Ventry Frontend — Alineacion con API Real

## Resumen del Gap Analysis

El proyecto actual es un **prototipo con mock data** y una sola aplicacion (backoffice del tenant bajo `/app/*`). Para conectar con la API real de NestJS, se necesitan cambios estructurales significativos.

### Lo que YA existe y se conserva:
- Landing page completa con i18n
- Design system (Teal + Coral, dark mode, componentes shadcn)
- Estructura Atomic Design
- Paginas base: Dashboard, Services, Bookings, Clients, Hours, Notifications, Branding, Settings, Onboarding wizard
- i18n con en/es

### Lo que FALTA o necesita cambios:

| Area | Estado Actual | Necesita |
|------|--------------|----------|
| Auth | No existe | Login, Zustand store, JWT interceptor, ProtectedRoute |
| Tipos TS | `pending/confirmed` lowercase | `PENDING/CONFIRMED` uppercase, nuevos campos |
| Rutas | Todo bajo `/app/*` | `/login`, `/platform/*`, `/dashboard`, `/services`, etc. |
| Panel Platform | No existe | Tenants CRUD, Users, layout propio |
| API layer | Mock data | Axios + TanStack Query hooks |
| Services | Sin precio en centavos | Precio centavos, moneda COP |
| Clients | Solo nombre, read-only | firstName/lastName, CRUD, status ACTIVE/BLOCKED |
| Bookings | Sin crear, acciones limitadas | Formulario crear, confirmar/completar/no-show/cancelar con razon/reprogramar |
| Team | Placeholder "Coming Soon" | Vista funcional con crear usuarios |
| WhatsApp Setup | No existe | Config page con onboarding/estado |
| Onboarding checklist | Hardcoded en dashboard | Dinamico basado en datos reales |

---

## Principios de Codigo Limpio Aplicados

- **Single Responsibility**: Cada archivo hace una sola cosa. Un hook por dominio, un componente por concepto visual.
- **DRY**: Componentes reutilizables (StatusBadge, ConfirmDialog, DataTable) en vez de duplicar logica en cada pagina.
- **Separation of Concerns**: Capas bien definidas: `api/` (HTTP puro), `hooks/` (TanStack Query + logica), `pages/` (solo presentacion).
- **Naming Conventions**: Archivos en PascalCase para componentes, camelCase para hooks/utils. Nombres descriptivos sin abreviaturas ambiguas.
- **Type Safety**: Interfaces estrictas alineadas con el backend. Evitar `any`. Usar discriminated unions para status.
- **Error Handling**: Cada llamada API con estados loading/error/empty. Toast para feedback de acciones.
- **Small Functions**: Funciones cortas y enfocadas. Si una funcion crece, extraer helpers.
- **Colocation**: Cada feature agrupa sus componentes cercanos. Shared components en `src/components/`.
- **No Magic Numbers/Strings**: Constantes en `src/constants/`. Status colors mapeados en objetos tipados.
- **Consistent Patterns**: Mismo patron para todos los CRUD (api service + hook + page). Si aprendes uno, los conoces todos.

---

## Plan de Implementacion (8 fases)

### Fase 1: Dependencias y Infraestructura Base

**Instalar dependencias:**
- `zustand` — estado global de auth
- `axios` — HTTP client con interceptor

**Crear archivos base:**
- `src/lib/axios.ts` — Instancia de Axios con baseURL desde `VITE_API_URL`, interceptor que inyecta `Authorization: Bearer <token>`, y auto-refresh en 401 (llama `POST /api/auth/refresh`). Si refresh falla, logout automatico.
- `src/stores/authStore.ts` — Zustand store minimalista: `user`, `accessToken`, `refreshToken`, `login()`, `logout()`, `setTokens()`. Persistencia en localStorage.
- `src/components/organisms/ProtectedRoute.tsx` — Wrapper con prop `allowedRoles: UserRole[]`. Verifica token, redirige a `/login` si no autenticado, muestra 403 si rol no permitido.
- `src/components/molecules/ConfirmDialog.tsx` — Dialog reutilizable con titulo, descripcion, accion primaria, y campo de texto opcional (para razon de cancelacion).

### Fase 2: Tipos TypeScript Alineados con el Backend

**Actualizar `src/types/index.ts`:**

Usar uppercase enums alineados con el backend. Interfaces limpias sin campos innecesarios:

```ts
// Roles y scopes
type UserRole = 'VENTRY_ADMIN' | 'OWNER' | 'ADMIN' | 'STAFF';
type UserScope = 'PLATFORM' | 'TENANT';

// Statuses como union types (no enums, mas flexible)
type TenantStatus = 'PENDING' | 'PROVISIONING' | 'READY' | 'SUSPENDED' | 'DEACTIVATED';
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

// Interfaces con campos exactos del backend
interface User { id, email, role, scope, status, tenantId }
interface Tenant { id, name, slug, email, phone?, businessType?, timezone?, status, createdAt }
interface Service { id, name, description?, duration, price (centavos), currency, active }
interface Client { id, firstName, lastName, phone, email?, status, createdAt }
interface Booking { id, clientId, client (nested), serviceId, service (nested), scheduledDate, scheduledTime, status, staffId?, notes?, cancellationReason? }
interface WhatsAppConfig { wabaId, phoneNumber, displayNumber, status }
```

Conservar tipos antiguos como aliases para no romper la landing page existente.

### Fase 3: API Layer — Servicios + Hooks

Patron consistente para cada dominio: **API service** (HTTP puro, sin estado) + **Hook** (TanStack Query, cache, mutations).

**API Services (`src/api/`)** — Funciones puras que retornan promesas:
- `auth.ts` — `login(email, password)`, `refresh(refreshToken)`
- `tenants.ts` — `getAll()`, `getById(id)`, `create(data)`, `activate(id)`
- `services.ts` — `getAll()`, `create(data)`, `update(id, data)`
- `clients.ts` — `getAll()`, `create(data)`, `update(id, data)`, `getByPhone(phone)`
- `bookings.ts` — `getAll(filters)`, `create(data)`, `confirm(id)`, `complete(id)`, `noShow(id)`, `cancel(id, reason)`, `reschedule(id, date, time)`
- `users.ts` — `getAll()`, `createPlatformUser(data)`, `createTenantUser(data)`
- `whatsapp.ts` — `getConfig()`, `setup(data)`

**Hooks (`src/hooks/`)** — Wrapping TanStack Query con invalidacion de cache correcta:
- `useAuth.ts`, `useTenants.ts`, `useServices.ts`, `useClients.ts`, `useBookings.ts`, `useUsers.ts`, `useWhatsAppConfig.ts`
- Cada hook expone queries y mutations con nombres claros
- Invalidacion automatica de queries tras mutations exitosas

### Fase 4: Login y Routing Reestructurado

**`src/pages/LoginPage.tsx`:**
- Formulario limpio con email + password
- React Hook Form + Zod para validacion
- Post-login: redireccion por rol (`VENTRY_ADMIN` a `/platform/tenants`, otros a `/dashboard`)
- Branding de Ventry (logo, colores)

**Actualizar `src/constants/routes.ts`:**
```text
/login
/platform/tenants
/platform/tenants/:id
/platform/users
/dashboard
/services
/bookings
/clients
/team
/whatsapp/setup
/notifications, /branding, /settings
```

**Actualizar `src/App.tsx`:**
- Rutas publicas: `/`, `/login`
- Rutas platform: `/platform/*` con `ProtectedRoute allowedRoles={['VENTRY_ADMIN']}`
- Rutas tenant: `/*` con `ProtectedRoute allowedRoles={['OWNER','ADMIN','STAFF']}`
- Landing page sigue en `/`

### Fase 5: Panel de Plataforma (VENTRY_ADMIN)

**`src/layouts/PlatformLayout.tsx`:**
- Sidebar minimalista: Tenants, Users
- Top bar con user info y logout
- Diseno limpio, desktop-focused

**Paginas nuevas:**

1. **TenantsListPage** — Tabla con nombre, slug, status badge (colores por status), email, fecha. Boton "Nuevo Tenant" abre dialog.

2. **CreateTenantDialog** — Form con nombre, slug (auto-slug del nombre, editable), email, telefono, tipo, timezone. Zod validation.

3. **TenantDetailPage** — Card con info completa. Badge prominente. Boton "Activar" condicional (solo PENDING). Breadcrumb navigation.

4. **PlatformUsersPage** — Lista de admins. Crear nuevo con email + password.

### Fase 6: Panel del Tenant — Actualizaciones

**Renombrar BackofficeLayout a TenantLayout:**
- Sidebar role-based: items visibles segun rol del usuario logueado
- Info real del tenant desde auth store
- Mantener future modules deshabilitados

**Paginas actualizadas:**

1. **DashboardPage** — KPIs reales via API. Onboarding checklist dinamico: consulta si hay servicios (`useServices`), WhatsApp config (`useWhatsAppConfig`), clientes, bookings. Muestra wizard si falta algo, dashboard normal si todo OK.

2. **ServicesPage** — Precio en centavos. Mostrar formateado con `Intl.NumberFormat`. Moneda COP. Form con React Hook Form + Zod. API integration.

3. **ClientsPage** — CRUD completo. firstName + lastName. Status management (ACTIVE/BLOCKED). Busqueda por telefono. Dialog para crear/editar.

4. **BookingsPage** — Boton "Nueva Cita" con formulario (cliente buscable, servicio dropdown, date/time pickers, staff opcional, notas). Acciones contextuales:
   - PENDING: Confirmar / Cancelar
   - CONFIRMED: Completar / No-show / Reprogramar / Cancelar
   - Cancelar con ConfirmDialog + campo razon
   - Reprogramar con RescheduleDialog

5. **TeamPage (nueva)** — Solo OWNER. Lista de usuarios del tenant. Crear usuario con email, password, rol (ADMIN/STAFF).

6. **WhatsAppSetupPage (nueva)** — Solo OWNER. Estado condicional: sin config muestra onboarding + form manual (code, wabaId, phoneNumberId). Con config muestra info + status.

### Fase 7: Componentes Compartidos

**StatusBadge actualizado:**
- Mapeo tipado de status a color:
  ```text
  PENDING=warning, PROVISIONING=info, READY=success, SUSPENDED=destructive, DEACTIVATED=muted
  NO_SHOW=muted, BLOCKED=destructive, ACTIVE=success, INACTIVE=muted
  ```
- Usar un objeto `Record<string, string>` para los estilos, facil de extender.

**ConfirmDialog:**
- Props tipadas: `title`, `description`, `confirmLabel`, `variant`, `withTextField?`, `onConfirm`
- Reutilizable para cancelar citas, eliminar recursos, activar tenants

**RescheduleDialog:**
- Date picker + time picker
- Zod validation para fecha futura

### Fase 8: i18n — Nuevos namespaces

**Nuevos archivos de traduccion (en + es):**
- `auth.json` — login form labels, errores, placeholders
- `platform.json` — tenants, users, statuses, acciones
- `team.json` — miembros, crear usuario, roles
- `whatsapp.json` — setup, configuracion, estados

**Actualizar existentes:**
- `common.json` — nuevos statuses (NO_SHOW, BLOCKED, PROVISIONING, etc.), nuevas acciones
- `dashboard.json` — onboarding checklist dinamico
- `backoffice.json` — nuevas nav keys, booking actions

---

## Estructura de Archivos (nuevos y modificados)

```text
src/
  api/                          # NUEVO
    auth.ts
    tenants.ts
    services.ts
    clients.ts
    bookings.ts
    users.ts
    whatsapp.ts
  stores/                       # NUEVO
    authStore.ts
  lib/
    axios.ts                    # NUEVO
  hooks/
    useAuth.ts                  # NUEVO
    useTenants.ts               # NUEVO
    useServices.ts              # NUEVO
    useClients.ts               # NUEVO
    useBookings.ts              # NUEVO
    useUsers.ts                 # NUEVO
    useWhatsAppConfig.ts        # NUEVO
  components/
    organisms/
      ProtectedRoute.tsx        # NUEVO
    molecules/
      ConfirmDialog.tsx         # NUEVO
      RescheduleDialog.tsx      # NUEVO
    atoms/
      StatusBadge.tsx           # MODIFICAR
  layouts/
    PlatformLayout.tsx          # NUEVO
    BackofficeLayout.tsx        # MODIFICAR (role-based nav)
  pages/
    LoginPage.tsx               # NUEVO
    platform/                   # NUEVO
      TenantsListPage.tsx
      TenantDetailPage.tsx
      PlatformUsersPage.tsx
    tenant/                     # NUEVO
      TeamPage.tsx
      WhatsAppSetupPage.tsx
    backoffice/
      DashboardPage.tsx         # MODIFICAR
      ServicesPage.tsx           # MODIFICAR
      ClientsPage.tsx           # MODIFICAR
      BookingsPage.tsx          # MODIFICAR
  types/index.ts                # MODIFICAR
  constants/routes.ts           # MODIFICAR
  i18n/locales/en/              # NUEVO: auth, platform, team, whatsapp
  i18n/locales/es/              # NUEVO: auth, platform, team, whatsapp
  App.tsx                       # MODIFICAR
```

---

## Notas Tecnicas

- **Base URL**: Configurable via `VITE_API_URL`. Default `http://localhost:3000`.
- **Precios**: Backend en centavos. Frontend muestra con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })`. Convierte al enviar (`valor * 100`).
- **Refresh Token**: Interceptor Axios detecta 401, intenta refresh, retry original. Si refresh falla, logout y redirect a `/login`.
- **Role-based UI**: Sidebar oculta items segun rol. Rutas protegidas con ProtectedRoute. Doble proteccion (UI + route guard).
- **Paginas conservadas sin cambios**: LandingPage, HoursPage, NotificationsPage, BrandingPage (conexion a API en fase futura).
- **Mock data**: Se mantiene como fallback. Paginas conectadas a API usan hooks reales.
- **Barrel exports**: Cada directorio `api/` y `hooks/` tendra un `index.ts` para imports limpios.


// ─── Auth & Users ───────────────────────────────────────
export type UserRole = 'VENTRY_ADMIN' | 'OWNER' | 'ADMIN' | 'STAFF';
export type UserScope = 'PLATFORM' | 'TENANT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  status: UserStatus;
  tenantId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  phone?: string;
  presetType?: string;
}

// ─── Tenants ────────────────────────────────────────────
export type TenantStatus = 'PENDING' | 'PROVISIONING' | 'READY' | 'SUSPENDED' | 'DEACTIVATED';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  contactPhone?: string;
  presetType?: string;
  timezone?: string;
  status: TenantStatus;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  contactEmail: string;
  contactPhone?: string;
  presetType?: string;
  timezone?: string;
}

// ─── Services ───────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  priceInCents: number;       // centavos
  currency: string;    // 'COP'
  isActive: boolean;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  durationMinutes: number;
  priceInCents: number;       // centavos
  currency: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
  priceInCents?: number;
  currency?: string;
  isActive?: boolean;
}

// ─── Clients ────────────────────────────────────────────
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: ClientStatus;
  createdAt: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface UpdateClientRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: ClientStatus;
}

// ─── Bookings ───────────────────────────────────────────
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Booking {
  id: string;
  clientId: string;
  client?: { firstName: string; lastName: string; phone: string } | null;
  serviceId: string;
  service?: { name: string; durationMinutes: number } | null;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  staffId?: string;
  notes?: string;
  cancellationReason?: string;
}

export interface CreateBookingRequest {
  clientId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  staffId?: string;
  notes?: string;
}

export interface BookingFilters {
  date?: string;
  status?: BookingStatus;
  clientId?: string;
}

// ─── WhatsApp ───────────────────────────────────────────
export interface WhatsAppConfig {
  id: string;
  tenantId: string;
  appId: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_SETUP';
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppSetupRequest {
  appId: string;
  appSecret: string;
  code: string;
  wabaId: string;
  phoneNumberId: string;
}

// ─── Users Management ───────────────────────────────────
export interface CreatePlatformUserRequest {
  email: string;
  password: string;
}

export interface CreateTenantUserRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF';
}

export interface UpdatePlatformUserRequest {
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateTenantUserRequest {
  email?: string;
  role?: 'ADMIN' | 'STAFF';
  status?: 'ACTIVE' | 'INACTIVE';
}

// ─── Business Hours ──────────────────────────────────────
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  id?: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface UpdateTenantRequest {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  timezone?: string;
}

// ─── Notification Templates (kept for existing pages) ───
export interface NotificationTemplate {
  id: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  template: string;
  enabled: boolean;
}

// ─── Onboarding ──────────────────────────────────────────
export interface OnboardingStatus {
  hasWhatsApp: boolean;
  hasServices: boolean;
  hasHours: boolean;
  hasTeam: boolean;
  canComplete: boolean;
  tenantStatus: TenantStatus;
  isComplete: boolean;
}

// ─── Legacy aliases (landing page compatibility) ────────
export type BusinessType = 'barbershop' | 'clinic' | 'salon' | 'vet';
export type OnboardingStep = 'connectWhatsApp' | 'services' | 'hours' | 'review';

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  businessInfo: {
    name: string;
    type: BusinessType | '';
    logo?: string;
    color: string;
  };
  whatsappConnected: boolean;
  selectedPreset: BusinessType | '';
}

// ─── Auth & Users ───────────────────────────────────────
export type UserRole = 'VENTRY_ADMIN' | 'OWNER' | 'ADMIN' | 'STAFF';
export type UserScope = 'PLATFORM' | 'TENANT';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  status: UserStatus;
  tenantId: string | null;
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

// ─── Tenants ────────────────────────────────────────────
export type TenantStatus = 'PENDING' | 'PROVISIONING' | 'READY' | 'SUSPENDED' | 'DEACTIVATED';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  businessType?: string;
  timezone?: string;
  status: TenantStatus;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  businessType?: string;
  timezone?: string;
}

// ─── Services ───────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;       // centavos
  currency: string;    // 'COP'
  active: boolean;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;       // centavos
  currency: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  currency?: string;
  active?: boolean;
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
  client: { firstName: string; lastName: string; phone: string };
  serviceId: string;
  service: { name: string; duration: number };
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
export type WhatsAppStatus = 'ACTIVE' | 'SUSPENDED';

export interface WhatsAppConfig {
  wabaId: string;
  phoneNumber: string;
  displayNumber: string;
  status: WhatsAppStatus;
}

export interface WhatsAppSetupRequest {
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

// ─── Business Hours (kept for existing pages) ───────────
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// ─── Notification Templates (kept for existing pages) ───
export interface NotificationTemplate {
  id: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  template: string;
  enabled: boolean;
}

// ─── Legacy aliases (landing page compatibility) ────────
export type BusinessType = 'barbershop' | 'clinic' | 'salon' | 'vet';
export type OnboardingStep = 'businessInfo' | 'connectWhatsApp' | 'choosePreset' | 'services' | 'hours' | 'review';

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

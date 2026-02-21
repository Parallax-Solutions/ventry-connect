export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type TenantStatus = 'configuring' | 'ready' | 'active';
export type OnboardingStep = 'businessInfo' | 'connectWhatsApp' | 'choosePreset' | 'services' | 'hours' | 'review';
export type BusinessType = 'barbershop' | 'clinic' | 'salon' | 'vet';
export type UserRole = 'owner' | 'admin' | 'staff';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Tenant {
  id: string;
  name: string;
  businessType: BusinessType;
  status: TenantStatus;
  logo?: string;
  primaryColor: string;
  phone: string;
  whatsappConnected: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  active: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  source: 'whatsapp' | 'manual';
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  lastBooking: string;
  createdAt: string;
}

export interface BusinessHours {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  template: string;
  enabled: boolean;
}

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

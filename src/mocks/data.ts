import type { Booking, Client, Service, BusinessHours, NotificationTemplate, Tenant } from '@/types';

export const mockTenant: Tenant = {
  id: 'tenant-001',
  name: 'BarberCool Studio',
  slug: 'barbercool-studio',
  email: 'info@barbercool.com',
  businessType: 'barbershop',
  status: 'READY',
  phone: '+52 55 1234 5678',
  timezone: 'America/Mexico_City',
  createdAt: '2025-01-01',
};

export const mockServices: Service[] = [
  { id: 's1', name: 'Classic Haircut', duration: 30, price: 1500, currency: 'COP', description: 'Traditional haircut with styling', active: true },
  { id: 's2', name: 'Beard Trim', duration: 20, price: 1000, currency: 'COP', description: 'Beard shaping and trim', active: true },
  { id: 's3', name: 'Haircut + Beard Combo', duration: 45, price: 2200, currency: 'COP', description: 'Complete grooming package', active: true },
  { id: 's4', name: 'Hair Coloring', duration: 60, price: 3500, currency: 'COP', description: 'Full color treatment', active: false },
  { id: 's5', name: 'Kids Haircut', duration: 20, price: 1000, currency: 'COP', description: 'Haircut for children under 12', active: true },
];

export const mockBookings: Booking[] = [
  { id: 'b1', clientId: 'c1', client: { firstName: 'Carlos', lastName: 'Mendoza', phone: '+52 55 9876 5432' }, serviceId: 's1', service: { name: 'Classic Haircut', duration: 30 }, scheduledDate: '2025-06-15', scheduledTime: '10:00', status: 'CONFIRMED' },
  { id: 'b2', clientId: 'c2', client: { firstName: 'Ana', lastName: 'García', phone: '+52 55 5555 1234' }, serviceId: 's3', service: { name: 'Haircut + Beard Combo', duration: 45 }, scheduledDate: '2025-06-15', scheduledTime: '11:00', status: 'PENDING' },
  { id: 'b3', clientId: 'c3', client: { firstName: 'Roberto', lastName: 'Silva', phone: '+52 55 4444 5678' }, serviceId: 's2', service: { name: 'Beard Trim', duration: 20 }, scheduledDate: '2025-06-15', scheduledTime: '14:00', status: 'COMPLETED' },
  { id: 'b4', clientId: 'c4', client: { firstName: 'María', lastName: 'López', phone: '+52 55 3333 9012' }, serviceId: 's5', service: { name: 'Kids Haircut', duration: 20 }, scheduledDate: '2025-06-16', scheduledTime: '09:30', status: 'CONFIRMED' },
  { id: 'b5', clientId: 'c5', client: { firstName: 'Diego', lastName: 'Ramírez', phone: '+52 55 2222 3456' }, serviceId: 's1', service: { name: 'Classic Haircut', duration: 30 }, scheduledDate: '2025-06-16', scheduledTime: '12:00', status: 'CANCELLED', cancellationReason: 'Client requested' },
  { id: 'b6', clientId: 'c1', client: { firstName: 'Carlos', lastName: 'Mendoza', phone: '+52 55 9876 5432' }, serviceId: 's3', service: { name: 'Haircut + Beard Combo', duration: 45 }, scheduledDate: '2025-06-17', scheduledTime: '15:00', status: 'PENDING' },
];

export const mockClients: Client[] = [
  { id: 'c1', firstName: 'Carlos', lastName: 'Mendoza', phone: '+52 55 9876 5432', email: 'carlos@email.com', status: 'ACTIVE', createdAt: '2025-01-10' },
  { id: 'c2', firstName: 'Ana', lastName: 'García', phone: '+52 55 5555 1234', status: 'ACTIVE', createdAt: '2025-02-20' },
  { id: 'c3', firstName: 'Roberto', lastName: 'Silva', phone: '+52 55 4444 5678', email: 'roberto@email.com', status: 'ACTIVE', createdAt: '2025-01-25' },
  { id: 'c4', firstName: 'María', lastName: 'López', phone: '+52 55 3333 9012', status: 'INACTIVE', createdAt: '2025-03-15' },
  { id: 'c5', firstName: 'Diego', lastName: 'Ramírez', phone: '+52 55 2222 3456', email: 'diego@email.com', status: 'BLOCKED', createdAt: '2024-12-05' },
];

export const mockBusinessHours: BusinessHours[] = [
  { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '18:00' },
  { day: 'sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
];

export const mockNotificationTemplates: NotificationTemplate[] = [
  { id: 'n1', type: 'confirmation', template: 'Hi {name}! Your booking for {service} on {date} at {time} has been confirmed. See you soon! 🎉', enabled: true },
  { id: 'n2', type: 'reminder', template: 'Hey {name}! Just a reminder about your {service} appointment tomorrow at {time}. Reply YES to confirm or RESCHEDULE to change. ⏰', enabled: true },
  { id: 'n3', type: 'cancellation', template: 'Hi {name}, your booking for {service} on {date} at {time} has been cancelled. Reply BOOK to schedule a new appointment. 📋', enabled: true },
];

export const mockKPIs = {
  todayBookings: 8,
  upcoming: 23,
  cancellations: 2,
  activeServices: 4,
};

// Helper to format client full name
export const formatClientName = (client: { firstName: string; lastName: string }) =>
  `${client.firstName} ${client.lastName}`;

import type { Booking, Client, Service, BusinessHours, NotificationTemplate, Tenant } from '@/types';

export const mockTenant: Tenant = {
  id: 'tenant-001',
  name: 'BarberCool Studio',
  businessType: 'barbershop',
  status: 'active',
  primaryColor: '#1a7a6d',
  phone: '+52 55 1234 5678',
  whatsappConnected: true,
};

export const mockServices: Service[] = [
  { id: 's1', name: 'Classic Haircut', duration: 30, price: 15, description: 'Traditional haircut with styling', active: true },
  { id: 's2', name: 'Beard Trim', duration: 20, price: 10, description: 'Beard shaping and trim', active: true },
  { id: 's3', name: 'Haircut + Beard Combo', duration: 45, price: 22, description: 'Complete grooming package', active: true },
  { id: 's4', name: 'Hair Coloring', duration: 60, price: 35, description: 'Full color treatment', active: false },
  { id: 's5', name: 'Kids Haircut', duration: 20, price: 10, description: 'Haircut for children under 12', active: true },
];

export const mockBookings: Booking[] = [
  { id: 'b1', clientId: 'c1', clientName: 'Carlos Mendoza', clientPhone: '+52 55 9876 5432', serviceId: 's1', serviceName: 'Classic Haircut', date: '2025-06-15', time: '10:00', status: 'confirmed', source: 'whatsapp' },
  { id: 'b2', clientId: 'c2', clientName: 'Ana García', clientPhone: '+52 55 5555 1234', serviceId: 's3', serviceName: 'Haircut + Beard Combo', date: '2025-06-15', time: '11:00', status: 'pending', source: 'whatsapp' },
  { id: 'b3', clientId: 'c3', clientName: 'Roberto Silva', clientPhone: '+52 55 4444 5678', serviceId: 's2', serviceName: 'Beard Trim', date: '2025-06-15', time: '14:00', status: 'completed', source: 'whatsapp' },
  { id: 'b4', clientId: 'c4', clientName: 'María López', clientPhone: '+52 55 3333 9012', serviceId: 's5', serviceName: 'Kids Haircut', date: '2025-06-16', time: '09:30', status: 'confirmed', source: 'manual' },
  { id: 'b5', clientId: 'c5', clientName: 'Diego Ramírez', clientPhone: '+52 55 2222 3456', serviceId: 's1', serviceName: 'Classic Haircut', date: '2025-06-16', time: '12:00', status: 'cancelled', source: 'whatsapp' },
  { id: 'b6', clientId: 'c1', clientName: 'Carlos Mendoza', clientPhone: '+52 55 9876 5432', serviceId: 's3', serviceName: 'Haircut + Beard Combo', date: '2025-06-17', time: '15:00', status: 'pending', source: 'whatsapp' },
];

export const mockClients: Client[] = [
  { id: 'c1', name: 'Carlos Mendoza', phone: '+52 55 9876 5432', email: 'carlos@email.com', totalBookings: 12, lastBooking: '2025-06-15', createdAt: '2025-01-10' },
  { id: 'c2', name: 'Ana García', phone: '+52 55 5555 1234', totalBookings: 5, lastBooking: '2025-06-15', createdAt: '2025-02-20' },
  { id: 'c3', name: 'Roberto Silva', phone: '+52 55 4444 5678', email: 'roberto@email.com', totalBookings: 8, lastBooking: '2025-06-15', createdAt: '2025-01-25' },
  { id: 'c4', name: 'María López', phone: '+52 55 3333 9012', totalBookings: 3, lastBooking: '2025-06-16', createdAt: '2025-03-15' },
  { id: 'c5', name: 'Diego Ramírez', phone: '+52 55 2222 3456', email: 'diego@email.com', totalBookings: 15, lastBooking: '2025-06-16', createdAt: '2024-12-05' },
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

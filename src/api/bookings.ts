import api from '@/lib/axios';
import type { Booking, CreateBookingRequest, BookingFilters } from '@/types';

export const bookingsApi = {
  getAll: (filters?: BookingFilters) =>
    api.get<Booking[]>('/bookings', { params: filters }).then((r) => r.data),

  create: (data: CreateBookingRequest) =>
    api.post<Booking>('/bookings', data).then((r) => r.data),

  confirm: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/confirm`).then((r) => r.data),

  complete: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/complete`).then((r) => r.data),

  noShow: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/no-show`).then((r) => r.data),

  cancel: (id: string, reason: string) =>
    api.patch<Booking>(`/bookings/${id}/cancel`, { reason }).then((r) => r.data),

  reschedule: (id: string, scheduledDate: string, scheduledTime: string) =>
    api.patch<Booking>(`/bookings/${id}/reschedule`, { scheduledDate, scheduledTime }).then((r) => r.data),
};

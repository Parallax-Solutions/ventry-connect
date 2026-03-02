import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/bookings';
import { toast } from 'sonner';
import type { CreateBookingRequest, BookingFilters } from '@/types';

const BOOKINGS_KEY = ['bookings'] as const;

export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: [...BOOKINGS_KEY, filters],
    queryFn: () => bookingsApi.getAll(filters),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.confirm(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking confirmed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to confirm booking');
    },
  });
}

export function useCompleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking completed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete booking');
    },
  });
}

export function useNoShowBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.noShow(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking marked as no-show');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark as no-show');
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
}

export function useRescheduleBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledDate, scheduledTime }: { id: string; scheduledDate: string; scheduledTime: string }) =>
      bookingsApi.reschedule(id, scheduledDate, scheduledTime),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast.success('Booking rescheduled');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reschedule booking');
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/bookings';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY });
      toast({ title: 'Booking created successfully' });
    },
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  });
}

export function useCompleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.complete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  });
}

export function useNoShowBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.noShow(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  });
}

export function useRescheduleBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledDate, scheduledTime }: { id: string; scheduledDate: string; scheduledTime: string }) =>
      bookingsApi.reschedule(id, scheduledDate, scheduledTime),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  });
}

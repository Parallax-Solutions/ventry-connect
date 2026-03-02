import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { mockBookings, formatClientName } from '@/mocks/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CalendarDays, Filter, Check, RotateCcw, X, Ban, Plus } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types';

export default function BookingsPage() {
  const { t } = useTranslation(['backoffice', 'common']);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filtered = statusFilter === 'all' ? mockBookings : mockBookings.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('backoffice:bookings.title')}</h1>
          <p className="text-muted-foreground">{t('backoffice:bookings.subtitle')}</p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <Plus className="h-4 w-4 mr-1" /> {t('backoffice:bookings.newBooking', { defaultValue: 'New Booking' })}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="font-display">{t('backoffice:bookings.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('backoffice:bookings.allStatuses')}</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState icon={<CalendarDays className="h-12 w-12" />} title={t('backoffice:bookings.emptyState.title')} description={t('backoffice:bookings.emptyState.description')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard:table.client', { ns: 'dashboard' })}</TableHead>
                  <TableHead>{t('dashboard:table.service', { ns: 'dashboard' })}</TableHead>
                  <TableHead>{t('dashboard:table.date', { ns: 'dashboard' })}</TableHead>
                  <TableHead>{t('dashboard:table.time', { ns: 'dashboard' })}</TableHead>
                  <TableHead>{t('dashboard:table.status', { ns: 'dashboard' })}</TableHead>
                  <TableHead>{t('common:actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedBooking(b)}>
                    <TableCell className="font-medium">{formatClientName(b.client)}</TableCell>
                    <TableCell>{b.service.name}</TableCell>
                    <TableCell>{b.scheduledDate}</TableCell>
                    <TableCell>{b.scheduledTime}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {b.status === 'PENDING' && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-success" title={t('backoffice:bookings.confirm')}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-success" title={t('backoffice:bookings.markComplete')}>
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" title={t('backoffice:bookings.reschedule')}>
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" title="No Show">
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title={t('common:cancel')}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Drawer */}
      <Sheet open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-display">{t('backoffice:bookings.details')}</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard:table.client', { ns: 'dashboard' })}</p>
                <p className="font-medium">{formatClientName(selectedBooking.client)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('common:phone')}</p>
                <p className="font-medium">{selectedBooking.client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard:table.service', { ns: 'dashboard' })}</p>
                <p className="font-medium">{selectedBooking.service.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard:table.date', { ns: 'dashboard' })}</p>
                <p className="font-medium">{selectedBooking.scheduledDate} — {selectedBooking.scheduledTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('common:status')}</p>
                <StatusBadge status={selectedBooking.status} />
              </div>
              {selectedBooking.cancellationReason && (
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-sm">{selectedBooking.cancellationReason}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {selectedBooking.status === 'PENDING' && (
                  <Button className="flex-1 gradient-primary border-0 text-white">{t('backoffice:bookings.confirm')}</Button>
                )}
                {selectedBooking.status === 'CONFIRMED' && (
                  <Button className="flex-1 gradient-primary border-0 text-white">{t('backoffice:bookings.markComplete')}</Button>
                )}
                {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'CONFIRMED') && (
                  <Button variant="outline" className="flex-1">{t('backoffice:bookings.reschedule')}</Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

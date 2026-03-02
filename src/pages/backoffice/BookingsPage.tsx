import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import {
  useBookings,
  useConfirmBooking,
  useCompleteBooking,
  useNoShowBooking,
  useCancelBooking,
  useRescheduleBooking,
  useCreateBooking,
} from '@/hooks/useBookings';
import { useClients } from '@/hooks/useClients';
import { useServices } from '@/hooks/useServices';
import { formatClientName } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Filter, Check, RotateCcw, X, Ban, Plus, Loader2 } from 'lucide-react';
import type { Booking } from '@/types';

type DialogMode = 'cancel' | 'reschedule' | 'newBooking' | null;

export default function BookingsPage() {
  const { t } = useTranslation(['backoffice', 'common']);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [actionBooking, setActionBooking] = useState<Booking | null>(null);

  // Cancel state
  const [cancelReason, setCancelReason] = useState('');

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // New booking state
  const [newClientId, setNewClientId] = useState('');
  const [newServiceId, setNewServiceId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const { data: bookings = [], isLoading } = useBookings();
  const { data: clients = [] } = useClients();
  const { data: services = [] } = useServices();

  const confirmMutation = useConfirmBooking();
  const completeMutation = useCompleteBooking();
  const noShowMutation = useNoShowBooking();
  const cancelMutation = useCancelBooking();
  const rescheduleMutation = useRescheduleBooking();
  const createMutation = useCreateBooking();

  const filtered = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);

  const openCancel = (b: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionBooking(b);
    setCancelReason('');
    setDialogMode('cancel');
  };

  const openReschedule = (b: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionBooking(b);
    setRescheduleDate(b.scheduledDate);
    setRescheduleTime(b.scheduledTime);
    setDialogMode('reschedule');
  };

  const handleConfirm = (b: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmMutation.mutate(b.id);
  };

  const handleComplete = (b: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    completeMutation.mutate(b.id);
  };

  const handleNoShow = (b: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    noShowMutation.mutate(b.id);
  };

  const handleCancel = () => {
    if (!actionBooking) return;
    cancelMutation.mutate(
      { id: actionBooking.id, reason: cancelReason },
      { onSuccess: () => { setDialogMode(null); setSelectedBooking(null); } },
    );
  };

  const handleReschedule = () => {
    if (!actionBooking) return;
    rescheduleMutation.mutate(
      { id: actionBooking.id, scheduledDate: rescheduleDate, scheduledTime: rescheduleTime },
      { onSuccess: () => { setDialogMode(null); setSelectedBooking(null); } },
    );
  };

  const openNewBooking = () => {
    setNewClientId('');
    setNewServiceId('');
    setNewDate('');
    setNewTime('');
    setNewNotes('');
    setDialogMode('newBooking');
  };

  const handleCreateBooking = () => {
    createMutation.mutate(
      { clientId: newClientId, serviceId: newServiceId, scheduledDate: newDate, scheduledTime: newTime, notes: newNotes || undefined },
      { onSuccess: () => setDialogMode(null) },
    );
  };

  const isNewBookingValid = newClientId && newServiceId && newDate && newTime;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('backoffice:bookings.title')}</h1>
          <p className="text-muted-foreground">{t('backoffice:bookings.subtitle')}</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={openNewBooking}>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-12 w-12" />}
              title={t('backoffice:bookings.emptyState.title')}
              description={t('backoffice:bookings.emptyState.description')}
            />
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
                  <TableRow
                    key={b.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <TableCell className="font-medium">
                      {b.client ? formatClientName(b.client) : '—'}
                    </TableCell>
                    <TableCell>{b.service?.name ?? '—'}</TableCell>
                    <TableCell>{b.scheduledDate}</TableCell>
                    <TableCell>{b.scheduledTime}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {b.status === 'PENDING' && (
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-success"
                            title={t('backoffice:bookings.confirm')}
                            disabled={confirmMutation.isPending}
                            onClick={(e) => handleConfirm(b, e)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <>
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-success"
                              title={t('backoffice:bookings.markComplete')}
                              disabled={completeMutation.isPending}
                              onClick={(e) => handleComplete(b, e)}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7"
                              title={t('backoffice:bookings.reschedule')}
                              onClick={(e) => openReschedule(b, e)}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"
                              title="No Show"
                              disabled={noShowMutation.isPending}
                              onClick={(e) => handleNoShow(b, e)}
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                            title={t('common:cancel')}
                            onClick={(e) => openCancel(b, e)}
                          >
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
                <p className="font-medium">
                  {selectedBooking.client ? formatClientName(selectedBooking.client) : '—'}
                </p>
              </div>
              {selectedBooking.client?.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('common:phone')}</p>
                  <p className="font-medium">{selectedBooking.client.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard:table.service', { ns: 'dashboard' })}</p>
                <p className="font-medium">{selectedBooking.service?.name ?? '—'}</p>
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
                  <Button
                    className="flex-1 gradient-primary border-0 text-white"
                    disabled={confirmMutation.isPending}
                    onClick={() => { confirmMutation.mutate(selectedBooking.id, { onSuccess: () => setSelectedBooking(null) }); }}
                  >
                    {t('backoffice:bookings.confirm')}
                  </Button>
                )}
                {selectedBooking.status === 'CONFIRMED' && (
                  <Button
                    className="flex-1 gradient-primary border-0 text-white"
                    disabled={completeMutation.isPending}
                    onClick={() => { completeMutation.mutate(selectedBooking.id, { onSuccess: () => setSelectedBooking(null) }); }}
                  >
                    {t('backoffice:bookings.markComplete')}
                  </Button>
                )}
                {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'CONFIRMED') && (
                  <Button
                    variant="outline" className="flex-1"
                    onClick={() => { setActionBooking(selectedBooking); setRescheduleDate(selectedBooking.scheduledDate); setRescheduleTime(selectedBooking.scheduledTime); setDialogMode('reschedule'); }}
                  >
                    {t('backoffice:bookings.reschedule')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel Dialog */}
      <Dialog open={dialogMode === 'cancel'} onOpenChange={(open) => { if (!open) setDialogMode(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="cancel-reason">Reason</Label>
              <Textarea
                id="cancel-reason"
                className="mt-1.5"
                placeholder="Reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {t('common:back')}
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              onClick={handleCancel}
            >
              {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={dialogMode === 'reschedule'} onOpenChange={(open) => { if (!open) setDialogMode(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('backoffice:bookings.reschedule')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="reschedule-date">{t('dashboard:table.date', { ns: 'dashboard' })}</Label>
              <Input
                id="reschedule-date"
                type="date"
                className="mt-1.5"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reschedule-time">{t('dashboard:table.time', { ns: 'dashboard' })}</Label>
              <Input
                id="reschedule-time"
                type="time"
                className="mt-1.5"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {t('common:back')}
            </Button>
            <Button
              className="gradient-primary border-0 text-white"
              disabled={!rescheduleDate || !rescheduleTime || rescheduleMutation.isPending}
              onClick={handleReschedule}
            >
              {rescheduleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common:save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Booking Dialog */}
      <Dialog open={dialogMode === 'newBooking'} onOpenChange={(open) => { if (!open) setDialogMode(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('backoffice:bookings.newBooking', { defaultValue: 'New Booking' })}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Client</Label>
              <Select value={newClientId} onValueChange={setNewClientId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {formatClientName(c)} — {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('dashboard:table.service', { ns: 'dashboard' })}</Label>
              <Select value={newServiceId} onValueChange={setNewServiceId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {services.filter((s) => s.isActive).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {s.durationMinutes} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('dashboard:table.date', { ns: 'dashboard' })}</Label>
              <Input
                type="date"
                className="mt-1.5"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div>
              <Label>{t('dashboard:table.time', { ns: 'dashboard' })}</Label>
              <Input
                type="time"
                className="mt-1.5"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                className="mt-1.5"
                placeholder="Optional notes..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {t('common:back')}
            </Button>
            <Button
              className="gradient-primary border-0 text-white"
              disabled={!isNewBookingValid || createMutation.isPending}
              onClick={handleCreateBooking}
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

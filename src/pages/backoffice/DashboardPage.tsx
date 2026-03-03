import { lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/molecules/KPICard';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { formatClientName } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { CalendarDays, Clock, XCircle, Scissors, Plus, Settings, ArrowRight, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { startOfWeek, addDays, format } from 'date-fns';

const DashboardWeeklyTrendCard = lazy(() => import('@/components/organisms/DashboardWeeklyTrendCard'));

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: services = [] } = useServices();
  const { data: onboardingStatus } = useOnboardingStatus();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const summary = useMemo(
    () => ({
      todayBookings: bookings.filter((b) => b.scheduledDate === today).length,
      upcoming: bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
      cancellations: bookings.filter((b) => b.status === 'CANCELLED').length,
      activeServices: services.filter((s) => s.isActive).length,
    }),
    [bookings, services, today],
  );
  const weekData = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = bookings.filter((b) => b.scheduledDate === dayStr).length;
      return { day: format(day, 'EEE'), bookings: count };
    });
  }, [bookings]);
  const recentBookings = useMemo(() => bookings.slice(0, 5), [bookings]);
  const onboardingSteps = useMemo(
    () => [
      { key: 'servicesConfigured', done: onboardingStatus?.hasServices ?? false },
      { key: 'whatsappConnected', done: onboardingStatus?.hasWhatsApp ?? false },
      { key: 'hoursConfigured', done: onboardingStatus?.hasHours ?? false },
      { key: 'readyToGoLive', done: onboardingStatus?.isComplete ?? false },
    ],
    [onboardingStatus],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('dashboard:title')}</h1>
        <p className="text-muted-foreground">{t('dashboard:welcome')}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t('dashboard:kpi.todayBookings')} value={summary.todayBookings} icon={CalendarDays} />
        <KPICard title={t('dashboard:kpi.upcoming')} value={summary.upcoming} icon={Clock} />
        <KPICard title={t('dashboard:kpi.cancellations')} value={summary.cancellations} icon={XCircle} />
        <KPICard title={t('dashboard:kpi.activeServices')} value={summary.activeServices} icon={Scissors} />
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }
      >
        <DashboardWeeklyTrendCard
          title={t('dashboard:weeklyTrend', { defaultValue: 'This Week' })}
          data={weekData}
        />
      </Suspense>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">{t('dashboard:recentBookings')}</CardTitle>
            <Link to={ROUTES.TENANT.BOOKINGS}>
              <Button variant="ghost" size="sm">{t('common:viewAll')} <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('common:noData', { defaultValue: 'No bookings yet' })}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard:table.client')}</TableHead>
                    <TableHead>{t('dashboard:table.service')}</TableHead>
                    <TableHead>{t('dashboard:table.date')}</TableHead>
                    <TableHead>{t('dashboard:table.time')}</TableHead>
                    <TableHead>{t('dashboard:table.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.client ? formatClientName(b.client) : '—'}</TableCell>
                      <TableCell>{b.service?.name ?? '—'}</TableCell>
                      <TableCell>{b.scheduledDate}</TableCell>
                      <TableCell>{b.scheduledTime}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Onboarding */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{t('dashboard:quickActions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={ROUTES.TENANT.SERVICES}>
                <Button variant="outline" className="w-full justify-start gap-2"><Plus className="h-4 w-4" /> {t('dashboard:quickActions.addService')}</Button>
              </Link>
              <Link to={ROUTES.TENANT.HOURS}>
                <Button variant="outline" className="w-full justify-start gap-2"><Settings className="h-4 w-4" /> {t('dashboard:quickActions.configureHours')}</Button>
              </Link>
              <Link to={ROUTES.TENANT.BOOKINGS}>
                <Button variant="outline" className="w-full justify-start gap-2"><CalendarDays className="h-4 w-4" /> {t('dashboard:quickActions.viewBookings')}</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{t('dashboard:onboarding.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onboardingSteps.map((step) => (
                <div key={step.key} className="flex items-center gap-3 text-sm">
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={step.done ? '' : 'text-muted-foreground'}>
                    {t(`dashboard:onboarding.${step.key}`)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

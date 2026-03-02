import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, addDays, format, parseISO, isSameDay } from 'date-fns';

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { onboardingComplete, user } = useAuthStore();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: services = [] } = useServices();
  const { data: onboardingStatus } = useOnboardingStatus();

  // Redirect owner to onboarding if not completed
  const needsOnboarding = (user?.role === 'OWNER') && !onboardingComplete;
  if (needsOnboarding) {
    return <Navigate to={ROUTES.TENANT.ONBOARDING} replace />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.scheduledDate === today).length;
  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const cancellations = bookings.filter((b) => b.status === 'CANCELLED').length;
  const activeServices = services.filter((s) => s.isActive).length;

  // Weekly chart data
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = bookings.filter((b) => b.scheduledDate === dayStr).length;
    return { day: format(day, 'EEE'), bookings: count };
  });

  const onboardingSteps = [
    { key: 'servicesConfigured', done: onboardingStatus?.hasServices ?? false },
    { key: 'whatsappConnected', done: onboardingStatus?.hasWhatsApp ?? false },
    { key: 'hoursConfigured', done: true },
    { key: 'readyToGoLive', done: onboardingStatus?.isComplete ?? false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('dashboard:title')}</h1>
        <p className="text-muted-foreground">{t('dashboard:welcome')}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t('dashboard:kpi.todayBookings')} value={todayBookings} icon={CalendarDays} />
        <KPICard title={t('dashboard:kpi.upcoming')} value={upcoming} icon={Clock} />
        <KPICard title={t('dashboard:kpi.cancellations')} value={cancellations} icon={XCircle} />
        <KPICard title={t('dashboard:kpi.activeServices')} value={activeServices} icon={Scissors} />
      </div>

      {/* Weekly chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">{t('dashboard:weeklyTrend', { defaultValue: 'This Week' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                  {bookings.slice(0, 5).map((b) => (
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

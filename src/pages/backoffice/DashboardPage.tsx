import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/molecules/KPICard';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { mockBookings, mockKPIs } from '@/mocks/data';
import { ROUTES } from '@/constants/routes';
import { CalendarDays, Clock, XCircle, Scissors, Plus, Settings, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);

  const onboardingSteps = [
    { key: 'whatsappConnected', done: true },
    { key: 'presetApplied', done: true },
    { key: 'servicesConfigured', done: true },
    { key: 'hoursConfigured', done: true },
    { key: 'readyToGoLive', done: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('dashboard:title')}</h1>
        <p className="text-muted-foreground">{t('dashboard:welcome')}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t('dashboard:kpi.todayBookings')} value={mockKPIs.todayBookings} icon={CalendarDays} trend="+12%" />
        <KPICard title={t('dashboard:kpi.upcoming')} value={mockKPIs.upcoming} icon={Clock} />
        <KPICard title={t('dashboard:kpi.cancellations')} value={mockKPIs.cancellations} icon={XCircle} />
        <KPICard title={t('dashboard:kpi.activeServices')} value={mockKPIs.activeServices} icon={Scissors} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">{t('dashboard:recentBookings')}</CardTitle>
            <Link to={ROUTES.BACKOFFICE.BOOKINGS}>
              <Button variant="ghost" size="sm">{t('common:viewAll')} <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
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
                {mockBookings.slice(0, 5).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.clientName}</TableCell>
                    <TableCell>{b.serviceName}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.time}</TableCell>
                    <TableCell><StatusBadge status={b.status} label={t(`common:${b.status}`)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions + Onboarding */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{t('dashboard:quickActions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={ROUTES.BACKOFFICE.SERVICES}>
                <Button variant="outline" className="w-full justify-start gap-2"><Plus className="h-4 w-4" /> {t('dashboard:quickActions.addService')}</Button>
              </Link>
              <Link to={ROUTES.BACKOFFICE.HOURS}>
                <Button variant="outline" className="w-full justify-start gap-2"><Settings className="h-4 w-4" /> {t('dashboard:quickActions.configureHours')}</Button>
              </Link>
              <Link to={ROUTES.BACKOFFICE.BOOKINGS}>
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

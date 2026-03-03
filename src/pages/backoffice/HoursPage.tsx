import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useHours, useUpdateHours } from '@/hooks/useHours';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { ROUTES } from '@/constants/routes';
import type { BusinessHours, DayOfWeek } from '@/types';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DEFAULT_HOURS: BusinessHours[] = DAYS.map((day, i) => ({
  dayOfWeek: day,
  isOpen: i < 6,
  openTime: i < 5 ? '09:00' : '10:00',
  closeTime: i < 5 ? '19:00' : i === 5 ? '18:00' : '14:00',
}));

export default function HoursPage() {
  const { t } = useTranslation('backoffice');
  const { data: onboardingStatus } = useOnboardingStatus();
  const { data: serverHours, isLoading } = useHours();
  const updateMutation = useUpdateHours();
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);

  useEffect(() => {
    if (serverHours && serverHours.length > 0) {
      // Sort by canonical order
      const sorted = [...serverHours].sort(
        (a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek),
      );
      setHours(sorted);
    }
  }, [serverHours]);

  const toggleDay = (day: DayOfWeek) => {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === day ? { ...h, isOpen: !h.isOpen } : h)));
  };

  const setTime = (day: DayOfWeek, field: 'openTime' | 'closeTime', value: string) => {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === day ? { ...h, [field]: value } : h)));
  };

  const handleSave = () => {
    updateMutation.mutate({ hours: hours.map((h) => ({ dayOfWeek: h.dayOfWeek, isOpen: h.isOpen, openTime: h.openTime, closeTime: h.closeTime })) });
  };

  return (
    <div className="space-y-8">
      {onboardingStatus?.tenantStatus !== 'READY' && (
        <div>
          <Link to={ROUTES.TENANT.ONBOARDING}>
            <Button variant="ghost" className="px-0">Back to onboarding</Button>
          </Link>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-display font-bold">{t('hours.title')}</h1>
        <p className="text-muted-foreground">{t('hours.subtitle')}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-display">{t('hours.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            hours.map((h) => (
              <div key={h.dayOfWeek} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <Switch checked={h.isOpen} onCheckedChange={() => toggleDay(h.dayOfWeek)} />
                  <span className="font-medium w-28">{t(`hours.days.${h.dayOfWeek}`)}</span>
                </div>
                {h.isOpen ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Input
                      type="time"
                      className="w-24 px-2 py-1 h-8"
                      value={h.openTime}
                      onChange={(e) => setTime(h.dayOfWeek, 'openTime', e.target.value)}
                    />
                    <span className="text-muted-foreground">—</span>
                    <Input
                      type="time"
                      className="w-24 px-2 py-1 h-8"
                      value={h.closeTime}
                      onChange={(e) => setTime(h.dayOfWeek, 'closeTime', e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">{t('hours.closed')}</span>
                )}
              </div>
            ))
          )}
          <Button
            className="mt-4 gradient-primary border-0 text-white"
            disabled={updateMutation.isPending}
            onClick={handleSave}
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {t('common:save', { ns: 'common' })}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

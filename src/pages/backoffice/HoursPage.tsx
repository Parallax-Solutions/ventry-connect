import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { mockBusinessHours } from '@/mocks/data';
import type { BusinessHours } from '@/types';

export default function HoursPage() {
  const { t } = useTranslation('backoffice');
  const [hours, setHours] = useState<BusinessHours[]>(mockBusinessHours);

  const toggleDay = (day: string) => {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, isOpen: !h.isOpen } : h)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('hours.title')}</h1>
        <p className="text-muted-foreground">{t('hours.subtitle')}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-display">{t('hours.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.map((h) => (
            <div key={h.day} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-4">
                <Switch checked={h.isOpen} onCheckedChange={() => toggleDay(h.day)} />
                <span className="font-medium w-28">{t(`hours.days.${h.day}`)}</span>
              </div>
              {h.isOpen ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-md bg-muted">{h.openTime}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="px-3 py-1 rounded-md bg-muted">{h.closeTime}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{t('hours.closed')}</span>
              )}
            </div>
          ))}
          <Button className="mt-4 gradient-primary border-0 text-white">{t('common:save', { ns: 'common' })}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

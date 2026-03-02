import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { mockServices } from '@/mocks/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Scissors, Clock, DollarSign } from 'lucide-react';
import type { Service } from '@/types';

/** Format price from centavos to display string */
const formatPrice = (centavos: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(centavos / 100);

export default function ServicesPage() {
  const { t } = useTranslation('backoffice');
  const [services] = useState<Service[]>(mockServices);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('services.title')}</h1>
          <p className="text-muted-foreground">{t('services.subtitle')}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-white"><Plus className="h-4 w-4 mr-1" /> {t('services.addService')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{t('services.addService')}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>{t('services.serviceName')}</Label><Input className="mt-1.5" /></div>
              <div><Label>{t('services.duration')}</Label><Input type="number" className="mt-1.5" /></div>
              <div><Label>{t('services.price')} (COP)</Label><Input type="number" className="mt-1.5" placeholder="15000" /></div>
              <div><Label>{t('services.description')}</Label><Input className="mt-1.5" /></div>
              <div className="flex items-center gap-2"><Switch defaultChecked /><Label>{t('services.active')}</Label></div>
              <Button className="w-full gradient-primary border-0 text-white">{t('common:save', { ns: 'common' })}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <EmptyState icon={<Scissors className="h-12 w-12" />} title={t('services.emptyState.title')} description={t('services.emptyState.description')} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold">{s.name}</h3>
                  <StatusBadge status={s.active ? 'ACTIVE' : 'INACTIVE'} />
                </div>
                {s.description && <p className="text-sm text-muted-foreground mb-4">{s.description}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.duration} {t('common:minutes', { ns: 'common' })}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {formatPrice(s.price, s.currency)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

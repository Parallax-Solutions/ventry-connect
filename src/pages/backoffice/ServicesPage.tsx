import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useServices, useCreateService, useUpdateService } from '@/hooks/useServices';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Scissors, Clock, DollarSign, Loader2, Pencil } from 'lucide-react';
import type { Service } from '@/types';

const formatPrice = (centavos: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(centavos / 100);

type DialogMode = 'create' | 'edit' | null;

export default function ServicesPage() {
  const { t } = useTranslation('backoffice');
  const { data: services = [], isLoading } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [priceInCents, setPriceInCents] = useState('');
  const [currency] = useState('COP');
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setName('');
    setDescription('');
    setDurationMinutes('');
    setPriceInCents('');
    setIsActive(true);
    setEditingService(null);
    setDialogMode('create');
  };

  const openEdit = (s: Service) => {
    setName(s.name);
    setDescription(s.description ?? '');
    setDurationMinutes(String(s.durationMinutes));
    setPriceInCents(String(s.priceInCents));
    setIsActive(s.isActive);
    setEditingService(s);
    setDialogMode('edit');
  };

  const handleSave = () => {
    const duration = parseInt(durationMinutes, 10);
    const price = parseInt(priceInCents, 10);
    if (!name || isNaN(duration) || isNaN(price)) return;

    if (dialogMode === 'create') {
      createMutation.mutate(
        { name, description: description || undefined, durationMinutes: duration, priceInCents: price, currency },
        { onSuccess: () => setDialogMode(null) },
      );
    } else if (dialogMode === 'edit' && editingService) {
      updateMutation.mutate(
        { id: editingService.id, data: { name, description: description || undefined, durationMinutes: duration, priceInCents: price, isActive } },
        { onSuccess: () => setDialogMode(null) },
      );
    }
  };

  const toggleActive = (s: Service) => {
    updateMutation.mutate({ id: s.id, data: { isActive: !s.isActive } });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isValid = name.trim() && durationMinutes && priceInCents;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('services.title')}</h1>
          <p className="text-muted-foreground">{t('services.subtitle')}</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> {t('services.addService')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={<Scissors className="h-12 w-12" />}
          title={t('services.emptyState.title')}
          description={t('services.emptyState.description')}
          action={
            <Button className="gradient-primary border-0 text-white" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> {t('services.addService')}
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold">{s.name}</h3>
                    <StatusBadge status={s.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                  {s.description && <p className="text-sm text-muted-foreground mb-4">{s.description}</p>}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.durationMinutes} {t('common:minutes', { ns: 'common' })}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {formatPrice(s.priceInCents, s.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={s.isActive}
                        onCheckedChange={() => toggleActive(s)}
                        disabled={updateMutation.isPending}
                      />
                      <span className="text-xs text-muted-foreground">{s.isActive ? t('services.active') : 'Inactive'}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={dialogMode !== null} onOpenChange={(open) => { if (!open) setDialogMode(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              {dialogMode === 'create' ? t('services.addService') : 'Edit Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="svc-name">{t('services.serviceName')}</Label>
              <Input id="svc-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="svc-description">{t('services.description')}</Label>
              <Input id="svc-description" className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="svc-duration">{t('services.duration')} (min)</Label>
                <Input id="svc-duration" type="number" min="5" className="mt-1.5" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="svc-price">{t('services.price')} (centavos COP)</Label>
                <Input id="svc-price" type="number" min="0" className="mt-1.5" placeholder="15000" value={priceInCents} onChange={(e) => setPriceInCents(e.target.value)} />
              </div>
            </div>
            {dialogMode === 'edit' && (
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>{t('services.active')}</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>{t('common:back', { ns: 'common' })}</Button>
            <Button
              className="gradient-primary border-0 text-white"
              disabled={!isValid || isPending}
              onClick={handleSave}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('common:save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

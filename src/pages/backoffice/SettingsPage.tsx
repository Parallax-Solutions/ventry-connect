import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, ShoppingBag, Heart, Truck, UserCircle, Lock, Users, Shield, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTenant, useUpdateTenant } from '@/hooks/useTenants';

const futureModules = [
  { key: 'payments', icon: CreditCard, description: 'Accept payments through WhatsApp' },
  { key: 'commerce', icon: ShoppingBag, description: 'Sell products via WhatsApp catalog' },
  { key: 'loyalty', icon: Heart, description: 'Reward your returning customers' },
  { key: 'delivery', icon: Truck, description: 'Coordinate deliveries and logistics' },
  { key: 'customerPortal', icon: UserCircle, description: 'Self-service portal for clients' },
];

export default function SettingsPage() {
  const { t } = useTranslation('backoffice');
  const { user } = useAuthStore();
  const tenantId = user?.tenantId ?? '';
  const { data: tenant } = useTenant(tenantId);
  const updateMutation = useUpdateTenant();

  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setContactEmail(tenant.contactEmail);
      setContactPhone(tenant.contactPhone ?? '');
      setTimezone(tenant.timezone ?? 'America/Bogota');
    }
  }, [tenant]);

  const handleSave = () => {
    updateMutation.mutate({
      name,
      contactEmail,
      contactPhone: contactPhone || undefined,
      timezone,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('settings.title')}</h1>
      </div>

      <Tabs defaultValue="general" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
          <TabsTrigger value="team">{t('settings.team')}</TabsTrigger>
          <TabsTrigger value="roles">{t('settings.roles')}</TabsTrigger>
          <TabsTrigger value="future">{t('settings.futureModules')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">{t('settings.general')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="setting-name">Business Name</Label>
                <Input
                  id="setting-name"
                  className="mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="setting-email">Contact Email</Label>
                <Input
                  id="setting-email"
                  type="email"
                  className="mt-1.5"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="setting-phone">Contact Phone</Label>
                <Input
                  id="setting-phone"
                  className="mt-1.5"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="setting-timezone">{t('settings.timezone')}</Label>
                <Input
                  id="setting-timezone"
                  className="mt-1.5"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
              <Button
                className="gradient-primary border-0 text-white"
                disabled={updateMutation.isPending}
                onClick={handleSave}
              >
                {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {t('common:save', { ns: 'common' })}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg">{t('settings.team')}</h3>
              <p className="text-muted-foreground mt-1">{t('settings.teamPlaceholder')}</p>
              <Badge variant="secondary" className="mt-4">{t('common:comingSoon', { ns: 'common' })}</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center py-16">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg">{t('settings.roles')}</h3>
              <p className="text-muted-foreground mt-1">{t('settings.rolesPlaceholder')}</p>
              <Badge variant="secondary" className="mt-4">{t('common:comingSoon', { ns: 'common' })}</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {futureModules.map((mod) => (
              <Card key={mod.key} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <mod.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">{t(`nav.${mod.key}`)}</h3>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                      </div>
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge variant="secondary" className="mt-3">{t('common:comingSoon', { ns: 'common' })}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

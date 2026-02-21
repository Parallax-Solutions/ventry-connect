import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { mockClients } from '@/mocks/data';
import { Users, Search, Info, Calendar, Phone, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ClientsPage() {
  const { t } = useTranslation('backoffice');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('clients.title')}</h1>
        <p className="text-muted-foreground">{t('clients.subtitle')}</p>
      </div>

      <Alert className="border-info/30 bg-info/5">
        <Info className="h-4 w-4 text-info" />
        <AlertDescription className="text-info">{t('clients.futureBanner')}</AlertDescription>
      </Alert>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t('common:search', { ns: 'common' })} className="pl-9" />
      </div>

      {mockClients.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title={t('clients.emptyState.title')} description={t('clients.emptyState.description')} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockClients.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</p>
                  </div>
                </div>
                {c.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3"><Mail className="h-3 w-3" /> {c.email}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('clients.totalBookings')}</span>
                  <Badge variant="secondary">{c.totalBookings}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">{t('clients.lastBooking')}</span>
                  <span className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.lastBooking}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

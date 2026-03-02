import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { mockClients } from '@/mocks/data';
import { Users, Search, Phone, Mail, Plus } from 'lucide-react';

export default function ClientsPage() {
  const { t } = useTranslation('backoffice');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockClients.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('clients.title')}</h1>
          <p className="text-muted-foreground">{t('clients.subtitle')}</p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <Plus className="h-4 w-4 mr-1" /> {t('common:add', { ns: 'common' })} {t('clients.title', { count: 1, defaultValue: 'Client' })}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common:search', { ns: 'common' })}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title={t('clients.emptyState.title')} description={t('clients.emptyState.description')} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                      {c.firstName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.firstName} {c.lastName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                {c.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3"><Mail className="h-3 w-3" /> {c.email}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('common:status', { ns: 'common' })}</span>
                  <span className="text-xs">{c.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

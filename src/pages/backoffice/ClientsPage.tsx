import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, Search, Phone, Mail, Plus, Loader2 } from 'lucide-react';

export default function ClientsPage() {
  const { t } = useTranslation('backoffice');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: clients = [], isLoading } = useClients();
  const createMutation = useCreateClient();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filtered = clients.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || c.phone.includes(q);
  });

  const openCreate = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;
    createMutation.mutate(
      { firstName, lastName, phone, email: email || undefined },
      { onSuccess: () => setDialogOpen(false) },
    );
  };

  const isValid = firstName.trim() && lastName.trim() && phone.trim();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t('clients.title')}</h1>
          <p className="text-muted-foreground">{t('clients.subtitle')}</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> {t('common:add', { ns: 'common' })} Client
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

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
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
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                {c.email && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {c.email}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-first">First Name</Label>
                <Input id="client-first" className="mt-1.5" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="client-last">Last Name</Label>
                <Input id="client-last" className="mt-1.5" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="client-phone">{t('common:phone', { ns: 'common' })}</Label>
              <Input id="client-phone" className="mt-1.5" placeholder="+57 300 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="client-email">Email (optional)</Label>
              <Input id="client-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common:back', { ns: 'common' })}</Button>
            <Button
              className="gradient-primary border-0 text-white"
              disabled={!isValid || createMutation.isPending}
              onClick={handleCreate}
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('common:save', { ns: 'common' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

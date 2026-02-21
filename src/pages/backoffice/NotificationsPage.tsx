import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotificationTemplates } from '@/mocks/data';
import { Bell, MessageSquare, Clock, XCircle } from 'lucide-react';

const typeIcons = { confirmation: MessageSquare, reminder: Clock, cancellation: XCircle };
const typeColors = { confirmation: 'text-success', reminder: 'text-warning', cancellation: 'text-destructive' };

export default function NotificationsPage() {
  const { t } = useTranslation('backoffice');
  const [templates, setTemplates] = useState(mockNotificationTemplates);

  const typeLabels: Record<string, string> = {
    confirmation: t('notifications.confirmation'),
    reminder: t('notifications.reminder'),
    cancellation: t('notifications.cancellation'),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('notifications.title')}</h1>
        <p className="text-muted-foreground">{t('notifications.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {templates.map((tmpl) => {
          const Icon = typeIcons[tmpl.type];
          return (
            <Card key={tmpl.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${typeColors[tmpl.type]}`} />
                  <CardTitle className="font-display text-lg">{typeLabels[tmpl.type]}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">{t('notifications.enabled')}</Label>
                  <Switch checked={tmpl.enabled} onCheckedChange={(checked) => setTemplates((prev) => prev.map((t) => t.id === tmpl.id ? { ...t, enabled: checked } : t))} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t('notifications.template')}</Label>
                  <Textarea className="mt-1.5 min-h-[100px]" defaultValue={tmpl.template} />
                  <p className="text-xs text-muted-foreground mt-1">{t('notifications.variables')}</p>
                </div>
                <div>
                  <Label>{t('notifications.preview')}</Label>
                  <div className="mt-1.5 p-4 rounded-lg bg-muted text-sm">
                    {tmpl.template.replace('{name}', 'Carlos').replace('{service}', 'Haircut').replace('{date}', 'June 15').replace('{time}', '10:00 AM')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Button className="gradient-primary border-0 text-white">{t('common:save', { ns: 'common' })}</Button>
      </div>
    </div>
  );
}

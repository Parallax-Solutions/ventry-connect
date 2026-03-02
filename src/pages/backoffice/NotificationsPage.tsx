import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, XCircle, Loader2 } from 'lucide-react';
import { useNotificationTemplates, useUpsertNotificationTemplates } from '@/hooks/useNotifications';
import type { NotificationTemplate } from '@/types';

type TemplateType = 'confirmation' | 'reminder' | 'cancellation';

const TEMPLATE_TYPES: TemplateType[] = ['confirmation', 'reminder', 'cancellation'];

const typeIcons: Record<TemplateType, React.ElementType> = {
  confirmation: MessageSquare,
  reminder: Clock,
  cancellation: XCircle,
};
const typeColors: Record<TemplateType, string> = {
  confirmation: 'text-success',
  reminder: 'text-warning',
  cancellation: 'text-destructive',
};

// Local editable state shape
interface LocalTemplate {
  type: TemplateType;
  template: string;
  enabled: boolean;
}

const toLocal = (serverTemplates: NotificationTemplate[]): LocalTemplate[] =>
  TEMPLATE_TYPES.map((type) => {
    const found = serverTemplates.find((t) => t.type === type);
    return { type, template: found?.template ?? '', enabled: found?.enabled ?? true };
  });

export default function NotificationsPage() {
  const { t } = useTranslation('backoffice');
  const { data: serverTemplates, isLoading } = useNotificationTemplates();
  const upsertMutation = useUpsertNotificationTemplates();

  const [templates, setTemplates] = useState<LocalTemplate[]>(
    TEMPLATE_TYPES.map((type) => ({ type, template: '', enabled: true })),
  );

  // Sync from server when data arrives
  useEffect(() => {
    if (serverTemplates && serverTemplates.length > 0) {
      setTemplates(toLocal(serverTemplates));
    }
  }, [serverTemplates]);

  const updateTemplate = (type: TemplateType, patch: Partial<Omit<LocalTemplate, 'type'>>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.type === type ? { ...t, ...patch } : t)),
    );
  };

  const handleSave = () => {
    upsertMutation.mutate({ templates });
  };

  const typeLabels: Record<TemplateType, string> = {
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {templates.map((tmpl) => {
            const Icon = typeIcons[tmpl.type];
            return (
              <Card key={tmpl.type}>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${typeColors[tmpl.type]}`} />
                    <CardTitle className="font-display text-lg">{typeLabels[tmpl.type]}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">{t('notifications.enabled')}</Label>
                    <Switch
                      checked={tmpl.enabled}
                      onCheckedChange={(checked) => updateTemplate(tmpl.type, { enabled: checked })}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label>{t('notifications.template')}</Label>
                  <Textarea
                    className="min-h-[100px]"
                    value={tmpl.template}
                    onChange={(e) => updateTemplate(tmpl.type, { template: e.target.value })}
                    placeholder={t('notifications.templatePlaceholder', {
                      defaultValue: 'Hola {{clientName}}, tu reserva de {{serviceName}} está confirmada para el {{date}} a las {{time}}.',
                    })}
                  />
                  <p className="text-xs text-muted-foreground">{t('notifications.variables', { defaultValue: 'Variables disponibles: {{clientName}}, {{serviceName}}, {{date}}, {{time}}' })}</p>
                </CardContent>
              </Card>
            );
          })}

          <Button
            className="gradient-primary border-0 text-white"
            disabled={upsertMutation.isPending}
            onClick={handleSave}
          >
            {upsertMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t('common:save', { ns: 'common' })}
          </Button>
        </div>
      )}
    </div>
  );
}

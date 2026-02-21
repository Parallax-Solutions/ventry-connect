import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Palette, Eye } from 'lucide-react';
import { useState } from 'react';

export default function BrandingPage() {
  const { t } = useTranslation('backoffice');
  const [color, setColor] = useState('#1a7a6d');
  const [name, setName] = useState('BarberCool Studio');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('branding.title')}</h1>
        <p className="text-muted-foreground">{t('branding.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl">
        <Card>
          <CardHeader><CardTitle className="font-display">{t('branding.title')}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>{t('branding.logo')}</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('branding.uploadLogo')}</p>
              </div>
            </div>
            <div>
              <Label>{t('branding.businessName')}</Label>
              <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>{t('branding.primaryColor')}</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-12 w-16" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <Button className="gradient-primary border-0 text-white">{t('common:save', { ns: 'common' })}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display flex items-center gap-2"><Eye className="h-4 w-4" /> {t('branding.preview')}</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <div className="h-3" style={{ backgroundColor: color }} />
              <div className="p-6 text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl mx-auto flex items-center justify-center text-white font-display font-bold text-2xl" style={{ backgroundColor: color }}>
                  {name.charAt(0)}
                </div>
                <h3 className="font-display font-bold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">WhatsApp Booking</p>
                <button className="px-6 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: color }}>
                  Book Now
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

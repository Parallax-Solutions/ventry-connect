import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, MessageCircle, Scissors, HeartPulse, Sparkles, PawPrint, ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingStep, BusinessType } from '@/types';
import { cn } from '@/lib/utils';

const STEPS: OnboardingStep[] = ['businessInfo', 'connectWhatsApp', 'choosePreset', 'services', 'hours', 'review'];

const presetIcons: Record<BusinessType, any> = {
  barbershop: Scissors,
  clinic: HeartPulse,
  salon: Sparkles,
  vet: PawPrint,
};

export default function OnboardingPage() {
  const { t } = useTranslation('backoffice');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<BusinessType | ''>('');
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">{t('onboarding.title')}</h1>
        <p className="text-muted-foreground">{t('onboarding.subtitle')}</p>
      </div>

      {/* Step Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => setCurrentStep(i)}
              className={cn(
                'flex items-center gap-1.5 font-medium transition-colors',
                i <= currentStep ? 'text-primary' : 'text-muted-foreground',
                i < currentStep && 'text-success',
              )}
            >
              {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span className="hidden md:inline">{t(`onboarding.steps.${step}`)}</span>
            </button>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">{t('onboarding.steps.businessInfo')}</h2>
              <div className="grid gap-4">
                <div><Label>{t('onboarding.businessInfo.name')}</Label><Input placeholder="BarberCool Studio" className="mt-1.5" /></div>
                <div><Label>{t('onboarding.businessInfo.type')}</Label><Input placeholder="Barbershop" className="mt-1.5" /></div>
                <div><Label>{t('onboarding.businessInfo.color')}</Label><Input type="color" defaultValue="#1a7a6d" className="mt-1.5 h-12 w-24" /></div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 text-center py-8">
              <div className="h-20 w-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                <MessageCircle className={cn('h-10 w-10', whatsappConnected ? 'text-success' : 'text-muted-foreground')} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">{t('onboarding.whatsapp.title')}</h2>
                <p className="text-muted-foreground mt-2">{t('onboarding.whatsapp.description')}</p>
              </div>
              {whatsappConnected ? (
                <Badge className="bg-success/15 text-success border-success/30" variant="outline">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('onboarding.whatsapp.connected')}
                </Badge>
              ) : (
                <Button onClick={() => setWhatsappConnected(true)} className="gradient-primary border-0 text-white">
                  {t('onboarding.whatsapp.connect')}
                </Button>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">{t('onboarding.presets.title')}</h2>
              <p className="text-muted-foreground">{t('onboarding.presets.description')}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {(['barbershop', 'clinic', 'salon', 'vet'] as BusinessType[]).map((preset) => {
                  const Icon = presetIcons[preset];
                  return (
                    <button
                      key={preset}
                      onClick={() => setSelectedPreset(preset)}
                      className={cn(
                        'p-6 rounded-xl border-2 text-left transition-all hover:shadow-md',
                        selectedPreset === preset ? 'border-primary bg-primary/5' : 'border-border',
                      )}
                    >
                      <Icon className={cn('h-8 w-8 mb-3', selectedPreset === preset ? 'text-primary' : 'text-muted-foreground')} />
                      <h3 className="font-display font-semibold">{t(`onboarding.presets.${preset}`)}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">{t('onboarding.steps.services')}</h2>
              <p className="text-muted-foreground">{t('services.subtitle')}</p>
              <div className="space-y-3">
                {['Classic Haircut — 30min — $15', 'Beard Trim — 20min — $10', 'Combo — 45min — $22'].map((s) => (
                  <div key={s} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <span className="text-sm font-medium">{s}</span>
                    <Badge className="bg-success/15 text-success border-success/30" variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">{t('services.addService')}</Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">{t('onboarding.steps.hours')}</h2>
              <p className="text-muted-foreground">{t('hours.subtitle')}</p>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <div key={d} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium">{d}</span>
                  <Badge variant="outline" className={i < 6 ? 'bg-success/15 text-success border-success/30' : 'text-muted-foreground'}>
                    {i < 6 ? '09:00 - 19:00' : 'Closed'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 text-center py-8">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">{t('onboarding.review.title')}</h2>
                <p className="text-muted-foreground mt-2">{t('onboarding.review.description')}</p>
              </div>
              <Button size="lg" className="gradient-primary border-0 text-white px-12">
                {t('common:goLive', { ns: 'common' })} 🚀
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('common:back', { ns: 'common' })}
        </Button>
        {currentStep < STEPS.length - 1 && (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            {t('common:next', { ns: 'common' })} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Rocket, Plus, Loader2 } from 'lucide-react';
import WhatsAppSetupPanel from '@/components/organisms/WhatsAppSetupPanel';
import { useServices } from '@/hooks/useServices';
import { useCompleteOnboarding, useOnboardingStatus } from '@/hooks/useOnboarding';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const STEPS = ['connectWhatsApp', 'services', 'hours', 'review'] as const;
type OnboardingStep = (typeof STEPS)[number];

export default function OnboardingPage() {
  const { t } = useTranslation('backoffice');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: status, isLoading: statusLoading } = useOnboardingStatus();
  const completeOnboarding = useCompleteOnboarding();

  const handleGoLive = () => {
    completeOnboarding.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.TENANT.DASHBOARD, { replace: true }),
    });
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep] as OnboardingStep;
  const stepCompletion = [
    status?.hasWhatsApp ?? false,
    status?.hasServices ?? false,
    status?.hasHours ?? false,
    status?.canComplete ?? false,
  ];
  const maxUnlockedStep = stepCompletion.findIndex((done) => !done);
  const unlockedStep = maxUnlockedStep === -1 ? STEPS.length - 1 : maxUnlockedStep;
  const canContinue = currentStep < STEPS.length - 1 && stepCompletion[currentStep];
  const canGoLive = status?.canComplete ?? false;
  const isProvisioning = status?.tenantStatus !== 'READY';

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {!isProvisioning && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to={ROUTES.TENANT.DASHBOARD}>Dashboard</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('onboarding.title')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div>
        <h1 className="text-2xl font-display font-bold">{t('onboarding.title')}</h1>
        <p className="text-muted-foreground">{t('onboarding.subtitle')}</p>
      </div>

      {/* Step Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setCurrentStep(Math.min(i, unlockedStep))}
              className={cn(
                'flex items-center gap-1.5 font-medium transition-colors',
                i <= currentStep ? 'text-primary' : 'text-muted-foreground',
                i < currentStep && 'text-success',
              )}
            >
              {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span className="hidden md:inline">{t(`onboarding.steps.${s}`)}</span>
            </button>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {/* Step 0: WhatsApp */}
          {step === 'connectWhatsApp' && (
            <div className="space-y-6 py-4">
              <div className="space-y-2 text-center">
                <h2 className="font-display font-semibold text-xl">{t('onboarding.whatsapp.title')}</h2>
                <p className="text-muted-foreground">{t('onboarding.whatsapp.description')}</p>
              </div>
              <WhatsAppSetupPanel embedded onConfigured={() => setCurrentStep(1)} />
            </div>
          )}

          {/* Step 1: Services */}
          {step === 'services' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">{t('onboarding.steps.services')}</h2>
              <p className="text-muted-foreground">{t('services.subtitle')}</p>
              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No services yet. Add your first service to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div>
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{s.durationMinutes} min</span>
                      </div>
                      <Badge className={s.isActive ? 'bg-success/15 text-success border-success/30' : ''} variant="outline">
                        {s.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              <Link to={ROUTES.TENANT.SERVICES}>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> {t('services.addService')}
                </Button>
              </Link>
              {!status?.hasServices && (
                <p className="text-sm text-muted-foreground text-center">Add at least one service to unlock the next step.</p>
              )}
            </div>
          )}

          {/* Step 2: Hours */}
          {step === 'hours' && (
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
              <Link to={ROUTES.TENANT.HOURS}>
                <Button variant="outline" className="w-full mt-2">
                  Configure hours
                </Button>
              </Link>
              {!status?.hasHours && (
                <p className="text-sm text-muted-foreground text-center">Save your business hours before reviewing the setup.</p>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-6 text-center py-8">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">{t('onboarding.review.title')}</h2>
                <p className="text-muted-foreground mt-2">{t('onboarding.review.description')}</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {status?.hasWhatsApp
                    ? <CheckCircle2 className="h-4 w-4 text-success" />
                    : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={status?.hasWhatsApp ? '' : 'text-muted-foreground'}>WhatsApp connected</span>
                </div>
                <div className="flex items-center gap-2">
                  {status?.hasServices
                    ? <CheckCircle2 className="h-4 w-4 text-success" />
                    : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={status?.hasServices ? '' : 'text-muted-foreground'}>Services configured</span>
                </div>
                <div className="flex items-center gap-2">
                  {status?.hasHours
                    ? <CheckCircle2 className="h-4 w-4 text-success" />
                    : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={status?.hasHours ? '' : 'text-muted-foreground'}>Business hours configured</span>
                </div>
              </div>
              <Button
                size="lg"
                className="gradient-primary border-0 text-white px-12"
                onClick={handleGoLive}
                disabled={!canGoLive || completeOnboarding.isPending}
              >
                {completeOnboarding.isPending ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
                {t('common:goLive', { ns: 'common' })} <Rocket className="h-5 w-5 ml-2" />
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
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canContinue}>
            {t('common:next', { ns: 'common' })} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

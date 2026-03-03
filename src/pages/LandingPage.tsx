import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  Check,
  DollarSign,
  Download,
  HeartPulse,
  MessageCircle,
  MessageSquare,
  Monitor,
  Palette,
  PawPrint,
  Rocket,
  Scissors,
  Shield,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

type LandingCopyItem = {
  title: string;
  description: string;
};

type LandingStep = LandingCopyItem & {
  step: string;
};

type LandingVertical = LandingCopyItem & {
  icon: string;
};

type LandingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

type LandingFaq = {
  question: string;
  answer: string;
};

export default function LandingPage() {
  const { t } = useTranslation('landing');

  const painPoints = t('painPoints.items', { returnObjects: true }) as LandingCopyItem[];
  const steps = t('howItWorks.steps', { returnObjects: true }) as LandingStep[];
  const features = t('features.items', { returnObjects: true }) as LandingCopyItem[];
  const verticals = t('verticals.items', { returnObjects: true }) as LandingVertical[];
  const plans = t('pricing.plans', { returnObjects: true }) as LandingPlan[];
  const faqs = t('faq.items', { returnObjects: true }) as LandingFaq[];

  const painIcons = [MessageCircle, DollarSign, Download, BarChart3];
  const featureIcons = [MessageSquare, Zap, Palette, Settings, Calendar, Bell, Shield, Rocket];
  const verticalIcons: Record<string, typeof Scissors> = {
    scissors: Scissors,
    'heart-pulse': HeartPulse,
    sparkles: Sparkles,
    'paw-print': PawPrint,
  };

  return (
    <div className="overflow-hidden">
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div {...fadeUp}>
              <Badge className="mb-6 border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary hover:bg-primary/15">
                {t('hero.trustedBy')}
              </Badge>
            </motion.div>
            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-display font-bold leading-tight md:text-6xl lg:text-7xl"
            >
              {t('hero.title')}{' '}
              <span className="gradient-text">{t('hero.titleAccent')}</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to={ROUTES.LOGIN}>
                <Button size="lg" className="gradient-primary h-12 border-0 px-8 text-base text-white shadow-lg shadow-primary/25">
                  {t('hero.cta')} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.5 }} className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
              <div className="flex h-8 items-center gap-2 bg-muted px-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="grid min-h-[400px] grid-cols-12">
                <div className="col-span-3 space-y-4 bg-primary p-4 text-primary-foreground">
                  <div className="mb-6 flex items-center gap-2">
                    <img src="/favicon.svg" alt="Ventry" className="h-6 w-6 rounded" />
                    <span className="text-sm font-display font-bold">Ventry</span>
                  </div>
                  {['Dashboard', 'Bookings', 'Services', 'Hours', 'WhatsApp'].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2 text-xs ${index === 0 ? 'bg-white/15' : 'text-primary-foreground/60 hover:bg-white/5'}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-9 space-y-4 p-6">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { n: '12', l: 'Today' },
                      { n: '4', l: 'Pending' },
                      { n: '8', l: 'Confirmed' },
                      { n: '6', l: 'Services' },
                    ].map((kpi) => (
                      <div key={kpi.l} className="rounded-xl bg-muted p-3 text-center">
                        <p className="text-2xl font-display font-bold">{kpi.n}</p>
                        <p className="text-xs text-muted-foreground">{kpi.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 rounded-xl bg-muted p-4">
                    {[
                      'Carlos M. - Haircut - 10:00 AM',
                      'Ana G. - Facial - 11:30 AM',
                      'Roberto S. - Beard Trim - 2:00 PM',
                    ].map((booking) => (
                      <div key={booking} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm">
                        <span>{booking}</span>
                        <Badge className="border-success/30 bg-success/15 text-xs text-success" variant="outline">
                          Confirmed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('painPoints.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('painPoints.subtitle')}</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((item, index) => {
              const Icon = painIcons[index];
              return (
                <motion.div key={item.title} {...stagger} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Card className="h-full border-destructive/10 bg-card transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                        <Icon className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="mb-2 text-lg font-display font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('solution.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('solution.subtitle')}</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {(['whatsapp', 'backoffice'] as const).map((key, index) => {
              const featuresList = t(`solution.${key}.features`, { returnObjects: true }) as string[];
              return (
                <motion.div key={key} {...stagger} transition={{ duration: 0.4, delay: index * 0.15 }}>
                  <Card className="h-full overflow-hidden">
                    <div className={`h-2 ${index === 0 ? 'bg-success' : 'gradient-primary'}`} />
                    <CardContent className="p-8">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        {index === 0 ? <Smartphone className="h-6 w-6 text-primary" /> : <Monitor className="h-6 w-6 text-primary" />}
                      </div>
                      <h3 className="mb-2 text-xl font-display font-bold">{t(`solution.${key}.title`)}</h3>
                      <p className="mb-6 text-muted-foreground">{t(`solution.${key}.description`)}</p>
                      <ul className="space-y-3">
                        {featuresList.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 shrink-0 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('howItWorks.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('howItWorks.subtitle')}</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div key={step.step} {...stagger} transition={{ duration: 0.4, delay: index * 0.1 }} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-xl font-display font-bold text-white shadow-lg shadow-primary/25">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-display font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('features.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('features.subtitle')}</p>
          </motion.div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <motion.div key={feature.title} {...stagger} transition={{ duration: 0.4, delay: index * 0.08 }}>
                  <Card className="group h-full transition-all hover:border-primary/20 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mb-2 font-display font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('verticals.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('verticals.subtitle')}</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verticals.map((vertical, index) => {
              const Icon = verticalIcons[vertical.icon] ?? Scissors;
              return (
                <motion.div key={vertical.title} {...stagger} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Card className="h-full text-center transition-shadow hover:shadow-lg">
                    <CardContent className="p-8">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                        <Icon className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="mb-2 text-lg font-display font-semibold">{vertical.title}</h3>
                      <p className="text-sm text-muted-foreground">{vertical.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('pricing.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('pricing.subtitle')}</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div key={plan.name} {...stagger} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <Card className={`relative h-full ${plan.popular ? 'scale-105 border-accent shadow-xl shadow-accent/10' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="border-0 bg-accent px-4 text-accent-foreground">
                        <Star className="mr-1 h-3 w-3" /> Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-display font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                    <div className="my-6">
                      <span className="text-4xl font-display font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <ul className="mb-8 space-y-3 text-left">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 shrink-0 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.popular ? 'gradient-primary border-0 text-white' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold md:text-4xl">{t('faq.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('faq.subtitle')}</p>
          </motion.div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-xl border bg-card px-6">
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <div className="gradient-primary rounded-3xl p-12 text-white md:p-16">
              <h2 className="text-3xl font-display font-bold md:text-4xl">{t('finalCta.title')}</h2>
              <p className="mt-4 text-lg text-white/80">{t('finalCta.subtitle')}</p>
              <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
                <Input
                  placeholder={t('finalCta.placeholder')}
                  className="h-12 border-white/20 bg-white/15 text-white placeholder:text-white/50"
                />
                <Button size="lg" className="h-12 whitespace-nowrap bg-white px-8 font-semibold text-primary hover:bg-white/90">
                  {t('finalCta.cta')}
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/60">{t('finalCta.privacy')}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

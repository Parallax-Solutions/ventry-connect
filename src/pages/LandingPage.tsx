import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ROUTES } from '@/constants/routes';
import {
  MessageCircle, ArrowRight, Smartphone, DollarSign, Download, BarChart3,
  Zap, Settings, Palette, Calendar, Bell, Shield, Rocket,
  Scissors, HeartPulse, Sparkles, PawPrint, Check, Star,
  MessageSquare, Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function LandingPage() {
  const { t } = useTranslation('landing');

  const painPoints = t('painPoints.items', { returnObjects: true }) as Array<{ title: string; description: string }>;
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{ step: string; title: string; description: string }>;
  const features = t('features.items', { returnObjects: true }) as Array<{ title: string; description: string }>;
  const verticals = t('verticals.items', { returnObjects: true }) as Array<{ title: string; description: string; icon: string }>;
  const plans = t('pricing.plans', { returnObjects: true }) as Array<any>;
  const faqs = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>;

  const painIcons = [MessageCircle, DollarSign, Download, BarChart3];
  const featureIcons = [MessageSquare, Zap, Palette, Settings, Calendar, Bell, Shield, Rocket];
  const verticalIcons: Record<string, any> = { scissors: Scissors, 'heart-pulse': HeartPulse, sparkles: Sparkles, 'paw-print': PawPrint };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                🚀 {t('hero.trustedBy')}
              </Badge>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              {t('hero.title')}{' '}
              <span className="gradient-text">{t('hero.titleAccent')}</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </motion.p>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.LOGIN}>
                <Button size="lg" className="gradient-primary border-0 text-white text-base px-8 h-12 shadow-lg shadow-primary/25">
                  {t('hero.cta')} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                {t('hero.ctaSecondary')}
              </Button>
            </motion.div>
          </div>

          {/* Mock product screenshot */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.5 }} className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="h-8 bg-muted flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-12 min-h-[400px]">
                <div className="col-span-3 bg-primary p-4 text-primary-foreground space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-6 w-6 rounded bg-accent flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-display font-bold text-sm">Ventry</span>
                  </div>
                  {['Dashboard', 'Bookings', 'Services', 'Clients', 'Settings'].map((item, i) => (
                    <div key={item} className={`text-xs py-2 px-3 rounded-lg ${i === 0 ? 'bg-white/15' : 'text-primary-foreground/60 hover:bg-white/5'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-9 p-6 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[{ n: '12', l: 'Today' }, { n: '48', l: 'This Week' }, { n: '2', l: 'Cancelled' }, { n: '6', l: 'Services' }].map((kpi) => (
                      <div key={kpi.l} className="bg-muted rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold font-display">{kpi.n}</p>
                        <p className="text-xs text-muted-foreground">{kpi.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted rounded-xl p-4 space-y-2">
                    {['Carlos M. — Haircut — 10:00 AM', 'Ana G. — Combo — 11:30 AM', 'Roberto S. — Beard — 2:00 PM'].map((b) => (
                      <div key={b} className="flex items-center justify-between text-sm py-2 px-3 bg-card rounded-lg">
                        <span>{b}</span>
                        <Badge className="bg-success/15 text-success border-success/30 text-xs" variant="outline">Confirmed</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('painPoints.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('painPoints.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((item, i) => {
              const Icon = painIcons[i];
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <Card className="h-full border-destructive/10 bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('solution.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('solution.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {(['whatsapp', 'backoffice'] as const).map((key, i) => {
              const feats = t(`solution.${key}.features`, { returnObjects: true }) as string[];
              return (
                <motion.div key={key} {...stagger} transition={{ duration: 0.4, delay: i * 0.15 }}>
                  <Card className="h-full overflow-hidden">
                    <div className={`h-2 ${i === 0 ? 'bg-success' : 'gradient-primary'}`} />
                    <CardContent className="p-8">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        {i === 0 ? <Smartphone className="h-6 w-6 text-primary" /> : <Monitor className="h-6 w-6 text-primary" />}
                      </div>
                      <h3 className="font-display font-bold text-xl mb-2">{t(`solution.${key}.title`)}</h3>
                      <p className="text-muted-foreground mb-6">{t(`solution.${key}.description`)}</p>
                      <ul className="space-y-3">
                        {feats.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                            {f}
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

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('howItWorks.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('howItWorks.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-white font-display font-bold text-xl shadow-lg shadow-primary/25">
                  {step.step}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('features.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('features.subtitle')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/20 transition-all group">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verticals */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('verticals.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('verticals.subtitle')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {verticals.map((v, i) => {
              const Icon = verticalIcons[v.icon] || Scissors;
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('pricing.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('pricing.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan: any, i: number) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Card className={`h-full relative ${plan.popular ? 'border-accent shadow-xl shadow-accent/10 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground border-0 px-4">
                        <Star className="h-3 w-3 mr-1" /> Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    <div className="my-6">
                      <span className="text-4xl font-display font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <ul className="space-y-3 text-left mb-8">
                      {(plan.features as string[]).map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          {f}
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

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">{t('faq.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t('faq.subtitle')}</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border px-6">
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl gradient-primary p-12 md:p-16 text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold">{t('finalCta.title')}</h2>
              <p className="mt-4 text-white/80 text-lg">{t('finalCta.subtitle')}</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Input placeholder={t('finalCta.placeholder')} className="bg-white/15 border-white/20 text-white placeholder:text-white/50 h-12" />
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold h-12 px-8 whitespace-nowrap">
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Menu, X, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function LandingHeader() {
  const { t } = useTranslation('landing');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl">Ventry</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm">{t('nav.login')}</Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button size="sm" className="gradient-primary border-0 text-white">{t('nav.getStarted')}</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" className="w-full">{t('nav.login')}</Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button className="w-full gradient-primary border-0 text-white">{t('nav.getStarted')}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

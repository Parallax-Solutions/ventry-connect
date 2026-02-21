import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTenant } from '@/mocks/data';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Settings as SettingsIcon, Wand2, Scissors, Clock, CalendarDays,
  Users, Bell, Palette, Menu, X, MessageCircle, ChevronRight,
  CreditCard, ShoppingBag, Heart, Truck, UserCircle, Lock, Search, User, LogOut,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mainNav = [
  { key: 'dashboard', icon: LayoutDashboard, path: ROUTES.BACKOFFICE.DASHBOARD },
  { key: 'onboarding', icon: Wand2, path: ROUTES.BACKOFFICE.ONBOARDING },
  { key: 'services', icon: Scissors, path: ROUTES.BACKOFFICE.SERVICES },
  { key: 'hours', icon: Clock, path: ROUTES.BACKOFFICE.HOURS },
  { key: 'bookings', icon: CalendarDays, path: ROUTES.BACKOFFICE.BOOKINGS },
  { key: 'clients', icon: Users, path: ROUTES.BACKOFFICE.CLIENTS },
  { key: 'notifications', icon: Bell, path: ROUTES.BACKOFFICE.NOTIFICATIONS },
  { key: 'branding', icon: Palette, path: ROUTES.BACKOFFICE.BRANDING },
  { key: 'settings', icon: SettingsIcon, path: ROUTES.BACKOFFICE.SETTINGS },
];

const futureNav = [
  { key: 'payments', icon: CreditCard },
  { key: 'commerce', icon: ShoppingBag },
  { key: 'loyalty', icon: Heart },
  { key: 'delivery', icon: Truck },
  { key: 'customerPortal', icon: UserCircle },
];

export default function BackofficeLayout() {
  const { t } = useTranslation('backoffice');
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === ROUTES.BACKOFFICE.DASHBOARD) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-sidebar-foreground">Ventry</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {t(`nav.${item.key}`)}
            {isActive(item.path) && <ChevronRight className="h-3 w-3 ml-auto" />}
          </Link>
        ))}

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
            {t('nav.futureModules')}
          </p>
        </div>
        {futureNav.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/30 cursor-not-allowed"
          >
            <item.icon className="h-4 w-4" />
            {t(`nav.${item.key}`)}
            <Lock className="h-3 w-3 ml-auto" />
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-64 bg-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border h-16 flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('topbar.search')} className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-8" />
          </div>

          <div className="flex-1 md:flex-initial" />

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-sm font-medium truncate max-w-[150px]">{mockTenant.name}</span>
              <StatusBadge status={mockTenant.status} />
            </div>
            <LanguageSwitcher variant="ghost" />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t('topbar.myAccount')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" /> {t('topbar.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

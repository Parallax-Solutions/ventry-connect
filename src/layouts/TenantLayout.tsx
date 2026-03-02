import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Settings as SettingsIcon, Scissors, Clock, CalendarDays,
  Users, Bell, Palette, Menu, MessageCircle, ChevronRight,
  CreditCard, ShoppingBag, Heart, Truck, UserCircle, Lock, Search, User, LogOut, UsersRound, MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/types';

interface NavItem {
  key: string;
  icon: React.ElementType;
  path: string;
  roles?: UserRole[];
}

const mainNav: NavItem[] = [
  { key: 'dashboard', icon: LayoutDashboard, path: ROUTES.TENANT.DASHBOARD },
  { key: 'bookings', icon: CalendarDays, path: ROUTES.TENANT.BOOKINGS },
  { key: 'clients', icon: Users, path: ROUTES.TENANT.CLIENTS, roles: ['OWNER', 'ADMIN'] },
  { key: 'services', icon: Scissors, path: ROUTES.TENANT.SERVICES, roles: ['OWNER', 'ADMIN'] },
  { key: 'hours', icon: Clock, path: ROUTES.TENANT.HOURS, roles: ['OWNER', 'ADMIN'] },
  { key: 'team', icon: UsersRound, path: ROUTES.TENANT.TEAM, roles: ['OWNER'] },
  { key: 'whatsapp', icon: MessageSquare, path: ROUTES.TENANT.WHATSAPP_SETUP, roles: ['OWNER'] },
  { key: 'notifications', icon: Bell, path: ROUTES.TENANT.NOTIFICATIONS, roles: ['OWNER', 'ADMIN'] },
  { key: 'branding', icon: Palette, path: ROUTES.TENANT.BRANDING, roles: ['OWNER', 'ADMIN'] },
  { key: 'settings', icon: SettingsIcon, path: ROUTES.TENANT.SETTINGS, roles: ['OWNER'] },
];

const futureNav = [
  { key: 'payments', icon: CreditCard },
  { key: 'commerce', icon: ShoppingBag },
  { key: 'loyalty', icon: Heart },
  { key: 'delivery', icon: Truck },
  { key: 'customerPortal', icon: UserCircle },
];

export default function TenantLayout() {
  const { t } = useTranslation('backoffice');
  const location = useLocation();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isOnboarding = location.pathname === ROUTES.TENANT.ONBOARDING;

  const userRole = user?.role ?? 'OWNER';

  const visibleNav = mainNav.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  const isActive = (path: string) => {
    if (path === ROUTES.TENANT.DASHBOARD) return location.pathname === path;
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
        {visibleNav.map((item) => (
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

  // During onboarding, show a minimal layout without sidebar
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border h-16 flex items-center px-4 lg:px-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">Ventry</span>
          </div>
          <div className="flex-1" />
          <LanguageSwitcher variant="ghost" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    );
  }

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
            <LanguageSwitcher variant="ghost" />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('topbar.myAccount')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
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

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { isHashRouter } from "@/lib/router";
import ProtectedRoute from "@/components/organisms/ProtectedRoute";
import TenantOnboardingGuard from "@/components/organisms/TenantOnboardingGuard";

const queryClient = new QueryClient();
const Router = isHashRouter ? HashRouter : BrowserRouter;
const LandingLayout = lazy(() => import("@/layouts/LandingLayout"));
const TenantLayout = lazy(() => import("@/layouts/TenantLayout"));
const PlatformLayout = lazy(() => import("@/layouts/PlatformLayout"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const TenantsListPage = lazy(() => import("@/pages/platform/TenantsListPage"));
const TenantDetailPage = lazy(() => import("@/pages/platform/TenantDetailPage"));
const PlatformUsersPage = lazy(() => import("@/pages/platform/PlatformUsersPage"));
const DashboardPage = lazy(() => import("@/pages/backoffice/DashboardPage"));
const OnboardingPage = lazy(() => import("@/pages/backoffice/OnboardingPage"));
const ServicesPage = lazy(() => import("@/pages/backoffice/ServicesPage"));
const HoursPage = lazy(() => import("@/pages/backoffice/HoursPage"));
const BookingsPage = lazy(() => import("@/pages/backoffice/BookingsPage"));
const ClientsPage = lazy(() => import("@/pages/backoffice/ClientsPage"));
const NotificationsPage = lazy(() => import("@/pages/backoffice/NotificationsPage"));
const BrandingPage = lazy(() => import("@/pages/backoffice/BrandingPage"));
const SettingsPage = lazy(() => import("@/pages/backoffice/SettingsPage"));
const TeamPage = lazy(() => import("@/pages/tenant/TeamPage"));
const WhatsAppSetupPage = lazy(() => import("@/pages/tenant/WhatsAppSetupPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public */}
              <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Platform Admin */}
              <Route element={<ProtectedRoute allowedRoles={['VENTRY_ADMIN']} />}>
                <Route element={<PlatformLayout />}>
                  <Route path="/platform/tenants" element={<TenantsListPage />} />
                  <Route path="/platform/tenants/:id" element={<TenantDetailPage />} />
                  <Route path="/platform/users" element={<PlatformUsersPage />} />
                </Route>
              </Route>

              {/* Tenant */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'STAFF']} />}>
                <Route element={<TenantOnboardingGuard />}>
                  <Route element={<TenantLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/hours" element={<HoursPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/branding" element={<BrandingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/whatsapp/setup" element={<WhatsAppSetupPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

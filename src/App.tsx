import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Layouts
import LandingLayout from "@/layouts/LandingLayout";
import TenantLayout from "@/layouts/TenantLayout";
import PlatformLayout from "@/layouts/PlatformLayout";
import ProtectedRoute from "@/components/organisms/ProtectedRoute";
import TenantOnboardingGuard from "@/components/organisms/TenantOnboardingGuard";

// Public pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Platform pages
import TenantsListPage from "@/pages/platform/TenantsListPage";
import TenantDetailPage from "@/pages/platform/TenantDetailPage";
import PlatformUsersPage from "@/pages/platform/PlatformUsersPage";

// Tenant pages
import DashboardPage from "@/pages/backoffice/DashboardPage";
import OnboardingPage from "@/pages/backoffice/OnboardingPage";
import ServicesPage from "@/pages/backoffice/ServicesPage";
import HoursPage from "@/pages/backoffice/HoursPage";
import BookingsPage from "@/pages/backoffice/BookingsPage";
import ClientsPage from "@/pages/backoffice/ClientsPage";
import NotificationsPage from "@/pages/backoffice/NotificationsPage";
import BrandingPage from "@/pages/backoffice/BrandingPage";
import SettingsPage from "@/pages/backoffice/SettingsPage";
import TeamPage from "@/pages/tenant/TeamPage";
import WhatsAppSetupPage from "@/pages/tenant/WhatsAppSetupPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

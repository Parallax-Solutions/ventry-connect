import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import LandingLayout from "@/layouts/LandingLayout";
import BackofficeLayout from "@/layouts/BackofficeLayout";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/backoffice/DashboardPage";
import OnboardingPage from "@/pages/backoffice/OnboardingPage";
import ServicesPage from "@/pages/backoffice/ServicesPage";
import HoursPage from "@/pages/backoffice/HoursPage";
import BookingsPage from "@/pages/backoffice/BookingsPage";
import ClientsPage from "@/pages/backoffice/ClientsPage";
import NotificationsPage from "@/pages/backoffice/NotificationsPage";
import BrandingPage from "@/pages/backoffice/BrandingPage";
import SettingsPage from "@/pages/backoffice/SettingsPage";
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
            {/* Landing */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Backoffice */}
            <Route path="/app" element={<BackofficeLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="setup" element={<OnboardingPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="hours" element={<HoursPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="branding" element={<BrandingPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

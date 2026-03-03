import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import WhatsAppSetupPanel from '@/components/organisms/WhatsAppSetupPanel';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { ROUTES } from '@/constants/routes';

export default function WhatsAppSetupPage() {
  const { data: onboardingStatus } = useOnboardingStatus();
  const backRoute = onboardingStatus?.tenantStatus === 'READY'
    ? ROUTES.TENANT.DASHBOARD
    : ROUTES.TENANT.ONBOARDING;
  const backLabel = onboardingStatus?.tenantStatus === 'READY' ? 'Dashboard' : 'Onboarding';

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to={backRoute}>{backLabel}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>WhatsApp</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-2xl font-display font-bold">Connect WhatsApp</h1>
        <p className="text-muted-foreground">Set up your WhatsApp Business integration</p>
      </div>
      <WhatsAppSetupPanel />
    </div>
  );
}

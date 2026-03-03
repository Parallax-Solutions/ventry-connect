import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useWhatsAppConfig, useWhatsAppSetup } from '@/hooks/useWhatsAppConfig';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { ROUTES } from '@/constants/routes';
import { MessageSquare, Wifi, WifiOff, Phone, Hash, Loader2 } from 'lucide-react';

export default function WhatsAppSetupPage() {
  const { data: config, isLoading } = useWhatsAppConfig();
  const { data: onboardingStatus } = useOnboardingStatus();
  const setupMutation = useWhatsAppSetup();
  const backRoute = onboardingStatus?.tenantStatus === 'READY'
    ? ROUTES.TENANT.DASHBOARD
    : ROUTES.TENANT.ONBOARDING;
  const backLabel = onboardingStatus?.tenantStatus === 'READY' ? 'Dashboard' : 'Onboarding';

  const appIdRef = useRef<HTMLInputElement>(null);
  const appSecretRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const wabaIdRef = useRef<HTMLInputElement>(null);
  const phoneNumberIdRef = useRef<HTMLInputElement>(null);

  const handleConnect = () => {
    setupMutation.mutate({
      appId: appIdRef.current?.value ?? '',
      appSecret: appSecretRef.current?.value ?? '',
      code: codeRef.current?.value ?? '',
      wabaId: wabaIdRef.current?.value ?? '',
      phoneNumberId: phoneNumberIdRef.current?.value ?? '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (config) {
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
          <h1 className="text-2xl font-display font-bold">WhatsApp Configuration</h1>
          <p className="text-muted-foreground">Your WhatsApp Business account is connected</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="font-display">Connected</CardTitle>
                <CardDescription>Your WhatsApp Business is active</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">WABA ID</p><p className="text-sm font-medium">{config.wabaId}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Display Number</p><p className="text-sm font-medium">{config.displayPhoneNumber}</p></div>
              </div>
            </div>
            <StatusBadge status={config.status} />
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="font-display">Not Connected</CardTitle>
              <CardDescription>Connect your WhatsApp Business to start receiving bookings via chat</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-info/5 border border-info/20 p-4 text-sm text-info">
            <MessageSquare className="h-4 w-4 inline mr-2" />
            WhatsApp integration allows your clients to book appointments directly through WhatsApp messages.
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Manual Setup (temporary)</p>
            <div>
              <Label>App ID</Label>
              <Input ref={appIdRef} className="mt-1.5" placeholder="Meta App ID" />
            </div>
            <div>
              <Label>App Secret</Label>
              <Input ref={appSecretRef} className="mt-1.5" type="password" placeholder="Meta App Secret" />
            </div>
            <div>
              <Label>Authorization Code</Label>
              <Input ref={codeRef} className="mt-1.5" placeholder="Enter code from Meta Business" />
            </div>
            <div>
              <Label>WABA ID</Label>
              <Input ref={wabaIdRef} className="mt-1.5" placeholder="WhatsApp Business Account ID" />
            </div>
            <div>
              <Label>Phone Number ID</Label>
              <Input ref={phoneNumberIdRef} className="mt-1.5" placeholder="Phone number ID" />
            </div>
            <Button
              className="w-full gradient-primary border-0 text-white"
              disabled={setupMutation.isPending}
              onClick={handleConnect}
            >
              {setupMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Connect WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

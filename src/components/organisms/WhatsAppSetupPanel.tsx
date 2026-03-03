import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWhatsAppConfig, useWhatsAppSetup } from '@/hooks/useWhatsAppConfig';
import { cn } from '@/lib/utils';
import { Hash, Loader2, MessageSquare, Phone, Wifi, WifiOff } from 'lucide-react';

interface WhatsAppSetupPanelProps {
  embedded?: boolean;
  onConfigured?: () => void;
}

export default function WhatsAppSetupPanel({
  embedded = false,
  onConfigured,
}: WhatsAppSetupPanelProps) {
  const { data: config, isLoading } = useWhatsAppConfig();
  const setupMutation = useWhatsAppSetup();

  const appIdRef = useRef<HTMLInputElement>(null);
  const appSecretRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const wabaIdRef = useRef<HTMLInputElement>(null);
  const phoneNumberIdRef = useRef<HTMLInputElement>(null);

  const handleConnect = () => {
    setupMutation.mutate(
      {
        appId: appIdRef.current?.value ?? '',
        appSecret: appSecretRef.current?.value ?? '',
        code: codeRef.current?.value ?? '',
        wabaId: wabaIdRef.current?.value ?? '',
        phoneNumberId: phoneNumberIdRef.current?.value ?? '',
      },
      {
        onSuccess: () => onConfigured?.(),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (config) {
    return (
      <div
        className={cn(
          'space-y-5 rounded-2xl border p-6',
          embedded
            ? 'bg-gradient-to-br from-success/10 via-background to-background'
            : 'bg-card',
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
            <Wifi className="h-6 w-6 text-success" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold">WhatsApp connected</h3>
            <p className="text-sm text-muted-foreground">
              Your WhatsApp Business account is ready to receive booking requests.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              WABA ID
            </div>
            <p className="text-sm font-medium">{config.wabaId}</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              Display number
            </div>
            <p className="text-sm font-medium">{config.displayPhoneNumber}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-3">
          <span className="text-sm text-muted-foreground">Connection status</span>
          <StatusBadge status={config.status} />
        </div>
      </div>
    );
  }

  if (!embedded) {
    return (
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
        <CardContent>
          <WhatsAppSetupForm
            appIdRef={appIdRef}
            appSecretRef={appSecretRef}
            codeRef={codeRef}
            wabaIdRef={wabaIdRef}
            phoneNumberIdRef={phoneNumberIdRef}
            isPending={setupMutation.isPending}
            onConnect={handleConnect}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-accent/10 p-6 text-left shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <MessageSquare className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold">Connect WhatsApp here</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Finish the Meta setup without leaving onboarding. Once this connects, you can continue directly to services.
          </p>
        </div>
      </div>

      <WhatsAppSetupForm
        appIdRef={appIdRef}
        appSecretRef={appSecretRef}
        codeRef={codeRef}
        wabaIdRef={wabaIdRef}
        phoneNumberIdRef={phoneNumberIdRef}
        isPending={setupMutation.isPending}
        onConnect={handleConnect}
        embedded
      />
    </div>
  );
}

interface WhatsAppSetupFormProps {
  appIdRef: RefObject<HTMLInputElement>;
  appSecretRef: RefObject<HTMLInputElement>;
  codeRef: RefObject<HTMLInputElement>;
  wabaIdRef: RefObject<HTMLInputElement>;
  phoneNumberIdRef: RefObject<HTMLInputElement>;
  isPending: boolean;
  onConnect: () => void;
  embedded?: boolean;
}

function WhatsAppSetupForm({
  appIdRef,
  appSecretRef,
  codeRef,
  wabaIdRef,
  phoneNumberIdRef,
  isPending,
  onConnect,
  embedded = false,
}: WhatsAppSetupFormProps) {
  return (
    <div className="space-y-6">
      <div className={cn(
        'rounded-lg border p-4 text-sm',
        embedded ? 'border-primary/15 bg-background/80 text-foreground' : 'border-info/20 bg-info/5 text-info',
      )}>
        <MessageSquare className="mr-2 inline h-4 w-4" />
        WhatsApp integration allows clients to book appointments directly through WhatsApp messages.
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Manual Setup (temporary)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="App ID">
            <Input ref={appIdRef} className="mt-1.5" placeholder="Meta App ID" />
          </Field>
          <Field label="App Secret">
            <Input ref={appSecretRef} className="mt-1.5" type="password" placeholder="Meta App Secret" />
          </Field>
          <Field label="Authorization Code">
            <Input ref={codeRef} className="mt-1.5" placeholder="Code from Meta Business" />
          </Field>
          <Field label="WABA ID">
            <Input ref={wabaIdRef} className="mt-1.5" placeholder="WhatsApp Business Account ID" />
          </Field>
          <Field label="Phone Number ID">
            <Input ref={phoneNumberIdRef} className="mt-1.5" placeholder="Phone number ID" />
          </Field>
        </div>

        <Button
          className={cn(
            'w-full border-0 text-white',
            embedded ? 'gradient-primary h-11' : 'gradient-primary',
          )}
          disabled={isPending}
          onClick={onConnect}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Connect WhatsApp
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

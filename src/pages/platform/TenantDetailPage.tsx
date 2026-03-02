import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { CheckCircle, Building2, Mail, Phone, Globe, Calendar, Loader2 } from 'lucide-react';
import { useTenant, useActivateTenant } from '@/hooks/useTenants';

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading } = useTenant(id ?? '');
  const activateMutation = useActivateTenant();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to={ROUTES.PLATFORM.TENANTS}>Tenants</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Not found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-muted-foreground">Tenant not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to={ROUTES.PLATFORM.TENANTS}>Tenants</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tenant.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{tenant.name}</h1>
            <p className="text-muted-foreground">{tenant.slug}</p>
          </div>
        </div>
        <StatusBadge status={tenant.status} className="text-sm px-3 py-1" />
      </div>

      {tenant.status === 'PENDING' && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm">This tenant is pending activation. Click to activate and make it operational.</p>
            <Button
              className="gradient-primary border-0 text-white"
              disabled={activateMutation.isPending}
              onClick={() => activateMutation.mutate(tenant.id)}
            >
              {activateMutation.isPending
                ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                : <CheckCircle className="h-4 w-4 mr-1" />
              }
              Activate Tenant
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Tenant Information</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{tenant.contactEmail}</p></div>
          </div>
          {tenant.contactPhone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{tenant.contactPhone}</p></div>
            </div>
          )}
          {tenant.presetType && (
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Business Type</p><p className="text-sm font-medium capitalize">{tenant.presetType}</p></div>
            </div>
          )}
          {tenant.timezone && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Timezone</p><p className="text-sm font-medium">{tenant.timezone}</p></div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{tenant.createdAt}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

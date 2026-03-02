import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { CheckCircle, Building2, Mail, Phone, Globe, Calendar } from 'lucide-react';
import type { Tenant } from '@/types';

// Mock — will be replaced by useTenant(id)
const mockTenant: Tenant = {
  id: '1', name: 'BarberCool Studio', slug: 'barbercool', email: 'info@barbercool.com',
  phone: '+57 300 123 4567', businessType: 'barbershop', timezone: 'America/Bogota',
  status: 'PENDING', createdAt: '2025-01-15',
};

export default function TenantDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to={ROUTES.PLATFORM.TENANTS}>Tenants</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockTenant.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{mockTenant.name}</h1>
            <p className="text-muted-foreground">{mockTenant.slug}</p>
          </div>
        </div>
        <StatusBadge status={mockTenant.status} className="text-sm px-3 py-1" />
      </div>

      {mockTenant.status === 'PENDING' && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm">This tenant is pending activation. Click to activate and make it operational.</p>
            <Button className="gradient-primary border-0 text-white">
              <CheckCircle className="h-4 w-4 mr-1" /> Activate Tenant
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
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{mockTenant.email}</p></div>
          </div>
          {mockTenant.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{mockTenant.phone}</p></div>
            </div>
          )}
          {mockTenant.businessType && (
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Business Type</p><p className="text-sm font-medium capitalize">{mockTenant.businessType}</p></div>
            </div>
          )}
          {mockTenant.timezone && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Timezone</p><p className="text-sm font-medium">{mockTenant.timezone}</p></div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm font-medium">{mockTenant.createdAt}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

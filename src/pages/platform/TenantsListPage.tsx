import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Building2 } from 'lucide-react';
import { EmptyState } from '@/components/molecules/EmptyState';
import type { Tenant } from '@/types';

// Mock data for platform — will be replaced by useTenants() hook
const mockTenants: Tenant[] = [
  { id: '1', name: 'BarberCool Studio', slug: 'barbercool', email: 'info@barbercool.com', status: 'READY', createdAt: '2025-01-15', businessType: 'barbershop' },
  { id: '2', name: 'Bella Salon', slug: 'bella-salon', email: 'hello@bella.com', status: 'PENDING', phone: '+57 300 123 4567', createdAt: '2025-03-01' },
  { id: '3', name: 'VetCare Plus', slug: 'vetcare', email: 'admin@vetcare.co', status: 'PROVISIONING', createdAt: '2025-02-20', businessType: 'vet' },
];

export default function TenantsListPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Tenants</h1>
          <p className="text-muted-foreground">Manage all registered businesses</p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <Plus className="h-4 w-4 mr-1" /> New Tenant
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {mockTenants.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={<Building2 className="h-12 w-12" />} title="No tenants yet" description="Create your first tenant to get started." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTenants.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link to={`/platform/tenants/${t.id}`} className="font-medium hover:underline text-primary">
                        {t.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.slug}</TableCell>
                    <TableCell className="text-muted-foreground">{t.email}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{t.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Building2, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useTenants } from '@/hooks/useTenants';

export default function TenantsListPage() {
  const { data: tenants = [], isLoading } = useTenants();

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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tenants.length === 0 ? (
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
                {tenants.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link to={`/platform/tenants/${t.id}`} className="font-medium hover:underline text-primary">
                        {t.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.slug}</TableCell>
                    <TableCell className="text-muted-foreground">{t.contactEmail}</TableCell>
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

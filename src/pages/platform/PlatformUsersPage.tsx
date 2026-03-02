import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Plus, Users } from 'lucide-react';
import type { User } from '@/types';

// Mock — will be replaced by useUsers()
const mockAdmins: User[] = [
  { id: '1', email: 'admin@ventry.co', role: 'VENTRY_ADMIN', scope: 'PLATFORM', status: 'ACTIVE', tenantId: null },
];

export default function PlatformUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Platform Users</h1>
          <p className="text-muted-foreground">Manage Ventry admin accounts</p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <Plus className="h-4 w-4 mr-1" /> New Admin
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {mockAdmins.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={<Users className="h-12 w-12" />} title="No users yet" description="Create your first platform admin." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdmins.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell><StatusBadge status="ACTIVE" label={u.role} /></TableCell>
                    <TableCell><StatusBadge status={u.status} /></TableCell>
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

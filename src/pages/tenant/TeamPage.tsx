import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Plus, UsersRound } from 'lucide-react';
import type { User } from '@/types';

// Mock — will be replaced by useUsers()
const mockTeamMembers: User[] = [
  { id: '1', email: 'owner@barbercool.com', role: 'OWNER', scope: 'TENANT', status: 'ACTIVE', tenantId: 'tenant-001' },
  { id: '2', email: 'staff@barbercool.com', role: 'STAFF', scope: 'TENANT', status: 'ACTIVE', tenantId: 'tenant-001' },
];

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Team</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button className="gradient-primary border-0 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {mockTeamMembers.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={<UsersRound className="h-12 w-12" />} title="No team members" description="Invite your first team member." />
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
                {mockTeamMembers.map((u) => (
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

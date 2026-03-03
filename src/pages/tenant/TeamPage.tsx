import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { UserCreateDialog } from '@/components/organisms/UserCreateDialog';
import { useCreateTenantUser, useUsers } from '@/hooks/useUsers';
import { Plus, UsersRound, Loader2 } from 'lucide-react';

export default function TeamPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: users = [], isLoading } = useUsers();
  const createMutation = useCreateTenantUser();
  const summary = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === 'ADMIN').length,
    staff: users.filter((user) => user.role === 'STAFF').length,
  }), [users]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Team</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total members</p>
            <p className="mt-2 text-3xl font-display font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="mt-2 text-3xl font-display font-bold">{summary.admins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Staff</p>
            <p className="mt-2 text-3xl font-display font-bold">{summary.staff}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<UsersRound className="h-12 w-12" />}
                title="No team members"
                description="Invite your first admin or staff member."
                action={
                  <Button className="gradient-primary border-0 text-white" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Member
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scope</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell><StatusBadge status="ACTIVE" label={u.role} /></TableCell>
                    <TableCell><StatusBadge status={u.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{u.scope}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add team member"
        description="Create an admin or staff account for this tenant."
        submitLabel="Create member"
        roleOptions={[
          { value: 'ADMIN', label: 'Admin' },
          { value: 'STAFF', label: 'Staff' },
        ]}
        isPending={createMutation.isPending}
        error={createMutation.error}
        onResetError={() => createMutation.reset()}
        onSubmit={(values) => {
          createMutation.mutate(
            { email: values.email, password: values.password, role: values.role ?? 'STAFF' },
            { onSuccess: () => setDialogOpen(false) },
          );
        }}
      />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { UserCreateDialog } from '@/components/organisms/UserCreateDialog';
import { useCreatePlatformUser, usePlatformUsers } from '@/hooks/useUsers';
import { Plus, Users, Loader2 } from 'lucide-react';

export default function PlatformUsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: users = [], isLoading } = usePlatformUsers();
  const createMutation = useCreatePlatformUser();
  const summary = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.status === 'ACTIVE').length,
  }), [users]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Platform Users</h1>
          <p className="text-muted-foreground">Manage Ventry admin accounts</p>
        </div>
        <Button className="gradient-primary border-0 text-white" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Admin
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Platform admins</p>
            <p className="mt-2 text-3xl font-display font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-2 text-3xl font-display font-bold">{summary.active}</p>
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
                icon={<Users className="h-12 w-12" />}
                title="No users yet"
                description="Create your first platform admin."
                action={
                  <Button className="gradient-primary border-0 text-white" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" /> New Admin
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
        title="Create platform admin"
        description="This account will have cross-tenant administrative access."
        submitLabel="Create admin"
        isPending={createMutation.isPending}
        error={createMutation.error}
        onResetError={() => createMutation.reset()}
        onSubmit={(values) => {
          createMutation.mutate(
            { email: values.email, password: values.password },
            { onSuccess: () => setDialogOpen(false) },
          );
        }}
      />
    </div>
  );
}

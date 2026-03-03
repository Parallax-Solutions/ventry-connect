import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { UserCreateDialog } from '@/components/organisms/UserCreateDialog';
import { useCreatePlatformUser, usePlatformUsers, useUpdatePlatformUser } from '@/hooks/useUsers';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';
import { Plus, Users, Loader2, Pencil, UserCheck, UserX } from 'lucide-react';

export default function PlatformUsersPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const { data: users = [], isLoading } = usePlatformUsers();
  const createMutation = useCreatePlatformUser();
  const updateMutation = useUpdatePlatformUser();
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
        <Button className="gradient-primary border-0 text-white" onClick={() => setCreateDialogOpen(true)}>
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
                  <Button className="gradient-primary border-0 text-white" onClick={() => setCreateDialogOpen(true)}>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell><StatusBadge status="ACTIVE" label={u.role} /></TableCell>
                    <TableCell><StatusBadge status={u.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{u.scope}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updateMutation.reset();
                            setEditingUser(u);
                          }}
                        >
                          <Pencil className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={u.status === 'ACTIVE' ? 'text-destructive hover:text-destructive' : 'text-success hover:text-success'}
                          onClick={() => setStatusUser(u)}
                          disabled={updateMutation.isPending || currentUser?.id === u.id}
                        >
                          {u.status === 'ACTIVE' ? (
                            <UserX className="mr-1 h-4 w-4" />
                          ) : (
                            <UserCheck className="mr-1 h-4 w-4" />
                          )}
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                        {currentUser?.id === u.id ? (
                          <span className="text-xs text-muted-foreground">Current session</span>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create platform admin"
        description="This account will have cross-tenant administrative access."
        submitLabel="Create admin"
        isPending={createMutation.isPending}
        error={createMutation.error}
        onResetError={() => createMutation.reset()}
        onSubmit={(values) => {
          createMutation.mutate(
            { email: values.email, password: values.password },
            { onSuccess: () => setCreateDialogOpen(false) },
          );
        }}
      />

      <UserCreateDialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
          }
        }}
        title="Edit platform admin"
        description="Update the email for this Ventry admin account."
        submitLabel="Save changes"
        initialValues={editingUser ? { email: editingUser.email } : undefined}
        showPassword={false}
        isPending={updateMutation.isPending}
        error={updateMutation.error}
        onResetError={() => updateMutation.reset()}
        onSubmit={(values) => {
          if (!editingUser) {
            return;
          }

          updateMutation.mutate(
            {
              userId: editingUser.id,
              data: {
                email: values.email,
              },
            },
            { onSuccess: () => setEditingUser(null) },
          );
        }}
      />

      <ConfirmDialog
        open={Boolean(statusUser)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusUser(null);
          }
        }}
        title={statusUser?.status === 'ACTIVE' ? 'Deactivate platform user?' : 'Activate platform user?'}
        description={
          statusUser?.status === 'ACTIVE'
            ? 'This admin will lose access to platform operations until reactivated.'
            : 'This admin will regain platform access immediately.'
        }
        confirmLabel={statusUser?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        variant={statusUser?.status === 'ACTIVE' ? 'destructive' : 'default'}
        onConfirm={() => {
          if (!statusUser) {
            return;
          }

          updateMutation.mutate(
            {
              userId: statusUser.id,
              data: {
                status: statusUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              },
            },
            { onSuccess: () => setStatusUser(null) },
          );
        }}
      />
    </div>
  );
}

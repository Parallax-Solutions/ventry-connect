import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { UserCreateDialog } from '@/components/organisms/UserCreateDialog';
import { useCreateTenantUser, useUpdateTenantUser, useUsers } from '@/hooks/useUsers';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';
import { Plus, UsersRound, Loader2, Pencil, UserCheck, UserX } from 'lucide-react';

export default function TeamPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const { data: users = [], isLoading } = useUsers();
  const createMutation = useCreateTenantUser();
  const updateMutation = useUpdateTenantUser();
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
        <Button className="gradient-primary border-0 text-white" onClick={() => setCreateDialogOpen(true)}>
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
                  <Button className="gradient-primary border-0 text-white" onClick={() => setCreateDialogOpen(true)}>
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
                      {u.role === 'OWNER' ? (
                        <span className="text-xs text-muted-foreground">Owner account</span>
                      ) : (
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
                      )}
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
        title="Edit team member"
        description="Update the email or role for this tenant user."
        submitLabel="Save changes"
        roleOptions={[
          { value: 'ADMIN', label: 'Admin' },
          { value: 'STAFF', label: 'Staff' },
        ]}
        initialValues={
          editingUser
            ? {
                email: editingUser.email,
                role: editingUser.role === 'ADMIN' || editingUser.role === 'STAFF' ? editingUser.role : 'STAFF',
              }
            : undefined
        }
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
                role: values.role ?? 'STAFF',
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
        title={statusUser?.status === 'ACTIVE' ? 'Deactivate team member?' : 'Activate team member?'}
        description={
          statusUser?.status === 'ACTIVE'
            ? 'This user will lose access until you activate the account again.'
            : 'This user will be able to sign back in immediately.'
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

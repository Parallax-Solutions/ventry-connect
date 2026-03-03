import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormErrorAlert } from '@/components/molecules/FormErrorAlert';
import { getErrorMessages } from '@/lib/api-errors';

const baseSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
});

type UserCreateFormValues = z.infer<typeof baseSchema>;

interface RoleOption {
  value: 'ADMIN' | 'STAFF';
  label: string;
}

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  roleOptions?: RoleOption[];
  isPending: boolean;
  error?: unknown;
  onResetError?: () => void;
  onSubmit: (values: { email: string; password: string; role?: 'ADMIN' | 'STAFF' }) => void;
}

export function UserCreateDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  roleOptions,
  isPending,
  error,
  onResetError,
  onSubmit,
}: UserCreateDialogProps) {
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: '',
      password: '',
      role: roleOptions?.[0]?.value,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        email: '',
        password: '',
        role: roleOptions?.[0]?.value,
      });
    }
  }, [open, reset, roleOptions]);

  useEffect(() => {
    const subscription = watch(() => {
      if (error && onResetError) {
        onResetError();
      }
    });

    return () => subscription.unsubscribe();
  }, [error, onResetError, watch]);

  const serverErrors = error ? getErrorMessages(error, 'Unable to save user') : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FormErrorAlert title="Unable to save user" messages={serverErrors} />

        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => {
            onSubmit({
              email: values.email.trim(),
              password: values.password,
              role: roleOptions ? values.role : undefined,
            });
          })}
        >
          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" className="mt-1.5" autoComplete="email" {...register('email')} />
            {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
          </div>

          <div>
            <Label htmlFor="user-password">Password</Label>
            <Input
              id="user-password"
              type="password"
              className="mt-1.5"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password ? <p className="mt-1 text-xs text-destructive">{errors.password.message}</p> : null}
          </div>

          {roleOptions ? (
            <div>
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={watch('role')}
                onValueChange={(value: 'ADMIN' | 'STAFF') => setValue('role', value, { shouldValidate: true })}
              >
                <SelectTrigger id="user-role" className="mt-1.5">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role ? <p className="mt-1 text-xs text-destructive">{errors.role.message}</p> : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary border-0 text-white" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

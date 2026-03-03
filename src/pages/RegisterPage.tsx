import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import type { RegisterRequest } from '@/types';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { FormErrorAlert } from '@/components/molecules/FormErrorAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getErrorMessages } from '@/lib/api-errors';
import { MessageCircle, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const schema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, 'Business name is required')
    .min(2, 'Business name must contain at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[+\d\s()-]{7,20}$/.test(value), {
      message: 'Enter a valid phone number or leave it empty',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const subscription = watch(() => {
      if (registerMutation.error) {
        registerMutation.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [registerMutation, watch]);

  if (isAuthenticated && user) {
    const dest = user.role === 'VENTRY_ADMIN' ? ROUTES.PLATFORM.TENANTS : ROUTES.TENANT.DASHBOARD;
    return <Navigate to={dest} replace />;
  }

  const onSubmit = (data: FormValues) => registerMutation.mutate(data as RegisterRequest);

  const serverErrors = registerMutation.error
    ? getErrorMessages(registerMutation.error, 'We could not create your account')
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl">Ventry</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-display">Create your account</CardTitle>
            <CardDescription>Start your free trial today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormErrorAlert title="Unable to create your account" messages={serverErrors} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  className="mt-1.5"
                  placeholder="My Barbershop"
                  {...register('businessName')}
                />
                {errors.businessName && <p className="text-xs text-destructive mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1.5"
                  {...register('email')}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="mt-1.5"
                  placeholder="+57 300 123 4567"
                  {...register('phone')}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="mt-1.5"
                  {...register('password')}
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary border-0 text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create account
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

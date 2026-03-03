import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { FormErrorAlert } from '@/components/molecules/FormErrorAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getErrorMessages } from '@/lib/api-errors';
import { MessageCircle, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must contain at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation('common');
  const loginMutation = useLogin();
  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const subscription = watch(() => {
      if (loginMutation.error) {
        loginMutation.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [loginMutation, watch]);

  if (isAuthenticated && user) {
    const dest = user.role === 'VENTRY_ADMIN' ? ROUTES.PLATFORM.TENANTS : ROUTES.TENANT.DASHBOARD;
    return <Navigate to={dest} replace />;
  }

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data as { email: string; password: string });

  const serverErrors = loginMutation.error
    ? getErrorMessages(loginMutation.error, 'We could not sign you in')
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
            <CardTitle className="font-display">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormErrorAlert title="Unable to sign in" messages={serverErrors} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="mt-1.5"
                  {...register('password')}
                  autoComplete="current-password"
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary border-0 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

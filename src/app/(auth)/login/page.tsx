import { AuthForm, FormInput } from '@/components/auth/AuthForm';
import { login } from '@/actions/auth';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'Login - Portfolio2',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <AuthForm
          action={login}
          title="Welcome Back"
          submitLabel="Sign In"
        >
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
        </AuthForm>

        {/* Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-neutral-500">
            <Link href={ROUTES.HOME} className="hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

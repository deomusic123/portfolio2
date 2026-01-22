import { AuthForm, FormInput } from '@/components/auth/AuthForm';
import { register } from '@/actions/auth';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'Register - Portfolio2',
  description: 'Create your account',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <AuthForm
          action={register}
          title="Create Account"
          submitLabel="Sign Up"
        >
          <FormInput
            name="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
          />
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
          <p className="text-xs text-neutral-500">
            Password must be at least 8 characters
          </p>
        </AuthForm>

        {/* Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-neutral-400">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">
              Sign in
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

import { AuthForm, FormInput } from '@/components/auth/AuthForm';
import { login } from '@/actions/auth';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { BackgroundBeams } from '@portfolio2/ui';

export const metadata = {
  title: 'Login - Portfolio2',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      {/* Background Beams para profundidad */}
      <BackgroundBeams className="opacity-30" />
      
      {/* Gradient overlay para más profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo/Badge con glow extremo */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.5)] mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Portfolio2
            </h1>
          </div>
        </div>
        
        {/* Form con glassmorphism extremo y glow */}
        <div className="relative">
          {/* Glow effect detrás del form */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
          
          <div className="relative bg-black/50 border border-white/20 rounded-2xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
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
          </div>
        </div>

        {/* Links con mejor contraste */}
        <div className="text-center space-y-4">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-zinc-600">
            <Link href="http://localhost:3000" className="hover:text-zinc-400 transition-colors">
              ← Back to landing
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

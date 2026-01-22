'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

interface AuthFormProps {
  action: (prevState: any, formData: FormData) => Promise<ActionResponse>;
  title: string;
  submitLabel: string;
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthForm wrapper - Handles Server Action form submission
 * Uses useActionState (React 19 RC) instead of deprecated useFormState
 */
export function AuthForm({
  action,
  title,
  submitLabel,
  children,
  redirectTo,
}: AuthFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      const target = redirectTo || (submitLabel.includes('Sign Up') ? ROUTES.LOGIN : ROUTES.DASHBOARD);
      router.push(target);
    }
  }, [state?.success, redirectTo, router, submitLabel]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-neutral-400 mt-2">Agencia Digital Moderna</p>
        </div>

        <form action={formAction} className="space-y-4">
          {children}

          {/* Error display */}
          {state?.error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">
                {typeof state.error === 'string' ? state.error : state.error.message}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              'w-full px-4 py-2 rounded-lg font-semibold transition',
              'bg-gradient-to-r from-primary to-secondary text-white',
              'hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isPending ? 'Loading...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * FormInput component - Styled input field
 */
export function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 rounded-lg',
          'bg-neutral-800 border border-neutral-700 text-white',
          'placeholder:text-neutral-500',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition'
        )}
      />
    </div>
  );
}

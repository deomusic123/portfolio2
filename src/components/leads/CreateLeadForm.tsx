'use client';

import { useActionState } from 'react';
import { createLead } from '@/actions/leads';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/api';

interface CreateLeadFormProps {
  onSuccess?: () => void;
}

/**
 * CreateLeadForm - Client Component
 * Form for creating new leads
 * Uses useActionState (React 19) to handle submission
 */
export function CreateLeadForm({ onSuccess }: CreateLeadFormProps) {
  const [state, formAction, isPending] = useActionState(createLead as any, null) as [ActionResponse | null, any, boolean];

  return (
    <form action={formAction} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition"
          placeholder="john@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
          Phone <span className="text-neutral-500">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-white mb-2">
          Lead Source <span className="text-red-400">*</span>
        </label>
        <select
          id="source"
          name="source"
          required
          defaultValue="contact_form"
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-primary transition"
        >
          <option value="contact_form">Contact Form</option>
          <option value="email">Email</option>
          <option value="referral">Referral</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
          Notes <span className="text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition resize-none"
          placeholder="Add any relevant notes..."
        />
      </div>

      {/* Error message */}
      {state && !state.success && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">
            {typeof state.error === 'string' ? state.error : state.error?.message}
          </p>
        </div>
      )}

      {/* Success message */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400">{state.message || 'Lead created successfully!'}</p>
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
        {isPending ? 'Creating...' : 'Create Lead'}
      </button>
    </form>
  );
}

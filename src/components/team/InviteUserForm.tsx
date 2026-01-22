'use client';

import { useActionState } from 'react';
import { inviteUser } from '@/actions/team';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/api';

/**
 * InviteUserForm - Client Component
 * Form to invite new users to the team (admin only)
 */
export function InviteUserForm() {
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    inviteUser,
    null
  ) as [ActionResponse | null, any, boolean];

  return (
    <form action={formAction} className="space-y-4">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="user@example.com"
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-neutral-900 border text-white placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition',
            state && !state.success ? 'border-red-500' : 'border-neutral-700'
          )}
          disabled={isPending}
          required
        />
      </div>

      {/* Role Select */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-neutral-300 mb-2">
          Role
        </label>
        <select
          id="role"
          name="role"
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-neutral-900 border text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition',
            'border-neutral-700'
          )}
          disabled={isPending}
          defaultValue="agent"
          required
        >
          <option value="agent">Agent</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <p className="text-xs text-neutral-500 mt-2">
          • <strong>Admin</strong>: Full access, can manage team<br />
          • <strong>Agent</strong>: Can manage leads and projects<br />
          • <strong>Client</strong>: Read-only access
        </p>
      </div>

      {/* Error/Success Messages */}
      {state && !state.success && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">
            {typeof state.error === 'string' 
              ? state.error 
              : state.error?.message || 'Failed to send invitation'}
          </p>
        </div>
      )}

      {state && state.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 mb-2">{state.message || 'Invitation sent!'}</p>
          {state.data?.link && (
            <div className="mt-2 p-2 rounded bg-neutral-900 border border-neutral-800">
              <p className="text-xs text-neutral-400 mb-1">Invitation Link:</p>
              <code className="text-xs text-blue-400 break-all">{state.data.link}</code>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full px-6 py-3 rounded-lg font-medium transition',
          'bg-blue-500 hover:bg-blue-600 text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isPending ? 'Sending...' : 'Send Invitation'}
      </button>
    </form>
  );
}

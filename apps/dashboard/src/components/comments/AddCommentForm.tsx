'use client';

import { useActionState } from 'react';
import { createComment } from '@/actions/comments';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/api';

/**
 * AddCommentForm - Client Component
 * Form to add new comments with useActionState
 */
export function AddCommentForm({
  entityType,
  entityId,
}: {
  entityType: 'lead' | 'project';
  entityId: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    createComment,
    null
  ) as [ActionResponse | null, any, boolean];

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden Fields */}
      <input type="hidden" name="entity_type" value={entityType} />
      <input type="hidden" name="entity_id" value={entityId} />

      {/* Comment Textarea */}
      <div>
        <textarea
          name="content"
          rows={4}
          placeholder="Add a comment..."
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-neutral-900 border text-white placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition',
            state && !state.success ? 'border-red-500' : 'border-neutral-700'
          )}
          disabled={isPending}
          required
        />
      </div>

      {/* Error/Success Messages */}
      {state && !state.success && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">
            {typeof state.error === 'string' 
              ? state.error 
              : state.error?.message || 'Failed to add comment'}
          </p>
        </div>
      )}

      {state && state.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400">{state.message || 'Comment added!'}</p>
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
        {isPending ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}

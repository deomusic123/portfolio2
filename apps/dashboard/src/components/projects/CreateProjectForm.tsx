'use client';

import { useActionState } from 'react';
import { createProject } from '@/actions/projects';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/api';

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

/**
 * CreateProjectForm - Client Component
 * Form for creating new projects
 * Uses useActionState (React 19) to handle submission
 */
export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [state, formAction, isPending] = useActionState(createProject as any, null) as [ActionResponse | null, any, boolean];

  return (
    <form action={formAction} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition"
          placeholder="Website Redesign"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
          Description <span className="text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition resize-none"
          placeholder="Project overview and goals..."
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue="planning"
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-primary transition"
        >
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-white mb-2">
          Budget <span className="text-neutral-500">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
          <input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            className="w-full pl-8 pr-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition"
            placeholder="10000.00"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-white mb-2">
            Start Date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-primary transition"
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-white mb-2">
            End Date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-primary transition"
          />
        </div>
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
          <p className="text-sm text-green-400">{state.message || 'Project created successfully!'}</p>
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
        {isPending ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}

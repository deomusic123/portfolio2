"use client";

import { useState, useEffect } from "react";
import { updateProjectFull } from "@/actions/projects";
import type { Project } from "@/types/database";
import { useActionState } from "react";

interface EditProjectFormProps {
  project: Project;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditProjectForm({
  project,
  onClose,
  onSuccess,
}: EditProjectFormProps) {
  const [state, formAction, isPending] = useActionState(updateProjectFull, null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    }
  }, [state, onSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <h2 className="text-2xl font-bold text-white">Edit Project</h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="p-6 space-y-4">
          <input type="hidden" name="projectId" value={project.id} />

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={project.name}
              disabled={isPending}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={project.description || ""}
              disabled={isPending}
              rows={3}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              defaultValue={project.status}
              disabled={isPending}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Budget ($)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              defaultValue={project.budget || ""}
              disabled={isPending}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                defaultValue={
                  project.start_date
                    ? new Date(project.start_date).toISOString().split("T")[0]
                    : ""
                }
                disabled={isPending}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                defaultValue={
                  project.end_date
                    ? new Date(project.end_date).toISOString().split("T")[0]
                    : ""
                }
                disabled={isPending}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-sm text-red-400">
                {typeof state.error === "string" ? state.error : "Update failed"}
              </p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-sm text-green-400">
                Project updated successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useActionState } from "react";
import { createLeadFromForm, updateLeadFromForm } from "@/actions/leads";
import { X } from "lucide-react";
import type { ActionResponse, Lead } from "@/lib/leads/types";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  lead?: Lead | null;
  onSuccess?: () => void;
}

export function NewLeadDialog({ open, onOpenChange, mode = "create", lead, onSuccess }: NewLeadDialogProps) {
  const isEdit = mode === "edit" && Boolean(lead);
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateLeadFromForm : createLeadFromForm,
    null
  ) as [ActionResponse | null, any, boolean];

  useEffect(() => {
    if (state?.success && open) {
      const timer = setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [state?.success, open, onOpenChange, onSuccess]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{isEdit ? "Editar Lead" : "New Lead"}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {isEdit ? "Actualiza los datos del lead" : "Add website to trigger AI investigation"}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form action={formAction} className="space-y-4">
            {isEdit && <input type="hidden" name="leadId" value={lead?.id} />}

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={lead?.name ?? ""}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={lead?.email ?? ""}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-blue-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="website" className="mb-2 block text-sm font-medium text-white">
                Website <span className="text-blue-400">(recommended)</span>
              </label>
              <input
                id="website"
                name="website"
                type="url"
                defaultValue={lead?.website ?? ""}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-zinc-500">
                 AI will analyze tech stack & create sales email
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white">
                Phone <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={lead?.phone ?? ""}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-blue-500 focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="source" className="mb-2 block text-sm font-medium text-white">
                Lead Source
              </label>
              <select
                id="source"
                name="source"
                defaultValue={lead?.source || "contact_form"}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white transition focus:border-blue-500 focus:outline-none"
              >
                <option value="contact_form">Contact Form</option>
                <option value="email">Email</option>
                <option value="referral">Referral</option>
                <option value="linkedin">LinkedIn</option>
                <option value="cold_outreach">Cold Outreach</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium text-white">
                Notes <span className="text-zinc-500">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={lead?.notes ?? ""}
                className="w-full resize-none rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 transition focus:border-blue-500 focus:outline-none"
                placeholder="Context about this lead..."
              />
            </div>

            {state && !state.success && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <span className="text-red-400">⚠️</span>
                <p className="text-sm text-red-400">
                  {typeof state.error === "string" ? state.error : isEdit ? "Failed to update lead" : "Failed to create lead"}
                </p>
              </div>
            )}

            {state?.success && (
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <span className="text-green-400">✅</span>
                <p className="text-sm text-green-400">
                  {isEdit ? "Lead updated!" : "Lead created! AI investigation started..."}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white transition-all hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-white shadow-lg transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </span>
                ) : (
                  isEdit ? "Guardar cambios" : "+ Create Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

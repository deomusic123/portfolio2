'use client';

import { useState, useActionState } from 'react';
import { createLeadFromForm } from '@/actions/leads';
import { X } from 'lucide-react';
import type { ActionResponse } from '@/lib/leads/types';

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLeadDialog({ open, onOpenChange }: NewLeadDialogProps) {
  const [state, formAction, isPending] = useActionState(
    createLeadFromForm,
    null
  ) as [ActionResponse | null, any, boolean];

  // Auto-close on success
  if (state?.success && open) {
    setTimeout(() => onOpenChange(false), 1500);
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
        <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">New Lead</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Add website to trigger AI investigation
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
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
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
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
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="john@example.com"
              />
            </div>

            {/* Website - CRITICAL FOR SNIPER */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                Website <span className="text-blue-400">(recommended)</span>
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="https://example.com"
              />
              <p className="text-xs text-zinc-500 mt-1">
                🔍 AI will analyze tech stack & create sales email
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                Phone <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Source */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-white mb-2">
                Lead Source
              </label>
              <select
                id="source"
                name="source"
                defaultValue="contact_form"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="contact_form">Contact Form</option>
                <option value="email">Email</option>
                <option value="referral">Referral</option>
                <option value="linkedin">LinkedIn</option>
                <option value="cold_outreach">Cold Outreach</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
                Notes <span className="text-zinc-500">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition resize-none"
                placeholder="Context about this lead..."
              />
            </div>

            {/* Error Message */}
            {state && !state.success && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <span className="text-red-400">⚠️</span>
                <p className="text-sm text-red-400">
                  {typeof state.error === 'string' ? state.error : 'Failed to create lead'}
                </p>
              </div>
            )}

            {/* Success Message */}
            {state?.success && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <p className="text-sm text-green-400">
                  Lead created! AI investigation started...
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  '+ Create Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

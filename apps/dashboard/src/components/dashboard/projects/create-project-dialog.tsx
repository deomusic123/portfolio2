'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { createProject } from '@/actions/projects';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    client_name: '',
    description: '',
    start_date: '',
    deadline: '',
    budget: '',
    currency: 'USD',
  });
  const router = useRouter();

  const handleSubmit = () => {
    if (!form.name.trim() || !form.client_name.trim()) return;
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      const res = await createProject({
        name: form.name.trim(),
        client_name: form.client_name.trim(),
        description: form.description || undefined,
        start_date: form.start_date || undefined,
        deadline: form.deadline || undefined,
        budget: form.budget ? Number(form.budget) : undefined,
        currency: form.currency || undefined,
      });
      if (!res.success) {
        setError(typeof res.error === 'string' ? res.error : 'Failed to create project');
        return;
      }
      setSuccess('Project created');
      setForm({ name: '', client_name: '', description: '', start_date: '', deadline: '', budget: '', currency: 'USD' });
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Create Project</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-white">
              {error && <p className="text-xs text-red-300">{error}</p>}
              {success && <p className="text-xs text-emerald-300">{success}</p>}
              <input
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
                disabled={isPending}
              />
              <input
                placeholder="Client name"
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
                disabled={isPending}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
                rows={3}
                disabled={isPending}
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  disabled={isPending}
                />
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Budget"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
                  disabled={isPending}
                />
                <input
                  placeholder="Currency"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:border-white/20"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

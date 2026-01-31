
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateLead, getLeadWithActivities } from '@/actions/leads';
import { convertLeadToProject } from '@/actions/projects';
import type { Lead, LeadActivity } from '@/lib/leads/types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

interface LeadSheetProps {
  leadId: string | null;
  open: boolean;
  onClose: () => void;
  viewOnly?: boolean;
}

interface SheetData {
  lead: Lead;
  activities: LeadActivity[];
}

export function LeadSheet({ leadId, open, onClose, viewOnly = false }: LeadSheetProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<SheetData | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [convertSuccessId, setConvertSuccessId] = useState<string | null>(null);
  const [isConverting, startConvert] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!leadId || !open) return;
      setLoading(true);
      setError(null);
      const res = await getLeadWithActivities(leadId);
      if (res.success && res.data) {
        setData(res.data as SheetData);
      } else {
        setError(typeof res.error === 'string' ? res.error : 'Failed to load lead');
      }
      setLoading(false);
    };
    fetchData();
  }, [leadId, open]);

  async function handleSave() {
    if (viewOnly) return;
    if (!data) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updateLead(data.lead.id, {
      suggested_action: data.lead.suggested_action || undefined,
      next_follow_up_at: data.lead.next_follow_up_at || undefined,
      notes: data.lead.notes || undefined,
    });
    if (!res.success) {
      setError(typeof res.error === 'string' ? res.error : 'Failed to save');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  function updateField(field: keyof Lead, value: string | null) {
    if (viewOnly || !data) return;
    setData({ ...data, lead: { ...data.lead, [field]: value } });
  }

  function handleCopyDraft() {
    if (!data?.lead.ai_email_draft) return;
    navigator.clipboard.writeText(data.lead.ai_email_draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConvert() {
    if (!leadId) return;
    setConvertError(null);
    setConvertSuccessId(null);
    startConvert(async () => {
      const res = await convertLeadToProject(leadId);
      if (!res.success) {
        setConvertError(typeof res.error === 'string' ? res.error : 'Failed to convert lead');
        return;
      }
      if (res.projectId) {
        setConvertSuccessId(res.projectId);
        router.refresh();
        router.push(`${ROUTES.PROJECTS}/${res.projectId}`);
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl bg-zinc-950 border-l border-white/10 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Lead Details</h2>
            {data?.lead.email && <p className="text-sm text-zinc-500">{data.lead.email}</p>}
          </div>
          <div className="flex items-center gap-2">
            {!viewOnly && (
              <button
                onClick={handleConvert}
                disabled={isConverting || loading}
                className={cn(
                  'rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90',
                  (isConverting || loading) && 'opacity-60 cursor-not-allowed'
                )}
              >
                {isConverting ? 'Converting...' : 'Convert to Project'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {loading && <p className="text-zinc-400">Loading...</p>}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {convertError && <p className="text-red-400 text-sm mb-3">{convertError}</p>}
        {saved && !error && (
          <p className="text-green-400 text-sm mb-3">Saved</p>
        )}
        {convertSuccessId && (
          <p className="text-green-400 text-sm mb-3">Project created</p>
        )}

        {data && (
          <div className="space-y-4">
            <section className="space-y-2">
              <label className="text-sm text-zinc-400">Suggested Action</label>
              <textarea
                className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white"
                rows={3}
                value={data.lead.suggested_action || ''}
                onChange={(e) => updateField('suggested_action', e.target.value || null)}
                placeholder="e.g., Ofrecer migración por sitio lento"
                disabled={viewOnly}
              />
            </section>

            <section className="space-y-2">
              <label className="text-sm text-zinc-400">Next Follow Up</label>
              <input
                type="datetime-local"
                className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white"
                value={data.lead.next_follow_up_at ? data.lead.next_follow_up_at.slice(0, 16) : ''}
                onChange={(e) => updateField('next_follow_up_at', e.target.value || null)}
                disabled={viewOnly}
              />
            </section>

            <section className="space-y-2">
              <label className="text-sm text-zinc-400">Notes</label>
              <textarea
                className="w-full rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-white"
                rows={5}
                value={data.lead.notes || ''}
                onChange={(e) => updateField('notes', e.target.value || null)}
                placeholder="Notas internas"
                disabled={viewOnly}
              />
            </section>

            <section className="space-y-2">
              <label className="text-sm text-zinc-400">AI Email Draft</label>
              <div className="rounded-lg bg-zinc-900 border border-white/10 p-3 text-sm text-zinc-200 whitespace-pre-wrap min-h-[120px]">
                {data.lead.ai_email_draft || 'Aún no generado'}
              </div>
              {data.lead.ai_email_draft && !viewOnly && (
                <button
                  onClick={handleCopyDraft}
                  className="text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-200 hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
                >
                  {copied ? '✅ Copied!' : '📧 Copy AI Draft'}
                </button>
              )}
            </section>

            <section className="space-y-2">
              <label className="text-sm text-zinc-400">Pain Points</label>
              <div className="flex flex-wrap gap-1.5">
                {data.lead.pain_points?.length ? (
                  data.lead.pain_points.map((p, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-500">Sin pain points</span>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <label className="text-sm text-zinc-400">Activities</label>
              <div className="space-y-2 rounded-lg bg-zinc-900 border border-white/10 p-3 max-h-64 overflow-y-auto">
                {data.activities.length === 0 && (
                  <p className="text-xs text-zinc-500">No activities yet</p>
                )}
                {data.activities.map((act) => (
                  <div key={act.id} className="flex items-start justify-between text-xs text-zinc-300">
                    <span>{act.activity_type}</span>
                    <span className="text-zinc-500">{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {!viewOnly && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                'px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition',
                saving && 'opacity-60 cursor-not-allowed'
              )}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

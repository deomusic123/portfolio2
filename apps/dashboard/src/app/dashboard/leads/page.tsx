import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { groupLeadsByStatus, KANBAN_COLUMNS } from '@/lib/leads/utils';
import type { Lead } from '@/lib/leads/types';
import { LeadCard } from '@/components/leads/LeadCard';
import { NewLeadButton } from '@/components/leads/NewLeadButton';

export const metadata = {
  title: 'Leads Engine - Portfolio2',
  description: 'Convert prospects into clients with AI-powered insights',
};

export default async function LeadsPage() {
  // Server Component - Auth check + initial data fetch
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch all leads for current user (RLS enforcement)
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6">
          <p className="text-red-400">Failed to load leads: {error.message}</p>
        </div>
      </div>
    );
  }

  // Group leads by status (for Kanban columns)
  const groupedLeads = groupLeadsByStatus((leads || []) as Lead[]);

  // Stats calculation
  const totalLeads = leads?.length || 0;
  const hotLeads = leads?.filter(l => l.ai_score >= 70).length || 0;
  const investigating = leads?.filter(l => l.status === 'investigating').length || 0;
  const totalValue = leads?.reduce((sum, l) => sum + (l.potential_value || 0), 0) || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Leads Engine
          </h1>
          <p className="text-zinc-500">
            🔥 {investigating} analyzing • 🎯 {totalLeads} total • ⚡ {hotLeads} hot leads • 💰 ${totalValue.toLocaleString()} potential value
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            Import CSV
          </button>
          <NewLeadButton />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
          All Leads
        </button>
        <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
          🔥 Hot Leads
        </button>
        <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
          📅 This Week
        </button>
        <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
          📊 This Month
        </button>
      </div>

      {/* Kanban Board - Agency Sniper */}
      <div className="grid grid-cols-7 gap-4 min-h-[600px]">
        {KANBAN_COLUMNS.map((column) => {
          const statusLeads = groupedLeads[column.id] || [];
          return (
            <div key={column.id} className="flex flex-col gap-3">
              {/* Column Header */}
              <div 
                className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all"
                style={{ 
                  backgroundColor: `${column.color}15`,
                  borderColor: `${column.color}40`
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{column.icon}</span>
                  <h3 className="text-sm font-semibold text-white">
                    {column.label}
                  </h3>
                </div>
                <span className="text-xs text-zinc-500">
                  {statusLeads.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[700px] pr-2">
                {statusLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                
                {statusLeads.length === 0 && (
                  <div className="flex-1 rounded-lg border-2 border-dashed border-white/5 flex items-center justify-center py-8">
                    <p className="text-zinc-600 text-xs">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalLeads === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No leads yet</h3>
            <p className="text-zinc-500 mb-6">Create your first lead to start converting!</p>
            <NewLeadButton />
          </div>
        </div>
      )}
    </div>
  );
}


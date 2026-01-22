import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

/**
 * StatsCards - Server Component
 * Displays key metrics: total leads, projects, conversion rate, active projects
 */
export async function StatsCards() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Fetch leads stats
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, status')
      .eq('client_id', user.id);

    // Fetch projects stats
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status')
      .eq('client_id', user.id);

    if (leadsError || projectsError) {
      throw leadsError || projectsError;
    }

    const totalLeads = leads?.length || 0;
    const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

    const totalProjects = projects?.length || 0;
    const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
    const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

    const stats = [
      {
        label: 'Total Leads',
        value: totalLeads,
        icon: '👥',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
      },
      {
        label: 'Active Projects',
        value: activeProjects,
        icon: '🚀',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
      },
      {
        label: 'Conversion Rate',
        value: `${conversionRate}%`,
        icon: '📈',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
      },
      {
        label: 'Completed',
        value: completedProjects,
        icon: '✅',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'p-6 rounded-xl border backdrop-blur-sm transition-all hover:scale-105',
              stat.bgColor,
              stat.borderColor
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <div className={cn('h-12 w-12 rounded-lg bg-gradient-to-br flex items-center justify-center', stat.color)}>
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-400">{stat.label}</h3>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load stats'}
        </p>
      </div>
    );
  }
}

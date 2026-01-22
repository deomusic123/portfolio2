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
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
      },
      {
        label: 'Active Projects',
        value: activeProjects,
        icon: '🚀',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
      },
      {
        label: 'Conversion Rate',
        value: `${conversionRate}%`,
        icon: '📈',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
      },
      {
        label: 'Completed',
        value: completedProjects,
        icon: '✅',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {/* Glow effect en hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icono con brillo sutil y animación */}
              <div className={cn(
                'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6',
                stat.iconBg,
                stat.iconColor
              )}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              
              {/* Label en gris */}
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                {stat.label}
              </h3>
              
              {/* Número grande y blanco con animación */}
              <p className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load stats'}
        </p>
      </div>
    );
  }
}

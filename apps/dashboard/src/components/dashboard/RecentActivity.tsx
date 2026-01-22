import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

type Activity = {
  id: string;
  type: 'lead' | 'project';
  name: string;
  status: string;
  created_at: string;
};

/**
 * RecentActivity - Server Component
 * Shows last 8 created leads and projects combined
 */
export async function RecentActivity() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Fetch recent leads
    const { data: leads } = await supabase
      .from('leads')
      .select('id, name, status, created_at')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4);

    // Fetch recent projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, status, created_at')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4);

    const activities: Activity[] = [
      ...(leads?.map(l => ({ ...l, type: 'lead' as const })) || []),
      ...(projects?.map(p => ({ ...p, type: 'project' as const })) || []),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

    const getIcon = (type: 'lead' | 'project') => type === 'lead' ? '👤' : '📁';
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'new':
        case 'planning':
          return 'bg-blue-500/20 text-blue-400';
        case 'contacted':
        case 'in_progress':
          return 'bg-purple-500/20 text-purple-400';
        case 'qualified':
          return 'bg-yellow-500/20 text-yellow-400';
        case 'converted':
        case 'completed':
          return 'bg-green-500/20 text-green-400';
        case 'lost':
        case 'on_hold':
          return 'bg-red-500/20 text-red-400';
        default:
          return 'bg-neutral-500/20 text-neutral-400';
      }
    };

    return (
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        
        {activities.length === 0 ? (
          <p className="text-sm text-zinc-500">No activity yet. Create your first lead or project!</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Link
                key={`${activity.type}-${activity.id}`}
                href={activity.type === 'lead' ? ROUTES.LEADS : ROUTES.PROJECTS}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <span className="text-2xl">{getIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(activity.created_at).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-full', getStatusColor(activity.status))}>
                  {activity.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load activity'}
        </p>
      </div>
    );
  }
}

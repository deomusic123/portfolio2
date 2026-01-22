import { createClient } from '@/lib/supabase/server';
import { StatusCharts } from './StatusCharts';

/**
 * ChartsContainer - Server Component
 * Fetches aggregated data and passes to client chart component
 */
export async function ChartsContainer() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Fetch leads grouped by status
    const { data: leads } = await supabase
      .from('leads')
      .select('status')
      .eq('client_id', user.id);

    // Fetch projects grouped by status
    const { data: projects } = await supabase
      .from('projects')
      .select('status')
      .eq('client_id', user.id);

    // Aggregate leads by status
    const leadsStatusMap: Record<string, number> = {};
    leads?.forEach((lead) => {
      leadsStatusMap[lead.status] = (leadsStatusMap[lead.status] || 0) + 1;
    });

    const leadsData = [
      { label: 'new', count: leadsStatusMap['new'] || 0, color: 'bg-blue-500' },
      { label: 'contacted', count: leadsStatusMap['contacted'] || 0, color: 'bg-purple-500' },
      { label: 'qualified', count: leadsStatusMap['qualified'] || 0, color: 'bg-yellow-500' },
      { label: 'converted', count: leadsStatusMap['converted'] || 0, color: 'bg-green-500' },
      { label: 'lost', count: leadsStatusMap['lost'] || 0, color: 'bg-red-500' },
    ];

    // Aggregate projects by status
    const projectsStatusMap: Record<string, number> = {};
    projects?.forEach((project) => {
      projectsStatusMap[project.status] = (projectsStatusMap[project.status] || 0) + 1;
    });

    const projectsData = [
      { label: 'planning', count: projectsStatusMap['planning'] || 0, color: 'bg-blue-500' },
      { label: 'in_progress', count: projectsStatusMap['in_progress'] || 0, color: 'bg-purple-500' },
      { label: 'completed', count: projectsStatusMap['completed'] || 0, color: 'bg-green-500' },
      { label: 'on_hold', count: projectsStatusMap['on_hold'] || 0, color: 'bg-red-500' },
    ];

    return <StatusCharts leadsData={leadsData} projectsData={projectsData} />;
  } catch (error) {
    return (
      <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load charts'}
        </p>
      </div>
    );
  }
}

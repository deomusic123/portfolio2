import { createClient } from '@/lib/supabase/server';
import { ProjectsTableClient } from './ProjectsTableClient';

/**
 * ProjectsTable - Server Component
 * Fetches projects data and passes to Client Component
 */
export async function ProjectsTable() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">Not authenticated</p>
        </div>
      );
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error.message}</p>
        </div>
      );
    }

    return <ProjectsTableClient projects={projects || []} />;
  } catch (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400">
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </p>
      </div>
    );
  }
}

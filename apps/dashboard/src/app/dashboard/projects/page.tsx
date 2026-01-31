import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { ProjectCard } from '@/components/dashboard/projects/project-card';
import { CreateProjectDialog } from '@/components/dashboard/projects/create-project-dialog';
import type { Project, Task } from '@/types/projects';

export const metadata = {
  title: 'Projects - Portfolio2',
  description: 'Manage projects and tasks',
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data: projects } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!projects) {
    throw new Error('Failed to load projects');
  }

  const list = (projects || []) as (Project & { tasks: Task[] })[];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Projects</p>
          <h1 className="text-4xl font-bold text-white">Project Portfolio</h1>
          <p className="text-sm text-zinc-400">Plan, track, and ship projects aligned to your closed leads.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.LEADS}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20"
          >
            Go to Leads
          </Link>
          <CreateProjectDialog />
        </div>
      </div>

      {list.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
          <p className="text-lg text-white">No projects yet</p>
          <p className="text-sm text-zinc-400">Close a lead or create a project to start planning.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((project) => (
          <ProjectCard key={project.id} project={project} tasks={project.tasks || []} />
        ))}
      </div>
    </div>
  );
}

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';
import { ProjectHeader } from '@/components/dashboard/projects/project-header';
import { ProjectTasks } from '@/components/dashboard/projects/project-tasks';
import type { Project, Task } from '@/types/projects';

interface Params {
  id: string;
}

export default async function ProjectDetailPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.LOGIN);

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!project) return notFound();

  const typedProject = project as Project & { tasks: Task[] };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href={ROUTES.DASHBOARD} className="text-white hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href={ROUTES.PROJECTS} className="text-white hover:underline">Projects</Link>
        <span>/</span>
        <span>{typedProject.name}</span>
      </div>

      <ProjectHeader project={typedProject} />
      <ProjectTasks projectId={typedProject.id} tasks={typedProject.tasks || []} />
    </div>
  );
}

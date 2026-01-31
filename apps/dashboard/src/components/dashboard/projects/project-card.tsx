import Link from 'next/link';
import { CalendarClock, Building2, Rocket, Pause, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Project, Task } from '@/types/projects';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  tasks?: Task[];
}

function statusBadge(status: Project['status']) {
  const map: Record<Project['status'], { label: string; className: string }> = {
    planning: { label: 'Planning', className: 'bg-blue-500/15 text-blue-200 border-blue-400/30' },
    active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30' },
    review: { label: 'Review', className: 'bg-amber-500/15 text-amber-200 border-amber-400/30' },
    completed: { label: 'Completed', className: 'bg-purple-500/15 text-purple-200 border-purple-400/30' },
    paused: { label: 'Paused', className: 'bg-zinc-500/15 text-zinc-200 border-zinc-400/30' },
  };
  return map[status];
}

export function ProjectCard({ project, tasks = [] }: Props) {
  const completed = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const badge = statusBadge(project.status);

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Building2 className="h-4 w-4" />
            <span>{project.client_name}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-blue-100">{project.name}</h3>
        </div>
        <span
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium',
            badge.className
          )}
        >
          {badge.label}
        </span>
      </div>

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{project.description}</p>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
        <CalendarClock className="h-4 w-4" />
        {project.deadline || project.start_date ? (
          <span>
            {project.start_date ? `Start: ${project.start_date}` : 'No start'}
            {project.deadline ? ` · Due: ${project.deadline}` : ''}
          </span>
        ) : (
          <span>No dates set</span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            {progress >= 100 ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Rocket className="h-4 w-4 text-blue-300" />}
            <span>{progress}%</span>
          </div>
          <span>
            {completed}/{tasks.length || 0} tasks
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/5">
          <div
            className={cn('h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all')}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {project.status === 'paused' && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-300">
          <Pause className="h-4 w-4" />
          On hold
        </div>
      )}

      {project.status === 'review' && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4" />
          Awaiting approvals
        </div>
      )}
    </Link>
  );
}

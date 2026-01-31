import { CalendarClock, Building2 } from 'lucide-react';
import type { Project } from '@/types/projects';
import { StatusSelect } from './status-select';

interface Props {
  project: Project;
}

export function ProjectHeader({ project }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Building2 className="h-4 w-4" />
            <span>{project.client_name}</span>
          </div>
          <h1 className="text-3xl font-semibold text-white">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-zinc-400">{project.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              {project.start_date ? `Start: ${project.start_date}` : 'No start date'}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              {project.deadline ? `Deadline: ${project.deadline}` : 'No deadline'}
            </span>
          </div>
        </div>
        <StatusSelect projectId={project.id} value={project.status} />
      </div>
    </div>
  );
}

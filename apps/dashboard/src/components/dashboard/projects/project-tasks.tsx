'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle2, Circle, Clock3, AlertTriangle } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '@/types/projects';
import { createTask, updateTaskPriority, updateTaskStatus } from '@/actions/projects';
import { cn } from '@/lib/utils';

interface Props {
  projectId: string;
  tasks: Task[];
}

const statusLabels: Record<TaskStatus, { label: string; icon: JSX.Element }> = {
  todo: { label: 'Todo', icon: <Circle className="h-4 w-4" /> },
  in_progress: { label: 'In Progress', icon: <Clock3 className="h-4 w-4" /> },
  review: { label: 'Review', icon: <AlertTriangle className="h-4 w-4" /> },
  done: { label: 'Done', icon: <CheckCircle2 className="h-4 w-4" /> },
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-blue-500/20 text-blue-200',
  medium: 'bg-emerald-500/20 text-emerald-200',
  high: 'bg-amber-500/20 text-amber-200',
  urgent: 'bg-red-500/20 text-red-200',
};

export function ProjectTasks({ projectId, tasks }: Props) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const router = useRouter();

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleCreate = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      await createTask({ project_id: projectId, title: title.trim(), priority });
      setTitle('');
      setPriority('medium');
      router.refresh();
    });
  };

  const handleStatus = (id: string, status: TaskStatus) => {
    setTaskList((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
    startTransition(async () => {
      await updateTaskStatus(id, status);
      router.refresh();
    });
  };

  const handlePriority = (id: string, next: TaskPriority) => {
    setTaskList((prev) => prev.map((task) => (task.id === id ? { ...task, priority: next } : task)));
    startTransition(async () => {
      await updateTaskPriority(id, next);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-white">Tasks</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="min-w-[220px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none"
            disabled={isPending}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
            disabled={isPending}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {taskList.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-zinc-400">
            No tasks yet
          </div>
        )}
        {taskList.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-white md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <p className="text-xs text-zinc-400">{task.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={task.status}
                onChange={(e) => handleStatus(task.id, e.target.value as TaskStatus)}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs focus:border-white/30 focus:outline-none"
                disabled={isPending}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>

              <select
                value={task.priority}
                onChange={(e) => handlePriority(task.id, e.target.value as TaskPriority)}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs focus:border-white/30 focus:outline-none"
                disabled={isPending}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <span className={cn('rounded-full px-3 py-1 text-[11px] border', priorityColors[task.priority])}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

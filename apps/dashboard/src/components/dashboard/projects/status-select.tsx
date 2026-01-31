'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProjectStatus } from '@/actions/projects';
import type { ProjectStatus } from '@/types/projects';
import { cn } from '@/lib/utils';

const OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'planning', label: 'Planning', color: 'text-blue-300' },
  { value: 'active', label: 'Active', color: 'text-green-300' },
  { value: 'review', label: 'Review', color: 'text-amber-300' },
  { value: 'completed', label: 'Completed', color: 'text-emerald-300' },
  { value: 'paused', label: 'Paused', color: 'text-zinc-300' },
];

interface Props {
  projectId: string;
  value: ProjectStatus;
}

export function StatusSelect({ projectId, value }: Props) {
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState<ProjectStatus>(value);
  const router = useRouter();

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  const handleChange = (next: ProjectStatus) => {
    if (next === current) return;
    setCurrent(next);
    startTransition(async () => {
      await updateProjectStatus(projectId, next);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleChange(opt.value)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs transition',
            opt.color,
            current === opt.value
              ? 'border-white/40 bg-white/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          )}
          disabled={isPending}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

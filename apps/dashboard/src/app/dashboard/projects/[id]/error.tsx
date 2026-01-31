'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectDetailError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
        Project failed to load
      </div>
      <p className="max-w-md text-sm text-zinc-300">{error.message || 'Unexpected error'}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

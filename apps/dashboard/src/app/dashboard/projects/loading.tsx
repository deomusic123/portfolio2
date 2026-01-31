export default function ProjectsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="h-8 w-64 rounded bg-white/10" />
          <div className="h-3 w-80 rounded bg-white/10" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 rounded-lg bg-white/10" />
          <div className="h-9 w-32 rounded-lg bg-gradient-to-r from-blue-500/40 to-purple-500/40" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-full w-full animate-pulse rounded-lg bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

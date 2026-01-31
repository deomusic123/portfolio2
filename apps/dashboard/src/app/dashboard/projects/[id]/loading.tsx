export default function ProjectDetailLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <div className="h-3 w-16 rounded bg-white/10" />
        <span>/</span>
        <div className="h-3 w-24 rounded bg-white/10" />
        <span>/</span>
        <div className="h-3 w-32 rounded bg-white/10" />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="mt-3 h-4 w-72 rounded bg-white/10" />
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="h-9 w-32 rounded-full bg-white/10" />
          <div className="h-9 w-28 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 h-5 w-20 rounded bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-14 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

import { TECH_STACK } from '@/lib/constants/landing-data';

export function TechStackGrid() {
  return (
    <section className="py-24 relative z-20">
      <div className="text-center mb-12">
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-500">
          Infrastructure Core
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((tech, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 p-7 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-lg bg-black border border-white/10 flex items-center justify-center group-hover:border-${tech.color}-500/50 transition-colors relative z-10`}>
                {tech.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-zinc-100 font-medium">{tech.name}</h3>
                <p className={`text-xs text-${tech.color}-500/80 font-mono`}>{tech.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

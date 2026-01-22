'use client';

import { StickyScrollReveal } from '@/components/ui/sticky-scroll-reveal';
import Link from 'next/link';

export default function TestStickyPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navbar simple */}
      <div className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">Sticky Scroll Test</h1>
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">← Volver a Home</Link>
        </div>
      </div>

      {/* Hero Text (NO va en sticky) */}
      <section className="pt-32 pb-10 px-4 text-center relative z-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Efecto Sticky Glass
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Haz scroll para ver cómo el Dashboard se queda "pegado", se desenfoca, y el Tech Stack se desliza por encima.
          </p>
          <div className="text-sm text-zinc-500 font-mono">
            ↓ SCROLL DOWN ↓
          </div>
        </div>
      </section>

      {/* LA MAGIA: Sticky Scroll Reveal */}
      <StickyScrollReveal
        // CHILDREN: El Dashboard (se va a desenfocar)
        children={
          <div className="w-full h-full flex items-center justify-center px-4">
            <div className="relative max-w-4xl w-full">
              {/* Dashboard Simplificado */}
              <div className="rounded-2xl border-4 border-zinc-700 p-4 bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-black">
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Portfolio2</h3>
                          <p className="text-zinc-500 text-xs">Test Dashboard</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Leads', value: '156', icon: '👥', color: 'from-blue-500/30' },
                        { label: 'Projects', value: '23', icon: '🚀', color: 'from-purple-500/30' },
                        { label: 'Rate', value: '68%', icon: '📈', color: 'from-green-500/30' },
                        { label: 'Revenue', value: '$45K', icon: '💰', color: 'from-emerald-500/30' },
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                          <div className={`mb-2 w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                            {stat.icon}
                          </div>
                          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart Placeholder */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                      <h4 className="text-white font-semibold mb-4">Analytics</h4>
                      <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-zinc-500 text-sm">Dashboard Content</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10" />
            </div>
          </div>
        }
        
        // CONTENT: El Tech Stack (va a deslizar por encima)
        content={
          <div className="relative z-30 pb-20">
            {/* Fondo Glassmorphism */}
            <div className="max-w-6xl mx-auto px-6 backdrop-blur-xl bg-black/60 border-t border-white/10 rounded-t-3xl pt-20">
              
              {/* Título */}
              <div className="text-center mb-12">
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Infrastructure Core
                </h2>
              </div>

              {/* Grid de Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
                {[
                  { name: 'Next.js 15', desc: 'Framework', color: 'white', bg: 'white/10' },
                  { name: 'Supabase', desc: 'Database', color: 'emerald-500', bg: 'emerald-500/10' },
                  { name: 'n8n', desc: 'Automation', color: 'pink-500', bg: 'pink-500/10' },
                  { name: 'TypeScript', desc: 'Type Safety', color: 'blue-500', bg: 'blue-500/10' },
                  { name: 'React 19', desc: 'UI Library', color: 'cyan-400', bg: 'cyan-500/10' },
                  { name: 'Tailwind v4', desc: 'Styling', color: 'sky-400', bg: 'sky-500/10' },
                ].map((tech, i) => (
                  <div key={i} className={`group flex items-center gap-4 p-7 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/80 hover:border-${tech.color}/30 transition-all duration-300`}>
                    <div className={`h-12 w-12 rounded-lg bg-black border border-white/10 flex items-center justify-center group-hover:border-${tech.color}/50 transition-colors`}>
                      <div className={`w-6 h-6 rounded bg-${tech.bg}`} />
                    </div>
                    <div>
                      <h3 className="text-zinc-100 font-medium">{tech.name}</h3>
                      <p className={`text-xs text-${tech.color}/80 font-mono`}>{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicador de final */}
              <div className="text-center py-20">
                <p className="text-zinc-500 text-sm font-mono">
                  ✨ Fin del efecto Sticky Scroll
                </p>
                <Link 
                  href="/" 
                  className="inline-block mt-6 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Volver a Home
                </Link>
              </div>
            </div>
          </div>
        }
      />

      {/* Sección extra para mostrar que el scroll continúa */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Continúa el scroll normal
          </h3>
          <p className="text-zinc-400">
            Esta sección ya no tiene el efecto sticky. El contenido fluye normalmente.
          </p>
        </div>
      </section>
    </main>
  );
}

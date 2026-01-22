import { BackgroundBeams } from '@portfolio2/ui';
import Link from 'next/link';
import { HERO } from '@/lib/constants/landing-data';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-blue-950/5 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBeams className="opacity-40" />
      </div>
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-30 animate-pulse delay-75" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-500 rounded-full opacity-20 animate-pulse delay-150" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-8">
          {/* Badge verde superior */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 text-sm font-medium">
              {HERO.badge.emoji} {HERO.badge.text}
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="block text-white font-mono">{HERO.title.line1}</span>
            <span className="block">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text font-mono">
                {HERO.title.line2}
              </span>
            </span>
            <span className="block">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text font-mono">
                {HERO.title.line3}
              </span>
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
            {HERO.subtitle.text}{' '}
            <span className="text-blue-400 font-bold">{HERO.subtitle.highlight}</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/setup-sprint"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                {HERO.cta.primary.text} {HERO.cta.primary.arrow}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="#demo"
              className="px-8 py-4 border-2 border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all"
            >
              {HERO.cta.secondary.text}
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: HERO.socialProof.avatars }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-black"
                  style={{
                    background: `linear-gradient(135deg, ${
                      i === 0 ? '#3b82f6, #8b5cf6' : i === 1 ? '#8b5cf6, #ec4899' : '#ec4899, #3b82f6'
                    })`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-wider">
              {HERO.socialProof.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

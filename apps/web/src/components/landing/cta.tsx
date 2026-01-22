import Link from 'next/link';
import { CTA } from '@/lib/constants/landing-data';

export function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Gradiente de fondo */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 70%)',
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Título */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
          {CTA.title}
        </h2>
        
        {/* Descripción */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          {CTA.description}
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/setup-sprint"
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 flex items-center gap-2"
          >
            {CTA.primaryButton.text} ({CTA.primaryButton.price})
          </Link>

          <Link
            href="/contacto"
            className="px-8 py-4 border-2 border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all"
          >
            {CTA.secondaryButton.text}
          </Link>
        </div>

        {/* Garantía */}
        <div className="pt-6">
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            {CTA.guarantee}
          </p>
        </div>
      </div>
    </section>
  );
}

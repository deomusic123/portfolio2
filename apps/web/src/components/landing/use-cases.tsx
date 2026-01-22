'use client';

import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { USE_CASES } from '@/lib/constants/landing-data';

export function UseCasesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-blue-950/10 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Resultados Diseñados para <span className="text-blue-400">Escalar</span>
        </h2>
        <p className="text-zinc-400 text-center text-lg">
          Casos de uso reales implementados en la arquitectura Portfolio2
        </p>
      </div>

      <InfiniteMovingCards
        items={USE_CASES}
        direction="right"
        speed="slow"
      />
    </section>
  );
}

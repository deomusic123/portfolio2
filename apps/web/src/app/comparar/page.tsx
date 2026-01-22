import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: 'Comparativas de Herramientas - Portfolio2',
  description: 'Comparaciones detalladas de las mejores herramientas para agencias digitales. n8n vs Zapier, Supabase vs Firebase y más.',
};

interface SEOPageSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  competitor_a: string;
  competitor_b: string;
  view_count: number;
  published_at: string;
}

export default async function ComparativasIndexPage() {
  const { data: pages } = await supabase
    .from('seo_pages')
    .select('*')
    .like('slug', 'comparar/%')
    .order('view_count', { ascending: false })
    .limit(20);

  const typedPages = (pages || []) as unknown as SEOPageSummary[];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white transition">
            ← Volver al inicio
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Comparativas de Herramientas
        </h1>
        <p className="text-xl text-neutral-400 mb-12 max-w-3xl">
          Análisis detallados para ayudarte a elegir las mejores herramientas para tu agencia digital.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedPages.map((page) => (
            <Link
              key={page.id}
              href={`/${page.slug}`}
              className="group p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚔️</span>
                <h2 className="text-xl font-bold group-hover:text-blue-400 transition">
                  {page.competitor_a} vs {page.competitor_b}
                </h2>
              </div>
              <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                {page.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>👁️ {page.view_count} vistas</span>
                <span>📅 {new Date(page.published_at).toLocaleDateString('es-ES')}</span>
              </div>
            </Link>
          ))}
        </div>

        {typedPages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              No hay comparativas disponibles todavía. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-neutral-500">
          <p>© 2026 Portfolio2. Plataforma para agencias digitales modernas.</p>
        </div>
      </footer>
    </div>
  );
}

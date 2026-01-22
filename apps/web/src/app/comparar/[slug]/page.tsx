import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Cliente Supabase para SSG (solo lectura)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface SEOPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  competitor_a: string;
  competitor_b: string;
  view_count: number;
  published_at: string;
  content: {
    intro_a?: string;
    intro_b?: string;
    comparison?: {
      price_a?: string;
      price_b?: string;
      self_hosted_a?: string;
      self_hosted_b?: string;
      integrations_a?: string;
      integrations_b?: string;
      learning_a?: string;
      learning_b?: string;
    };
  };
}

// Generar metadata dinámica desde DB
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: page } = await supabase
    .from('seo_pages')
    .select('title, description, keywords')
    .eq('slug', `comparar/${slug}`)
    .single();

  if (!page) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords?.join(', '),
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  };
}

// Generar todas las rutas en build time (SSG)
export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from('seo_pages')
    .select('slug')
    .like('slug', 'comparar/%');

  return (
    pages?.map((page) => ({
      slug: page.slug.replace('comparar/', ''),
    })) || []
  );
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  
  const { data: page } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', `comparar/${slug}`)
    .single();

  if (!page) {
    notFound();
  }

  const typedPage = page as unknown as SEOPage;

  // Increment view count (fire and forget)
  supabase
    .from('seo_pages')
    .update({ view_count: typedPage.view_count + 1 })
    .eq('id', typedPage.id)
    .then();

  return (
    <article className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumbs para SEO */}
        <nav className="text-sm text-neutral-400 mb-8">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          {' / '}
          <Link href="/comparar" className="hover:text-white transition">Comparativas</Link>
          {' / '}
          <span className="text-white">{typedPage.competitor_a} vs {typedPage.competitor_b}</span>
        </nav>

        {/* H1 optimizado */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {typedPage.h1}
        </h1>

        {/* Metadata visible */}
        <div className="flex gap-4 text-sm text-neutral-400 mb-12">
          <span>📅 {new Date(typedPage.published_at).toLocaleDateString('es-ES')}</span>
          <span>👁️ {typedPage.view_count} vistas</span>
        </div>

        {/* Content structured */}
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">
              ¿Qué es {typedPage.competitor_a}?
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed">
              {typedPage.content?.intro_a || 'Descripción de la herramienta A...'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              ¿Qué es {typedPage.competitor_b}?
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed">
              {typedPage.content?.intro_b || 'Descripción de la herramienta B...'}
            </p>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Comparación detallada
            </h2>
            <ComparisonTable
              competitorA={typedPage.competitor_a}
              competitorB={typedPage.competitor_b}
              data={typedPage.content?.comparison}
            />
          </section>

          {/* CTA */}
          <section className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para automatizar tu agencia?
            </h3>
            <p className="text-neutral-300 mb-6">
              Prueba nuestra plataforma que integra {typedPage.competitor_a}, {typedPage.competitor_b} y más.
            </p>
            <Link
              href="http://localhost:3001/register"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Comenzar Gratis
            </Link>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-neutral-500">
          <p>© 2026 Portfolio2. Plataforma para agencias digitales modernas.</p>
        </div>
      </footer>
    </article>
  );
}

function ComparisonTable({ 
  competitorA, 
  competitorB, 
  data 
}: { 
  competitorA: string; 
  competitorB: string; 
  data?: SEOPage['content']['comparison'];
}) {
  if (!data) return null;

  const features = [
    { name: 'Precio', a: data.price_a || 'N/A', b: data.price_b || 'N/A' },
    { name: 'Self-hosted', a: data.self_hosted_a || 'N/A', b: data.self_hosted_b || 'N/A' },
    { name: 'Integraciones', a: data.integrations_a || 'N/A', b: data.integrations_b || 'N/A' },
    { name: 'Curva aprendizaje', a: data.learning_a || 'N/A', b: data.learning_b || 'N/A' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left py-4 px-4 text-white font-semibold">Característica</th>
            <th className="text-center py-4 px-4 text-blue-400 font-semibold">{competitorA}</th>
            <th className="text-center py-4 px-4 text-purple-400 font-semibold">{competitorB}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} className="border-b border-neutral-800">
              <td className="py-4 px-4 text-neutral-300">{feature.name}</td>
              <td className="py-4 px-4 text-center text-white">{feature.a}</td>
              <td className="py-4 px-4 text-center text-white">{feature.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

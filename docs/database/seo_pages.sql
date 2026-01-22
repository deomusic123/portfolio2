--- Tabla para SEO programático
-- Genera miles de landing pages dinámicas para tráfico orgánico

CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- ej: "comparar/n8n-vs-zapier"
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  h1 TEXT NOT NULL,
  content JSONB, -- Contenido estructurado
  keywords TEXT[], -- Array de keywords
  competitor_a TEXT, -- Para páginas de comparación
  competitor_b TEXT,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9\-/]+$')
);

-- Índices para performance
CREATE INDEX idx_seo_pages_slug ON public.seo_pages(slug);
CREATE INDEX idx_seo_pages_keywords ON public.seo_pages USING GIN(keywords);
CREATE INDEX idx_seo_pages_published ON public.seo_pages(published_at DESC);

-- RLS (solo lectura pública)
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO pages are publicly readable"
  ON public.seo_pages
  FOR SELECT
  USING (true);

-- Function para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_seo_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER set_seo_pages_updated_at
  BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_pages_updated_at();

-- Seed data ejemplo
INSERT INTO public.seo_pages (slug, title, description, h1, competitor_a, competitor_b, keywords, content)
VALUES
  (
    'comparar/n8n-vs-zapier',
    'n8n vs Zapier: Comparativa 2026 - ¿Cuál elegir?',
    'Comparación detallada entre n8n y Zapier. Características, precios, ventajas y desventajas. Guía actualizada 2026.',
    '¿n8n o Zapier? Comparativa completa 2026',
    'n8n',
    'Zapier',
    ARRAY['automatización', 'no-code', 'workflows', 'n8n', 'zapier'],
    '{
      "intro_a": "n8n es una plataforma de automatización de workflows open-source que permite conectar aplicaciones y servicios. A diferencia de otras herramientas, n8n puede ser self-hosted, dándote control total sobre tus datos y procesos.",
      "intro_b": "Zapier es el líder del mercado en automatización no-code. Con más de 5000 integraciones, permite conectar prácticamente cualquier herramienta SaaS sin escribir una línea de código.",
      "comparison": {
        "price_a": "Gratis (self-hosted) o desde $20/mes",
        "price_b": "Desde $19.99/mes",
        "self_hosted_a": "Sí",
        "self_hosted_b": "No",
        "integrations_a": "400+",
        "integrations_b": "5000+",
        "learning_a": "Media-Alta",
        "learning_b": "Baja"
      }
    }'::jsonb
  ),
  (
    'comparar/supabase-vs-firebase',
    'Supabase vs Firebase: ¿Cuál es mejor para tu proyecto en 2026?',
    'Análisis completo de Supabase y Firebase. Precios, escalabilidad, curva de aprendizaje y casos de uso reales.',
    'Supabase vs Firebase: La batalla de los BaaS',
    'Supabase',
    'Firebase',
    ARRAY['backend', 'base de datos', 'supabase', 'firebase', 'baas', 'postgresql'],
    '{
      "intro_a": "Supabase es una alternativa open-source a Firebase construida sobre PostgreSQL. Ofrece autenticación, base de datos, storage y edge functions con SQL completo.",
      "intro_b": "Firebase de Google es la plataforma BaaS más popular. Incluye Firestore (NoSQL), autenticación, hosting, functions y más, todo integrado con el ecosistema de Google.",
      "comparison": {
        "price_a": "Gratis hasta 500MB DB, luego $25/mes",
        "price_b": "Gratis hasta 1GB Firestore, luego pago por uso",
        "self_hosted_a": "Sí",
        "self_hosted_b": "No",
        "integrations_a": "PostgreSQL, REST, GraphQL",
        "integrations_b": "Todo el ecosistema Google",
        "learning_a": "Media (SQL)",
        "learning_b": "Baja (NoSQL)"
      }
    }'::jsonb
  ),
  (
    'comparar/nextjs-vs-remix',
    'Next.js vs Remix: Comparativa de frameworks React 2026',
    'Diferencias clave entre Next.js y Remix. Rendimiento, DX, ecosistema y cuándo usar cada uno.',
    'Next.js vs Remix: ¿Qué framework React elegir?',
    'Next.js',
    'Remix',
    ARRAY['nextjs', 'remix', 'react', 'frameworks', 'ssr', 'full-stack'],
    '{
      "intro_a": "Next.js de Vercel es el framework React más popular. Con App Router y Server Components, ofrece SSR, SSG, ISR y streaming out of the box.",
      "intro_b": "Remix es un full-stack framework React enfocado en Web Fundamentals. Usa nested routing, loaders/actions y aprovecha al máximo las APIs del navegador.",
      "comparison": {
        "price_a": "Open-source (deploy en Vercel gratis)",
        "price_b": "Open-source (deploy en cualquier plataforma)",
        "self_hosted_a": "Sí",
        "self_hosted_b": "Sí",
        "integrations_a": "Vercel, Netlify, AWS, etc.",
        "integrations_b": "Cloudflare, Fly.io, AWS, etc.",
        "learning_a": "Media",
        "learning_b": "Media-Alta"
      }
    }'::jsonb
  );

-- Comentarios de documentación
COMMENT ON TABLE public.seo_pages IS 'Páginas dinámicas para SEO programático (landing pages generadas desde DB)';
COMMENT ON COLUMN public.seo_pages.slug IS 'URL slug único (ej: comparar/tool-a-vs-tool-b)';
COMMENT ON COLUMN public.seo_pages.content IS 'Contenido estructurado en JSON para flexibilidad en templates';
COMMENT ON COLUMN public.seo_pages.view_count IS 'Contador de visitas para analytics básico';

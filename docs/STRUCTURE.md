**BLUF**: Mapa rápido de carpetas y archivos clave para encontrar lo importante rápidamente.

## Arquitectura Monorepo (Turborepo)

Portfolio2/
├── apps/
│  ├── web/                     # Landing público (SSG) - Puerto 3000
│  │  └── src/
│  │     └── app/
│  │        ├── page.tsx        # Homepage con Hero
│  │        ├── comparar/
│  │        │  ├── page.tsx     # Índice de comparativas
│  │        │  └── [slug]/
│  │        │     └── page.tsx  # Páginas SEO dinámicas
│  │        └── sitemap.ts      # Sitemap dinámico
│  │
│  └── dashboard/               # App SaaS (SSR/PPR) - Puerto 3001
│     └── src/
│        ├── app/               # Rutas (Server Components)
│        │  ├── (auth)/         # Login / Register
│        │  └── (dashboard)/    # Rutas protegidas
│        ├── actions/           # Server Actions
│        ├── components/        # UI y Client Components
│        ├── lib/               # Utils y Supabase clients
│        └── middleware.ts      # JWT refresh
│
├── packages/
│  └── ui/                      # Componentes compartidos
│     ├── components/
│     │  ├── background-beams.tsx
│     │  ├── bento-grid.tsx
│     │  └── skeleton.tsx
│     └── lib/
│        ├── utils.ts           # cn() helper
│        └── framer.tsx         # MotionProvider (LazyMotion)
│
├── docs/                       # Documentación
│  ├── PROJECT_DOCUMENTATION.md
│  ├── IMPLEMENTATION_PLAN_COMPLETED.md
│  ├── architecture/SYSTEM_CONTEXT.md
│  ├── SETUP.md
│  ├── SECURITY.md
│  ├── DEVELOPER_GUIDE.md
│  └── database/
│     ├── schema.sql
│     └── seo_pages.sql         # Tabla SEO programático
│
└── turbo.json                  # Configuración Turborepo

## Apps

### apps/web (Landing público)
- Puerto: 3000
- Estrategia: SSG/ISR
- Propósito: Marketing, SEO, captación de leads
- Principales rutas:
  - `/` - Homepage
  - `/comparar` - Índice de comparativas
  - `/comparar/[slug]` - Páginas dinámicas SEO (ej: /comparar/n8n-vs-zapier)
  - `/sitemap.xml` - Sitemap dinámico

### apps/dashboard (App SaaS)
- Puerto: 3001
- Estrategia: SSR/PPR
- Propósito: Gestión de proyectos, leads, automatización

apps/dashboard/src/
├─ app/                      # Rutas y layouts (Server Components por defecto)
│  ├─ (auth)/                # Login / Register
│  ├─ (dashboard)/           # Rutas protegidas
│  ├─ layout.tsx             # Layout raíz con MotionProvider
│  └─ page.tsx               # Home

├─ components/
│  ├─ ui/                   # (Ya no se usa, migrado a @portfolio2/ui)
│  ├─ auth/                 # `AuthForm.tsx`
│  └─ dashboard/            # `LeadsTable`, `ProjectsTable`, `StatsCards`

├─ actions/                 # Server Actions (mutations): `auth.ts`, `leads.ts`, `projects.ts`
├─ lib/
│  └─ supabase/
│     ├─ server.ts          # createServerClient para RSC/Actions
│     ├─ middleware.ts      # JWT refresh logic
│     └─ admin.ts           # SERVICE_ROLE helpers

├─ hooks/                   # Reutilizables (`useUser.tsx`)
├─ types/                   # Tipos TS y Zod schemas
├─ middleware.ts            # Middleware de Next.js (entry)

## Packages compartidos

### packages/ui
- Componentes Aceternity exportados para reutilización
- LazyMotion wrapper para Framer Motion
- cn() utility
- Importación: `import { BentoGrid, cn } from '@portfolio2/ui'`

Principales puntos de interés:
- Revisa `apps/dashboard/src/lib/supabase/server.ts` para ver cómo crear clientes en Server Components.
- `apps/dashboard/src/middleware.ts` contiene las reglas de acceso y el refresco de tokens.
- `packages/ui/` contiene todos los componentes visuales compartidos entre apps.
- `docs/` contiene guías y el esquema SQL en `docs/database/schema.sql`.


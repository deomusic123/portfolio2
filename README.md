# Portfolio2 - Agencia Digital Moderna

Plataforma moderna de gestión de proyectos, leads y automatización construida con **Next.js 15**, **React 19 RC**, **Tailwind CSS v4**, **Aceternity UI**, **Supabase** y **n8n**.

## ⚡ Arquitectura Monorepo (Turborepo)

El proyecto está organizado como monorepo para separar la landing pública (marketing/SEO) de la aplicación SaaS (dashboard).

```
apps/
  web/              # Landing público (SSG) - Puerto 3000
  dashboard/        # App SaaS (SSR/PPR) - Puerto 3001
packages/
  ui/              # Componentes compartidos (Aceternity + LazyMotion)
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Configure environment
# Para apps/web:
cp apps/web/.env.example apps/web/.env.local
# Para apps/dashboard:
cp .env.local.example apps/dashboard/.env.local

# 3. Setup database
# Run SQL from docs/database/schema.sql AND docs/database/seo_pages.sql in Supabase console

# 4. Start dev servers
npm run dev              # Ambas apps (web + dashboard)
npm run dev:web          # Solo landing (puerto 3000)
npm run dev:dashboard    # Solo dashboard (puerto 3001)
```

Visit:
- Landing: `http://localhost:3000`
- Dashboard: `http://localhost:3001`
- Comparativas SEO: `http://localhost:3000/comparar`

## 📚 Documentation

- **[Project Documentation](docs/PROJECT_DOCUMENTATION.md)** - Resumen central del proyecto
- **[Implementation Plan Completed](docs/IMPLEMENTATION_PLAN_COMPLETED.md)** - Plan ejecutado con detalles técnicos
- **[SETUP GUIDE](docs/SETUP.md)** - Detailed setup instructions
- **[Architecture](docs/architecture/SYSTEM_CONTEXT.md)** - System design & directory structure
- **[Structure Guide](docs/STRUCTURE.md)** - Mapa de carpetas y archivos
- **[Security Guide](docs/SECURITY.md)** - Reglas de seguridad y RLS
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Guía para desarrolladores
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI development guidelines
- **[Modes](.github/prompts/MODES.md)** - Interaction modes for Copilot
- **[Database Schema](docs/database/schema.sql)** - PostgreSQL RLS setup
- **[SEO Pages Schema](docs/database/seo_pages.sql)** - Tabla para SEO programático

## 🏗️ Architecture

### Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + React 19 RC | Server Components + Server Actions |
| Styling | Tailwind CSS v4 | Hybrid CSS/JS config |
| Components | Aceternity UI | Visual patterns |
| Animation | Framer Motion v12-alpha | React 19 compatible |
| Database | Supabase (PostgreSQL) | Auth + Data + RLS |
| Automation | n8n | Workflow orchestration |

### Data Flow
```
User Form → Server Action → Zod Validation → Supabase Insert (RLS)
                                                    ↓
                                         PostgreSQL Trigger (pg_net)
                                                    ↓
                                              n8n Webhook
                                    (Enrich, CRM sync, Notify)
                                                    ↓
                                         Update Supabase (SERVICE_ROLE)
```

## 🔒 Security

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Supabase Auth handles token lifecycle
- **Async Cookies**: Next.js 15 compliant with no secrets on client
- **Server-Only Secrets**: n8n webhooks called only from Server Actions
- **Middleware Gate**: JWT refresh before Server Components execute

## 🎯 Key Features (Roadmap)

- [x] Base project structure (Next.js 15)
- [x] Tailwind v4 hybrid config (Aceternity compatible)
- [x] Supabase integration + RLS policies
- [x] JWT middleware authentication
- [ ] Login/Register pages
- [ ] Dashboard layout
- [ ] Leads management
- [ ] Projects CRUD
- [ ] n8n automation triggers
- [ ] Analytics dashboard
- [ ] API documentation

## 💻 Development

```bash
# Desarrollo
npm run dev                    # Todas las apps
npm run dev:web               # Solo landing (puerto 3000)
npm run dev:dashboard         # Solo dashboard (puerto 3001)

# Build
npm run build                 # Build todas las apps con Turbo
npm run build:web             # Build solo landing
npm run build:dashboard       # Build solo dashboard

# Quality checks
npm run type-check            # TypeScript check
npm run lint                  # ESLint

# Turborepo
turbo run build --force       # Force rebuild sin caché
```

## 🛠️ Modes for Development

Use these prompts with Copilot:

1. **SCAFFOLD**: Create new features with types only
2. **REFACTOR**: Improve existing code (3 approaches)
3. **AUDIT**: Security & compatibility review
4. **SUPABASE**: Create Server Actions
5. **N8N**: Generate SQL triggers
6. **ACETERNITY**: Build visual components
7. **CONTEXT**: Get architecture guidance
8. **DEBT**: Document decisions (ADR)

See [.github/prompts/MODES.md](.github/prompts/MODES.md) for details.

## 📦 Dependencies

### Critical (DO NOT REMOVE)
- `framer-motion@12.0.0-alpha.1` - React 19 compatible
- `@supabase/ssr` - Server-side Supabase client
- Overrides in package.json - React 19 RC resolution

### Key Libraries
- `tailwindcss@4.0.0` + `@tailwindcss/postcss` - v4 with hybrid config
- `zod` - Input validation (Server Actions)
- `clsx` + `tailwind-merge` - Safe class merging

## 🚦 Status

**Phase 1: Core Infrastructure** ✅
- Project scaffolding
- Configuration setup
- Supabase integration
- Middleware authentication
- **Monorepo con Turborepo** ✅
- **PPR (Partial Prerendering)** ✅
- **LazyMotion (Framer Motion optimizado)** ✅
- **SEO Programático (rutas dinámicas)** ✅

**Phase 2: Authentication** (Current)
- Login page
- Register page
- Profile management

**Phase 3: Dashboard** (Upcoming)
- Lead management
- Project tracking
- Team collaboration

**Phase 4: Automation** (Future)
- n8n workflow integration
- CRM synchronization
- Notification system

## 📖 Cognitive Protocols

This project uses **Skeleton of Thought (SoT)** and **Chain of Verification (CoVe)**:

- **SoT**: Generate types/interfaces before implementation
- **CoVe**: Audit code for React 19, RLS, hydration, and type safety

See [copilot-instructions.md](.github/copilot-instructions.md) for full protocols.

## 🐛 Troubleshooting

### Cookies Error
```
Error: cookies is not a function
```
Add `await` before `cookies()` in Server Components.

### RLS Denials
Check that your user ID is passed correctly to Supabase queries.

### Hydration Mismatch
Use `dynamic(() => import(...), { ssr: false })` for components with random values.

See [docs/SETUP.md](docs/SETUP.md) for more.

## 📝 License

Private project.

## 👥 Contributing

Follow the rules in [copilot-instructions.md](.github/copilot-instructions.md):
- Axiomatic coding (every line performs work)
- React 19 compatibility
- RLS security
- Zod validation for inputs

# GUÍA DE VALIDACIÓN POST-IMPLEMENTACIÓN

## Setup Rápido (Primera vez)

### 1. Instalar Dependencias
```bash
npm install --legacy-peer-deps
```

### 2. Configurar Variables de Entorno

**apps/web/.env.local** (crear desde .env.example):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**apps/dashboard/.env.local** (copiar desde .env.local existente en raíz si existe):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
N8N_WEBHOOK_URL=your-n8n-webhook-url
```

### 3. Setup Base de Datos Supabase

Ir a SQL Editor en Supabase y ejecutar en orden:

1. `docs/database/schema.sql` (tablas principales: users, leads, projects, etc.)
2. `docs/database/seo_pages.sql` (tabla SEO + seed data con 3 comparativas)

### 4. Iniciar Desarrollo

```bash
# Opción 1: Ambas apps
npm run dev

# Opción 2: Apps por separado
npm run dev:web          # Terminal 1
npm run dev:dashboard    # Terminal 2
```

## Checklist de Validación

### ✅ Monorepo y Turborepo

- [ ] `npm run dev` inicia ambas apps sin errores
- [ ] Landing carga en http://localhost:3000
- [ ] Dashboard carga en http://localhost:3001
- [ ] `npm run build` compila ambas apps
- [ ] `turbo.json` existe y tiene pipeline configurado

### ✅ Landing (apps/web)

- [ ] Hero muestra BackgroundBeams animados
- [ ] BentoGrid muestra features correctamente
- [ ] Componentes usan `@portfolio2/ui` (verificar imports)
- [ ] Links a dashboard apuntan a puerto 3001
- [ ] No hay errores de hidration mismatch

### ✅ Dashboard (apps/dashboard)

- [ ] Layout incluye MotionProvider
- [ ] Dashboard page muestra skeletons antes de datos
- [ ] Suspense boundaries funcionan (ver Network tab con throttling)
- [ ] Componentes usan `@portfolio2/ui` para Skeleton
- [ ] PPR configurado en next.config.js

### ✅ SEO Programático

- [ ] Tabla `seo_pages` existe en Supabase
- [ ] 3 comparativas de seed están insertadas
- [ ] http://localhost:3000/comparar muestra lista de comparativas
- [ ] http://localhost:3000/comparar/n8n-vs-zapier carga página completa
- [ ] http://localhost:3000/comparar/supabase-vs-firebase carga correctamente
- [ ] http://localhost:3000/sitemap.xml genera XML válido con URLs
- [ ] View source muestra metadata dinámica (title, description)

### ✅ Optimizaciones

- [ ] Framer Motion usa `m` en lugar de `motion` en packages/ui
- [ ] MotionProvider usa LazyMotion
- [ ] TypeScript compila sin errores: `npm run type-check`
- [ ] ESLint pasa: `npm run lint`

## Tests Manuales

### Test 1: Navegación Landing → Dashboard
1. Ir a http://localhost:3000
2. Click en "Comenzar Gratis"
3. Debe redirigir a http://localhost:3001/register

### Test 2: SEO Page View Counter
1. Ir a http://localhost:3000/comparar/n8n-vs-zapier
2. Verificar que muestra "X vistas"
3. Recargar página
4. View count debe incrementar en 1

### Test 3: PPR Loading States
1. Abrir DevTools → Network tab
2. Throttling: Slow 3G
3. Ir a http://localhost:3001/dashboard (si está autenticado)
4. Debe mostrar skeletons antes de datos reales

### Test 4: Sitemap Validación
1. Ir a http://localhost:3000/sitemap.xml
2. Verificar que lista:
   - / (homepage)
   - /comparar
   - /comparar/n8n-vs-zapier
   - /comparar/supabase-vs-firebase
   - /comparar/nextjs-vs-remix

## Solución de Problemas Comunes

### Error: Cannot find module '@portfolio2/ui'
**Causa**: Workspaces no instalados
**Solución**:
```bash
npm install --legacy-peer-deps
```

### Error: NEXT_PUBLIC_SUPABASE_URL is undefined
**Causa**: Variables de entorno no configuradas
**Solución**: Crear .env.local en apps/web y apps/dashboard

### Warning: React 19 peer dependencies
**Causa**: Framer Motion + React 19 RC
**Solución**: Usar `--legacy-peer-deps` (ya está manejado en package.json overrides)

### Build falla: Type errors en packages/ui
**Causa**: TypeScript paths no resueltos
**Solución**:
```bash
cd packages/ui
npm run type-check
```

### Dashboard no muestra datos
**Causa**: No autenticado o RLS bloqueando
**Solución**: 
1. Login en /login
2. Verificar RLS policies en Supabase

### Comparativas muestran "No hay comparativas"
**Causa**: Tabla seo_pages vacía
**Solución**: Ejecutar `docs/database/seo_pages.sql` en Supabase

## Performance Checks

### Bundle Size (Después de build)
```bash
npm run build
```

Verificar en output:
- Framer Motion bundle debe ser < 10KB (vs ~25KB antes)
- Landing debe ser mayormente estático
- Dashboard puede tener chunks más grandes (es dinámico)

### Lighthouse (apps/web)
```bash
# Opción 1: DevTools Lighthouse
# Abrir localhost:3000 → DevTools → Lighthouse → Run

# Objetivo: Performance > 95
```

### Loading Time (apps/dashboard con PPR)
- Usar DevTools Performance tab
- Objetivo: FCP < 1.5s en cable rápido
- Skeletons deben aparecer antes de datos

## Despliegue (Próximos pasos)

### Vercel (Recomendado)
```bash
# En Vercel dashboard:
# 1. Import repo
# 2. Framework Preset: Next.js
# 3. Root Directory: apps/web (para landing)
# 4. Environment Variables: Copiar desde .env.local

# Repetir para apps/dashboard
```

### Variables de Producción
- NEXT_PUBLIC_SUPABASE_URL (mismo para ambas apps)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (mismo para ambas apps)
- SUPABASE_SERVICE_ROLE_KEY (solo dashboard)
- N8N_WEBHOOK_URL (solo dashboard)

## Comandos de Referencia

```bash
# Desarrollo
npm run dev                    # Todo
npm run dev:web               # Landing
npm run dev:dashboard         # Dashboard

# Build
npm run build                 # Todo
npm run build:web             # Landing
npm run build:dashboard       # Dashboard

# Quality
npm run lint                  # ESLint
npm run type-check            # TypeScript

# Turborepo
turbo run build --force       # Rebuild sin caché
turbo run dev --filter=@portfolio2/web  # Solo web
```

## Métricas de Éxito

| Métrica | Objetivo | Cómo validar |
|---------|----------|--------------|
| Landing Performance | > 95 | Lighthouse en localhost:3000 |
| Dashboard FCP | < 1.5s | DevTools Performance |
| Bundle Framer Motion | < 10KB | Build output |
| SEO Pages generadas | 3+ | http://localhost:3000/comparar |
| TypeScript errores | 0 | `npm run type-check` |
| ESLint warnings | 0 | `npm run lint` |

## Siguiente Fase

Una vez validado todo:
1. Deploy a producción (Vercel)
2. Configurar dominio (portfolio2.com)
3. Poblar más SEO pages (script de generación masiva)
4. Implementar analytics (Google Analytics en landing)
5. Edge Functions para n8n (si se necesitan respuestas síncronas)

---

**Última actualización**: 21 Enero 2026  
**Versión del plan**: v1.0 (Completado)

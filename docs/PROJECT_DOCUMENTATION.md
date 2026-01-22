**BLUF**: Documento central que resume lo más relevante del proyecto —stack, reglas críticas, estructura, flujo de datos, setup rápido y buenas prácticas para desarrolladores.

## ⚡ ESTADO ACTUAL (21 Enero 2026)

**El proyecto está en fase de desarrollo avanzado con arquitectura monorepo y funcionalidades core completadas**.

### 🎯 Funcionalidades Implementadas
- ✅ **Autenticación completa**: Login, Register, Logout, JWT refresh, RLS
- ✅ **Gestión de Leads**: CRUD completo con validación y estados
- ✅ **Gestión de Proyectos**: CRUD completo con presupuestos y fechas
- ✅ **Sistema de Comentarios**: Para leads y projects con RLS
- ✅ **Attachments**: Upload/download de archivos con Supabase Storage
- ✅ **Activity Logs**: Auditoría completa de acciones del sistema
- ✅ **Team Management**: Invitaciones, roles (admin/agent/client)
- ✅ **Dashboard**: Métricas, gráficos, actividad reciente
- ✅ **Monorepo**: Separación web (landing) y dashboard (app)
- ✅ **SEO Programático**: Landing pages dinámicas desde DB

## ⚡ ARQUITECTURA MONOREPO

**El proyecto ha sido refactorizado a monorepo con Turborepo**. Ver [IMPLEMENTATION_PLAN_COMPLETED.md](IMPLEMENTATION_PLAN_COMPLETED.md) para detalles completos.

### Estructura Actual:
```
Portfolio2/ (Monorepo)
├── apps/
│   ├── web/              # Landing público (SSG) - Puerto 3000
│   │   ├── src/app/
│   │   │   ├── page.tsx                    # Hero con Aceternity UI
│   │   │   ├── comparar/[slug]/page.tsx    # SEO landing pages
│   │   │   └── sitemap.ts                  # Sitemap dinámico
│   │   └── src/actions/submit-lead.ts      # Formulario de contacto
│   │
│   └── dashboard/        # App SaaS (SSR/PPR) - Puerto 3001
│       ├── src/
│       │   ├── app/                        # Rutas con PPR + Suspense
│       │   ├── actions/                    # 7 Server Actions modules
│       │   ├── components/                 # UI components (8 modules)
│       │   ├── lib/supabase/              # DB clients (server/admin/middleware)
│       │   └── types/                      # TypeScript strict types
│       └── middleware.ts                   # JWT refresh + auth validation
│
├── packages/
│   └── ui/              # Componentes compartidos (Aceternity + LazyMotion)
│       ├── components/  # background-beams, bento-grid, skeleton
│       └── lib/         # utils (cn), framer (LazyMotion provider)
│
└── turbo.json           # Build pipeline con caché
```

### Comandos Disponibles:
```bash
npm run dev              # Todas las apps (puertos 3000 + 3001)
npm run dev:web          # Solo landing (puerto 3000)
npm run dev:dashboard    # Solo dashboard (puerto 3001)
npm run build            # Build completo con Turbo
npm run type-check       # TypeScript en todas las apps
npm run lint             # ESLint en todas las apps
```

**Resumen Rápido**
- **Propósito**: Plataforma SaaS de gestión de proyectos, leads y automatizaciones + Landing público con SEO programático.
- **Stack**: Next.js 15 + React 19 RC, Tailwind v4, Aceternity UI, Framer Motion v12-alpha, Supabase (Postgres + RLS), n8n.
- **Estado**: ✅ Core features completadas. En progreso: Advanced features (charts, notifications). Ver [PROGRESS.md](../PROGRESS.md) para roadmap.

**Tecnologías Clave**
- **Frontend**: Next.js 15 (App Router) + React 19 RC — Server Components por defecto.
- **Estilos**: Tailwind CSS v4 en modo híbrido (configuración primaria en CSS `@theme`).
- **Animaciones**: framer-motion v12-alpha (con LazyMotion para optimización de bundle).
- **Backend/DB**: Supabase (Postgres) con RLS completo y triggers `pg_net` para webhooks a n8n.
- **Automatización**: n8n (workflow orchestration, no llamado desde cliente).
- **Monorepo**: Turborepo con caché de builds y workspaces.
- **Optimizaciones**: PPR (Partial Prerendering) en dashboard, SSG en landing.

---

## 📦 MÓDULOS Y FUNCIONALIDADES

### 🔐 Autenticación (auth.ts)
**Server Actions implementadas:**
- `login()` - Autenticación con email/password + redirección
- `register()` - Registro con auto-creación de profile
- `logout()` - Cierre de sesión y limpieza de cookies
- `getCurrentUser()` - Obtener usuario actual con profile

**Features:**
- ✅ JWT refresh automático en middleware
- ✅ Cookies httpOnly para seguridad
- ✅ Validación con Zod schemas
- ✅ Auto-confirm email en desarrollo
- ✅ RLS aplicado en todas las consultas
- ✅ useUser hook + UserProvider context

**Rutas protegidas:**
- `/dashboard/*` - Requiere autenticación
- Middleware valida token en cada request

### 📊 Leads Management (leads.ts)
**Server Actions implementadas:**
- `getLeads()` - Listar leads con RLS
- `createLead()` - Crear nuevo lead con validación
- `updateLead()` - Actualizar lead existente
- `deleteLead()` - Eliminar lead (soft delete disponible)
- `convertLeadToClient()` - Convertir lead a cliente

**Features:**
- ✅ Estados: new, contacted, qualified, converted, rejected
- ✅ Fuentes: contact_form, email, referral, other
- ✅ Validación Zod completa
- ✅ Trigger pg_net a n8n en INSERT
- ✅ Activity logs automáticos
- ✅ RLS por client_id

**Componentes UI:**
- `LeadsTable.tsx` - Server Component con datos en tiempo real
- `LeadsTableClient.tsx` - Client Component con interactividad
- `CreateLeadForm.tsx` - Formulario con useActionState (React 19)

### 🚀 Projects Management (projects.ts)
**Server Actions implementadas:**
- `getProjects()` - Listar proyectos con RLS
- `createProject()` - Crear proyecto con validación
- `updateProject()` - Actualizar proyecto
- `deleteProject()` - Eliminar proyecto
- `updateProjectStatus()` - Cambiar estado del proyecto

**Features:**
- ✅ Estados: planning, in_progress, completed, on_hold
- ✅ Presupuesto (numeric) con formateo
- ✅ Fechas: start_date, end_date
- ✅ Validación Zod completa
- ✅ Trigger pg_net a n8n en INSERT
- ✅ Activity logs automáticos
- ✅ RLS por client_id

**Componentes UI:**
- `ProjectsTable.tsx` - Server Component
- `ProjectsTableClient.tsx` - Client Component
- `CreateProjectForm.tsx` - Formulario con validación

### 💬 Comments System (comments.ts)
**Server Actions implementadas:**
- `getComments(entityType, entityId)` - Obtener comentarios de lead/project
- `createComment()` - Crear comentario con validación
- `updateComment()` - Editar comentario propio
- `deleteComment()` - Eliminar comentario propio

**Features:**
- ✅ Comentarios en leads y projects
- ✅ RLS: Solo ver/editar comentarios de entidades propias
- ✅ Join con profiles para avatar/nombre
- ✅ Timestamps automáticos
- ✅ Validación de contenido

**Componentes UI:**
- `CommentsList.tsx` - Lista con avatares y timestamps
- `AddCommentForm.tsx` - Formulario inline
- `DeleteCommentButton.tsx` - Client Component con confirmación

### 📎 Attachments (attachments.ts)
**Server Actions implementadas:**
- `uploadAttachment()` - Subir archivo a Supabase Storage
- `getAttachments(entityType, entityId)` - Listar attachments
- `getAttachmentUrl(attachmentId)` - Obtener URL firmada (60min)
- `deleteAttachment()` - Eliminar archivo y registro

**Features:**
- ✅ Upload a bucket 'attachments' con RLS
- ✅ Validación: max 10MB, tipos permitidos
- ✅ Storage path: `{user_id}/{entity_type}/{entity_id}/filename`
- ✅ Signed URLs con expiración
- ✅ Metadata en tabla attachments

**Componentes UI:**
- `FileUpload.tsx` - Drag & drop con validación
- `AttachmentsList.tsx` - Lista con iconos por tipo
- `AttachmentItem.tsx` - Card individual con download

### 📝 Activity Logs (activity.ts)
**Server Actions implementadas:**
- `logActivity()` - Registrar actividad del sistema
- `getActivityLogs()` - Obtener logs paginados
- `getActivityLogsByEntity()` - Logs de lead/project específico
- `getActivityStats()` - Estadísticas de actividad

**Features:**
- ✅ Audit trail completo
- ✅ Acciones: create, update, delete, login, logout
- ✅ Entidades: lead, project, profile, auth
- ✅ IP address + User Agent tracking
- ✅ JSONB details para contexto adicional
- ✅ RLS: Ver solo logs propios (o todos si admin)

**Componentes UI:**
- `ActivityLogsList.tsx` - Lista paginada con filtros
- `RecentActivity.tsx` - Widget para dashboard

### 👥 Team Management (team.ts)
**Server Actions implementadas:**
- `getTeamMembers()` - Listar todos los miembros (admin only)
- `inviteUser()` - Enviar invitación por email (admin only)
- `getPendingInvitations()` - Listar invitaciones pendientes
- `acceptInvitation(token)` - Aceptar invitación
- `revokeInvitation(id)` - Cancelar invitación (admin only)
- `updateUserRole()` - Cambiar rol de usuario (admin only)

**Features:**
- ✅ Roles: admin, agent, client
- ✅ Invitaciones con token único y expiración
- ✅ Estados: pending, accepted, rejected, expired
- ✅ RLS: Solo admins pueden invitar/modificar
- ✅ Email de invitación (placeholder para n8n)

**Componentes UI:**
- `TeamMembersList.tsx` - Tabla con roles y acciones
- `PendingInvitations.tsx` - Lista de invitaciones
- `InviteUserForm.tsx` - Formulario admin

### 📊 Dashboard Components
**Implementados:**
- `DashboardLayout.tsx` - Wrapper con navegación
- `DashboardNav.tsx` - Navbar con user menu + logout
- `ProfileCard.tsx` - Server Component con user info
- `StatsCards.tsx` - Métricas con Suspense (PPR)
- `ChartsContainer.tsx` - Gráficos con Suspense (PPR)
- `RecentActivity.tsx` - Últimas actividades con Suspense (PPR)

**Features Dashboard:**
- ✅ PPR habilitado (partial prerendering)
- ✅ Suspense boundaries con skeletons
- ✅ Server Components para datos
- ✅ Client Components para interactividad

---

## 🗂️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales:
```sql
profiles            # Extends auth.users (id, email, name, role, avatar_url)
leads               # Gestión de leads (name, email, phone, status, source)
projects            # Gestión de proyectos (name, description, status, budget, dates)
comments            # Comentarios en leads/projects (content, entity_type, entity_id)
attachments         # Archivos adjuntos (file_name, storage_path, mime_type)
activity_logs       # Audit trail (action, entity_type, entity_id, details)
team_invitations    # Invitaciones de equipo (email, role, token, status)
seo_pages           # Landing pages SEO (slug, title, content, metadata)
```

### Storage Buckets:
```
avatars             # Público - Fotos de perfil
attachments         # Privado - Archivos de leads/projects (RLS)
```

### RLS Políticas:
- ✅ Todas las tablas tienen RLS habilitado
- ✅ Usuarios solo ven sus propios datos (client_id)
- ✅ Admins tienen acceso completo
- ✅ Policies específicas para comments, attachments, activity_logs
- ✅ Storage con policies para upload/download

### Triggers Implementados:
```sql
trigger_create_profile()   # Auto-crear profile en signup
trigger_n8n_lead()          # Webhook a n8n cuando se crea lead
trigger_n8n_project()       # Webhook a n8n cuando se crea project
```

---

**Reglas críticas (resumen accionable)**
- **Next.js 15**: `cookies()` es asíncrono — usar `await cookies()`; `params` y `searchParams` en `page.tsx` pueden ser promesas.
- **Supabase**: Usar únicamente `@supabase/ssr` en Server Components/Actions. En Middleware usar `createServerClient` y `getUser()` (no `getSession()`).
- **Middleware**: Implementar refresco de JWT antes de llegar a RSCs para evitar redirecciones infinitas.
- **Tailwind v4**: Preferir utilidades en JSX; la configuración principal vive en `src/app/globals.css`.
- **Framer Motion**: Debe estar en `12.0.0-alpha.1`; hay overrides en `package.json`.
- **n8n**: Nunca llamar webhooks desde el cliente. Flujo: Cliente → Server Action → INSERT → pg_net → n8n → SERVICE_ROLE updates.

---

## 📁 ESTRUCTURA DE ARCHIVOS DETALLADA

### Dashboard App (apps/dashboard/src/):
```
├── app/
│   ├── layout.tsx                          # Root layout con providers
│   ├── page.tsx                            # Home redirect
│   ├── providers.tsx                       # Client providers wrapper
│   ├── (auth)/                             # Auth routes group
│   │   ├── login/page.tsx                  # Login page
│   │   └── register/page.tsx               # Register page
│   └── (dashboard)/                        # Protected routes group
│       └── dashboard/
│           ├── page.tsx                    # Dashboard con PPR + Suspense
│           ├── leads/
│           │   ├── page.tsx                # Leads management
│           │   └── [id]/page.tsx           # Lead detail (TODO)
│           ├── projects/
│           │   ├── page.tsx                # Projects management
│           │   └── [id]/page.tsx           # Project detail (TODO)
│           ├── team/
│           │   └── page.tsx                # Team management (admin)
│           └── activity/
│               └── page.tsx                # Activity logs
│
├── actions/                                # 7 Server Actions modules
│   ├── auth.ts                             # 4 functions (login, register, logout, getCurrentUser)
│   ├── leads.ts                            # 5 functions (CRUD + convert)
│   ├── projects.ts                         # 5 functions (CRUD + updateStatus)
│   ├── comments.ts                         # 4 functions (CRUD)
│   ├── attachments.ts                      # 4 functions (upload, get, getUrl, delete)
│   ├── activity.ts                         # 4 functions (log, get, getByEntity, getStats)
│   └── team.ts                             # 6 functions (invite, manage, roles)
│
├── components/                             # 8 modules organizados
│   ├── auth/
│   │   └── AuthForm.tsx                    # Formulario reutilizable
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ChartsContainer.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── LeadsTable.tsx                  # Server Component
│   │   ├── LeadsTableClient.tsx            # Client Component
│   │   ├── ProjectsTable.tsx
│   │   ├── ProjectsTableClient.tsx
│   │   ├── TeamMembersList.tsx
│   │   ├── PendingInvitations.tsx
│   │   ├── ActivityLogsList.tsx
│   │   └── StatusCharts.tsx
│   ├── leads/
│   │   ├── CreateLeadForm.tsx
│   │   ├── EditLeadForm.tsx
│   │   └── LeadDetailView.tsx
│   ├── projects/
│   │   ├── CreateProjectForm.tsx
│   │   ├── EditProjectForm.tsx
│   │   └── ProjectDetailView.tsx
│   ├── comments/
│   │   ├── CommentsList.tsx
│   │   ├── AddCommentForm.tsx
│   │   └── DeleteCommentButton.tsx
│   ├── attachments/
│   │   ├── FileUpload.tsx
│   │   ├── AttachmentsList.tsx
│   │   └── AttachmentItem.tsx
│   ├── team/
│   │   ├── InviteUserForm.tsx
│   │   └── TeamMemberCard.tsx
│   └── ui/                                 # Primitivos reutilizables
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                       # createClient para RSC/Actions
│   │   ├── middleware.ts                   # createClient para middleware
│   │   └── admin.ts                        # SERVICE_ROLE helpers
│   ├── utils.ts                            # cn() helper
│   └── constants.ts                        # App constants
│
├── types/
│   ├── database.ts                         # Zod schemas + types
│   ├── auth.ts                             # Auth types
│   └── api.ts                              # ActionResponse types
│
└── middleware.ts                           # JWT refresh + route protection
```

### Landing App (apps/web/src/):
```
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Hero con Aceternity UI
│   ├── globals.css                         # Tailwind v4 config
│   ├── sitemap.ts                          # Sitemap dinámico
│   └── comparar/
│       ├── page.tsx                        # Índice de comparativas
│       └── [slug]/page.tsx                 # Landing page dinámica (SSG)
│
└── actions/
    └── submit-lead.ts                      # Formulario de contacto
```

### Shared Package (packages/ui/):
```
├── components/
│   ├── background-beams.tsx                # Aceternity
│   ├── bento-grid.tsx                      # Aceternity
│   └── skeleton.tsx                        # Skeleton loader
│
└── lib/
    ├── utils.ts                            # cn() helper
    └── framer.tsx                          # MotionProvider con LazyMotion
```

---

**Estructura y archivos importantes**
- **Raíz docs**: [docs/architecture/SYSTEM_CONTEXT.md](docs/architecture/SYSTEM_CONTEXT.md) — contexto detallado.
- **Guías**: [docs/SETUP.md](docs/SETUP.md) — setup y base de datos.
- **Schema**: [docs/database/schema.sql](docs/database/schema.sql) — estructura DB completa.
- **SEO**: [docs/database/seo_pages.sql](docs/database/seo_pages.sql) — landing pages dinámicas.
- **Progress**: [PROGRESS.md](../PROGRESS.md) — roadmap y estado de features.
- **Resumen**: [RESUMEN_FINAL.md](../RESUMEN_FINAL.md) — implementación completa.

**Setup rápido (desarrollo)**
- **Instalar deps**:

```bash
npm install
```

- **Variables de entorno** (mínimas)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo en servidor/CI)
  - `N8N_WEBHOOK_URL` (solo servidor)

- **Inicializar DB**: Ejecutar `docs/database/schema.sql` en la consola de Supabase.

- **Correr local**:

```bash
npm run dev
```

- **Typecheck/Lint**:

```bash
npm run type-check
npm run lint
```

**Patrones y ejemplos rápidos**
- **Server Component (lectura)**: Hacer `await createServerClient()` desde `src/lib/supabase/server.ts` y consultar tablas.
- **Server Action (mutación)**: Validar con `zod`, luego insertar en Supabase. No llamar n8n directamente desde el cliente.
- **Client Component**: Lleva `"use client"` arriba; usa hooks y envía formularios a Server Actions.

**Flujo de automatización (resumen técnico)**
- Cliente → Server Action → Insert en tabla (RLS aplicado).
- Postgres `pg_net` trigger dispara webhook a n8n.
- n8n procesa y actualiza Supabase mediante `SERVICE_ROLE` (server-only).

**Seguridad y RLS**
- **RLS** debe cubrir todas las tablas sensibles. Las comprobaciones de acceso van en la BD.
- **Keys**: `SUPABASE_SERVICE_ROLE_KEY` NUNCA en cliente ni en repo.
- **Middleware**: Lógica de refresco de JWT en `src/lib/supabase/middleware.ts` y `src/middleware.ts`.

---

## 🎯 PATRONES Y EJEMPLOS DE USO

### Crear un nuevo Server Action:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { ActionResponse } from '@/types/api';

const mySchema = z.object({
  field: z.string().min(1)
});

export async function myAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validar con Zod
    const parsed = mySchema.safeParse({
      field: formData.get('field')
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    // Insertar en DB (RLS aplicado)
    const { data, error } = await supabase
      .from('my_table')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('[myAction]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed' 
    };
  }
}
```

### Crear un Client Component con useActionState:
```tsx
'use client';

import { useActionState } from 'react';
import { myAction } from '@/actions/my-action';

export default function MyForm() {
  const [state, formAction, isPending] = useActionState(myAction, null);

  return (
    <form action={formAction}>
      <input name="field" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
```

### Server Component con Suspense (PPR):
```tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Skeleton } from '@/components/ui/skeleton';

async function MyData() {
  const supabase = await createClient();
  const { data } = await supabase.from('my_table').select();
  
  return <div>{/* render data */}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>Static Content</h1>
      <Suspense fallback={<Skeleton />}>
        <MyData />
      </Suspense>
    </div>
  );
}
```

### Agregar nueva tabla con RLS:
```sql
-- 1. Crear tabla
create table public.my_table (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- 2. Habilitar RLS
alter table public.my_table enable row level security;

-- 3. Policies
create policy "Users can view their own records"
  on public.my_table for select
  using (user_id = auth.uid());

create policy "Users can insert their own records"
  on public.my_table for insert
  with check (user_id = auth.uid());

-- 4. Índices
create index my_table_user_id_idx on public.my_table(user_id);
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### "cookies is not a function"
**Causa**: Llamar `cookies()` sin `await` en Next.js 15.  
**Solución**: Usar `await cookies()` en todas las Server Actions y RSCs.

```typescript
// ❌ Incorrecto
const cookieStore = cookies();

// ✅ Correcto
const cookieStore = await cookies();
```

### "Hydration mismatch"
**Causa**: Componente con valores aleatorios (stars, beams) que cambian entre server y client.  
**Solución**: Usar `dynamic` con `ssr: false` o `suppressHydrationWarning`.

```tsx
// Opción 1: Dynamic import
import dynamic from 'next/dynamic';
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams'),
  { ssr: false }
);

// Opción 2: suppressHydrationWarning
<div suppressHydrationWarning>
  {Math.random()}
</div>
```

### "Redirect loop en middleware"
**Causa**: Middleware redirige a login en rutas estáticas.  
**Solución**: Excluir rutas públicas y estáticas en matcher.

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### "RLS policy violation"
**Causa**: `auth.uid()` retorna NULL en algunas consultas.  
**Solución**: Verificar que middleware refresca JWT antes de RSCs.

```typescript
// middleware.ts
const { data: { user } } = await supabase.auth.getUser();
if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

### "Module not found: @portfolio2/ui"
**Causa**: Workspaces no configurados correctamente o deps no instaladas.  
**Solución**: Reinstalar con `npm install` en raíz.

```bash
# Limpiar y reinstalar
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install --legacy-peer-deps
```

### "Framer Motion ref error"
**Causa**: React 19 RC cambió handling de refs.  
**Solución**: Asegurar que `framer-motion` está en `12.0.0-alpha.1` con overrides.

```json
// package.json
"overrides": {
  "framer-motion": {
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106"
  }
}
```

---

## ✅ CHECKLIST DE DESARROLLO

### Antes de commitear:
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run lint` pasa sin warnings
- [ ] Código sigue patrones de Server/Client Components
- [ ] RLS policies actualizadas si se agregó tabla
- [ ] Variables de entorno documentadas en .env.example
- [ ] Server Actions retornan `ActionResponse` tipado
- [ ] Validación Zod en todos los inputs de usuario

### Antes de PR:
- [ ] Tests manuales en ambas apps (web + dashboard)
- [ ] Verificar que middleware no causa loops
- [ ] Comprobar que PPR funciona (Suspense boundaries)
- [ ] Verificar que LazyMotion carga correctamente
- [ ] Documentar cambios en PROGRESS.md si aplica

### Antes de deploy:
- [ ] Ejecutar `docs/database/schema.sql` en Supabase producción
- [ ] Variables de entorno configuradas en Vercel/Railway
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en servidor
- [ ] n8n webhook URL configurada y autenticada
- [ ] Build local exitoso: `npm run build`
- [ ] Verificar que triggers `pg_net` están activos
- [ ] Configurar dominio personalizado si aplica
- [ ] Habilitar email verification en producción (Supabase Auth)

---

## 📚 GUÍAS Y RECURSOS

### Documentación del Proyecto:
- **[README.md](../README.md)** - Overview y quick start
- **[PROGRESS.md](../PROGRESS.md)** - Roadmap y features completadas
- **[RESUMEN_FINAL.md](../RESUMEN_FINAL.md)** - Implementación detallada
- **[IMPLEMENTATION_PLAN_COMPLETED.md](IMPLEMENTATION_PLAN_COMPLETED.md)** - Plan de refactorización
- **[VALIDATION_GUIDE.md](VALIDATION_GUIDE.md)** - Guía de validación y testing

### Arquitectura y Setup:
- **[architecture/SYSTEM_CONTEXT.md](architecture/SYSTEM_CONTEXT.md)** - Contexto del sistema
- **[SETUP.md](SETUP.md)** - Setup inicial y configuración
- **[STRUCTURE.md](STRUCTURE.md)** - Estructura del proyecto
- **[SECURITY.md](SECURITY.md)** - Guía de seguridad
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Guía para desarrolladores

### Database:
- **[database/schema.sql](database/schema.sql)** - Schema completo con RLS
- **[database/seo_pages.sql](database/seo_pages.sql)** - Landing pages SEO

### Stack Tecnológico:
- **Next.js 15**: https://nextjs.org/docs
- **React 19 RC**: https://react.dev/blog/2024/04/25/react-19
- **Supabase**: https://supabase.com/docs
- **Tailwind v4**: https://tailwindcss.com/docs/v4-beta
- **Turborepo**: https://turbo.build/repo/docs
- **Aceternity UI**: https://ui.aceternity.com

### Copilot Guidelines:
- **[.github/copilot-instructions.md](../.github/copilot-instructions.md)** - Reglas para AI coding

---

## 🎓 PRÓXIMOS PASOS RECOMENDADOS

### Para Desarrolladores Nuevos:
1. Leer [SETUP.md](SETUP.md) para configurar entorno local
2. Revisar [STRUCTURE.md](STRUCTURE.md) para entender arquitectura
3. Ejecutar `npm run dev` y explorar dashboard en localhost:3001
4. Leer Server Actions en `apps/dashboard/src/actions/` para ver patrones
5. Crear un componente simple siguiendo ejemplos en este doc

### Features Pendientes (Roadmap):
- [ ] Charts avanzados (Recharts o similar)
- [ ] Email notifications (n8n + Resend/SendGrid)
- [ ] Webhooks management UI
- [ ] Advanced filters en tablas
- [ ] Export data (CSV, PDF)
- [ ] Two-factor authentication
- [ ] API REST endpoints (App Router API routes)
- [ ] Mobile responsive optimizations
- [ ] Dark mode toggle
- [ ] Multi-language (i18n)

### Optimizaciones Técnicas:
- [ ] Agregar tests unitarios (Vitest)
- [ ] Agregar tests E2E (Playwright)
- [ ] Implementar caché de API con Redis
- [ ] Optimizar imágenes con next/image
- [ ] Agregar rate limiting
- [ ] Implementar real-time subscriptions (Supabase Realtime)
- [ ] Monitoring y logging (Sentry)

---

**Actualizado**: 21 Enero 2026  
**Versión**: 2.0 (Monorepo con Turborepo)  
**Mantenedores**: Ver [README.md](../README.md) para contacto
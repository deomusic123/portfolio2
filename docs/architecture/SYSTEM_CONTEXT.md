# SYSTEM ARCHITECTURE & BOUNDARIES
## Portfolio2 - Agencia Digital Moderna (Next.js 15 + Supabase + n8n)

---

## 1. CORE PRINCIPLES (The "Vibe")

### Modularity
* Functions must be atomic. Violating DRY (Don't Repeat Yourself) is a CRITICAL FAILURE.
* Each component = single responsibility.
* Server Components ≠ Client Components (never mix responsibilities).

### Tech Stack (Locked)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 (App Router) + React 19 RC | Rendering, RSC, Server Actions |
| **Styling** | Tailwind CSS v4 + CSS Native Variables | Design tokens, performance |
| **Components** | Aceternity UI (copy-paste patterns) | Micro-interactions, identity |
| **Animation** | Framer Motion v12-alpha | React 19 compatible animations |
| **Database** | Supabase (PostgreSQL + RLS) | Data + Auth + Webhooks (pg_net) |
| **Automation** | n8n (Self-hosted Docker) | Lead enrichment, CRM sync, Slack notifications |

### State Management
* **Client State**: React Hooks + Context API (no Redux needed for Phase 1)
* **Server State**: Supabase direct queries via Server Components
* **Async State**: Server Actions handle mutations + optimistic updates
* **Real-time**: Supabase RealtimeClient for live dashboard updates

---

## 2. DIRECTORY MAP (Needle Finding)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes (/login, /register)
│   ├── (dashboard)/              # Protected routes (requires auth)
│   ├── api/                      # Route Handlers (for webhooks)
│   ├── layout.tsx                # Root layout + RLS middleware
│   └── page.tsx                  # Homepage
│
├── components/
│   ├── ui/                       # Aceternity UI components (BentoGrid, BackgroundBeams, etc)
│   ├── auth/                     # Auth-specific (LoginForm, SignupForm)
│   ├── dashboard/                # Dashboard sections (LeadTable, etc)
│   └── shared/                   # Reusable (Header, Footer)
│
├── hooks/
│   ├── useAuth.ts                # Auth context hook
│   ├── useLeads.ts               # Leads business logic
│   └── useFormState.ts           # Form optimistic updates
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server client (RSC/Actions)
│   │   ├── middleware.ts         # Middleware for JWT refresh (CRITICAL)
│   │   ├── client.ts             # Browser client
│   │   └── database.ts           # Direct SQL queries
│   ├── utils.ts                  # cn() classname utility (clsx + tailwind-merge)
│   └── constants.ts              # Global constants (no hardcodes!)
│
├── actions/                      # Server Actions (mutations)
│   ├── auth.ts                   # Login, logout, register
│   ├── leads.ts                  # Create/update leads → triggers n8n
│   └── dashboard.ts              # Dashboard mutations
│
├── types/
│   ├── database.ts               # Supabase table types
│   ├── api.ts                    # API response schemas
│   └── auth.ts                   # User/session types
│
├── middleware.ts                 # Middleware entry (session refresh)
├── globals.css                   # Tailwind v4 config + @theme
└── env.local                     # .env.local (DO NOT COMMIT)
```

### Key Locations
* `src/components/ui`: Aceternity & Shadcn primitives (Button, BentoGrid, BackgroundBeams).
* `src/lib/supabase`:
    * `server.ts`: Server Component client (Cookie Store).
    * `client.ts`: Browser client.
    * `middleware.ts`: Auth token refresher (CRITICAL - prevents infinite redirect loops).
* `src/lib/utils.ts`: Contains the `cn` helper (clsx + tailwind-merge).
* `src/app/(auth)`: Route group for Login/Register.

---

## 3. GLOBAL STYLES (Tailwind v4)
* Configuration is in `src/app/globals.css` using the `@theme` directive.
* Color variables (`--color-primary`, etc.) are injected into `:root` via `tailwind.config.ts` (Legacy Bridge) for Aceternity compatibility.

---

## 4. DATA FLOW & AUTOMATION

* **Frontend**: Client Component triggers form → Server Action (Zod validated).
* **Database**: Supabase (Postgres) with RLS policies.
* **Triggers**: We use `pg_net` extension to fire webhooks to n8n on `INSERT` events in specific tables (e.g., `leads`).
* **RLS**: Security is enforced at Row Level Security, not just in the API.

### Atomicity Guarantee
```
Client → Server Action → INSERT to Supabase
    ↓ (success)
PostgreSQL Trigger (pg_net) → Webhook to n8n (async)
    ↓
n8n processes → Updates Supabase via SERVICE_ROLE
    ↓
Dashboard polls RealtimeClient or revalidates tags
```

---

## 5. COMMON PITFALLS (Needle in a Haystack)

* **Framer Motion v12**: If you see peer dependency warnings, ignore them; we have overrides in `package.json` for React 19 RC.
* **Middleware Loop**: Ensure `middleware.ts` excludes `_next/static` to avoid infinite auth redirect loops.
* **Cookies Async**: In Next.js 15, `cookies()` returns a Promise. Always `await cookies()`.
* **Hydration Mismatch**: BackgroundBeams and similar components with random values MUST use `ssr: false` or `suppressHydrationWarning`.

---

## 6. LAYER RESPONSIBILITIES

### Strict Rules by Layer

#### Server Components (`src/app`, `src/components/*.tsx` without 'use client')
* ✅ Fetch data directly from Supabase
* ✅ Access secrets (SUPABASE_SERVICE_ROLE_KEY)
* ✅ Run database queries with RLS enforcement
* ❌ Cannot use hooks (useState, useEffect)
* ❌ Cannot use browser APIs (localStorage, window)

#### Client Components (`'use client'` at top)
* ✅ Use React hooks
* ✅ Use browser APIs (localStorage, fetch)
* ✅ Attach event listeners
* ❌ Cannot fetch secrets
* ❌ Cannot access Supabase SERVICE_ROLE (only ANON_KEY)

#### Server Actions (`src/actions/*.ts`)
* ✅ Validate input with Zod
* ✅ Perform mutations (insert/update/delete)
* ✅ Trigger n8n webhooks or database inserts
* ✅ Return optimistic data immediately
* ❌ No loops; use async/await

---

## 7. CRITICAL AXIOMS

### Authentication & Security
* ✅ Use `@supabase/ssr` (NOT deprecated `@supabase/auth-helpers-nextjs`)
* ✅ Middleware MUST call `getUser()` (not `getSession()`) for server-side validation
* ✅ All Supabase queries respect RLS policies
* ✅ Never expose SUPABASE_SERVICE_ROLE_KEY to client
* ✅ JWT refresh in middleware before RSC execution

### React 19 Compatibility (MANDATORY)
* ✅ framer-motion MUST be v12-alpha: `"framer-motion": "12.0.0-alpha.1"`
* ✅ Add package.json overrides for React versions if installing dependencies
* ✅ Use Server Components as default; only 'use client' when needed
* ✅ No inline ref forwarding errors (v19 is stricter)

### Tailwind CSS v4 Hybrid Config
* ✅ `globals.css` has `@import "tailwindcss"` + `@theme {...}`
* ✅ `tailwind.config.ts` exports legacy plugin for Aceternity compatibility
* ✅ `postcss.config.mjs` uses `@tailwindcss/postcss`
* ✅ NO @tailwind directives (v4 only uses @import)

### Data Mutation & Automation
* ✅ No direct HTTP calls from Client Components to n8n (security risk)
* ✅ Server Actions insert to Supabase → pg_net trigger → n8n webhook
* ✅ pg_net ensures atomicity: automation only runs if data saves
* ✅ n8n writes updates back using SERVICE_ROLE key

### Code Quality
* ✅ No hardcoded values (use `src/lib/constants.ts`)
* ✅ All async calls have try/catch/finally
* ✅ TypeScript strict mode enabled
* ✅ Zod schemas for API inputs
* ✅ Components use `cn()` for classname merging (avoid Tailwind conflicts)

---

## 4. DATA FLOW DIAGRAM

```
User Browser
    ↓ (Click "Create Lead")
    ↓
Client Component (FormField 'use client')
    ↓ (calls Server Action)
    ↓
Server Action: createLead()
    ├─ Validate input (Zod)
    ├─ Insert into Supabase (RLS applied)
    └─ Return optimistic state
    ↓ (database INSERT succeeds)
    ↓
PostgreSQL Trigger (pg_net)
    └─ Webhook → n8n (async)
    ↓
n8n Workflow
    ├─ Enrich lead data
    ├─ Send to CRM
    ├─ Post to Slack
    └─ Update Supabase via SERVICE_ROLE
    ↓
Dashboard (Server Component)
    └─ Revalidate tags → fresh data
```

---

## 5. COMMON PATTERNS

### Pattern A: Fetching Data (Server Component)
```typescript
// app/dashboard/page.tsx (Server Component - no 'use client')
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from('leads').select();
  
  return <LeadsTable leads={leads} />;
}
```

### Pattern B: Mutations (Server Action)
```typescript
// actions/leads.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { leadSchema } from '@/types/database';

export async function createLead(formData: FormData) {
  const parsed = leadSchema.parse(Object.fromEntries(formData));
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([parsed])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Pattern C: Client Form with Server Action
```typescript
// components/auth/LoginForm.tsx
'use client';
import { loginAction } from '@/actions/auth';
import { useFormState } from 'react-dom';

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);
  
  return (
    <form action={formAction}>
      {/* form fields */}
      {state?.error && <div>{state.error}</div>}
    </form>
  );
}
```

---

## 6. ENVIRONMENT VARIABLES (src/lib/constants.ts)
```typescript
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
export const API_RATE_LIMIT = 100; // requests/min
```

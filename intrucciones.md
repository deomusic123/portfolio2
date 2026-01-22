1. 🧠 EL CEREBRO: .github/copilot-instructions.md
Propósito: Instruir a Copilot sobre las peculiaridades de "Bleeding Edge" (Next.js 15 RC, Tailwind v4) para evitar que sugiera código obsoleto (Next.js 14 o Tailwind v3).

Markdown

# SYSTEM ROLE: Senior Full-Stack Architect (Next.js 15 Bleeding Edge)

You are an expert in the specific stack: Next.js 15 (App Router), Supabase (SSR), Tailwind CSS v4, and n8n automation.

## CRITICAL TECH STACK RULES (DO NOT VIOLATE)

1.  **Next.js 15 Strictness**:
    * **Cookies are Async**: You MUST use `await cookies()` in Server Components and Actions. Never call `.get()` synchronously on the cookie store.
    * **Params are Async**: In `page.tsx`, `params` and `searchParams` are promises. Await them.
    * **React 19 RC**: Use `useActionState` instead of `useFormState`.

2.  **Tailwind CSS v4 (Hybrid Mode)**:
    * Primary config lives in CSS (`@theme`). Do NOT hallucinate a `tailwind.config.js` with theme extensions unless it's strictly for the `addVariablesForColors` plugin (Aceternity bridge).
    * Use `@apply` sparingly. Prefer utility classes directly in JSX.

3.  **Supabase & Auth**:
    * **Library**: Use ONLY `@supabase/ssr`. Do NOT use `@supabase/auth-helpers-nextjs` (Deprecated).
    * **Context Awareness**:
        * In Middleware: Use `createServerClient` with request/response cookie handling.
        * In Server Components: Use `createServerClient` with cookie store (read-only).
        * In Server Actions: Use `createServerClient` with cookie store (read-write).

4.  **Aceternity UI / Framer Motion**:
    * **Class Merging**: ALWAYS wrap classes in `cn(...)`.
    * **Hydration**: If a component uses random values (like stars/beams), use `dynamic(() => ..., { ssr: false })` or `suppressHydrationWarning`.
    * **Version**: We use Framer Motion v12 alpha. Handle `ref` changes for React 19 compatibility.

5.  **Automation (n8n)**:
    * **Pattern**: Do NOT call n8n webhooks from the client.
    * **Correct Flow**: Client -> Server Action -> Insert to Supabase -> `pg_net` Trigger -> n8n.

## OUTPUT FORMAT
* **Axiomatic Coding**: No fluff. Code must be dense and type-safe.
* **File Structure**: When suggesting files, follow: `src/components/ui` for primitives, `src/features` for domain logic.
2. 🦴 EL ESQUELETO: docs/architecture/SYSTEM_CONTEXT.md
Propósito: Mapa mental para que Copilot entienda dónde ubicar los componentes de Aceternity y cómo conectar Supabase sin romper la arquitectura.

Markdown

# SYSTEM CONTEXT & ARCHITECTURE MAP

## 1. Directory Structure
* `src/components/ui`: Aceternity & Shadcn primitives (Button, BentoGrid, BackgroundBeams).
* `src/lib/supabase`:
    * `server.ts`: Server Component client (Cookie Store).
    * `client.ts`: Browser client.
    * `middleware.ts`: Auth token refresher (Critical).
* `src/lib/utils.ts`: Contains the `cn` helper (clsx + tailwind-merge).
* `src/app/(auth)`: Route group for Login/Register.

## 2. Global Styles (Tailwind v4)
* Configuration is in `src/app/globals.css` using the `@theme` directive.
* Color variables (`--color-primary`, etc.) are injected into `:root` via `tailwind.config.ts` (Legacy Bridge) for Aceternity compatibility.

## 3. Data Flow & Automation
* **Frontend**: Triggers Server Actions (Zod validated).
* **Database**: Supabase (Postgres).
* **Triggers**: We use `pg_net` extension to fire webhooks to n8n on `INSERT` events in specific tables (e.g., `leads`).
* **RLS**: Security is enforced at Row Level Security, not just in the API.

## 4. Common Pitfalls (Needle in a Haystack)
* **Framer Motion v12**: If you see peer dependency warnings, ignore them; we have overrides in `package.json` for React 19 RC.
* **Middleware Loop**: Ensure `middleware.ts` excludes `_next/static` to avoid infinite auth redirect loops.
3. 🕹️ MODOS DE INTERACCIÓN: .github/prompts/MODES.md
Propósito: "Cheat codes" para generar código complejo (como grids de Aceternity o Triggers SQL) rápidamente.

Markdown

# VIBECODING MODES

## MODE 1: ACETERNITY COMPONENT
> "Genera un componente visual usando Aceternity UI.
> 1. Crea el archivo en `src/components/ui`.
> 2. Asegúrate de importar `cn` desde `@/lib/utils`.
> 3. Si usa Framer Motion, recuerda que estamos en v12 alpha/React 19 (cuidado con `refs`).
> 4. Implementa `NextImage` si hay imágenes."

## MODE 2: SUPABASE ACTION
> "Crea un Server Action para [ACCIÓN].
> 1. Define esquema Zod.
> 2. Inicializa Supabase Client (`await cookies()`).
> 3. Valida sesión (`getUser`).
> 4. Realiza la operación DB.
> 5. Maneja errores con `try/catch` y retorna un objeto `{ success, error }`."

## MODE 3: N8N TRIGGER (SQL)
> "Genera el código SQL para conectar Supabase con n8n.
> 1. Crea la función trigger que usa `net.http_post`.
> 2. Define el payload JSON.
> 3. Crea el Trigger `AFTER INSERT` en la tabla [TABLA]."
4. 🛡️ REGISTRO DE DECISIONES: docs/decisions/STACK_DECISIONS.md
Propósito: Evitar que Copilot intente "arreglar" configuraciones extrañas que son necesarias para la compatibilidad (como los overrides en package.json).

Markdown

# ARCHITECTURE DECISION RECORD (ADR)

## ADR-001: React 19 RC & Framer Motion v12
* **Context**: Next.js 15 uses React 19 RC. Stable Framer Motion (v11) breaks.
* **Decision**: Use Framer Motion v12 Alpha.
* **Implication**: Added `overrides` in `package.json` to force React 19 resolution. DO NOT REMOVE.

## ADR-002: Tailwind v4 Hybrid Config
* **Context**: Aceternity UI needs JS access to theme colors (`flattenColorPalette`). Tailwind v4 uses CSS-only config.
* **Decision**: Maintain a minimal `tailwind.config.ts` ONLY for the `addVariablesForColors` plugin. All other styles go to `globals.css`.

## ADR-003: Async Cookies
* **Context**: Next.js 15 made `cookies()` async.
* **Decision**: All access to cookies must be awaited. Legacy synchronous access will
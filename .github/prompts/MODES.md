# INTERACTION MODES - Portfolio2 (Agencia Digital)

---

## MODE 1: SCAFFOLD (Speed / SoT)
**When to use**: Creating new features (pages, components, API routes)

```
Activa modo Skeleton of Thought. Genera SOLO la estructura de archivos + interfaces TypeScript para [NOMBRE_FEATURE].
No implementes lógica. Solo define:
  1. File paths needed
  2. TypeScript interfaces (Zod schemas if it's a mutation)
  3. Server vs Client Component boundary
  4. Database schema changes (if any)

Ejemplo:
- Scaffold para "Lead Management Dashboard"
```

---

## MODE 2: REFACTOR (Depth / ToT)
**When to use**: Improving existing code, handling tech debt

```
Activa modo Tree of Thoughts. Necesito refactorizar [ARCHIVO].

1. Genera 3 enfoques distintos:
   - H1: PERFORMANCE (optimize queries, bundle size)
   - H2: LEGIBILITY (clean up, better naming, comments)
   - H3: MODULARITY (split components, extract hooks, DRY violations)
   
2. Red Team Analysis (critique each approach):
   - Does it break React 19 rules?
   - Does it violate RLS security?
   - Will it cause hydration errors?
   - Type safety concerns?
   
3. Implementa el GANADOR con justificación.
```

---

## MODE 3: AUDIT (Safety / CoVe)
**When to use**: Before merging code, security concerns, framework compliance

```
Ejecuta Chain of Verification en [ARCHIVO].

1. Genera 3 preguntas escépticas:
   ✓ React 19 / framer-motion compatibility?
   ✓ Server Component vs Client Component boundary violations?
   ✓ RLS security leaks (exposing secrets to client)?
   ✓ Hydration errors (mismatches between server/client render)?
   ✓ Async/await correctness (especially Supabase clients)?
   ✓ Zod validation for inputs (if mutation)?
   
2. Responde basándote SOLO en el código visible.
   
3. Reescribe el código para solucionar hallazgos.
   - Provide corrected version with explanations.
```

---

## MODE 4: SUPABASE ACTION
**When to use**: Creating Server Actions for database mutations

```
Crea un Server Action para [ACCIÓN].

1. Define esquema Zod.
2. Inicializa Supabase Client (await cookies()).
3. Valida sesión (getUser).
4. Realiza la operación DB.
5. Maneja errores con try/catch y retorna un objeto { success, error }.
```

---

## MODE 5: N8N TRIGGER (SQL)
**When to use**: Connecting Supabase with n8n automations

```
Genera el código SQL para conectar Supabase con n8n.

1. Crea la función trigger que usa net.http_post.
2. Define el payload JSON con datos relevantes.
3. Crea el Trigger AFTER INSERT en la tabla [TABLA].
4. Asegúrate de que pg_net esté habilitado.
```

---

## MODE 6: ACETERNITY COMPONENT
**When to use**: Creating visual components with Aceternity UI

```
Genera un componente visual usando Aceternity UI.

1. Crea el archivo en src/components/ui.
2. Asegúrate de importar cn desde @/lib/utils.
3. Si usa Framer Motion, recuerda que estamos en v12 alpha/React 19 (cuidado con refs).
4. Si tiene valores aleatorios o cálculos de ventana: usa dynamic({ ssr: false }) o suppressHydrationWarning.
5. Exporta ambos: Contenedor y ItemComponent.
```

---

## MODE 7: CONTEXT INJECTION (For complex tasks)
**When to use**: Starting new features, feeling "lost in the middle"

```
@workspace lee docs/architecture/SYSTEM_CONTEXT.md y estructura un plan detallado para [TAREA].

Incluye:
  1. Qué archivos crear/modificar
  2. Server vs Client Components (marca claramente)
  3. Supabase queries/mutations needed
  4. n8n triggers (si es necesario)
  5. Validaciones Zod requeridas
```

---

## MODE 8: TECHNICAL DEBT RECORD (Documentation)
**When to use**: After making architectural decisions

```
Activa modo ADR (Architecture Decision Record). 
Rellena docs/decisions/ADR_[NOMBRE].md:

- Status: [Proposed | Accepted]
- Date: YYYY-MM-DD
- Context: ¿Cuál era el problema?
- Decision: ¿Qué decidimos hacer?
- Consequences:
  * Positive: ...
  * Negative (Trade-offs): ...
- Alternatives considered: ...
```

---

## QUICK REFERENCE: Mode Selection

| Task | Mode | Example |
|------|------|---------|
| New page + components | SCAFFOLD | "Crear dashboard de leads" |
| Improve performance | REFACTOR | "Optimizar LeadsTable (500 rows)" |
| Security review | AUDIT | "Verificar auth en createLead()" |
| Database mutation | SUPABASE | "Crear Server Action para updateProfile()" |
| n8n automation | N8N | "Trigger para enviar lead a CRM" |
| Visual component | ACETERNITY | "BentoGrid para servicios" |
| Stuck/confused | CONTEXT | "@workspace lee SYSTEM_CONTEXT..." |
| Big decision | DEBT | "Decidimos usar RLS en lugar de middleware" |

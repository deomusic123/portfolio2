**BLUF**: Guía práctica para desarrolladores: setup rápido, patrones obligatorios, convenciones y checklist de PR.

1) Setup local
- `npm install`
- Copiar el ejemplo de env: `cp .env.local.example .env.local` y completar variables.
- Ejecutar DB: importar `docs/database/schema.sql` en Supabase.
- Correr dev: `npm run dev`

2) Comandos útiles
- `npm run dev` — servidor local
- `npm run type-check` — comprobación TS
- `npm run lint` — ESLint

3) Patrones obligatorios
- Server Components por defecto. `use client` SOLO en componentes que necesitan hooks.
- Validar entradas en Server Actions con `zod`.
- Usar `createServerClient()` desde `src/lib/supabase/server.ts` en RSCs/Actions.
- Clases: usar `cn()` para combinar clases (evitar conflictos de Tailwind).
- Componentes con valores aleatorios → `dynamic(..., { ssr: false })` o `suppressHydrationWarning`.

4) Skeleton of Thought (SoT)
- Para nuevas features: primero generar interfaces/tipos (`src/types`) y Zod schemas.
- Esperar aprobación de tipos antes de implementar lógica.

5) Chain of Verification (CoVe)
- Antes de merge: verificar compatibilidad React 19, que no se expongan secretos, y que RLS se cumple.
- Ejecutar `tsc --noEmit` y `npm run lint` en CI.

6) PR checklist (mínimo)
- [ ] Tipos y Zod definidos.
- [ ] Tests unitarios para utilidades y lógica (sugerido `vitest`).
- [ ] `tsc --noEmit` pasa.
- [ ] No secrets en diff.
- [ ] Documentación actualizada (`docs/` si aplica).

7) Testing sugerido
- Integración: pruebas de Server Actions simulando usuarios diferentes para validar RLS.
- Unit: `src/lib` utils y helpers.

8) Estructura de archivos relevantes
- `src/actions` — Server Actions
- `src/lib/supabase` — creación de cliente, middleware y admin helpers
- `src/components` — UI y Client Components
- `src/app` — rutas y Server Components

9) Recomendaciones futuras
- Añadir `vitest` y fixtures para supabase mocks.
- Scripts de CI que ejecuten `tsc`, `lint` y tests en PRs.


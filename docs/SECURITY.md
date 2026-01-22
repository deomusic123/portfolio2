**BLUF**: Reglas y prácticas de seguridad críticas para Portfolio2 — RLS, gestión de keys, middleware y automatizaciones.

1) Principios rápidos
- No exponer `SUPABASE_SERVICE_ROLE_KEY` ni `N8N_WEBHOOK_URL` al cliente.
- Todas las autorizaciones las debe imponer la base de datos (RLS) y no la UI.
- Las auditorías y logs deben ser visibles en Supabase o n8n según flujo.

2) Secrets y variables
- Variables sensibles SOLO en servidor/CI: `SUPABASE_SERVICE_ROLE_KEY`, `N8N_WEBHOOK_URL`, `DATABASE_URL`.
- Variables públicas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Nunca commitear `.env.*` ni exponer valores en builds públicos.

3) Autenticación y Middleware
- Middleware debe usar `createServerClient` y `getUser()` (NO `getSession()`).
- Refrescar JWT en `src/lib/supabase/middleware.ts` antes de llegar a RSCs.
- Excluir rutas estáticas y `_next` para evitar bucles (ej.: `_next/static`, `/favicon.ico`).

4) Cookies y Next.js 15
- `cookies()` es asíncrono — siempre `await cookies()` en Server Components y Actions.
- Validar expiración y revocar tokens cuando el backend detecte anomalías.

5) RLS (Row Level Security)
- Toda tabla sensible debe tener política RLS que limite filas por `auth.uid()` o claims.
- Evitar consultas con `select('*')` sin `eq('owner', user.id)` u otras restricciones.
- Tests: agregar pruebas de integración que ejecuten queries con diferentes roles para comprobar RLS.

6) n8n y pg_net
- Disparadores `pg_net` en la BD para `INSERT` envían webhooks a n8n.
- n8n workflows deben usar `SERVICE_ROLE` para actualizar registros cuando sea necesario.
- No aceptar payloads directos desde cliente a endpoints de n8n; validar y autenticar webhooks entrantes.

7) Registro y auditoría
- Registrar acciones críticas (creación/eliminación de usuarios, cambios de roles) en tabla `audit_logs`.
- Configurar alertas en n8n o en la capa de infra cuando ocurran fallos de seguridad.

8) Buenas prácticas para PRs
- Revisar que no haya secrets hardcodeados.
- Añadir tests para RLS y flujos de Server Actions cuando se cambie lógica de acceso.

9) Respuesta ante incidentes
- Rotar `SERVICE_ROLE` y revocar tokens en caso de compromiso.
- Revisar webhooks recientes en `pg_net` y actividades en n8n.

Referencias:
- `src/lib/supabase/middleware.ts`
- `src/middleware.ts`
- `docs/architecture/SYSTEM_CONTEXT.md` (sección seguridad y RLS)


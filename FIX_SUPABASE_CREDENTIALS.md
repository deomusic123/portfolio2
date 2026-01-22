# ✅ Fix: Error de Credenciales Supabase

**Problema**: `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL`

**Causa**: El middleware intentaba conectarse a Supabase con placeholders en `.env.local`

---

## Cambios Aplicados:

### 1. Middleware Tolerante (apps/dashboard/src/lib/supabase/middleware.ts)
✅ Ahora valida si las credenciales existen ANTES de intentar conectar
✅ Si no están configuradas, solo muestra warning y continúa sin autenticación
✅ El servidor no crashea

### 2. Validaciones Agregadas
- **middleware.ts**: Verifica URL válida antes de createServerClient
- **server.ts**: Lanza error claro si no hay credenciales
- **admin.ts**: Valida URL y service role key

### 3. Banner de Advertencia en Homepage
✅ Muestra banner amarillo prominente si Supabase no está configurado
✅ Link directo a app.supabase.com
✅ Instrucciones claras de qué archivo editar

---

## Resultado Actual:

### ✅ FUNCIONANDO:
- **http://localhost:3000**: Landing de apps/web (SEO pages)
- **http://localhost:3001**: Dashboard con banner de configuración
- Servidores NO crashean sin credenciales
- Hot reload funcional

### ⚠️ FUNCIONALIDAD LIMITADA (hasta configurar Supabase):
- Login/Register: No funcional
- Dashboard protegido: Accesible sin auth
- Base de datos: No conectada

---

## Próximo Paso para el Usuario:

### Configurar Supabase (2 minutos):

1. **Obtener credenciales**:
   - Ve a https://app.supabase.com
   - Proyecto → Settings → API
   - Copia:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - service_role key (SUPABASE_SERVICE_ROLE_KEY)

2. **Editar archivos .env.local**:

`apps/dashboard/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`apps/web/.env.local` (solo necesita las 2 primeras):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Reiniciar servidor**:
```bash
# Ctrl+C para detener
npm run dev
```

4. **Ejecutar SQL**:
   - Supabase → SQL Editor
   - Ejecuta `docs/database/schema.sql`
   - Ejecuta `docs/database/seo_pages.sql`

---

## Validación:

Una vez configurado Supabase:
- ✅ Banner amarillo desaparece
- ✅ Login/Register funcionan
- ✅ Dashboard requiere autenticación
- ✅ http://localhost:3000/comparar muestra 3 páginas
- ✅ http://localhost:3000/sitemap.xml genera dinámicamente

---

*Fix aplicado: 21 Enero 2026*  
*Servidores funcionando sin crashear*

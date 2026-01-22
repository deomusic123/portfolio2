# ⚡ INICIO RÁPIDO - Portfolio2

## ✅ Ya configurado automáticamente:
- ✅ Archivos `.env.local` creados en apps/web y apps/dashboard
- ✅ Dependencias instaladas (node_modules)
- ✅ Estructura monorepo lista
- ✅ TypeScript validado sin errores

## 🔧 LO QUE DEBES HACER AHORA:

### 1. Configurar Credenciales Supabase (REQUERIDO)

Edita estos archivos con tus credenciales de Supabase:

**apps/web/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

**apps/dashboard/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
N8N_WEBHOOK_URL=tu-n8n-webhook (opcional)
```

**Dónde obtener las keys:**
- Ve a https://app.supabase.com
- Selecciona tu proyecto
- Settings → API
- Copia: `URL`, `anon public key` y `service_role key`

### 2. Ejecutar Scripts SQL en Supabase (REQUERIDO)

Ve a Supabase → SQL Editor y ejecuta en orden:

1. **docs/database/schema.sql** (tablas principales)
2. **docs/database/seo_pages.sql** (tabla SEO + ejemplos)

### 3. Iniciar el Proyecto

```bash
npm run dev
```

Esto arranca ambas aplicaciones:
- **Landing**: http://localhost:3000
- **Dashboard**: http://localhost:3001

## 🧪 Validar que funciona:

1. Landing: http://localhost:3000
   - Debe mostrar hero con animaciones
   - Botón "Comenzar Gratis" debe linkear a puerto 3001

2. Comparativas: http://localhost:3000/comparar
   - Debe listar 3 comparativas (n8n vs Zapier, etc.)

3. Página dinámica: http://localhost:3000/comparar/n8n-vs-zapier
   - Debe cargar contenido desde Supabase

4. Sitemap: http://localhost:3000/sitemap.xml
   - Debe generar XML con todas las URLs

5. Dashboard: http://localhost:3001
   - Redirige a login si no estás autenticado

## 📚 Más información:

- **RESUMEN_FINAL.md** - Resumen ejecutivo de lo implementado
- **docs/VALIDATION_GUIDE.md** - Guía completa de validación
- **docs/IMPLEMENTATION_PLAN_COMPLETED.md** - Detalles técnicos

## ⚡ Comandos útiles:

```bash
npm run dev              # Ambas apps
npm run dev:web          # Solo landing
npm run dev:dashboard    # Solo dashboard
npm run build            # Build producción
npm run type-check       # Verificar TypeScript
```

## 🐛 Problemas comunes:

**Error: Cannot find module @portfolio2/ui**
→ `npm install --legacy-peer-deps`

**Páginas de comparativas vacías**
→ Ejecutar `docs/database/seo_pages.sql` en Supabase

**Dashboard no carga datos**
→ Verificar credenciales en `apps/dashboard/.env.local`

---

**Todo listo** ✅ Solo falta configurar Supabase y ejecutar `npm run dev`

# AGENCY SNIPER - Sprint Progress
**Fecha:** 2026-01-22  
**Estado:** ⏸️ Pausa para continuar mañana

## ✅ COMPLETADO HOY

### 1. Database Layer (PostgreSQL)
- ✅ **Migration SQL creada**: `leads_sniper_migration.sql` (350+ líneas)
  - 13 nuevas columnas: `website`, `tech_stack`, `email_valid`, `email_validation_details`, `ai_email_draft`, `suggested_action`, `pain_points`, timestamps
  - 7 nuevos status: investigating, meeting_booked, proposal_sent, closed_won, closed_lost
  - Función `calculate_lead_score()`: scoring inteligente con pesos por email, tech stack, valor
  - Trigger `trigger_lead_investigation()`: llama n8n automáticamente en INSERT
  - View `leads_ready_for_contact`: filtra leads listos para contactar
  - Función `get_lead_insights()`: API JSON para oportunidades detectadas
- ✅ **Fix RLS**: `fix_client_id.sql` - agregada columna `client_id` + policies
- ✅ **Migración ejecutada**: Base de datos actualizada

### 2. Type System (TypeScript)
- ✅ **types.ts actualizado**: 4 nuevas interfaces
  - `TechStack`: cms, framework, analytics, speed, ssl, responsive, seo
  - `EmailValidation`: hasMX, disposable, freeProvider, validFormat
  - `LeadOpportunity`: type, title, description, priority, estimatedValue
  - `LeadInsights`: opportunities[], warnings[], readinessScore
- ✅ **Lead interface expandida**: 13 nuevos campos
- ✅ **CreateLeadInput/UpdateLeadInput**: soporte para `website` y campos IA

### 3. Business Logic (Utils)
- ✅ **utils.ts expandido**: 12 nuevas funciones (~150 líneas)
  - `detectOpportunities()`: escanea tech_stack → oportunidades de venta
  - `calculatePotentialRevenue()`: suma valores estimados por oportunidad
  - `getTechStackIcon()`: emojis para CMS (🔷 WordPress, 🛍️ Shopify)
  - `getEmailValidationIcon()`: badges ✅/⚠️/⏳
  - `getLeadHealthStatus()`: critical/warning/healthy
  - `shouldAutoContact()`: lógica de decisión para outreach automático
  - `formatTechStack()`: formato legible "WordPress + WooCommerce"
- ✅ **KANBAN_COLUMNS actualizado**: 6 → 7 columnas (añadida 'investigating')

### 4. Server Actions
- ✅ **actions/leads.ts mejorado**:
  - `createLead()`: acepta `website`, inicializa nuevos campos JSONB
  - `updateLead()`: maneja `suggested_action`, `next_follow_up_at`
  - `getLeadInsights()`: wrapper para función PostgreSQL (respeta RLS)

### 5. Frontend Components
- ✅ **LeadCard component creado**: 160 líneas
  - Health indicator (🟢/🟡/🔴) basado en email/data
  - Email validation badge (✅/⚠️/⏳)
  - Tech stack display con iconos (CMS + speed indicator)
  - Opportunity chips (muestra primeros 2 + contador)
  - Botón "📧 Copy AI Draft" con feedback
  - "🔍 AI analyzing..." para status investigating
  - Suggested action en badge amarillo
- ✅ **Leads page actualizado**:
  - 7 columnas Kanban con colores dinámicos
  - Stats mejorados: muestra leads en investigación
  - Integración de LeadCard en cada columna
  - Empty states por columna

## 📋 ARQUITECTURA IMPLEMENTADA

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENCY SNIPER FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. USER CREATES LEAD (website + email)
   └─> INSERT en leads table
       └─> TRIGGER: trigger_lead_investigation()
           └─> pg_net.http_post() → n8n webhook

2. n8n WORKFLOW "SNIPER" (pendiente implementar)
   ├─> HTTP Request: GET {website} (parse HTML)
   ├─> Extract tech: WordPress? Analytics? Speed?
   ├─> Email Validation: Check MX records
   ├─> OpenAI GPT-4o: Generate sales email draft
   └─> UPDATE leads: tech_stack, email_valid, ai_email_draft

3. TRIGGER AUTO-SCORING
   └─> calculate_lead_score() ejecuta weighted algorithm
       └─> UPDATE ai_score (0-100)

4. FRONTEND REALTIME
   └─> Supabase Realtime broadcast
       └─> LeadCard updates: new tech data appears
           └─> User clicks "Copy AI Draft" → clipboard
```

## ⏳ PENDIENTE PARA MAÑANA

### PRIORIDAD ALTA
1. **Ejecutar `fix_client_id.sql` en Supabase** (si no se hizo)
2. **Verificar que compila**: `npm run dev` sin errores
3. **Crear lead de prueba**: verificar que trigger funciona
4. **Implementar n8n Workflow**:
   - Crear workflow en n8n instance
   - Configurar webhook `/webhook/lead-sniper`
   - Nodos: HTTP Request → HTML Parse → Email Validator → OpenAI → Supabase UPDATE
   - Actualizar URL en migration SQL (línea 108)

### PRIORIDAD MEDIA
5. **Form "New Lead"**: modal/sheet para crear leads con campo `website`
6. **Drag & Drop Kanban**: mover cards entre columnas (react-beautiful-dnd)
7. **Sheet lateral panel**: ver detalles completos del lead al hacer click
8. **Lead activities table**: crear tabla + componente de timeline

### PRIORIDAD BAJA
9. **Filtros funcionales**: "Hot Leads", "This Week", "This Month"
10. **Import CSV**: bulk lead creation
11. **Tests**: unit tests para `detectOpportunities()`, `calculatePotentialRevenue()`
12. **Animaciones**: framer-motion para transitions en Kanban

## 🔧 TECH DEBT / MEJORAS

- [ ] Manejo de errores en n8n trigger (retry logic, dead letter queue)
- [ ] Rate limiting para email validation API
- [ ] Cache de tech_stack results (evitar re-analizar mismo dominio)
- [ ] Webhook signature validation (seguridad n8n → Supabase)
- [ ] Logs estructurados para debugging

## 📊 MÉTRICAS ESPERADAS

**Cuando n8n esté activo:**
- ⏱️ Tiempo investigación: 10-15s por lead
- 🎯 Precisión email validation: >95%
- 🔍 Detección CMS: WordPress, Shopify, Wix, Webflow (~80% sitios)
- 📧 AI email quality: Evaluación manual (primeros 50 leads)

**Value Proposition:**
- ❌ Antes: 20 minutos manuales por lead
- ✅ Después: 15 segundos automatizados
- 💰 ROI: $200-500/mes por agencia (justifica precio SaaS)

## 🐛 BUGS CONOCIDOS

- ✅ **RESUELTO**: `client_id` faltante → fix_client_id.sql
- ✅ **RESUELTO**: Syntax error en types.ts → código huérfano eliminado
- ⚠️ **PENDIENTE**: n8n URL hardcodeada en migration (usar env var)

## 📚 DOCUMENTACIÓN ACTUALIZADA

- `docs/database/leads_sniper_migration.sql` - Migration completa con comentarios
- `docs/database/fix_client_id.sql` - Fix RLS + client_id
- `docs/database/00_base_leads_table.sql` - Referencia tabla base
- `lib/leads/types.ts` - Sistema de tipos completo
- `lib/leads/utils.ts` - Business logic + helpers
- `components/leads/LeadCard.tsx` - Component showcase

---

**Próxima sesión:** Implementar n8n workflow + formulario "New Lead" + drag & drop

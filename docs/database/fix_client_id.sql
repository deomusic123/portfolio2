-- ========================================
-- FIX: Agregar client_id a tabla leads
-- ========================================

-- 1. Agregar columna client_id
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Si hay leads existentes sin client_id, asignarlos al primer usuario
-- (O elimínalos si son de prueba)
UPDATE leads 
SET client_id = (SELECT id FROM auth.users LIMIT 1)
WHERE client_id IS NULL;

-- 3. Hacer columna NOT NULL después de migrar datos
ALTER TABLE leads 
  ALTER COLUMN client_id SET NOT NULL;

-- 4. Crear índice
CREATE INDEX IF NOT EXISTS leads_client_id_idx ON leads(client_id);

-- 5. Eliminar triggers antiguos que puedan referenciar columnas obsoletas
DROP TRIGGER IF EXISTS calculate_lead_score_trigger ON leads;
DROP TRIGGER IF EXISTS trigger_lead_investigation ON leads;
DROP FUNCTION IF EXISTS calculate_lead_score() CASCADE;
DROP FUNCTION IF EXISTS trigger_lead_investigation() CASCADE;

-- 6. Habilitar RLS si no está habilitado
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 7. Eliminar policies existentes y recrear
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

-- 8. Crear policies correctas
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Users can insert own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = client_id);

CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid() = client_id);

-- 9. Renombrar lead_score a ai_score para consistencia (si existe)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'lead_score'
  ) THEN
    ALTER TABLE leads RENAME COLUMN lead_score TO ai_score;
  END IF;
END $$;

-- Si ai_score no existe, créala
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score INT DEFAULT 0 
  CHECK (ai_score >= 0 AND ai_score <= 100);

-- 10. Agregar columnas faltantes del schema original (BASE FIELDS)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 11. Agregar columnas de inteligencia (Agency Sniper)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS suggested_action TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_email_draft TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pain_points TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investigation_completed_at TIMESTAMPTZ;

-- 12. Agregar columnas de enriquecimiento legacy (si no existen)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_size TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_industry TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS enrichment_status TEXT DEFAULT 'pending';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ;

-- 13. Agregar columnas de tech intelligence (JSONB)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_validation_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_valid BOOLEAN;

-- 14. Agregar columna ai_summary si no existe
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_summary TEXT;
-- 15. Agregar columna position para ordenar en Kanban
ALTER TABLE leads ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;

-- 15. Verificación
SELECT 
  'Fix completed' AS status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('client_id', 'notes', 'source', 'website', 'ai_score', 'tech_stack', 'email_valid', 'ai_email_draft', 'position')
ORDER BY column_name;

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

-- 5. Habilitar RLS si no está habilitado
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar policies existentes y recrear
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

-- 7. Crear policies correctas
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

-- 8. Renombrar lead_score a ai_score para consistencia (si existe)
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

-- 9. Agregar columnas faltantes del schema original
ALTER TABLE leads ADD COLUMN IF NOT EXISTS suggested_action TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_email_draft TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pain_points TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investigation_completed_at TIMESTAMPTZ;

-- 10. Verificación
SELECT 
  'Fix completed' AS status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('client_id', 'ai_score', 'tech_stack', 'email_valid')
ORDER BY column_name;

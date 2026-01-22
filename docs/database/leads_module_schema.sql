-- ========================================
-- LEADS MODULE: Database Schema Extension
-- ========================================
-- Ejecutar en Supabase SQL Editor
-- Extiende el schema base de leads para soportar el "Lead Conversion Engine"

-- 1. EXTENSIÓN DE LA TABLA LEADS
-- ========================================
-- Añade columnas para enriquecimiento, scoring y pipeline avanzado

ALTER TABLE leads 
  -- Pipeline avanzado (convertir status a TEXT si era ENUM)
  ALTER COLUMN status TYPE TEXT,
  
  -- Valor potencial del lead
  ADD COLUMN IF NOT EXISTS potential_value NUMERIC,
  ADD COLUMN IF NOT EXISTS expected_close_date DATE,
  
  -- Datos de enriquecimiento automático (llenados por n8n)
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS company_size TEXT,
  ADD COLUMN IF NOT EXISTS company_industry TEXT,
  
  -- Lead Scoring con IA
  ADD COLUMN IF NOT EXISTS ai_score INT DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  
  -- Metadatos de enriquecimiento
  ADD COLUMN IF NOT EXISTS enrichment_status TEXT DEFAULT 'pending' 
    CHECK (enrichment_status IN ('pending', 'processing', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ;

-- Actualizar constraint de status para incluir nuevos valores del pipeline
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost'));

-- 2. ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_ai_score_idx ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS leads_enrichment_status_idx ON leads(enrichment_status);
CREATE INDEX IF NOT EXISTS leads_client_id_status_idx ON leads(client_id, status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- 3. TABLA DE ACTIVIDADES DEL LEAD
-- ========================================
-- Historial completo de cambios (para timeline en el Sheet lateral)

CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'created',
    'status_changed',
    'note_added',
    'enrichment_completed',
    'score_updated',
    'email_sent',
    'value_updated',
    'tag_added'
  )),
  
  old_value TEXT,
  new_value TEXT,
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices para lead_activities
CREATE INDEX IF NOT EXISTS lead_activities_lead_id_idx ON lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_activities_user_id_idx ON lead_activities(user_id);
CREATE INDEX IF NOT EXISTS lead_activities_type_idx ON lead_activities(activity_type);

-- 4. ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Política: Users solo ven actividades de sus propios leads
DROP POLICY IF EXISTS "Users can view activities of their leads" ON lead_activities;
CREATE POLICY "Users can view activities of their leads" 
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_activities.lead_id 
        AND leads.client_id = auth.uid()
    )
  );

-- Política: Users pueden crear actividades en sus leads
DROP POLICY IF EXISTS "Users can create activities for their leads" ON lead_activities;
CREATE POLICY "Users can create activities for their leads"
  ON lead_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_activities.lead_id 
        AND leads.client_id = auth.uid()
    )
  );

-- 5. TRIGGER PARA LOGGING AUTOMÁTICO DE CAMBIOS
-- ========================================
-- Registra automáticamente cambios de status en lead_activities

CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_activities (lead_id, user_id, activity_type, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'status_changed', OLD.status, NEW.status);
  END IF;
  
  IF OLD.ai_score IS DISTINCT FROM NEW.ai_score THEN
    INSERT INTO lead_activities (lead_id, user_id, activity_type, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'score_updated', OLD.ai_score::TEXT, NEW.ai_score::TEXT);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_updated ON leads;
CREATE TRIGGER on_lead_updated
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_status_change();

-- 6. FUNCIÓN Y TRIGGER PARA n8n ENRICHMENT
-- ========================================
-- Llama a n8n vía pg_net cuando se crea un lead nuevo

CREATE OR REPLACE FUNCTION trigger_lead_enrichment()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar enrichment_status a 'processing'
  UPDATE leads 
  SET enrichment_status = 'processing'
  WHERE id = NEW.id;
  
  -- Llamar a n8n webhook (asíncrono vía pg_net)
  -- IMPORTANTE: Reemplazar URL con tu instancia de n8n
  PERFORM net.http_post(
    url := 'https://your-n8n-instance.com/webhook/enrich-lead',
    body := json_build_object(
      'lead_id', NEW.id,
      'email', NEW.email,
      'name', NEW.name,
      'message', NEW.notes,
      'client_id', NEW.client_id
    )::text,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  
  -- Log activity
  INSERT INTO lead_activities (lead_id, user_id, activity_type)
  VALUES (NEW.id, NEW.client_id, 'created');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_created ON leads;
CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_lead_enrichment();

-- 7. HABILITAR REALTIME
-- ========================================
-- Permite que el frontend reciba actualizaciones automáticas

ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE lead_activities;

-- 8. FUNCIÓN HELPER: Get Lead with Activities
-- ========================================
-- Vista optimizada para el Sheet lateral

CREATE OR REPLACE FUNCTION get_lead_with_activities(lead_uuid UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'lead', row_to_json(l.*),
    'activities', (
      SELECT json_agg(row_to_json(a.*) ORDER BY a.created_at DESC)
      FROM lead_activities a
      WHERE a.lead_id = lead_uuid
    )
  )
  FROM leads l
  WHERE l.id = lead_uuid
    AND l.client_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 9. VERIFICACIÓN
-- ========================================
-- Ejecutar esto para confirmar que todo está correcto

SELECT 
  'Columns added' AS check_type,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('ai_score', 'enrichment_status', 'potential_value', 'company_name')
ORDER BY column_name;

SELECT 
  'Realtime enabled' AS check_type,
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('leads', 'lead_activities');

-- ========================================
-- FIN DE MIGRATIONS
-- ========================================

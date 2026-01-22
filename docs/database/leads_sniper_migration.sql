-- ========================================
-- LEADS MODULE: "AGENCY SNIPER" UPGRADE
-- ========================================
-- Ejecutar en Supabase SQL Editor
-- Convierte el módulo básico en una máquina de inteligencia comercial

-- IMPORTANTE: Esta migración es SEGURA - NO destruye datos existentes
-- Solo AÑADE columnas nuevas a la tabla leads

-- 1. ACTUALIZAR ENUM DE STATUS
-- ========================================
-- Agregar nuevos estados del pipeline de agencia

ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'investigating';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'meeting_booked';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'proposal_sent';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'closed_won';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'closed_lost';

-- Nota: Los valores viejos (new, contacted, qualified, etc.) se mantienen para compatibilidad

-- 2. AGREGAR COLUMNAS DE INTELIGENCIA
-- ========================================

ALTER TABLE leads
  -- Website del cliente (crítico para espionaje)
  ADD COLUMN IF NOT EXISTS website TEXT,
  
  -- TECH INTELLIGENCE (El espía técnico)
  ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '{}'::jsonb,
  -- Estructura ejemplo:
  -- {
  --   "cms": "WordPress",
  --   "ecommerce": "WooCommerce",
  --   "analytics": false,
  --   "tagManager": false,
  --   "framework": "jQuery",
  --   "speed": "slow",
  --   "ssl": true,
  --   "responsive": true
  -- }
  
  -- EMAIL VALIDATION (Evitar spam rate)
  ADD COLUMN IF NOT EXISTS email_valid BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS email_validation_details JSONB DEFAULT '{}'::jsonb,
  -- Estructura ejemplo:
  -- {
  --   "hasMX": true,
  --   "disposable": false,
  --   "freeProvider": false,
  --   "validFormat": true
  -- }
  
  -- AI SALES INTELLIGENCE (El SDR automático)
  ADD COLUMN IF NOT EXISTS suggested_action TEXT,
  -- Ejemplo: "Ofrécele migración a Next.js - sitio lento detectado"
  
  ADD COLUMN IF NOT EXISTS ai_email_draft TEXT,
  -- Email de venta generado por IA listo para enviar
  
  ADD COLUMN IF NOT EXISTS pain_points TEXT[],
  -- Array de dolores detectados: ['No tiene Analytics', 'Sitio lento', 'Sin SSL']
  
  -- OPERATIVO MEJORADO
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS investigation_completed_at TIMESTAMPTZ;

-- 3. ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS leads_website_idx ON leads(website) WHERE website IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_email_valid_idx ON leads(email_valid);
CREATE INDEX IF NOT EXISTS leads_tech_stack_idx ON leads USING gin(tech_stack);
CREATE INDEX IF NOT EXISTS leads_last_contacted_idx ON leads(last_contacted_at DESC);
CREATE INDEX IF NOT EXISTS leads_next_follow_up_idx ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;

-- 4. FUNCIÓN PARA TRIGGER DE n8n (WORKFLOW "SNIPER")
-- ========================================

CREATE OR REPLACE FUNCTION trigger_lead_investigation()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo investigar leads nuevos que tengan email o website
  IF NEW.status = 'new' AND (NEW.email IS NOT NULL OR NEW.website IS NOT NULL) THEN
    
    -- Llamar a n8n "Sniper Workflow" vía pg_net
    PERFORM net.http_post(
      url := 'https://your-n8n-instance.com/webhook/lead-sniper',
      body := json_build_object(
        'lead_id', NEW.id,
        'email', NEW.email,
        'website', NEW.website,
        'name', NEW.name,
        'message', NEW.message,
        'phone', NEW.phone
      )::text,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 30000
    );
    
    -- Marcar como "investigating"
    UPDATE leads 
    SET status = 'investigating'
    WHERE id = NEW.id;
    
    -- Log activity
    INSERT INTO lead_activities (lead_id, user_id, activity_type, new_value)
    VALUES (NEW.id, NEW.client_id, 'created', 'Lead created - investigation triggered');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reemplazar trigger existente
DROP TRIGGER IF EXISTS on_lead_created ON leads;
CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_lead_investigation();

-- 5. FUNCIÓN HELPER: Calcular Lead Score Inteligente
-- ========================================

CREATE OR REPLACE FUNCTION calculate_lead_score(lead_row leads)
RETURNS INT AS $$
DECLARE
  score INT := 0;
  tech_data JSONB;
BEGIN
  tech_data := lead_row.tech_stack;
  
  -- Base score por tener info completa
  IF lead_row.email IS NOT NULL THEN score := score + 10; END IF;
  IF lead_row.phone IS NOT NULL THEN score := score + 10; END IF;
  IF lead_row.website IS NOT NULL THEN score := score + 15; END IF;
  
  -- Email válido suma puntos
  IF lead_row.email_valid = true THEN score := score + 20; END IF;
  IF lead_row.email_valid = false THEN score := score - 30; END IF;
  
  -- Tech stack suma por oportunidades detectadas
  IF tech_data->>'cms' = 'WordPress' THEN score := score + 15; END IF;
  IF tech_data->>'speed' = 'slow' THEN score := score + 20; END IF;
  IF (tech_data->>'analytics')::boolean = false THEN score := score + 15; END IF;
  IF (tech_data->>'tagManager')::boolean = false THEN score := score + 10; END IF;
  
  -- Mensaje largo indica interés real
  IF length(lead_row.message) > 100 THEN score := score + 15; END IF;
  
  -- Presupuesto mencionado
  IF lead_row.potential_value > 5000 THEN score := score + 20; END IF;
  IF lead_row.potential_value > 10000 THEN score := score + 10; END IF;
  
  -- Limitar entre 0 y 100
  IF score > 100 THEN score := 100; END IF;
  IF score < 0 THEN score := 0; END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. TRIGGER PARA AUTO-CALCULAR SCORE
-- ========================================

CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ai_score := calculate_lead_score(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_lead_score_update ON leads;
CREATE TRIGGER on_lead_score_update
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_score();

-- 7. VIEW OPTIMIZADA: Leads Ready for Contact
-- ========================================

CREATE OR REPLACE VIEW leads_ready_for_contact AS
SELECT 
  l.*,
  calculate_lead_score(l) as calculated_score,
  CASE 
    WHEN l.email_valid = false THEN 'Invalid email - do not contact'
    WHEN l.investigation_completed_at IS NULL THEN 'Investigation pending'
    WHEN l.ai_email_draft IS NULL THEN 'AI draft pending'
    ELSE 'Ready to contact'
  END as contact_status
FROM leads l
WHERE l.status IN ('investigating', 'new', 'contacted')
  AND l.client_id = auth.uid()
ORDER BY l.ai_score DESC, l.created_at DESC;

-- 8. FUNCIÓN PARA OBTENER INSIGHTS DEL LEAD
-- ========================================

CREATE OR REPLACE FUNCTION get_lead_insights(lead_uuid UUID)
RETURNS JSON AS $$
DECLARE
  lead_data leads;
  opportunities TEXT[];
  warnings TEXT[];
BEGIN
  SELECT * INTO lead_data FROM leads WHERE id = lead_uuid AND client_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Lead not found');
  END IF;
  
  -- Detectar oportunidades
  opportunities := ARRAY[]::TEXT[];
  IF (lead_data.tech_stack->>'cms')::TEXT = 'WordPress' THEN
    opportunities := array_append(opportunities, 'Migración a stack moderno (Next.js, Headless CMS)');
  END IF;
  IF (lead_data.tech_stack->>'analytics')::boolean = false THEN
    opportunities := array_append(opportunities, 'Implementación de Analytics y Tag Manager');
  END IF;
  IF (lead_data.tech_stack->>'speed')::TEXT = 'slow' THEN
    opportunities := array_append(opportunities, 'Optimización de performance (Core Web Vitals)');
  END IF;
  
  -- Detectar warnings
  warnings := ARRAY[]::TEXT[];
  IF lead_data.email_valid = false THEN
    warnings := array_append(warnings, 'Email inválido - verificar antes de contactar');
  END IF;
  IF lead_data.website IS NULL THEN
    warnings := array_append(warnings, 'No proporcionó website - limita análisis técnico');
  END IF;
  
  RETURN json_build_object(
    'lead', row_to_json(lead_data),
    'opportunities', opportunities,
    'warnings', warnings,
    'readiness_score', calculate_lead_score(lead_data)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. MIGRACIÓN DE DATOS EXISTENTES
-- ========================================
-- Si ya tienes leads, esto inicializa los nuevos campos

UPDATE leads 
SET 
  tech_stack = '{}'::jsonb,
  email_validation_details = '{}'::jsonb,
  pain_points = ARRAY[]::TEXT[]
WHERE tech_stack IS NULL OR email_validation_details IS NULL;

-- 10. VERIFICACIÓN FINAL
-- ========================================

SELECT 
  'Migration completed' AS status,
  count(*) AS total_leads,
  count(*) FILTER (WHERE tech_stack IS NOT NULL) AS leads_with_tech_data,
  count(*) FILTER (WHERE email_valid IS NOT NULL) AS leads_with_validation
FROM leads;

-- ========================================
-- FIN DE MIGRACIÓN "AGENCY SNIPER"
-- ========================================

-- PRÓXIMOS PASOS:
-- 1. Configurar n8n workflow en: https://your-n8n-instance.com/webhook/lead-sniper
-- 2. Actualizar frontend para mostrar tech_stack y suggested_action
-- 3. Implementar botón "Copy AI Draft" en las cards

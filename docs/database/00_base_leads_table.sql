-- ========================================
-- BASE LEADS TABLE CREATION
-- ========================================
-- Ejecutar PRIMERO en Supabase SQL Editor (si la tabla no existe)

-- Crear tabla base de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información básica del lead
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'manual',
  
  -- Control de estado
  status TEXT DEFAULT 'new',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo pueden ver sus propios leads
CREATE POLICY "Users can view own leads"
  ON leads
  FOR SELECT
  USING (auth.uid() = client_id);

-- Policy: Los usuarios solo pueden insertar leads para sí mismos
CREATE POLICY "Users can insert own leads"
  ON leads
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Policy: Los usuarios solo pueden actualizar sus propios leads
CREATE POLICY "Users can update own leads"
  ON leads
  FOR UPDATE
  USING (auth.uid() = client_id);

-- Policy: Los usuarios solo pueden eliminar sus propios leads
CREATE POLICY "Users can delete own leads"
  ON leads
  FOR DELETE
  USING (auth.uid() = client_id);

-- Índice básico
CREATE INDEX IF NOT EXISTS leads_client_id_idx ON leads(client_id);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Verificación
SELECT 
  'Base leads table created' AS status,
  count(*) AS existing_leads
FROM leads;

-- Projects & Tasks schema for AgencyOS
-- Run in Supabase SQL editor

-- 1. ENUMS (compat con PG sin IF NOT EXISTS en CREATE TYPE)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('planning', 'active', 'review', 'completed', 'paused');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
  END IF;
END $$;

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'planning',
  start_date DATE,
  deadline DATE,
  completed_at TIMESTAMPTZ,
  budget NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Backfill missing columns if table existed without user_id
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill missing column if legacy table lacked client_name
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_name TEXT;
UPDATE projects SET client_name = COALESCE(client_name, name) WHERE client_name IS NULL;
ALTER TABLE projects ALTER COLUMN client_name SET NOT NULL;

-- Backfill missing column if legacy table lacked currency
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS currency TEXT;
UPDATE projects SET currency = COALESCE(currency, 'USD') WHERE currency IS NULL OR currency = '';
ALTER TABLE projects ALTER COLUMN currency SET DEFAULT 'USD';

-- Backfill missing column if legacy table lacked lead_id
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- 3. TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Backfill missing columns if table existed without user_id
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own projects') THEN
    DROP POLICY "Users can manage own projects" ON projects;
  END IF;
END $$;
CREATE POLICY "Users can manage own projects" ON projects
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage tasks of own projects') THEN
    DROP POLICY "Users can manage tasks of own projects" ON tasks;
  END IF;
END $$;
CREATE POLICY "Users can manage tasks of own projects" ON tasks
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Realtime & indexes (safe add to publication)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE projects;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- FESTIVAL GENERUS 2026 - PART 1 COMMAND CENTER DATABASE SCHEMA

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE committee_role AS ENUM ('ketua', 'sekretaris', 'bendahara', 'koordinator', 'panitia');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table Extension
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'panitia',
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Festival Generus 2026',
  description TEXT,
  start_date DATE NOT NULL DEFAULT '2026-12-11',
  end_date DATE NOT NULL DEFAULT '2026-12-13',
  start_time TIME DEFAULT '08:00:00',
  end_time TIME DEFAULT '17:00:00',
  venue TEXT DEFAULT 'Gedung Utama Festival Generus',
  status TEXT DEFAULT 'open', -- draft, open, ongoing, completed, archived
  budget NUMERIC DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Divisions Table
CREATE TABLE IF NOT EXISTS public.divisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Acara, Registrasi, Humas, Logistik, Konsumsi, Dokumentasi, Keamanan
  description TEXT,
  coordinator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Event Members / Committee Table
CREATE TABLE IF NOT EXISTS public.event_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role committee_role DEFAULT 'panitia',
  division_id UUID REFERENCES public.divisions(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 6. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  division_id UUID REFERENCES public.divisions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  pic_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority task_priority DEFAULT 'MEDIUM',
  status task_status DEFAULT 'TODO',
  start_date DATE DEFAULT CURRENT_DATE,
  deadline TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Task Comments Table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Risk Management Table
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  probability INT CHECK (probability BETWEEN 1 AND 5) DEFAULT 3,
  impact INT CHECK (impact BETWEEN 1 AND 5) DEFAULT 3,
  risk_score INT GENERATED ALWAYS AS (probability * impact) STORED,
  severity risk_severity DEFAULT 'MEDIUM',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  mitigation TEXT,
  status TEXT DEFAULT 'IDENTIFIED', -- IDENTIFIED, MITIGATING, RESOLVED, CLOSED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_members_event ON public.event_members(event_id);
CREATE INDEX IF NOT EXISTS idx_divisions_event ON public.divisions(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_event ON public.tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_division ON public.tasks(division_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_risks_event ON public.risks(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON public.audit_logs(event_id);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic Permissive / Member RLS Policies
CREATE POLICY "Public or Member Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Member Access Events" ON public.events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Divisions" ON public.divisions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Members" ON public.event_members FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Tasks" ON public.tasks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Comments" ON public.task_comments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Risks" ON public.risks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Access Audit" ON public.audit_logs FOR ALL USING (auth.uid() IS NOT NULL);

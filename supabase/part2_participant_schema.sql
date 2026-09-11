-- FESTIVAL GENERUS 2026 - PART 2 PARTICIPANT & COMPETITION REGISTRATION ENGINE SCHEMA

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE competition_status AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'READY', 'RUNNING', 'FINISHED', 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('REGISTERED', 'VERIFICATION', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE participant_lifecycle_status AS ENUM ('REGISTERED', 'VERIFICATION', 'APPROVED', 'CHECK_IN', 'COMPETITION', 'RESULT', 'CERTIFICATE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Competitions Table
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. Tahfidz Al-Qur'an Juz 30, Adzan & Iqamah, Mewarnai, Kaligrafi, Pidato Bahasa Arab
  category TEXT NOT NULL, -- Cabe Rawit, Pra-Remaja, Remaja
  description TEXT,
  juknis TEXT, -- Petunjuk Teknis & Tata Tertib Lomba
  quota INT DEFAULT 50,
  duration_minutes INT DEFAULT 15,
  venue TEXT DEFAULT 'Panggung Utama',
  status competition_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Participants Table (Single Source of Truth per Individual/Group)
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  participant_type TEXT DEFAULT 'INDIVIDUAL', -- INDIVIDUAL, GROUP, DELEGATION
  category TEXT NOT NULL, -- Cabe Rawit, Pra-Remaja, Remaja
  school TEXT, -- TPQ / Madrasah / Sekolah
  group_name TEXT NOT NULL, -- Kelompok / Desa Utusan
  phone TEXT,
  email TEXT,
  status participant_lifecycle_status DEFAULT 'REGISTERED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registrations Table (1 Participant -> N Registrations)
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL UNIQUE, -- e.g. REG-2026-001
  status registration_status DEFAULT 'REGISTERED',
  payment_status TEXT DEFAULT 'FREE', -- FREE, PAID, PENDING
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  UNIQUE(participant_id, competition_id)
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'REGISTRATION_RECEIVED', -- REGISTRATION_RECEIVED, REGISTRATION_APPROVED, REGISTRATION_REJECTED, COMPETITION_APPROACHING, SCHEDULE_AVAILABLE
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_competitions_event ON public.competitions(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_group ON public.participants(group_name);
CREATE INDEX IF NOT EXISTS idx_registrations_participant ON public.registrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_registrations_competition ON public.registrations(competition_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic Member RLS Policies
CREATE POLICY "Public Read Competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Member Manage Competitions" ON public.competitions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Manage Participants" ON public.participants FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Member Manage Registrations" ON public.registrations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "User Manage Notifications" ON public.notifications FOR ALL USING (auth.uid() IS NOT NULL);

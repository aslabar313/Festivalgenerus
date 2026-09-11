-- FESTIVAL GENERUS 2026 - PART 3 JUDGE + SCORING + SCHEDULING ENGINE SCHEMA

-- 1. Criteria Table
CREATE TABLE IF NOT EXISTS public.criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. Makharijul Huruf, Tajwid, Fashohah & Kelancaran
  weight NUMERIC NOT NULL DEFAULT 30, -- percentage e.g. 30 = 30%
  max_score NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Competition Judges Table
CREATE TABLE IF NOT EXISTS public.competition_judges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  judge_name TEXT NOT NULL,
  status TEXT DEFAULT 'CONFIRMED', -- ASSIGNED, CONFIRMED, MISSING
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_id, judge_id)
);

-- 3. Scores Table (Score Submission & Locking)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES public.criteria(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0),
  notes TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  UNIQUE(competition_id, participant_id, judge_id, criterion_id)
);

-- 4. Competition Results Table
CREATE TABLE IF NOT EXISTS public.competition_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  total_score NUMERIC NOT NULL DEFAULT 0,
  rank INT DEFAULT 0,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, FINAL, PUBLISHED
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_id, participant_id)
);

-- 5. Venues Table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  capacity INT DEFAULT 100,
  status TEXT DEFAULT 'AVAILABLE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'SCHEDULED', -- SCHEDULED, RUNNING, FINISHED, CANCELLED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_criteria_comp ON public.criteria(competition_id);
CREATE INDEX IF NOT EXISTS idx_comp_judges ON public.competition_judges(competition_id, judge_id);
CREATE INDEX IF NOT EXISTS idx_scores_lookup ON public.scores(competition_id, participant_id, judge_id);
CREATE INDEX IF NOT EXISTS idx_schedules_time ON public.schedules(venue_id, start_time, end_time);

-- Enable RLS
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- RLS Enforcement: Score locking rule (Locked scores CANNOT be updated except by authorized admin)
CREATE POLICY "Public Read Criteria" ON public.criteria FOR SELECT USING (true);
CREATE POLICY "Member Manage Criteria" ON public.criteria FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Judges Access Scores" ON public.scores FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Judge Insert Score" ON public.scores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Judge Update Unlocked Score" ON public.scores FOR UPDATE USING (is_locked = false OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Member Read Schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Member Manage Schedules" ON public.schedules FOR ALL USING (auth.uid() IS NOT NULL);

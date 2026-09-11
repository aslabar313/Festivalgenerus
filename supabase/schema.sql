-- SQL Migration Schema for Festival Generus SaaS in Supabase

-- 1. Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'panitia', 'juri', 'peserta');
CREATE TYPE event_status AS ENUM ('draft', 'open', 'ongoing', 'completed');
CREATE TYPE reg_status AS ENUM ('pending', 'verified', 'rejected');

-- 2. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'peserta',
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  status event_status DEFAULT 'open',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_age TEXT NOT NULL,
  max_participants INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Participants Table
CREATE TABLE public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  registered_by UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender CHAR(1) CHECK (gender IN ('L', 'P')),
  group_name TEXT NOT NULL,
  registration_status reg_status DEFAULT 'pending',
  score_total NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Scores Table (Juri Inputs)
CREATE TABLE public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  juri_id UUID REFERENCES public.profiles(id),
  criterion_1 NUMERIC DEFAULT 0,
  criterion_2 NUMERIC DEFAULT 0,
  criterion_3 NUMERIC DEFAULT 0,
  total_score NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Public READ for Events & Categories
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

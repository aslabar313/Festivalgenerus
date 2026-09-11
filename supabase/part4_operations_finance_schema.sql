-- FESTIVAL GENERUS 2026 - PART 4 OPERATIONS, INCIDENTS, FINANCE & DOCUMENTS SCHEMA

-- 1. Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
  location TEXT,
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inventory / Logistics Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Peralatan',
  quantity INT DEFAULT 1,
  available_quantity INT DEFAULT 1,
  condition TEXT DEFAULT 'GOOD',
  location TEXT,
  pic TEXT,
  status TEXT DEFAULT 'READY', -- READY, BORROWED, DAMAGED, MISSING, RETURNED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Finance Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category TEXT NOT NULL, -- Registration, Sponsor, Donation, Consumption, Equipment, Venue, Documentation, Transportation, Other
  amount NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  proof_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Documents Management Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Proposal, Surat, Juknis, Rundown, Participant List, Judge List, LPJ, Certificate
  file_url TEXT NOT NULL,
  version TEXT DEFAULT 'v1.0',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Enforcement for Finance (Restricted to Bendahara & Admin roles only!)
CREATE POLICY "Public Member Incidents" ON public.incidents FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Public Member Inventory" ON public.inventory FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Bendahara and Admin Finance Read" ON public.transactions FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'bendahara'))
);
CREATE POLICY "Bendahara and Admin Finance Insert" ON public.transactions FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'bendahara'))
);
CREATE POLICY "Bendahara and Admin Finance Update" ON public.transactions FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'bendahara'))
);

CREATE POLICY "Public Read Documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Member Upload Documents" ON public.documents FOR ALL USING (auth.uid() IS NOT NULL);

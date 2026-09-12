-- ============================================================================
-- FESTIVAL GENERUS 2026 - SEED 5 AKUN UTAMA & TRIGGER AUTH PROFILES (FIXED)
-- ============================================================================
-- Menambahkan 5 akun utama: superadmin, wakilketua, sekretaris, bendahara, timacara
-- Semua akun menggunakan password: ppgmagtim123
-- Organisasi: PPG Magetan Timur
-- ============================================================================

-- 1. Buat extension pgcrypto jika belum ada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Buat Fungsi & Trigger Otomatis Sync Profile saat User Mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role_str TEXT;
  v_user_role user_role;
BEGIN
  v_role_str := COALESCE(NEW.raw_user_meta_data->>'role', 'panitia');
  
  -- Konversi aman ke Enum user_role yang valid ('admin', 'panitia', 'juri', 'peserta')
  IF v_role_str IN ('admin', 'panitia', 'juri', 'peserta') THEN
    v_user_role := v_role_str::user_role;
  ELSE
    v_user_role := 'panitia'::user_role;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, organization)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    v_user_role,
    COALESCE(NEW.raw_user_meta_data->>'organization', 'PPG Magetan Timur')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    organization = EXCLUDED.organization;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fungsi Helper untuk Insert 5 Akun Utama ke auth.users, public.profiles, & public.event_members
DO $$
DECLARE
  v_event_id UUID;
  v_user_id UUID;
  v_encrypted_pw TEXT;
  v_assigned_role user_role;
  r RECORD;
  v_accounts JSONB := '[
    {
      "username": "superadmin",
      "email": "superadmin@festivalgenerus.internal",
      "full_name": "Super Admin PPG",
      "role": "admin",
      "committee_role": "ketua",
      "organization": "PPG Magetan Timur"
    },
    {
      "username": "wakilketua",
      "email": "wakilketua@festivalgenerus.internal",
      "full_name": "Wakil Ketua Panitia",
      "role": "admin",
      "committee_role": "ketua",
      "organization": "PPG Magetan Timur"
    },
    {
      "username": "sekretaris",
      "email": "sekretaris@festivalgenerus.internal",
      "full_name": "Sekretaris Utama",
      "role": "panitia",
      "committee_role": "sekretaris",
      "organization": "PPG Magetan Timur"
    },
    {
      "username": "bendahara",
      "email": "bendahara@festivalgenerus.internal",
      "full_name": "Bendahara Utama",
      "role": "panitia",
      "committee_role": "bendahara",
      "organization": "PPG Magetan Timur"
    },
    {
      "username": "timacara",
      "email": "timacara@festivalgenerus.internal",
      "full_name": "Tim Divisi Acara",
      "role": "panitia",
      "committee_role": "koordinator",
      "organization": "PPG Magetan Timur"
    }
  ]'::jsonb;
BEGIN
  -- Dapatkan ID event utama (jika ada), atau buat default UUID valid
  SELECT id INTO v_event_id FROM public.events LIMIT 1;
  IF v_event_id IS NULL THEN
    v_event_id := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;
  END IF;

  -- Hash password ppgmagtim123 dengan blowfish
  v_encrypted_pw := extensions.crypt('ppgmagtim123', extensions.gen_salt('bf'));

  FOR r IN SELECT * FROM jsonb_to_recordset(v_accounts) AS x(
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    committee_role TEXT,
    organization TEXT
  )
  LOOP
    -- Pemetaan aman ke Enum user_role
    IF r.role IN ('admin', 'panitia', 'juri', 'peserta') THEN
      v_assigned_role := r.role::user_role;
    ELSE
      v_assigned_role := 'panitia'::user_role;
    END IF;

    -- Cek apakah user sudah ada berdasarkan email
    SELECT id INTO v_user_id FROM auth.users WHERE email = r.email;

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      
      -- Insert ke auth.users
      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        r.email,
        v_encrypted_pw,
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'username', r.username,
          'full_name', r.full_name,
          'role', r.role,
          'organization', r.organization
        ),
        NOW(),
        NOW()
      );

      -- Insert ke auth.identities
      INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', r.email),
        'email',
        NOW(),
        NOW(),
        NOW()
      );
    ELSE
      -- Jika user sudah ada, update password-nya ke ppgmagtim123
      UPDATE auth.users 
      SET encrypted_password = v_encrypted_pw,
          updated_at = NOW()
      WHERE id = v_user_id;
    END IF;

    -- Upsert ke public.profiles
    INSERT INTO public.profiles (id, email, full_name, role, organization)
    VALUES (v_user_id, r.email, r.full_name, v_assigned_role, r.organization)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      organization = EXCLUDED.organization;

    -- Upsert ke public.event_members jika tabel tersedia
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'event_members') THEN
      IF EXISTS (SELECT FROM pg_type WHERE typname = 'committee_role') THEN
        INSERT INTO public.event_members (event_id, user_id, name, email, role, status)
        VALUES (v_event_id, v_user_id, r.full_name, r.email, r.committee_role::committee_role, 'ACTIVE')
        ON CONFLICT (event_id, user_id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role;
      END IF;
    END IF;

  END LOOP;
END $$;

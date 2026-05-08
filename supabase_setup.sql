-- ==============================================================================
-- MIND-BRIDGE SUPABASE DATABASE SCHEMA
-- Silakan copy seluruh teks di file ini dan jalankan di SQL Editor Supabase Anda
-- ==============================================================================

-- 1. Buat Tabel Users (Siswa & Guru BK)
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('siswa', 'guru')),
  nis TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  class TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel Sessions (Riwayat Sesi Chat)
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  raw_chat JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buat Tabel Summaries (Ringkasan AI untuk Guru BK)
CREATE TABLE public.summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('senang', 'sedih', 'marah', 'cemas', 'biasa')),
  risk_flag TEXT NOT NULL CHECK (risk_flag IN ('normal', 'perlu_perhatian', 'darurat')),
  risk_reason TEXT,
  daily_condition TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) — WAJIB DIJALANKAN
-- Melindungi data siswa dari akses anon key langsung
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Blokir semua akses anon langsung
CREATE POLICY "Blokir akses anon ke users" ON public.users FOR ALL USING (false);
CREATE POLICY "Blokir akses anon ke sessions" ON public.sessions FOR ALL USING (false);
CREATE POLICY "Blokir akses anon ke summaries" ON public.summaries FOR ALL USING (false);

-- Izinkan akses penuh via service_role (untuk admin client)
CREATE POLICY "Izinkan service_role akses users" ON public.users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Izinkan service_role akses sessions" ON public.sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Izinkan service_role akses summaries" ON public.summaries FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- DATABASE FUNCTIONS (RPC)
-- ==============================================================================

/**
 * Menambahkan pesan baru ke array raw_chat secara atomik.
 * Digunakan untuk mencegah race condition saat beberapa pesan dikirim bersamaan.
 */
CREATE OR REPLACE FUNCTION append_chat_messages(p_session_id UUID, p_new_messages JSONB)
RETURNS VOID AS $$
BEGIN
  UPDATE public.sessions
  SET raw_chat = raw_chat || p_new_messages
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- INSERT DUMMY DATA (Akun untuk Login Uji Coba)
-- ==============================================================================

-- Password untuk akun dummy sudah di-hash menggunakan bcrypt.

-- Masukkan Guru BK (Email: guru@sekolah.com | Password: guru123)
INSERT INTO public.users (id, name, role, email, password_hash)
VALUES (
  '12789099-903f-4514-86f3-2d761a50981e', 
  'Budi Santoso', 
  'guru', 
  'guru@sekolah.com', 
  '$2b$10$FwJr2yQYEYsc4WJJY7t59OQnF3.1nJH/7DkWF86BLMLPnR48apyl6'
);

-- Masukkan Siswa 1 (NIS: 12345 | Password: siswa123)
INSERT INTO public.users (id, name, role, nis, class, password_hash)
VALUES (
  '123e4567-4a31-4f06-aa6a-ff9393c01088', 
  'Andi Pratama', 
  'siswa', 
  '12345', 
  'XI IPA 1', 
  '$2b$10$F/4Tv3vuicbvg/7swu6snOZeMPvseS8hZwjy0gmsjEZBRWt/uvBpa'
);

-- Masukkan Siswa 2 (NIS: 12346 | Password: siswa123)
INSERT INTO public.users (id, name, role, nis, class, password_hash)
VALUES (
  '54a5b678-1234-4567-89ab-1234567890ab', 
  'Siti Aminah', 
  'siswa', 
  '12346', 
  'XI IPS 2', 
  '$2b$10$F/4Tv3vuicbvg/7swu6snOZeMPvseS8hZwjy0gmsjEZBRWt/uvBpa'
);

-- ==============================================================================
-- MENGHAPUS DUMMY BYPASS DI KODE NEXT.JS
-- Setelah menjalankan script ini di Supabase, hapus kode dummy bypass di file:
-- 1. `lib/auth.ts` (Hapus pengecekan manual DUMMY LOGIN)
-- 2. `lib/supabase.ts` (Hapus try..catch mock data di fungsi fetch)
-- ==============================================================================

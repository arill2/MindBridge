# 🌉 MindBridge
> Platform AI Screening Kesehatan Mental Remaja — Menghubungkan siswa, orang tua, dan guru BK dalam satu ekosistem yang hangat & aman.

---

## 📌 Deskripsi Proyek

MindBridge adalah web app berbasis AI yang membantu remaja mengekspresikan perasaan mereka melalui sesi chat 5 menit. Hasil percakapan diringkas oleh AI dan dikirim ke dashboard Guru BK untuk ditindaklanjuti. Platform ini dirancang untuk lomba hackathon dengan fokus pada kesehatan mental remaja di lingkungan sekolah.

---

## 🎯 Target Pengguna

| Role | Deskripsi |
|------|-----------|
| **Siswa** | Remaja SMP/SMA yang ingin curhat & mengekspresikan perasaan |
| **Guru BK** | Konselor sekolah yang memantau kondisi mental siswa |

---

## ✨ Fitur Utama

### Panel Siswa
- Login menggunakan NIS + password
- Sesi chat AI selama **5 menit** dengan AI companion "Milo"
- AI merespons dengan empati dan hangat
- Setelah 5 menit, AI otomatis membuat ringkasan
- Ringkasan otomatis terkirim ke dashboard Guru BK

### Panel Guru BK
- Login dengan kredensial khusus guru
- Dashboard ringkasan semua siswa
- Informasi per siswa: mood hari ini, ringkasan cerita, kondisi hari-hari, flag risiko
- Kelola data siswa (tambah, edit, hapus akun siswa)
- Notifikasi Webhook otomatis 🚨 jika AI mendeteksi konten berisiko tinggi (Darurat)

---

## 🗺️ Alur Aplikasi

```
[LOGIN]
   ↓
   ├── Kredensial Siswa  → [PANEL SISWA]
   │                           ↓
   │                     Mulai Sesi Chat (Timer 5 menit)
   │                           ↓
   │                     Siswa curhat bebas ke AI
   │                           ↓
   │                     Timer habis → AI auto-summarize
   │                           ↓
   │                     Ringkasan terkirim ke Guru BK & Evaluasi Darurat
   │
   └── Kredensial Guru   → [PANEL GURU BK]
                                ↓
                          Lihat daftar ringkasan siswa
                                ↓
                          Baca detail: mood, cerita, risiko
                                ↓
                          Kelola data siswa (CRUD)
```

---

## 🛠️ Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Frontend + Backend** | Next.js 14 (App Router) | Full-stack, SSR/SSG, File-based routing |
| **Styling** | Tailwind CSS + Neubrutalism | UI modern, cepat, utilitas CSS responsif |
| **Auth** | NextAuth.js | Simple, aman (JWT cookies), role-based auth |
| **Database** | Supabase (PostgreSQL) | Gratis, realtime, RLS strict mode |
| **AI** | Groq API | Kecepatan inferensi super cepat, murah |
| **Node.js** | `>= 20.0.0` | Standar runtime modern (ditetapkan di package.json) |

---

## 🗃️ Skema Database (Supabase)

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary key |
| name | text | Nama lengkap |
| role | text | `siswa` atau `guru` |
| nis | text | NIS siswa (null jika guru) |
| email | text | Email (opsional) |
| password_hash | text | Password ter-hash |
| class | text | Kelas siswa (null jika guru) |
| created_at | timestamp | Waktu dibuat |

### Tabel `sessions`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary key |
| student_id | uuid | Foreign key → users.id |
| started_at | timestamp | Waktu mulai sesi |
| ended_at | timestamp | Waktu selesai sesi |
| raw_chat | jsonb | Seluruh isi percakapan |

### Tabel `summaries`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key → sessions.id |
| student_id | uuid | Foreign key → users.id |
| mood | text | Mood terdeteksi (happy/sad/anxious/angry) |
| summary_text | text | Ringkasan AI dari percakapan |
| risk_flag | text | `normal` / `perlu_perhatian` / `darurat` |
| risk_reason | text | Penjelasan mengapa siswa di-flag darurat |
| sent_at | timestamp | Waktu ringkasan dikirim |

---

## 📁 Struktur Folder

```
mindbridge/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Google Fonts, Metadata)
│   ├── not-found.tsx             # Halaman Kustom Error 404
│   ├── error.tsx                 # Halaman Kustom Error 500 Boundary
│   ├── page.tsx                  # Redirect ke /login
│   │
│   ├── login/                    # Halaman login (siswa & guru)
│   ├── privacy/                  # Halaman Kebijakan Privasi
│   ├── terms/                    # Halaman Syarat dan Ketentuan
│   │
│   ├── siswa/
│   │   └── chat/                 # Panel siswa — chat + timer 5 menit
│   │
│   └── guru/
│       ├── dashboard/            # Dashboard guru BK — list ringkasan
│       ├── darurat/              # Notifikasi dan log darurat
│       ├── siswa/[id]/           # Detail laporan per siswa
│       └── kelola/               # CRUD data siswa (Responsive Layout)
│
├── components/                   # Reusable UI components
│   ├── GuruSidebar.tsx           # Navigasi Guru
│   ├── AnimatedWrapper.tsx       # Helper GSAP / animasi fade
│   └── LoadingSpinner.tsx        # UI loader status
│
├── lib/                          # Utility & config
│   ├── supabase.ts               # Supabase client & fungsi data
│   ├── groq.ts                   # Groq API client + prompt engineering
│   ├── auth.ts                   # NextAuth credentials provider
│   └── notifications.ts          # Integrasi Notifikasi Webhook Darurat
│
├── api/                          # API Routes (Next.js)
│   ├── auth/[...nextauth]/       # NextAuth handler
│   ├── chat/                     # Endpoint chat ke Groq AI (dilindungi RLS auth)
│   ├── summarize/                # Endpoint summarize + kirim Webhook
│   └── students/                 # CRUD siswa (guru only)
```

---

## 🔐 Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# NextAuth
NEXTAUTH_SECRET=your_random_secret_minimum_32_chars
NEXTAUTH_URL=http://localhost:3000

# Integrasi Notifikasi Webhook (Opsional tapi Direkomendasikan)
WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Clone repo
git clone https://github.com/arill2/mindbridge.git
cd mindbridge

# 2. Install dependencies (Pastikan Node.js >= 20.0.0)
npm install

# 3. Setup environment variables
cp .env.example .env.local
# isi .env.local dengan kredensial kamu

# 4. Jalankan development server
npm run dev

# 5. Buka browser di http://localhost:3000
```

---

## 🎨 Branding & Desain (Neubrutalism)

| Elemen | Detail |
|--------|--------|
| **Nama** | MindBridge |
| **Tagline** | "Ceritamu Aman di Sini" |
| **Warna Utama** | Sunrise Orange `#FF6B2C` |
| **Warna Aksen** | Sunny Yellow `#FFD23F` |
| **Font Display** | Newsreader (serif) |
| **Font Body** | Be Vietnam Pro (sans-serif) |
| **Optimasi UI** | *Fluid Containers*, `next/image` SVG optimization |
| **AI Companion** | Milo 🌤️ |

---

## 👥 Kesiapan Produksi (Security & Observability)

Aplikasi telah diperkuat untuk mencegah kerentanan yang umum dijumpai di ranah kesehatan mental:
- **Kepatuhan Legalitas**: Memiliki *Terms of Service* dan *Privacy Policy*.
- **Row Level Security (RLS)**: Diaktifkan secara ketat pada Supabase. Pengambilan data melewati API menggunakan *Service Role* yang selalu memvalidasi ID dan Role pengguna.
- **Cross-Session Scripting Prevention**: Akses riwayat chat diverifikasi dan tidak dapat diakses (diringkas maupun ditambah) oleh siswa dari sesi/orang lain.
- **Webhook Notifikasi Krisis**: Guru BK secara proaktif diberitahu melalui Discord/Slack jika ringkasan menghasilkan *risk flag* `darurat`.

---

## ⚠️ Disclaimer

MindBridge adalah alat **screening awal**, bukan pengganti konsultasi psikolog profesional. Platform ini bertujuan membantu guru BK mendeteksi siswa yang membutuhkan perhatian lebih, bukan untuk diagnosis klinis.

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan edukasi dan lomba.

---

<div align="center">
  Dibuat dengan 🧡 untuk kesehatan mental remaja Indonesia<br>
  <strong>MindBridge — Hackathon 2026</strong>
</div>

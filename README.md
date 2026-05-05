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
- Flag otomatis 🚨 jika AI mendeteksi konten berisiko tinggi

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
   │                     Ringkasan terkirim ke Guru BK
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
| **Frontend + Backend** | Next.js 14 (App Router) | Full-stack, cocok deploy ke Vercel |
| **Styling** | Tailwind CSS | Cepat, utility-first |
| **Auth** | NextAuth.js | Simple, support role-based auth |
| **Database** | Supabase (PostgreSQL) | Gratis, realtime, mudah disetup |
| **AI** | Groq API | Cepat, murah, token efisien |
| **Deploy** | Vercel | 1 klik deploy, gratis |

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
| sent_at | timestamp | Waktu ringkasan dikirim |

---

## 📁 Struktur Folder

```
mindbridge/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata)
│   ├── page.tsx                  # Redirect ke /login
│   │
│   ├── login/
│   │   └── page.tsx              # Halaman login (siswa & guru)
│   │
│   ├── siswa/
│   │   └── chat/
│   │       └── page.tsx          # Panel siswa — chat + timer 5 menit
│   │
│   └── guru/
│       ├── dashboard/
│       │   └── page.tsx          # Dashboard guru BK — list ringkasan
│       ├── siswa/
│       │   └── [id]/
│       │       └── page.tsx      # Detail laporan per siswa
│       └── kelola/
│           └── page.tsx          # CRUD data siswa
│
├── components/                   # Reusable UI components
│   ├── ChatBubble.tsx            # Komponen bubble chat
│   ├── Timer.tsx                 # Komponen countdown timer 5 menit
│   ├── SummaryCard.tsx           # Kartu ringkasan siswa
│   ├── RiskBadge.tsx             # Badge indikator risiko
│   ├── MoodIndicator.tsx         # Visual mood siswa
│   └── StudentForm.tsx           # Form tambah/edit siswa
│
├── lib/                          # Utility & config
│   ├── supabase.ts               # Supabase client setup
│   ├── groq.ts                   # Groq API client + prompt
│   ├── auth.ts                   # NextAuth config & role handler
│   └── utils.ts                  # Helper functions
│
├── api/                          # API Routes (Next.js)
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          # NextAuth handler
│   ├── chat/
│   │   └── route.ts              # Endpoint chat ke Groq AI
│   ├── summarize/
│   │   └── route.ts              # Endpoint summarize + kirim ke DB
│   └── students/
│       └── route.ts              # CRUD siswa (guru only)
│
├── types/                        # TypeScript types
│   └── index.ts                  # User, Session, Summary types
│
├── public/                       # Static assets
│   └── logo.svg                  # Logo MindBridge
│
├── styles/
│   └── globals.css               # Tailwind base styles
│
├── .env.local                    # Environment variables (jangan di-commit!)
├── .env.example                  # Template env variables
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
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

# NextAuth
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Clone repo
git clone https://github.com/username/mindbridge.git
cd mindbridge

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# isi .env.local dengan kredensial kamu

# 4. Jalankan development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

---

## ☁️ Deploy ke Vercel

```bash
# 1. Push ke GitHub
git push origin main

# 2. Import repo di vercel.com
# 3. Tambahkan semua environment variables di Vercel dashboard
# 4. Deploy otomatis setiap push ke main ✅
```

---

## 🤖 Prompt AI (Groq)

### Prompt Chat (Milo — AI Companion)
```
Kamu adalah Milo, teman curhat AI yang hangat dan empati untuk remaja Indonesia.
Gunakan bahasa yang santai, tidak menghakimi, dan suportif.
Jangan memberikan diagnosis. Ajukan pertanyaan lembut untuk menggali perasaan siswa.
Maksimal respons 2-3 kalimat agar percakapan tetap mengalir.
```

### Prompt Summarize (setelah 5 menit)
```
Berdasarkan percakapan berikut, buat ringkasan dalam format JSON:
{
  "mood": "(happy/sad/anxious/angry/neutral)",
  "summary": "(ringkasan 2-3 kalimat tentang perasaan dan kondisi siswa)",
  "daily_condition": "(gambaran kondisi hari-hari siswa dari cerita)",
  "risk_flag": "(normal/perlu_perhatian/darurat)",
  "risk_reason": "(alasan jika bukan normal, kosong jika normal)"
}
Gunakan bahasa Indonesia. Objektif dan profesional untuk dibaca Guru BK.
```

---

## 🎨 Branding

| Elemen | Detail |
|--------|--------|
| **Nama** | MindBridge |
| **Tagline** | "Ceritamu Aman di Sini" |
| **Warna Utama** | Sunrise Orange `#FF6B2C` |
| **Warna Aksen** | Sunny Yellow `#FFD23F` |
| **Font Display** | Fraunces (serif) |
| **Font Body** | Nunito (sans-serif) |
| **AI Companion** | Milo 🌤️ |

---

## 👥 Fitur per Role

### Siswa
- [x] Login dengan NIS + password
- [x] Chat bebas dengan AI Milo selama 5 menit
- [x] Lihat ringkasan otomatis setelah sesi
- [x] Riwayat sesi sebelumnya

### Guru BK
- [x] Login dengan email + password
- [x] Dashboard semua ringkasan siswa
- [x] Detail laporan per siswa (mood, ringkasan, risiko)
- [x] Tambah / edit / hapus akun siswa
- [x] Notifikasi 🚨 jika ada siswa dengan flag darurat

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

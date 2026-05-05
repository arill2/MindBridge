import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sesi Selesai - MindBridge" };

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

const moodMessages: Record<string, { emoji: string; title: string; desc: string }> = {
  senang: { emoji: "😊", title: "Senang Mendengarnya!", desc: "Pertahankan energi positifmu hari ini. Milo ikut senang!" },
  sedih: { emoji: "😢", title: "Tidak Apa-Apa Bersedih", desc: "Menangis atau bersedih itu wajar. Kamu sudah sangat kuat." },
  marah: { emoji: "😠", title: "Tarik Napas Pelan-Pelan", desc: "Marah itu manusiawi. Coba minum air putih dan tenangkan dirimu ya." },
  cemas: { emoji: "😰", title: "Kamu Aman Di Sini", desc: "Kecemasanmu valid. Jangan lupa ambil napas dalam-dalam." },
  biasa: { emoji: "😐", title: "Hari Yang Tenang", desc: "Semoga hari ini berjalan lancar untukmu. Jangan lupa istirahat." },
  neutral: { emoji: "😐", title: "Hari Yang Tenang", desc: "Semoga hari ini berjalan lancar untukmu. Jangan lupa istirahat." },
  happy: { emoji: "😊", title: "Senang Mendengarnya!", desc: "Pertahankan energi positifmu hari ini. Milo ikut senang!" },
  sad: { emoji: "😢", title: "Tidak Apa-Apa Bersedih", desc: "Menangis atau bersedih itu wajar. Kamu sudah sangat kuat." },
  anxious: { emoji: "😰", title: "Kamu Aman Di Sini", desc: "Kecemasanmu valid. Jangan lupa ambil napas dalam-dalam." },
  angry: { emoji: "😠", title: "Tarik Napas Pelan-Pelan", desc: "Marah itu manusiawi. Coba minum air putih dan tenangkan dirimu ya." },
};

export default async function RingkasanPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") redirect("/login");

  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id;

  if (!sessionId) {
    redirect("/siswa");
  }

  // Fetch ringkasan untuk mengambil mood
  const { data: summary } = await supabase
    .from("summaries")
    .select("mood")
    .eq("session_id", sessionId)
    .single();

  const moodKey = summary?.mood || "biasa";
  const moodData = moodMessages[moodKey] || moodMessages.biasa;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FFF8F6",
      fontFamily: FONT,
      padding: "24px",
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: "32px",
        padding: "48px 40px",
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(255,107,44,0.12)",
        border: "1px solid #FFE9E2",
      }}>
        {/* Icon */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFD23F, #FFB800)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          margin: "0 auto 24px",
          boxShadow: "0 8px 32px rgba(255,210,63,0.4)",
        }}>
          🌟
        </div>

        <h1 style={{ fontFamily: HEADING, fontSize: "32px", fontWeight: 600, color: "#261813", margin: "0 0 12px 0", lineHeight: 1.2 }}>
          Sesi Selesai!
        </h1>
        <p style={{ fontSize: "15px", color: "#8D7167", margin: "0 0 32px 0", lineHeight: 1.6 }}>
          Terima kasih sudah berani jujur dan bercerita hari ini. Ingat, kamu selalu punya tempat yang aman di sini.
        </p>

        {/* Mood Card */}
        <div style={{
          background: "#FAFAFA",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #F3F4F6",
          marginBottom: "32px",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>{moodData.emoji}</div>
          <h2 style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813", margin: "0 0 8px 0" }}>
            {moodData.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#594139", margin: 0 }}>
            {moodData.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <Link href="/siswa" style={{
          display: "block",
          padding: "16px",
          borderRadius: "999px",
          background: "#FF6B2C",
          color: "#FFFFFF",
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(255,107,44,0.35)",
          transition: "transform 0.15s",
          marginBottom: "16px",
        }}>
          Kembali ke Beranda
        </Link>
        <Link href="/siswa/chat" style={{
          display: "block",
          padding: "16px",
          borderRadius: "999px",
          background: "#FFF8F6",
          color: "#FF6B2C",
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: 700,
          border: "1.5px solid #FF6B2C",
          transition: "background 0.15s",
        }}>
          Mulai Sesi Baru
        </Link>
      </div>
    </div>
  );
}

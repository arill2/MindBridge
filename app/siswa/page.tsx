"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { fetchApi } from "@/lib/utils";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

const GREETINGS = {
  morning: { text: "Selamat pagi", emoji: "🌅", sub: "Semoga harimu dimulai dengan penuh semangat!" },
  afternoon: { text: "Selamat siang", emoji: "☀️", sub: "Istirahat sejenak, ceritakan isi hatimu." },
  evening: { text: "Selamat sore", emoji: "🌤️", sub: "Bagaimana hari ini berjalan?" },
  night: { text: "Selamat malam", emoji: "🌙", sub: "Milo siap mendengarkanmu sebelum tidur." },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return GREETINGS.morning;
  if (h >= 12 && h < 15) return GREETINGS.afternoon;
  if (h >= 15 && h < 19) return GREETINGS.evening;
  return GREETINGS.night;
}

const TIPS = [
  { icon: "🌬️", title: "Tarik Napas", desc: "Napas dalam 4 hitungan, tahan 4, hembuskan 4. Ulangi 3 kali." },
  { icon: "🤲", title: "Grounding", desc: "Sebutkan 5 hal yang kamu lihat, 4 yang kamu sentuh, 3 yang kamu dengar." },
  { icon: "💧", title: "Minum Air", desc: "Segelas air putih bisa menurunkan hormon stres. Coba sekarang!" },
  { icon: "📝", title: "Tulis Perasaanmu", desc: "Menuliskan emosi membantu otak memprosesnya dengan lebih baik." },
];

const PROMISES = [
  { icon: "🔒", text: "Rahasiamu aman", desc: "Tidak ada yang akan dibagikan tanpa izinmu." },
  { icon: "💙", text: "Tanpa penghakiman", desc: "Milo hadir untuk mendengar, bukan menilai." },
  { icon: "🤝", text: "Guru BK siap membantu", desc: "Ringkasan anonim dikirim ke konselor terpercaya." },
  { icon: "⏱️", text: "Hanya 5 menit", desc: "Cukup 5 menit untuk meringankan beban pikiranmu." },
];

export default function SiswaDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState(GREETINGS.morning);
  const [activeTip, setActiveTip] = useState(0);
  const [showBullyModal, setShowBullyModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setActiveTip((t) => (t + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user.role !== "siswa") {
      router.push("/guru/dashboard");
    }
  }, [status, session, router]);

  const handleReportBullying = async () => {
    setIsReporting(true);
    const { data, error } = await fetchApi("/api/siswa/report-bullying", {
      method: "POST",
    });
    setIsReporting(false);
    setShowBullyModal(false);
    if (!error) {
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 5000);
    } else {
      alert("Gagal mengirim laporan. Silakan coba lagi atau hubungi guru secara langsung.");
    }
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F6", fontFamily: FONT }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", animation: "pulse 2s infinite", marginBottom: "16px" }}>🌤️</div>
          <p style={{ color: "#8D7167", fontSize: "15px" }}>Menyiapkan ruang yang aman untukmu…</p>
        </div>
      </div>
    );
  }

  const firstName = session?.user.name?.split(" ")[0] ?? "Kamu";

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>

      {/* ── TOP NAV ── */}
      <header style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #FFE9E2",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 16px rgba(255,107,44,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo webvvv.svg" alt="MindBridge Logo" style={{ height: "32px", objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#FF6B2C", color: "#FFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700,
            }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#261813" }}>{firstName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: "7px 16px",
              borderRadius: "999px",
              border: "1.5px solid #FFE9E2",
              background: "transparent",
              color: "#8D7167",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            🚪 Keluar
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── HERO GREETING ── */}
        <ScrollReveal animation="fade-in-up" delay={0} threshold={0}>
        <div style={{
          background: "linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)",
          borderRadius: "28px",
          padding: "40px 40px",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(255,107,44,0.30)",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-50px", right: "60px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: 500, margin: "0 0 6px 0" }}>
              {greeting.emoji} {greeting.text}
            </p>
            <h1 style={{ fontFamily: HEADING, fontSize: "32px", fontWeight: 600, color: "#FFFFFF", margin: "0 0 6px 0", lineHeight: 1.2 }}>
              Halo, {firstName}! 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", margin: "0 0 28px 0" }}>
              {greeting.sub}
            </p>

            {/* CTA Button */}
            <Link href="/siswa/chat" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "#FFFFFF",
              color: "#FF6B2C",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              transition: "transform 0.2s",
            }}>
              <span>💬</span> Mulai Cerita dengan Milo
              <span style={{ fontSize: "18px" }}>→</span>
            </Link>
          </div>
        </div>
        </ScrollReveal>

        {/* ── JANJI KEAMANAN ── */}
        <ScrollReveal animation="fade-in-up" delay={100}>
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontFamily: HEADING, fontSize: "22px", fontWeight: 600, color: "#261813", marginBottom: "6px" }}>
            Ruang yang Aman Untukmu 🛡️
          </h2>
          <p style={{ color: "#8D7167", fontSize: "14px", marginBottom: "20px", lineHeight: 1.6 }}>
            Sebelum kamu mulai bercerita, kami ingin kamu tahu bahwa ruang ini diciptakan khusus untukmu. Tidak ada tekanan, tidak ada penilaian.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {PROMISES.map((p) => (
              <div key={p.icon} style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                padding: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                boxShadow: "0 4px 16px rgba(255,107,44,0.07)",
                border: "1px solid #FFE9E2",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "#FFF8F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                }}>
                  {p.icon}
                </div>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "14px", color: "#261813" }}>{p.text}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8D7167", lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </ScrollReveal>

        {/* ── TENTANG MILO ── */}
        <ScrollReveal animation="fade-in-up" delay={200}>
        <section style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "28px 32px",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(255,107,44,0.08)",
          border: "1px solid #FFE9E2",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD23F, #FFB800)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(255,210,63,0.40)",
          }}>
            🌤️
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: HEADING, fontSize: "18px", fontWeight: 600, color: "#261813", margin: "0 0 6px 0" }}>
              Kenalan dengan Milo
            </h3>
            <p style={{ color: "#594139", fontSize: "14px", margin: "0 0 12px 0", lineHeight: 1.7 }}>
              Milo adalah teman AI yang selalu siap mendengarkan ceritamu. Dalam sesi 5 menit, Milo akan menemanimu dengan hangat tanpa menghakimi.
              Milo bukan dokter, tapi Milo adalah pendengar terbaik yang kamu punya hari ini.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Empatik 💛", "Rahasia 🔒", "Selalu ada 🌤️", "5 menit ⏱️"].map((tag) => (
                <span key={tag} style={{
                  padding: "4px 12px",
                  background: "#FFF8F6",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#FF6B2C",
                  border: "1px solid #FFE9E2",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ── TIPS RELAKSASI ── */}
        <ScrollReveal animation="fade-in-up" delay={300}>
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontFamily: HEADING, fontSize: "22px", fontWeight: 600, color: "#261813", marginBottom: "6px" }}>
            Tips Menenangkan Diri ✨
          </h2>
          <p style={{ color: "#8D7167", fontSize: "14px", marginBottom: "20px" }}>
            Belum siap bercerita? Coba beberapa teknik ini dulu.
          </p>

          {/* Active tip */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "12px",
            boxShadow: "0 4px 20px rgba(255,107,44,0.08)",
            border: "2px solid #FF6B2C",
            transition: "all 0.4s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "linear-gradient(135deg, #FFF8F6, #FFE9E2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px", flexShrink: 0,
              }}>
                {TIPS[activeTip].icon}
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "16px", color: "#261813" }}>
                  {TIPS[activeTip].title}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#594139", lineHeight: 1.6 }}>
                  {TIPS[activeTip].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Tip dots */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
            {TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTip(i)}
                style={{
                  width: i === activeTip ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: i === activeTip ? "#FF6B2C" : "#FFE9E2",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Other tips compact */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {TIPS.map((tip, i) => (
              <button
                key={i}
                onClick={() => setActiveTip(i)}
                style={{
                  background: i === activeTip ? "#FFF0E8" : "#FFFFFF",
                  border: `1.5px solid ${i === activeTip ? "#FF6B2C" : "#FFE9E2"}`,
                  borderRadius: "14px",
                  padding: "14px 10px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{tip.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: i === activeTip ? "#FF6B2C" : "#594139" }}>
                  {tip.title}
                </div>
              </button>
            ))}
          </div>
        </section>
        </ScrollReveal>
        
        {/* ── LAPOR PERUNDUNGAN (NEW) ── */}
        <ScrollReveal animation="fade-in-up" delay={350}>
          <section style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "32px",
            border: "2px solid #FECACA",
            boxShadow: "0 8px 30px rgba(220,38,38,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "#FFF0EE", color: "#DC2626",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>
              🚨
            </div>
            <div>
              <h3 style={{ fontFamily: HEADING, fontSize: "18px", fontWeight: 700, color: "#261813", margin: "0 0 6px 0" }}>
                Butuh Bantuan Mendesak?
              </h3>
              <p style={{ color: "#8D7167", fontSize: "14px", lineHeight: 1.6, margin: 0, maxWidth: "500px" }}>
                Jika kamu sedang mengalami perundungan (bullying) atau merasa tidak aman, klik tombol di bawah untuk segera memberi tahu Guru BK.
              </p>
            </div>
            <button
              onClick={() => setShowBullyModal(true)}
              style={{
                padding: "12px 24px",
                background: "#DC2626",
                color: "#FFFFFF",
                borderRadius: "999px",
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
                transition: "all 0.2s",
              }}
            >
              SAYA DI-BULLY (Minta Bantuan)
            </button>
            {reportSuccess && (
              <p style={{ margin: 0, fontSize: "13px", color: "#059669", fontWeight: 600 }}>
                ✅ Laporan berhasil dikirim. Guru BK akan segera membantumu.
              </p>
            )}
          </section>
        </ScrollReveal>

        {/* ── BOTTOM CTA ── */}
        <ScrollReveal animation="fade-in-up" delay={400}>
        <div style={{
          background: "linear-gradient(135deg, #FFF8F6 0%, #FFE9D9 100%)",
          borderRadius: "24px",
          padding: "32px",
          textAlign: "center",
          border: "1px solid #FFE9E2",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💛</div>
          <h3 style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813", margin: "0 0 8px 0" }}>
            Ceritamu Layak Untuk Didengar
          </h3>
          <p style={{ color: "#8D7167", fontSize: "14px", lineHeight: 1.7, margin: "0 0 24px 0" }}>
            Tidak ada perasaan yang terlalu kecil atau terlalu besar untuk diceritakan. Milo menunggumu.
          </p>
          <Link href="/siswa/chat" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px 36px",
            background: "#FF6B2C",
            color: "#FFFFFF",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(255,107,44,0.35)",
          }}>
            💬 Ayo Cerita dengan Milo →
          </Link>
        </div>
        </ScrollReveal>

      </main>

      {/* ── BULLY REPORT CONFIRMATION MODAL ── */}
      {showBullyModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(38,24,19,0.6)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: "28px", padding: "32px",
            width: "100%", maxWidth: "420px", textAlign: "center",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2)", border: "1px solid #FFE9E2"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚨</div>
            <h2 style={{ fontFamily: HEADING, fontSize: "24px", fontWeight: 700, color: "#261813", margin: "0 0 12px 0" }}>
              Kirim Laporan Bantuan?
            </h2>
            <p style={{ fontSize: "15px", color: "#8D7167", margin: "0 0 28px 0", lineHeight: 1.6 }}>
              Dengan menekan "Ya, Kirim", sistem akan langsung memberitahu Guru BK bahwa kamu membutuhkan bantuan terkait perundungan.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleReportBullying}
                disabled={isReporting}
                style={{
                  padding: "16px", borderRadius: "999px", background: "#DC2626", color: "#FFFFFF",
                  border: "none", fontSize: "15px", fontWeight: 700, cursor: isReporting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.3)", opacity: isReporting ? 0.7 : 1
                }}
              >
                {isReporting ? "Mengirim Laporan..." : "Ya, Kirim Laporan"}
              </button>
              <button
                onClick={() => setShowBullyModal(false)}
                disabled={isReporting}
                style={{
                  padding: "16px", borderRadius: "999px", background: "#FFF8F6", color: "#8D7167",
                  border: "1px solid #FFE9E2", fontSize: "15px", fontWeight: 600, cursor: isReporting ? "not-allowed" : "pointer",
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.08)} }
      `}</style>

    </div>
  );
}

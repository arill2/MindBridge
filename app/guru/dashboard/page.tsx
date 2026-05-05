import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLatestSummaries } from "@/lib/supabase";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import type { Metadata } from "next";
import { Summary } from "@/types";

export const metadata: Metadata = { title: "Dashboard Guru BK" };

// ─── Inline style helpers ────────────────────────────────────────────────────
function card(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 24px rgba(255,107,44,0.09)",
    ...extra,
  };
}

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

// ─── Mood & Risk helpers ─────────────────────────────────────────────────────
const moodLabel: Record<string, string> = {
  senang: "😊 Senang", sedih: "😢 Sedih", marah: "😠 Marah",
  cemas: "😰 Cemas", biasa: "😐 Biasa",
};
const riskStyle: Record<string, { bg: string; color: string; label: string }> = {
  normal:         { bg: "#EDFFF5", color: "#16A34A", label: "✅ Normal" },
  perlu_perhatian:{ bg: "#FFF8E1", color: "#D97706", label: "⚠️ Perlu Perhatian" },
  darurat:        { bg: "#FFF0EE", color: "#DC2626", label: "🚨 DARURAT" },
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default async function GuruDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") redirect("/login");

  const summaries = await getLatestSummaries(50);
  const daruratCount = summaries.filter((s) => s.risk_flag === "darurat").length;
  const perluCount   = summaries.filter((s) => s.risk_flag === "perlu_perhatian").length;
  const normalCount  = summaries.filter((s) => s.risk_flag === "normal").length;
  const daruratList  = summaries.filter((s) => s.risk_flag === "darurat");
  const guruName     = session.user.name || "Guru BK";
  const displayName  = guruName.split(" ").slice(0, 2).join(" ");

  const stats = [
    { label: "Total Sesi",       value: summaries.length, icon: "📊", bg: "#FFF8F6" },
    { label: "Kondisi Normal",   value: normalCount,       icon: "✅", bg: "#EDFFF5" },
    { label: "Perlu Perhatian",  value: perluCount,        icon: "⚠️", bg: "#FFF8E1" },
    { label: "DARURAT",          value: daruratCount,      icon: "🚨", bg: "#FFF0EE" },
  ];

  const navItems = [
    { href: "/guru/dashboard", icon: "📊", label: "Dashboard",    active: true  },
    { href: "/guru/kelola",    icon: "👥", label: "Kelola Siswa", active: false },
    { href: "/guru/laporan",   icon: "📋", label: "Laporan",      active: false },
    { href: "/guru/pengaturan",icon: "⚙️", label: "Pengaturan",   active: false },
  ];

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>

      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside style={{
        width: "240px",
        flexShrink: 0,
        background: "#FFFFFF",
        borderRight: "1px solid #FFE9E2",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 16px rgba(255,107,44,0.06)",
      }}>

        {/* Logo */}
        <div style={{ padding: "24px", borderBottom: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>🌉</span>
            <span style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813" }}>
              MindBridge
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: FONT,
                background: item.active ? "#FF6B2C" : "transparent",
                color: item.active ? "#FFFFFF" : "#594139",
                boxShadow: item.active ? "0 4px 14px rgba(255,107,44,0.28)" : "none",
                transition: "all 0.15s",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "#FF6B2C", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFF", fontSize: "13px",
              fontWeight: 700, flexShrink: 0,
            }}>
              {initials(guruName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#261813", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#8D7167" }}>Guru BK</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", maxWidth: "calc(100vw - 240px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: HEADING, fontSize: "28px", fontWeight: 600, color: "#261813", margin: 0, marginBottom: "4px" }}>
              Selamat Datang, {displayName} 👋
            </h1>
            <p style={{ color: "#8D7167", fontSize: "14px", margin: 0 }}>
              Pantau kondisi mental siswa hari ini
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: "#8D7167", margin: 0 }}>{dateStr}</p>
            {daruratCount > 0 && (
              <div style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ fontSize: "24px" }}>🔔</span>
                <span style={{
                  position: "absolute", top: "-4px", right: "-6px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#DC2626", color: "#FFF",
                  fontSize: "10px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {daruratCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ ...card(), background: s.bg }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontFamily: HEADING, fontSize: "32px", fontWeight: 600, color: "#261813", marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "12px", color: "#8D7167", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alert darurat */}
        {daruratCount > 0 && (
          <div style={{
            marginBottom: "24px",
            padding: "20px 24px",
            background: "#FFF0EE",
            borderLeft: "4px solid #DC2626",
            borderRadius: "0 16px 16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}>
            <div>
              <p style={{ margin: 0, marginBottom: "4px", fontWeight: 700, color: "#9B1C1C", fontSize: "15px" }}>
                🚨 {daruratCount} siswa membutuhkan perhatian segera!
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#C0392B" }}>
                {daruratList.map((s) => s.student?.name).join(", ")}
              </p>
            </div>
            <Link href="/guru/darurat" style={{
              padding: "10px 20px",
              background: "#DC2626",
              color: "#FFF",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: FONT,
            }}>
              Lihat Detail →
            </Link>
          </div>
        )}

        {/* Summary Cards */}
        <h2 style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813", marginBottom: "16px" }}>
          Ringkasan Sesi Terbaru
        </h2>

        {summaries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌤️</div>
            <p style={{ color: "#8D7167" }}>Belum ada sesi siswa hari ini</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
            {summaries.map((s: Summary) => {
              const risk = riskStyle[s.risk_flag] ?? riskStyle.normal;
              const student = s.student;
              const name = student?.name ?? "Siswa";
              return (
                <div key={s.id} style={card({ transition: "transform 0.15s" })}>
                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: "#FF6B2C", color: "#FFF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 700, flexShrink: 0,
                      }}>
                        {initials(name)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", fontFamily: HEADING, color: "#261813" }}>
                          {name}
                        </p>
                        {student?.class && (
                          <p style={{ margin: 0, fontSize: "12px", color: "#8D7167" }}>{student.class}</p>
                        )}
                      </div>
                    </div>
                    {/* Risk badge */}
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "999px",
                      background: risk.bg,
                      color: risk.color,
                      fontSize: "11px",
                      fontWeight: 700,
                      border: `1px solid ${risk.color}33`,
                      whiteSpace: "nowrap",
                    }}>
                      {risk.label}
                    </span>
                  </div>

                  {/* Mood */}
                  <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#8D7167" }}>
                    {moodLabel[s.mood] ?? s.mood}
                  </p>

                  {/* Summary text */}
                  <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#594139", lineHeight: 1.6 }}>
                    {s.summary_text.length > 120 ? s.summary_text.slice(0, 120) + "…" : s.summary_text}
                  </p>

                  {/* Risk reason */}
                  {s.risk_flag !== "normal" && s.risk_reason && (
                    <div style={{
                      padding: "8px 12px",
                      background: "#FFF8F6",
                      borderLeft: "3px solid #FF6B2C",
                      borderRadius: "0 10px 10px 0",
                      marginBottom: "10px",
                    }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "#8D7167", fontStyle: "italic" }}>
                        ⚠️ {s.risk_reason}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #FFE9E2" }}>
                    <span style={{ fontSize: "12px", color: "#C4A99A" }}>🕐 {timeAgo(s.sent_at)}</span>
                    {student?.id && (
                      <Link href={`/guru/siswa/${student.id}`} style={{
                        fontSize: "12px",
                        color: "#FF6B2C",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}>
                        Lihat Detail →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

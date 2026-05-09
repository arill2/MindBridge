import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAlertSummaries } from "@/lib/supabase";
import Link from "next/link";
import GuruSidebar from "@/components/GuruSidebar";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";
import type { Summary } from "@/types";
import DeleteSummaryButton from "@/components/DeleteSummaryButton";


export const metadata: Metadata = { title: "Siswa Perlu Perhatian - MindBridge" };

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

const moodLabel: Record<string, string> = {
  senang: "😊 Senang",
  sedih: "😢 Sedih",
  marah: "😠 Marah",
  cemas: "😰 Cemas",
  biasa: "😐 Biasa",
};

const riskConfig = {
  darurat: {
    bg: "#FFF0EE",
    border: "#FECACA",
    color: "#DC2626",
    badgeBg: "#FFF0EE",
    label: "🚨 DARURAT",
    headerBg: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    urgencyText: "Butuh tindakan segera",
  },
  perlu_perhatian: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    color: "#D97706",
    badgeBg: "#FFF8E1",
    label: "⚠️ Perlu Perhatian",
    headerBg: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    urgencyText: "Pantau lebih dekat",
  },
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

export default async function DaruratPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") redirect("/login");

  const guruName = session.user.name || "Guru BK";
  const alerts = await getAlertSummaries();

  const daruratList = alerts.filter((s) => s.risk_flag === "darurat");
  const perluList = alerts.filter((s) => s.risk_flag === "perlu_perhatian");

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      <GuruSidebar guruName={guruName} />

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className="alert-main" style={{ minHeight: "100vh" }}>
        <div className="alert-inner" style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>

          {/* Back Link */}
          <Link href="/guru/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#FF6B2C", textDecoration: "none", fontSize: 14,
            fontWeight: 600, marginBottom: 24,
          }}>
            ← Kembali ke Dashboard
          </Link>

          {/* Page Header */}
          <ScrollReveal animation="fade-in-up" delay={0} threshold={0}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{
                fontFamily: HEADING,
                fontSize: "clamp(22px, 4vw, 30px)",
                fontWeight: 600,
                color: "#261813",
                margin: "0 0 6px 0",
              }}>
                Siswa Perlu Perhatian
              </h1>
              <p style={{ color: "#8D7167", fontSize: 14, margin: 0 }}>
                Daftar siswa dengan kondisi mental yang membutuhkan tindak lanjut dari Guru BK
              </p>
            </div>
          </ScrollReveal>

          {/* Stats Row */}
          <ScrollReveal animation="fade-in-up" delay={50} threshold={0}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
              marginBottom: 28,
            }}>
              <div style={{
                background: "#FFF0EE", borderRadius: 16, padding: "16px 20px",
                border: "1px solid #FECACA",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🚨</div>
                <div style={{
                  fontFamily: HEADING, fontSize: 28, fontWeight: 700,
                  color: "#DC2626", lineHeight: 1,
                }}>{daruratList.length}</div>
                <div style={{ fontSize: 12, color: "#8D7167", marginTop: 4, fontWeight: 500 }}>Kondisi Darurat</div>
              </div>
              <div style={{
                background: "#FFFBEB", borderRadius: 16, padding: "16px 20px",
                border: "1px solid #FDE68A",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>⚠️</div>
                <div style={{
                  fontFamily: HEADING, fontSize: 28, fontWeight: 700,
                  color: "#D97706", lineHeight: 1,
                }}>{perluList.length}</div>
                <div style={{ fontSize: 12, color: "#8D7167", marginTop: 4, fontWeight: 500 }}>Perlu Perhatian</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Empty State */}
          {alerts.length === 0 && (
            <div style={{
              background: "#FFFFFF", borderRadius: 20, padding: "60px 24px",
              textAlign: "center", border: "2px dashed #FFE9E2",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌤️</div>
              <h2 style={{
                fontFamily: HEADING, fontSize: 22, fontWeight: 600,
                color: "#261813", margin: "0 0 8px 0",
              }}>
                Semua Siswa Kondisi Normal
              </h2>
              <p style={{ color: "#8D7167", margin: 0, fontSize: 15 }}>
                Tidak ada siswa yang membutuhkan perhatian khusus saat ini
              </p>
            </div>
          )}

          {/* ── DARURAT Section ── */}
          {daruratList.length > 0 && (
            <ScrollReveal animation="fade-in-up" delay={100}>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 4, height: 20, background: "#DC2626", borderRadius: 999,
                  }} />
                  <h2 style={{
                    fontFamily: HEADING, fontSize: 18, fontWeight: 600,
                    color: "#DC2626", margin: 0,
                  }}>
                    🚨 Kondisi Darurat ({daruratList.length} siswa)
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {daruratList.map((s) => (
                    <AlertCard key={s.id} summary={s} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ── PERLU PERHATIAN Section ── */}
          {perluList.length > 0 && (
            <ScrollReveal animation="fade-in-up" delay={200}>
              <div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 4, height: 20, background: "#D97706", borderRadius: 999,
                  }} />
                  <h2 style={{
                    fontFamily: HEADING, fontSize: 18, fontWeight: 600,
                    color: "#D97706", margin: 0,
                  }}>
                    ⚠️ Perlu Perhatian ({perluList.length} siswa)
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {perluList.map((s) => (
                    <AlertCard key={s.id} summary={s} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>

      <style>{`
        .alert-main {
          padding-top: 0;
        }
        .alert-inner {
          padding: 24px 16px 40px;
        }
        @media (min-width: 768px) {
          .alert-main {
            margin-left: 240px;
          }
          .alert-inner {
            padding: 40px;
          }
        }
      `}</style>
    </div>
  );
}

// ── Alert Card Component ────────────────────────────────────
function AlertCard({ summary: s }: { summary: Summary }) {
  const cfg = riskConfig[s.risk_flag as keyof typeof riskConfig] ?? riskConfig.perlu_perhatian;
  const name = s.student?.name ?? "Siswa";

  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 20,
      border: `1px solid ${cfg.border}`,
      overflow: "hidden",
      boxShadow: `0 4px 16px ${cfg.color}12`,
    }}>
      {/* Card Top Strip */}
      <div style={{
        background: cfg.headerBg,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFF", fontSize: 14, fontWeight: 700,
            flexShrink: 0, border: "2px solid rgba(255,255,255,0.4)",
          }}>
            {initials(name)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#FFF", fontSize: 15 }}>
              {name}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
              {s.student?.class ?? ""} {s.student?.nis ? `• NIS ${s.student.nis}` : ""}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "4px 10px", borderRadius: 999,
            background: "rgba(255,255,255,0.2)", color: "#FFF",
            fontSize: 12, fontWeight: 600,
          }}>
            {cfg.urgencyText}
          </span>
          <span style={{
            fontSize: 12, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap",
          }}>
            🕐 {timeAgo(s.sent_at)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Mood + Risk badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={{
            padding: "5px 12px", borderRadius: 999,
            background: "#F3F4F6", color: "#594139",
            fontSize: 12, fontWeight: 600,
          }}>
            {moodLabel[s.mood] ?? s.mood}
          </span>
          <span style={{
            padding: "5px 12px", borderRadius: 999,
            background: cfg.badgeBg, color: cfg.color,
            fontSize: 12, fontWeight: 700,
            border: `1px solid ${cfg.color}33`,
          }}>
            {cfg.label}
          </span>
          <DeleteSummaryButton summaryId={s.id} />
        </div>

        {/* Summary */}
        <div style={{
          background: "#FFF8F6", borderRadius: 12, padding: "12px 14px",
        }}>
          <p style={{
            margin: "0 0 5px 0", fontSize: 11, color: "#FF6B2C",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            Ringkasan AI
          </p>
          <p style={{
            margin: 0, fontSize: 13, color: "#261813", lineHeight: 1.65,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {s.summary_text}
          </p>
        </div>

        {/* Risk Reason */}
        {s.risk_reason && (
          <div style={{
            padding: "10px 14px", borderRadius: 12,
            background: cfg.bg, borderLeft: `3px solid ${cfg.color}`,
          }}>
            <p style={{
              margin: "0 0 4px 0", fontSize: 11, color: cfg.color,
              fontWeight: 700, textTransform: "uppercase",
            }}>
              ⚠️ Alasan Risiko
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#261813", lineHeight: 1.6 }}>
              {s.risk_reason}
            </p>
          </div>
        )}

        {/* Action Button */}
        {s.student?.id && (
          <div style={{ marginTop: 4 }}>
            <Link href={`/guru/siswa/${s.student.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 999,
              background: cfg.color, color: "#FFF",
              textDecoration: "none", fontSize: 13, fontWeight: 700,
              boxShadow: `0 4px 14px ${cfg.color}40`,
              transition: "opacity 0.15s",
            }}>
              Lihat Profil Lengkap →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getStudentById, getStudentSummaries } from "@/lib/supabase";
import Link from "next/link";
import GuruSidebar from "@/components/GuruSidebar";
import type { Metadata } from "next";
import DeleteSummaryButton from "@/components/DeleteSummaryButton";


export const metadata: Metadata = { title: "Detail Siswa - MindBridge" };

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

const moodLabel: Record<string, string> = {
  senang: "😊 Senang",
  sedih: "😢 Sedih",
  marah: "😠 Marah",
  cemas: "😰 Cemas",
  biasa: "😐 Biasa",
};

const riskStyle: Record<string, { bg: string; color: string; label: string }> = {
  normal: { bg: "#EDFFF5", color: "#16A34A", label: "✅ Normal" },
  perlu_perhatian: { bg: "#FFF8E1", color: "#D97706", label: "⚠️ Perlu Perhatian" },
  darurat: { bg: "#FFF0EE", color: "#DC2626", label: "🚨 DARURAT" },
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") redirect("/login");

  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const summaries = await getStudentSummaries(id);
  const guruName = session.user.name || "Guru BK";

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      {/* Sidebar (handles mobile burger + desktop sidebar) */}
      <GuruSidebar guruName={guruName} />

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className="guru-main" style={{ minHeight: "100vh" }}>
        <div className="guru-inner" style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>

          {/* Back Link */}
          <Link href="/guru/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#FF6B2C", textDecoration: "none", fontSize: 14,
            fontWeight: 600, marginBottom: 24,
            transition: "opacity 0.15s",
          }}>
            ← Kembali ke Dashboard
          </Link>

          {/* Student Profile Card */}
          <div style={{
            background: "linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)",
            borderRadius: 24,
            padding: "28px 24px",
            marginBottom: 28,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: 20,
            boxShadow: "0 16px 40px rgba(255,107,44,0.25)",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700,
              border: "3px solid rgba(255,255,255,0.4)",
              flexShrink: 0,
              fontFamily: HEADING,
            }}>
              {initials(student.name)}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontFamily: HEADING,
                fontSize: "clamp(20px, 5vw, 30px)",
                fontWeight: 700,
                margin: "0 0 8px 0",
                lineHeight: 1.2,
              }}>
                {student.name}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, opacity: 0.9 }}>
                <span>🆔 NIS: <strong>{student.nis}</strong></span>
                <span>🏫 Kelas: <strong>{student.class}</strong></span>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <h2 style={{
            fontFamily: HEADING,
            fontSize: "clamp(18px, 3vw, 22px)",
            fontWeight: 600,
            color: "#261813",
            marginBottom: 20,
          }}>
            Riwayat Konsultasi AI
          </h2>

          {/* Summaries List */}
          {summaries.length === 0 ? (
            <div style={{
              background: "#FFFFFF", borderRadius: 20,
              padding: "48px 24px", textAlign: "center",
              border: "2px dashed #FFE9E2",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌤️</div>
              <p style={{ color: "#8D7167", margin: 0, fontSize: 15 }}>
                Belum ada riwayat percakapan untuk siswa ini.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {summaries.map((s) => {
                const risk = riskStyle[s.risk_flag] || riskStyle.normal;
                return (
                  <div key={s.id} style={{
                    background: "#FFFFFF",
                    borderRadius: 20,
                    padding: "20px",
                    border: "1px solid #FFE9E2",
                    boxShadow: "0 2px 12px rgba(255,107,44,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}>
                    {/* Card Header: date + badges */}
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 12,
                    }}>
                      <div>
                        <p style={{
                          margin: "0 0 4px 0", fontSize: 11,
                          color: "#A89288", fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.5px",
                        }}>
                          Dibuat pada
                        </p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#261813" }}>
                          {formatDate(s.sent_at)}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span style={{
                          padding: "6px 12px", borderRadius: 999,
                          background: "#F3F4F6", fontSize: 12,
                          fontWeight: 600, color: "#594139",
                        }}>
                          {moodLabel[s.mood] || s.mood}
                        </span>
                        <span style={{
                          padding: "6px 12px", borderRadius: 999,
                          background: risk.bg, color: risk.color,
                          fontSize: 12, fontWeight: 700,
                          border: `1px solid ${risk.color}44`,
                        }}>
                          {risk.label}
                        </span>
                        <DeleteSummaryButton summaryId={s.id} />
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div style={{
                      background: "#FFF8F6", borderRadius: 14, padding: "14px 16px",
                    }}>
                      <p style={{
                        margin: "0 0 6px 0", fontSize: 11, color: "#FF6B2C",
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                      }}>
                        Ringkasan AI
                      </p>
                      <p style={{ margin: 0, fontSize: 14, color: "#261813", lineHeight: 1.65 }}>
                        {s.summary_text}
                      </p>
                    </div>

                    {/* Daily Condition */}
                    {s.daily_condition && (
                      <div>
                        <p style={{
                          margin: "0 0 6px 0", fontSize: 11, color: "#8D7167",
                          fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        }}>
                          Kondisi Harian
                        </p>
                        <p style={{ margin: 0, fontSize: 14, color: "#594139", lineHeight: 1.65 }}>
                          {s.daily_condition}
                        </p>
                      </div>
                    )}

                    {/* Risk Reason */}
                    {s.risk_reason && (
                      <div style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#FFF0EE",
                        borderLeft: "3px solid #DC2626",
                      }}>
                        <p style={{
                          margin: "0 0 4px 0", fontSize: 11, color: "#DC2626",
                          fontWeight: 700, textTransform: "uppercase",
                        }}>
                          ⚠️ Catatan Risiko
                        </p>
                        <p style={{ margin: 0, fontSize: 13, color: "#261813", lineHeight: 1.6 }}>
                          {s.risk_reason}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Responsive overrides */}
      <style>{`
        .guru-main {
          padding-top: 0;
        }
        .guru-inner {
          padding: 24px 16px 40px;
        }
        @media (min-width: 768px) {
          .guru-main {
            margin-left: 240px;
          }
          .guru-inner {
            padding: 40px;
          }
        }
      `}</style>
    </div>
  );
}

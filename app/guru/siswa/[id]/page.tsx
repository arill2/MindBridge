import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getStudentById, getStudentSummaries } from "@/lib/supabase";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import type { Metadata } from "next";

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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "#FFFFFF",
        borderRight: "1px solid #FFE9E2", display: "flex", flexDirection: "column",
        boxShadow: "2px 0 16px rgba(255,107,44,0.06)", zIndex: 10,
      }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>Bridge</span>
            <span style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813" }}>MindBridge</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <Link href="/guru/dashboard" style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
            borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
            background: "transparent", color: "#594139", transition: "all 0.15s",
          }}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/guru/kelola" style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
            borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
            background: "transparent", color: "#594139", transition: "all 0.15s",
          }}>
            <span>👥</span> Kelola Siswa
          </Link>
          <Link href="/guru/laporan" style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
            borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
            background: "transparent", color: "#594139", transition: "all 0.15s",
          }}>
            <span>📋</span> Laporan
          </Link>
          <Link href="/guru/pengaturan" style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
            borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
            background: "transparent", color: "#594139", transition: "all 0.15s",
          }}>
            <span>⚙️</span> Pengaturan
          </Link>
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%", background: "#FF6B2C",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFF", fontSize: "13px", fontWeight: 700, flexShrink: 0,
            }}>
              {initials(guruName)}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#261813" }}>{guruName}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#8D7167" }}>Guru BK</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {/* Back Link */}
        <Link href="/guru/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          textDecoration: "none", color: "#FF6B2C", fontSize: "14px", fontWeight: 600,
          marginBottom: "24px", transition: "all 0.15s"
        }}>
          ← Kembali ke Dashboard
        </Link>

        {/* Student Profile Card */}
        <div style={{
          background: "linear-gradient(135deg, #FF6B2C, #FF9A5C)",
          borderRadius: "32px", padding: "40px", marginBottom: "40px",
          color: "#FFFFFF", display: "flex", alignItems: "center", gap: "32px",
          boxShadow: "0 20px 40px rgba(255,107,44,0.2)"
        }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "40px", fontWeight: 700, border: "4px solid rgba(255,255,255,0.4)"
          }}>
            {initials(student.name)}
          </div>
          <div>
            <h1 style={{ fontFamily: HEADING, fontSize: "36px", fontWeight: 700, margin: "0 0 8px 0" }}>
              {student.name}
            </h1>
            <div style={{ display: "flex", gap: "20px", fontSize: "16px", opacity: 0.9 }}>
              <span>🆔 NIS: <strong>{student.nis}</strong></span>
              <span>🏫 Kelas: <strong>{student.class}</strong></span>
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: HEADING, fontSize: "24px", fontWeight: 600, color: "#261813", marginBottom: "24px" }}>
          Riwayat Konsultasi AI
        </h2>

        {/* Summaries List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {summaries.length === 0 ? (
            <div style={{
              background: "#FFFFFF", borderRadius: "24px", padding: "60px",
              textAlign: "center", border: "2px dashed #FFE9E2"
            }}>
              <p style={{ color: "#8D7167", fontSize: "16px", margin: 0 }}>Belum ada riwayat percakapan untuk siswa ini.</p>
            </div>
          ) : (
            summaries.map((s) => {
              const risk = riskStyle[s.risk_flag] || riskStyle.normal;
              return (
                <div key={s.id} style={{
                  background: "#FFFFFF", borderRadius: "24px", padding: "32px",
                  border: "1px solid #FFE9E2", boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  display: "flex", flexDirection: "column", gap: "20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#8D7167", fontWeight: 600 }}>
                        DIBUAT PADA
                      </p>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#261813" }}>
                        {formatDate(s.sent_at)}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{
                        padding: "8px 16px", borderRadius: "999px", background: "#F3F4F6",
                        fontSize: "14px", fontWeight: 600, color: "#594139"
                      }}>
                        {moodLabel[s.mood] || s.mood}
                      </span>
                      <span style={{
                        padding: "8px 16px", borderRadius: "999px", background: risk.bg,
                        fontSize: "14px", fontWeight: 700, color: risk.color, border: `1px solid ${risk.color}44`
                      }}>
                        {risk.label}
                      </span>
                    </div>
                  </div>

                  <div style={{ background: "#FFF8F6", borderRadius: "16px", padding: "20px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#FF6B2C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                      Ringkasan AI
                    </p>
                    <p style={{ margin: 0, fontSize: "15px", color: "#261813", lineHeight: 1.6 }}>
                      {s.summary_text}
                    </p>
                  </div>

                  {s.daily_condition && (
                    <div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#8D7167", fontWeight: 600 }}>
                        KONDISI HARIAN
                      </p>
                      <p style={{ margin: 0, fontSize: "15px", color: "#594139", lineHeight: 1.6 }}>
                        {s.daily_condition}
                      </p>
                    </div>
                  )}

                  {s.risk_reason && (
                    <div style={{ padding: "16px", borderRadius: "12px", background: "#FFF0EE", borderLeft: "4px solid #DC2626" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#DC2626", fontWeight: 700 }}>
                        ⚠️ CATATAN RISIKO
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#261813" }}>
                        {s.risk_reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

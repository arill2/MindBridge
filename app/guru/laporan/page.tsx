import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLatestSummaries } from "@/lib/supabase";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import PrintButton from "@/components/PrintButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Laporan Siswa - MindBridge" };

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

export default async function LaporanPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") redirect("/login");

  const summaries = await getLatestSummaries(200); // Ambil lebih banyak untuk laporan
  const guruName = session.user.name || "Guru BK";
  const displayName = guruName.split(" ").slice(0, 2).join(" ");

  const navItems = [
    { href: "/guru/dashboard", icon: "📊", label: "Dashboard",    active: false },
    { href: "/guru/kelola",    icon: "👥", label: "Kelola Siswa", active: false },
    { href: "/guru/laporan",   icon: "📋", label: "Laporan",      active: true  },
    { href: "/guru/pengaturan",icon: "⚙️", label: "Pengaturan",   active: false },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "#FFFFFF",
        borderRight: "1px solid #FFE9E2", display: "flex", flexDirection: "column",
        boxShadow: "2px 0 16px rgba(255,107,44,0.06)", zIndex: 10,
      }} className="print-hide">
        <div style={{ padding: "24px", borderBottom: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>🌉</span>
            <span style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813" }}>MindBridge</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
              borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              background: item.active ? "#FF6B2C" : "transparent",
              color: item.active ? "#FFFFFF" : "#594139",
              boxShadow: item.active ? "0 4px 14px rgba(255,107,44,0.28)" : "none",
              transition: "all 0.15s",
            }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
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
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#261813", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#8D7167" }}>Guru BK</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", maxWidth: "calc(100vw - 240px)" }} className="print-main">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: HEADING, fontSize: "28px", fontWeight: 600, color: "#261813", margin: "0 0 4px 0" }}>
              Laporan Sesi Siswa
            </h1>
            <p style={{ color: "#8D7167", fontSize: "14px", margin: 0 }}>Arsip dan rekapitulasi semua sesi konsultasi AI</p>
          </div>
          <PrintButton />
        </div>

        {/* Table Container */}
        <div style={{
          background: "#FFFFFF", borderRadius: "24px", overflow: "hidden",
          boxShadow: "0 4px 24px rgba(255,107,44,0.08)", border: "1px solid #FFE9E2",
        }}>
          {summaries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🌤️</div>
              <p style={{ color: "#8D7167", margin: 0, fontSize: "14px" }}>Belum ada laporan sesi yang tersedia.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #FFE9E2", background: "#FFF8F6" }}>
                    {["Tanggal", "Siswa", "Kelas", "Kondisi Mental", "Status Risiko", "Catatan AI", "Aksi"].map((h) => (
                      <th key={h} style={{ padding: "16px 20px", fontSize: "12px", fontWeight: 700, color: "#A89288", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((s) => {
                    const student = s.student;
                    const name = student?.name ?? "Anonim";
                    const risk = riskStyle[s.risk_flag] ?? riskStyle.normal;
                    
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid #FFF8F6" }} className="hover-row">
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "#8D7167", whiteSpace: "nowrap" }}>
                          {formatDate(s.sent_at)}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#261813" }}>{name}</span>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "14px", color: "#594139" }}>
                          {student?.class || "—"}
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "#594139" }}>
                          <div style={{ fontWeight: 600, marginBottom: "4px" }}>{moodLabel[s.mood] ?? s.mood}</div>
                          {s.daily_condition && <div style={{ color: "#8D7167" }}>{s.daily_condition}</div>}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            padding: "6px 12px", borderRadius: "999px", background: risk.bg, color: risk.color,
                            fontSize: "11px", fontWeight: 700, border: `1px solid ${risk.color}33`, whiteSpace: "nowrap",
                            display: "inline-block"
                          }}>
                            {risk.label}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "#594139", lineHeight: 1.5, maxWidth: "300px" }}>
                          {s.summary_text}
                          {s.risk_reason && (
                            <div style={{ marginTop: "6px", color: "#DC2626", fontSize: "12px", fontWeight: 600 }}>
                              ⚠️ Alasan: {s.risk_reason}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          {student?.id && (
                            <Link href={`/guru/siswa/${student.id}`} style={{
                              fontSize: "13px", color: "#FF6B2C", textDecoration: "none", fontWeight: 700
                            }}>
                              Detail →
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover { background: #FFF8F6 !important; }
        .print-btn:hover { background: #FF6B2C !important; color: #FFF !important; }
        @media print {
          .print-hide { display: none !important; }
          .print-main { max-width: 100% !important; padding: 0 !important; }
          body { background: white !important; }
          table { border: 1px solid #ddd !important; }
          th, td { border: 1px solid #ddd !important; padding: 12px !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GuruSidebar from "@/components/GuruSidebar";
import { ScrollReveal } from "@/components/ScrollReveal";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

export default function PengaturanPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      if (session.user.role !== "guru") {
        router.push("/siswa");
      } else {
        setName(session.user.name || "");
        setEmail(session.user.email || "");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/guru/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Profil berhasil diperbarui! Silakan refresh halaman jika nama di sidebar belum berubah.", type: "success" });
        // Update session client-side if possible
        await update({ name, email });
      } else {
        setMessage({ text: data.error || "Gagal memperbarui profil", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Terjadi kesalahan koneksi", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") return null;

  const guruName = session?.user.name || "Guru BK";
  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      <GuruSidebar guruName={guruName} />

      {/* ── MAIN ── */}
      <main className="md:ml-[240px]" style={{ minHeight: "100vh" }}>
        <div className="md:!p-10" style={{ maxWidth: "500px", width: "100%", margin: "0 auto", padding: "24px 20px 40px" }}>
          <ScrollReveal animation="fade-in-up" delay={0} threshold={0}>
            <h1 style={{ fontFamily: HEADING, fontSize: "32px", fontWeight: 600, color: "#261813", marginBottom: "8px" }}>
              Pengaturan Profil
            </h1>
            <p style={{ color: "#8D7167", fontSize: "15px", marginBottom: "32px" }}>
              Kelola informasi akun Anda di sini.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={100}>
            <form onSubmit={handleSubmit} style={{
              background: "#FFFFFF", padding: "32px", borderRadius: "24px",
              border: "1px solid #FFE9E2", boxShadow: "0 8px 32px rgba(255,107,44,0.05)"
            }}>
              {message.text && (
                <div style={{
                  padding: "12px 16px", borderRadius: "12px", marginBottom: "24px",
                  background: message.type === "success" ? "#EDFFF5" : "#FFF0EE",
                  color: message.type === "success" ? "#16A34A" : "#DC2626",
                  fontSize: "14px", fontWeight: 500, border: `1px solid ${message.type === "success" ? "#16A34A33" : "#DC262633"}`
                }}>
                  {message.text}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#594139", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid #FFE9E2", fontSize: "15px", outline: "none",
                    background: "#FAFAFA", transition: "all 0.15s", fontFamily: FONT
                  }}
                />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#594139", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid #FFE9E2", fontSize: "15px", outline: "none",
                    background: "#FAFAFA", transition: "all 0.15s", fontFamily: FONT
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  width: "100%", padding: "14px", borderRadius: "999px",
                  background: "#FF6B2C", color: "#FFFFFF", border: "none",
                  fontSize: "15px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(255,107,44,0.3)", transition: "all 0.15s",
                  fontFamily: FONT
                }}
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </main>

      {/* Responsive overrides */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:!p-10 { padding: 40px !important; }
        }
      `}</style>
    </div>
  );
}

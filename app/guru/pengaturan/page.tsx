"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

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
  const initials = guruName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const navItems = [
    { href: "/guru/dashboard", icon: "📊", label: "Dashboard", active: false },
    { href: "/guru/kelola", icon: "👥", label: "Kelola Siswa", active: false },
    { href: "/guru/laporan", icon: "📋", label: "Laporan", active: false },
    { href: "/guru/pengaturan", icon: "⚙️", label: "Pengaturan", active: true },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "#FFFFFF",
        borderRight: "1px solid #FFE9E2", display: "flex", flexDirection: "column",
        boxShadow: "2px 0 16px rgba(255,107,44,0.06)", zIndex: 10,
      }}>
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
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#261813", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {guruName}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#8D7167" }}>Guru BK</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, padding: "40px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <h1 style={{ fontFamily: HEADING, fontSize: "32px", fontWeight: 600, color: "#261813", marginBottom: "8px" }}>
            Pengaturan Profil
          </h1>
          <p style={{ color: "#8D7167", fontSize: "15px", marginBottom: "32px" }}>
            Kelola informasi akun Anda di sini.
          </p>

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
        </div>
      </main>
    </div>
  );
}

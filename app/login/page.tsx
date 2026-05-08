"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type TabType = "siswa" | "guru";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("siswa");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [nis, setNis] = useState("");
  const [passwordSiswa, setPasswordSiswa] = useState("");
  const [email, setEmail] = useState("");
  const [passwordGuru, setPasswordGuru] = useState("");
  const failedAttempts = useRef(0);

  const handleSiswaLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!nis.trim() || !passwordSiswa.trim()) {
      setError("NIS dan password harus diisi");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await signIn("siswa-credentials", {
      nis: nis.trim(), password: passwordSiswa, redirect: false,
    });
    setIsLoading(false);
    if (result?.error) {
      failedAttempts.current += 1;
      const delay = Math.min(1000 * failedAttempts.current, 3000);
      await new Promise((r) => setTimeout(r, delay));
      setError("NIS atau password salah");
    } else {
      failedAttempts.current = 0;
      router.push("/siswa");
    }
  };

  const handleGuruLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !passwordGuru.trim()) {
      setError("Email dan password harus diisi");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await signIn("guru-credentials", {
      email: email.trim(), password: passwordGuru, redirect: false,
    });
    setIsLoading(false);
    if (result?.error) {
      failedAttempts.current += 1;
      const delay = Math.min(1000 * failedAttempts.current, 3000);
      await new Promise((r) => setTimeout(r, delay));
      setError("Email atau password salah");
    } else {
      failedAttempts.current = 0;
      router.push("/guru/dashboard");
    }
  };

  // ─── Styles ───────────────────────────────────────────────
  const S = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "radial-gradient(ellipse at bottom right, #FFE9D9 0%, #FFF8F6 60%)",
      fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
      position: "relative" as const,
      overflow: "hidden",
    },
    blob: {
      position: "absolute" as const,
      bottom: "-60px",
      right: "-60px",
      width: "360px",
      height: "360px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,107,44,0.12) 0%, transparent 70%)",
      pointerEvents: "none" as const,
    },
    wrapper: {
      width: "100%",
      maxWidth: "420px",
      position: "relative" as const,
      zIndex: 1,
    },
    logoArea: {
      textAlign: "center" as const,
      marginBottom: "32px",
    },
    logoRow: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "6px",
    },
    logoEmoji: { fontSize: "40px" },
    logoText: {
      fontFamily: "'Newsreader', Georgia, serif",
      fontSize: "32px",
      fontWeight: 600,
      color: "#261813",
      margin: 0,
    },
    tagline: {
      fontSize: "14px",
      color: "#8D7167",
      margin: 0,
    },
    card: {
      background: "#FFFFFF",
      borderRadius: "28px",
      padding: "36px",
      boxShadow: "0 8px 48px rgba(255, 107, 44, 0.13)",
    },
    tabRow: {
      display: "flex",
      background: "#FFF8F6",
      borderRadius: "999px",
      padding: "4px",
      marginBottom: "28px",
    },
    tabBtn: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "10px 0",
      borderRadius: "999px",
      border: "none",
      fontSize: "14px",
      fontWeight: 600,
      fontFamily: "'Be Vietnam Pro', sans-serif",
      cursor: "pointer",
      transition: "all 0.2s",
      background: active ? "#FF6B2C" : "transparent",
      color: active ? "#FFFFFF" : "#8D7167",
      boxShadow: active ? "0 4px 14px rgba(255,107,44,0.3)" : "none",
    }),
    errorBox: {
      marginBottom: "16px",
      padding: "12px 16px",
      background: "#FFF0EE",
      border: "1px solid #FCCDC0",
      borderRadius: "16px",
      color: "#C0392B",
      fontSize: "13px",
    },
    formGroup: { marginBottom: "18px" },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: 600,
      color: "#261813",
      marginBottom: "8px",
      paddingLeft: "4px",
    },
    input: {
      width: "100%",
      padding: "13px 20px",
      borderRadius: "999px",
      border: "1.5px solid #E2BFB3",
      background: "#FAFAFA",
      fontSize: "14px",
      color: "#261813",
      outline: "none",
      fontFamily: "'Be Vietnam Pro', sans-serif",
      boxSizing: "border-box" as const,
      transition: "border-color 0.2s",
    },
    submitBtn: (disabled: boolean): React.CSSProperties => ({
      width: "100%",
      padding: "15px",
      marginTop: "8px",
      borderRadius: "999px",
      border: "none",
      background: disabled ? "#FFBE9D" : "#FF6B2C",
      color: "#FFFFFF",
      fontSize: "15px",
      fontWeight: 700,
      fontFamily: "'Be Vietnam Pro', sans-serif",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 6px 24px rgba(255,107,44,0.35)",
      transition: "all 0.2s",
    }),
    hint: {
      textAlign: "center" as const,
      fontSize: "12px",
      color: "#8D7167",
      marginTop: "12px",
    },
    miloRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "24px",
    },
    miloAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#FFD23F",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      boxShadow: "0 2px 8px rgba(255,210,63,0.35)",
      flexShrink: 0,
    },
    miloText: { fontSize: "13px", color: "#8D7167" },
    footer: {
      textAlign: "center" as const,
      fontSize: "11px",
      color: "#C4A99A",
      marginTop: "16px",
    },
    demoBox: {
      marginTop: "20px",
      padding: "12px 16px",
      background: "#FFFBE6",
      border: "1px dashed #FFD23F",
      borderRadius: "16px",
      fontSize: "12px",
      color: "#7A6000",
      lineHeight: 1.7,
    },
  };

  return (
    <main style={S.page}>
      <div style={S.blob} />
      <div style={S.wrapper}>

        {/* Logo */}
        <AnimatedWrapper animation="fade-in" delay={0}>
          <div style={S.logoArea}>
            <div style={S.logoRow} className="animate-float">
              <Image src="/logo webvvv.svg" alt="MindBridge Logo" width={48} height={48} style={{ height: "48px", width: "auto", objectFit: "contain" }} priority />
            </div>
            <p style={S.tagline}>Ceritamu Aman di Sini</p>
          </div>
        </AnimatedWrapper>

        {/* Card */}
        <AnimatedWrapper animation="scale-in" delay={200}>
          <div style={S.card} className="hover-lift">

          {/* Tab Switcher */}
          <AnimatedWrapper animation="slide-in-left" delay={300}>
            <div style={S.tabRow}>
              {(["siswa", "guru"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => { setActiveTab(tab); setError(""); }}
                  style={S.tabBtn(activeTab === tab)}
                  className="hover-scale"
                >
                  {tab === "siswa" ? "👨‍🎓 Siswa" : "👩‍🏫 Guru BK"}
                </button>
              ))}
            </div>
          </AnimatedWrapper>

          {/* Error */}
          {error && (
            <AnimatedWrapper animation="fade-in-up" delay={0}>
              <div style={S.errorBox} className="animate-danger">⚠️ {error}</div>
            </AnimatedWrapper>
          )}

          {/* Form Siswa */}
          {activeTab === "siswa" && (
            <AnimatedWrapper animation="fade-in-up" delay={400}>
              <form onSubmit={handleSiswaLogin} noValidate>
                <div className="input-group" style={S.formGroup}>
                  <label htmlFor="nis" className="input-label" style={S.label}>NIS (Nomor Induk Siswa)</label>
                  <input
                    id="nis"
                    type="text"
                    className={`input-pill ${error && !nis.trim() ? 'input-error' : ''}`}
                    style={S.input}
                    placeholder="Masukkan NIS kamu"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                <div className="input-group" style={S.formGroup}>
                  <label htmlFor="password-siswa" className="input-label" style={S.label}>Password</label>
                  <input
                    id="password-siswa"
                    type="password"
                    className={`input-pill ${error && !passwordSiswa.trim() ? 'input-error' : ''}`}
                    style={S.input}
                    placeholder="Password kamu"
                    value={passwordSiswa}
                    onChange={(e) => setPasswordSiswa(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                <button
                  id="login-siswa-btn"
                  type="submit"
                  disabled={isLoading}
                  style={S.submitBtn(isLoading)}
                  className="hover-lift"
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <LoadingSpinner size="sm" variant="muted" />
                      Sedang masuk...
                    </div>
                  ) : "Masuk sebagai Siswa →"}
                </button>
                <p style={S.hint}>Butuh bantuan? Hubungi Guru BK kamu 💛</p>
              </form>
            </AnimatedWrapper>
          )}

          {/* Form Guru */}
          {activeTab === "guru" && (
            <AnimatedWrapper animation="fade-in-up" delay={400}>
              <form onSubmit={handleGuruLogin} noValidate>
                <div className="input-group" style={S.formGroup}>
                  <label htmlFor="email" className="input-label" style={S.label}>Email Guru BK</label>
                  <input
                    id="email"
                    type="email"
                    className={`input-pill ${error && !email.trim() ? 'input-error' : ''}`}
                    style={S.input}
                    placeholder="nama@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="input-group" style={S.formGroup}>
                  <label htmlFor="password-guru" className="input-label" style={S.label}>Password</label>
                  <input
                    id="password-guru"
                    type="password"
                    className={`input-pill ${error && !passwordGuru.trim() ? 'input-error' : ''}`}
                    style={S.input}
                    placeholder="Password akun guru"
                    value={passwordGuru}
                    onChange={(e) => setPasswordGuru(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                <button
                  id="login-guru-btn"
                  type="submit"
                  disabled={isLoading}
                  style={S.submitBtn(isLoading)}
                  className="hover-lift"
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <LoadingSpinner size="sm" variant="muted" />
                      Sedang masuk...
                    </div>
                  ) : "Masuk sebagai Guru BK →"}
                </button>

                {/* Demo credentials hint */}
                <div style={S.demoBox} className="animate-stagger-1">
                  💡 <strong>Demo:</strong> Email: <code>guru@sekolah.com</code> / Password: <code>guru123</code>
                </div>
              </form>
            </AnimatedWrapper>
          )}

          {activeTab === "siswa" && (
            <AnimatedWrapper animation="fade-in-up" delay={500}>
              <div style={S.demoBox} className="animate-stagger-2">
                💡 <strong>Demo:</strong> NIS: <code>12345</code> / Password: <code>siswa123</code>
              </div>
            </AnimatedWrapper>
          )}
          </div>
        </AnimatedWrapper>

        {/* Milo */}
        <AnimatedWrapper animation="slide-in-right" delay={600}>
          <div style={S.miloRow}>
            <div style={{ ...S.miloAvatar }} className="animate-milo-pulse">🌤️</div>
            <p style={S.miloText}>Milo siap mendengarmu hari ini 💛</p>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper animation="fade-in" delay={700}>
          <div style={S.footer}>
            <p style={{ margin: "0 0 8px 0" }}>MindBridge — Hackathon 2026 🌉</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <Link href="/privacy" style={{ color: "#C4A99A", textDecoration: "underline" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#C4A99A", textDecoration: "underline" }}>Terms of Service</Link>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </main>
  );
}

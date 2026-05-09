"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const navItems = [
  { href: "/guru/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/guru/kelola", icon: "👥", label: "Kelola Siswa" },
  { href: "/guru/laporan", icon: "📋", label: "Laporan" },
  { href: "/guru/pengaturan", icon: "⚙️", label: "Pengaturan" },
];

export default function GuruSidebar({
  guruName,
}: {
  guruName: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const displayName = guruName.split(" ").slice(0, 2).join(" ");

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open — preserves original overflow value
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = open ? "hidden" : "";
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* ── MOBILE TOP BAR ─────────────────────────────── */}
      <header
        className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-[#FFE9E2]"
        style={{ fontFamily: FONT, padding: "12px 16px" }}
      >
        <Link href="/guru/dashboard" className="flex items-center gap-2 no-underline">
          <Image
            src="/logo webvvv.svg"
            alt="MindBridge"
            width={28}
            height={28}
            style={{ height: 28, width: 'auto', objectFit: "contain" }}
          />
          <span className="text-xl font-bold text-[#261813]">MindBridge</span>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="hover-scale hover-lift"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid #FFE9E2",
            background: open ? "#FF6B2C" : "#FFF8F6",
            color: open ? "#FFF" : "#594139",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {open ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* ── MOBILE OVERLAY ─────────────────────────────── */}
      {open && (
        <AnimatedWrapper animation="fade-in" delay={0}>
          <div
            onClick={() => setOpen(false)}
            className="animate-fade-in"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(38,24,19,0.35)",
              backdropFilter: "blur(4px)",
              zIndex: 45,
            }}
          />
        </AnimatedWrapper>
      )}

      {/* ── MOBILE SLIDE MENU ──────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-100%",
          width: "min(300px, 82vw)",
          height: "100dvh",
          background: "#FFFFFF",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.12)" : "none",
          transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: FONT,
          overflowY: "auto",
        }}
        className="md:hidden"
      >
        {/* Menu Header */}
        <AnimatedWrapper animation="slide-in-right" delay={100}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #FFE9E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div className="flex items-center gap-2">
              <Image src="/logo webvvv.svg" alt="MindBridge" width={28} height={28} style={{ height: 28, width: 'auto' }} />
              <span className="text-xl font-bold text-[#261813]">MindBridge</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover-scale hover-lift"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "none",
                background: "#FFF0EE",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </AnimatedWrapper>

        {/* Nav Items */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {navItems.map((item, index) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <AnimatedWrapper key={item.href} animation="slide-in-right" delay={200 + (index * 50)}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover-lift"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    borderRadius: 14,
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: FONT,
                    background: active ? "#FF6B2C" : "transparent",
                    color: active ? "#FFFFFF" : "#594139",
                    boxShadow: active ? "0 4px 14px rgba(255,107,44,0.25)" : "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span style={{ fontSize: 18 }} className="hover-scale">{item.icon}</span>
                  {item.label}
                </Link>
              </AnimatedWrapper>
            );
          })}
        </div>

        {/* User section */}
        <AnimatedWrapper animation="slide-in-right" delay={400}>
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid #FFE9E2",
            marginTop: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#FF6B2C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }} className="hover-scale">
                {initials(guruName)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#261813" }}>{displayName}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#8D7167" }}>Guru BK</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </AnimatedWrapper>
      </nav>

      {/* ── DESKTOP SIDEBAR ────────────────────────────── */}
      <aside
        className="hidden md:flex"
        style={{
          width: 240,
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "1px solid #FFE9E2",
          flexDirection: "column",
          boxShadow: "2px 0 16px rgba(255,107,44,0.06)",
          fontFamily: FONT,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <AnimatedWrapper animation="slide-in-left" delay={0}>
          <div style={{ padding: "24px", borderBottom: "1px solid #FFE9E2" }}>
            <Link href="/guru/dashboard" className="flex items-center gap-2 no-underline hover-scale">
              <Image src="/logo webvvv.svg" alt="MindBridge" width={32} height={32} style={{ height: 32, width: 'auto', objectFit: "contain" }} />
              <span className="text-xl font-bold text-[#261813]">MindBridge</span>
            </Link>
          </div>
        </AnimatedWrapper>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item, index) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <AnimatedWrapper key={item.href} animation="slide-in-left" delay={100 + (index * 50)}>
                <Link
                  href={item.href}
                  className="hover-lift"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: FONT,
                    background: active ? "#FF6B2C" : "transparent",
                    color: active ? "#FFFFFF" : "#594139",
                    boxShadow: active ? "0 4px 14px rgba(255,107,44,0.28)" : "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span className="hover-scale">{item.icon}</span>
                  {item.label}
                </Link>
              </AnimatedWrapper>
            );
          })}
        </nav>

        {/* User */}
        <AnimatedWrapper animation="slide-in-left" delay={300}>
          <div style={{ padding: "16px 20px", borderTop: "1px solid #FFE9E2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#FF6B2C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }} className="hover-scale">
                {initials(guruName)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 600, color: "#261813",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {displayName}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#8D7167" }}>Guru BK</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </AnimatedWrapper>
      </aside>

      {/* Keyframes for fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

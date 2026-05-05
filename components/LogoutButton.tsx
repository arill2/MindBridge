"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        marginTop: "12px",
        width: "100%",
        padding: "8px 12px",
        background: "#FFF0EE",
        color: "#DC2626",
        border: "none",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF0EE")}
    >
      <span>🚪</span> Keluar
    </button>
  );
}

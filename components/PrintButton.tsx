"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-hide print-btn"
      style={{
        padding: "12px 24px",
        borderRadius: "999px",
        background: "#FFFFFF",
        color: "#FF6B2C",
        fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
        fontSize: "14px",
        fontWeight: 700,
        border: "2px solid #FF6B2C",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(255,107,44,0.15)",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>🖨️</span> Cetak Laporan
    </button>
  );
}

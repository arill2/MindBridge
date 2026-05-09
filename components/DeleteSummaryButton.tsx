"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteSummaryButtonProps {
  summaryId: string;
}

export default function DeleteSummaryButton({ summaryId }: DeleteSummaryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/summaries/${summaryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh page data without full reload
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            background: "#DC2626",
            color: "#FFF",
            border: "none",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: isDeleting ? "not-allowed" : "pointer",
            opacity: isDeleting ? 0.7 : 1,
          }}
        >
          {isDeleting ? "..." : "Yakin?"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          style={{
            background: "#F3F4F6",
            color: "#4B5563",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setShowConfirm(true);
      }}
      title="Hapus ringkasan"
      style={{
        background: "transparent",
        border: "none",
        color: "#DC2626",
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        transition: "background 0.2s",
        opacity: 0.6,
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  );
}

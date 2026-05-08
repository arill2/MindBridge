import { MoodType, RiskFlag } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================
// Tailwind utility
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// Mood utilities
// ============================================================
export const MOOD_CONFIG: Record<
  MoodType,
  { label: string; emoji: string; color: string; bgColor: string }
> = {
  senang: {
    label: "Senang",
    emoji: "😊",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  sedih: {
    label: "Sedih",
    emoji: "😢",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  cemas: {
    label: "Cemas",
    emoji: "😰",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  marah: {
    label: "Marah",
    emoji: "😠",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  biasa: {
    label: "Biasa Saja",
    emoji: "😐",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export function getMoodConfig(mood: MoodType) {
  return MOOD_CONFIG[mood] || MOOD_CONFIG.biasa;
}

// ============================================================
// Risk Flag utilities
// ============================================================
export const RISK_CONFIG: Record<
  RiskFlag,
  { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
  normal: {
    label: "Normal",
    emoji: "✅",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  perlu_perhatian: {
    label: "Perlu Perhatian",
    emoji: "⚠️",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
  darurat: {
    label: "DARURAT",
    emoji: "🚨",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-400",
  },
};

export function getRiskConfig(flag: RiskFlag) {
  return RISK_CONFIG[flag] || RISK_CONFIG.normal;
}

// ============================================================
// Date & Time utilities
// ============================================================

/** Format tanggal Indonesia: "Selasa, 5 Mei 2026" */
export function formatDateIndonesian(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format waktu: "09:15 WIB" */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** Format relative time: "2 jam lalu" */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDateIndonesian(d);
}

// ============================================================
// Timer utilities
// ============================================================

/** Format detik ke MM:SS */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Default durasi sesi dalam detik (5 menit) */
const rawDuration = parseInt(process.env.NEXT_PUBLIC_CHAT_DURATION_SECONDS || "300", 10);
export const SESSION_DURATION = isNaN(rawDuration) || rawDuration <= 0 ? 300 : rawDuration;

// ============================================================
// String utilities
// ============================================================

/** Ambil inisial dari nama: "Andi Pratama" → "AP" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Truncate text dengan ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// ============================================================
// Validation utilities
// ============================================================

/** Validasi NIS: hanya angka, 5-15 karakter */
export function isValidNIS(nis: string): boolean {
  return /^\d{5,15}$/.test(nis);
}

/** Validasi email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validasi password: minimal 6 karakter */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// ============================================================
// API utilities
// ============================================================

/** Handle fetch errors */
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { data: null, error: err.error || "Terjadi kesalahan" };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: "Tidak dapat terhubung ke server" };
  }
}

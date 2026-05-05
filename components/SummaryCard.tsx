import { Summary } from "@/types";
import { getMoodConfig, getRiskConfig, formatRelativeTime, truncate } from "@/lib/utils";
import RiskBadge from "./RiskBadge";
import MoodIndicator from "./MoodIndicator";
import Link from "next/link";

interface SummaryCardProps {
  summary: Summary;
  showStudentName?: boolean;
}

/**
 * Kartu ringkasan sesi siswa
 * Digunakan di: Dashboard Guru BK (list view) & Dashboard Siswa (riwayat)
 */
export default function SummaryCard({
  summary,
  showStudentName = true,
}: SummaryCardProps) {
  const studentName = summary.student?.name || "Siswa";
  const studentClass = summary.student?.class;

  return (
    <div
      className="bg-white rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-2px]"
      style={{ boxShadow: "0 4px 24px rgba(255, 107, 44, 0.08)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar inisial */}
          <div
            className="w-10 h-10 rounded-full bg-[#FF6B2C] flex items-center justify-center text-white text-sm font-semibold font-['Be_Vietnam_Pro'] flex-shrink-0"
            aria-hidden="true"
          >
            {studentName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            {showStudentName && (
              <p className="font-semibold text-[#261813] font-['Newsreader'] text-base">
                {studentName}
              </p>
            )}
            {studentClass && (
              <p className="text-xs text-[#8D7167] font-['Be_Vietnam_Pro']">
                {studentClass}
              </p>
            )}
          </div>
        </div>
        <RiskBadge flag={summary.risk_flag} />
      </div>

      {/* Mood + summary */}
      <div className="flex items-center gap-2 mb-2">
        <MoodIndicator mood={summary.mood} size="sm" />
      </div>

      <p className="text-sm text-[#594139] font-['Be_Vietnam_Pro'] leading-relaxed mb-3">
        {truncate(summary.summary_text, 120)}
      </p>

      {/* Risk reason (jika bukan normal) */}
      {summary.risk_flag !== "normal" && summary.risk_reason && (
        <div className="bg-[#FFF8F6] border-l-4 border-[#FF6B2C] rounded-r-xl px-3 py-2 mb-3">
          <p className="text-xs text-[#8D7167] font-['Be_Vietnam_Pro'] italic">
            ⚠️ {summary.risk_reason}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#FFE9E2]">
        <span className="text-xs text-[#8D7167] font-['Be_Vietnam_Pro']">
          🕐 {formatRelativeTime(summary.sent_at)}
        </span>
        {summary.student_id && (
          <Link
            href={`/guru/siswa/${summary.student_id}`}
            className="text-xs text-[#FF6B2C] font-['Be_Vietnam_Pro'] font-semibold hover:underline"
          >
            Lihat Detail →
          </Link>
        )}
      </div>
    </div>
  );
}

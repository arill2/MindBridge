import { RiskFlag } from "@/types";
import { getRiskConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  flag: RiskFlag;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

/**
 * Badge indikator risiko dengan tiga level:
 * - normal: hijau
 * - perlu_perhatian: amber/kuning
 * - darurat: merah (prominent)
 */
export default function RiskBadge({
  flag,
  size = "md",
  showIcon = true,
}: RiskBadgeProps) {
  const config = getRiskConfig(flag);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-['Be_Vietnam_Pro'] font-semibold border",
        config.color,
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        // Badge darurat pulsing animation
        flag === "darurat" && "animate-pulse"
      )}
      role="status"
      aria-label={`Risk level: ${config.label}`}
    >
      {showIcon && <span aria-hidden="true">{config.emoji}</span>}
      {config.label}
    </span>
  );
}

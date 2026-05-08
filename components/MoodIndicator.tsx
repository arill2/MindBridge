import { MoodType } from "@/types";
import { getMoodConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

interface MoodIndicatorProps {
  mood: MoodType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Visual mood indicator dengan emoji + label
 * Digunakan di: SummaryCard, Detail Laporan Siswa, Dashboard
 */
export default function MoodIndicator({
  mood,
  size = "md",
  showLabel = true,
}: MoodIndicatorProps) {
  const config = getMoodConfig(mood);

  const sizeConfig = {
    sm: { emoji: "text-lg", text: "text-xs", padding: "px-2 py-1" },
    md: { emoji: "text-2xl", text: "text-sm", padding: "px-3 py-1.5" },
    lg: { emoji: "text-4xl", text: "text-base", padding: "px-4 py-2" },
  };

  const sizes = sizeConfig[size];

  return (
    <AnimatedWrapper 
      animation="scale-in" 
      delay={0}
      className="inline-block"
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-['Be_Vietnam_Pro'] font-medium border border-current/20 transition-all duration-300 hover-scale",
          config.color,
          config.bgColor,
          sizes.padding
        )}
        role="img"
        aria-label={`Mood: ${config.label}`}
      >
        <span className={cn(sizes.emoji, "animate-float")} aria-hidden="true">
          {config.emoji}
        </span>
        {showLabel && (
          <span className={cn(sizes.text, "font-semibold")}>{config.label}</span>
        )}
      </span>
    </AnimatedWrapper>
  );
}

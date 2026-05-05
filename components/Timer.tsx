"use client";

import { useEffect, useState, useCallback } from "react";
import { formatTimer, SESSION_DURATION } from "@/lib/utils";

interface TimerProps {
  onTimeUp: () => void;
  paused?: boolean;
}

/**
 * Countdown timer 5 menit — circular progress ring
 * Dipanggil di halaman Sesi Chat Milo
 */
export default function Timer({ onTimeUp, paused = false }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
  const [hasTriggered, setHasTriggered] = useState(false);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / SESSION_DURATION;
  const dashOffset = circumference * (1 - progress);

  // Warna berubah saat mendekati habis
  const timerColor =
    secondsLeft > 60
      ? "#FF6B2C"   // orange — normal
      : secondsLeft > 30
      ? "#FFB347"   // amber — hampir habis
      : "#DC2626";  // merah — darurat

  const handleTimeUp = useCallback(() => {
    if (!hasTriggered) {
      setHasTriggered(true);
      onTimeUp();
    }
  }, [hasTriggered, onTimeUp]);

  useEffect(() => {
    if (paused || secondsLeft <= 0) {
      if (secondsLeft <= 0) handleTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, secondsLeft, handleTimeUp]);

  return (
    <div
      className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-md"
      style={{ boxShadow: "0 4px 20px rgba(255, 107, 44, 0.12)" }}
      aria-label={`Timer: ${formatTimer(secondsLeft)} tersisa`}
      role="timer"
    >
      {/* Circular SVG progress */}
      <svg width="88" height="88" viewBox="0 0 88 88">
        {/* Track */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#FFF1EC"
          strokeWidth="6"
        />
        {/* Progress */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={timerColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
        />
        {/* Timer text */}
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          fill={timerColor}
          fontSize="15"
          fontFamily="Newsreader, serif"
          fontWeight="600"
        >
          {formatTimer(secondsLeft)}
        </text>
      </svg>

      {/* Label */}
      <span
        className="text-xs text-[#8D7167] font-['Be_Vietnam_Pro'] font-medium"
        aria-hidden="true"
      >
        {secondsLeft > 0 ? "tersisa" : "selesai!"}
      </span>
    </div>
  );
}

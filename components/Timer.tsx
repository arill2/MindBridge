"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { formatTimer, SESSION_DURATION } from "@/lib/utils";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

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
  const hasTriggered = useRef(false);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / SESSION_DURATION;
  const dashOffset = circumference * (1 - progress);

  const timerColor =
    secondsLeft > 60
      ? "#FF6B2C"
      : secondsLeft > 30
      ? "#FFB347"
      : "#DC2626";

  const urgencyClass = secondsLeft <= 30 ? "animate-danger" : "";

  const handleTimeUp = useCallback(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      onTimeUp();
    }
  }, [onTimeUp]);

  useEffect(() => {
    if (paused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (secondsLeft <= 0) handleTimeUp();
  }, [secondsLeft, handleTimeUp]);

  return (
    <AnimatedWrapper animation="scale-in" delay={0}>
      <div
        className={`flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-md transition-all duration-300 hover-lift ${urgencyClass}`}
        style={{ boxShadow: "0 4px 20px rgba(255, 107, 44, 0.12)" }}
        aria-label={`Timer: ${formatTimer(secondsLeft)} tersisa`}
        role="timer"
      >
        {/* Circular SVG progress */}
        <AnimatedWrapper animation="fade-in" delay={100}>
          <svg width="88" height="88" viewBox="0 0 88 88" className="animate-float">
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
              className={secondsLeft <= 30 ? "animate-pulse" : ""}
            >
              {formatTimer(secondsLeft)}
            </text>
          </svg>
        </AnimatedWrapper>

        {/* Label */}
        <AnimatedWrapper animation="fade-in-up" delay={200}>
          <span
            className="text-xs text-[#8D7167] font-['Be_Vietnam_Pro'] font-medium"
            aria-hidden="true"
          >
            {secondsLeft > 0 ? "tersisa" : "selesai!"}
          </span>
        </AnimatedWrapper>
      </div>
    </AnimatedWrapper>
  );
}

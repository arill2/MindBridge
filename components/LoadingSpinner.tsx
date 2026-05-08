"use client";

import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "muted";
}

export function LoadingSpinner({ 
  size = "md", 
  className = "",
  variant = "primary"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const variantClasses = {
    primary: "border-[#FF6B2C]",
    muted: "border-[#C4A99A]"
  };

  return (
    <div className={clsx("relative", sizeClasses[size], className)}>
      <div 
        className={clsx(
          "absolute inset-0 rounded-full border-2 border-t-transparent animate-spin",
          variantClasses[variant]
        )}
      />
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <div className="w-2 h-2 bg-[#FF6B2C] rounded-full animate-milo-bounce" />
      <div className="w-2 h-2 bg-[#FF6B2C] rounded-full animate-milo-bounce" style={{ animationDelay: "0.2s" }} />
      <div className="w-2 h-2 bg-[#FF6B2C] rounded-full animate-milo-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  );
}

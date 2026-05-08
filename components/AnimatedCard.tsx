"use client";

import { clsx } from "clsx";
import { AnimatedWrapper } from "./AnimatedWrapper";

type AnimationType = 
  | "fade-in"
  | "fade-in-up" 
  | "slide-in-left"
  | "slide-in-right"
  | "scale-in";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animation?: AnimationType;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className = "",
  hover = true,
  animation = "fade-in-up",
  delay = 0
}: AnimatedCardProps) {
  return (
    <AnimatedWrapper animation={animation} delay={delay}>
      <div 
        className={clsx(
          "card transition-all duration-300",
          hover && "hover-lift cursor-pointer",
          className
        )}
      >
        {children}
      </div>
    </AnimatedWrapper>
  );
}

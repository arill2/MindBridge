"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type AnimationType = 
  | "fade-in"
  | "fade-in-up" 
  | "slide-in-left"
  | "slide-in-right"
  | "scale-in"
  | "float";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  trigger?: "on-mount" | "on-hover" | "on-scroll";
}

export function AnimatedWrapper({
  children,
  animation = "fade-in-up",
  delay = 0,
  className = "",
  trigger = "on-mount"
}: AnimatedWrapperProps) {
  // Use a local state only for non-mount triggers to prevent hydration mismatch
  // but apply 'on-mount' animations via CSS immediately
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger !== "on-scroll" || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger]);

  // Determine which class to apply
  // If trigger is on-mount, we apply the animation class immediately to avoid JS delay
  const animationClass = 
    trigger === "on-mount" ? `animate-${animation}` : 
    (trigger === "on-scroll" && isIntersecting) ? `animate-${animation}` : "";
    
  const hoverClass = trigger === "on-hover" && isHovered ? `animate-${animation}` : "";

  return (
    <div
      ref={ref}
      className={clsx(
        animationClass,
        hoverClass,
        "transition-all duration-300",
        className
      )}
      onMouseEnter={() => trigger === "on-hover" && setIsHovered(true)}
      onMouseLeave={() => trigger === "on-hover" && setIsHovered(false)}
      style={{ 
        animationDelay: `${delay}ms`,
        // Ensure visibility during mount if using CSS animation
        opacity: trigger === "on-mount" ? 0 : undefined, 
        animationFillMode: "forwards"
      }}
    >
      {children}
    </div>
  );
}


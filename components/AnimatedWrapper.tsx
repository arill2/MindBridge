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
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === "on-mount") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay, trigger]);

  useEffect(() => {
    if (trigger !== "on-scroll" || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, trigger]);

  const animationClass = isVisible ? `animate-${animation}` : "";
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
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-up" | "slide-in-left" | "slide-in-right" | "scale-in";
  delay?: number;
  /** IntersectionObserver threshold (0 = trigger immediately, 0.1 = 10% visible) */
  threshold?: number;
}

/**
 * ScrollReveal — membungkus elemen dengan animasi yang terpicu saat scroll masuk viewport.
 * Aman untuk SSR: konten terlihat saat server-render, opacity-0 diterapkan hanya setelah hydration.
 * Jika elemen sudah di viewport saat mount, animasi langsung berjalan tanpa delay.
 */
export function ScrollReveal({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    // Cek apakah elemen sudah di viewport (untuk SSR safety)
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsInViewport(true);
    }

    setIsMounted(true);

    return () => observer.disconnect();
  }, [delay, threshold]);

  // Jika sudah di viewport saat mount, langsung trigger animasi
  useEffect(() => {
    if (isMounted && isInViewport) {
      if (delay > 0) {
        setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
    }
  }, [isMounted, isInViewport, delay]);

  return (
    <div
      ref={ref}
      className={clsx(
        isVisible && `animate-${animation}`,
        isMounted && !isVisible && "opacity-0",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

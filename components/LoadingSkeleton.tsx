"use client";

import { AnimatedWrapper } from "@/components/AnimatedWrapper";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style, className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: "#FFE9E2", // MindBridge base skeleton color
        ...style
      }}
    />
  );
}

// Global styles for the skeleton pulse animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes skeleton-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    .skeleton-pulse {
      animation: skeleton-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;
  document.head.appendChild(style);
}

export function GuruDashboardSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", padding: "24px 16px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <AnimatedWrapper animation="fade-in" delay={0}>
        {/* Header Skeleton */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <Skeleton width="250px" height="32px" borderRadius="12px" style={{ marginBottom: "8px" }} />
            <Skeleton width="180px" height="16px" borderRadius="8px" />
          </div>
          <Skeleton width="100px" height="20px" borderRadius="8px" />
        </div>

        {/* Stats Grid Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: "20px", padding: "24px", border: "1px solid #FFE9E2" }}>
              <Skeleton width="32px" height="32px" borderRadius="8px" style={{ marginBottom: "12px" }} />
              <Skeleton width="60px" height="36px" borderRadius="12px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100px" height="14px" borderRadius="6px" />
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <Skeleton width="200px" height="24px" borderRadius="8px" style={{ marginBottom: "16px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: "20px", padding: "24px", border: "1px solid #FFE9E2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Skeleton width="42px" height="42px" borderRadius="50%" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="120px" height="18px" borderRadius="6px" style={{ marginBottom: "6px" }} />
                  <Skeleton width="60px" height="14px" borderRadius="4px" />
                </div>
                <Skeleton width="70px" height="24px" borderRadius="12px" />
              </div>
              <Skeleton width="100%" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="80%" height="14px" borderRadius="4px" style={{ marginBottom: "16px" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #FFE9E2" }}>
                <Skeleton width="80px" height="14px" borderRadius="4px" />
                <Skeleton width="80px" height="14px" borderRadius="4px" />
              </div>
            </div>
          ))}
        </div>
      </AnimatedWrapper>
    </div>
  );
}

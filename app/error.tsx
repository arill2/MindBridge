"use client";

import { useEffect } from "react";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ideally log to Sentry or monitoring service here
    console.error("MindBridge Global Error:", error);
  }, [error]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F6", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <AnimatedWrapper animation="fade-in-up" delay={0}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "80px", marginBottom: "16px" }}>
            🩹
          </div>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "36px", color: "#261813", marginBottom: "16px" }}>Aduh, ada yang salah!</h1>
          <p style={{ color: "#8D7167", fontSize: "16px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
            Sistem kami sedang mengalami sedikit gangguan. Milo dan tim sedang berusaha memperbaikinya secepat mungkin.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#FF6B2C",
              color: "#FFF",
              padding: "14px 28px",
              borderRadius: "999px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(255, 107, 44, 0.3)"
            }}
            className="hover-lift"
          >
            Coba Lagi
          </button>
        </div>
      </AnimatedWrapper>
    </main>
  );
}

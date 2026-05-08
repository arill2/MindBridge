import Link from "next/link";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F6", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <AnimatedWrapper animation="scale-in" delay={0}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "80px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>
            🕵️‍♂️
          </div>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "40px", color: "#261813", marginBottom: "16px" }}>Halaman Tidak Ditemukan</h1>
          <p style={{ color: "#8D7167", fontSize: "16px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
            Milo sudah mencari ke mana-mana, tapi halaman yang kamu tuju sepertinya tidak ada di sini.
          </p>
          <Link href="/" style={{
            display: "inline-block",
            background: "#FF6B2C",
            color: "#FFF",
            padding: "14px 28px",
            borderRadius: "999px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 6px 24px rgba(255, 107, 44, 0.3)"
          }} className="hover-lift">
            Kembali ke Beranda
          </Link>
        </div>
      </AnimatedWrapper>
    </main>
  );
}

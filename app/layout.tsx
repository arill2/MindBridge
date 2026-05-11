import type { Metadata } from "next";
import { Newsreader, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./providers";

// ============================================================
// Google Fonts — sesuai branding MindBridge
// ============================================================
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

// ============================================================
// Metadata
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "MindBridge — Ceritamu Aman di Sini",
    template: "%s | MindBridge",
  },
  description:
    "Platform AI Screening Kesehatan Mental Remaja. Hubungkan siswa, orang tua, dan guru BK dalam satu ekosistem yang hangat & aman.",
  keywords: ["kesehatan mental", "remaja", "sekolah", "AI", "screening", "MindBridge"],
  authors: [{ name: "MindBridge Team" }],
  openGraph: {
    title: "MindBridge — Ceritamu Aman di Sini",
    description:
      "Platform AI Screening Kesehatan Mental Remaja untuk Indonesia",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: "/logo webvvv.svg",
    shortcut: "/logo webvvv.svg",
    apple: "/logo webvvv.svg",
  },
};

export const viewport = {
  themeColor: "#FF6B2C",
};

// ============================================================
// Root Layout
// ============================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${newsreader.variable} ${beVietnamPro.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-[#FFF8F6] text-[#261813] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

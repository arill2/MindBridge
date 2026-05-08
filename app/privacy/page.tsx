import Link from "next/link";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        
        <Link href="/login" style={{ color: "#FF6B2C", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px" }} className="hover-lift">
          ← Kembali
        </Link>

        <AnimatedWrapper animation="fade-in-up" delay={0}>
          <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 48px rgba(255, 107, 44, 0.08)" }}>
            <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "36px", color: "#261813", marginBottom: "24px" }}>Kebijakan Privasi (Privacy Policy)</h1>
            <p style={{ color: "#8D7167", marginBottom: "32px" }}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            
            <div style={{ color: "#4A352F", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "20px" }}>
              <p>MindBridge ("kami", "aplikasi", "platform") berkomitmen untuk melindungi privasi dan keamanan data pengguna kami, khususnya mengingat sifat sensitif dari informasi kesehatan mental. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.</p>
              
              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>1. Data yang Kami Kumpulkan</h2>
              <p>Kami hanya mengumpulkan informasi yang diperlukan untuk operasional platform, termasuk:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Data Profil: Nama, NIS, Kelas, dan Alamat Email.</li>
                <li>Riwayat Percakapan: Teks percakapan antara Siswa dan Milo (AI Companion kami).</li>
                <li>Data Analisis: Ringkasan kondisi, deteksi emosi, dan penanda risiko (risk flag) yang dihasilkan oleh sistem AI.</li>
              </ul>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>2. Bagaimana Kami Menggunakan Data Anda</h2>
              <p>MindBridge menggunakan data Anda <strong>secara eksklusif</strong> untuk:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Memberikan ruang yang aman bagi siswa untuk mencurahkan perasaan.</li>
                <li>Menghasilkan ringkasan kesehatan mental yang membantu Guru Bimbingan Konseling (Guru BK) dalam memberikan intervensi dini.</li>
                <li>Mendeteksi kata kunci krisis/darurat untuk segera mengirimkan notifikasi peringatan kepada Guru BK atau pihak sekolah.</li>
              </ul>
              <div style={{ padding: "16px", background: "#FFF0EE", borderRadius: "12px", color: "#C0392B", border: "1px solid #FCCDC0" }}>
                <strong>Penting:</strong> Data Anda TIDAK PERNAH dijual kepada pihak ketiga, pengiklan, atau entitas komersial lainnya.
              </div>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>3. Pemrosesan Data oleh AI (Groq)</h2>
              <p>Untuk menyediakan percakapan dan analisis yang responsif, MindBridge memproses teks obrolan menggunakan layanan pemrosesan AI <strong>Groq</strong>. Data hanya dikirim dalam bentuk teks selama sesi berlangsung dan kami secara aktif bekerja untuk memastikan anonimitas semaksimal mungkin dalam payload API.</p>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>4. Keamanan dan Pembatasan Akses</h2>
              <p>Seluruh riwayat chat dan ringkasan siswa diamankan dengan kebijakan kontrol akses ketat (Row Level Security) dalam basis data kami:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Siswa hanya dapat membaca percakapan milik mereka sendiri.</li>
                <li>Hanya Guru BK resmi yang terdaftar yang memiliki hak akses untuk melihat ringkasan kondisi dan percakapan siswa di sekolah tersebut.</li>
              </ul>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>5. Hubungi Kami</h2>
              <p>Jika Anda atau orang tua/wali memiliki kekhawatiran tentang privasi data, silakan hubungi administrator sekolah atau Guru BK Anda. Sistem operasi platform sepenuhnya diawasi oleh kebijakan internal institusi sekolah.</p>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </main>
  );
}

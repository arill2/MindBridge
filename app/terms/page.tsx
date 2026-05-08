import Link from "next/link";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

export default function TermsOfService() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F6", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        
        <Link href="/login" style={{ color: "#FF6B2C", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px" }} className="hover-lift">
          ← Kembali
        </Link>

        <AnimatedWrapper animation="fade-in-up" delay={0}>
          <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 48px rgba(255, 107, 44, 0.08)" }}>
            <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "36px", color: "#261813", marginBottom: "24px" }}>Syarat dan Ketentuan (Terms of Service)</h1>
            <p style={{ color: "#8D7167", marginBottom: "32px" }}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            
            <div style={{ color: "#4A352F", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "20px" }}>
              <p>Selamat datang di MindBridge. Dengan mengakses atau menggunakan aplikasi ini, Anda setuju untuk terikat dengan Syarat dan Ketentuan berikut.</p>
              
              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>1. Bukan Pengganti Bantuan Medis Profesional</h2>
              <div style={{ padding: "16px", background: "#FFFBE6", borderRadius: "12px", color: "#7A6000", border: "1px dashed #FFD23F" }}>
                MindBridge dan AI Companion (Milo) <strong>BUKANLAH</strong> pengganti terapi klinis, perawatan medis, atau diagnosis psikiatris profesional. Sistem ini dirancang sebagai alat skrining awal dan wadah cerita yang aman untuk diteruskan kepada Guru Bimbingan Konseling (BK) di sekolah.
              </div>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>2. Kondisi Darurat (Emergency Protocol)</h2>
              <p>Jika AI kami mendeteksi indikasi kuat mengenai niat menyakiti diri sendiri, tindakan kekerasan, atau pikiran bunuh diri, MindBridge akan secara otomatis:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Menandai status sesi Anda sebagai "Darurat".</li>
                <li>Mengirimkan notifikasi peringatan seketika kepada Guru BK atau otoritas sekolah yang berwenang.</li>
              </ul>
              <p>Kami tidak menjamin waktu respons seketika dari pihak sekolah. Jika Anda berada dalam bahaya, segera hubungi layanan darurat lokal atau psikolog profesional.</p>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>3. Penggunaan yang Diizinkan</h2>
              <p>Sebagai Siswa atau Guru BK, Anda setuju untuk:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li>Memberikan informasi yang jujur untuk memastikan Guru BK dapat memberikan dukungan yang relevan.</li>
                <li>Menjaga kerahasiaan kredensial login (NIS, Email, Password) Anda.</li>
                <li>Tidak mengeksploitasi, melakukan spamming, atau mencoba memanipulasi parameter sistem AI kami (prompt injection).</li>
              </ul>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>4. Kewajiban Guru BK</h2>
              <p>Guru BK yang diberikan akses ke dashboard MindBridge setuju untuk menjaga kerahasiaan data siswa sesuai dengan sumpah profesi dan kode etik Bimbingan Konseling. Informasi ringkasan siswa hanya boleh digunakan untuk intervensi yang mendukung kesejahteraan siswa bersangkutan.</p>

              <h2 style={{ fontSize: "20px", color: "#261813", marginTop: "16px", marginBottom: "8px" }}>5. Perubahan Layanan</h2>
              <p>MindBridge berhak untuk mengubah, menangguhkan, atau menghentikan aspek apa pun dari layanan kapan saja tanpa pemberitahuan sebelumnya, khususnya jika terkait dengan pemeliharaan keamanan atau pembaharuan sistem.</p>

              <p style={{ marginTop: "24px", fontStyle: "italic" }}>Dengan menggunakan MindBridge, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui seluruh ketentuan dalam dokumen ini.</p>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </main>
  );
}

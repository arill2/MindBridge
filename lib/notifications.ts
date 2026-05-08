// ============================================================
// Notifications Service
// ============================================================

/**
 * Mengirimkan notifikasi darurat via Webhook (Discord/Telegram/Slack)
 * jika environment variable WEBHOOK_URL dikonfigurasi.
 */
export async function sendEmergencyNotification(
  studentId: string,
  sessionId: string,
  reason: string
) {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  const message = `🚨 **PERINGATAN DARURAT MINDBRIDGE** 🚨\nSistem AI mendeteksi kondisi darurat untuk siswa dengan ID: \`${studentId}\`.\n\n**Alasan Deteksi:** ${reason}\n\nHarap Guru BK segera meninjau dashboard untuk sesi: \`${sessionId}\`.`;

  // Selalu log ke console server
  console.warn("\n==============================================");
  console.warn("🚨 EMERGENCY NOTIFICATION TRIGGERED");
  console.warn(message);
  console.warn("==============================================\n");

  if (!webhookUrl) {
    console.log("ℹ️ WEBHOOK_URL tidak dikonfigurasi di .env.local. Notifikasi hanya dicetak di console.");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Format payload generik yang biasanya diterima Discord/Slack
      body: JSON.stringify({
        content: message,
        text: message // Fallback untuk Slack
      }),
    });

    if (!response.ok) {
      console.error("❌ Gagal mengirim webhook notifikasi darurat. Status:", response.status);
    } else {
      console.log("✅ Webhook notifikasi darurat berhasil dikirim.");
    }
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat memanggil webhook:", error);
  }
}

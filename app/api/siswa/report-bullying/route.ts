import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveSummary, createAdminClient } from "@/lib/supabase";
import { sendEmergencyNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = session.user.id;
    const adminClient = createAdminClient();

    // 1. Buat sesi placeholder untuk laporan bullying
    const { data: sessionRow, error: sessionErr } = await adminClient
      .from("sessions")
      .insert({
        student_id: studentId,
        ended_at: new Date().toISOString(),
        raw_chat: [{ role: "system", content: "Laporan perundungan (bullying) langsung melalui tombol darurat." }]
      })
      .select("id")
      .single();

    if (sessionErr || !sessionRow) {
      console.error("Bullying Report: Failed to create session", sessionErr);
      return NextResponse.json({ error: "Gagal membuat sesi laporan" }, { status: 500 });
    }

    const sessionId = sessionRow.id;

    // 2. Simpan sebagai summary darurat
    const savedSummary = await saveSummary({
      session_id: sessionId,
      student_id: studentId,
      mood: "marah",
      summary_text: "SISWA MELAPORKAN PERUNDUNGAN (BULLYING) SECARA LANGSUNG MELALUI TOMBOL DARURAT. Siswa membutuhkan bantuan segera untuk menangani situasi perundungan yang sedang dialami.",
      daily_condition: "Darurat / Bullying",
      risk_flag: "darurat",
      risk_reason: "Siswa menekan tombol 'SAYA DI-BULLY' di dashboard.",
    });

    if (!savedSummary) {
      return NextResponse.json({ error: "Gagal menyimpan laporan" }, { status: 500 });
    }

    // 3. Kirim notifikasi darurat (Webhook)
    await sendEmergencyNotification(
      studentId,
      sessionId,
      "Siswa menekan tombol 'SAYA DI-BULLY'. Laporan perundungan langsung."
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bullying report API error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

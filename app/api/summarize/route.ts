import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSessionSummary } from "@/lib/groq";
import { endSession, saveSummary, createAdminClient } from "@/lib/supabase";
import { sendEmergencyNotification } from "@/lib/notifications";
import { SummarizeRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Auth check — hanya siswa yang bisa request summarize
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SummarizeRequest = await req.json();
    const { session_id, student_id } = body;

    if (!session_id || !student_id) {
      return NextResponse.json(
        { error: "Session ID dan Student ID diperlukan" },
        { status: 400 }
      );
    }

    // Pastikan session milik siswa yang request
    if (session.user.id !== student_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate session_id ownership and fetch real history — prevent cross-session abuse
    // Use createAdminClient() to bypass RLS
    const { data: sessionRow, error: sessionErr } = await createAdminClient()
      .from("sessions")
      .select("student_id, raw_chat")
      .eq("id", session_id)
      .single();

    if (sessionErr || !sessionRow) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }
    if (sessionRow.student_id !== student_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const dbMessages = Array.isArray(sessionRow.raw_chat) ? sessionRow.raw_chat : [];
    
    if (dbMessages.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada percakapan untuk diringkas" },
        { status: 400 }
      );
    }

    // 1. Generate ringkasan dengan Groq using authentic database history
    const summaryData = await generateSessionSummary(dbMessages);

    // 2. Simpan ringkasan ke database terlebih dahulu
    const savedSummary = await saveSummary({
      session_id,
      student_id,
      mood: summaryData.mood,
      summary_text: summaryData.summary,
      daily_condition: summaryData.daily_condition,
      risk_flag: summaryData.risk_flag,
      risk_reason: summaryData.risk_reason,
    });

    if (!savedSummary) {
      return NextResponse.json(
        { error: "Gagal menyimpan ringkasan" },
        { status: 500 }
      );
    }

    // 3. Akhiri sesi (setelah summary berhasil disimpan)
    await endSession(session_id);

    // 4. Jika darurat, kirim notifikasi ke webhook
    if (summaryData.risk_flag === "darurat") {
      await sendEmergencyNotification(
        student_id,
        session_id,
        summaryData.risk_reason || "Terdeteksi indikasi krisis dari percakapan."
      );
    }

    return NextResponse.json({
      summary: savedSummary,
      mood: summaryData.mood,
      risk_flag: summaryData.risk_flag,
    });
  } catch (error) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { error: "Gagal membuat ringkasan. Hubungi admin." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSessionSummary } from "@/lib/groq";
import { endSession, saveSummary } from "@/lib/supabase";
import { SummarizeRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Auth check — hanya siswa yang bisa request summarize
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SummarizeRequest = await req.json();
    const { session_id, student_id, messages } = body;

    if (!session_id || !student_id) {
      return NextResponse.json(
        { error: "Session ID dan Student ID diperlukan" },
        { status: 400 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada percakapan untuk diringkas" },
        { status: 400 }
      );
    }

    // Pastikan session milik siswa yang request
    if (session.user.id !== student_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Akhiri sesi
    await endSession(session_id);

    // 2. Generate ringkasan dengan Groq
    const summaryData = await generateSessionSummary(messages);

    // 3. Simpan ringkasan ke database
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

    // 4. Jika darurat, bisa tambahkan notifikasi ke guru (TODO: webhook/email)
    if (summaryData.risk_flag === "darurat") {
      console.warn(
        `🚨 DARURAT: Student ${student_id} flagged as emergency in session ${session_id}`
      );
      // TODO: Trigger email notification to Guru BK
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

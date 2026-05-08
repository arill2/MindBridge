import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { endSession, createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "Session ID diperlukan" }, { status: 400 });
    }

    const { data: sessionRow } = await createAdminClient()
      .from("sessions")
      .select("student_id")
      .eq("id", session_id)
      .single();

    if (!sessionRow || sessionRow.student_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await endSession(session_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("End session API error:", error);
    return NextResponse.json({ error: "Gagal mengakhiri sesi" }, { status: 500 });
  }
}

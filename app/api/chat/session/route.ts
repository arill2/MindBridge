import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("sessions")
      .insert({
        student_id: session.user.id,
        started_at: new Date().toISOString(),
        raw_chat: [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return NextResponse.json(
        { error: "Gagal membuat sesi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: data }, { status: 201 });
  } catch (error) {
    console.error("Create session API error:", error);
    return NextResponse.json(
      { error: "Gagal membuat sesi" },
      { status: 500 }
    );
  }
}

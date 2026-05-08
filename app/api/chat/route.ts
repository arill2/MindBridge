import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatWithMilo } from "@/lib/groq";
import { appendSessionChat, createAdminClient } from "@/lib/supabase";
import { ChatRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequest = await req.json();
    const { message, session_id } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    if (!session_id) {
      return NextResponse.json({ error: "Session ID diperlukan" }, { status: 400 });
    }

    // Rate limiting sederhana: max 1000 karakter
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Pesan terlalu panjang (maksimal 1000 karakter)" },
        { status: 400 }
      );
    }

    // Validate session ownership and fetch actual history — prevent cross-student session poisoning
    // We use createAdminClient() here to bypass RLS, then check student_id manually
    const { data: sessionRow, error: sessionErr } = await createAdminClient()
      .from("sessions")
      .select("student_id, raw_chat, ended_at")
      .eq("id", session_id)
      .single();

    if (sessionErr || !sessionRow) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }
    if (sessionRow.student_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (sessionRow.ended_at) {
      return NextResponse.json(
        { error: "Sesi sudah berakhir. Tidak bisa mengirim pesan lagi." },
        { status: 400 }
      );
    }

    const dbHistory = Array.isArray(sessionRow.raw_chat) ? sessionRow.raw_chat : [];

    // Dapatkan respons dari Milo via Groq using authentic database history
    const miloReply = await chatWithMilo(message, dbHistory);

    // Update chat history di database secara atomik (mencegah race condition)
    const newMessages = [
      {
        role: "user" as const,
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: "assistant" as const,
        content: miloReply,
        timestamp: new Date().toISOString(),
      },
    ];

    await appendSessionChat(session_id, newMessages);

    return NextResponse.json({
      reply: miloReply,
      session_id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Milo sedang tidak bisa merespons. Coba lagi sebentar ya 💛" },
      { status: 500 }
    );
  }
}

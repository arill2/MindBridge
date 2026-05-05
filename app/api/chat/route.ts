import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatWithMilo } from "@/lib/groq";
import { updateSessionChat } from "@/lib/supabase";
import { ChatRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "siswa") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequest = await req.json();
    const { message, session_id, history } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    if (!session_id) {
      return NextResponse.json({ error: "Session ID diperlukan" }, { status: 400 });
    }

    // Rate limiting sederhana: max 3 kata per detik
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Pesan terlalu panjang (maksimal 1000 karakter)" },
        { status: 400 }
      );
    }

    // Dapatkan respons dari Milo via Groq
    const miloReply = await chatWithMilo(message, history || []);

    // Update chat history di database
    const newHistory = [
      ...(history || []),
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

    await updateSessionChat(session_id, newHistory);

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

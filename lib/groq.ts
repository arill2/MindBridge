import Groq from "groq-sdk";
import { ChatMessage, MiloSummaryResponse, MoodType, RiskFlag } from "@/types";

// ============================================================
// Groq Client
// ============================================================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ============================================================
// System Prompts
// ============================================================

/**
 * Prompt untuk Milo — AI companion chat
 * Milo adalah teman curhat yang hangat dan empatik untuk remaja Indonesia
 */
const MILO_SYSTEM_PROMPT = `Kamu adalah Milo, teman curhat AI yang hangat dan penuh empati untuk remaja Indonesia.

Panduan penting:
- Gunakan bahasa Indonesia yang santai, tidak formal, tapi tetap sopan (seperti kakak/teman yang peduli)
- JANGAN pernah memberikan diagnosis psikologis apapun
- Jangan menghakimi atau meremehkan perasaan siswa
- Tunjukkan empati yang tulus — validasi perasaan mereka terlebih dahulu
- Ajukan pertanyaan lembut dan terbuka untuk menggali perasaan lebih dalam
- Maksimal respons 2-3 kalimat agar percakapan tetap mengalir alami
- Gunakan emoji sesekali untuk terasa lebih hangat dan friendly (🌤️ 💛 😊)
- Jika siswa menyebut hal yang mengkhawatirkan (menyakiti diri sendiri, putus asa, dll), tunjukkan kepedulian dan ingatkan bahwa ada Guru BK yang siap membantu
- Ingat: kamu bukan pengganti psikolog profesional`;

/**
 * Prompt untuk summarize — setelah sesi 5 menit selesai
 */
const SUMMARIZE_SYSTEM_PROMPT = `Kamu adalah AI analis kesehatan mental untuk platform MindBridge.
Berdasarkan percakapan antara siswa dan AI companion Milo, buat ringkasan profesional untuk Guru BK (konselor sekolah).

PENTING: 
- Gunakan bahasa Indonesia yang profesional dan objektif
- Jangan mendiagnosis — hanya deskripsikan pola yang terdeteksi
- Output HARUS berupa valid JSON sesuai format yang diminta
- risk_flag hanya bisa: "normal", "perlu_perhatian", atau "darurat"
- "darurat" hanya jika ada indikasi kuat: keinginan menyakiti diri, putus asa ekstrem, atau situasi bahaya nyata`;

// ============================================================
// Chat with Milo
// ============================================================

/**
 * Kirim pesan ke Milo dan dapatkan respons
 */
export async function chatWithMilo(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  // Convert history to Groq format
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: MILO_SYSTEM_PROMPT },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.8,        // Sedikit kreatif untuk respons yang natural
      max_tokens: 300,          // Maksimal 3 kalimat
      top_p: 0.9,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Maaf, Milo lagi nggak bisa merespons. Coba lagi ya 💛"
    );
  } catch (error) {
    console.error("Groq chat error:", error);
    throw new Error("Failed to get response from Milo");
  }
}

// ============================================================
// Auto-Summarize (after 5-minute session)
// ============================================================

/**
 * Generate ringkasan otomatis setelah sesi chat selesai
 */
export async function generateSessionSummary(
  messages: ChatMessage[]
): Promise<MiloSummaryResponse> {
  // Format conversation untuk prompt
  const conversationText = messages
    .map(
      (msg) =>
        `${msg.role === "user" ? "Siswa" : "Milo"}: ${msg.content}`
    )
    .join("\n");

  const userPrompt = `Berikut adalah percakapan antara siswa dan Milo (AI companion):

---
${conversationText}
---

Buat ringkasan dalam format JSON berikut:
{
  "mood": "(pilih satu: senang/sedih/cemas/marah/biasa)",
  "summary": "(ringkasan 2-3 kalimat tentang perasaan dan kondisi siswa — untuk Guru BK)",
  "daily_condition": "(gambaran kondisi hari-hari siswa dari apa yang diceritakan)",
  "risk_flag": "(pilih satu: normal/perlu_perhatian/darurat)",
  "risk_reason": "(alasan jika risk_flag bukan 'normal', kosong string jika normal)"
}

Pastikan output adalah valid JSON saja, tanpa teks tambahan apapun.`;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SUMMARIZE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,        // Lebih deterministik untuk analisis
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error("Empty response from Groq");

    const parsed = JSON.parse(rawContent) as MiloSummaryResponse;

    // Validasi dan sanitasi
    const validMoods: MoodType[] = ["senang", "sedih", "cemas", "marah", "biasa"];
    const validRisks: RiskFlag[] = ["normal", "perlu_perhatian", "darurat"];

    return {
      mood: validMoods.includes(parsed.mood) ? parsed.mood : "biasa",
      summary: parsed.summary || "Tidak ada ringkasan tersedia.",
      daily_condition: parsed.daily_condition || "",
      risk_flag: validRisks.includes(parsed.risk_flag) ? parsed.risk_flag : "normal",
      risk_reason: parsed.risk_reason || "",
    };
  } catch (error) {
    console.error("Groq summarize error:", error);
    // Fallback summary jika terjadi error
    return {
      mood: "biasa",
      summary: "Ringkasan tidak dapat dibuat karena terjadi kesalahan sistem.",
      daily_condition: "",
      risk_flag: "normal",
      risk_reason: "",
    };
  }
}

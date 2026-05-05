import { createClient } from "@supabase/supabase-js";
import { User, Session, Summary } from "@/types";

// ============================================================
// Supabase Client — Public (anon key, for client-side)
// ============================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Supabase Admin Client — Server-side only (service role key)
// ============================================================
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY. This is a server-only function.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================
// Database Helpers
// ============================================================

/** Ambil user berdasarkan NIS (untuk login siswa) */
export async function getUserByNis(nis: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("nis", nis)
    .eq("role", "siswa")
    .single();

  if (error || !data) return null;
  return data as User;
}

/** Ambil user berdasarkan email (untuk login guru) */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("role", "guru")
    .single();

  if (error || !data) return null;
  return data as User;
}

/** Ambil semua siswa (untuk dashboard guru) */
export async function getAllStudents(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "siswa")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }
  return (data as User[]) || [];
}

/** Buat sesi baru */
export async function createSession(studentId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      student_id: studentId,
      started_at: new Date().toISOString(),
      raw_chat: [],
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating session:", error);
    return null;
  }
  return data as Session;
}

/** Update sesi dengan pesan baru */
export async function updateSessionChat(
  sessionId: string,
  rawChat: object[]
): Promise<boolean> {
  const { error } = await supabase
    .from("sessions")
    .update({ raw_chat: rawChat })
    .eq("id", sessionId);

  return !error;
}

/** Akhiri sesi */
export async function endSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId);

  return !error;
}

/** Simpan ringkasan AI ke database */
export async function saveSummary(summary: Omit<Summary, "id" | "sent_at">): Promise<Summary | null> {
  const { data, error } = await supabase
    .from("summaries")
    .insert({
      ...summary,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.log("Error saving summary:", error);
    return null;
  }
  return data as Summary;
}

/** Ambil ringkasan terbaru per siswa (untuk dashboard guru) */
export async function getLatestSummaries(limit = 50): Promise<Summary[]> {
  const { data, error } = await supabase
    .from("summaries")
    .select(`
      *,
      student:users!student_id (id, name, class, nis)
    `)
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching summaries:", error);
    return [];
  }
  return (data as Summary[]) || [];
}

/** Ambil riwayat sesi siswa tertentu */
export async function getStudentSessions(studentId: string): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("student_id", studentId)
    .order("started_at", { ascending: false });

  if (error) return [];
  return (data as Session[]) || [];
}

/** Ambil summary siswa tertentu */
export async function getStudentSummaries(studentId: string): Promise<Summary[]> {
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("student_id", studentId)
    .order("sent_at", { ascending: false });

  if (error) return [];
  return (data as Summary[]) || [];
}

/** Ambil data siswa berdasarkan ID */
export async function getStudentById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .eq("role", "siswa")
    .single();

  if (error || !data) return null;
  return data as User;
}

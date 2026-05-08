// ============================================================
// MindBridge — TypeScript Types
// ============================================================

export type UserRole = "siswa" | "guru";

export type MoodType = "senang" | "sedih" | "cemas" | "marah" | "biasa";

export type RiskFlag = "normal" | "perlu_perhatian" | "darurat";

// ============================================================
// User & Auth
// ============================================================

export interface User {
  id: string;
  name: string;
  role: UserRole;
  nis?: string;          // NIS siswa (null jika guru)
  email?: string;        // Email (opsional)
  password_hash: string;
  class?: string;        // Kelas siswa (null jika guru)
  created_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  nis?: string;
  email?: string;
  class?: string;
}

// ============================================================
// Session
// ============================================================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  student_id: string;
  started_at: string;
  ended_at?: string;
  raw_chat: ChatMessage[];
  student?: User;
}

// ============================================================
// Summary
// ============================================================

export interface Summary {
  id: string;
  session_id: string;
  student_id: string;
  mood: MoodType;
  summary_text: string;
  daily_condition?: string;
  risk_flag: RiskFlag;
  risk_reason?: string;
  sent_at: string;
  session?: Session;
  student?: User;
}

// ============================================================
// Groq AI Response
// ============================================================

export interface MiloSummaryResponse {
  mood: MoodType;
  summary: string;
  daily_condition: string;
  risk_flag: RiskFlag;
  risk_reason: string;
}

// ============================================================
// Dashboard Stats
// ============================================================

export interface DashboardStats {
  total_students: number;
  normal_count: number;
  perlu_perhatian_count: number;
  darurat_count: number;
  latest_summaries: Summary[];
}

// ============================================================
// API Payloads
// ============================================================

export interface ChatRequest {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface SummarizeRequest {
  session_id: string;
  student_id: string;
}

export interface StudentCreateRequest {
  name: string;
  nis: string;
  class: string;
  email?: string;
  password: string;
}

export interface StudentUpdateRequest extends Partial<StudentCreateRequest> {
  id: string;
}

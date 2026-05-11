"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import Timer from "@/components/Timer";
import { ChatMessage } from "@/types";
import { fetchApi, SESSION_DURATION } from "@/lib/utils";

const STORAGE_KEY = "mindbridge_chat_session";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [timerPaused, setTimerPaused] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<"home" | "logout" | null>(null);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState<number | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoadingRef = useRef(false);

  // Redirect jika bukan siswa
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user.role !== "siswa") {
      router.push("/guru/dashboard");
    }
  }, [status, session, router]);

  // Inisialisasi atau Restore Sesi
  useEffect(() => {
    if (status !== "authenticated" || session?.user.role !== "siswa") return;

    const initSession = async () => {
      // 1. Coba restore dari localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { messages: savedMessages, sessionId: savedSessionId, expiryTime, userId } = JSON.parse(saved);
          
          // Pastikan session milik user yang sama dan belum expired
          if (userId === session.user.id) {
            const remaining = Math.floor((expiryTime - Date.now()) / 1000);
            if (remaining > 0) {
              setMessages(savedMessages);
              setSessionId(savedSessionId);
              setTimerInitialSeconds(remaining);
              setTimerPaused(false);
              return;
            }
          }
        } catch (e) {
          console.error("Failed to parse saved session", e);
        }
        localStorage.removeItem(STORAGE_KEY);
      }

      // 2. Jika tidak ada yang di-restore, buat sesi baru
      const firstName = session.user.name?.split(" ")[0] ?? "";
      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content: `Halo${firstName ? `, ${firstName}` : ""}! 🌤️ Aku Milo, teman curhatmu hari ini.\n\nKamu punya 5 menit untuk cerita apa aja yang ada di pikiranmu. Nggak ada yang salah di sini — semuanya aman.\n\nGimana perasaan kamu sekarang? 💛`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      const { data: newSession, error: sessionError } = await fetchApi<{ session: { id: string } }>("/api/chat/session", {
        method: "POST",
      });
      if (newSession && !sessionError) {
        setSessionId(newSession.session.id);
        setTimerPaused(false);
        
        // Simpan expiry time awal
        const expiryTime = Date.now() + SESSION_DURATION * 1000;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          messages: [welcomeMessage],
          sessionId: newSession.session.id,
          expiryTime,
          userId: session.user.id
        }));
      }
    };
    initSession();
  }, [status, session]);

  // Sync messages ke localStorage saat berubah
  useEffect(() => {
    if (!sessionId || isSessionEnded || status !== "authenticated") return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        messages
      }));
    }
  }, [messages, sessionId, isSessionEnded, status]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Kirim pesan
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isSessionEnded || !sessionId) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    isLoadingRef.current = true;

    const typingMessage: ChatMessage = {
      role: "assistant",
      content: "...",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    const { data, error } = await fetchApi<{ reply: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage.content,
        session_id: sessionId,
      }),
    });

    setMessages((prev) => {
      const withoutTyping = prev.filter((m) => !(m.role === "assistant" && m.content === "..."));
      if (error || !data) {
        return [...withoutTyping, {
          role: "assistant",
          content: "Maaf, Milo lagi gangguan sebentar. Coba kirim lagi ya 💛",
          timestamp: new Date().toISOString(),
        }];
      }
      return [...withoutTyping, {
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      }];
    });

    setIsLoading(false);
    isLoadingRef.current = false;
    if (!isMobile()) inputRef.current?.focus();
  }, [input, isLoading, isSessionEnded, sessionId, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Timer habis
  const handleTimeUp = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsSessionEnded(true);
    setTimerPaused(true);
    setIsSummarizing(true);

    const endMessage: ChatMessage = {
      role: "assistant",
      content: "Waktunya habis! 🌟 Terima kasih sudah mau cerita hari ini. Kamu luar biasa!\n\nAku lagi menyiapkan ringkasan sesimu untuk Guru BK kamu. Tunggu sebentar ya…",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, endMessage]);

    // Tunggu hingga pesan yang sedang dikirim selesai sebelum merangkum
    const maxWait = 10000;
    const started = Date.now();
    while (isLoadingRef.current) {
      if (Date.now() - started > maxWait) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (sessionId && session?.user.id) {
      await fetchApi("/api/summarize", {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          student_id: session.user.id,
        }),
      });
      setIsSummarizing(false);
      router.push(`/siswa/ringkasan?session_id=${sessionId}`);
    }
  }, [sessionId, session, router]);
  // Akhiri sesi lebih awal & Teruskan ke Guru BK
  const handleTeruskanKeGuruBK = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowExitModal(false);
    setIsSessionEnded(true);
    setTimerPaused(true);
    setIsSummarizing(true);

    const endMessage: ChatMessage = {
      role: "assistant",
      content: "Baik, aku akan merangkum sesi ini dan meneruskannya ke Guru BK. Tunggu sebentar ya…",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, endMessage]);

    // Tunggu hingga pesan yang sedang dikirim selesai sebelum merangkum
    const maxWait = 10000;
    const started = Date.now();
    while (isLoadingRef.current) {
      if (Date.now() - started > maxWait) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (sessionId && session?.user.id) {
      await fetchApi("/api/summarize", {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          student_id: session.user.id,
        }),
      });
      setIsSummarizing(false);
      router.push(`/siswa/ringkasan?session_id=${sessionId}`);
    }
  }, [sessionId, session, router]);

  // Keluar tanpa merangkum
  const handleKeluarSaja = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    if (sessionId) {
      await fetchApi("/api/chat/session/end", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });
    }
    if (exitAction === "logout") {
      signOut({ callbackUrl: "/login" });
    } else {
      router.push("/siswa");
    }
  }, [exitAction, router, sessionId]);
  // Loading state
  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#FFF8F6", fontFamily: FONT,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD23F, #FFB800)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", margin: "0 auto 16px",
            boxShadow: "0 4px 20px rgba(255,210,63,0.35)",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            🌤️
          </div>
          <p style={{ color: "#8D7167", fontSize: "15px" }}>Menyiapkan ruang yang aman…</p>
          <style>{`@keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.08)} }`}</style>
        </div>
      </div>
    );
  }

  const firstName = session?.user.name?.split(" ")[0] ?? "Kamu";

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#FFF8F6",
      fontFamily: FONT,
      overflow: "hidden",
    }}>

      {/* ── HEADER ── */}
      <header style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #FFE9E2",
        boxShadow: "0 2px 16px rgba(255,107,44,0.07)",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
        }}>
          {/* Back */}
          <button onClick={() => {
            if (!isSessionEnded) {
              setExitAction("home");
              setShowExitModal(true);
            } else {
              router.push("/siswa");
            }
          }} style={{
            display: "flex", alignItems: "center", gap: "6px",
            textDecoration: "none", color: "#8D7167", cursor: "pointer",
            fontSize: "13px", fontWeight: 600,
            padding: "6px 14px", borderRadius: "999px",
            border: "1px solid #FFE9E2",
            background: "#FAFAFA",
            fontFamily: FONT,
          }}>
            ← Beranda
          </button>

          {/* Milo identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, #FFD23F, #FFB800)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 3px 12px rgba(255,210,63,0.35)",
            }}>
              🌤️
            </div>

            <div>
              <p style={{ margin: 0, fontFamily: HEADING, fontSize: "16px", fontWeight: 600, color: "#261813" }}>
                Milo
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 0 2px rgba(34,197,94,0.2)",
                }} />
                <span style={{ fontSize: "11px", color: "#8D7167" }}>Online & siap mendengarkan</span>
              </div>
            </div>
          </div>

          {/* Timer + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Timer onTimeUp={handleTimeUp} paused={timerPaused} initialSeconds={timerInitialSeconds} />
            <button
              onClick={() => {
                if (!isSessionEnded) {
                  setExitAction("logout");
                  setShowExitModal(true);
                } else {
                  signOut({ callbackUrl: "/login" });
                }
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid #FFE9E2",
                background: "transparent",
                color: "#DC2626",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              🚪 Keluar
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "#FFE9E2" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #FF6B2C, #FF9A5C)",
            width: timerPaused ? "0%" : "40%",
            transition: "width 1s linear",
          }} />
        </div>
      </header>

      {/* ── CHAT MESSAGES ── */}
      <main style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 20px",
        scrollBehavior: "smooth",
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Safe space notice */}
          <div style={{
            textAlign: "center",
            marginBottom: "28px",
            padding: "10px 20px",
            background: "#FFFFFF",
            borderRadius: "999px",
            border: "1px solid #FFE9E2",
            display: "inline-block",
            width: "100%",
            boxSizing: "border-box",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#A89288" }}>
              🔒 Ruang aman • Percakapan ini bersifat rahasia • Hanya 5 menit
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              message={msg}
              isTyping={
                isLoading &&
                idx === messages.length - 1 &&
                msg.role === "assistant" &&
                msg.content === "..."
              }
            />
          ))}
          <div ref={messagesEndRef} style={{ height: "8px" }} />
        </div>
      </main>

      {/* ── INPUT BAR ── */}
      <footer style={{
        background: "#FFFFFF",
        borderTop: "1px solid #FFE9E2",
        boxShadow: "0 -4px 24px rgba(255,107,44,0.06)",
        padding: "16px 20px",
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {isSessionEnded ? (
            /* Session ended state */
            <div style={{
              textAlign: "center",
              padding: "16px",
              background: "#FFF8F6",
              borderRadius: "20px",
              border: "1px solid #FFE9E2",
            }}>
              {isSummarizing ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px", animation: "pulse 1.5s infinite" }}>🌤️</span>
                  <p style={{ margin: 0, color: "#8D7167", fontSize: "14px", fontWeight: 500 }}>
                    Milo sedang membuat ringkasan untukmu…
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, color: "#8D7167", fontSize: "14px" }}>
                  Sesi selesai 🌟 Terima kasih sudah bercerita!
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Input row */}
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                padding: "10px 14px 10px 20px",
                background: inputFocused ? "#FFFFFF" : "#FFF8F6",
                borderRadius: "999px",
                border: `1.5px solid ${inputFocused ? "#FF6B2C" : "#E2BFB3"}`,
                boxShadow: inputFocused ? "0 0 0 3px rgba(255,107,44,0.12)" : "none",
                transition: "all 0.2s",
              }}>
                <textarea
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={isLoading}
                  rows={1}
                  placeholder="Ceritakan perasaanmu… (Enter untuk kirim)"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    fontFamily: FONT,
                    fontSize: "14px",
                    color: "#261813",
                    lineHeight: 1.5,
                    maxHeight: "100px",
                    overflowY: "auto",
                    paddingTop: "4px",
                  }}
                />
                <button
                  id="send-message-btn"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  aria-label="Kirim pesan"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "none",
                    background: (isLoading || !input.trim()) ? "#E2BFB3" : "#FF6B2C",
                    color: "#FFFFFF",
                    fontSize: "18px",
                    cursor: (isLoading || !input.trim()) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: (isLoading || !input.trim()) ? "none" : "0 4px 14px rgba(255,107,44,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  →
                </button>
              </div>

              {/* Hint */}
              <p style={{
                textAlign: "center",
                fontSize: "11px",
                color: "#C4A99A",
                margin: "8px 0 0 0",
              }}>
                Enter untuk kirim • Shift+Enter untuk baris baru • Semua ceritamu aman 🔒
              </p>
            </>
          )}
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.06)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #FFE9E2; border-radius: 99px; }
      `}</style>
      {/* ── EXIT MODAL ── */}
      {showExitModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(38,24,19,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: "24px", padding: "32px 24px",
            width: "100%", maxWidth: "400px", textAlign: "center",
            boxShadow: "0 24px 80px rgba(255,107,44,0.15)", border: "1px solid #FFE9E2"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>👋</div>
            <h2 style={{ fontFamily: HEADING, fontSize: "22px", fontWeight: 600, color: "#261813", margin: "0 0 12px 0" }}>
              Yakin ingin keluar?
            </h2>
            <p style={{ fontSize: "14px", color: "#8D7167", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              Waktu curhatmu masih tersisa. Apa yang ingin kamu lakukan dengan obrolan ini?
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleTeruskanKeGuruBK}
                style={{
                  padding: "14px", borderRadius: "999px", background: "#FF6B2C", color: "#FFFFFF",
                  border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255,107,44,0.3)", fontFamily: FONT
                }}
              >
                Akhiri Sesi & Teruskan ke Guru BK
              </button>
              <button
                onClick={handleKeluarSaja}
                style={{
                  padding: "14px", borderRadius: "999px", background: "#FFF8F6", color: "#DC2626",
                  border: "1px solid #FFE9E2", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: FONT
                }}
              >
                Keluar Saja (Tanpa Merekam Sesi)
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                style={{
                  padding: "14px", borderRadius: "999px", background: "transparent", color: "#8D7167",
                  border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: FONT
                }}
              >
                Batal, Lanjut Curhat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

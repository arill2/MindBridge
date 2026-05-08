"use client";

import { ChatMessage } from "@/types";
import { formatTime } from "@/lib/utils";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";
import { TypingIndicator } from "@/components/LoadingSpinner";

interface ChatBubbleProps {
  message: ChatMessage;
  isTyping?: boolean;
}

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

export default function ChatBubble({ message, isTyping = false }: ChatBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <AnimatedWrapper 
      animation={isAssistant ? "slide-in-left" : "slide-in-right"} 
      delay={0}
    >
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        marginBottom: "20px",
        flexDirection: isAssistant ? "row" : "row-reverse",
      }}>
      {/* Avatar */}
      {isAssistant ? (
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #FFD23F, #FFB800)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0,
          boxShadow: "0 3px 10px rgba(255,210,63,0.35)",
        }} className="animate-milo-pulse hover-scale">
          🌤️
        </div>
      ) : (
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "#FF6B2C",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, color: "#FFF",
          flexShrink: 0, fontFamily: FONT,
          boxShadow: "0 3px 10px rgba(255,107,44,0.30)",
        }} className="hover-scale">
          👤
        </div>
      )}

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        alignItems: isAssistant ? "flex-start" : "flex-end",
        maxWidth: "72%",
      }}>
        {/* Sender name */}
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#A89288",
          fontFamily: FONT,
          paddingLeft: isAssistant ? "4px" : 0,
          paddingRight: isAssistant ? 0 : "4px",
        }}>
          {isAssistant ? "Milo" : "Kamu"}
        </span>

        {/* Bubble */}
        <div style={{
          padding: "12px 18px",
          fontFamily: FONT,
          fontSize: "14px",
          lineHeight: 1.7,
          background: isAssistant ? "#FFFFFF" : "#FF6B2C",
          color: isAssistant ? "#261813" : "#FFFFFF",
          borderRadius: isAssistant ? "4px 20px 20px 20px" : "20px 4px 20px 20px",
          boxShadow: isAssistant
            ? "0 2px 16px rgba(255,107,44,0.08)"
            : "0 4px 20px rgba(255,107,44,0.28)",
          border: isAssistant ? "1px solid #FFE9E2" : "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          transition: "all 0.3s ease",
        }} className="hover-lift">
          {isTyping ? (
            <TypingIndicator />
          ) : (
            message.content
          )}
        </div>

        {/* Timestamp */}
        {!isTyping && message.timestamp && (
          <AnimatedWrapper animation="fade-in" delay={200}>
            <span style={{
              fontSize: "11px",
              color: "#C4A99A",
              fontFamily: FONT,
              paddingLeft: isAssistant ? "4px" : 0,
              paddingRight: isAssistant ? 0 : "4px",
            }}>
              {formatTime(message.timestamp)}
            </span>
          </AnimatedWrapper>
        )}
      </div>
    </div>
    </AnimatedWrapper>
  );
}

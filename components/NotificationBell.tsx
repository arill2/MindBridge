"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface NotificationBellProps {
  initialCount: number;
}

export default function NotificationBell({ initialCount }: NotificationBellProps) {
  const [count, setCount] = useState(initialCount);
  const [isRinging, setIsRinging] = useState(false);
  const lastCountRef = useRef(initialCount);

  useEffect(() => {
    // Listen for new summaries with 'darurat' risk flag
    const channel = supabase
      .channel("summaries-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "summaries",
          filter: "risk_flag=eq.darurat",
        },
        (payload) => {
          console.log("New emergency summary received!", payload);
          setCount((prev) => prev + 1);
          setIsRinging(true);
          
          // Reset ringing animation after 2 seconds
          setTimeout(() => setIsRinging(false), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link 
      href="/guru/darurat" 
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isRinging ? "animate-bell-ring" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <span style={{ fontSize: "24px", cursor: "pointer" }} role="img" aria-label="Notification Bell">
        🔔
      </span>
      {count > 0 && (
        <span 
          key={count} // Force re-render for badge animation
          className="absolute -top-1 -right-1.5 flex items-center justify-center bg-[#DC2626] text-white font-bold rounded-full animate-in zoom-in duration-300"
          style={{
            width: "18px",
            height: "18px",
            fontSize: "10px",
            boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}

      <style jsx global>{`
        @keyframes bell-ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(7deg); }
          60% { transform: rotate(-7deg); }
          70% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
          90% { transform: rotate(3deg); }
          100% { transform: rotate(0); }
        }
        .animate-bell-ring {
          animation: bell-ring 1s ease-in-out infinite;
        }
      `}</style>
    </Link>
  );
}

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChatWidget } from "@shawnos/shared/components"

const GIF_SRC = "/avatars/rem-idle.apng"
const AVATAR_W = 120
const AVATAR_H = 160

export function RemChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarVisible, setAvatarVisible] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setAvatarVisible(false)
      return
    }
    const timer = setTimeout(() => setAvatarVisible(true), 200)
    return () => clearTimeout(timer)
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: "50%",
          backgroundColor: "#FF69B4", color: "white",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Chat with Rem"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    )
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 380,
          zIndex: 9998,
          pointerEvents: "none",
          transform: avatarVisible ? "translateX(0)" : "translateX(100px)",
          opacity: avatarVisible ? 1 : 0,
          transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GIF_SRC}
          alt="Rem"
          style={{
            width: AVATAR_W,
            height: AVATAR_H,
            display: "block",
            animation: "rem-glow-breathe 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes rem-glow-breathe {
            0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.4)); }
            50% { filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.7)); }
          }
        `}</style>
      </div>

      <ChatWidget
        botName="Rem"
        botSubtitle="content-os assistant"
        welcomeMessage="hey - i'm rem. i know everything about content strategy, voice systems, and building in public. what are you working on?"
        suggestedQuestions={[
          "What is voice DNA?",
          "How does the content pipeline work?",
          "What platforms should I focus on?",
        ]}
        placeholder="ask rem anything..."
        accentColor="#FF69B4"
        botId="rem"
        ctaUrl="https://cal.com/shawntenam/30min"
        ctaLabel="Book a Call"
        gateType="substack"
        substackUrl="https://shawntenam.substack.com"
        defaultOpen
        hideBubble
      />
    </>
  )
}

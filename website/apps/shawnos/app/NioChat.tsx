"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChatWidget } from "@shawnos/shared/components"

const VIDEO_SRC = "/avatars/nio-entrance.mp4"
const GIF_SRC = "/avatars/nio-idle.apng"
const ENTRANCE_KEY = "nio-entrance-played"

export function NioChat() {
  const [entranceDone, setEntranceDone] = useState(false)
  const [fading, setFading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(ENTRANCE_KEY) === "1") {
      setEntranceDone(true)
    }
  }, [])

  const finishEntrance = useCallback(() => {
    if (fading) return
    setFading(true)
    sessionStorage.setItem(ENTRANCE_KEY, "1")
    setTimeout(() => {
      setEntranceDone(true)
    }, 500)
  }, [fading])

  // Fallback timeout
  useEffect(() => {
    if (!isOpen || entranceDone) return
    const timer = setTimeout(finishEntrance, 7000)
    return () => clearTimeout(timer)
  }, [isOpen, entranceDone, finishEntrance])

  // Bubble — not open yet
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: "50%",
          backgroundColor: "#4EC373", color: "white",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Chat with Nio"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    )
  }

  // Entrance: full-panel video plays once before chat appears
  if (!entranceDone) {
    return (
      <div
        style={{
          position: "fixed", bottom: 0, right: 0, zIndex: 9999,
          width: "100%", maxWidth: 380,
          height: "min(520px, 100dvh)",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          background: "var(--canvas, #0D1117)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: fading ? 0 : 1,
          transition: "opacity 500ms ease-out",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay muted playsInline
          onEnded={finishEntrance}
          style={{
            width: "100%", height: "100%",
            objectFit: "contain",
            mixBlendMode: "lighten",
          }}
        />
        <button
          onClick={finishEntrance}
          style={{
            position: "absolute", bottom: 16, right: 16,
            fontSize: 11, color: "#8B949E",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono, monospace)", opacity: 0.5,
          }}
        >
          skip
        </button>
      </div>
    )
  }

  // Chat open + entrance done: Nio stands to the left, chat on the right
  return (
    <>
      {/* Nio avatar — fixed to the left of the chat panel, no clipping */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 380,
          zIndex: 9998,
          pointerEvents: "none",
        }}
        className="nio-avatar-container"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GIF_SRC}
          alt="Nio"
          style={{
            width: 320,
            height: 320,
            display: "block",
            animation: "nio-glow-breathe 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Chat panel */}
      <ChatWidget
        botName="Nio"
        botSubtitle="shawnos.ai assistant"
        welcomeMessage="hey - i'm nio. i live inside this monorepo and know everything about context engineering, GTM engineering, and how shawn builds in public. what's up?"
        suggestedQuestions={[
          "What is context engineering?",
          "How does the monorepo work?",
          "What tools does Shawn use?",
        ]}
        placeholder="ask nio anything..."
        accentColor="#4EC373"
        botId="nio"
        ctaUrl="https://cal.com/shawntenam/30min"
        ctaLabel="Book a Call"
        defaultOpen
        hideBubble
      />
    </>
  )
}

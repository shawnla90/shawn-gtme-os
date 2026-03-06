"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChatWidget } from "@shawnos/shared/components"
import { usePostHog } from "posthog-js/react"

const GIF_SRC = "/avatars/nio-idle.apng"
const AVATAR_SIZE = 160 // half of original 320

export function NioChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarVisible, setAvatarVisible] = useState(false)
  const openedAtRef = useRef<number | null>(null)
  const posthog = usePostHog()

  // Slide avatar in after chat opens
  useEffect(() => {
    if (!isOpen) {
      setAvatarVisible(false)
      return
    }
    const timer = setTimeout(() => setAvatarVisible(true), 200)
    return () => clearTimeout(timer)
  }, [isOpen])

  const handleAnalyticsEvent = useCallback((event: string, props?: Record<string, unknown>) => {
    if (!posthog) return

    if (event === "nio_chat_opened") {
      openedAtRef.current = Date.now()
    }

    posthog.capture(event, props)
  }, [posthog])

  const handleClose = useCallback(() => {
    const duration = openedAtRef.current
      ? Math.round((Date.now() - openedAtRef.current) / 1000)
      : 0
    openedAtRef.current = null

    posthog?.capture("nio_chat_closed", { bot: "nio", duration_seconds: duration })
  }, [posthog])

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

  // Chat open: avatar slides to the left, chat on the right
  return (
    <>
      {/* Nio avatar — slides in from right to left of chat panel */}
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
        className="nio-avatar-container"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GIF_SRC}
          alt="Nio"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
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
          "How did you build this bot?",
        ]}
        placeholder="ask nio anything..."
        accentColor="#4EC373"
        botId="nio"
        ctaUrl="https://cal.com/shawntenam/30min"
        ctaLabel="Book a Call"
        gateType="substack"
        substackUrl="https://shawntenam.substack.com"
        onAnalyticsEvent={handleAnalyticsEvent}
        onClose={handleClose}
        defaultOpen
        hideBubble
      />
    </>
  )
}

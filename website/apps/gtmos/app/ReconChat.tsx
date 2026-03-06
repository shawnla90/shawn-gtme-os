"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChatWidget } from "@shawnos/shared/components"
import { usePostHog } from "posthog-js/react"

const GIF_SRC = "/avatars/recon-idle.apng"
const AVATAR_W = 120
const AVATAR_H = 160

export function ReconChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarVisible, setAvatarVisible] = useState(false)
  const openedAtRef = useRef<number | null>(null)
  const posthog = usePostHog()

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

    posthog?.capture("nio_chat_closed", { bot: "recon", duration_seconds: duration })
  }, [posthog])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: "50%",
          backgroundColor: "#F97316", color: "white",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Chat with Recon"
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
          alt="Recon"
          style={{
            width: AVATAR_W,
            height: AVATAR_H,
            display: "block",
            animation: "recon-glow-breathe 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes recon-glow-breathe {
            0%, 100% { filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4)); }
            50% { filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.7)); }
          }
        `}</style>
      </div>

      <ChatWidget
        botName="Recon"
        botSubtitle="gtm-os scout"
        welcomeMessage="hey - i'm recon. i know Clay workflows, outbound infrastructure, pipeline ops, and everything in the GTM knowledge base. what are you building?"
        suggestedQuestions={[
          "How does Clay waterfall enrichment work?",
          "What's the right email warmup process?",
          "How did you build this bot?",
        ]}
        placeholder="ask recon anything..."
        accentColor="#F97316"
        botId="recon"
        ctaUrl="https://cal.com/shawntenam/30min"
        ctaLabel="Book a Call"
        gateType="cta"
        onAnalyticsEvent={handleAnalyticsEvent}
        onClose={handleClose}
        defaultOpen
        hideBubble
      />
    </>
  )
}

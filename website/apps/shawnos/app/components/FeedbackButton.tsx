"use client"

import { useState, type CSSProperties } from "react"
import { usePostHog } from "posthog-js/react"

const STORAGE_KEY = "feedback_submitted"

const ratings = [
  { value: "positive", label: "\u{1F44D}", ariaLabel: "Thumbs up" },
  { value: "neutral", label: "\u{1F610}", ariaLabel: "Neutral" },
  { value: "negative", label: "\u{1F44E}", ariaLabel: "Thumbs down" },
] as const

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(STORAGE_KEY) === "true"
  })
  const posthog = usePostHog()

  if (submitted && !isOpen) return null

  const handleSubmit = () => {
    if (!selectedRating) return

    posthog?.capture("nio_feedback_submitted", {
      bot: "nio",
      rating: selectedRating,
      ...(comment.trim() ? { has_comment: true } : {}),
    })

    localStorage.setItem(STORAGE_KEY, "true")
    setSubmitted(true)

    // Show thank you briefly, then close
    setTimeout(() => setIsOpen(false), 1500)
  }

  const s = {
    trigger: {
      position: "fixed",
      bottom: 24,
      left: 24,
      zIndex: 9998,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      fontSize: 12,
      fontFamily: "var(--font-mono, monospace)",
      color: "var(--text-secondary)",
      backgroundColor: "var(--canvas)",
      border: "1px solid var(--canvas-border)",
      borderRadius: 20,
      cursor: "pointer",
      transition: "border-color 0.15s, color 0.15s",
    } as CSSProperties,
    overlay: {
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    } as CSSProperties,
    modal: {
      width: "100%",
      maxWidth: 340,
      padding: 24,
      backgroundColor: "var(--canvas)",
      border: "1px solid var(--canvas-border)",
      borderRadius: 12,
      fontFamily: "var(--font-mono, monospace)",
      textAlign: "center" as const,
    } as CSSProperties,
    ratingBtn: (active: boolean) => ({
      fontSize: 28,
      padding: "8px 12px",
      background: active ? "var(--canvas-subtle)" : "transparent",
      border: active ? "1px solid #4EC373" : "1px solid transparent",
      borderRadius: 8,
      cursor: "pointer",
      transition: "all 0.15s",
    }) as CSSProperties,
    textarea: {
      width: "100%",
      minHeight: 60,
      padding: "8px 12px",
      fontSize: 13,
      fontFamily: "inherit",
      backgroundColor: "var(--canvas-subtle)",
      border: "1px solid var(--canvas-border)",
      borderRadius: 8,
      color: "var(--text-primary)",
      outline: "none",
      resize: "vertical" as const,
    } as CSSProperties,
    submitBtn: {
      width: "100%",
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "inherit",
      color: "var(--text-on-accent)",
      backgroundColor: "#4EC373",
      border: "none",
      borderRadius: 20,
      cursor: "pointer",
      transition: "opacity 0.15s",
    } as CSSProperties,
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={s.trigger}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)"
            e.currentTarget.style.color = "var(--text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--canvas-border)"
            e.currentTarget.style.color = "var(--text-secondary)"
          }}
          aria-label="Give feedback"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          feedback
        </button>
      )}

      {isOpen && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
          <div style={s.modal}>
            {submitted ? (
              <p style={{ fontSize: 14, color: "#4EC373", fontWeight: 600, margin: 0 }}>
                thanks for the feedback
              </p>
            ) : (
              <>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 16px" }}>
                  how&apos;s the experience?
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                  {ratings.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRating(r.value)}
                      style={s.ratingBtn(selectedRating === r.value)}
                      aria-label={r.ariaLabel}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="tell me more (optional)"
                  style={s.textarea}
                />

                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedRating}
                    style={{ ...s.submitBtn, opacity: selectedRating ? 1 : 0.4 }}
                  >
                    submit
                  </button>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    marginTop: 8, background: "none", border: "none",
                    color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

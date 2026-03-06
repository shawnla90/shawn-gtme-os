"use client"

import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react"
import { useChat } from "@ai-sdk/react"

/* ── Inline SVG Icons ── */

function IconChat({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconSend({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

/* ── Types ── */

export interface ChatWidgetProps {
  botName: string
  botSubtitle: string
  welcomeMessage: string
  suggestedQuestions: string[]
  placeholder: string
  accentColor: string
  botId: string
  ctaUrl: string
  ctaLabel: string
  /** Optional React node to render as avatar in header (replaces default icon) */
  avatarNode?: React.ReactNode
  /** Optional React node shown above the chat panel (e.g. entrance video, persistent avatar) */
  heroNode?: React.ReactNode
  /** Start with panel open (when parent controls bubble/open state) */
  defaultOpen?: boolean
  /** Hide the built-in bubble button (when parent renders its own) */
  hideBubble?: boolean
  /** Gate type: "cta" shows book-a-call link, "substack" shows email signup */
  gateType?: "cta" | "substack"
  /** Substack publication URL for the gate signup form */
  substackUrl?: string
  /** Callback for analytics events (PostHog, etc.) */
  onAnalyticsEvent?: (event: string, props?: Record<string, unknown>) => void
  /** Called when close button is clicked */
  onClose?: () => void
}

/* ── Helpers ── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function getTextContent(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

const INTERNAL_HOSTS = ["shawnos.ai", "thegtmos.ai", "thecontentos.ai"]

function appendUtm(url: string, botId: string): string {
  // Only tag internal links (relative paths or our domains)
  const isRelative = url.startsWith("/")
  const isInternal = !isRelative && INTERNAL_HOSTS.some((h) => url.includes(h))
  if (!isRelative && !isInternal) return url
  const sep = url.includes("?") ? "&" : "?"
  return `${url}${sep}utm_source=chatbot&utm_medium=${botId}`
}

function renderMarkdown(text: string, accentColor: string, botId?: string) {
  return text.split("\n").map((line, i) => {
    // Escape HTML first to prevent XSS
    let html = escapeHtml(line)
    // Then apply markdown transforms on the safe string
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="color:#C9D1D9;font-weight:600">$1</strong>`
    )
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, label: string, href: string) => {
        const finalHref = botId ? appendUtm(href, botId) : href
        return `<a href="${finalHref}" style="color:${escapeHtml(accentColor)};text-decoration:underline;text-underline-offset:2px" target="_blank" rel="noopener noreferrer">${label}</a>`
      }
    )
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      html = `<li style="margin-left:16px;list-style:disc">${html.replace(/^[\s]*[-*]\s/, "")}</li>`
    }
    return (
      <span
        key={i}
        style={{ display: "block", height: line.trim() === "" ? 8 : undefined }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  })
}

const GATE_KEY_PREFIX = "chat_gate_"
const UNLOCK_KEY_PREFIX = "chat_unlocked_"

function getMessageCount(botId: string): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(`${GATE_KEY_PREFIX}${botId}`) || "0", 10)
}

function incrementMessageCount(botId: string): number {
  const next = getMessageCount(botId) + 1
  localStorage.setItem(`${GATE_KEY_PREFIX}${botId}`, String(next))
  return next
}

function isUnlocked(botId: string): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`${UNLOCK_KEY_PREFIX}${botId}`) === "true"
}

function setUnlocked(botId: string) {
  localStorage.setItem(`${UNLOCK_KEY_PREFIX}${botId}`, "true")
}

/* ── Analytics helper ── */

let trackFn: ((event: string, props?: Record<string, string>) => void) | null = null
try {
  if (typeof window !== "undefined") {
    import("@vercel/analytics").then((mod) => { trackFn = mod.track }).catch(() => {})
  }
} catch {}

function trackEvent(event: string, props?: Record<string, string>) {
  trackFn?.(event, props)
}

/* ── Bounce keyframes (injected once) ── */

const BOUNCE_CSS = `
@keyframes chat-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`
let injected = false
function injectKeyframes() {
  if (injected || typeof document === "undefined") return
  const style = document.createElement("style")
  style.textContent = BOUNCE_CSS
  document.head.appendChild(style)
  injected = true
}

/* ── Component ── */

export function ChatWidget({
  botName,
  botSubtitle,
  welcomeMessage,
  suggestedQuestions,
  placeholder,
  accentColor,
  botId,
  ctaUrl,
  ctaLabel,
  avatarNode,
  heroNode,
  defaultOpen,
  hideBubble,
  gateType = "cta",
  substackUrl,
  onAnalyticsEvent,
  onClose,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [gated, setGated] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const [input, setInput] = useState("")
  const [gateEmail, setGateEmail] = useState("")
  const [gateSubmitting, setGateSubmitting] = useState(false)
  const [gateError, setGateError] = useState("")
  const [gateSuccess, setGateSuccess] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status } = useChat()
  const isLoading = status === "submitted" || status === "streaming"

  // Dual-track analytics: Vercel + custom callback
  const fireEvent = useCallback((event: string, props?: Record<string, unknown>) => {
    trackEvent(event, props as Record<string, string>)
    onAnalyticsEvent?.(event, props)
  }, [onAnalyticsEvent])

  useEffect(() => { injectKeyframes() }, [])

  // Admin bypass: type "niounlock" in the input to reset the gate
  useEffect(() => {
    if (input.toLowerCase() === "niounlock") {
      localStorage.removeItem(`${GATE_KEY_PREFIX}${botId}`)
      localStorage.removeItem(`${UNLOCK_KEY_PREFIX}${botId}`)
      setGated(false)
      setUserMsgCount(0)
      setInput("")
    }
  }, [input, botId])
  useEffect(() => {
    setUserMsgCount(getMessageCount(botId))
    // If already unlocked, don't gate
    if (isUnlocked(botId)) setGated(false)
  }, [botId])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, status])
  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || gated) return
      setHasInteracted(true)
      setInput("")
      const count = incrementMessageCount(botId)
      setUserMsgCount(count)
      fireEvent("nio_message_sent", { bot: botId, message_number: count })
      if (count >= 10 && !isUnlocked(botId)) {
        setGated(true)
        fireEvent("nio_gate_triggered", { bot: botId })
        return
      }
      sendMessage({ text })
    },
    [botId, gated, sendMessage, fireEvent]
  )

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); send(input) }

  const handleOpen = () => {
    if (getMessageCount(botId) >= 10 && !isUnlocked(botId)) setGated(true)
    setIsOpen(true)
    fireEvent("nio_chat_opened", { bot: botId })
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
    fireEvent("nio_chat_closed", { bot: botId })
  }

  const handleSubstackSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gateEmail.trim() || !substackUrl) return

    setGateSubmitting(true)
    setGateError("")

    try {
      // Submit to Substack via their public subscribe endpoint
      const pubUrl = substackUrl.replace(/\/$/, "")
      const res = await fetch(`${pubUrl}/api/v1/free`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: gateEmail.trim(),
          first_url: window.location.href,
          first_referrer: document.referrer || "",
        }),
      })

      if (!res.ok) {
        // Even if the API returns an error, Substack often accepts the email
        // We'll unlock anyway since the intent is clear
      }

      // Unlock the gate
      setUnlocked(botId)
      localStorage.removeItem(`${GATE_KEY_PREFIX}${botId}`)
      setGated(false)
      setUserMsgCount(0)
      setGateSuccess(true)
      fireEvent("nio_gate_unlocked", { bot: botId, method: "substack" })

      // Auto-dismiss success state
      setTimeout(() => setGateSuccess(false), 2000)
    } catch {
      // Network error - still unlock (we got their intent + email is in the form)
      setUnlocked(botId)
      localStorage.removeItem(`${GATE_KEY_PREFIX}${botId}`)
      setGated(false)
      setUserMsgCount(0)
      setGateSuccess(true)
      fireEvent("nio_gate_unlocked", { bot: botId, method: "substack" })
      setTimeout(() => setGateSuccess(false), 2000)
    } finally {
      setGateSubmitting(false)
    }
  }

  /* ── Styles ── */

  const s = {
    bubble: {
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 56, height: 56, borderRadius: "50%",
      backgroundColor: accentColor, color: "white",
      border: "none", cursor: "pointer",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      transition: "transform 0.15s ease",
    } as CSSProperties,
    panel: {
      position: "fixed", bottom: 0, right: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", overflow: "hidden",
      width: "100%", maxWidth: 380, height: "min(520px, 100dvh)",
      fontFamily: "var(--font-mono, monospace)",
      borderRadius: "16px 16px 0 0",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    } as CSSProperties,
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#0D1117", borderBottom: "1px solid #30363D",
    } as CSSProperties,
    headerLeft: { display: "flex", alignItems: "center", gap: 8 } as CSSProperties,
    headerIcon: {
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 32, height: 32, borderRadius: "50%",
      backgroundColor: accentColor, color: "white",
    } as CSSProperties,
    headerTitle: { fontSize: 14, fontWeight: 600, color: "#C9D1D9", margin: 0 } as CSSProperties,
    headerSub: { fontSize: 12, color: "#8B949E", margin: 0 } as CSSProperties,
    closeBtn: {
      background: "none", border: "none", cursor: "pointer",
      color: "#8B949E", borderRadius: "50%", padding: 4,
    } as CSSProperties,
    messages: {
      flex: 1, overflowY: "auto", padding: "12px 16px",
      backgroundColor: "#161B22",
      display: "flex", flexDirection: "column", gap: 12,
    } as CSSProperties,
    bubbleMsg: (isUser: boolean) => ({
      maxWidth: "85%", borderRadius: 16, padding: "10px 14px", fontSize: 14,
      ...(isUser
        ? {
            borderTopRightRadius: 4, alignSelf: "flex-end" as const,
            backgroundColor: `${accentColor}1a`, border: `1px solid ${accentColor}33`, color: "#C9D1D9",
          }
        : {
            borderTopLeftRadius: 4, alignSelf: "flex-start" as const,
            backgroundColor: "#0D1117", border: "1px solid #30363D", color: "#C9D1D9",
          }),
    }) as CSSProperties,
    sugBtn: {
      borderRadius: 20, padding: "6px 12px", fontSize: 12, cursor: "pointer",
      border: `1px solid ${accentColor}33`, backgroundColor: "#0D1117", color: accentColor,
      transition: "background-color 0.15s",
    } as CSSProperties,
    form: {
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 12px", backgroundColor: "#0D1117", borderTop: "1px solid #30363D",
    } as CSSProperties,
    input: {
      flex: 1, borderRadius: 20, padding: "10px 16px", fontSize: 14,
      backgroundColor: "#161B22", border: "1px solid #30363D", color: "#C9D1D9",
      outline: "none", fontFamily: "inherit",
    } as CSSProperties,
    sendBtn: {
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
      backgroundColor: accentColor, color: "white", flexShrink: 0,
    } as CSSProperties,
    gate: {
      position: "absolute", inset: 0, zIndex: 10,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 16, padding: "0 24px", textAlign: "center",
      backgroundColor: "rgba(13,17,23,0.95)",
    } as CSSProperties,
    ctaBtn: {
      display: "inline-block", borderRadius: 20, padding: "10px 24px",
      fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none",
      backgroundColor: accentColor, transition: "transform 0.15s",
    } as CSSProperties,
    dot: (delay: number) => ({
      width: 8, height: 8, borderRadius: "50%", backgroundColor: accentColor,
      animation: `chat-bounce 0.6s ease infinite`, animationDelay: `${delay}ms`,
    }) as CSSProperties,
  }

  return (
    <>
      {!isOpen && !hideBubble && (
        <button
          onClick={handleOpen}
          style={s.bubble}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label={`Chat with ${botName}`}
        >
          <IconChat size={24} />
        </button>
      )}

      {isOpen && (
        <div style={s.panel}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              {avatarNode || <div style={s.headerIcon}><IconChat size={16} /></div>}
              <div>
                <h3 style={s.headerTitle}>{botName}</h3>
                <p style={s.headerSub}>{botSubtitle}</p>
              </div>
            </div>
            <button onClick={handleClose} style={s.closeBtn} aria-label="Close chat">
              <IconX />
            </button>
          </div>

          {/* Hero (avatar video, etc.) */}
          {heroNode}

          {/* Messages */}
          <div style={s.messages}>
            <div style={s.bubbleMsg(false)}>{welcomeMessage}</div>

            {!hasInteracted && messages.length === 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {suggestedQuestions.map((q) => (
                  <button key={q} onClick={() => { fireEvent("nio_suggested_question_clicked", { bot: botId, question: q }); send(q) }} style={s.sugBtn}>{q}</button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              const text = getTextContent(m)
              if (!text) return null
              return (
                <div key={m.id} style={s.bubbleMsg(m.role === "user")}>
                  {m.role === "assistant" ? renderMarkdown(text, accentColor, botId) : text}
                </div>
              )
            })}

            {status === "submitted" && (
              <div style={{ ...s.bubbleMsg(false), display: "flex", gap: 4, padding: "12px 14px" }}>
                <span style={s.dot(0)} />
                <span style={s.dot(150)} />
                <span style={s.dot(300)} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Gate */}
          {gated && (
            <div style={s.gate}>
              <div style={{ fontSize: 30 }}>&#128274;</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#C9D1D9", margin: 0 }}>
                You&apos;ve used your {userMsgCount} free messages
              </p>

              {gateType === "substack" && substackUrl ? (
                <>
                  <p style={{ fontSize: 12, color: "#8B949E", margin: 0 }}>
                    subscribe to keep chatting - it&apos;s free
                  </p>
                  {gateSuccess ? (
                    <p style={{ fontSize: 14, color: accentColor, fontWeight: 600, margin: 0 }}>
                      you&apos;re in. welcome.
                    </p>
                  ) : (
                    <form
                      onSubmit={handleSubstackSignup}
                      style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 280 }}
                    >
                      <input
                        type="email"
                        required
                        value={gateEmail}
                        onChange={(e) => setGateEmail(e.target.value)}
                        placeholder="your email"
                        style={{
                          ...s.input,
                          flex: "none",
                          width: "100%",
                          textAlign: "center",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={gateSubmitting || !gateEmail.trim()}
                        style={{
                          ...s.ctaBtn,
                          border: "none",
                          cursor: gateSubmitting ? "wait" : "pointer",
                          opacity: gateSubmitting ? 0.6 : 1,
                        }}
                      >
                        {gateSubmitting ? "subscribing..." : "subscribe & continue"}
                      </button>
                      {gateError && (
                        <p style={{ fontSize: 11, color: "#F85149", margin: 0 }}>{gateError}</p>
                      )}
                    </form>
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: "#8B949E", margin: 0 }}>
                    Want to keep the conversation going?
                  </p>
                  <a
                    href={ctaUrl}
                    onClick={() => fireEvent("nio_cta_clicked", { bot: botId, cta_label: ctaLabel })}
                    style={s.ctaBtn}
                  >
                    {ctaLabel}
                  </a>
                </>
              )}
            </div>
          )}

          {/* Input */}
          <form onSubmit={onSubmit} style={s.form}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={gated ? "Message limit reached" : placeholder}
              disabled={isLoading || gated}
              style={s.input}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || gated}
              style={{ ...s.sendBtn, opacity: (isLoading || !input.trim() || gated) ? 0.4 : 1 }}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

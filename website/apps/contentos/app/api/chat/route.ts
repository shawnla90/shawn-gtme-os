import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { CONTENT_WIKI_ENTRIES, type ContentWikiEntry } from "@shawnos/shared/data/content-wiki"
import { HOW_TO_WIKI_ENTRIES, type HowToWikiEntry } from "@shawnos/shared/data/how-to-wiki"
import { retrieveItems, type RetrievableItem, type RetrievalConfig } from "@shawnos/shared/lib/chat-retrieval"

const MAX_MESSAGE_LENGTH = 10_000
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_PER_MINUTE = 30
const MAX_CONTENT_LENGTH = 2000

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

function checkRateLimit(ip: string, limit: number) {
  const now = Date.now()
  const entry = RATE_LIMIT_MAP.get(ip)
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + 60_000 })
    return { allowed: true, remaining: limit - 1 }
  }
  entry.count++
  const allowed = entry.count <= limit
  return { allowed, remaining: Math.max(0, limit - entry.count) }
}

function truncate(text: string): string {
  if (text.length <= MAX_CONTENT_LENGTH) return text
  return text.slice(0, MAX_CONTENT_LENGTH) + "..."
}

function sectionsToText(sections: { heading: string; content: string }[]): string {
  return sections.map((s) => `## ${s.heading}\n${s.content}`).join("\n\n")
}

function contentWikiToItems(): RetrievableItem[] {
  return CONTENT_WIKI_ENTRIES.map((e: ContentWikiEntry) => ({
    id: `content-${e.id}`,
    title: e.title,
    description: e.description,
    keywords: e.keywords,
    category: `content-wiki/${e.category}`,
    content: truncate(sectionsToText(e.sections)),
    url: `https://thecontentos.ai/content-wiki/${e.id}`,
  }))
}

function howToWikiToItems(): RetrievableItem[] {
  return HOW_TO_WIKI_ENTRIES
    .filter((e: HowToWikiEntry) => e.canonicalSite === "contentos" || !e.canonicalSite)
    .map((e: HowToWikiEntry) => ({
      id: `howto-${e.id}`,
      title: e.title,
      description: e.description,
      keywords: e.keywords,
      category: `how-to/${e.category}`,
      content: truncate(sectionsToText(e.sections)),
      url: `https://thecontentos.ai/how-to/${e.id}`,
    }))
}

const REM_SYNONYMS: Record<string, string[]> = {
  voice: ["voice dna", "tone", "cadence", "writing style", "brand voice"],
  content: ["blog", "newsletter", "substack", "distribution", "repurpose"],
  playbook: ["platform playbook", "template", "framework", "guide"],
  pipeline: ["content pipeline", "workflow", "automation", "ops"],
  seo: ["search", "organic", "ranking", "google"],
  "anti-slop": ["slop", "generic", "ai writing", "quality", "npc", "ai tells", "negation pattern"],
  midjourney: ["image generation", "ai art", "character design", "neobots", "chibi"],
  elevenlabs: ["voice cloning", "text to speech", "tts", "audio", "ai voice"],
  grok: ["scout agent", "x research", "twitter research", "trending"],
  "super whisper": ["speech to text", "voice transcription", "dictation", "voice first"],
  favikon: ["creator score", "influence", "algorithm", "ranking", "analytics"],
  video: ["gif", "screen recording", "veed", "capcut", "davinci resolve", "editing"],
  obsidian: ["notion", "notetaker", "second brain", "knowledge management", "pkm"],
  tools: ["tool stack", "content os", "which ai", "platform strategy"],
}

let cachedConfig: RetrievalConfig | null = null

function getConfig(): RetrievalConfig {
  if (cachedConfig) return cachedConfig
  cachedConfig = {
    items: [...contentWikiToItems(), ...howToWikiToItems()],
    synonymMap: REM_SYNONYMS,
  }
  return cachedConfig
}

function getTextFromUIMessage(msg: UIMessage): string {
  if (!msg.parts) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
}

export async function POST(req: Request) {
  const ip = getClientIP(req)
  const { allowed } = checkRateLimit(ip, RATE_LIMIT_PER_MINUTE)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    })
  }

  const { messages: uiMessages } = await req.json()

  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const lastMsg = uiMessages[uiMessages.length - 1]
  const lastText = getTextFromUIMessage(lastMsg as UIMessage)
  if (!lastText.trim() || lastText.length > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ error: lastText.trim() ? "Message too long" : "Empty message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const lastUserMessage = [...(uiMessages as UIMessage[])]
    .reverse()
    .find((m) => m.role === "user")
  const query = lastUserMessage ? getTextFromUIMessage(lastUserMessage) : ""

  const messages = await convertToModelMessages(uiMessages)
  const articles = retrieveItems(query, getConfig(), 5)

  const articleContext = articles
    .map((a, i) => `--- Article ${i + 1}: ${a.title} ---\nURL: ${a.url}\nCategory: ${a.category}\n\n${a.content}`)
    .join("\n\n")

  const systemPrompt = `You are Rem - the AI assistant that lives inside thecontentos.ai. You help visitors understand content strategy, voice systems, platform playbooks, and how to build a content operating system.

PERSONALITY:
- lowercase energy. direct. no fluff. no em dashes.
- talk like a content strategist who actually ships, not one who just theorizes.
- you live inside the Content OS - a code-based content infrastructure built by Shawn Tenam.

RULES:
- Answer using ONLY the article content below. Do not make up information.
- When referencing an article, use ONLY the exact URL from the context. Format: [Article Title](exact-url). NEVER fabricate URLs.
- Keep responses concise - 2-4 short paragraphs max.
- If the question is outside your knowledge, say so honestly and suggest they check the content wiki or how-to guides.
- Use markdown for bold, links, and short lists when helpful. No headers.

AVAILABLE ARTICLES:
${articleContext}`

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 800,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}

import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { CONTENT_WIKI_ENTRIES, type ContentWikiEntry } from "@shawnos/shared/data/content-wiki"
import { HOW_TO_WIKI_ENTRIES, type HowToWikiEntry } from "@shawnos/shared/data/how-to-wiki"
import { retrieveItems, type RetrievableItem, type RetrievalConfig } from "@shawnos/shared/lib/chat-retrieval"
import fs from "fs"
import path from "path"

const MAX_MESSAGE_LENGTH = 10_000
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_PER_MINUTE = 30
const MAX_CONTENT_LENGTH = 800

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

function loadLatestPosts(): RetrievableItem[] {
  const candidates = [
    path.join(process.cwd(), "..", "..", "..", "data", "linkedin", "posts"),
    path.resolve("/Users/shawnos.ai/shawn-gtme-os/data/linkedin/posts"),
  ]
  let dir = ""
  for (const d of candidates) {
    if (fs.existsSync(d)) { dir = d; break }
  }
  if (!dir) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort().reverse()
  const latest = files[0]
  if (!latest) return []

  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, latest), "utf-8"))
    const posts = data.posts || []
    return posts.slice(0, 10).map((p: { id: number; title: string; hook: string; body: string; cta: string; tags: string[] }) => ({
      id: `post-${data.date}-${p.id}`,
      title: `LinkedIn Post: ${p.title}`,
      description: p.hook,
      keywords: ["linkedin post", "generated post", "remix", ...(p.tags || [])],
      category: "posts/linkedin",
      content: truncate(`${p.body}\n\nCTA: ${p.cta}`),
      url: `https://thecontentos.ai/posts?date=${data.date}`,
    }))
  } catch {
    return []
  }
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
  posts: ["linkedin post", "generated post", "today's posts", "remix", "post ideas", "daily posts"],
  "super whisper": ["speech to text", "voice transcription", "dictation", "voice first"],
  favikon: ["creator score", "influence", "algorithm", "ranking", "analytics"],
  video: ["gif", "screen recording", "veed", "capcut", "davinci resolve", "editing"],
  obsidian: ["notion", "notetaker", "second brain", "knowledge management", "pkm"],
  tools: ["tool stack", "content os", "which ai", "platform strategy"],
  chatbot: ["bot", "how were you built", "neobot", "avatar", "character"],
}

let cachedConfig: RetrievalConfig | null = null

function getConfig(): RetrievalConfig {
  if (cachedConfig) return cachedConfig
  cachedConfig = {
    items: [...contentWikiToItems(), ...howToWikiToItems(), ...loadLatestPosts()],
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
- RESPONSE STYLE: give a 2-3 sentence answer that hooks the reader, then link to the full article for depth. think trailer, not feature film. tease the insight, don't dump it. max 2 short paragraphs.
- If the question touches multiple articles, give one sentence per article with its link. let the reader choose their path.
- If the question is outside your knowledge, say so and suggest they explore the content wiki or how-to guides.
- Use markdown for bold and links. Short bullet lists only when listing multiple articles. No headers. No walls of text.
- If the user asks about today's posts, linkedin posts, or wants to remix/rework a post, reference the post content from your context. you can help them spin it, adjust the tone, or adapt it for a different platform.

AVAILABLE ARTICLES:
${articleContext}`

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 500,
    temperature: 0.8,
  })

  return result.toUIMessageStreamResponse()
}

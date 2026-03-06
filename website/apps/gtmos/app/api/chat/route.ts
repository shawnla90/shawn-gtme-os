import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { CLAY_WIKI_ENTRIES, type ClayWikiEntry } from "@shawnos/shared/data/clay-wiki"
import { GTM_CATEGORIES, type GTMCategory } from "@shawnos/shared/data/gtm-terms"
import { EMAIL_CATEGORIES, type EmailCategory } from "@shawnos/shared/data/email-infrastructure"
import { HOW_TO_WIKI_ENTRIES, type HowToWikiEntry } from "@shawnos/shared/data/how-to-wiki"
import { ENGINEERING_CATEGORIES, type KnowledgeCategory, toSlug } from "@shawnos/shared/data/engineering-terms"
import { retrieveItems, type RetrievableItem, type RetrievalConfig } from "@shawnos/shared/lib/chat-retrieval"

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

/* ── knowledge source adapters ── */

function clayWikiToItems(): RetrievableItem[] {
  return CLAY_WIKI_ENTRIES.map((e: ClayWikiEntry) => ({
    id: `clay-${e.id}`,
    title: e.title,
    description: e.description,
    keywords: e.keywords,
    category: `clay-wiki/${e.category}`,
    content: truncate(sectionsToText(e.sections)),
    url: `https://thegtmos.ai/clay-wiki/${e.id}`,
  }))
}

function gtmTermsToItems(): RetrievableItem[] {
  return GTM_CATEGORIES.flatMap((cat: GTMCategory) =>
    cat.terms.map((t) => ({
      id: `gtm-${t.id}`,
      title: t.name,
      description: t.definition,
      keywords: t.related,
      category: `knowledge/gtm/${cat.id}`,
      content: truncate(`${t.definition}\n\nWhy it matters: ${t.whyItMatters}\n\nHow you use it: ${t.howYouUseIt}`),
      url: `https://thegtmos.ai/knowledge/gtm/${cat.id}#${t.id}`,
    }))
  )
}

function emailInfraToItems(): RetrievableItem[] {
  return EMAIL_CATEGORIES.flatMap((cat: EmailCategory) =>
    cat.terms.map((t) => ({
      id: `email-${t.id}`,
      title: t.name,
      description: t.definition,
      keywords: t.related,
      category: `knowledge/email/${cat.id}`,
      content: truncate(`${t.definition}\n\nWhy it matters: ${t.whyItMatters}\n\nHow you use it: ${t.howYouUseIt}`),
      url: `https://thegtmos.ai/knowledge/email/${cat.id}#${t.id}`,
    }))
  )
}

function howToWikiToItems(): RetrievableItem[] {
  return HOW_TO_WIKI_ENTRIES
    .filter((e: HowToWikiEntry) => e.canonicalSite === "gtmos" || !e.canonicalSite)
    .map((e: HowToWikiEntry) => ({
      id: `howto-${e.id}`,
      title: e.title,
      description: e.description,
      keywords: e.keywords,
      category: `how-to/${e.category}`,
      content: truncate(sectionsToText(e.sections)),
      url: `https://thegtmos.ai/how-to/${e.id}`,
    }))
}

function engineeringToItems(): RetrievableItem[] {
  return ENGINEERING_CATEGORIES.flatMap((cat: KnowledgeCategory) =>
    cat.terms.map((t) => ({
      id: `eng-${toSlug(t.name)}`,
      title: t.name,
      description: t.definition,
      keywords: t.related,
      category: `knowledge/engineering`,
      content: truncate(`${t.definition}\n\nWhy it matters: ${t.whyItMatters}\n\nHow you use it: ${t.howYouUseIt}`),
      url: `https://shawnos.ai/knowledge/${toSlug(t.name)}`,
    }))
  )
}

const RECON_SYNONYMS: Record<string, string[]> = {
  clay: ["clay.com", "waterfall", "enrichment", "data provider", "claygent"],
  enrichment: ["waterfall enrichment", "data enrichment", "append", "lookup", "provider"],
  outbound: ["cold email", "cold outreach", "prospecting", "sdr", "bdr", "sales development"],
  email: ["inbox", "deliverability", "sending", "mailbox", "smtp"],
  warmup: ["domain warming", "email warmup", "warm up", "ramp", "reputation"],
  pipeline: ["sales pipeline", "deal flow", "funnel", "qualified leads"],
  icp: ["ideal customer profile", "target account", "persona", "buyer"],
  sequence: ["email sequence", "cadence", "drip", "follow up", "touchpoint"],
  gtm: ["go to market", "go-to-market", "revenue", "growth"],
  abm: ["account based", "account-based marketing", "target accounts", "tier 1"],
  crm: ["attio", "hubspot", "salesforce", "deal tracking", "contact management"],
  dns: ["spf", "dkim", "dmarc", "mx record", "domain records"],
  "secondary domains": ["sending domains", "domain rotation", "burner domains"],
  scoring: ["lead scoring", "intent", "signal", "buying signal", "fit score"],
  personalization: ["custom fields", "dynamic content", "merge tags", "first line"],
  mcp: ["model context protocol", "ai tools", "claude tools", "agent tools"],
  agent: ["ai agent", "autonomous", "automation", "workflow agent"],
  deploy: ["ship", "launch", "go live", "production", "vercel"],
  chatbot: ["bot", "how were you built", "neobot", "avatar", "character"],
}

let cachedConfig: RetrievalConfig | null = null

function getConfig(): RetrievalConfig {
  if (cachedConfig) return cachedConfig
  cachedConfig = {
    items: [
      ...clayWikiToItems(),
      ...gtmTermsToItems(),
      ...emailInfraToItems(),
      ...howToWikiToItems(),
      ...engineeringToItems(),
    ],
    synonymMap: RECON_SYNONYMS,
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

  const systemPrompt = `You are Recon - the AI scout that lives inside thegtmos.ai. You help visitors understand GTM infrastructure, Clay workflows, outbound pipeline, email deliverability, and how to build a go-to-market operating system.

PERSONALITY:
- lowercase energy. direct. no fluff. no em dashes.
- talk like an ops engineer who runs pipeline for a living, not a consultant who makes slides about it.
- you live inside the GTM OS - a code-based go-to-market infrastructure built by Shawn Tenam.
- scout/recon vibes. you've seen what works and what doesn't in the field.

RULES:
- Answer using ONLY the article content below. Do not make up information.
- When referencing an article, use ONLY the exact URL from the context. Format: [Article Title](exact-url). NEVER fabricate URLs.
- RESPONSE STYLE: give a 2-3 sentence answer that hooks the reader, then link to the full article for depth. think trailer, not feature film. tease the insight, don't dump it. max 2 short paragraphs.
- If the question touches multiple articles, give one sentence per article with its link. let the reader choose their path.
- If the question is outside your knowledge, say so and suggest they explore the knowledge base, clay wiki, or how-to guides.
- Use markdown for bold and links. Short bullet lists only when listing multiple articles. No headers. No walls of text.

AVAILABLE ARTICLES:
${articleContext}`

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 500,
    temperature: 0.5,
  })

  return result.toUIMessageStreamResponse()
}

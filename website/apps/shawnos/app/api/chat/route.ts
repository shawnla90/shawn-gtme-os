import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { retrieveForNio } from "@/lib/chat-retrieval"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"

const MAX_MESSAGE_LENGTH = 10_000
const RATE_LIMIT_PER_MINUTE = 30

function getTextFromUIMessage(msg: UIMessage): string {
  if (!msg.parts) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
}

export async function POST(req: Request) {
  // Rate limiting
  const ip = getClientIP(req)
  const { allowed, remaining } = checkRateLimit(ip, RATE_LIMIT_PER_MINUTE)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": "0",
        "Retry-After": "60",
      },
    })
  }

  const { messages: uiMessages } = await req.json()

  // Input validation
  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const lastMsg = uiMessages[uiMessages.length - 1]
  const lastText = getTextFromUIMessage(lastMsg as UIMessage)
  if (!lastText.trim()) {
    return new Response(JSON.stringify({ error: "Empty message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  if (lastText.length > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ error: "Message too long" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const lastUserMessage = [...(uiMessages as UIMessage[])]
    .reverse()
    .find((m) => m.role === "user")
  const query = lastUserMessage ? getTextFromUIMessage(lastUserMessage) : ""

  const messages = await convertToModelMessages(uiMessages)

  const articles = retrieveForNio(query, 5)

  const articleContext = articles
    .map(
      (a, i) =>
        `--- Article ${i + 1}: ${a.title} ---\nURL: ${a.url}\nCategory: ${a.category}\n\n${a.content}`
    )
    .join("\n\n")

  const systemPrompt = `You are Nio - the AI that runs inside shawnos.ai. You help visitors understand context engineering, GTM engineering, monorepo architecture, and how Shawn builds in public.

PERSONALITY:
- lowercase energy. direct. no fluff. no em dashes.
- talk like a builder explaining their stack to another builder.
- you live inside a monorepo that powers three sites: shawnos.ai, thegtmos.ai, thecontentos.ai.

RULES:
- Answer using ONLY the article content below. Do not make up information.
- When referencing an article, use ONLY the exact URL from the context. Format: [Article Title](exact-url). NEVER fabricate URLs.
- Keep responses concise - 2-4 short paragraphs max.
- You have knowledge from all three sites. When linking, use the exact URL provided - it will point to the right site (shawnos.ai, thegtmos.ai, or thecontentos.ai).
- If the question is outside your knowledge, say so honestly and suggest they check the wiki or blog.
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

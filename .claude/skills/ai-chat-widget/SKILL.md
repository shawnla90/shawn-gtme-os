# Skill: AI Chat Widget for Content Sites

## What This Does

Adds a floating AI chat widget to any Next.js content site. Visitors ask questions, get streaming answers grounded in the site's own articles. No vector DB needed — keyword retrieval against MDX frontmatter handles <100 articles cleanly.

**Proven on:** theplumbernyc.com (34 articles, Gemini Flash, ~$0.0005/query)

## When to Use

- Content site with 10-100 MDX/MD articles
- Want to surface existing content via conversational UI
- Need it cheap (<$5/month at normal traffic)
- Don't want to set up embeddings/vector infra

## Architecture

```
[Chat Bubble] → [Chat Panel (useChat)] → [POST /api/chat]
                                              ↓
                                    [Keyword Retrieval]
                                    (score articles by query)
                                              ↓
                                    [Top 3-5 articles as context]
                                              ↓
                                    [streamText → Gemini Flash]
                                              ↓
                                    [Streaming response back to UI]
```

## Implementation (3 files + 2 edits)

### 1. `lib/chat-retrieval.ts`
Keyword retrieval engine. Customize:
- **`SYNONYM_MAP`** — domain-specific term expansions
- **Content loaders** — swap `getHowToArticles()` / `getNycGuides()` for your content functions
- **URL prefix mapping** — match your site's routing (`/blog/`, `/docs/`, etc.)
- **Absolute domain** — hardcode your production domain in URLs so LLM doesn't hallucinate

Scoring weights: Tag exact +10, Title +8, Slug +6, Category +5, Description +3, Bigram +15, Full query +20

### 2. `app/api/chat/route.ts`
Streaming endpoint. Customize:
- **System prompt** — persona, tone, rules, domain expertise
- **Model** — `google("gemini-2.0-flash")` is cheapest. Can swap to Haiku, GPT-4o-mini, etc.
- **`maxOutputTokens`** — 800 keeps responses concise
- **`temperature`** — 0.7 for conversational, lower for factual

### 3. `components/chat/chat-widget.tsx`
Full UI in one file. Customize:
- **Colors** — swap Tailwind classes to match your design system
- **`WELCOME_MESSAGE`** — first message visitors see
- **`SUGGESTED_QUESTIONS`** — 3 pills shown before first interaction
- **Panel size** — default 380x520, mobile full-width bottom sheet

### 4. Edits
- `app/layout.tsx` — add `<ChatWidget />` after `<Footer />`
- `.env.local` — add `GOOGLE_GENERATIVE_AI_API_KEY`

## Dependencies

```bash
npm install ai @ai-sdk/google @ai-sdk/react
```

Swap `@ai-sdk/google` for `@ai-sdk/anthropic` or `@ai-sdk/openai` if preferred.

## AI SDK v6 Gotchas (CRITICAL)

These burned us. Don't repeat:

| Old (v4/v5) | New (v6) |
|---|---|
| `import { useChat } from "ai/react"` | `import { useChat } from "@ai-sdk/react"` |
| `useChat` returns `input, handleInputChange, handleSubmit, isLoading` | Returns `sendMessage, status` — manage input state yourself |
| `result.toDataStreamResponse()` | `result.toUIMessageStreamResponse()` |
| `maxTokens` | `maxOutputTokens` |
| Messages have `content: string` | Messages have `parts: [{type: "text", text: "..."}]` |
| Pass `messages` directly to `streamText` | Must `await convertToModelMessages(messages)` first |
| `useChat({ api: "/api/chat" })` | Default is `/api/chat`, no `api` option — use `transport` for custom endpoints |

## LLM URL Hallucination Fix

LLMs will fabricate domains if given relative URLs. Always:
1. Provide **absolute URLs** in article context (`https://yourdomain.com/path`)
2. Add to system prompt: "use ONLY the exact URL provided... NEVER fabricate or guess URLs"

## Cost Reference

| Model | Per Query | 100/day Monthly |
|---|---|---|
| Gemini 2.0 Flash | ~$0.0005 | ~$1.50 |
| Claude Haiku 4.5 | ~$0.001 | ~$3.00 |
| GPT-4o-mini | ~$0.001 | ~$3.00 |

## Reference Implementation

Full working code: `~/Desktop/nyc-plumbing-engine/`
- `lib/chat-retrieval.ts`
- `app/api/chat/route.ts`
- `components/chat/chat-widget.tsx`

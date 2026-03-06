import path from "path"
import { CONTEXT_WIKI_ENTRIES, type ContextWikiEntry } from "@shawnos/shared/data/context-wiki"
import { CLAY_WIKI_ENTRIES, type ClayWikiEntry } from "@shawnos/shared/data/clay-wiki"
import { CONTENT_WIKI_ENTRIES, type ContentWikiEntry } from "@shawnos/shared/data/content-wiki"
import { HOW_TO_WIKI_ENTRIES, type HowToWikiEntry } from "@shawnos/shared/data/how-to-wiki"
import { ENGINEERING_CATEGORIES, toSlug } from "@shawnos/shared/data/engineering-terms"
import { GTM_CATEGORIES } from "@shawnos/shared/data/gtm-terms"
import { getAllPosts } from "@shawnos/shared/lib"
import { retrieveItems, type RetrievableItem, type RetrievalConfig } from "@shawnos/shared/lib/chat-retrieval"

const MAX_CONTENT_LENGTH = 800

function truncate(text: string): string {
  if (text.length <= MAX_CONTENT_LENGTH) return text
  return text.slice(0, MAX_CONTENT_LENGTH) + "..."
}

function sectionsToText(sections: { heading: string; content: string }[]): string {
  return sections.map((s) => `## ${s.heading}\n${s.content}`).join("\n\n")
}

/* ── URL helpers per content type ── */

const URLS: Record<string, { base: string; prefix: string }> = {
  "context-wiki": { base: "https://shawnos.ai", prefix: "/context-wiki" },
  "clay-wiki": { base: "https://thegtmos.ai", prefix: "/clay-wiki" },
  "content-wiki": { base: "https://thecontentos.ai", prefix: "/content-wiki" },
  "how-to": { base: "https://shawnos.ai", prefix: "/how-to" },
  "engineering": { base: "https://shawnos.ai", prefix: "/knowledge" },
  "gtm": { base: "https://thegtmos.ai", prefix: "/knowledge" },
  "blog": { base: "https://shawnos.ai", prefix: "/blog" },
}

/* ── Build item lists ── */

function contextWikiToItems(): RetrievableItem[] {
  return CONTEXT_WIKI_ENTRIES.map((e: ContextWikiEntry) => ({
    id: `ctx-${e.id}`,
    title: e.title,
    description: e.description,
    keywords: e.keywords,
    category: `context-wiki/${e.category}`,
    content: truncate(sectionsToText(e.sections)),
    url: `${URLS["context-wiki"].base}${URLS["context-wiki"].prefix}/${e.id}`,
  }))
}

function clayWikiToItems(): RetrievableItem[] {
  return CLAY_WIKI_ENTRIES.map((e: ClayWikiEntry) => ({
    id: `clay-${e.id}`,
    title: e.title,
    description: e.description,
    keywords: e.keywords,
    category: `clay-wiki/${e.category}`,
    content: truncate(sectionsToText(e.sections)),
    url: `${URLS["clay-wiki"].base}${URLS["clay-wiki"].prefix}/${e.id}`,
  }))
}

function contentWikiToItems(): RetrievableItem[] {
  return CONTENT_WIKI_ENTRIES.map((e: ContentWikiEntry) => ({
    id: `content-${e.id}`,
    title: e.title,
    description: e.description,
    keywords: e.keywords,
    category: `content-wiki/${e.category}`,
    content: truncate(sectionsToText(e.sections)),
    url: `${URLS["content-wiki"].base}${URLS["content-wiki"].prefix}/${e.id}`,
  }))
}

function howToWikiToItems(): RetrievableItem[] {
  return HOW_TO_WIKI_ENTRIES.map((e: HowToWikiEntry) => {
    const siteBase = e.canonicalSite === "gtmos"
      ? "https://thegtmos.ai"
      : e.canonicalSite === "contentos"
        ? "https://thecontentos.ai"
        : "https://shawnos.ai"
    return {
      id: `howto-${e.id}`,
      title: e.title,
      description: e.description,
      keywords: e.keywords,
      category: `how-to/${e.category}`,
      content: truncate(sectionsToText(e.sections)),
      url: `${siteBase}/how-to/${e.id}`,
    }
  })
}

function engineeringTermsToItems(): RetrievableItem[] {
  const items: RetrievableItem[] = []
  for (const cat of ENGINEERING_CATEGORIES) {
    for (const term of cat.terms) {
      const slug = toSlug(term.name)
      items.push({
        id: `eng-${slug}`,
        title: term.name,
        description: term.definition,
        keywords: term.related,
        category: `engineering/${cat.name}`,
        content: truncate(
          `${term.definition}\n\nWhy it matters: ${term.whyItMatters}\n\nHow I use it: ${term.howYouUseIt}`
        ),
        url: `${URLS["engineering"].base}${URLS["engineering"].prefix}/${slug}`,
      })
    }
  }
  return items
}

function gtmTermsToItems(): RetrievableItem[] {
  const items: RetrievableItem[] = []
  for (const cat of GTM_CATEGORIES) {
    for (const term of cat.terms) {
      items.push({
        id: `gtm-${term.id}`,
        title: term.name,
        description: term.definition,
        keywords: term.related,
        category: `gtm/${cat.name}`,
        content: truncate(
          `${term.definition}\n\nWhy it matters: ${term.whyItMatters}\n\nHow I use it: ${term.howYouUseIt}`
        ),
        url: `${URLS["gtm"].base}${URLS["gtm"].prefix}/${term.id}`,
      })
    }
  }
  return items
}

function blogPostsToItems(): RetrievableItem[] {
  const contentDir = path.join(process.cwd(), "../../../content/website/final")
  try {
    return getAllPosts(contentDir).map((p) => ({
      id: `blog-${p.slug}`,
      title: p.title,
      description: p.excerpt,
      keywords: p.category ? [p.category] : [],
      category: p.category || "blog",
      content: truncate(p.content),
      url: `${URLS["blog"].base}${URLS["blog"].prefix}/${p.slug}`,
    }))
  } catch {
    return []
  }
}

/* ── Synonym map (covers all three sites) ── */

const NIO_SYNONYMS: Record<string, string[]> = {
  context: ["claude.md", "context window", "context file", "CLAUDE.md", "system prompt"],
  agent: ["subagent", "agentic", "autonomous", "agent team"],
  mcp: ["model context protocol", "mcp server", "tools"],
  cursor: ["ide", "editor", "windsurf", "vs code"],
  "claude code": ["cli", "command line", "terminal"],
  monorepo: ["turborepo", "workspace", "packages"],
  deploy: ["ship", "push", "vercel", "deployment"],
  prompt: ["system prompt", "instruction", "context"],
  cost: ["pricing", "spend", "tokens", "api cost", "budget"],
  seo: ["search", "organic", "ranking", "google"],
  gtm: ["go to market", "go-to-market", "pipeline", "outbound"],
  remotion: ["video", "programmatic video"],
  blog: ["post", "article", "writing"],
  skill: ["skills", "slash command", "SKILL.md"],
  clay: ["enrichment", "waterfall", "clay.com", "data enrichment", "workflow"],
  outbound: ["cold email", "sequence", "campaign", "prospecting"],
  enrichment: ["clay", "waterfall", "data", "apollo", "clearbit"],
  content: ["blog", "newsletter", "substack", "distribution", "repurpose"],
  hubspot: ["crm", "deals", "contacts", "pipeline"],
  email: ["cold email", "deliverability", "warmup", "instantly", "smartlead"],
  chatbot: ["bot", "how were you built", "neobot", "avatar", "character"],
}

/* ── Cache + export ── */

let cachedConfig: RetrievalConfig | null = null

function getConfig(): RetrievalConfig {
  if (cachedConfig) return cachedConfig
  cachedConfig = {
    items: [
      ...contextWikiToItems(),
      ...clayWikiToItems(),
      ...contentWikiToItems(),
      ...howToWikiToItems(),
      ...engineeringTermsToItems(),
      ...gtmTermsToItems(),
      ...blogPostsToItems(),
    ],
    synonymMap: NIO_SYNONYMS,
  }
  return cachedConfig
}

export function retrieveForNio(query: string, maxResults: number = 5): RetrievableItem[] {
  return retrieveItems(query, getConfig(), maxResults)
}

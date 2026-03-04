/**
 * Shared chat retrieval engine - generic scoring + synonym expansion.
 * Each site builds its own RetrievableItem[] and synonym map,
 * then calls retrieveItems() with its config.
 */

export interface RetrievableItem {
  id: string
  title: string
  description: string
  keywords: string[]
  category: string
  content: string
  url: string
}

export interface RetrievalConfig {
  items: RetrievableItem[]
  synonymMap: Record<string, string[]>
}

function expandWithSynonyms(
  words: string[],
  synonymMap: Record<string, string[]>
): string[] {
  const expanded = new Set(words)
  for (const word of words) {
    const lower = word.toLowerCase()
    if (synonymMap[lower]) {
      for (const syn of synonymMap[lower]) expanded.add(syn)
    }
    for (const [key, syns] of Object.entries(synonymMap)) {
      if (syns.includes(lower)) expanded.add(key)
    }
  }
  return Array.from(expanded)
}

function scoreItem(query: string, item: RetrievableItem, synonymMap: Record<string, string[]>): number {
  const queryLower = query.toLowerCase()
  const words = queryLower.split(/\s+/).filter((w) => w.length > 2)
  const expandedWords = expandWithSynonyms(words, synonymMap)

  const titleLower = item.title.toLowerCase()
  const descLower = item.description.toLowerCase()
  const idLower = item.id.toLowerCase()
  const categoryLower = item.category.toLowerCase()
  const tags = item.keywords.map((k) => k.toLowerCase())

  let score = 0

  for (const word of expandedWords) {
    if (tags.includes(word)) score += 10
    else if (tags.some((t) => t.includes(word) || word.includes(t))) score += 5
    if (titleLower.includes(word)) score += 8
    if (idLower.includes(word)) score += 6
    if (categoryLower.includes(word)) score += 5
    if (descLower.includes(word)) score += 3
  }

  // Bigram bonus
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (titleLower.includes(bigram) || descLower.includes(bigram) || tags.some((t) => t.includes(bigram))) {
      score += 15
    }
  }

  // Full query bonus
  if (titleLower.includes(queryLower) || descLower.includes(queryLower)) {
    score += 20
  }

  return score
}

export function retrieveItems(
  query: string,
  config: RetrievalConfig,
  maxResults: number = 5
): RetrievableItem[] {
  const { items, synonymMap } = config

  const scored = items
    .map((item) => ({ item, score: scoreItem(query, item, synonymMap) }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)

  // Always return at least 3 if available
  const minResults = Math.min(3, items.length)
  if (scored.length < minResults) {
    const remaining = items
      .filter((item) => !scored.some((s) => s.item.id === item.id))
      .slice(0, minResults - scored.length)
    scored.push(...remaining.map((item) => ({ item, score: 0 })))
  }

  return scored.map((e) => e.item)
}

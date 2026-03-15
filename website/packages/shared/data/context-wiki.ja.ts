/**
 * ShawnOS - Context Wiki Data (Japanese)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 */

import type { ContextWikiEntry, ContextWikiCategory } from './context-wiki'
import { PART1 } from './context-wiki-ja-part1'
import { PART2 } from './context-wiki-ja-part2'
import { PART3, CATEGORIES_JA } from './context-wiki-ja-part3'

export const CONTEXT_WIKI_CATEGORIES_JA: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = CATEGORIES_JA

export const CONTEXT_WIKI_ENTRIES_JA: ContextWikiEntry[] = [
  ...PART1,
  ...PART2,
  ...PART3,
]

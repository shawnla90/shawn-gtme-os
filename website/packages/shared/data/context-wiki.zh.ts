/**
 * ShawnOS - Context Wiki Data (Simplified Chinese)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 */

import type { ContextWikiEntry, ContextWikiCategory } from './context-wiki'
import { PART1 } from './context-wiki-zh-part1'
import { PART2 } from './context-wiki-zh-part2'
import { PART3, CATEGORIES_ZH } from './context-wiki-zh-part3'

export const CONTEXT_WIKI_CATEGORIES_ZH: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = CATEGORIES_ZH

export const CONTEXT_WIKI_ENTRIES_ZH: ContextWikiEntry[] = [
  ...PART1,
  ...PART2,
  ...PART3,
]

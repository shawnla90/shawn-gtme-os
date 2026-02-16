/**
 * ShawnOS — Context Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 *
 * Stub: Agent 1 populates CONTEXT_WIKI_ENTRIES with all 17 entries.
 */

/* ── types (mirror Clay Wiki) ──────────────────────── */

export interface WikiSection {
  heading: string
  content: string
  type: 'prose' | 'pattern' | 'code' | 'anti-pattern' | 'pro-tip' | 'formula'
}

export type ContextWikiCategory =
  | 'foundations'
  | 'modes'
  | 'infrastructure'
  | 'code'

export interface ContextWikiEntry {
  id: string
  title: string
  subtitle: string
  category: ContextWikiCategory
  description: string
  keywords: string[]
  sections: WikiSection[]
  related: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const CONTEXT_WIKI_CATEGORIES: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description:
      'What context engineering is, how to build a context repo, and how to organize knowledge so AI actually uses it',
    prompt: '$ cd ~/context-wiki/foundations/',
  },
  {
    id: 'modes',
    label: 'Modes and Workflows',
    description:
      'How to think about plan mode, agent mode, parallel execution, skills, and model selection',
    prompt: '$ cd ~/context-wiki/modes/',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    description:
      'Git, GitHub, deployments, monorepos, and scheduled automation for GTM engineers',
    prompt: '$ cd ~/context-wiki/infrastructure/',
  },
  {
    id: 'code',
    label: 'Code and Automation',
    description:
      'Python scripts, MCP servers, project configuration, and skill tree visualization',
    prompt: '$ cd ~/context-wiki/code/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getContextWikiEntry(slug: string): ContextWikiEntry | undefined {
  return CONTEXT_WIKI_ENTRIES.find((e) => e.id === slug)
}

/* ── wiki entries (Agent 1 populates all 17) ──────── */

export const CONTEXT_WIKI_ENTRIES: ContextWikiEntry[] = []

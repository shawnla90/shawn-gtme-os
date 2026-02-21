/** Data-driven content — imports real counts from @shawnos/shared */

import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki';
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki';
import { CONTEXT_WIKI_ENTRIES } from '@shawnos/shared/data/context-wiki';
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki';
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms';
import { EMAIL_CATEGORIES } from '@shawnos/shared/data/email-infrastructure';
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms';

/** Flattened term count for category-based data */
const countTerms = (categories: { terms: unknown[] }[]) =>
  categories.reduce((sum, cat) => sum + cat.terms.length, 0);

/** Wiki montage data — one card per knowledge base */
export const WIKI_MONTAGE = [
  {
    name: 'Clay Wiki',
    count: CLAY_WIKI_ENTRIES.length,
    label: 'pages',
    highlights: ['Clay Enrichment', 'Claygent Agents', 'Waterfall Logic'],
  },
  {
    name: 'Context Wiki',
    count: CONTEXT_WIKI_ENTRIES.length,
    label: 'pages',
    highlights: ['Context Engineering', 'CLAUDE.md', 'MCP Servers'],
  },
  {
    name: 'How-To Wiki',
    count: HOW_TO_WIKI_ENTRIES.length,
    label: 'guides',
    highlights: ['Claude Code Quickstart', 'Parallel Agents', 'OpenClaw Setup'],
  },
  {
    name: 'Content Wiki',
    count: CONTENT_WIKI_ENTRIES.length,
    label: 'pages',
    highlights: ['Voice System', 'Anti-Slop', 'Platform Algorithms'],
  },
  {
    name: 'GTM Knowledge',
    count: countTerms(GTM_CATEGORIES),
    label: 'terms',
    highlights: ['Deliverability', 'Sequences', 'Domain Warming'],
  },
  {
    name: 'Email Infrastructure',
    count: countTerms(EMAIL_CATEGORIES),
    label: 'terms',
    highlights: ['DNS Records', 'IP Warming', 'Inbox Rotation'],
  },
  {
    name: 'Engineering Terms',
    count: countTerms(ENGINEERING_CATEGORIES),
    label: 'terms',
    highlights: ['Context Window', 'MCP Protocol', 'Agent Patterns'],
  },
];

/** Aggregate counts */
export const TOTAL_ENTRIES = WIKI_MONTAGE.reduce((sum, w) => sum + w.count, 0);

/** Boot sequence lines (matches homepage) */
export const BOOT_LINES = [
  'content engine ... online',
  'three-site network ... synced',
  'gtm engine ... theGTMOS.ai',
  'content os ... theContentOS.ai',
  'cursor agent ... active',
  'blog pipeline ... mounted',
  'build-in-public mode ... engaged',
  'daily tracker ... streaming',
];

/** 3-site network data */
export const SITES = [
  { name: 'shawnos.ai', tagline: 'GTM engineering, built in public', color: '#4EC373' as const },
  { name: 'thegtmos.ai', tagline: 'The GTM Operating System', color: '#3DBFA0' as const },
  { name: 'thecontentos.ai', tagline: 'The Content Operating System', color: '#9B72CF' as const },
];

/** Stats overlay numbers */
export const STATS = {
  routes: 98,
  sites: 3,
  wikis: 7,
};

/** Character class data for progression scene */
export const CHARACTER_CLASSES = [
  { name: 'Builder',     color: '#f59e0b', avatar: 'class-builder-static.png' },
  { name: 'Scribe',      color: '#06b6d4', avatar: 'class-scribe-static.png' },
  { name: 'Strategist',  color: '#3b82f6', avatar: 'class-strategist-static.png' },
  { name: 'Alchemist',   color: '#a855f7', avatar: 'class-alchemist-static.png' },
  { name: 'Polymath',    color: '#00ff41', avatar: 'class-polymath-static.png' },
] as const;

/* ═══════════════════════════════════════════════════
   GTM OS Video Data
   ═══════════════════════════════════════════════════ */

export const GTM_OS_MONTAGE = [
  {
    name: 'Clay Wiki',
    count: CLAY_WIKI_ENTRIES.length,
    label: 'pages',
    highlights: ['Enrichment Plays', 'Claygent AI', 'Scoring Logic'],
  },
  {
    name: 'Email Infrastructure',
    count: countTerms(EMAIL_CATEGORIES),
    label: 'terms',
    highlights: ['DNS Records', 'Domain Warming', 'Inbox Rotation'],
  },
  {
    name: 'GTM Playbooks',
    count: countTerms(GTM_CATEGORIES),
    label: 'terms',
    highlights: ['Sequences', 'Signals', 'Personalization'],
  },
  {
    name: 'MCP Servers',
    count: 17,
    label: 'servers',
    highlights: ['Clay MCP', 'Slack MCP', 'HeyReach MCP'],
  },
  {
    name: 'Engineering',
    count: countTerms(ENGINEERING_CATEGORIES),
    label: 'terms',
    highlights: ['Context Window', 'Agent Patterns', 'MCP Protocol'],
  },
];

export const GTM_OS_TOTAL = GTM_OS_MONTAGE.reduce((sum, w) => sum + w.count, 0);

/** GTM OS Tool Stack — displayed in the video showcase */
export const GTM_OS_TOOLS = [
  { name: 'Clay', color: '#3DBFA0', subtitle: 'enrichment engine' },
  { name: 'HeyReach', color: '#6366F1', subtitle: 'LinkedIn outbound' },
  { name: 'Instantly', color: '#4EC373', subtitle: 'email sequences' },
  { name: 'Firecrawl', color: '#FF6B35', subtitle: 'web intelligence' },
] as const;

export const GTM_OS_CONCEPTS = [
  { name: 'Clay', color: '#3DBFA0', subtitle: 'enrichment + scoring' },
  { name: 'Instantly', color: '#4EC373', subtitle: 'email sequences' },
  { name: 'HeyReach', color: '#6366F1', subtitle: 'LinkedIn outbound' },
  { name: 'Firecrawl', color: '#FF6B35', subtitle: 'web scraping MCP' },
  { name: 'Signal Triggers', color: '#D2A53C', subtitle: 'intent detection' },
] as const;

export const GTM_OS_REVEAL = [
  { value: String(CLAY_WIKI_ENTRIES.length), label: 'Clay pages' },
  { value: '17', label: 'MCP servers' },
] as const;

/* ═══════════════════════════════════════════════════
   Content OS Video Data
   ═══════════════════════════════════════════════════ */

export const CONTENT_OS_MONTAGE = [
  {
    name: 'Platform Playbooks',
    count: 6,
    label: 'platforms',
    highlights: ['LinkedIn', 'X / Twitter', 'Reddit'],
  },
  {
    name: 'Voice & Anti-Slop',
    count: 6,
    label: 'frameworks',
    highlights: ['Tone DNA', 'AI Filters', 'Calibration'],
  },
  {
    name: 'Content Workflows',
    count: 5,
    label: 'systems',
    highlights: ['Recursive Loop', 'Pillars', 'Distribution'],
  },
  {
    name: 'Content Tools',
    count: 5,
    label: 'tools',
    highlights: ['Typefully MCP', 'Image Gen', 'Figma'],
  },
  {
    name: 'How-To Guides',
    count: HOW_TO_WIKI_ENTRIES.length,
    label: 'guides',
    highlights: ['Claude Code', 'Parallel Agents', 'MCP Setup'],
  },
];

export const CONTENT_OS_TOTAL =
  CONTENT_WIKI_ENTRIES.length + HOW_TO_WIKI_ENTRIES.length;

export const CONTENT_OS_PLATFORMS = [
  { name: 'LinkedIn', color: '#0A66C2', subtitle: 'professional network' },
  { name: 'X / Twitter', color: '#E7E9EA', subtitle: 'micro-content engine' },
  { name: 'Reddit', color: '#FF4500', subtitle: 'community growth' },
  { name: 'Substack', color: '#FF6719', subtitle: 'newsletter empire' },
  { name: 'YouTube', color: '#FF0000', subtitle: 'long-form authority' },
] as const;

export const CONTENT_OS_REVEAL = [
  { value: '6', label: 'platforms' },
  { value: '1', label: 'voice' },
] as const;

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

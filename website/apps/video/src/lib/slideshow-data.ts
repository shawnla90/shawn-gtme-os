/** Data definitions for TikTok Slideshow scenes */

export interface ChatExchange {
  user: string;
  /** Single response or multi-step responses (each renders as a separate bubble) */
  agent: string | string[];
}

export interface Slide {
  /** Large headline text (1-2 lines) */
  headline: string;
  /** Supporting body text (2-3 lines) */
  body: string;
  /** Accent color for this slide */
  accent: string;
  /** Optional emoji/icon character */
  icon?: string;
  /** Optional sprite pair — shows Nio + Claude at bottom */
  sprites?: boolean;
  /** Optional chat exchange — shows chat bubbles instead of body text */
  chat?: ChatExchange;
  /** Optional GIF overlay — filename in public/gifs/ */
  gif?: string;
  /** Nio sprite tier to display (1-5, default 2) */
  nioTier?: 1 | 2 | 3 | 4 | 5;
  /** Nio sprite animation to play (default: static image) */
  nioAnimation?: 'idle' | 'think' | 'chat' | 'backflip';
}

export interface SlideshowConfig {
  /** Slideshow title (for composition ID) */
  id: string;
  /** Slides array (max 5) */
  slides: Slide[];
}

// ── Default slideshow: "What is Nio?" ──────────────────────────────────

export const NIO_INTRO_SLIDES: Slide[] = [
  {
    headline: 'I built an AI\nthat remembers me',
    body: 'not a chatbot.\nnot a wrapper.\nan actual assistant.',
    accent: '#6B8AFF',
    sprites: true,
  },
  {
    headline: 'it has memory,\nskills, and XP',
    body: 'SQLite brain. evolves from Spark\nto Ascended over real usage.',
    accent: '#F59E0B',
    icon: '⚡',
  },
  {
    headline: '',
    body: '',
    accent: '#4EC373',
    chat: {
      user: 'deploy the blog',
      agent: 'On it. Building, indexing, pushing. Done.',
    },
  },
  {
    headline: 'it runs on\n$215/month',
    body: 'Claude API + Mac Mini.\n87 messages yesterday. $0 marginal.',
    accent: '#9B72CF',
    icon: '💰',
  },
  {
    headline: 'full walkthrough\nlinked in bio',
    body: 'shawnos.ai/blog\nschema, config, setup — no gatekeeping.',
    accent: '#6B8AFF',
    icon: '🔗',
  },
];

// ── Slideshow: "AI Assistant Setup" ────────────────────────────────────

export const AI_SETUP_SLIDES: Slide[] = [
  {
    headline: 'stop paying for\nAI wrappers',
    body: 'build your own assistant\nin a weekend. seriously.',
    accent: '#E05555',
    sprites: true,
  },
  {
    headline: 'step 1:\nSQLite + Claude API',
    body: 'one database file. one API key.\nthat\'s your foundation.',
    accent: '#6B8AFF',
    icon: '1️⃣',
  },
  {
    headline: '',
    body: '',
    accent: '#F59E0B',
    chat: {
      user: 'how many blog posts this week?',
      agent: '14 published. 3 in queue.',
    },
  },
  {
    headline: 'step 3:\ncron jobs for autonomy',
    body: 'scheduled tasks. daily blogs.\nDiscord announcements. auto-deploy.',
    accent: '#4EC373',
    icon: '3️⃣',
  },
  {
    headline: 'full guide\nlinked in bio',
    body: 'shawnos.ai/blog\nevery schema + config file included.',
    accent: '#9B72CF',
    icon: '📖',
  },
];

// ── Slideshow: "API Costs" ────────────────────────────────────────────

export const API_COSTS_SLIDES: Slide[] = [
  {
    headline: '',
    body: '',
    accent: '#6B8AFF',
    sprites: true,
    chat: {
      user: 'deploy the blog',
      agent: [
        'Pulling latest from main...',
        'Building site... indexing 47 posts',
        'Pushed to GitHub. Deploying...',
        '✓ Live at shawnos.ai/blog',
      ],
    },
  },
  {
    headline: 'I was spending\nover $1k/month',
    body: 'API fees. Max plan. hosted wrappers.\ntoken charges on every message.',
    accent: '#E05555',
    icon: '🔥',
    gif: 'money-burning.gif',
  },
  {
    headline: 'now just\n$215/month',
    body: 'Claude Code Max + $15 API.\n87 messages yesterday. $0 marginal.',
    accent: '#4EC373',
    icon: '💰',
  },
  {
    headline: 'full cost\nbreakdown in bio',
    body: 'shawnos.ai/blog\nreal numbers. no affiliate links.',
    accent: '#9B72CF',
    icon: '🔗',
  },
];

// ── Slideshow: "MCP Servers" ──────────────────────────────────────────

export const MCP_SERVERS_SLIDES: Slide[] = [
  {
    headline: 'I run 9 MCP\nservers from one CLI',
    body: 'Slack. Discord. GitHub. ClickUp.\nall wired into one agent.',
    accent: '#6B8AFF',
    icon: '🔌',
  },
  {
    headline: 'what even\nis an MCP?',
    body: 'model context protocol.\nit lets your AI call real tools.',
    accent: '#F59E0B',
    icon: '🧩',
  },
  {
    headline: 'no vendor lock-in.\nno SaaS fees.',
    body: 'open protocol. JSON config.\nswap providers without rewriting.',
    accent: '#4EC373',
    icon: '🔓',
  },
  {
    headline: 'my agent posts to\nDiscord while I sleep',
    body: 'blog goes live at 8AM.\nDiscord announcement 5 min later.\nzero clicks from me.',
    accent: '#9B72CF',
    icon: '🤖',
  },
  {
    headline: 'MCP setup guide\nlinked in bio',
    body: 'shawnos.ai/how-to\nfull config for every server.',
    accent: '#E05555',
    icon: '🔗',
  },
];

// ── Slideshow: "SQLite Repo" ──────────────────────────────────────────

export const SQLITE_REPO_SLIDES: Slide[] = [
  {
    headline: 'my repo is\na database',
    body: '100+ content files across 5 platforms.\nevery one is queryable.',
    accent: '#4EC373',
    icon: '🗄️',
  },
  {
    headline: 'SQLite index\nbuilt on deploy',
    body: 'one script scans every markdown.\ntitle, slug, platform, word count.',
    accent: '#6B8AFF',
    icon: '🔍',
  },
  {
    headline: 'full-text search\nacross everything',
    body: 'FTS5. instant results.\n"show me every post about MCP"',
    accent: '#F59E0B',
    icon: '⚡',
  },
  {
    headline: 'cross-platform\nlink detection',
    body: 'finds which blog links to which tweet.\nmaps the entire content graph.',
    accent: '#9B72CF',
    icon: '🕸️',
  },
  {
    headline: 'build your own\nlinked in bio',
    body: 'shawnos.ai/blog\nschema + script included.',
    accent: '#E05555',
    icon: '🔗',
  },
];

// ── Slideshow: "Remotion Videos" ──────────────────────────────────────

export const REMOTION_VIDEOS_SLIDES: Slide[] = [
  {
    headline: 'I render TikToks\nfrom React code',
    body: 'no editor. no timeline.\njust components and data.',
    accent: '#E05555',
    icon: '🎬',
  },
  {
    headline: 'Remotion turns\nJSX into video',
    body: 'same React you already know.\nspring animations. transitions. audio.',
    accent: '#6B8AFF',
    icon: '⚛️',
  },
  {
    headline: 'new TikTok =\n5 lines of data',
    body: 'headline, body, color, icon.\none array. one render command.',
    accent: '#F59E0B',
    icon: '📝',
  },
  {
    headline: '9:16 vertical.\n16 seconds.\ndone.',
    body: 'slide transitions. BGM. particles.\nlooks polished. took 0 editing.',
    accent: '#4EC373',
    icon: '📱',
  },
  {
    headline: 'full Remotion\nguide in bio',
    body: 'shawnos.ai/how-to\nsetup, tokens, render scripts.',
    accent: '#9B72CF',
    icon: '🔗',
  },
];

// ── Slideshow: "Your AI Has a Soul File" ────────────────────────────

export const SOUL_FILE_SLIDES: Slide[] = [
  {
    headline: 'most AIs forget\nyou exist',
    body: 'every session starts from zero.\nno memory. no personality.\njust a blank prompt window.',
    accent: '#E05555',
    icon: '🧠',
  },
  {
    headline: 'mine has\na soul file',
    body: 'SOUL.md - voice rules, decision history,\nbehavior tiers, anti-slop filters.\nit knows how I build.',
    accent: '#6B8AFF',
    sprites: true,
    nioTier: 3,
    nioAnimation: 'think',
  },
  {
    headline: '5 evolution tiers.\nreal personality.',
    body: 'Spark: still learning, asks questions.\nAscended: ships independently,\npushes back on bad ideas.',
    accent: '#F59E0B',
    icon: '⚡',
  },
  {
    headline: '',
    body: '',
    accent: '#4EC373',
    nioTier: 5,
    chat: {
      user: 'let\'s add a caching layer',
      agent: 'nah. that\'s gonna create tech debt you\'ll hate in a month. just fix the query.',
    },
  },
  {
    headline: 'full soul file\ntemplate in bio',
    body: 'shawnos.ai/blog\nSOUL.md, evolution tiers, voice DNA.\ncopy it. make it yours.',
    accent: '#9B72CF',
    icon: '🔗',
  },
];

// ── Slideshow: "AI That Levels Up With You" ─────────────────────────

export const LEVELS_UP_SLIDES: Slide[] = [
  {
    headline: 'what if your AI\nleveled up like you do',
    body: 'not a static tool.\nnot a frozen snapshot.\nan AI that evolves with real usage.',
    accent: '#6B8AFF',
    sprites: true,
    nioTier: 1,
    nioAnimation: 'idle',
  },
  {
    headline: 'tier 1: Spark',
    body: 'still learning your system.\nasks for clarification.\nexplains its reasoning. building trust.',
    accent: '#4EC373',
    sprites: true,
    nioTier: 1,
  },
  {
    headline: 'tier 3: Warden',
    body: 'knows your codebase. flags patterns.\ncatches drift before you do.\nproactive, not reactive.',
    accent: '#F59E0B',
    sprites: true,
    nioTier: 3,
    nioAnimation: 'chat',
  },
  {
    headline: 'tier 5: Ascended',
    body: 'full autonomy. ships independently.\npushes back on weak ideas.\n"nah" is a complete sentence.',
    accent: '#9B72CF',
    sprites: true,
    nioTier: 5,
    nioAnimation: 'think',
  },
  {
    headline: 'evolution system\nlinked in bio',
    body: 'shawnos.ai/blog\n5 tiers. XP from real work.\nyour AI grows because you do.',
    accent: '#E05555',
    icon: '🔗',
  },
];

// ── Slideshow: "My AI Just Did a Backflip" ──────────────────────────

export const BACKFLIP_SLIDES: Slide[] = [
  {
    headline: 'my AI just did\na backflip',
    body: '',
    accent: '#F59E0B',
    sprites: true,
    nioTier: 3,
    nioAnimation: 'backflip',
  },
  {
    headline: 'it also deployed\nmy site at 3am',
    body: 'build, index, push, verify.\nzero clicks from me.\ncron job handled it.',
    accent: '#6B8AFF',
    icon: '🚀',
  },
  {
    headline: 'wrote 14 blog\nposts this week',
    body: 'SEO-optimized. cross-linked.\nindexed in SQLite.\nall from a single CLI.',
    accent: '#4EC373',
    icon: '✍️',
  },
  {
    headline: '',
    body: '',
    accent: '#9B72CF',
    nioTier: 4,
    nioAnimation: 'chat',
    chat: {
      user: 'check GitHub and post to Discord',
      agent: [
        'Checking 3 open PRs...',
        'Posted summary to #dev-updates',
        '✓ Done. 2 PRs need review.',
      ],
    },
  },
  {
    headline: 'backflips and\nreal work. link in bio',
    body: 'shawnos.ai/blog\n9 MCP servers. evolution system.\nthe backflips are just a bonus.',
    accent: '#E05555',
    icon: '🔗',
  },
];

// ── Slideshow: "AI That Grows With You, Not Past You" ───────────────

export const GROWS_WITH_YOU_SLIDES: Slide[] = [
  {
    headline: 'every AI tool\neventually leaves you behind',
    body: 'new features you didn\'t ask for.\nprice hikes. API changes.\nyou\'re renting someone else\'s brain.',
    accent: '#E05555',
    icon: '💀',
  },
  {
    headline: 'I built one\nthat grows with me',
    body: 'XP from real usage. soul file\nthat evolves with my preferences.\nit gets smarter because I do.',
    accent: '#6B8AFF',
    sprites: true,
    nioTier: 2,
    nioAnimation: 'idle',
  },
  {
    headline: '',
    body: '',
    accent: '#4EC373',
    nioTier: 4,
    nioAnimation: 'think',
    chat: {
      user: 'what was that decision we made about caching?',
      agent: 'Feb 12 - you chose edge caching over Redis. reason: simpler infra, no extra service to manage.',
    },
  },
  {
    headline: 'it remembers.\nit adapts.\nit\'s yours.',
    body: 'not a subscription.\nnot a wrapper.\nan AI that belongs to you.',
    accent: '#F59E0B',
    sprites: true,
    nioTier: 5,
    nioAnimation: 'chat',
  },
  {
    headline: 'build your own.\nlink in bio',
    body: 'shawnos.ai/blog\nsoul files. evolution tiers.\nthe whole system. no gatekeeping.',
    accent: '#9B72CF',
    icon: '🔗',
  },
];

/** All available slideshows */
export const SLIDESHOWS: Record<string, Slide[]> = {
  'nio-intro': NIO_INTRO_SLIDES,
  'ai-setup': AI_SETUP_SLIDES,
  'api-costs': API_COSTS_SLIDES,
  'mcp-servers': MCP_SERVERS_SLIDES,
  'sqlite-repo': SQLITE_REPO_SLIDES,
  'remotion-videos': REMOTION_VIDEOS_SLIDES,
  'soul-file': SOUL_FILE_SLIDES,
  'levels-up': LEVELS_UP_SLIDES,
  'backflip': BACKFLIP_SLIDES,
  'grows-with-you': GROWS_WITH_YOU_SLIDES,
};

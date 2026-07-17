import redditStats from '@shawnos/shared/data/reddit-stats.json'
import type { IconName } from './ReportIcon'

/* ── shared types ───────────────────────────────────── */

export interface Evidence {
  /**
   * reddit id. every number on the card is looked up from the journey db via
   * this — nothing is typed. hand-typed stats froze at screenshot time while
   * the posts kept growing: every one had drifted, and two were *overstated*,
   * which a monotonic view counter makes indefensible.
   */
  redditId?: string
  title: string
  sub: string
  tag: string
  tagColor: string
  /** screenshot path. omit when the receipt is the quoted body itself. */
  image?: string
  body?: string
  lesson: string
}

/** A row of the generated per-item index. See clearbox_reddit/export_website_stats.py. */
export interface PostStat {
  kind: 'post' | 'comment'
  subreddit: string
  score: number
  /** posts only. */
  comments?: number
  /** posts only. reddit shows author view counts on comments too, but the
   *  tracker does not scrape them, so they are absent rather than invented. */
  views?: number
  title?: string
}

const POSTS = (redditStats as { posts?: Record<string, PostStat> }).posts ?? {}

/** Look up an item's live numbers. Returns undefined for anything not in the db. */
export const stat = (redditId?: string): PostStat | undefined =>
  redditId ? POSTS[redditId] : undefined

/* ── formatting helper ──────────────────────────────── */

export const fmtViews = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`

/**
 * The one-line stat string under an archetype. Built from the db, so a comment
 * simply has no views clause rather than an invented one.
 */
export const statLine = (redditId?: string): string => {
  const p = stat(redditId)
  if (!p) return ''
  const parts = [`${p.score} upvotes`]
  if (p.comments != null) parts.push(`${p.comments} comments`)
  if (p.views != null) parts.push(`${fmtViews(p.views)} views`)
  return parts.join(', ')
}

/* ── the ramp: starting an account that survives ────── */

export const ACCOUNT_RAMP = [
  {
    icon: 'Eye',
    stage: 'read like a person',
    window: 'before your first comment',
    desc: 'scroll. open threads. stay on the ones you actually want to read. vote. I have no idea what Reddit measures and neither does anyone outside Reddit, but a day-old account whose entire history is one comment about its own product is the easiest possible thing to catch, and I have never seen one survive. an account that has been used like an account has somewhere to hide.',
  },
  {
    icon: 'MessageCircle',
    stage: 'comment on things that have nothing to do with you',
    window: 'the first weeks',
    desc: 'your interests are the warmup. dogs, your team, your city, whatever you would have opened anyway. these subs cost you nothing, carry no promotional weight, and teach you how Reddit talks. an account that only ever surfaces near its own category reads as a plant, because it is one.',
  },
  {
    icon: 'Home',
    stage: 'earn the home subs',
    window: 'weeks, not days',
    desc: 'pick the few subs you intend to be known in and become a face there before you ask them for anything. answer questions you already know the answer to. lose arguments. get the automod rules wrong once and learn them. the account below ran 422 posts and comments in this mode before it ever mentioned Clearbox.',
  },
  {
    icon: 'Send',
    stage: 'then post',
    window: 'once the account has a past',
    desc: 'by the time you post something you care about, the account has a scroll history, a vote history, karma on both sides of the ledger, and a name a few regulars recognize. the post lands into that context. the same post from a two-week-old account lands into a filter.',
  },
] as const

export const RAMP_DONTS = [
  {
    icon: 'Ban',
    rule: 'do not buy accounts',
    detail: 'bought accounts and warmed accounts carry someone else\'s history, and the history is the asset. if you are going to use Reddit to engage, do it real or do not do it at all. it can hurt you more than it can help you.',
  },
  {
    icon: 'Bot',
    rule: 'do not let a model write your comments',
    detail: 'plenty of subs run their own bot and AI filters, and the humans in them are faster than any filter. a comment that reads as generated costs you the thread, then the sub, then the account. the automation belongs off Reddit, in the part nobody is reading.',
  },
  {
    icon: 'Timer',
    rule: 'do not compress the ramp',
    detail: 'skipping era one costs you era two. every shortcut I tested died in the automod queue, and the account that eventually worked is the one that did the slow version first.',
  },
] as const

/* ── karma via self-interest ────────────────────────── */

export const KARMA_ENGINE = [
  {
    icon: 'Target',
    move: 'farm where you already are',
    desc: 'the karma that makes you postable is easiest to earn in the subs you would read on a Sunday. you already know the references, the voice, and what a bad take looks like, so the comments land without effort. r/OnePiece has nothing to do with GTM and it pulled more views on this account than r/hubspot, r/UseApolloIo and r/buildinpublic combined.',
  },
  {
    icon: 'Scale',
    move: 'let the split happen to you',
    desc: 'subs gate on comment karma as much as post karma, and the accounts that read as real carry both. this one sits around 2:1 link to comment, which is not a target I hit, it is just what falls out of commenting far more often than you post. if you are counting toward a ratio you are already writing like someone counting.',
  },
  {
    icon: 'Repeat',
    move: 'genuine interest is what scales',
    desc: 'karma farming as a chore stops within a week, and the account goes quiet at exactly the moment it needed history. the subs you actually care about are the ones you will still be in three months from now, which is the horizon that matters.',
  },
] as const

/** the sub that proves the point: pure interest, zero commercial intent. */
export const KARMA_ENGINE_SUB = 'OnePiece'

/* ── the 8 post types ───────────────────────────────── */

export const POST_ARCHETYPES: {
  name: string
  icon: IconName
  desc: string
  valueLead: string
  evidence: Evidence
}[] = [
  {
    name: 'the pattern read',
    icon: 'Radar',
    desc: 'scan complaints, releases, pricing pages. turn the pattern into a post. people upvote synthesis they could not do themselves.',
    valueLead: 'for B2B marketing: synthesize 30 customer complaints instead of 3 LinkedIn posts. for SaaS: link the raw scan output.',
    evidence: {
      title: 'Never hit a rate limit on $200 Max. Had Claude scan every complaint to figure out why.',
      sub: 'r/ClaudeCode',
      tag: 'Pattern Read',
      tagColor: '#fbbf24',
      redditId: '1s5qxyq',

      image: '/images/reddit-evidence/rate-limit-max-plan-308.png',
      body: 'three months on the $200 Max plan, zero rate limits. ran Claude over every rate-limit complaint thread in this sub to figure out what the heavy users were doing wrong. shared the pattern.',
      lesson: 'the scan was the value. cross-posted variant in r/ClaudeAI hit 227 upvotes the same way.',
    },
  },
  {
    name: 'the showcase',
    icon: 'Hammer',
    desc: 'show what you shipped. numbers, repos, screenshots. the post is the hook, the comments deliver the depth.',
    valueLead: 'for SaaS: numbers + a public repo. for Clay: a working stack diagram with the table count and the cost.',
    evidence: {
      title: 'been mass building with Claude Code every day for 6 weeks straight.',
      sub: 'r/ClaudeCode',
      tag: 'Showcase',
      tagColor: '#4ade80',
      redditId: '1rv3cw2',

      image: '/images/reddit-evidence/6week-claude-code.png',
      body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms, and cron jobs running nightly on a single Mac Mini. all Claude Code.',
      lesson: 'the post was the hook, the comments were the delivery. I replied to every single one.',
    },
  },
  {
    name: 'the question',
    icon: 'HelpCircle',
    desc: 'ask something you genuinely want to know. technical depth invites technical answers. real stakes invite real answers.',
    valueLead: 'for GTM eng: name your real constraint, with real hardware and real budget attached. for Clay: include the table you got stuck on.',
    evidence: {
      title: 'anyone running Claude Code over SSH from a thin client?',
      sub: 'r/ClaudeCode',
      tag: 'Question',
      tagColor: '#58a6ff',
      redditId: '1rtxsmh',

      image: '/images/reddit-evidence/ssh-thin-client.png',
      body: "picking up a MacBook Neo as a portable terminal. all my actual compute lives on a Mac Mini that runs 24/7. the plan is basically: SSH in, tmux attach, run Claude Code on the Mini's hardware.",
      lesson: 'genuine question, I was actually buying the Neo. 48 comments of real technical answers because people could tell it was real.',
    },
  },
  {
    name: 'the meme',
    icon: 'Laugh',
    desc: 'relatable humor, perfectly timed. post when a feature drops or a trend is peaking.',
    valueLead: 'for any audience: the joke has to land for an insider. one specific reference beats five generic punchlines.',
    evidence: {
      title: 'life now with cc remote control',
      sub: 'r/ClaudeCode',
      tag: 'Humor',
      tagColor: '#f472b6',
      redditId: '1rsfzmv',

      image: '/images/reddit-evidence/cc-remote-gosling.png',
      body: 'Ryan Gosling meme, posted the morning Claude Code remote access dropped. zero effort, maximum relatability.',
      lesson: 'timing is everything. this took 30 seconds to post and outperformed nearly all of my long-form content.',
    },
  },
  {
    name: 'the crossover',
    icon: 'Shuffle',
    desc: "find unexpected subreddits where your story resonates. a plumber's son in r/NYCapartments outperformed everything in my home subs.",
    valueLead: 'for SaaS founders: bring your operator story to subs that buy what you sell, on top of the subs that build what you sell.',
    evidence: {
      title: "I spent 10 years as a plumber in NYC alongside my dad. Now I'm using tech to share everything he knows. for free.",
      sub: 'r/NYCapartments',
      tag: 'Advice/Question',
      tagColor: '#58a6ff',
      redditId: '1rq991a',

      image: '/images/reddit-evidence/dad-plumber-nyc.png',
      body: "I'm Shawn. For 10 years I worked plumbing in New York City with my father, Reuven. Not holding tools. running jobs. Every borough. Pre-war brownstones where nothing is where the blueprints say it is.",
      lesson: 'a plumbing story in an apartment sub outscored most of what I have posted about software. find where your story fits that nobody expects.',
    },
  },
  {
    name: 'the hot take',
    icon: 'Flame',
    desc: 'ride breaking news within hours. have a real opinion backed by experience.',
    valueLead: 'for Clay: 18 months of daily usage is the receipt. for B2B marketing: name the vendor and the line item.',
    evidence: {
      title: "Clay's new pricing changes what I build with. here's my updated stack.",
      sub: 'r/gtmengineering',
      tag: 'Hot Take',
      tagColor: '#f87171',
      redditId: '1rrecae',

      image: '/images/reddit-evidence/clay-pricing-dual.png',
      body: '18 months of daily Clay usage. the new pricing model changed which workflows still make sense and which ones moved to Supabase + Sheets. here is the side-by-side and what each tool now owns.',
      lesson: 'a hot take with a stack diagram beats a hot take with adjectives. the receipts moved the conversation.',
    },
  },
  {
    name: 'the value drop',
    icon: 'Gift',
    desc: 'give away something useful. checklists, frameworks, audits. publish inline, link the live artifact in the body.',
    valueLead: 'for Clay: the actual checklist you use, copy-paste ready. for GTM eng: the SQL query or the Python script.',
    evidence: {
      title: 'open-sourced my entire GTM engineering stack. not selling anything yet.',
      sub: 'r/gtmengineering',
      tag: 'Resource',
      tagColor: '#c084fc',
      redditId: '1rvq836',

      image: '/images/reddit-evidence/open-sourced-gtm-stack-25.png',
      body: 'MIT-licensed monorepo. ABM pipeline, Clay wiki, voice system, the full publishing pipeline, the works. every script that runs my business is in there. no email gate, no waitlist.',
      lesson: 'pure value. the people who watched me give it away are the ones who hire me later.',
    },
  },
  {
    name: 'the thought piece',
    icon: 'Brain',
    desc: 'career arc, methodology, thesis. show the journey, link the receipts.',
    valueLead: 'for SaaS founders: name the specific transition (job → first dollar → second dollar). for GTM eng: name the tools that died and the tools that replaced them.',
    evidence: {
      title: 'from SDR to solo GTM engineer. the AI development method behind my entire operation',
      sub: 'r/gtmengineering',
      tag: 'Thought Piece',
      tagColor: '#4ade80',
      redditId: '1roenoy',

      image: '/images/reddit-evidence/sdr-to-gtm-engineer.png',
      body: '3 months ago I started using Claude Code heavy. since then I have shipped four full stack websites, built an arsenal of reusable skills, a voice system for content, a progression engine. all one monorepo, one Mac Mini.',
      lesson: 'career arc story. linked the repos directly. showed the method and the results.',
    },
  },
]

/* ── the 6 craft rules ──────────────────────────────── */

export const CRAFT_RULES = [
  {
    rule: 'the post is the hook, the comments are the delivery',
    detail: 'write a tight post. then drop the depth, the links, the repos in the comments. the 6-week showcase below did 224 comments that way.',
  },
  {
    rule: 'publish everything fully',
    detail: 'MIT the repos. post the checklist inline. put the link in the body where everyone can click it. the people who watch you give it away are the ones who hire you later.',
  },
  {
    rule: 'be genuine',
    detail: "post real questions you actually have. share real work you actually shipped. give real takes you actually believe. Reddit's immune system rewards the same signal it filters for.",
  },
  {
    rule: 'mix your post types',
    detail: "memes one day, showcases the next, questions in between. variety signals you're a real person. monotone reads like a content machine.",
  },
  {
    rule: 'ride the wave',
    detail: 'when news breaks, post within hours. my Clay pricing posts hit because I was there first with a real opinion and 18 months of daily usage behind it.',
  },
  {
    rule: 'write like you talk',
    detail: "if it sounds like you wrote it at 2am after a long day, post it. dictate if you have to. real cadence is what Reddit's immune system rewards.",
  },
]

/* ── karma gating: the gate reference table ─────────── */

export const GATE_TABLE = [
  {
    gate: 'minimum karma',
    where: 'posted in the sub rules or wiki',
    clear: 'weeks of comments before your first post. the karma you build hyping other people is what earns the right to post your own.',
  },
  {
    gate: 'account age',
    where: 'sub rules, read them per sub',
    clear: 'start commenting the day you make the account. the clock runs while you build comment karma.',
  },
  {
    gate: 'automod filters',
    where: 'invisible, per-sub keyword and link rules',
    clear: 'post link-free, watch the new queue to confirm your post is live, message the mods when it vanishes.',
  },
  {
    gate: 'crowd trust',
    where: 'unwritten, read from your profile',
    clear: `karma on both sides of the ledger. mine is ${redditStats.linkKarma.toLocaleString()} link / ${redditStats.commentKarma} comment, roughly 2:1. carrying real comment karma is the tell that you live there rather than just post there.`,
  },
]

/* ── karma gating: the entry system ─────────────────── */

export const GATING_STEPS = [
  {
    rule: 'pick 3 subreddits that match your niche',
    detail: "judge a sub by its engagement ratio rather than subscriber count: a small sub where every thread has real replies beats a huge one where nothing moves. mine: r/ClaudeCode, r/gtmengineering, r/GTMBuilders. then find each sub's gate before you post: minimum karma, minimum account age, automod filters. the gate is in the sidebar and the wiki, and it is different everywhere.",
  },
  {
    rule: 'comment for weeks before you post',
    detail: "comment naturally, add value, comment again. the karma you build hyping other people's work is what lets you post your own later without reading as a self-promoter. by the time you drop your first showcase, the sub already knows your name.",
  },
  {
    rule: 'earn comment karma, not just post karma',
    detail: `${redditStats.linkKarma.toLocaleString()} link / ${redditStats.commentKarma} comment karma is my real split right now. comments are where a sub learns to trust you, posts are where that trust pays out.`,
  },
]

/* ── comment types (one flagship example each) ──────── */

export const COMMENT_TYPES: {
  name: string
  icon: IconName
  desc: string
  highlight: string
  example: { redditId?: string; image?: string; context: string; text: string }
}[] = [
  {
    name: 'the mega comment',
    icon: 'Gem',
    desc: "a comment that IS a post. one sentence that captures the moment so perfectly it outperforms every post you've ever written.",
    highlight: 'my highest-upvoted comment anywhere. one sentence about ADHD and Claude Code.',
    example: {
      redditId: 'o9xairb',

      image: '/images/reddit-evidence/comment-adhd-btw-237.png',
      context: 'r/ClaudeCode · "Claude just released /BTW and it\'s clutch"',
      text: '"Ah man, this is a gift to us Claude Code homies that have the ADHD brain. pressing escape and changes their plans every three sub-agent runs."',
    },
  },
  {
    name: 'the expert drop',
    icon: 'Target',
    desc: 'answer a question with real experience and specific numbers. commit to the answer.',
    highlight: 'highest comment karma per impression. people upvote confidence backed by receipts.',
    example: {
      image: '/images/reddit-evidence/comment-claude-appstore.png',
      context: 'r/ClaudeAI · "Claude overtaken ChatGPT in App Store"',
      text: '"No surprise. now we have remote control access. You basically have a dev in your back pocket and Opus 4.6 is elite."',
    },
  },
  {
    name: 'the one-liner',
    icon: 'Zap',
    desc: 'short, punchy, personality. zero fluff. keeps you visible between big posts.',
    highlight: 'low effort, high personality. the comments that make people check your profile.',
    example: {
      redditId: 'o9dh2lc',

      image: '/images/reddit-evidence/comment-skill-issue.png',
      context: 'r/vibecoding · "Vibe coding sucks"',
      text: '"Skill issue my guy. You gotta learn version control"',
    },
  },
  {
    name: 'the cross-pollinator',
    icon: 'Link',
    desc: "drop your work in someone else's thread when it is genuinely relevant. relevance is the whole play.",
    highlight: "the plumber website dropped in r/ClaudeCode got 10K views. I have no idea how many clicked through, and anyone who tells you a comment's CTR is guessing.",
    example: {
      redditId: 'oapxd4n',

      image: '/images/reddit-evidence/comment-crosspollin-plumber-claudecode.png',
      context: 'r/ClaudeCode · own post, replying about what he shipped',
      text: '"theplumbernyc.com Website I built for my father\'s company is already averaging 2,000 visitors a week."',
    },
  },
  {
    name: 'the thread keeper',
    icon: 'RefreshCw',
    desc: "reply to every commenter on your own posts. every reply bumps the post and shows you're real.",
    highlight: 'your own thread is your territory. the 6-week showcase turned 72 upvotes into 224 comments and a quarter million views, because the depth was all in the replies.',
    example: {
      redditId: 'o9ruak0',

      image: '/images/reddit-evidence/comment-podcast-idea.png',
      context: 'r/NYCapartments · someone suggests a podcast',
      text: '"Oh that sounds like a cool idea. I\'ve actually been pushing him to do a podcast"',
    },
  },
  {
    name: 'the hype man',
    icon: 'Rocket',
    desc: "genuine excitement for someone else's work. builds real relationships.",
    highlight: 'the karma you build hyping others lets you post your own work without looking like a self-promoter.',
    example: {
      redditId: 'o9jdlnz',

      image: '/images/reddit-evidence/comment-jury-rigged-fire.png',
      context: 'r/ClaudeCode · "My jury-rigged rate limit solution"',
      text: '"yeah not gonna lie, that\'s fire. If I could I\'d sponsor you to get a Claude Code max plan"',
    },
  },
  {
    name: 'the value lead',
    icon: 'Sparkles',
    desc: "state the principle in someone else's thread without selling. the comment is the credential.",
    highlight: 'value-leading proof in B2B subs, where readers buy what you build. the kind of comment that gets profile-checked.',
    example: {
      redditId: 'olojoio',

      image: '/images/reddit-evidence/comment-b2bmarketing-reddit-art.png',
      context: 'r/b2bmarketing · thread on Reddit growth tactics',
      text: '"Reddit is an art though. To share value and grow your brand on Reddit is such a different muscle from LinkedIn or X. the readers are sharper and the immune system is faster."',
    },
  },
]

/* ── extra receipts (past the 8 archetype flagships) ── */

export const EXTRA_RECEIPTS: Evidence[] = [
  {
    title: 'On the $200 Max plan and never been rate limited once. Ran the numbers.',
    sub: 'r/ClaudeAI',
    tag: 'Pattern Read',
    tagColor: '#fbbf24',
    redditId: '1s5r0hj',

    image: '/images/reddit-evidence/max-plan-claudeai-227.png',
    body: 'cross-post variant of the rate-limit thread, sharpened for r/ClaudeAI. same scan, different framing.',
    lesson: 'the same pattern read works in two subs when the framing matches the audience.',
  },
  {
    title: 'Supabase + Google Sheets + Claude Code replaced Clay for me. here is how.',
    sub: 'r/gtmengineering',
    tag: 'Pattern Read',
    tagColor: '#fbbf24',
    redditId: '1s9ylfe',

    image: '/images/reddit-evidence/supabase-replaced-clay-65.png',
    body: 'workflow-by-workflow swap after Clay re-priced. each task: what Clay did, what replaced it, what it now costs.',
    lesson: 'competitor-mention magnet. half the comments were Clay users running the same math.',
  },
  {
    title: '3 weeks running HubSpot from Claude Code CLI instead of MCP. 7 gotchas.',
    sub: 'r/hubspot',
    tag: 'Showcase',
    tagColor: '#4ade80',
    redditId: '1ss3ma7',

    image: '/images/reddit-evidence/hubspot-cli-gotchas-33.png',
    body: 'CLI-first HubSpot CRM ops, all 7 gotchas listed inline with the workaround under each.',
    lesson: 'r/hubspot was a brand-new sub for me. real receipts beat domain history.',
  },
  {
    title: 'Intent signals are qualification scores, not buying intent.',
    sub: 'r/GTMbuilders',
    tag: 'Thought Piece',
    tagColor: '#4ade80',
    redditId: '1su7zj1',

    image: '/images/reddit-evidence/intent-signals-qualification-7.png',
    body: 'the Clearbox thesis stated in plain English. someone scrolling a problem thread is showing you which problem to solve first.',
    lesson: 'low score, high conversion. commenters from this thread became early-access signups, which is the whole argument against reading upvotes as impact.',
  },
]

/* ── link map zones ─────────────────────────────────── */

export const LINK_ZONES = [
  {
    icon: 'Link2Off',
    zone: 'post bodies',
    verdict: 'the kill zone',
    desc: 'a URL in a post body gets auto-removed or shadow-buried in many subs. you find out days later when the views flatline at zero. describe the artifact in the post and put the link in a comment.',
  },
  {
    icon: 'MessageCircle',
    zone: 'comments',
    verdict: 'earned placement',
    desc: "drop a link in a comment when someone asks for it, or when the sub treats links as answers. the plumber-site comment in r/NYCapartments worked because a homeowner wanted the guides and the culture allows it.",
  },
  {
    icon: 'User',
    zone: 'profile',
    verdict: 'home turf',
    desc: 'automod polices threads, not your profile. pin the site, pin the repo, pin the offer. every good comment sends readers there, and the click is theirs to make. mods do read profiles, so it still has to look like a person, not a billboard.',
  },
] as const

export const LINK_ZONE_EVIDENCE: Evidence = {
  title: "r/NYCapartments · someone else's plumber post",
  sub: '',
  tag: 'Comment',
  tagColor: '#FF4500',
  redditId: 'oab1cv3',

  image: '/images/reddit-evidence/comment-crosspollin-plumber-frankenstein.png',
  body: '"You should definitely check out some of the homeowner guide articles in his website"',
  lesson: 'the link landed because the culture allows it and the reader asked for exactly this. same comment in r/ClaudeCode would read as spam.',
}

/* ── engineering the ask ────────────────────────────── */

export const THE_ASK = [
  {
    icon: 'Package',
    move: 'ship the whole thing, keep the URL',
    desc: 'the post has to be complete on its own. the numbers, the method, the thing you learned, all of it readable without leaving the thread. a post that withholds the substance to force a click reads as an ad and gets treated as one. a post that gives everything and happens to come from somewhere leaves the reader wanting the somewhere.',
  },
  {
    icon: 'HelpCircle',
    move: 'leave the obvious next question unanswered',
    desc: 'give the reader the output and let the artifact behind it stay implied. the daily writeup below covered what shipped and what mattered, and never linked the posts it was summarizing. that gap is the whole mechanism. the reader hits the edge of what you gave them and the only way forward is to ask.',
  },
  {
    icon: 'User',
    move: 'make the answer findable without you',
    desc: 'the profile is pinned, the repo is public, the site is one search away. readers who do not want to ask can just go, and readers who ask get a reply in the thread where the sub can see it was requested. either path ends in the same place and neither one is you dropping a URL into a body.',
  },
  {
    icon: 'MessagesSquare',
    move: 'answer in the thread, not the DMs',
    desc: 'when someone asks, the reply belongs in public under their comment. the sub reads it as an answer because it is one. the request is the permission slip, and it only works if the request is visible above the link.',
  },
] as const

export const THE_ASK_EVIDENCE: Evidence = {
  title: 'r/ClaudeCode · a daily writeup that shipped with zero links',
  sub: 'r/ClaudeCode',
  tag: 'The ask',
  tagColor: '#22c55e',
  body: '"Could you ad links to the posts you\'re covering on that day? I want to read the 5 stages post for example. Great service, ty."',
  lesson:
    'the post was a summary of threads and it linked none of them. a reader asked for the links and thanked me in the same breath. that comment is worth more than the URL it asked for, because the sub watched someone request it.',
}

/* ── what AI cites: the three signal labels ─────────── */

export const SIGNAL_LABELS = [
  {
    icon: 'Target',
    name: 'lead',
    desc: 'pre-buy signals. the question, the complaint, the "has anyone tried X". budget pressure shows up in threads long before the switch. Aura scores these for prospect intent before the buyer self-identifies.',
  },
  {
    icon: 'Swords',
    name: 'competitor',
    desc: '"we just switched off X." "Apollo is overpriced." "Clay\'s new model broke our workflow." these threads tell you exactly which competitor is bleeding which segment, and what the trigger was. the comments are the dataset.',
  },
  {
    icon: 'Search',
    name: 'engager',
    desc: 'the conversation is the asset. someone asking a question, challenging your take, sharing their own stack. every reply tells you what to build next, who to talk to, and which pitch lands. Aura scores these for relationship depth.',
  },
] as const

/* ── staying alive: shadowbans and silent removals ──── */

export const SHADOWBAN_CHECKS = [
  {
    icon: 'EyeOff',
    check: 'the logged-out check',
    how: 'open your post in a private window. if it is there for you and gone for a signed-out browser, the post is buried and nobody told you. run this on anything that matters within an hour of posting.',
  },
  {
    icon: 'ListFilter',
    check: 'the new queue check',
    how: 'sort the sub by new and find your own post in the list. missing from /new means automod ate it. this is the check that catches a removal while you can still do something about it.',
  },
  {
    icon: 'TrendingDown',
    check: 'the flatline',
    how: 'views that stop dead a few hours in, on an account that normally does not flatline, is a removal you have not found yet. a slow post decays. a removed post stops.',
  },
] as const

export const SHADOWBAN_TRIGGERS = [
  {
    icon: 'Link2Off',
    trigger: 'a URL in the post body',
    detail: 'this is the one that kills quietly. many subs auto-remove on any link from an account under their karma or age floor, and the removal is invisible from your side.',
  },
  {
    icon: 'Copy',
    trigger: 'the same post reshaped across several subs at once',
    detail: 'volume itself has never hurt this account. the karma-building era ran 422 items in five weeks, 34 of them in a single day, and nothing was ever removed for pace. what draws the automod is the same thing rewritten five ways and fired into five subs inside an hour, which reads as a campaign because it is one.',
  },
  {
    icon: 'Megaphone',
    trigger: 'a profile that is all pitch',
    detail: 'mods check profiles. an account whose history is nothing but its own product is an easy call, and the ban covers everything you posted, not just the post that triggered it.',
  },
] as const

export const SHADOWBAN_RECOVERY = [
  {
    icon: 'Mail',
    step: 'message the mods, once, like a person',
    detail: 'say what you posted, ask what rule it hit, and offer to repost it correctly. in my experience mods reinstate more often than people expect, because almost nobody asks politely. arguing with them is how a removal becomes a ban.',
  },
  {
    icon: 'Wrench',
    step: 'fix the account, not the post',
    detail: 'if the removal came from a karma or age floor, the post was never the problem. go back to the ramp, earn the floor, and repost later. the same post lands fine from an account the filter trusts.',
  },
  {
    icon: 'DoorClosed',
    step: 'if it is sitewide, stop posting',
    detail: 'this account has never been sitewide filtered, so I have never run this play and will not pretend otherwise. what I am confident of is the part that is just arithmetic: posting more into a filter does not clear the filter, and spinning up a fresh account to escape one is how people turn a temporary problem into a permanent one.',
  },
] as const

/* ── delegation: the VA, the API, and the guardrail ─── */

export const DELEGATION = [
  {
    icon: 'UserCheck',
    name: 'the VA is a human, which is the whole point',
    desc: 'human engagement means a person reads the thread and a person writes the reply. that person can be a competent VA who knows your business and lives in your subs. the reading and the writing stay human. everything that happens before and after them is yours to automate.',
  },
  {
    icon: 'Brain',
    name: 'they need the business, not a script',
    desc: 'a VA who does not understand what you sell writes comments that are polite and useless, which the sub smells immediately. they need the offer, the objections, the words your customers actually use, and enough context to know when the honest answer is that your thing is wrong for this person. that answer is the one that earns the next thread.',
  },
  {
    icon: 'Radar',
    name: 'without the data they are guessing',
    desc: 'a VA told to go be helpful on Reddit is scrolling blind. they do not know which of last night\'s threads is worth a reply, which sub is about to remove them for it, or which question has been asked forty times this month. they burn hours in the wrong places and the one thread that mattered scrolled past at 3am.',
  },
  {
    icon: 'Shield',
    name: 'the pull is the queue and the guardrail',
    desc: 'the API hands them the last 24 hours already sorted: the threads worth answering, the sub each one lives in, and what the account is cleared to do there. they open a short list instead of a firehose, and the rules travel with the list. that is what makes handing the account to someone else survivable.',
  },
  {
    icon: 'Settings2',
    name: 'automate off Reddit, always',
    desc: 'the pull, the scoring, the routing, the content it feeds, the copy it sharpens, the ICP context it fills in, all of that runs off-platform where nothing is scanning for it. the only thing that touches Reddit is a person typing. that line is what keeps the account alive, and it does not move because you hired someone.',
  },
] as const

import redditStats from '@shawnos/shared/data/reddit-stats.json'

/* ── shared types ───────────────────────────────────── */

export interface Evidence {
  title: string
  sub: string
  tag: string
  tagColor: string
  upvotes: number
  comments: number
  views: string
  image: string
  body?: string
  lesson: string
}

/* ── formatting helper ──────────────────────────────── */

export const fmtViews = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`

/* ── the 8 post types ───────────────────────────────── */

export const POST_ARCHETYPES: {
  name: string
  emoji: string
  desc: string
  valueLead: string
  stats: string
  evidence: Evidence
}[] = [
  {
    name: 'the pattern read',
    emoji: '📡',
    desc: 'scan complaints, releases, pricing pages. turn the pattern into a post. people upvote synthesis they could not do themselves.',
    valueLead: 'for B2B marketing: synthesize 30 customer complaints instead of 3 LinkedIn posts. for SaaS: link the raw scan output.',
    stats: '308 upvotes, 115 comments, ~50K views',
    evidence: {
      title: 'Never hit a rate limit on $200 Max. Had Claude scan every complaint to figure out why.',
      sub: 'r/ClaudeCode',
      tag: 'Pattern Read',
      tagColor: '#fbbf24',
      upvotes: 308,
      comments: 115,
      views: '~50K',
      image: '/images/reddit-evidence/rate-limit-max-plan-308.png',
      body: 'three months on the $200 Max plan, zero rate limits. ran Claude over every rate-limit complaint thread in this sub to figure out what the heavy users were doing wrong. shared the pattern.',
      lesson: 'the scan was the value. cross-posted variant in r/ClaudeAI hit 227 upvotes the same way.',
    },
  },
  {
    name: 'the showcase',
    emoji: '🏗️',
    desc: 'show what you shipped. numbers, repos, screenshots. the post is the hook, the comments deliver the depth.',
    valueLead: 'for SaaS: numbers + a public repo. for Clay: a working stack diagram with the table count and the cost.',
    stats: '71 upvotes, 225 comments, 145K views',
    evidence: {
      title: 'been mass building with Claude Code every day for 6 weeks straight.',
      sub: 'r/ClaudeCode',
      tag: 'Showcase',
      tagColor: '#4ade80',
      upvotes: 71,
      comments: 225,
      views: '145K',
      image: '/images/reddit-evidence/6week-claude-code.png',
      body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms, and cron jobs running nightly on a single Mac Mini. all Claude Code.',
      lesson: 'the post was the hook, the comments were the delivery. 225 comments because I replied to every single one.',
    },
  },
  {
    name: 'the question',
    emoji: '❓',
    desc: 'ask something you genuinely want to know. technical depth invites technical answers. real stakes invite real answers.',
    valueLead: 'for GTM eng: name your real constraint, with real hardware and real budget attached. for Clay: include the table you got stuck on.',
    stats: '22 upvotes, 48 comments, 45K views',
    evidence: {
      title: 'anyone running Claude Code over SSH from a thin client?',
      sub: 'r/ClaudeCode',
      tag: 'Question',
      tagColor: '#58a6ff',
      upvotes: 22,
      comments: 48,
      views: '45K',
      image: '/images/reddit-evidence/ssh-thin-client.png',
      body: "picking up a MacBook Neo as a portable terminal. all my actual compute lives on a Mac Mini that runs 24/7. the plan is basically: SSH in, tmux attach, run Claude Code on the Mini's hardware.",
      lesson: 'genuine question, I was actually buying the Neo. 48 comments of real technical answers because people could tell it was real.',
    },
  },
  {
    name: 'the meme',
    emoji: '😂',
    desc: 'relatable humor, perfectly timed. post when a feature drops or a trend is peaking.',
    valueLead: 'for any audience: the joke has to land for an insider. one specific reference beats five generic punchlines.',
    stats: '95 upvotes, 23 comments, 18K views',
    evidence: {
      title: 'life now with cc remote control',
      sub: 'r/ClaudeCode',
      tag: 'Humor',
      tagColor: '#f472b6',
      upvotes: 95,
      comments: 23,
      views: '18K',
      image: '/images/reddit-evidence/cc-remote-gosling.png',
      body: 'Ryan Gosling meme, posted the morning Claude Code remote access dropped. zero effort, maximum relatability.',
      lesson: 'timing is everything. this took 30 seconds to post and outperformed nearly all of my long-form content.',
    },
  },
  {
    name: 'the crossover',
    emoji: '🔀',
    desc: "find unexpected subreddits where your story resonates. a plumber's son in r/NYCapartments outperformed everything in my home subs.",
    valueLead: 'for SaaS founders: bring your operator story to subs that buy what you sell, on top of the subs that build what you sell.',
    stats: '188 upvotes, 26 comments, 28K views',
    evidence: {
      title: "I spent 10 years as a plumber in NYC alongside my dad. Now I'm using tech to share everything he knows. for free.",
      sub: 'r/NYCapartments',
      tag: 'Advice/Question',
      tagColor: '#58a6ff',
      upvotes: 188,
      comments: 26,
      views: '28K',
      image: '/images/reddit-evidence/dad-plumber-nyc.png',
      body: "I'm Shawn. For 10 years I worked plumbing in New York City with my father, Reuven. Not holding tools. running jobs. Every borough. Pre-war brownstones where nothing is where the blueprints say it is.",
      lesson: 'my highest-upvoted post is in a plumbing subreddit. find where your story fits that nobody expects.',
    },
  },
  {
    name: 'the hot take',
    emoji: '🔥',
    desc: 'ride breaking news within hours. have a real opinion backed by experience.',
    valueLead: 'for Clay: 18 months of daily usage is the receipt. for B2B marketing: name the vendor and the line item.',
    stats: '21 upvotes, 18 comments, ~6K views',
    evidence: {
      title: "Clay's new pricing changes what I build with. here's my updated stack.",
      sub: 'r/gtmengineering',
      tag: 'Hot Take',
      tagColor: '#f87171',
      upvotes: 21,
      comments: 18,
      views: '~6K',
      image: '/images/reddit-evidence/clay-pricing-dual.png',
      body: '18 months of daily Clay usage. the new pricing model changed which workflows still make sense and which ones moved to Supabase + Sheets. here is the side-by-side and what each tool now owns.',
      lesson: 'a hot take with a stack diagram beats a hot take with adjectives. the receipts moved the conversation.',
    },
  },
  {
    name: 'the value drop',
    emoji: '🎁',
    desc: 'give away something useful. checklists, frameworks, audits. publish inline, link the live artifact in the body.',
    valueLead: 'for Clay: the actual checklist you use, copy-paste ready. for GTM eng: the SQL query or the Python script.',
    stats: '25 upvotes, 8 comments, ~8K views',
    evidence: {
      title: 'open-sourced my entire GTM engineering stack. not selling anything yet.',
      sub: 'r/gtmengineering',
      tag: 'Resource',
      tagColor: '#c084fc',
      upvotes: 25,
      comments: 8,
      views: '~8K',
      image: '/images/reddit-evidence/open-sourced-gtm-stack-25.png',
      body: 'MIT-licensed monorepo. ABM pipeline, Clay wiki, voice system, the full publishing pipeline, the works. every script that runs my business is in there. no email gate, no waitlist.',
      lesson: 'pure value. the people who watched me give it away are the ones who hire me later.',
    },
  },
  {
    name: 'the thought piece',
    emoji: '🧠',
    desc: 'career arc, methodology, thesis. show the journey, link the receipts.',
    valueLead: 'for SaaS founders: name the specific transition (job → first dollar → second dollar). for GTM eng: name the tools that died and the tools that replaced them.',
    stats: '27 upvotes, 9 comments, 4.1K views',
    evidence: {
      title: 'from SDR to solo GTM engineer. the AI development method behind my entire operation',
      sub: 'r/gtmengineering',
      tag: 'Thought Piece',
      tagColor: '#4ade80',
      upvotes: 27,
      comments: 9,
      views: '4.1K',
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
    detail: 'write a tight post. then drop the depth, the links, the repos in the comments. this is how you get 225 comments on a single post.',
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
    where: 'sub rules, commonly 30+ days',
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
    clear: `a balanced karma split. mine is ${redditStats.linkKarma.toLocaleString()} link / ${redditStats.commentKarma} comment, close to 50/50. the split is the tell that you live there.`,
  },
]

/* ── karma gating: the entry system ─────────────────── */

export const GATING_STEPS = [
  {
    rule: 'pick 3 subreddits that match your niche',
    detail: "5K-50K members is the sweet spot. judge a sub by its engagement ratio rather than subscriber count. mine: r/ClaudeCode, r/gtmengineering, r/GTMBuilders. then find each sub's gate before you post: minimum karma, minimum account age, automod filters. every sub has one.",
  },
  {
    rule: 'comment for weeks before you post',
    detail: "comment naturally, add value, comment again. the karma you build hyping other people's work is what lets you post your own later without reading as a self-promoter. by the time you drop your first showcase, the sub already knows your name.",
  },
  {
    rule: 'target the 50/50 post-comment split',
    detail: `${redditStats.linkKarma.toLocaleString()} link / ${redditStats.commentKarma} comment karma is my real split right now. comments are where a sub learns to trust you, posts are where that trust pays out.`,
  },
]

/* ── comment types (one flagship example each) ──────── */

export const COMMENT_TYPES: {
  name: string
  emoji: string
  desc: string
  highlight: string
  example: { image: string; context: string; upvotes: number; views: string; text: string }
}[] = [
  {
    name: 'the mega comment',
    emoji: '💎',
    desc: "a comment that IS a post. one sentence that captures the moment so perfectly it outperforms every post you've ever written.",
    highlight: '239 upvotes, 27K views. my highest-performing piece of content is a comment.',
    example: {
      image: '/images/reddit-evidence/comment-adhd-btw-237.png',
      context: 'r/ClaudeCode · "Claude just released /BTW and it\'s clutch"',
      upvotes: 239,
      views: '27K',
      text: '"Ah man, this is a gift to us Claude Code homies that have the ADHD brain. pressing escape and changes their plans every three sub-agent runs."',
    },
  },
  {
    name: 'the expert drop',
    emoji: '🎯',
    desc: 'answer a question with real experience and specific numbers. commit to the answer.',
    highlight: 'highest comment karma per impression. people upvote confidence backed by receipts.',
    example: {
      image: '/images/reddit-evidence/comment-claude-appstore.png',
      context: 'r/ClaudeAI · "Claude overtaken ChatGPT in App Store"',
      upvotes: 30,
      views: '5.9K',
      text: '"No surprise. now we have remote control access. You basically have a dev in your back pocket and Opus 4.6 is elite."',
    },
  },
  {
    name: 'the one-liner',
    emoji: '⚡',
    desc: 'short, punchy, personality. zero fluff. keeps you visible between big posts.',
    highlight: 'low effort, high personality. the comments that make people check your profile.',
    example: {
      image: '/images/reddit-evidence/comment-skill-issue.png',
      context: 'r/vibecoding · "Vibe coding sucks"',
      upvotes: 9,
      views: '170',
      text: '"Skill issue my guy. You gotta learn version control"',
    },
  },
  {
    name: 'the cross-pollinator',
    emoji: '🔗',
    desc: "drop your work in someone else's thread when it is genuinely relevant. relevance is the whole play.",
    highlight: "the plumber website dropped in r/ClaudeCode got 10K views. 5% of that is 500 visitors to dad's site.",
    example: {
      image: '/images/reddit-evidence/comment-crosspollin-plumber-claudecode.png',
      context: 'r/ClaudeCode · own post, replying about what he shipped',
      upvotes: 5,
      views: '10K',
      text: '"theplumbernyc.com Website I built for my father\'s company is already averaging 2,000 visitors a week."',
    },
  },
  {
    name: 'the thread keeper',
    emoji: '🔄',
    desc: "reply to every commenter on your own posts. every reply bumps the post and shows you're real.",
    highlight: 'your own thread is your territory. this is where a modest post turns into 225 comments and 145K views.',
    example: {
      image: '/images/reddit-evidence/comment-podcast-idea.png',
      context: 'r/NYCapartments · someone suggests a podcast',
      upvotes: 10,
      views: '708',
      text: '"Oh that sounds like a cool idea. I\'ve actually been pushing him to do a podcast"',
    },
  },
  {
    name: 'the hype man',
    emoji: '🚀',
    desc: "genuine excitement for someone else's work. builds real relationships.",
    highlight: 'the karma you build hyping others lets you post your own work without looking like a self-promoter.',
    example: {
      image: '/images/reddit-evidence/comment-jury-rigged-fire.png',
      context: 'r/ClaudeCode · "My jury-rigged rate limit solution"',
      upvotes: 8,
      views: '796',
      text: '"yeah not gonna lie, that\'s fire. If I could I\'d sponsor you to get a Claude Code max plan"',
    },
  },
  {
    name: 'the value lead',
    emoji: '🪞',
    desc: "state the principle in someone else's thread without selling. the comment is the credential.",
    highlight: 'value-leading proof in B2B subs, where readers buy what you build. the kind of comment that gets profile-checked.',
    example: {
      image: '/images/reddit-evidence/comment-b2bmarketing-reddit-art.png',
      context: 'r/b2bmarketing · thread on Reddit growth tactics',
      upvotes: 8,
      views: '~1K',
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
    upvotes: 227,
    comments: 122,
    views: '~40K',
    image: '/images/reddit-evidence/max-plan-claudeai-227.png',
    body: 'cross-post variant of the rate-limit thread, sharpened for r/ClaudeAI. same scan, different framing.',
    lesson: 'the same pattern read works in two subs when the framing matches the audience.',
  },
  {
    title: 'Supabase + Google Sheets + Claude Code replaced Clay for me. here is how.',
    sub: 'r/gtmengineering',
    tag: 'Pattern Read',
    tagColor: '#fbbf24',
    upvotes: 65,
    comments: 42,
    views: '~30K',
    image: '/images/reddit-evidence/supabase-replaced-clay-65.png',
    body: 'workflow-by-workflow swap after Clay re-priced. each task: what Clay did, what replaced it, what it now costs.',
    lesson: 'competitor-mention magnet. half the comments were Clay users running the same math.',
  },
  {
    title: '3 weeks running HubSpot from Claude Code CLI instead of MCP. 7 gotchas.',
    sub: 'r/hubspot',
    tag: 'Showcase',
    tagColor: '#4ade80',
    upvotes: 33,
    comments: 29,
    views: '~15K',
    image: '/images/reddit-evidence/hubspot-cli-gotchas-33.png',
    body: 'CLI-first HubSpot CRM ops, all 7 gotchas listed inline with the workaround under each.',
    lesson: 'r/hubspot was a brand-new sub for me. real receipts beat domain history.',
  },
  {
    title: 'Intent signals are qualification scores, not buying intent.',
    sub: 'r/GTMbuilders',
    tag: 'Thought Piece',
    tagColor: '#4ade80',
    upvotes: 7,
    comments: 14,
    views: '~2K',
    image: '/images/reddit-evidence/intent-signals-qualification-7.png',
    body: 'the Clearbox thesis stated in plain English. someone scrolling a problem thread is showing you which problem to solve first.',
    lesson: 'low score, high conversion. 3 of the 14 commenters turned into Clearbox early-access signups.',
  },
]

/* ── link map zones ─────────────────────────────────── */

export const LINK_ZONES = [
  {
    emoji: '🚫',
    zone: 'post bodies',
    verdict: 'the kill zone',
    desc: 'a URL in a post body gets auto-removed or shadow-buried in many subs. you find out days later when the views flatline at zero. describe the artifact in the post and put the link in a comment.',
  },
  {
    emoji: '💬',
    zone: 'comments',
    verdict: 'earned placement',
    desc: "drop a link in a comment when someone asks for it, or when the sub treats links as answers. the plumber-site comment in r/NYCapartments worked because a homeowner wanted the guides and the culture allows it.",
  },
  {
    emoji: '👤',
    zone: 'profile',
    verdict: 'home turf',
    desc: 'your profile is the one zone automods leave alone. pin the site, pin the repo, pin the offer. every good comment sends readers there, and the click is theirs to make.',
  },
]

export const LINK_ZONE_EVIDENCE: Evidence = {
  title: "r/NYCapartments · someone else's plumber post",
  sub: '',
  tag: 'Comment',
  tagColor: '#FF4500',
  upvotes: 5,
  comments: 0,
  views: '2.8K',
  image: '/images/reddit-evidence/comment-crosspollin-plumber-frankenstein.png',
  body: '"You should definitely check out some of the homeowner guide articles in his website"',
  lesson: 'the link landed because the culture allows it and the reader asked for exactly this. same comment in r/ClaudeCode would read as spam.',
}

/* ── what AI cites: the three signal labels ─────────── */

export const SIGNAL_LABELS = [
  {
    emoji: '🎯',
    name: 'lead',
    desc: 'pre-buy signals. the question, the complaint, the "has anyone tried X". budget pressure shows up in threads long before the switch. Aura scores these for prospect intent before the buyer self-identifies.',
  },
  {
    emoji: '⚔️',
    name: 'competitor',
    desc: '"we just switched off X." "Apollo is overpriced." "Clay\'s new model broke our workflow." these threads tell you exactly which competitor is bleeding which segment, and what the trigger was. the comments are the dataset.',
  },
  {
    emoji: '🔍',
    name: 'engager',
    desc: 'the conversation is the asset. someone asking a question, challenging your take, sharing their own stack. every reply tells you what to build next, who to talk to, and which pitch lands. Aura scores these for relationship depth.',
  },
]

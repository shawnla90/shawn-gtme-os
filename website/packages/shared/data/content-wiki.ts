/**
 * ShawnOS — Content Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { WikiSection } from './clay-wiki'

/* ── types ─────────────────────────────────────────── */

export type ContentWikiCategory =
  | 'platforms'
  | 'tools'
  | 'voice'
  | 'workflows'

export interface ContentWikiEntry {
  id: string // URL slug
  title: string
  subtitle: string // one-liner for cards
  category: ContentWikiCategory
  description: string // SEO meta description
  keywords: string[]
  sections: WikiSection[]
  related: string[] // other wiki entry IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const CONTENT_WIKI_CATEGORIES: {
  id: ContentWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'platforms',
    label: 'Platform Playbooks',
    description:
      'Algorithm breakdowns, format guides, and growth patterns per platform',
    prompt: '$ cd ~/content-wiki/platforms/',
  },
  {
    id: 'tools',
    label: 'Tools and MCPs',
    description:
      'Content creation tools, MCP integrations, and image generation',
    prompt: '$ cd ~/content-wiki/tools/',
  },
  {
    id: 'voice',
    label: 'Voice and Anti-Slop',
    description:
      'Voice system architecture, AI slop avoidance, tone calibration',
    prompt: '$ cd ~/content-wiki/voice/',
  },
  {
    id: 'workflows',
    label: 'Content Workflows',
    description:
      'Recursive flows, repo-based content, automation patterns',
    prompt: '$ cd ~/content-wiki/workflows/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getContentWikiEntry(
  slug: string,
): ContentWikiEntry | undefined {
  return CONTENT_WIKI_ENTRIES.find((e) => e.id === slug)
}

/* ── wiki entries ─────────────────────────────────── */

export const CONTENT_WIKI_ENTRIES: ContentWikiEntry[] = [
  /* ================================================================== */
  /*  PLATFORM PLAYBOOKS                                                */
  /* ================================================================== */

  {
    id: 'x-algorithm',
    title: 'X Algorithm Deep Dive',
    subtitle:
      'Full breakdown of how the For You feed actually ranks content',
    category: 'platforms',
    description:
      'Deep dive into the X (Twitter) algorithm — Home Mixer orchestration, Phoenix ranking model, Thunder retrieval, candidate pipeline stages, scoring weights, and actionable takeaways for creators.',
    keywords: [
      'X algorithm',
      'Twitter algorithm 2026',
      'For You feed algorithm',
      'X ranking model',
      'Twitter recommendation system',
    ],
    difficulty: 'advanced',
    related: [
      'x-best-practices',
      'linkedin-playbook',
      'viral-hooks',
      'content-pillars',
    ],
    sections: [
      {
        heading: 'System Architecture Overview',
        type: 'prose',
        content:
          "The X recommendation system is an open-source pipeline that decides what appears in your For You feed. It was released publicly as the xai-org/x-algorithm repo and has over 15,000 stars on GitHub. The system has four major components: Home Mixer is the orchestration layer that coordinates everything. Thunder handles in-network retrieval — pulling tweets from people you follow. Phoenix is the Grok-based transformer model that scores and ranks candidates. And the Candidate Pipeline filters, deduplicates, and assembles the final feed. Understanding this architecture is the difference between guessing what works on X and knowing what the system rewards.",
      },
      {
        heading: 'How Scoring Works',
        type: 'pattern',
        content:
          "Every tweet that enters your feed goes through a multi-action prediction model. The system predicts the probability of twelve different engagement actions: P(favorite) — will you like it. P(reply) — will you reply. P(repost) — will you retweet. P(quote) — will you quote tweet. P(click) — will you click on it. P(share) — will you share externally. P(dwell) — will you spend time reading it. P(follow_author) — will you follow the author after seeing this. P(not_interested) — will you hit not interested. P(block_author) — will you block the author. P(mute_author) — will you mute the author. P(report) — will you report the tweet.\n\nThe final score is a weighted sum: Final Score = sum(weight_i * P(action_i)). Positive actions (like, reply, repost, quote, share, dwell, follow) push the score up. Negative actions (not_interested, block, mute, report) push the score down. The weights are not equal — replies and quote tweets carry significantly more weight than likes.",
      },
      {
        heading: 'Positive vs Negative Weight Actions',
        type: 'pattern',
        content:
          "This is where it gets actionable for creators. The algorithm assigns different weights to different engagement types. Replies are weighted heavily — a tweet that sparks conversation scores higher than one that gets passive likes. Quote tweets with added commentary are also high-weight because they represent deeper engagement. Reposts carry moderate weight. Likes are the lowest positive signal — they indicate interest but not deep engagement.\n\nOn the negative side, any tweet that triggers mute, block, not_interested, or report signals gets penalized hard. A single block or report can outweigh dozens of likes. This means controversial content that gets engagement but also triggers negative signals can actually score lower than a modest post with clean positive engagement. The algorithm punishes polarizing content more than people realize.",
      },
      {
        heading: 'Phoenix Two-Tower Retrieval',
        type: 'pattern',
        content:
          "Phoenix uses a two-tower neural network architecture. One tower represents the user — your interests, your engagement history, the types of content you interact with. The other tower represents candidate tweets — the topic, the author, the format, the engagement pattern. Both towers produce embedding vectors, and the system computes similarity between them. High similarity = the tweet is likely relevant to you.\n\nKey design decisions: Phoenix uses no hand-engineered features. Everything is learned from engagement data. It also uses candidate isolation — each tweet is scored independently, not relative to the other tweets in the batch. And it predicts multiple actions simultaneously rather than just one. This means the model captures nuanced engagement patterns that a simpler system would miss.",
      },
      {
        heading: 'Practical Takeaways for Creators',
        type: 'pro-tip',
        content:
          "Based on the algorithm architecture, here is what actually moves the needle: (1) Optimize for replies and quote tweets over likes. Write tweets that invite conversation, not passive agreement. Ask questions. State takes that people want to respond to. (2) Dwell time matters. Longer tweets that people actually read score higher than short tweets they scroll past. But only if the content earns the dwell — padding with filler hurts. (3) Avoid triggering negative signals. Rage-bait might get engagement, but if it also gets mutes and blocks, the net score drops. Clean engagement beats polarizing engagement. (4) Follow signals are gold. If your tweet makes someone follow you, that is one of the strongest positive signals. Build tweets that showcase expertise worth following. (5) Consistency builds your user tower. The more consistently you post about specific topics, the stronger your signal in the user-tower matching. Niche down. (6) In-network vs out-of-network: Thunder pulls from your followers first. Building a strong follower base that engages with your content means your tweets start with a higher baseline before Phoenix even scores them for the wider feed.",
      },
      {
        heading: 'Anti-Pattern: Gaming the Algorithm',
        type: 'anti-pattern',
        content:
          "Don't try to game the algorithm with engagement pods, reply chains with your own accounts, or coordinated liking. The system detects inorganic engagement patterns. Tweets that get a burst of likes from the same network within seconds of posting get flagged differently than tweets that accumulate engagement organically over time. The model is trained on massive datasets and can distinguish between genuine engagement and coordinated activity. The sustainable approach: write content that earns real engagement. The algorithm rewards authentic interaction because that is what keeps users on the platform. Align with that incentive, don't fight it.",
      },
    ],
  },

  {
    id: 'x-best-practices',
    title: 'X Format and Growth Guide',
    subtitle:
      'Thread format, compression rules, and engagement patterns',
    category: 'platforms',
    description:
      'X (Twitter) format guide — thread structure, compression rules, micro-tip format, engagement patterns derived from the algorithm, and content pillar adaptation for the X platform.',
    keywords: [
      'X content strategy',
      'Twitter thread format',
      'X growth guide',
      'Twitter engagement',
      'X best practices 2026',
    ],
    difficulty: 'beginner',
    related: [
      'x-algorithm',
      'linkedin-playbook',
      'viral-hooks',
      'recursive-content-flow',
    ],
    sections: [
      {
        heading: 'Platform DNA',
        type: 'prose',
        content:
          "X is the compressed version of LinkedIn. Same builder voice, faster pace, tighter constraints. LinkedIn is the long-form stage. X is the live feed from the workshop. Everything that works on LinkedIn but stripped to the bone. No filler sentences. Every line earns its spot. Casual, builder, punchy. The character limit is not a limitation — it is a compression engine that forces you to find the essential version of every idea.",
      },
      {
        heading: 'Format Strategy',
        type: 'pattern',
        content:
          "Single posts: memes, reactions, one-liners, hot takes. Under 280 characters when possible. Screenshot or GIF attached. These are X-native content — not repurposed from LinkedIn.\n\nThreads: plays series (condensed), system shares, build logs. Each tweet in the thread should stand alone. Someone scrolling should get value from any single tweet even without reading the rest. Thread length: 4-8 tweets. Beyond 8 is diminishing returns.\n\nQuote tweets and replies: engage the builder community. Add a real take, not generic praise. A thoughtful quote tweet that adds context performs better algorithmically than a simple retweet because the algorithm weights quote tweets heavily.",
      },
      {
        heading: 'Thread Structure',
        type: 'pattern',
        content:
          "Tweet 1: hook — standalone value, the scroll-stop. This tweet must work even if nobody reads the thread. Tweet 2: context and setup — what tool, what signal, what problem. Tweets 3-5: the substance — 1-2 steps per tweet, emoji-marked for visual scanning. Tweet 6: result — what this actually does for pipeline or workflow. Tweet 7 (optional): resource delivery — full prompt in the reply, or link back to the expanded LinkedIn version.\n\nSchedule threads 1-2 days after the LinkedIn version drops. X gets the cliff notes, LinkedIn has the full breakdown. This creates a natural cross-platform funnel without duplicating content.",
      },
      {
        heading: 'Character and Paragraph Rules',
        type: 'pattern',
        content:
          "Single tweet: 280 characters. Write tight. A 140-character banger beats a 280-character nothing. Don't pad to fill. Thread tweets: still 280 each, but you have room to breathe across multiple.\n\nParagraph structure: one sentence per line. Period. Single-line statements hit hardest on X. No multi-sentence paragraphs — that is LinkedIn energy. Whitespace between thoughts using blank lines. Line breaks count as characters so use them intentionally.",
      },
      {
        heading: 'Content Pillars on X',
        type: 'pattern',
        content:
          "Plays Series (Condensed Threads): LinkedIn plays get condensed into 4-6 tweet threads. Hook tweet with pain point, setup tweet with tool and signal, step tweets with emoji markers, result tweet, resource tweet.\n\nBuilding and Sharing (Build Logs): shorter, punchier than LinkedIn narrative style. What you built, one key insight, screenshot or tree view attached, more-on-this-soon energy.\n\nMemes and Hot Takes (X-Native): this is where X-native content lives. Not repurposed from LinkedIn. GTM hot takes as single tweets, tool reactions with screenshot plus one-liner, pop culture GTM parallels.\n\nSystem Shares (Thread Format): what it is and why you built it, how it works in 2-3 tweets, where to get it with a link or reply-for-the-file CTA.",
      },
      {
        heading: 'Anti-Pattern: LinkedIn Energy on X',
        type: 'anti-pattern',
        content:
          "The most common mistake is taking a LinkedIn post and pasting it on X without compression. X users scroll faster, engage shorter, and expect tighter content. A 1,200 character LinkedIn post needs to become a 280 character tweet or a 4-tweet thread — not a screenshot of the LinkedIn post (those perform terribly). Compress, don't transplant. Find the one insight or one step that carries the most value and lead with that. If the full context matters, thread it. But each tweet in the thread must deliver standalone value.",
      },
    ],
  },

  {
    id: 'linkedin-playbook',
    title: 'LinkedIn Algorithm and Content Strategy',
    subtitle:
      'Algorithm signals, content pillars, and engagement patterns',
    category: 'platforms',
    description:
      'LinkedIn algorithm and content strategy guide — algorithm signals, 5 content pillars, emoji system, comment strategy, sign-off patterns, and engagement optimization for builders.',
    keywords: [
      'LinkedIn algorithm',
      'LinkedIn content strategy',
      'LinkedIn engagement',
      'LinkedIn growth',
      'LinkedIn for builders',
    ],
    difficulty: 'beginner',
    related: [
      'x-best-practices',
      'viral-hooks',
      'commenting-strategy',
      'content-pillars',
    ],
    sections: [
      {
        heading: 'Algorithm Signals That Matter',
        type: 'prose',
        content:
          "LinkedIn's algorithm prioritizes dwell time, comments, and shares in that order. A post that people stop scrolling to read — even if they don't engage — scores higher than a post that gets quick likes and scroll-past. Comments are the strongest visible signal. Posts that generate conversation threads get pushed to more feeds. Shares extend reach beyond your network. Likes are the weakest signal but still matter for initial distribution.\n\nThe algorithm also weighs early engagement heavily. The first 60-90 minutes after posting determine how wide the distribution goes. If your post gets strong engagement in that window, it enters a broader distribution cycle. If it flatlines, it stays in a narrow feed. This is why posting time matters and why your first commenters matter — they trigger the distribution flywheel.",
      },
      {
        heading: 'The Five Content Pillars',
        type: 'pattern',
        content:
          "Pillar 1 — Plays Series (highest performing): formatted as step-by-step workflow walkthroughs with emoji markers. Pain point or contrarian hook, series title and play number, step-by-step workflow, why-this-matters context, no-gatekeeping resource delivery to comments, identity sign-off. Screen recording or screenshot attached.\n\nPillar 2 — Building and Sharing: narrative, reflective, personal journey. Personal opener about what you built or what broke, the messy real process, the insight or shift in thinking, invitation to connect. Longer sentences allowed. More storytelling, less structure.\n\nPillar 3 — GTM Memes: short text plus meme, gif, or video. Setup line with relatable GTM pain, punchline or meme context, engagement ask, brief sign-off. Pop culture references — anime, wrestling, music — always with a real lesson underneath.\n\nPillar 4 — Release Reactions: first-hand builder take on new tool features. What changed, how you tested it, specific workflow it enables, forward-looking take.\n\nPillar 5 — Skill and System Shares: sharing actual frameworks and skill files. What you built and why, how it works, where to get it, comment thread with deeper insights.",
      },
      {
        heading: 'Paragraph and Formatting Rules',
        type: 'pattern',
        content:
          "1-2 sentences maximum per paragraph. Lots of whitespace for mobile scrolling. Short punchy lines create rhythm. Single-line statements for emphasis. LinkedIn is read on phones — long paragraphs get skipped.\n\nOpening line: always lowercase first word unless it is a proper noun or first-person I. Strong hook in the first 2 lines. Lead with pain, a contrarian take, or action. No generic greetings.\n\nEmoji usage is structural, not decorative. Workflow step markers: checkmarks, wrenches, links, brains, puzzle pieces. Identity markers: lightning bolt, wizard. Tone signaling: self-deprecating, frustrated, knowing. Each emoji marks a step, signals tone, or anchors identity. Don't scatter them randomly.",
      },
      {
        heading: 'Comment Strategy',
        type: 'pattern',
        content:
          "Your comments section is a content delivery channel, not an afterthought. Full prompts and formulas go in comments. Follow-up insights and deeper reasoning in comment threads. Reply to commenters with one-line value adds, not generic thanks.\n\nValue delivery CTAs: prompts in the comments, formula plus HTTP API setup in the comments, don't sleep on the comments, documented the full process in the comments. Co-building CTAs for narrative posts: DM me if you're building something similar. Engagement CTAs for meme posts only: what is your version, drop it in the comments.\n\nNever use: what do you think comment below, agree hit that like button, follow me for more tips. These are engagement bait patterns that LinkedIn users see through instantly.",
      },
      {
        heading: 'Sign-Off as Identity Anchor',
        type: 'pro-tip',
        content:
          "Your sign-off is not a CTA — it is an identity anchor. Variations: shawn the gtme alchemist with wizard emoji, shawn with lightning bolt GTM Engineer, shawn with lightning bolt and pipe the gtme alchemist with wizard emoji. Always include the lightning bolt or wizard or both. The sign-off becomes a recognizable pattern that builds brand recall across posts. People should see the sign-off and know who wrote it before they even read the name.",
      },
      {
        heading: 'Anti-Pattern: Performing Expertise',
        type: 'anti-pattern',
        content:
          "The biggest LinkedIn trap is performing expertise instead of sharing it. Authority signaling phrases like the uncomfortable truth, let me be clear, what most people miss — these are performance, not substance. State your observation directly. Share the specific tool, the specific workflow, the specific result. If you built something that works, show it working. A screenshot of the actual Clay table beats a paragraph about how important data enrichment is. LinkedIn rewards specifics over generalities, always.",
      },
    ],
  },

  {
    id: 'tiktok-playbook',
    title: 'TikTok Algorithm and Content Strategy',
    subtitle:
      '16-second structure, 6 content series, and hook-demo-result format',
    category: 'platforms',
    description:
      'TikTok algorithm and content strategy — 16-second video structure, hook-demo-result-loop format, 6 content series, watch time signals, and cross-platform distribution for builders.',
    keywords: [
      'TikTok algorithm',
      'short form video strategy',
      'TikTok for developers',
      'TikTok content strategy',
      'TikTok growth 2026',
    ],
    difficulty: 'intermediate',
    related: [
      'x-best-practices',
      'linkedin-playbook',
      'recursive-content-flow',
      'design-tools',
    ],
    sections: [
      {
        heading: 'Platform DNA',
        type: 'prose',
        content:
          "TikTok is the compression layer underneath X. LinkedIn tells the story. X gives you the cliff notes. TikTok gives you the moment. One win, one demo, one scroll-stop. 16 seconds or less. The entire platform runs on fast, useful, loopable — and that is exactly how builder content should work here.\n\nThis is not a dance platform anymore. It is where people learn things in 15 seconds that would take a blog post 10 minutes to explain. That is the lane. The version of you that shows someone a shortcut over their shoulder in 12 seconds and walks away.",
      },
      {
        heading: 'The 16-Second Structure',
        type: 'pattern',
        content:
          "Hook (0-2 seconds): hit curiosity or pain point immediately. On-screen text carries 90% of the stop. One sentence, bold, clear. Lowercase first word, same voice rules apply.\n\nDemo (3-10 seconds): show the thing happening. No long explanation. Screen recording or over-the-shoulder style. Screen capture is king. Zoom into the action. Crop tight on what matters. Fast cuts, no dead time.\n\nResult (10-14 seconds): show what happened. The output, the saved time, the working thing. Time saved as before/after, visual result or output, code working, problem solved.\n\nLoop Closer (14-16 seconds): soft CTA or visual loop back to the hook. Save this, try it, part 2 question mark. Visual loop where end frame matches start frame for auto-replays. Comment prompt for what to show next.",
      },
      {
        heading: 'Six Content Series',
        type: 'pattern',
        content:
          "Easy Wins with Claude Code: single-use-case demos. One slash command or feature per video. Screen recording, show the output. Lowest lift, highest volume potential.\n\nCursor in 15 Seconds: Cursor-specific shortcuts, features, and tricks most people miss. Hidden features, keyboard shortcuts, MCP integrations. Always screen-captured, zoomed, annotated.\n\nSlash Commands You Didn't Know You Needed: showcase the skills and slash commands from the content OS. Each video equals one command, one result. Natural funnel to GitHub and LinkedIn for depth.\n\nOne Shortcut a Day: daily cadence series. Any tool — Claude, Cursor, Clay, HeyReach, n8n. Formula: problem 2 seconds, shortcut 8 seconds, result 4 seconds, save CTA 2 seconds.\n\nDo This Not That (AI Tool Edition): comparison format. Side-by-side or sequential. The wrong way creates tension, the right way delivers the payoff. Split screen works well.\n\nGTM Plays (The 30-Second Version): repurposed from the LinkedIn Plays series. Extract the aha moment, screen recording of the critical step, full breakdown on LinkedIn as cross-platform CTA.",
      },
      {
        heading: 'Watch Time Signals',
        type: 'pro-tip',
        content:
          "TikTok's algorithm is simpler than X or LinkedIn in one key way: watch time is everything. Completion rate — what percentage of viewers watch to the end — is the primary distribution signal. Replay rate multiplies it. A 16-second video that people watch twice scores higher than a 60-second video that people abandon at 30 seconds.\n\nThis is why the 16-second cap matters. Shorter videos have higher completion rates by default. A tight 16-second video with a visual loop that triggers auto-replay can accumulate massive watch time numbers relative to its length. Front-load the hook. Deliver fast. Close with a loop. That is the formula.",
      },
      {
        heading: 'Visual and Audio Rules',
        type: 'pattern',
        content:
          "Bold text overlays: large, readable on mobile, 2-3 words max per text block. Captions always on — most people watch without sound. Screen recordings: crop tight, zoom on the action, no full-screen IDE shots because too much noise. Split-screen or green screen when personality matters, screen-only when the demo speaks for itself. Fast cuts and zooms using CapCut or TikTok editor.\n\nAudio: trending sounds muted or low plus text overlay as the safe default. Direct-to-cam voiceover when personality adds value. Screen recording with narration for complex demos. No background music that competes with speech.\n\nCaptions: lowercase first word, capitalize I, short and punchy, 1-2 lines max. The caption supports the video, it does not replace it. Tags: 3-5 relevant tags per video, mix niche and broad.",
      },
      {
        heading: 'Anti-Pattern: Tutorial Channel Energy',
        type: 'anti-pattern',
        content:
          "The fastest way to kill a TikTok video is opening with hey guys today we are going to learn. That is tutorial channel energy and TikTok users scroll past it instantly. The demo IS the content. Start with the hook, show the thing, deliver the result. No preamble. No introduction. No explaining what you are about to explain.\n\nAlso avoid: videos longer than 60 seconds (aim for 16, cap at 30 for complex demos), static screen recordings with no text overlays, over-produced content with motion graphics (raw screen recordings with text overlays outperform polished intros), and posting without captions since most viewers have sound off.",
      },
    ],
  },

  {
    id: 'reddit-strategy',
    title: 'Reddit Content Strategy',
    subtitle:
      'Subreddit targeting, karma signals, and authentic engagement',
    category: 'platforms',
    description:
      'Reddit content strategy for builders — subreddit targeting, karma and engagement signals, authentic participation patterns, AMA strategy, and cross-posting without getting flagged as spam.',
    keywords: [
      'Reddit marketing strategy',
      'Reddit content',
      'Reddit for SaaS',
      'Reddit engagement',
      'Reddit growth strategy',
    ],
    difficulty: 'intermediate',
    related: [
      'linkedin-playbook',
      'substack-growth',
      'recursive-content-flow',
      'content-pillars',
    ],
    sections: [
      {
        heading: 'Why Reddit Is Different',
        type: 'prose',
        content:
          "Reddit is not a broadcast platform. It is a community platform. The difference matters for everything that follows. On LinkedIn, you post to your audience. On Reddit, you participate in someone else's community. The community was there before you. They have norms, inside jokes, moderators, and zero tolerance for self-promotion disguised as content.\n\nThis makes Reddit the hardest platform to grow on through traditional content marketing. It is also the most valuable for SEO and authentic trust-building. Reddit threads rank on Google. A helpful answer in a subreddit can drive traffic for years. But only if you approach it as a participant, not a marketer.",
      },
      {
        heading: 'Subreddit Targeting',
        type: 'pattern',
        content:
          "Start with subreddit research, not content creation. Identify 5-10 subreddits where your target audience actually hangs out. For GTM and builder content: r/salesengineering, r/sales, r/startups, r/SaaS, r/Entrepreneur, r/CodingTools, r/ChatGPT, r/ClaudeAI, r/cursor.\n\nFor each subreddit: read the rules (every subreddit has different self-promotion rules). Sort by top posts of the past month to understand what resonates. Read comment sections to understand the community tone. Note which types of posts get engagement vs which get downvoted.\n\nThen lurk for at least a week before posting. Comment on other people's posts. Add genuine value. Build karma in the community before you ever share your own content. Reddit users check post history. If your account is nothing but self-promotion, you get downvoted and possibly banned.",
      },
      {
        heading: 'Karma and Engagement Signals',
        type: 'pattern',
        content:
          "Reddit's ranking algorithm uses upvotes, comments, and time decay. A post that gets rapid upvotes in the first hour rises fast. But unlike LinkedIn, downvotes actively hurt visibility. A post at 60% upvoted (meaning 40% downvoted) will underperform a post at 95% upvoted with fewer total votes.\n\nComments are weighted heavily. Posts with active comment sections — especially from the OP engaging with replies — get boosted. Reddit rewards conversation. A post where you drop information and disappear performs worse than a post where you stick around and answer questions in the comments for the next 2 hours.\n\nAwards and saves also signal quality. A saved post tells Reddit this content has lasting value. Award-worthy content gets algorithmic preference in the subreddit and on users' home feeds.",
      },
      {
        heading: 'Content That Works on Reddit',
        type: 'pattern',
        content:
          "What performs: detailed how-I-did-it breakdowns with specific numbers, tool comparisons with honest pros and cons (not thinly veiled promotions), problem-solving posts where you share a real solution to a real problem, data-backed analysis, and AMA-style posts where you share expertise and answer questions.\n\nWhat gets downvoted: anything that reads like marketing copy, posts that link to your blog or product without substantial Reddit-native content, generic advice without specifics, and anything with a CTA that feels promotional.\n\nThe rule: give 90% of the value in the Reddit post itself. If you link out, the post should be complete without the link. The link is a bonus for people who want to go deeper. If your post only makes sense if they click the link, it is a promotion, not content.",
      },
      {
        heading: 'Cross-Posting Without Getting Flagged',
        type: 'pro-tip',
        content:
          "Cross-posting the same content across multiple subreddits is a fast way to get flagged as spam. Reddit's systems detect identical posts across communities. If you want to share something across 3 subreddits, write 3 different versions. Same core insight, different framing for each community's norms.\n\nTiming matters: don't post to multiple subreddits within the same hour. Space them out across days. And adjust the title and opening for each community — what resonates in r/startups is different from what works in r/ClaudeAI.\n\nFor linking to your own content (LinkedIn posts, Substack articles, tools): the safest approach is to write a valuable Reddit-native post and mention the external resource casually in the comments, not the main post. Let someone ask for the link. Or add it as an edit after the post has gained traction organically. This feels native rather than promotional.",
      },
      {
        heading: 'Anti-Pattern: Reddit as a Distribution Channel',
        type: 'anti-pattern',
        content:
          "Do not treat Reddit as a distribution channel for content created elsewhere. The I wrote a blog post, let me share it on Reddit approach fails almost every time. Reddit communities can smell external promotion from a mile away. The post gets downvoted, the account gets flagged, and moderators ban you.\n\nThe inversion: Reddit is a content creation platform that happens to drive distribution. Write for the subreddit first. If the content is genuinely valuable, it will get upvoted, ranked on Google, and drive more long-term traffic than any LinkedIn post. But you have to earn it by being a real community member, not a drive-by marketer.",
      },
    ],
  },

  {
    id: 'substack-growth',
    title: 'Substack Newsletter Growth',
    subtitle:
      'Newsletter structure, Notes strategy, and subscriber growth',
    category: 'platforms',
    description:
      'Substack newsletter growth strategy — content structures, Notes feed strategy, cross-promo patterns, lead magnets, subscriber growth tactics, and the shift from custom artwork to build artifacts.',
    keywords: [
      'Substack growth',
      'newsletter strategy',
      'Substack Notes',
      'newsletter growth 2026',
      'Substack for builders',
    ],
    difficulty: 'beginner',
    related: [
      'linkedin-playbook',
      'recursive-content-flow',
      'content-pillars',
      'repo-content-system',
    ],
    sections: [
      {
        heading: 'Platform DNA',
        type: 'prose',
        content:
          "Substack is the deep-dive layer. LinkedIn and X hook, compress, and spark. Substack expands, deepens, and builds the longer relationship. This is where a 3-line hook becomes a 600-word breakdown. Where a screenshot becomes a full build log. Where the 50 early subscribers become the core audience that follows the whole arc.\n\nThe tone is long-form extension of builder voice. More reflective, more room to breathe. Sentences can run longer than LinkedIn. Paragraphs can have 2-3 sentences. But the same casual competence — never academic, never corporate. Think: the version of you that sits down after shipping something and explains how the whole thing works to someone who is about to build their own.",
      },
      {
        heading: 'Four Content Structures',
        type: 'pattern',
        content:
          "Personal POV Essay: start with a story, zoom out to a lesson. 400-800 words. First-person, reflective. The messy reality is the content. Ends with insight, not a CTA.\n\nTactical Breakdown: step-by-step how-I-did-it. 500-800 words. Screenshots and code snippets inline. Numbered steps or clear sections. Enough to be useful, not so much they don't need to build it themselves. The Substack version of a GTM Play.\n\nContrarian Take: opinion-based issue with a strong stance. 300-600 words. Lead with the take, defend with specifics. Conviction-driven, not clickbait. Works best when reacting to something real.\n\nCurated Drop: links plus commentary on things you are watching, reading, building. 300-500 words. 3-5 items with your take on each. Good for weeks when you are building more than writing. Lowest lift, still delivers value.",
      },
      {
        heading: 'Notes Strategy',
        type: 'pattern',
        content:
          "Substack Notes are short-form social posts in the Substack feed. Not articles. 1-4 sentences. Ultra-casual builder energy. Think what is on your mind, not here is my take.\n\nRules: no titles, no headers, no CTAs. Lowercase everything except I. Screenshots from the build welcome but not required. The sweet spot is 2-3 sentences. Frequency: 2-3 times per week minimum, daily when shipping.\n\nNotes build subscriber relationship between newsletter issues. They keep you visible in the Substack feed without the overhead of writing a full post. They also signal to the algorithm that your publication is active, which helps newsletter discovery.",
      },
      {
        heading: 'Subject Line and Hook Strategy',
        type: 'pro-tip',
        content:
          "Substack gives you a subject line AND a preview text, so the hook gets split. Subject line: the scroll-stop. Short, punchy, curiosity or contrarian. 5-10 words. Preview text: the context line. What this issue covers. One sentence. First line of body: can be softer than LinkedIn because the subject line already did the hooking. Start with story, context, or setup.\n\nGood subject lines: I built a content operating system inside a code editor. The skill tree that runs my entire workflow. Why I stopped making AI art for my newsletter. Bad: You Won't Believe What I Built This Weekend. Newsletter Update #6. Always lowercase unless proper noun or I. No clickbait. Should work as a standalone statement.",
      },
      {
        heading: 'Cross-Platform Growth Flywheel',
        type: 'pattern',
        content:
          "The growth model: LinkedIn posts hook interest. The CTA drives to Substack for the expanded version. X threads tease the key insight. TikTok demos the visual moment. Every platform feeds back to the newsletter as the long-form home base.\n\nCross-posting rules: GTM Plays start on LinkedIn, expand into Tactical Breakdown on Substack 3-5 days later. Build logs start on X or LinkedIn, expand into full POV Essay on Substack. Hot takes on X expand into Contrarian Takes if they have legs. Original deep dives start on Substack, then get condensed for LinkedIn and X after publish.\n\nThe newsletter is not competing with social — it is the destination that social points to. Every social post is a potential on-ramp to a Substack subscriber.",
      },
      {
        heading: 'Visual Strategy Shift',
        type: 'pattern',
        content:
          "No more custom artwork. The legacy approach used custom anime illustrations per newsletter issue. That is over. Visuals now come from the build itself: Cursor screenshots with skill files open, repo tree views, Claude chat outputs that produced something useful, screen recordings of workflows running, and inline code snippets.\n\nOne visual per post minimum. It should be something you already have from building — zero extra production time. The content IS the visual. This removes the bottleneck of art production and lets you publish at the speed of building instead of the speed of designing.",
      },
    ],
  },

  /* ================================================================== */
  /*  TOOLS AND MCPs                                                    */
  /* ================================================================== */

  {
    id: 'typefully-mcp',
    title: 'Typefully MCP for Content Scheduling',
    subtitle:
      'Draft, schedule, and cross-post using the Typefully MCP server',
    category: 'tools',
    description:
      'How to use the Typefully MCP server for drafting, scheduling, and cross-posting content from inside Cursor. Content automation patterns for LinkedIn and X.',
    keywords: [
      'Typefully',
      'content scheduling tool',
      'Typefully MCP',
      'social media scheduling',
      'content automation',
    ],
    difficulty: 'beginner',
    related: [
      'content-mcps',
      'content-skills',
      'recursive-content-flow',
      'repo-content-system',
    ],
    sections: [
      {
        heading: 'What Typefully MCP Does',
        type: 'prose',
        content:
          "Typefully is a content scheduling platform for X and LinkedIn. The Typefully MCP server connects it directly into your Cursor IDE, meaning you can draft, schedule, and manage posts without leaving your code editor. This is the bridge between writing content in markdown files and actually publishing it to social platforms.\n\nThe MCP exposes tools for creating drafts, scheduling posts at specific times, managing your content queue, and cross-posting between X and LinkedIn. Combined with the final-copy skill, you can go from markdown draft to scheduled post in a single command sequence.",
      },
      {
        heading: 'Core Workflow',
        type: 'pattern',
        content:
          "The typical flow: (1) Write the post as a markdown file in content/drafts/. (2) Run the final-copy skill to normalize voice and extract platform-ready text. (3) Use Typefully MCP to create a draft on the platform. (4) Optionally schedule it for a specific time. (5) The post publishes automatically.\n\nFor threads on X: Typefully handles thread formatting natively. You write each tweet separated by a delimiter, and the MCP pushes the full thread as a single draft. No manual splitting, no copy-paste into the X interface tweet by tweet.\n\nFor cross-posting: draft once, publish to both X and LinkedIn with platform-appropriate formatting. Typefully handles the format differences between platforms.",
      },
      {
        heading: 'Scheduling Patterns',
        type: 'pattern',
        content:
          "Content scheduling follows a rhythm, not a fixed calendar. LinkedIn posts perform best Tuesday through Thursday, mornings EST. X posts are more flexible but evenings tend to perform well for builder audiences.\n\nThe pattern: batch-write content during deep work sessions, schedule for distribution across the week. A single writing session can produce 3-5 posts that get scheduled across a week. This separates creation from distribution — you write when you are in flow state and publish when the audience is active.\n\nTypefully's queue feature lets you add posts to a queue without specific times. The queue distributes them according to your preset schedule. This is the lowest-friction approach for consistent posting.",
      },
      {
        heading: 'Integration with the Content OS',
        type: 'pro-tip',
        content:
          "The real power is the integration loop: markdown drafts in the repo get version controlled. The final-copy skill normalizes voice and extracts clean text. Typefully MCP pushes to the scheduling platform. Published posts get tracked in the daily tracker.\n\nThis means your entire content pipeline — from idea capture to published post — lives inside your IDE. You never need to open Typefully's web interface, never need to copy-paste between tools, never need to context-switch from your code editor. The content operating system handles end-to-end.",
      },
    ],
  },

  {
    id: 'design-tools',
    title: 'Figma, Canva, and VEED for Content',
    subtitle:
      'When to use each tool, template workflows, and video editing',
    category: 'tools',
    description:
      'When to use Figma, Canva, and VEED for content creation — thumbnail creation, carousel design, video editing with VEED, template workflows, and choosing the right tool for each content type.',
    keywords: [
      'Figma content design',
      'Canva templates',
      'VEED video editing',
      'content design tools',
      'social media design',
    ],
    difficulty: 'beginner',
    related: [
      'image-generation-tools',
      'python-pillow',
      'tiktok-playbook',
      'content-mcps',
    ],
    sections: [
      {
        heading: 'Tool Selection Framework',
        type: 'prose',
        content:
          "Not every visual needs the same tool. The decision framework: Figma for custom, precise design work — thumbnails, branded templates, carousel posts that need exact spacing and typography. Canva for quick, template-based visuals — when speed matters more than pixel-perfect control. VEED for video editing — TikTok clips, screen recording overlays, subtitle generation, and short-form video production.\n\nThe default for most social content should be the fastest tool that produces acceptable quality. A Canva template finished in 5 minutes beats a Figma masterpiece that took 2 hours — especially when the post's performance depends on the text, not the visual.",
      },
      {
        heading: 'Figma for Content Creators',
        type: 'pattern',
        content:
          "Figma shines for: LinkedIn carousel posts with consistent branding, YouTube thumbnails with custom typography, branded templates that get reused across dozens of posts, and any visual where precise alignment and spacing matter.\n\nThe template approach: build a master template with your brand colors, fonts, and layout grid. Duplicate the template for each new piece. This way you spend the design time once and produce content visuals in minutes.\n\nFor carousels: set up a frame at 1080x1350 pixels (LinkedIn's carousel aspect ratio). Build a master slide with your header, body text area, and footer. Duplicate for each slide in the carousel. Export as PDF. Upload to LinkedIn. The entire process takes 15-20 minutes once the template exists.",
      },
      {
        heading: 'Canva for Speed',
        type: 'pattern',
        content:
          "Canva is the fast lane. Use it when you need a visual in under 5 minutes and the design does not need to be custom. Quote graphics for X, simple announcement visuals, story templates, and any one-off visual that will not be reused.\n\nCanva's AI features have gotten good enough for quick resizing across platforms — design once at LinkedIn dimensions, auto-resize for X, Instagram, and TikTok. The brand kit feature lets you lock in your colors and fonts so even quick designs stay on brand.\n\nWhere Canva falls short: complex multi-element layouts, precise typography control, and anything that needs to feel premium. If the visual represents your brand at a high level — like a hero image for a Substack post — use Figma. If it is a supporting visual for a social post, Canva is fine.",
      },
      {
        heading: 'VEED for Video',
        type: 'pattern',
        content:
          "VEED handles the video editing pipeline for TikTok, Reels, and Shorts content. Core workflows: auto-subtitles (essential since most social video is watched without sound), screen recording cleanup (trimming, zooming, cropping), text overlay animation, green screen effects, and multi-clip assembly.\n\nThe TikTok production flow: record your screen demo with QuickTime or OBS. Import into VEED. Trim to 16 seconds. Add bold text overlays for the hook. Auto-generate subtitles. Add zoom effects on the key action. Export in vertical 9:16 format. Upload to TikTok, Reels, and Shorts.\n\nVEED's advantage over CapCut: browser-based, no app install, better subtitle accuracy, and easier screen recording integration. CapCut has more TikTok-native templates, so use that for trend-based content. Use VEED for tool demo and educational content.",
      },
      {
        heading: 'Anti-Pattern: Over-Designing Social Content',
        type: 'anti-pattern',
        content:
          "The biggest time sink in content creation is over-designing visuals for social posts. A LinkedIn post with a raw screenshot of your actual tool performing a task will outperform a professionally designed infographic about the same topic. Authenticity signals beat production quality on social platforms.\n\nThe rule: spend 80% of your time on the text and 20% on the visual. If the visual is a real screenshot, a real screen recording, or a real code snippet — that is more authentic than a designed graphic. Design tools are for specific use cases (carousels, thumbnails, brand assets), not for every post.",
      },
    ],
  },

  {
    id: 'python-pillow',
    title: 'Terminal-Style Images with Python Pillow',
    subtitle:
      'Building branded terminal images with monospace typography',
    category: 'tools',
    description:
      'Building branded terminal-style images with Python Pillow — Anthropic color schemes, monospace typography, boot-sequence aesthetics, matrix rain backgrounds, and real skill implementations.',
    keywords: [
      'Python Pillow social images',
      'terminal aesthetic',
      'Python image generation',
      'monospace typography',
      'terminal style images',
    ],
    difficulty: 'intermediate',
    related: [
      'image-generation-tools',
      'design-tools',
      'content-skills',
      'content-mcps',
    ],
    sections: [
      {
        heading: 'Why Python Pillow for Content Images',
        type: 'prose',
        content:
          "Python Pillow (PIL fork) generates images programmatically. For a content operating system that lives in a code editor, this means images are code — version controlled, reproducible, parameterized. You do not open Figma. You run a script.\n\nThe terminal aesthetic — black background, green accent, monospace font — is the visual identity of the content OS. It is distinctive, instantly recognizable, and impossible to replicate with Canva templates. Every image looks like it came from a real terminal because it was generated by code that follows terminal design principles.",
      },
      {
        heading: 'The Anthropic Color Scheme',
        type: 'pattern',
        content:
          "The base palette: background black (#0D0D0D or #111111), primary text green (#00FF41 — terminal green), secondary text white (#E0E0E0 — slightly off-white for readability), accent amber (#FFB000 — for warnings, highlights), dim text gray (#555555 — for comments and secondary info), border subtle (#1A1A1A — barely visible panel borders).\n\nThis is not random. It mirrors the Anthropic/Claude terminal aesthetic — dark, clean, professional but with personality. The green-on-black is the signature. Every image generated by the content OS uses this palette, creating visual consistency across hundreds of posts without a design system document.",
      },
      {
        heading: 'Boot-Sequence Aesthetic',
        type: 'pattern',
        content:
          "The boot-sequence style is the hero format for article images and LinkedIn carousel covers. Structure: header with system name and version, a loading or initialization sequence with timestamps, the core content rendered as system output, footer with status line.\n\nThis mimics a real system booting up — the AI/os brand identity in visual form. Each image tells a story of a system starting up, loading modules, and presenting information. It is information-dense, visually striking, and completely unique to this brand.\n\nImplementation: Pillow draws text line by line with calculated Y positions. Each line has a specific color (green for system prompts, white for content, amber for highlights). Font size varies by importance. The monospace font (typically Fira Code or JetBrains Mono) sells the terminal authenticity.",
      },
      {
        heading: 'Matrix Rain Backgrounds',
        type: 'code',
        content:
          "Matrix rain is the background effect for X tip images and feature announcement visuals. Implementation: generate columns of random characters (katakana, Latin, numbers) at varying opacity. Draw them top-to-bottom in green with alpha fade. Overlay the actual content on top with a semi-transparent black panel.\n\nThe technique: create a base image with the rain characters drawn at 10-30% opacity. Then draw a centered content panel with 85% opacity black background. The content text goes on the panel. The result: readable content floating on a subtle matrix rain field.\n\nThis is implemented in the x-tip-image skill and the aios-image skill. Each uses the same rain generation function but with different panel layouts and content structures. The rain function itself takes parameters for density, character set, and fade speed.",
      },
      {
        heading: 'Real Implementations',
        type: 'pro-tip',
        content:
          "Three skills in the content OS use Python Pillow directly: aios-image generates the terminal boot-sequence article images. x-tip-image generates matrix rain backgrounds with centered tip panels for X micro-tip posts. content-images is the general-purpose image generator for any custom visual need.\n\nEach skill follows the same architecture: define the canvas size, set up the color palette, calculate text positions, draw background elements, draw text with appropriate fonts and colors, save to the content output directory. The skills are parameterized — you pass in the content text, and the image generates automatically.\n\nThis means image generation is part of the content pipeline, not a separate design step. Write the post. Generate the image. Publish. All from the same editor.",
      },
    ],
  },

  {
    id: 'content-mcps',
    title: 'MCP Servers for Content Building',
    subtitle:
      'How MCPs power a content operating system from inside Cursor',
    category: 'tools',
    description:
      'MCP servers for content building — Typefully, Substack, Slack, browser-use for LinkedIn, and how Model Context Protocol integrations power a content operating system from inside Cursor.',
    keywords: [
      'MCP servers content',
      'AI content tools',
      'Model Context Protocol',
      'Cursor MCP',
      'content automation MCP',
    ],
    difficulty: 'intermediate',
    related: [
      'typefully-mcp',
      'content-skills',
      'repo-content-system',
      'design-tools',
    ],
    sections: [
      {
        heading: 'What MCPs Enable',
        type: 'prose',
        content:
          "Model Context Protocol servers give your AI agent the ability to interact with external platforms. For content creation, this means the agent in your code editor can directly publish to Typefully, create drafts on Substack, read and post to Slack, interact with LinkedIn through browser automation, and manage your entire content pipeline without you ever leaving the IDE.\n\nThe shift is fundamental: instead of writing content in your editor, then copying it to each platform manually, the content OS handles distribution as part of the pipeline. Write once, publish everywhere, all orchestrated by agent skills that call MCP tools.",
      },
      {
        heading: 'The Content MCP Stack',
        type: 'pattern',
        content:
          "Typefully MCP: drafting and scheduling posts for X and LinkedIn. Create drafts, schedule publication times, manage the content queue. This is the primary publishing pipeline for social content.\n\nSubstack MCP: creating newsletter drafts directly on Substack. The final-substack skill uses this to push finalized posts without opening the Substack editor. Handles title, subtitle, and body content.\n\nSlack MCP: reading and posting to Slack channels. Used for partner communications, syncing channel history to markdown, posting reminders, and sending content updates to team channels.\n\nBrowser-use MCP: browser automation for platforms without APIs. Used for LinkedIn interactions — reading posts, posting comments, checking engagement metrics. The browser agent navigates LinkedIn like a human, which is the only reliable way to interact with LinkedIn programmatically.\n\nVercel MCP: deployment pipeline for the website. After making content or feature changes to the site, deploy directly from the editor.",
      },
      {
        heading: 'MCP-Powered Content Workflows',
        type: 'pattern',
        content:
          "Example workflow — publish a LinkedIn play: (1) Write the post in content/drafts/ as markdown. (2) Run final-copy to normalize voice and format. (3) Typefully MCP creates the draft on LinkedIn. (4) Browser-use MCP opens the published post to monitor engagement. (5) Slack MCP posts a notification to the content channel. (6) Daily tracker skill logs the publication.\n\nExample workflow — newsletter publish: (1) Write the post in content/substack/drafts/. (2) Run final-substack to normalize and push to Substack via MCP. (3) After publishing, the skill generates LinkedIn and X cross-promo snippets. (4) Typefully MCP schedules the cross-promo posts for the next day.\n\nEach workflow is a chain of MCP calls orchestrated by skills. The agent knows which MCPs to call, in what order, with what data. You trigger it with a single slash command.",
      },
      {
        heading: 'Building Your Own Content MCP',
        type: 'pro-tip',
        content:
          "Any platform with an API can become an MCP server. The pattern: identify the API endpoints you need (create draft, schedule, publish). Write an MCP server that exposes those endpoints as tools. Configure it in your Cursor MCP settings. Now your agent can call those tools directly.\n\nFor content platforms specifically: most expose create and read endpoints. That covers drafting and publishing. Some expose analytics endpoints — that lets your agent pull performance data and factor it into content decisions.\n\nThe meta-pattern: every new platform you add to your content distribution expands the operating system's reach without changing any existing workflows. Add the MCP, update the relevant skill to include it in the pipeline, done. The architecture scales horizontally.",
      },
    ],
  },

  {
    id: 'image-generation-tools',
    title: 'Image Generation Approaches',
    subtitle:
      'Python Pillow vs AI image gen vs design tools — when to use what',
    category: 'tools',
    description:
      'Image generation approaches for content creators — Python Pillow for terminal aesthetics, AI image generation, design tools, color schemas, and template categories for social content.',
    keywords: [
      'content image generation',
      'social media image tools',
      'AI image generation',
      'Python Pillow vs Canva',
      'branded content images',
    ],
    difficulty: 'beginner',
    related: [
      'python-pillow',
      'design-tools',
      'content-skills',
      'tiktok-playbook',
    ],
    sections: [
      {
        heading: 'Three Approaches',
        type: 'prose',
        content:
          "There are three ways to generate images for content: programmatic generation with Python Pillow, AI image generation with models like DALL-E or Midjourney, and manual design with tools like Figma or Canva. Each has a lane. The mistake is using one for everything.\n\nPython Pillow: deterministic, reproducible, brand-consistent. Best for terminal-style images, data visualizations, text-heavy images, and anything that needs to look like it came from a system. Zero variance between runs with the same input.\n\nAI image generation: creative, novel, unpredictable. Best for conceptual imagery, artistic visuals, and situations where you want something unique but do not need pixel-perfect control. Not great for text-in-images or precise layouts.\n\nDesign tools (Figma/Canva): controlled, template-based, flexible. Best for carousels, thumbnails, brand assets, and any visual that needs human-directed layout decisions. The middle ground between programmatic and AI.",
      },
      {
        heading: 'Color Schemas',
        type: 'pattern',
        content:
          "Anthropic Terminal: black background (#0D0D0D), green primary (#00FF41), white secondary (#E0E0E0), amber accent (#FFB000). The signature look. Used for all terminal-style, boot-sequence, and system-output images.\n\nSynthwave: deep purple background (#1A0A2E), pink accent (#FF2D95), cyan secondary (#00F0FF), warm white text. Used for release reactions, hype content, and anything with a futuristic vibe.\n\nMinimal Dark: charcoal background (#1C1C1E), white text (#FFFFFF), single accent color per image. Used for clean, professional visuals — LinkedIn carousels, article headers, quote graphics.\n\nEach schema has a defined palette with specific hex values. The schemas are not arbitrary — they map to content types. Terminal for technical, synthwave for creative, minimal dark for professional. Consistency across images builds visual brand recognition.",
      },
      {
        heading: 'Template Categories',
        type: 'pattern',
        content:
          "Terminal-style: boot-sequence images for articles, system output for tips, command-line aesthetics for tool showcases. Generated with Python Pillow. Used in aios-image and x-tip-image skills.\n\nChecklist-style: step-by-step visuals with checkmarks, numbered lists, progress indicators. Generated with Pillow or designed in Canva. Used for workflow breakdowns and play summaries.\n\nStack-reveal-style: tool logos or names arranged in a visual stack or grid. Shows the technology combination used for a specific workflow. Generated with Pillow or designed in Figma. Used for building-and-sharing posts.\n\nQuote-style: single quote or insight on a clean background. Minimal design. Generated quickly in Canva or Pillow. Used for engagement-optimized posts where the text IS the visual.\n\nComparison-style: side-by-side or before/after layouts. Used for do-this-not-that content and tool comparisons. Best done in Figma for precise alignment.",
      },
      {
        heading: 'When to Use What',
        type: 'pro-tip',
        content:
          "Decision tree: Is it a recurring visual format that uses the same layout every time? Use Python Pillow — automate it. Is it a one-off creative visual where novelty matters? Use AI image generation. Is it a complex layout with multiple elements that need precise placement? Use Figma. Is it a quick visual needed in under 5 minutes? Use Canva.\n\nThe default for the content OS is Python Pillow because most content images follow recurring patterns (terminal tips, article headers, stack reveals). Automation means zero production time per image once the template script exists. Design tools fill the gaps for custom one-offs. AI image generation is the last resort — useful but unpredictable.",
      },
    ],
  },

  /* ================================================================== */
  /*  VOICE AND ANTI-SLOP                                               */
  /* ================================================================== */

  {
    id: 'voice-system',
    title: 'Building a Voice System',
    subtitle:
      '3-tier architecture for encoding your voice into a repo',
    category: 'voice',
    description:
      'How to build a voice system — 3-tier architecture (DNA, Context Playbooks, Content Ops), encoding voice into a repo, modular voice loading, and the journey from generic AI output to voice-calibrated content.',
    keywords: [
      'AI voice system',
      'content voice guide',
      'voice calibration',
      'AI writing voice',
      'content operating system voice',
    ],
    difficulty: 'advanced',
    related: [
      'ai-slop-guide',
      'anti-patterns',
      'repo-content-system',
      'content-skills',
    ],
    sections: [
      {
        heading: 'Why Voice Systems Matter',
        type: 'prose',
        content:
          "Every AI can write. Very few AI outputs sound like a specific person. The difference is a voice system — a structured set of rules, patterns, and examples that constrain AI generation to match your actual voice. Without one, every post sounds like it was written by the same generic AI. With one, the AI becomes an extension of how you actually communicate.\n\nThe problem is not that AI writes badly. It writes competently but generically. Same sentence rhythms, same transition phrases, same structural patterns. A voice system breaks that homogeneity by giving the AI specific constraints: these words yes, these words never, this sentence length, this paragraph structure, this tone.",
      },
      {
        heading: 'The 3-Tier Architecture',
        type: 'pattern',
        content:
          "Tier 1 — Voice DNA: the foundational layer. Core voice rules that apply to ALL content regardless of platform. Sentence style, word choices, anti-patterns, identity markers, formatting rules. This tier inherits into everything above it. Files: core-voice.md, anti-slop.md, viral-hooks.md.\n\nTier 2 — Context Playbooks: platform-specific adaptations of the voice DNA. How the voice changes for LinkedIn vs X vs TikTok vs Substack. Each playbook inherits from Tier 1 and adds platform-specific constraints. The voice stays consistent but the format, length, and delivery adapt.\n\nTier 3 — Content Ops: production-level rules for creating content. Pre-publish checklist, substance requirements, improvement protocol, content pillars, pitfall avoidance. This tier operationalizes the voice — turning principles into checklists and workflows.\n\nEach tier builds on the one below it. A LinkedIn post loads Tier 1 (voice DNA) + Tier 2 (LinkedIn playbook) + Tier 3 (pre-publish checklist). A TikTok script loads Tier 1 + Tier 2 (TikTok playbook) + Tier 3 (substance requirements). The voice is modular.",
      },
      {
        heading: 'Encoding Voice Into a Repo',
        type: 'pattern',
        content:
          "The voice system lives as markdown files in a git repository. This is the key architectural decision. Voice rules are not prompts you paste into ChatGPT. They are versioned documents that evolve over time, are loaded by agent skills, and can be diffed to see how your voice has changed.\n\nDirectory structure: skills/tier-1-voice-dna/ contains the foundation. skills/tier-2-context-playbooks/ contains per-platform adaptations. skills/tier-3-content-ops/ contains production rules, checklists, and pillar definitions.\n\nWhen an agent skill generates content, it reads the relevant voice files first, then generates with those constraints loaded into context. The skill does not need the voice rules hardcoded — it loads them dynamically from the repo. Change a voice rule in the markdown file, and every future content generation reflects the change immediately.",
      },
      {
        heading: 'The Journey from Generic to Calibrated',
        type: 'prose',
        content:
          "Building a voice system is iterative. You do not sit down and write the perfect voice guide on day one. You start with basic rules: lowercase first word, no em-dashes, short paragraphs. You generate content. You read the output. You catch patterns that sound wrong. You add rules to catch those patterns. You generate again. The voice guide grows from 10 lines to 100 to 500.\n\nThe anti-slop guide started as 3 rules. It now catches 14+ patterns because each piece of generated content revealed new patterns that needed catching. The LinkedIn playbook started as tone notes. It now covers emoji systems, CTA patterns, sign-off styles, and five content pillars. Each rule was earned by catching a specific failure in real content.",
      },
      {
        heading: 'Modular Voice Loading',
        type: 'code',
        content:
          "The modular loading pattern: each agent skill specifies which voice files it needs. A LinkedIn post skill loads: tier-1-voice-dna/core-voice.md + tier-1-voice-dna/anti-slop.md + tier-2-context-playbooks/linkedin.md + tier-3-content-ops/pre-publish-checklist.md. A TikTok script skill loads: tier-1-voice-dna/core-voice.md + tier-2-context-playbooks/tiktok.md. Each combination produces platform-appropriate output while maintaining voice consistency.\n\nThe loading is explicit in each SKILL.md file. The skill tells the agent: before generating, read these files. This means you can see exactly which voice rules influenced any piece of content by checking which skill generated it. Full traceability from output back to voice configuration.",
      },
    ],
  },

  {
    id: 'ai-slop-guide',
    title: 'The Complete AI Slop Avoidance Guide',
    subtitle:
      '14 critical patterns that make AI content sound generic',
    category: 'voice',
    description:
      'The complete AI slop avoidance guide — 14 critical anti-patterns including em-dashes, authority signaling, narrator setups, dramatic framing, bookend summaries, and detection checklists with before/after examples.',
    keywords: [
      'AI slop',
      'how to avoid AI slop',
      'AI generated content detection',
      'AI writing patterns',
      'AI content quality',
    ],
    difficulty: 'intermediate',
    related: [
      'voice-system',
      'anti-patterns',
      'pre-publish-checklist',
      'viral-hooks',
    ],
    sections: [
      {
        heading: 'What AI Slop Is',
        type: 'prose',
        content:
          "AI slop is the collection of writing patterns that make AI-generated content instantly recognizable as AI-generated. Not because the ideas are bad — because the delivery follows predictable patterns that no human naturally writes in. Em-dashes everywhere. Authority signaling phrases. Three parallel dramatic sentences. Bookend summaries that restate the introduction word-for-word. These patterns exist because language models learned from a training corpus full of a specific kind of polished, performative writing. The model defaults to that style unless you actively constrain it.",
      },
      {
        heading: 'Critical Patterns — Always Catch',
        type: 'pattern',
        content:
          "1. Em-dashes: delete all of them. Use periods, commas, or restructure. Natural alternatives are ellipses and arrows.\n\n2. Authority signaling phrases: the uncomfortable truth, let me be clear, here is what nobody tells you, the hard truth is, here is the reality, what most people miss. These are performance, not substance. Exception: here is how and here is the play are directional in builder voice, not performative.\n\n3. Narrator setup lines: here is the thing about, here is where it gets interesting. Delete the setup. Start with the actual point.\n\n4. Dramatic rhetorical framing: but here is the part where, and that is when it clicked, want to know the crazy part. State what happened. Let the reader feel it.\n\n5. Three parallel dramatic sentences: you cannot see it, you cannot copy-paste it away, you have to know it exists. One direct statement lands harder. Cut to one.\n\n6. The bookend summary: opening with a thesis, closing with the exact same thesis rephrased 800 words later. AI wraps content in neat bows. Real thinking goes somewhere new by the end.\n\n7. Self-branded concepts: this is what I call. Just explain it.",
      },
      {
        heading: 'Critical Patterns — Continued',
        type: 'pattern',
        content:
          "8. Artificial drama sentences: the shift sounds simple, it is not. Show why it is hard with a specific example instead of telling the reader it is hard.\n\n9. Colon-listed everything: the result: better data, the impact: faster sales. Reads like a PowerPoint slide. Write natural sentences.\n\n10. The humble brag disclaimer: I do not have all the answers, but. Share your take or do not. The disclaimer makes it worse.",
      },
      {
        heading: 'Context-Dependent Patterns',
        type: 'pattern',
        content:
          "These need judgment, not automatic deletion:\n\n11. Engagement bait endings: so here is my question for you. Generally avoid. But on meme posts, asking what is your version and drop it in the comments fits the lighter tone.\n\n12. Bullets for arguments: arguments belong in prose. But workflow steps, tool lists, and technical implementations use bullets and emoji markers naturally. The rule: bullets for execution, prose for reasoning.\n\n13. False dichotomies: it is not X, it is Y. Generally avoid. But contrasting old way vs new way — manual SDR grind vs automated Clay workflow — is showing evolution, not a false dichotomy.\n\n14. Bold headers as transitions: headers for navigation only. LinkedIn posts are whitespace-driven, not header-driven.",
      },
      {
        heading: 'Your Natural Patterns (Not Slop)',
        type: 'pro-tip',
        content:
          "These look like AI tells but are actually authentic voice patterns. Do not flag them:\n\nEllipses for trailing thoughts: true story, it feels prehistoric. Arrows for workflow steps and progression. Emoji section markers (checkmarks, wrenches, links, brains, puzzle pieces) for structuring workflow walkthroughs. Here is how and here is the play as directional openers into workflow breakdowns. Pop culture references mixed into technical content. No gatekeeping as a value statement with resource delivery in comments.\n\nThe distinction: AI patterns are formulaic and repetitive across all content. Your natural patterns are contextual — they appear in specific content types where they serve a function. Ellipses show up in reflective posts, not in technical breakdowns. Emoji markers show up in plays, not in essays. Context determines whether a pattern is authentic or slop.",
      },
      {
        heading: 'Detection Checklist',
        type: 'formula',
        content:
          "Before publishing any AI-assisted content, run this scan: (1) Search for em-dashes — delete all. (2) Search for here is the thing, here is where, let me be clear, the uncomfortable truth — delete all. (3) Check the opening and closing — if they say the same thing, rewrite the closing. (4) Count parallel sentence structures — if you find three in a row with the same rhythm, cut to one. (5) Check for colon-listed statements — rewrite as natural sentences. (6) Read it out loud — if it sounds like a keynote speech, it is slop. If it sounds like you explaining something to a friend, it is voice.\n\nThis takes 3 minutes per post. Those 3 minutes are the difference between content that sounds like everyone else's AI output and content that sounds like you.",
      },
    ],
  },

  {
    id: 'viral-hooks',
    title: 'Viral Hooks and Scroll-Stopping Openers',
    subtitle:
      'Hook categories, platform-specific hooks, and first-line formulas',
    category: 'voice',
    description:
      'Viral hooks and scroll-stopping openers — hook categories (curiosity, contrarian, data bomb, story, problem-first, direct challenge), platform-specific adaptation, and first-line formulas that stop the scroll.',
    keywords: [
      'viral hooks LinkedIn',
      'scroll stopping hooks',
      'content hooks',
      'LinkedIn first line',
      'social media hooks 2026',
    ],
    difficulty: 'beginner',
    related: [
      'ai-slop-guide',
      'linkedin-playbook',
      'x-best-practices',
      'tiktok-playbook',
    ],
    sections: [
      {
        heading: 'Why Hooks Matter More Than Content',
        type: 'prose',
        content:
          "On every social platform, the first 1-3 lines determine whether anyone reads the rest. LinkedIn shows 2 lines before the see more fold. X shows the first tweet in a timeline of hundreds. TikTok gives you 1-2 seconds before the thumb scrolls. The hook is not the introduction to your content — it IS the content for 90% of people who see it. If the hook fails, the rest does not exist.\n\nThis is not about clickbait. Clickbait promises and underdelivers. A good hook promises and the content delivers. The hook earns the attention. The content rewards it. Both are required.",
      },
      {
        heading: 'Six Hook Categories',
        type: 'pattern',
        content:
          "Curiosity Pings: open a loop the reader needs closed. You are not supposed to know this, but here is the trick top founders use. The loop creates tension that only reading further resolves.\n\nContrarian POVs: challenge conventional wisdom. I ignored everyone is advice and that is why it worked. Contrarian hooks work because they create cognitive dissonance — the reader needs to understand how the opposite of what they believe can be true.\n\nData Bombs: lead with a specific, surprising number. 91% of posts fail. Here is what the top 9% are doing differently. Numbers create credibility and specificity in a feed full of vague claims.\n\nStory Openers: start in the middle of a moment. Three years ago I almost quit. Then something unexpected happened. Story hooks work because humans are wired for narrative. We cannot stop mid-story.\n\nProblem-First: name the pain directly. Your content is not boring. It is just missing this one thing. Problem-first hooks work because the reader self-identifies with the pain and needs to know the solution.\n\nDirect Challenge: provoke the reader's identity. If you cannot explain your product in 10 words, you do not understand it. Challenge hooks work because they trigger a need to prove or disprove the claim.",
      },
      {
        heading: 'Platform-Specific Hook Adaptation',
        type: 'pattern',
        content:
          "LinkedIn: lean into professional stakes, career journeys, insights with emotional or intellectual weight. Hooks can be slightly longer — you have 2 lines before the fold. Example: the first time I fired someone I cried in the bathroom.\n\nX: fast hooks, punchy facts, meme-ability, concise. Must work in the first 10 words. Example: this founder built 3 products before he ever launched one.\n\nTikTok and Reels and Shorts: on-screen text IS the hook. 8 words or fewer. Must work without sound. Result-first hooks drive replay value — show the outcome, then how. Example on-screen text: you are using Claude wrong, here is why. Example result-first: 30 minutes of work, 3 seconds.\n\nThe same insight can be hooked differently for each platform. A LinkedIn hook can be reflective and emotional. The X version of the same hook is compressed and punchy. The TikTok version is visual and immediate. Same core idea, different delivery optimized for the platform is attention pattern.",
      },
      {
        heading: 'First-Line Formulas',
        type: 'formula',
        content:
          "Pain plus solution signal: your outbound stack is a spreadsheet, mine is a git repo. Names the pain (spreadsheet ops) and signals the solution (repo-based) in one line.\n\nContrast plus curiosity: cold email is dead on arrival if you are only checking google and microsoft. States a contrarian position and implies hidden knowledge.\n\nAction plus result: built two operating systems this weekend, inside a code editor. Shows what was done and creates curiosity about how.\n\nIdentity plus challenge: the cursor era has begun, at least for me. Makes a bold identity claim and invites the reader to decide if they agree.\n\nFailure plus intrigue: I almost nuked an entire enterprise list by accident. Vulnerability plus stakes equals attention.\n\nAlways lowercase first word unless proper noun or first-person I. The lowercase start is a voice signature that also visually breaks from the capitalized-headline pattern that most LinkedIn posts use.",
      },
      {
        heading: 'Anti-Pattern: The Setup Hook',
        type: 'anti-pattern',
        content:
          "The worst hook pattern is the setup: I wanted to share something interesting that happened today. This is not a hook. It is throat-clearing. The reader learns nothing from this line. They do not know what the content is about, why they should care, or what they will get from reading further.\n\nOther failing patterns: so I have been thinking about, let me tell you about, I have always believed that. These are preambles. They delay the actual hook by a sentence or more. By the time you get to the interesting part, the reader has scrolled past.\n\nThe fix: delete the first sentence. Start with the second one. In almost every draft, the real hook is hiding in sentence two or three. The first sentence is warm-up the writer needed but the reader does not.",
      },
    ],
  },

  {
    id: 'call-to-actions',
    title: 'CTAs That Actually Convert',
    subtitle:
      'CTA placement, soft vs hard, and platform-specific patterns',
    category: 'voice',
    description:
      'CTAs that actually convert — CTA placement strategy, soft vs hard CTAs, platform-specific CTA patterns for LinkedIn, X, Substack, and TikTok, and the value-delivery CTA framework.',
    keywords: [
      'call to action examples',
      'LinkedIn CTA',
      'content CTA strategy',
      'social media CTA',
      'CTA best practices',
    ],
    difficulty: 'beginner',
    related: [
      'linkedin-playbook',
      'x-best-practices',
      'substack-growth',
      'commenting-strategy',
    ],
    sections: [
      {
        heading: 'The CTA Philosophy',
        type: 'prose',
        content:
          "Most CTAs fail because they ask before giving. Follow me for more tips. Like if you agree. Subscribe for updates. These ask the reader to do something for the creator with no clear value exchange. The alternative: value-delivery CTAs. Instead of asking for engagement, deliver value and let the engagement follow naturally.\n\nThe framework: give the reader something genuinely useful (a prompt, a formula, a template, a resource), then tell them where to get it. The CTA is not asking for a favor — it is directing them to more value. The engagement (comments, follows, shares) happens as a side effect of the value delivery.",
      },
      {
        heading: 'Three CTA Types',
        type: 'pattern',
        content:
          "Value Delivery CTAs (primary): prompt is in the comments, formula plus HTTP API setup in the comments, do not sleep on the comments the prompt and scoring guide is there, documented the full process and the full doc is in the comments. These work because the reader gets something tangible. The comment section becomes a resource, not a discussion.\n\nCo-Building CTAs (for narrative posts): DM me if you are building something similar, if you are building with Cursor and figuring it out too DM me, follow along if you want to see how it plays out. These work on building-and-sharing posts because they create peer connection, not follower hierarchy.\n\nEngagement CTAs (meme posts only): what is your version drop it in the comments, what is the coldest cold email practice you have seen still running in 2026. These work on lightweight content because they invite shared experience. Never use these on educational or tactical posts — they cheapen the substance.",
      },
      {
        heading: 'Platform-Specific CTA Patterns',
        type: 'pattern',
        content:
          "LinkedIn: value goes in the comments. The post hooks, the comments deliver. This drives comment activity (which the algorithm rewards) and creates a reason for readers to engage rather than just consume.\n\nX: resource delivery in the reply thread. Full prompt in the reply. Linked the breakdown in the reply. No gatekeeping, file is in the thread. X rewards reply threads, and resource delivery in replies drives bookmarks.\n\nSubstack: growth CTAs serve the subscriber relationship. If this hit, share it with someone building their own system. The full skill file is on GitHub, link below. Reply to this email and tell me what you would build first. Substack CTAs build the newsletter relationship, not drive vanity metrics.\n\nTikTok: save this, try it in Claude, part 2 question mark, follow for more of these. TikTok CTAs are brief because the video format does not support long text CTAs. The loop closer IS the CTA.",
      },
      {
        heading: 'CTA Placement Strategy',
        type: 'pro-tip',
        content:
          "Where you place the CTA matters as much as what it says. On LinkedIn: the CTA goes at the end, after the substance. Never before. The reader needs to receive value before they are willing to act. A CTA in the middle of a post interrupts the flow and signals that the content is a vehicle for the CTA rather than the CTA being a natural extension of the content.\n\nException: for plays-series posts, a soft CTA can appear mid-post as a teaser — keep reading, the prompt is below — which functions as a hook to keep them scrolling, not an ask.\n\nOn X: CTA is the last tweet in a thread or a reply to the main tweet. On Substack: CTA is at the very end, after the sign-off if it is a share-ask, or inline if it is a resource link. On TikTok: CTA is the last 2 seconds of the video, visual or verbal.",
      },
      {
        heading: 'Anti-Pattern: Begging for Engagement',
        type: 'anti-pattern',
        content:
          "The fastest way to lose credibility is begging for engagement. What do you think, comment below. Agree, hit that like button. Follow me for more tips. Thoughts question mark. These are engagement bait patterns that sophisticated social media users see through immediately. They signal that the creator cares more about metrics than about the reader.\n\nThe inversion: if your content is genuinely valuable, engagement happens without asking. People comment because they have something to add, not because you asked them to. People follow because they want more, not because you told them to. People share because the content made them look smart or helpful, not because you asked for a favor. Remove every generic engagement ask from your content. Replace it with value delivery. The metrics follow.",
      },
    ],
  },

  {
    id: 'commenting-strategy',
    title: 'Commenting Style and Engagement',
    subtitle:
      'Value pin comments, bucket system, and authentic replies',
    category: 'voice',
    description:
      'Commenting style and engagement strategy — value pin comments, 6 comment bucket system (technical depth, encouragement, pattern recognition, observational, stack reveal, contrarian), and authentic reply patterns.',
    keywords: [
      'LinkedIn commenting strategy',
      'engagement strategy',
      'value pin comments',
      'LinkedIn comments',
      'social media engagement',
    ],
    difficulty: 'intermediate',
    related: [
      'linkedin-playbook',
      'call-to-actions',
      'viral-hooks',
      'content-pillars',
    ],
    sections: [
      {
        heading: 'Comments as Content',
        type: 'prose',
        content:
          "Comments are not afterthoughts — they are a content channel. On LinkedIn, your comments appear in other people's feeds. A thoughtful comment on a high-visibility post can get more impressions than your own posts. On your own posts, the comment section is where you deliver resources, add depth, and continue the conversation.\n\nThis means commenting deserves the same voice calibration as posting. A great comment adds value, shows expertise, and feels like it came from a real person — not a bot farm running through a list of influencer posts dropping fire emoji.",
      },
      {
        heading: 'The Six Comment Buckets',
        type: 'pattern',
        content:
          "Technical Depth: add specific technical context that the post did not cover. If someone posts about Clay enrichment, comment with a specific column formula or API endpoint you have used. This establishes credibility through specifics, not claims.\n\nEncouragement: genuine recognition of good work. Not great post but I built something similar last month and the hardest part was X, which you nailed. Encouragement that adds context is value. Encouragement without context is noise.\n\nPattern Recognition: connect the post to a broader pattern you have observed. This is the same dynamic I see in how teams adopt Cursor — it starts with one person and spreads when the output quality becomes undeniable. This adds perspective and shows systems thinking.\n\nObservational: notice something in the post that most readers miss. The subtle part here is that the scoring model runs after the enrichment, not during. Most people would put them in the same column. This shows you read deeply and think carefully.\n\nStack Reveal: share the specific tools, configurations, or setups that relate to the post. We run a similar flow but with LeadMagic instead of Apollo for European coverage and the hit rate difference is significant. This is useful information wrapped in engagement.\n\nContrarian: respectfully challenge an assumption in the post. I have found the opposite — smaller batches actually cost more per contact when you factor in the fixed overhead of table setup. Not disagreeing for attention, but adding a real counterpoint with evidence.",
      },
      {
        heading: 'Value Pin Comments',
        type: 'pattern',
        content:
          "A value pin comment is the first comment on your own post, pinned to the top, that delivers the resource promised in the post. If your post says prompt is in the comments, the pinned comment IS the prompt. Full text. No gatekeeping.\n\nStructure: start with the resource itself (prompt, formula, code, link). Then add 2-3 lines of context about how to use it or adapt it. The pinned comment should be standalone-valuable — someone who reads only the comment and not the post should still get something useful.\n\nThe pinned comment also functions as an engagement anchor. People reply to the pinned comment with their own adaptations, questions, and results. This creates a comment thread that the LinkedIn algorithm reads as high engagement, pushing the post to more feeds.",
      },
      {
        heading: 'Replying to Commenters',
        type: 'pro-tip',
        content:
          "Reply to every comment in the first 2 hours. This is not about being polite — it is about the algorithm. LinkedIn's distribution engine weights early comment activity heavily. A post with 20 comments in the first hour gets more distribution than a post with 20 comments over 3 days.\n\nBut the replies need substance. One-line value adds, not generic thanks. If someone shares their experience, build on it with a specific follow-up. If someone asks a question, answer it thoroughly. If someone disagrees, engage the substance of their point.\n\nNever use: thanks for sharing, great point, totally agree. These are zero-value replies that signal you are replying for the engagement metric, not the conversation. A silent like on their comment is better than a meaningless reply.",
      },
      {
        heading: 'Anti-Pattern: Spray and Pray Commenting',
        type: 'anti-pattern',
        content:
          "The spray-and-pray strategy — commenting on 50 posts per day with generic responses — is visible and damaging. People notice when the same account drops love this or great insight on every post in their feed. It reads as automated, even if it is manual.\n\nThe alternative: comment on 5-10 posts per day with genuine substance. Pick posts where you have actual expertise to add. Write 2-3 sentences minimum. Reference specific details from the post. Add information the reader would not have gotten from the post alone.\n\nFive substantive comments per day build more credibility than fifty generic ones. The people whose posts you comment on notice quality. They engage back. They become part of your network. That is how commenting drives growth — through relationship, not volume.",
      },
    ],
  },

  {
    id: 'anti-patterns',
    title: 'Content Anti-Patterns',
    subtitle:
      'Purple gradient posts, thought leader traps, and over-polish',
    category: 'voice',
    description:
      'Content anti-patterns to avoid — purple gradient posts, thought leader traps, over-polish, generic advice, template-driven content, and how to recognize and fix each pattern.',
    keywords: [
      'content anti-patterns',
      'LinkedIn cringe',
      'content mistakes',
      'social media pitfalls',
      'content quality',
    ],
    difficulty: 'beginner',
    related: [
      'ai-slop-guide',
      'voice-system',
      'pre-publish-checklist',
      'viral-hooks',
    ],
    sections: [
      {
        heading: 'The Thought Leader Trap',
        type: 'anti-pattern',
        content:
          "Performing wisdom instead of sharing lessons. Abstract principles without concrete examples. Three perfect parallel examples that illustrate the point with suspicious symmetry. Branding concepts instead of explaining them — this is what I call the velocity framework.\n\nThe fix: replace every abstract principle with a specific story. Instead of leaders need to communicate clearly, try last tuesday I told my team we were pivoting the campaign targeting and three people had completely different interpretations of what that meant. Specifics are interesting. Abstractions are forgettable.",
      },
      {
        heading: 'The Generic Advice Trap',
        type: 'anti-pattern',
        content:
          "Use data to make better decisions. Focus on your ICP. Optimize your CRM. These are worthless without specifics. Everyone knows they should use data. Nobody knows which data field in which tool to look at for which decision.\n\nThe fix: always add how, why, and what exactly. Instead of optimize your CRM, try add a custom property in HubSpot called source_campaign that tracks which Clay table pushed the contact and filter your pipeline reports by it to see which enrichment flows actually convert. That is useful. The generic version is wallpaper.",
      },
      {
        heading: 'The Over-Polish Trap',
        type: 'anti-pattern',
        content:
          "Spending 4 hours on a post that should take 30 minutes. Optimizing language instead of adding substance. Making it perfect instead of shipping it. The over-polish trap is insidious because it feels productive — you are improving the content. But past a certain point, you are improving the words while the ideas stay the same.\n\nThe rule of thumb: if you have edited a post more than 3 times without adding new information, you are polishing, not improving. Ship it. The feedback from publishing teaches you more than another round of editing. A good post published today beats a perfect post published never.",
      },
      {
        heading: 'The Too-Technical Trap',
        type: 'anti-pattern',
        content:
          "Using jargon without context. Assuming everyone knows Clay, HubSpot, or MCP servers deeply. Skipping the why this matters framing. Technical content without accessibility is just notes for yourself.\n\nThe balance: be specific enough to be useful, accessible enough to be interesting. A LinkedIn post about Clay should make sense to someone who has never used Clay but understands the problem Clay solves. Name the tool. Explain what it does in one sentence. Then go deep. The one-sentence context frame takes 5 seconds to write and makes your content accessible to 10x more people.",
      },
      {
        heading: 'Purple Gradient Posts',
        type: 'anti-pattern',
        content:
          "The purple gradient template post is the visual equivalent of AI slop. Inspirational quote on a gradient background. Leadership wisdom in a carousel with smooth transitions. These perform well in vanity metrics (likes, impressions) but build zero credibility and zero relationship with the reader.\n\nWhy they fail for builders: the audience you want — technical operators, GTM engineers, startup founders — sees through template content instantly. A purple gradient carousel about the 5 principles of effective leadership tells them nothing about your actual expertise. A raw screenshot of your terminal with a one-paragraph explanation of what you just built tells them everything.\n\nThe rule: if a post could have been written by literally anyone, it should not have your name on it. Your content should be impossible to attribute to someone else because it contains your specific tools, your specific workflow, and your specific results.",
      },
      {
        heading: 'What X Taught Me Templates',
        type: 'anti-pattern',
        content:
          "What my failed startup taught me about leadership. What running taught me about business. What my dog taught me about patience. This template has been so overused that it triggers an immediate scroll-past from experienced LinkedIn users. The analogy structure (thing from life = lesson for business) is the laziest form of content because it lets you avoid saying anything specific.\n\nIf you actually learned something from a failure, share the failure with specifics. What went wrong, what the numbers looked like, what you changed. The lesson emerges from the details. You do not need to frame it as what X taught me — the teaching is implicit when the story is good enough.",
      },
    ],
  },

  /* ================================================================== */
  /*  CONTENT WORKFLOWS                                                 */
  /* ================================================================== */

  {
    id: 'recursive-content-flow',
    title: 'Recursive Content Flow',
    subtitle:
      'How one piece of content becomes 5+ across platforms',
    category: 'workflows',
    description:
      'Recursive content flow — how one piece of content becomes 5+ pieces across LinkedIn, X, Substack, TikTok, and Reddit. The full recursive loop with examples and timing.',
    keywords: [
      'content repurposing',
      'recursive content',
      'content multiplication',
      'cross platform content',
      'content repurposing strategy',
    ],
    difficulty: 'intermediate',
    related: [
      'content-pillars',
      'linkedin-playbook',
      'x-best-practices',
      'substack-growth',
    ],
    sections: [
      {
        heading: 'The Core Loop',
        type: 'prose',
        content:
          "One piece of content is never just one piece. A single LinkedIn post contains the seed for an X thread, a Substack deep dive, a TikTok demo, and a Reddit discussion. The recursive content flow is the system for extracting all of those from a single creation effort.\n\nThe key insight: you are not creating 5 pieces of content from scratch. You are creating 1 piece and adapting it 4 times. The adaptation is faster than creation because the idea, the structure, and the substance already exist. You are just changing the format and the platform constraints.",
      },
      {
        heading: 'The Expansion Pattern',
        type: 'pattern',
        content:
          "Start with the long-form version — usually a LinkedIn post or a Substack article. This is where you develop the full idea with all the context, examples, and nuance. This is the source of truth.\n\nFrom LinkedIn to X: compress the core insight into a single tweet or a 4-6 tweet thread. Each tweet stands alone. The thread is the cliff notes version of the LinkedIn post. Schedule 1-2 days after LinkedIn.\n\nFrom LinkedIn to Substack: expand the insight into a 500-800 word deep dive. Add screenshots, code snippets, and extended examples that LinkedIn's format cannot support. Schedule 3-5 days after LinkedIn.\n\nFrom LinkedIn to TikTok: extract the single most visual moment — the screenshot, the demo, the before-and-after. Build a 16-second video around it. This is the most compressed version.\n\nFrom LinkedIn to Reddit: rewrite as a how-I-did-it breakdown with specific numbers and results. Reddit-native framing, no self-promotion. The Reddit version gives the most technical detail because Reddit audiences demand specifics.",
      },
      {
        heading: 'Timing and Sequencing',
        type: 'pattern',
        content:
          "Day 1: LinkedIn post (the source). Day 1-2: X tweet or thread (compressed). Day 3-5: Substack expansion (deep dive). Day 3-7: TikTok video (visual extraction). Day 5-7: Reddit post (technical breakdown).\n\nThe stagger matters. Posting the same idea across all platforms on the same day looks automated and cannibalistic — your followers who are on multiple platforms see the same content everywhere. Staggering by days means each platform gets the content at a natural pace. The LinkedIn audience has moved on by the time the Substack version drops, so it feels fresh rather than repetitive.\n\nException: X can go same-day as LinkedIn because the formats are different enough and the audiences overlap less than you think.",
      },
      {
        heading: 'The Feedback Loop',
        type: 'pro-tip',
        content:
          "The recursive flow is not one-directional. Comments and responses on each platform feed back into future content. A question in the LinkedIn comments becomes a dedicated follow-up post. A debate in the Reddit thread becomes a contrarian take on Substack. A TikTok comment asking how did you do that becomes the next LinkedIn play.\n\nTrack the feedback: which platforms generate the most questions. Which angles get the most engagement. Which specific details people ask to see expanded. This feedback data tells you what to write next and which format to lead with for the next cycle.\n\nThe best content systems are not linear (create then distribute). They are circular (create, distribute, collect feedback, create again). Each cycle produces better content because the audience is telling you what they want to see more of.",
      },
    ],
  },

  {
    id: 'repo-content-system',
    title: 'Building a Content Repo',
    subtitle:
      'Git-based content OS with version control and automation',
    category: 'workflows',
    description:
      'Building a content repo — git-based content operating system, directory structure, draft and final workflow, version control for content, and skill-based automation from inside a code editor.',
    keywords: [
      'content operating system',
      'content repo',
      'git content management',
      'content version control',
      'developer content workflow',
    ],
    difficulty: 'advanced',
    related: [
      'content-skills',
      'voice-system',
      'content-mcps',
      'recursive-content-flow',
    ],
    sections: [
      {
        heading: 'Why a Git Repo for Content',
        type: 'prose',
        content:
          "Most content creators use Google Docs, Notion, or platform-native editors. These work. They do not scale. A git repository gives you version control (every draft, every edit, every published version is tracked), automation (scripts and agent skills can generate, format, and publish content), modularity (voice rules, platform playbooks, and content ops are separate files that compose), and portability (your entire content system moves with a single git clone).\n\nThe shift is from content as documents to content as code. Documents are static files you edit manually. Code is a system with inputs, processing, and outputs. A content repo means your voice guide is loaded at generation time, your formatting rules are applied automatically, and your publishing pipeline is a skill invocation rather than a copy-paste workflow.",
      },
      {
        heading: 'Directory Structure',
        type: 'code',
        content:
          "The content repo has a specific architecture: content/ is the content itself, organized by platform and status (drafts/, final/, substack/, tiktok/). skills/ is the voice and automation system (tier-1-voice-dna/, tier-2-context-playbooks/, tier-3-content-ops/). .cursor/skills/ contains the agent skills that automate content creation (final-copy, play-draft, skill-play, tiktok-script, substack-post, etc.). workflows/ tracks content pipelines, series indexes, and scheduling. data/ stores progression tracking, stats, and generated assets.\n\nEach directory has a specific purpose. Content and skills are separated because skills are the system and content is the output. The system generates and processes the output. Mixing them creates confusion about what is a rule and what is a deliverable.",
      },
      {
        heading: 'The Draft-to-Final Workflow',
        type: 'pattern',
        content:
          "Every piece of content follows the same lifecycle: (1) Capture — an idea gets recorded, either manually in a draft file or via the idea-bank skill. (2) Draft — the content is written as a markdown file in content/drafts/ with a date-prefixed filename. (3) Voice normalization — the final-copy or final-substack skill reads the draft, applies voice rules, strips AI slop, and produces platform-ready text. (4) Review — you read the normalized version, make final edits. (5) Publish — Typefully MCP or Substack MCP pushes the content to the platform. (6) Archive — the draft moves to content/final/ with publication metadata.\n\nThis workflow is the same regardless of platform. LinkedIn, X, Substack, TikTok scripts — they all follow capture, draft, normalize, review, publish, archive. The skills handle the platform-specific formatting.",
      },
      {
        heading: 'Version Control for Content',
        type: 'pro-tip',
        content:
          "Git diff on a content file shows you exactly what changed between drafts. This is powerful for voice calibration — you can see which phrases the AI suggested, which ones you edited, and which patterns keep appearing across posts.\n\nCommit messages on content files follow the same convention as code: add for new drafts, update for edits, finalize for publication-ready versions. The git log for a content file tells the story of how that piece evolved from first idea to published post.\n\nBranching is useful for experimental content. Want to try a different hook on the same post? Branch it. Write both versions. Merge the one that feels right. The other version is preserved in git history as a reference for future hook decisions.",
      },
      {
        heading: 'Scaling the System',
        type: 'pattern',
        content:
          "The repo-based content system scales in three dimensions: (1) More platforms — add a new playbook to tier-2, a new skill for publishing, and the same workflow extends to a new platform. (2) More content types — add a new pillar definition to tier-3, a new series to the workflow index, and the system tracks it alongside everything else. (3) More automation — each manual step in the workflow is a candidate for a new skill. If you find yourself doing the same formatting task repeatedly, write a skill for it.\n\nThe system also scales for teams. Multiple contributors can work on content in the same repo with standard git collaboration — branches, pull requests, reviews. The voice system ensures consistency regardless of who is writing because the rules are codified, not tribal knowledge.",
      },
    ],
  },

  {
    id: 'content-skills',
    title: 'Agent Skills for Content Automation',
    subtitle:
      'How skills automate the content creation pipeline',
    category: 'workflows',
    description:
      'Agent skills for content automation — how skills like final-copy, play-draft, skill-play, and tiktok-script automate the creation pipeline, writing your own content skills, and the skill architecture.',
    keywords: [
      'AI content automation',
      'Cursor agent skills',
      'content automation',
      'AI writing automation',
      'content pipeline automation',
    ],
    difficulty: 'advanced',
    related: [
      'repo-content-system',
      'content-mcps',
      'voice-system',
      'recursive-content-flow',
    ],
    sections: [
      {
        heading: 'What Content Skills Do',
        type: 'prose',
        content:
          "Agent skills are structured instructions that tell the AI agent in your code editor how to perform a specific task. For content, this means: generate a LinkedIn post from a screenshot, convert a draft to platform-ready text, create a TikTok script from a topic, generate terminal-style images, and push to publishing platforms. Each skill encapsulates the full workflow for one content type — inputs, voice loading, generation rules, output format, and publishing steps.\n\nThe power: instead of prompting an AI with write me a LinkedIn post and hoping for the best, you invoke a skill that loads the right voice files, follows the right format structure, applies the right anti-slop rules, and outputs exactly what you need. Consistency through codified process, not repeated prompting.",
      },
      {
        heading: 'Key Content Skills',
        type: 'pattern',
        content:
          "final-copy: takes a markdown draft and converts it to platform-ready plain text. Runs voice normalization, strips AI slop, applies formatting rules. The last step before publishing.\n\nplay-draft: turns a screenshot of something you built into LinkedIn and X content drafts. Analyzes the screenshot, identifies the play or accomplishment, generates drafts in the voice system's style.\n\nskill-play: converts a Cursor skill you use into LinkedIn and X content for the skills I use everyday series. Reads the skill file, extracts the key workflow, generates drafts that explain it.\n\ntiktok-script: generates a 16-second TikTok script from a topic or one-sentence description. Follows the hook-demo-result-loop structure from the TikTok playbook.\n\nsubstack-post: drafts Substack newsletter posts with context-aware post numbering and structure selection.\n\nfinal-substack: finalizes a Substack draft and pushes it to Substack via MCP. Runs voice normalization, saves locally, creates the draft on the platform.\n\naios-image and x-tip-image: generate Python Pillow terminal-style images for articles and X tip posts respectively.",
      },
      {
        heading: 'Skill Architecture',
        type: 'code',
        content:
          "Every content skill follows the same architecture. A SKILL.md file in .cursor/skills/ contains: metadata (name, description, trigger phrases), context loading instructions (which voice files to read first), input requirements (what the skill needs from the user), generation rules (step-by-step instructions for the agent), output format (where to save, what format, file naming conventions), and optional publishing steps (MCP calls, scheduling).\n\nThe skill file is essentially a detailed recipe. The AI agent reads it and executes each step. Because the recipe is explicit, the output is consistent. Because the recipe lives in the repo, it is versioned and improvable. When you notice a skill producing suboptimal output, you edit the SKILL.md — not your prompting strategy — and every future invocation reflects the improvement.",
      },
      {
        heading: 'Writing Your Own Content Skill',
        type: 'pattern',
        content:
          "To create a new content skill: (1) Identify a repeating content workflow that follows the same pattern every time. (2) Document the inputs — what does the skill need from you (a topic, a screenshot, a draft file, a partner name). (3) List the voice files to load — which tier-1, tier-2, and tier-3 files are relevant. (4) Write the generation instructions step by step — be explicit about format, length, structure, and style. (5) Define the output — where does the file get saved, what is the filename convention, what format. (6) Add optional automation — MCP calls for publishing, image generation for visuals.\n\nThe test for whether something should be a skill: if you have done it manually more than 3 times and the process was the same each time, it should be a skill. The upfront cost of writing the SKILL.md is 30-60 minutes. The ongoing savings are 15-30 minutes per content piece, forever.",
      },
      {
        heading: 'The Compound Effect',
        type: 'pro-tip',
        content:
          "Each new skill reduces the time between idea and published content. The first skill saves 15 minutes per post. The tenth skill means your entire pipeline — from idea capture to multi-platform publishing — runs in minutes instead of hours. The compound effect is not just time savings. It is consistency. Every post goes through the same voice normalization, the same anti-slop scan, the same format checks. The quality floor rises because the process catches errors that manual workflows miss.\n\nAfter 20+ content skills, the content operating system effectively runs itself. You provide the idea and the approval. The system handles everything in between.",
      },
    ],
  },

  {
    id: 'content-pillars',
    title: 'Content Pillars Framework',
    subtitle:
      '5-pillar system for organizing and tracking content',
    category: 'workflows',
    description:
      'Content pillars framework — the 5-pillar system (Plays, Building/Sharing, Memes, Release Reactions, Skill System Shares), how to develop and track pillars, and balancing pillar distribution.',
    keywords: [
      'content pillars',
      'content strategy framework',
      'content categories',
      'content planning',
      'social media content pillars',
    ],
    difficulty: 'beginner',
    related: [
      'linkedin-playbook',
      'recursive-content-flow',
      'content-skills',
      'repo-content-system',
    ],
    sections: [
      {
        heading: 'What Content Pillars Are',
        type: 'prose',
        content:
          "Content pillars are the 3-5 recurring themes that all your content maps to. They are not rigid categories — they are gravitational centers. Every post should clearly belong to one pillar or intentionally bridge two. Without pillars, content becomes random. With pillars, your audience knows what to expect and your creation process has structure.\n\nPillars solve two problems: for the creator, they eliminate the what should I post about question because every idea maps to a pillar. For the audience, they create predictability — people follow you because they want more of a specific type of content, and pillars ensure they get it.",
      },
      {
        heading: 'The Five Pillars',
        type: 'pattern',
        content:
          "Pillar 1 — Plays Series: step-by-step workflow walkthroughs showing how you use specific tools to solve specific problems. This is the highest-performing pillar because it delivers immediate, actionable value. Format: pain point hook, numbered steps with emoji markers, resource delivery in comments.\n\nPillar 2 — Building and Sharing: personal narrative about what you are building, what broke, what you learned. More storytelling, less structure. This pillar builds relationship and trust through vulnerability and authenticity.\n\nPillar 3 — GTM Memes: humor-based content that makes technical concepts relatable. Short text plus meme or GIF. Pop culture references with real lessons underneath. This pillar drives the widest reach because humor is shareable.\n\nPillar 4 — Release Reactions: first-hand takes on new tool releases, platform updates, and industry changes. Tested against real work, not theoretical analysis. This pillar positions you as someone who builds with tools, not just writes about them.\n\nPillar 5 — Skill and System Shares: sharing your actual frameworks, skill files, and automation systems. What you built, how it works, where to get it. This pillar attracts the most technical audience and drives the deepest engagement.",
      },
      {
        heading: 'Pillar Distribution',
        type: 'pattern',
        content:
          "Not every pillar should get equal posting frequency. The distribution follows performance and audience expectations: Plays Series at 30-40% of posts (highest ROI, most engagement). Building and Sharing at 20-25% (relationship building). GTM Memes at 15-20% (reach expansion). Release Reactions at 10-15% (relevance, only when new releases happen). Skill System Shares at 10-15% (deep engagement, niche audience).\n\nTrack actual distribution in your daily tracker or content pipeline. If you notice you have posted 5 plays in a row, the next post should be from a different pillar. Variety prevents audience fatigue and ensures you are building different aspects of your brand — not just the tactical side.",
      },
      {
        heading: 'Developing New Pillars',
        type: 'pro-tip',
        content:
          "Pillars are not permanent. They evolve as your audience and expertise evolve. The signal that a new pillar is emerging: you keep creating content about a topic that does not fit cleanly into any existing pillar. If this happens 3+ times, it is a pillar candidate.\n\nTo validate a new pillar: post 5-10 pieces of content in the potential pillar. Measure performance against your existing pillar averages. If the new content performs at or above average, the pillar is validated. If it consistently underperforms, the topic might be better served as a subcategory within an existing pillar rather than its own.\n\nWhen adding a new pillar, consider retiring one. Five pillars is the sweet spot for most creators. Six or seven starts to dilute focus and makes distribution planning complicated. If a pillar consistently underperforms or no longer aligns with your goals, archive it and promote the new one.",
      },
      {
        heading: 'Anti-Pattern: Pillar Drift',
        type: 'anti-pattern',
        content:
          "Pillar drift happens when your content slowly moves away from your defined pillars without you noticing. You start posting about topics that are adjacent to your pillars but not quite in them. Over time, your content becomes diffuse and your audience does not know what to expect.\n\nThe fix: every piece of content should be tagged with its pillar. If a post does not clearly belong to a pillar, either reshape it until it does or save it for a different context. The pillar framework is a constraint, and constraints produce better content than freedom does. A post that does not fit your pillars is either the start of a new pillar (see above) or a distraction from the system that is working.",
      },
    ],
  },

  {
    id: 'pre-publish-checklist',
    title: 'Pre-Publish Quality Checklist',
    subtitle:
      'Structure check, substance check, safety check, voice check',
    category: 'workflows',
    description:
      'Pre-publish quality checklist — structure and style check, substance verification, safety review, voice calibration, and anti-slop scan. The final gate before any content goes live.',
    keywords: [
      'content quality checklist',
      'pre-publish checklist',
      'content review process',
      'content quality control',
      'social media quality check',
    ],
    difficulty: 'beginner',
    related: [
      'ai-slop-guide',
      'voice-system',
      'anti-patterns',
      'content-skills',
    ],
    sections: [
      {
        heading: 'Why a Checklist Matters',
        type: 'prose',
        content:
          "The difference between amateur content and professional content is not talent — it is process. A pre-publish checklist catches errors that your eyes skip after writing and editing the same piece for 30 minutes. It catches voice drift that creeps in during revision. It catches substance gaps that feel filled when you are deep in the topic but read as empty to someone seeing it for the first time.\n\nThe checklist takes 3 minutes. Those 3 minutes prevent publishing something that sounds like everyone else's AI output, contains an accidental company reference, or reads as thought leadership fluff instead of builder substance.",
      },
      {
        heading: 'Structure and Style Check',
        type: 'formula',
        content:
          "Run these checks on every post before publishing: (1) Lowercase first line — the first word should be lowercase unless it is a proper noun or I. This is a voice signature. (2) 1-2 sentence paragraphs maximum — no walls of text. Mobile readers need whitespace. (3) No em-dashes — delete all of them. Use periods, commas, or ellipses. (4) No authority signaling phrases — search for let me be clear, the uncomfortable truth, here is what nobody tells you. Delete them. (5) Natural rhythm — read the post out loud. If it sounds like a keynote speech, it is over-polished. If it sounds like you explaining something to a friend, it is right.",
      },
      {
        heading: 'Substance Check',
        type: 'formula',
        content:
          "Every post must pass the substance gate: (1) At least one specific example with details — not use data to make better decisions but check the source_campaign property in HubSpot to see which Clay table drove the conversion. (2) Technical specifics — column names, tool names, numbers, metrics. Vague posts are forgettable. Specific posts are useful. (3) Reasoning or consequences shown — not just what to do, but why it matters and what happens if you do not. (4) Practical value or lesson — someone who reads this post should be able to do something differently afterward. If the post does not change behavior or thinking, it is not ready.",
      },
      {
        heading: 'Safety Check',
        type: 'formula',
        content:
          "Before publishing, verify: (1) No named companies or people criticized — patterns over persons, always. You can say I have seen people with 20,000-row Clay tables but never say Company X has terrible Clay hygiene. (2) Pattern vs person test — would the person or company you are referencing feel attacked if they read this? If yes, abstract the pattern further. (3) No ecosystem players targeted — do not criticize competitors, platforms, or tools by name in a negative context. You can state factual limitations but not opinions framed as facts.\n\nThis is not about being soft. It is about building a reputation as someone who shares useful patterns rather than someone who tears others down. The builder community is small. Everyone talks. One careless post burns relationships that took months to build.",
      },
      {
        heading: 'Voice Check',
        type: 'formula',
        content:
          "The final gate: (1) Sounds like you, not a content machine — if you would not say it in a conversation, do not post it. (2) Builder tone, not thought leader — you are sharing what you built and learned, not dispensing wisdom from above. (3) Casual but competent — the tone should feel like a knowledgeable friend, not a textbook or a motivational speaker. (4) No generic B2B speak — no leverage, optimize, synergize, drive results, actionable insights. These words mean nothing. Replace them with specifics about what actually happened.\n\nIf the post passes all four checks — structure, substance, safety, voice — it is ready. If it fails any one, fix it before publishing. No exceptions. The checklist is the quality floor, not the quality ceiling.",
      },
      {
        heading: 'Anti-Slop Quick Scan',
        type: 'formula',
        content:
          "The fastest anti-slop check: (1) Search for em-dashes (the long dash character) — delete all. (2) Search for here is the thing and here is where — delete. (3) Check opening and closing — if they say the same thing, rewrite the closing. (4) Count parallel sentence structures — three in a row with the same rhythm means two need cutting. (5) Check for colon-listed statements — rewrite as natural sentences. (6) Look for three-example patterns — AI loves groups of three. Two specific examples hit harder than three generic ones.\n\nThis scan takes 2 minutes and catches the most visible AI writing tells. Combined with the full pre-publish checklist, it ensures every published post passes the does this sound like a real person wrote it test.",
      },
    ],
  },
]

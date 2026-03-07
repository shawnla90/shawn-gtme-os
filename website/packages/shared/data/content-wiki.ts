/**
 * ShawnOS - Content Wiki Data
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
      'Deep dive into the X (Twitter) algorithm - Home Mixer orchestration, Phoenix ranking model, Thunder retrieval, candidate pipeline stages, scoring weights, and actionable takeaways for creators.',
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
      'algorithm-literacy',
    ],
    sections: [
      {
        heading: 'System Architecture Overview',
        type: 'prose',
        content:
          "The X recommendation system is an open-source pipeline that decides what appears in your For You feed. It was released publicly as the xai-org/x-algorithm repo and has over 15,000 stars on GitHub. The system has four major components: Home Mixer is the orchestration layer that coordinates everything. Thunder handles in-network retrieval - pulling tweets from people you follow. Phoenix is the Grok-based transformer model that scores and ranks candidates. And the Candidate Pipeline filters, deduplicates, and assembles the final feed. Understanding this architecture is the difference between guessing what works on X and knowing what the system rewards.",
      },
      {
        heading: 'How Scoring Works',
        type: 'pattern',
        content:
          "Every tweet that enters your feed goes through a multi-action prediction model. The system predicts the probability of twelve different engagement actions: P(favorite) - will you like it. P(reply) - will you reply. P(repost) - will you retweet. P(quote) - will you quote tweet. P(click) - will you click on it. P(share) - will you share externally. P(dwell) - will you spend time reading it. P(follow_author) - will you follow the author after seeing this. P(not_interested) - will you hit not interested. P(block_author) - will you block the author. P(mute_author) - will you mute the author. P(report) - will you report the tweet.\n\nThe final score is a weighted sum: Final Score = sum(weight_i * P(action_i)). Positive actions (like, reply, repost, quote, share, dwell, follow) push the score up. Negative actions (not_interested, block, mute, report) push the score down. The weights are not equal - replies and quote tweets carry significantly more weight than likes.",
      },
      {
        heading: 'Positive vs Negative Weight Actions',
        type: 'pattern',
        content:
          "This is where it gets actionable for creators. The algorithm assigns different weights to different engagement types. Replies are weighted heavily - a tweet that sparks conversation scores higher than one that gets passive likes. Quote tweets with added commentary are also high-weight because they represent deeper engagement. Reposts carry moderate weight. Likes are the lowest positive signal - they indicate interest but not deep engagement.\n\nOn the negative side, any tweet that triggers mute, block, not_interested, or report signals gets penalized hard. A single block or report can outweigh dozens of likes. This means controversial content that gets engagement but also triggers negative signals can actually score lower than a modest post with clean positive engagement. The algorithm punishes polarizing content more than people realize.",
      },
      {
        heading: 'Phoenix Two-Tower Retrieval',
        type: 'pattern',
        content:
          "Phoenix uses a two-tower neural network architecture. One tower represents the user - your interests, your engagement history, the types of content you interact with. The other tower represents candidate tweets - the topic, the author, the format, the engagement pattern. Both towers produce embedding vectors, and the system computes similarity between them. High similarity = the tweet is likely relevant to you.\n\nKey design decisions: Phoenix uses no hand-engineered features. Everything is learned from engagement data. It also uses candidate isolation - each tweet is scored independently, not relative to the other tweets in the batch. And it predicts multiple actions simultaneously rather than just one. This means the model captures nuanced engagement patterns that a simpler system would miss.",
      },
      {
        heading: 'Practical Takeaways for Creators',
        type: 'pro-tip',
        content:
          "Based on the algorithm architecture, here is what actually moves the needle: (1) Optimize for replies and quote tweets over likes. Write tweets that invite conversation, not passive agreement. Ask questions. State takes that people want to respond to. (2) Dwell time matters. Longer tweets that people actually read score higher than short tweets they scroll past. But only if the content earns the dwell - padding with filler hurts. (3) Avoid triggering negative signals. Rage-bait might get engagement, but if it also gets mutes and blocks, the net score drops. Clean engagement beats polarizing engagement. (4) Follow signals are gold. If your tweet makes someone follow you, that is one of the strongest positive signals. Build tweets that showcase expertise worth following. (5) Consistency builds your user tower. The more consistently you post about specific topics, the stronger your signal in the user-tower matching. Niche down. (6) In-network vs out-of-network: Thunder pulls from your followers first. Building a strong follower base that engages with your content means your tweets start with a higher baseline before Phoenix even scores them for the wider feed.",
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
      'X (Twitter) format guide - thread structure, compression rules, micro-tip format, engagement patterns derived from the algorithm, and content pillar adaptation for the X platform.',
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
          "X is the compressed version of LinkedIn. Same builder voice, faster pace, tighter constraints. LinkedIn is the long-form stage. X is the live feed from the workshop. Everything that works on LinkedIn but stripped to the bone. No filler sentences. Every line earns its spot. Casual, builder, punchy. The character limit is not a limitation - it is a compression engine that forces you to find the essential version of every idea.",
      },
      {
        heading: 'Format Strategy',
        type: 'pattern',
        content:
          "Single posts: memes, reactions, one-liners, hot takes. Under 280 characters when possible. Screenshot or GIF attached. These are X-native content - not repurposed from LinkedIn.\n\nThreads: plays series (condensed), system shares, build logs. Each tweet in the thread should stand alone. Someone scrolling should get value from any single tweet even without reading the rest. Thread length: 4-8 tweets. Beyond 8 is diminishing returns.\n\nQuote tweets and replies: engage the builder community. Add a real take, not generic praise. A thoughtful quote tweet that adds context performs better algorithmically than a simple retweet because the algorithm weights quote tweets heavily.",
      },
      {
        heading: 'Thread Structure',
        type: 'pattern',
        content:
          "Tweet 1: hook - standalone value, the scroll-stop. This tweet must work even if nobody reads the thread. Tweet 2: context and setup - what tool, what signal, what problem. Tweets 3-5: the substance - 1-2 steps per tweet, emoji-marked for visual scanning. Tweet 6: result - what this actually does for pipeline or workflow. Tweet 7 (optional): resource delivery - full prompt in the reply, or link back to the expanded LinkedIn version.\n\nSchedule threads 1-2 days after the LinkedIn version drops. X gets the cliff notes, LinkedIn has the full breakdown. This creates a natural cross-platform funnel without duplicating content.",
      },
      {
        heading: 'Character and Paragraph Rules',
        type: 'pattern',
        content:
          "Single tweet: 280 characters. Write tight. A 140-character banger beats a 280-character nothing. Don't pad to fill. Thread tweets: still 280 each, but you have room to breathe across multiple.\n\nParagraph structure: one sentence per line. Period. Single-line statements hit hardest on X. No multi-sentence paragraphs - that is LinkedIn energy. Whitespace between thoughts using blank lines. Line breaks count as characters so use them intentionally.",
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
          "The most common mistake is taking a LinkedIn post and pasting it on X without compression. X users scroll faster, engage shorter, and expect tighter content. A 1,200 character LinkedIn post needs to become a 280 character tweet or a 4-tweet thread - not a screenshot of the LinkedIn post (those perform terribly). Compress, don't transplant. Find the one insight or one step that carries the most value and lead with that. If the full context matters, thread it. But each tweet in the thread must deliver standalone value.",
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
      'LinkedIn algorithm and content strategy guide - algorithm signals, 5 content pillars, emoji system, comment strategy, sign-off patterns, and engagement optimization for builders.',
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
      'algorithm-literacy',
      'call-to-actions',
    ],
    sections: [
      {
        heading: 'Algorithm Signals That Matter',
        type: 'prose',
        content:
          "LinkedIn's algorithm prioritizes dwell time, comments, and shares in that order. A post that people stop scrolling to read - even if they don't engage - scores higher than a post that gets quick likes and scroll-past. Comments are the strongest visible signal. Posts that generate conversation threads get pushed to more feeds. Shares extend reach beyond your network. Likes are the weakest signal but still matter for initial distribution.\n\nThe algorithm also weighs early engagement heavily. The first 60-90 minutes after posting determine how wide the distribution goes. If your post gets strong engagement in that window, it enters a broader distribution cycle. If it flatlines, it stays in a narrow feed. This is why posting time matters and why your first commenters matter - they trigger the distribution flywheel.",
      },
      {
        heading: 'The Five Content Pillars',
        type: 'pattern',
        content:
          "Pillar 1 - Plays Series (highest performing): formatted as step-by-step workflow walkthroughs with emoji markers. Pain point or contrarian hook, series title and play number, step-by-step workflow, why-this-matters context, no-gatekeeping resource delivery to comments, identity sign-off. Screen recording or screenshot attached.\n\nPillar 2 - Building and Sharing: narrative, reflective, personal journey. Personal opener about what you built or what broke, the messy real process, the insight or shift in thinking, invitation to connect. Longer sentences allowed. More storytelling, less structure.\n\nPillar 3 - GTM Memes: short text plus meme, gif, or video. Setup line with relatable GTM pain, punchline or meme context, engagement ask, brief sign-off. Pop culture references - anime, wrestling, music - always with a real lesson underneath.\n\nPillar 4 - Release Reactions: first-hand builder take on new tool features. What changed, how you tested it, specific workflow it enables, forward-looking take.\n\nPillar 5 - Skill and System Shares: sharing actual frameworks and skill files. What you built and why, how it works, where to get it, comment thread with deeper insights.",
      },
      {
        heading: 'Paragraph and Formatting Rules',
        type: 'pattern',
        content:
          "1-2 sentences maximum per paragraph. Lots of whitespace for mobile scrolling. Short punchy lines create rhythm. Single-line statements for emphasis. LinkedIn is read on phones - long paragraphs get skipped.\n\nOpening line: always lowercase first word unless it is a proper noun or first-person I. Strong hook in the first 2 lines. Lead with pain, a contrarian take, or action. No generic greetings.\n\nEmoji usage is structural, not decorative. Workflow step markers: checkmarks, wrenches, links, brains, puzzle pieces. Identity markers: lightning bolt, wizard. Tone signaling: self-deprecating, frustrated, knowing. Each emoji marks a step, signals tone, or anchors identity. Don't scatter them randomly.",
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
          "Your sign-off is not a CTA - it is an identity anchor. Variations: shawn the gtme alchemist with wizard emoji, shawn with lightning bolt GTM Engineer, shawn with lightning bolt and pipe the gtme alchemist with wizard emoji. Always include the lightning bolt or wizard or both. The sign-off becomes a recognizable pattern that builds brand recall across posts. People should see the sign-off and know who wrote it before they even read the name.",
      },
      {
        heading: 'Anti-Pattern: Performing Expertise',
        type: 'anti-pattern',
        content:
          "The biggest LinkedIn trap is performing expertise instead of sharing it. Authority signaling phrases like the uncomfortable truth, let me be clear, what most people miss - these are performance, not substance. State your observation directly. Share the specific tool, the specific workflow, the specific result. If you built something that works, show it working. A screenshot of the actual Clay table beats a paragraph about how important data enrichment is. LinkedIn rewards specifics over generalities, always.",
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
      'TikTok algorithm and content strategy - 16-second video structure, hook-demo-result-loop format, 6 content series, watch time signals, and cross-platform distribution for builders.',
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
          "TikTok is the compression layer underneath X. LinkedIn tells the story. X gives you the cliff notes. TikTok gives you the moment. One win, one demo, one scroll-stop. 16 seconds or less. The entire platform runs on fast, useful, loopable - and that is exactly how builder content should work here.\n\nThis is not a dance platform anymore. It is where people learn things in 15 seconds that would take a blog post 10 minutes to explain. That is the lane. The version of you that shows someone a shortcut over their shoulder in 12 seconds and walks away.",
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
          "Easy Wins with Claude Code: single-use-case demos. One slash command or feature per video. Screen recording, show the output. Lowest lift, highest volume potential.\n\nCursor in 15 Seconds: Cursor-specific shortcuts, features, and tricks most people miss. Hidden features, keyboard shortcuts, MCP integrations. Always screen-captured, zoomed, annotated.\n\nSlash Commands You Didn't Know You Needed: showcase the skills and slash commands from the content OS. Each video equals one command, one result. Natural funnel to GitHub and LinkedIn for depth.\n\nOne Shortcut a Day: daily cadence series. Any tool - Claude, Cursor, Clay, HeyReach, n8n. Formula: problem 2 seconds, shortcut 8 seconds, result 4 seconds, save CTA 2 seconds.\n\nDo This Not That (AI Tool Edition): comparison format. Side-by-side or sequential. The wrong way creates tension, the right way delivers the payoff. Split screen works well.\n\nGTM Plays (The 30-Second Version): repurposed from the LinkedIn Plays series. Extract the aha moment, screen recording of the critical step, full breakdown on LinkedIn as cross-platform CTA.",
      },
      {
        heading: 'Watch Time Signals',
        type: 'pro-tip',
        content:
          "TikTok's algorithm is simpler than X or LinkedIn in one key way: watch time is everything. Completion rate - what percentage of viewers watch to the end - is the primary distribution signal. Replay rate multiplies it. A 16-second video that people watch twice scores higher than a 60-second video that people abandon at 30 seconds.\n\nThis is why the 16-second cap matters. Shorter videos have higher completion rates by default. A tight 16-second video with a visual loop that triggers auto-replay can accumulate massive watch time numbers relative to its length. Front-load the hook. Deliver fast. Close with a loop. That is the formula.",
      },
      {
        heading: 'Visual and Audio Rules',
        type: 'pattern',
        content:
          "Bold text overlays: large, readable on mobile, 2-3 words max per text block. Captions always on - most people watch without sound. Screen recordings: crop tight, zoom on the action, no full-screen IDE shots because too much noise. Split-screen or green screen when personality matters, screen-only when the demo speaks for itself. Fast cuts and zooms using CapCut or TikTok editor.\n\nAudio: trending sounds muted or low plus text overlay as the safe default. Direct-to-cam voiceover when personality adds value. Screen recording with narration for complex demos. No background music that competes with speech.\n\nCaptions: lowercase first word, capitalize I, short and punchy, 1-2 lines max. The caption supports the video, it does not replace it. Tags: 3-5 relevant tags per video, mix niche and broad.",
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
      'Reddit content strategy for builders - subreddit targeting, karma and engagement signals, authentic participation patterns, AMA strategy, and cross-posting without getting flagged as spam.',
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
          "Reddit's ranking algorithm uses upvotes, comments, and time decay. A post that gets rapid upvotes in the first hour rises fast. But unlike LinkedIn, downvotes actively hurt visibility. A post at 60% upvoted (meaning 40% downvoted) will underperform a post at 95% upvoted with fewer total votes.\n\nComments are weighted heavily. Posts with active comment sections - especially from the OP engaging with replies - get boosted. Reddit rewards conversation. A post where you drop information and disappear performs worse than a post where you stick around and answer questions in the comments for the next 2 hours.\n\nAwards and saves also signal quality. A saved post tells Reddit this content has lasting value. Award-worthy content gets algorithmic preference in the subreddit and on users' home feeds.",
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
          "Cross-posting the same content across multiple subreddits is a fast way to get flagged as spam. Reddit's systems detect identical posts across communities. If you want to share something across 3 subreddits, write 3 different versions. Same core insight, different framing for each community's norms.\n\nTiming matters: don't post to multiple subreddits within the same hour. Space them out across days. And adjust the title and opening for each community - what resonates in r/startups is different from what works in r/ClaudeAI.\n\nFor linking to your own content (LinkedIn posts, Substack articles, tools): the safest approach is to write a valuable Reddit-native post and mention the external resource casually in the comments, not the main post. Let someone ask for the link. Or add it as an edit after the post has gained traction organically. This feels native rather than promotional.",
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
      'Substack newsletter growth strategy - content structures, Notes feed strategy, cross-promo patterns, lead magnets, subscriber growth tactics, and the shift from custom artwork to build artifacts.',
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
      'typefully-mcp',
    ],
    sections: [
      {
        heading: 'Platform DNA',
        type: 'prose',
        content:
          "Substack is the deep-dive layer. LinkedIn and X hook, compress, and spark. Substack expands, deepens, and builds the longer relationship. This is where a 3-line hook becomes a 600-word breakdown. Where a screenshot becomes a full build log. Where the 50 early subscribers become the core audience that follows the whole arc.\n\nThe tone is long-form extension of builder voice. More reflective, more room to breathe. Sentences can run longer than LinkedIn. Paragraphs can have 2-3 sentences. But the same casual competence - never academic, never corporate. Think: the version of you that sits down after shipping something and explains how the whole thing works to someone who is about to build their own.",
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
          "The growth model: LinkedIn posts hook interest. The CTA drives to Substack for the expanded version. X threads tease the key insight. TikTok demos the visual moment. Every platform feeds back to the newsletter as the long-form home base.\n\nCross-posting rules: GTM Plays start on LinkedIn, expand into Tactical Breakdown on Substack 3-5 days later. Build logs start on X or LinkedIn, expand into full POV Essay on Substack. Hot takes on X expand into Contrarian Takes if they have legs. Original deep dives start on Substack, then get condensed for LinkedIn and X after publish.\n\nThe newsletter is not competing with social - it is the destination that social points to. Every social post is a potential on-ramp to a Substack subscriber.",
      },
      {
        heading: 'Visual Strategy Shift',
        type: 'pattern',
        content:
          "No more custom artwork. The legacy approach used custom anime illustrations per newsletter issue. That is over. Visuals now come from the build itself: Cursor screenshots with skill files open, repo tree views, Claude chat outputs that produced something useful, screen recordings of workflows running, and inline code snippets.\n\nOne visual per post minimum. It should be something you already have from building - zero extra production time. The content IS the visual. This removes the bottleneck of art production and lets you publish at the speed of building instead of the speed of designing.",
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
          "Content scheduling follows a rhythm, not a fixed calendar. LinkedIn posts perform best Tuesday through Thursday, mornings EST. X posts are more flexible but evenings tend to perform well for builder audiences.\n\nThe pattern: batch-write content during deep work sessions, schedule for distribution across the week. A single writing session can produce 3-5 posts that get scheduled across a week. This separates creation from distribution - you write when you are in flow state and publish when the audience is active.\n\nTypefully's queue feature lets you add posts to a queue without specific times. The queue distributes them according to your preset schedule. This is the lowest-friction approach for consistent posting.",
      },
      {
        heading: 'Integration with the Content OS',
        type: 'pro-tip',
        content:
          "The real power is the integration loop: markdown drafts in the repo get version controlled. The final-copy skill normalizes voice and extracts clean text. Typefully MCP pushes to the scheduling platform. Published posts get tracked in the daily tracker.\n\nThis means your entire content pipeline - from idea capture to published post - lives inside your IDE. You never need to open Typefully's web interface, never need to copy-paste between tools, never need to context-switch from your code editor. The content operating system handles end-to-end.",
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
      'When to use Figma, Canva, and VEED for content creation - thumbnail creation, carousel design, video editing with VEED, template workflows, and choosing the right tool for each content type.',
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
      'gif-creation-for-web',
    ],
    sections: [
      {
        heading: 'Tool Selection Framework',
        type: 'prose',
        content:
          "Not every visual needs the same tool. The decision framework: Figma for custom, precise design work - thumbnails, branded templates, carousel posts that need exact spacing and typography. Canva for quick, template-based visuals - when speed matters more than pixel-perfect control. VEED for video editing - TikTok clips, screen recording overlays, subtitle generation, and short-form video production.\n\nThe default for most social content should be the fastest tool that produces acceptable quality. A Canva template finished in 5 minutes beats a Figma masterpiece that took 2 hours - especially when the post's performance depends on the text, not the visual.",
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
          "Canva is the fast lane. Use it when you need a visual in under 5 minutes and the design does not need to be custom. Quote graphics for X, simple announcement visuals, story templates, and any one-off visual that will not be reused.\n\nCanva's AI features have gotten good enough for quick resizing across platforms - design once at LinkedIn dimensions, auto-resize for X, Instagram, and TikTok. The brand kit feature lets you lock in your colors and fonts so even quick designs stay on brand.\n\nWhere Canva falls short: complex multi-element layouts, precise typography control, and anything that needs to feel premium. If the visual represents your brand at a high level - like a hero image for a Substack post - use Figma. If it is a supporting visual for a social post, Canva is fine.",
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
          "The biggest time sink in content creation is over-designing visuals for social posts. A LinkedIn post with a raw screenshot of your actual tool performing a task will outperform a professionally designed infographic about the same topic. Authenticity signals beat production quality on social platforms.\n\nThe rule: spend 80% of your time on the text and 20% on the visual. If the visual is a real screenshot, a real screen recording, or a real code snippet - that is more authentic than a designed graphic. Design tools are for specific use cases (carousels, thumbnails, brand assets), not for every post.",
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
      'Building branded terminal-style images with Python Pillow - Anthropic color schemes, monospace typography, boot-sequence aesthetics, matrix rain backgrounds, and real skill implementations.',
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
          "Python Pillow (PIL fork) generates images programmatically. For a content operating system that lives in a code editor, this means images are code - version controlled, reproducible, parameterized. You do not open Figma. You run a script.\n\nThe terminal aesthetic - black background, green accent, monospace font - is the visual identity of the content OS. It is distinctive, instantly recognizable, and impossible to replicate with Canva templates. Every image looks like it came from a real terminal because it was generated by code that follows terminal design principles.",
      },
      {
        heading: 'The Anthropic Color Scheme',
        type: 'pattern',
        content:
          "The base palette: background black (#0D0D0D or #111111), primary text green (#00FF41 - terminal green), secondary text white (#E0E0E0 - slightly off-white for readability), accent amber (#FFB000 - for warnings, highlights), dim text gray (#555555 - for comments and secondary info), border subtle (#1A1A1A - barely visible panel borders).\n\nThis is not random. It mirrors the Anthropic/Claude terminal aesthetic - dark, clean, professional but with personality. The green-on-black is the signature. Every image generated by the content OS uses this palette, creating visual consistency across hundreds of posts without a design system document.",
      },
      {
        heading: 'Boot-Sequence Aesthetic',
        type: 'pattern',
        content:
          "The boot-sequence style is the hero format for article images and LinkedIn carousel covers. Structure: header with system name and version, a loading or initialization sequence with timestamps, the core content rendered as system output, footer with status line.\n\nThis mimics a real system booting up - the AI/os brand identity in visual form. Each image tells a story of a system starting up, loading modules, and presenting information. It is information-dense, visually striking, and completely unique to this brand.\n\nImplementation: Pillow draws text line by line with calculated Y positions. Each line has a specific color (green for system prompts, white for content, amber for highlights). Font size varies by importance. The monospace font (typically Fira Code or JetBrains Mono) sells the terminal authenticity.",
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
          "Three skills in the content OS use Python Pillow directly: aios-image generates the terminal boot-sequence article images. x-tip-image generates matrix rain backgrounds with centered tip panels for X micro-tip posts. content-images is the general-purpose image generator for any custom visual need.\n\nEach skill follows the same architecture: define the canvas size, set up the color palette, calculate text positions, draw background elements, draw text with appropriate fonts and colors, save to the content output directory. The skills are parameterized - you pass in the content text, and the image generates automatically.\n\nThis means image generation is part of the content pipeline, not a separate design step. Write the post. Generate the image. Publish. All from the same editor.",
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
      'MCP servers for content building - Typefully, Substack, Slack, browser-use for LinkedIn, and how Model Context Protocol integrations power a content operating system from inside Cursor.',
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
      'content-clustering-architecture',
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
          "Typefully MCP: drafting and scheduling posts for X and LinkedIn. Create drafts, schedule publication times, manage the content queue. This is the primary publishing pipeline for social content.\n\nSubstack MCP: creating newsletter drafts directly on Substack. The final-substack skill uses this to push finalized posts without opening the Substack editor. Handles title, subtitle, and body content.\n\nSlack MCP: reading and posting to Slack channels. Used for partner communications, syncing channel history to markdown, posting reminders, and sending content updates to team channels.\n\nBrowser-use MCP: browser automation for platforms without APIs. Used for LinkedIn interactions - reading posts, posting comments, checking engagement metrics. The browser agent navigates LinkedIn like a human, which is the only reliable way to interact with LinkedIn programmatically.\n\nVercel MCP: deployment pipeline for the website. After making content or feature changes to the site, deploy directly from the editor.",
      },
      {
        heading: 'MCP-Powered Content Workflows',
        type: 'pattern',
        content:
          "Example workflow - publish a LinkedIn play: (1) Write the post in content/drafts/ as markdown. (2) Run final-copy to normalize voice and format. (3) Typefully MCP creates the draft on LinkedIn. (4) Browser-use MCP opens the published post to monitor engagement. (5) Slack MCP posts a notification to the content channel. (6) Daily tracker skill logs the publication.\n\nExample workflow - newsletter publish: (1) Write the post in content/substack/drafts/. (2) Run final-substack to normalize and push to Substack via MCP. (3) After publishing, the skill generates LinkedIn and X cross-promo snippets. (4) Typefully MCP schedules the cross-promo posts for the next day.\n\nEach workflow is a chain of MCP calls orchestrated by skills. The agent knows which MCPs to call, in what order, with what data. You trigger it with a single slash command.",
      },
      {
        heading: 'Building Your Own Content MCP',
        type: 'pro-tip',
        content:
          "Any platform with an API can become an MCP server. The pattern: identify the API endpoints you need (create draft, schedule, publish). Write an MCP server that exposes those endpoints as tools. Configure it in your Cursor MCP settings. Now your agent can call those tools directly.\n\nFor content platforms specifically: most expose create and read endpoints. That covers drafting and publishing. Some expose analytics endpoints - that lets your agent pull performance data and factor it into content decisions.\n\nThe meta-pattern: every new platform you add to your content distribution expands the operating system's reach without changing any existing workflows. Add the MCP, update the relevant skill to include it in the pipeline, done. The architecture scales horizontally.",
      },
    ],
  },

  {
    id: 'image-generation-tools',
    title: 'Image Generation Approaches',
    subtitle:
      'Python Pillow vs AI image gen vs design tools - when to use what',
    category: 'tools',
    description:
      'Image generation approaches for content creators - Python Pillow for terminal aesthetics, AI image generation, design tools, color schemas, and template categories for social content.',
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
          "Anthropic Terminal: black background (#0D0D0D), green primary (#00FF41), white secondary (#E0E0E0), amber accent (#FFB000). The signature look. Used for all terminal-style, boot-sequence, and system-output images.\n\nSynthwave: deep purple background (#1A0A2E), pink accent (#FF2D95), cyan secondary (#00F0FF), warm white text. Used for release reactions, hype content, and anything with a futuristic vibe.\n\nMinimal Dark: charcoal background (#1C1C1E), white text (#FFFFFF), single accent color per image. Used for clean, professional visuals - LinkedIn carousels, article headers, quote graphics.\n\nEach schema has a defined palette with specific hex values. The schemas are not arbitrary - they map to content types. Terminal for technical, synthwave for creative, minimal dark for professional. Consistency across images builds visual brand recognition.",
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
          "Decision tree: Is it a recurring visual format that uses the same layout every time? Use Python Pillow - automate it. Is it a one-off creative visual where novelty matters? Use AI image generation. Is it a complex layout with multiple elements that need precise placement? Use Figma. Is it a quick visual needed in under 5 minutes? Use Canva.\n\nThe default for the content OS is Python Pillow because most content images follow recurring patterns (terminal tips, article headers, stack reveals). Automation means zero production time per image once the template script exists. Design tools fill the gaps for custom one-offs. AI image generation is the last resort - useful but unpredictable.",
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
      'How to build a voice system - 3-tier architecture (DNA, Context Playbooks, Content Ops), encoding voice into a repo, modular voice loading, and the journey from generic AI output to voice-calibrated content.',
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
          "Every AI can write. Very few AI outputs sound like a specific person. The difference is a voice system - a structured set of rules, patterns, and examples that constrain AI generation to match your actual voice. Without one, every post sounds like it was written by the same generic AI. With one, the AI becomes an extension of how you actually communicate.\n\nThe problem is not that AI writes badly. It writes competently but generically. Same sentence rhythms, same transition phrases, same structural patterns. A voice system breaks that homogeneity by giving the AI specific constraints: these words yes, these words never, this sentence length, this paragraph structure, this tone.",
      },
      {
        heading: 'The 3-Tier Architecture',
        type: 'pattern',
        content:
          "Tier 1 - Voice DNA: the foundational layer. Core voice rules that apply to ALL content regardless of platform. Sentence style, word choices, anti-patterns, identity markers, formatting rules. This tier inherits into everything above it. Files: core-voice.md, anti-slop.md, viral-hooks.md.\n\nTier 2 - Context Playbooks: platform-specific adaptations of the voice DNA. How the voice changes for LinkedIn vs X vs TikTok vs Substack. Each playbook inherits from Tier 1 and adds platform-specific constraints. The voice stays consistent but the format, length, and delivery adapt.\n\nTier 3 - Content Ops: production-level rules for creating content. Pre-publish checklist, substance requirements, improvement protocol, content pillars, pitfall avoidance. This tier operationalizes the voice - turning principles into checklists and workflows.\n\nEach tier builds on the one below it. A LinkedIn post loads Tier 1 (voice DNA) + Tier 2 (LinkedIn playbook) + Tier 3 (pre-publish checklist). A TikTok script loads Tier 1 + Tier 2 (TikTok playbook) + Tier 3 (substance requirements). The voice is modular.",
      },
      {
        heading: 'Encoding Voice Into a Repo',
        type: 'pattern',
        content:
          "The voice system lives as markdown files in a git repository. This is the key architectural decision. Voice rules are not prompts you paste into ChatGPT. They are versioned documents that evolve over time, are loaded by agent skills, and can be diffed to see how your voice has changed.\n\nDirectory structure: skills/tier-1-voice-dna/ contains the foundation. skills/tier-2-context-playbooks/ contains per-platform adaptations. skills/tier-3-content-ops/ contains production rules, checklists, and pillar definitions.\n\nWhen an agent skill generates content, it reads the relevant voice files first, then generates with those constraints loaded into context. The skill does not need the voice rules hardcoded - it loads them dynamically from the repo. Change a voice rule in the markdown file, and every future content generation reflects the change immediately.",
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
      'The complete AI slop avoidance guide - 14 critical anti-patterns including em-dashes, authority signaling, narrator setups, dramatic framing, bookend summaries, and detection checklists with before/after examples.',
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
      'ai-slop-detector-expanded',
    ],
    sections: [
      {
        heading: 'What AI Slop Is',
        type: 'prose',
        content:
          "AI slop is the collection of writing patterns that make AI-generated content instantly recognizable as AI-generated. Not because the ideas are bad - because the delivery follows predictable patterns that no human naturally writes in. Em-dashes everywhere. Authority signaling phrases. Three parallel dramatic sentences. Bookend summaries that restate the introduction word-for-word. These patterns exist because language models learned from a training corpus full of a specific kind of polished, performative writing. The model defaults to that style unless you actively constrain it.",
      },
      {
        heading: 'Critical Patterns - Always Catch',
        type: 'pattern',
        content:
          "1. Em-dashes: delete all of them. Use periods, commas, or restructure. Natural alternatives are ellipses and arrows.\n\n2. Authority signaling phrases: the uncomfortable truth, let me be clear, here is what nobody tells you, the hard truth is, here is the reality, what most people miss. These are performance, not substance. Exception: here is how and here is the play are directional in builder voice, not performative.\n\n3. Narrator setup lines: here is the thing about, here is where it gets interesting. Delete the setup. Start with the actual point.\n\n4. Dramatic rhetorical framing: but here is the part where, and that is when it clicked, want to know the crazy part. State what happened. Let the reader feel it.\n\n5. Three parallel dramatic sentences: you cannot see it, you cannot copy-paste it away, you have to know it exists. One direct statement lands harder. Cut to one.\n\n6. The bookend summary: opening with a thesis, closing with the exact same thesis rephrased 800 words later. AI wraps content in neat bows. Real thinking goes somewhere new by the end.\n\n7. Self-branded concepts: this is what I call. Just explain it.",
      },
      {
        heading: 'Critical Patterns - Continued',
        type: 'pattern',
        content:
          "8. Artificial drama sentences: the shift sounds simple, it is not. Show why it is hard with a specific example instead of telling the reader it is hard.\n\n9. Colon-listed everything: the result: better data, the impact: faster sales. Reads like a PowerPoint slide. Write natural sentences.\n\n10. The humble brag disclaimer: I do not have all the answers, but. Share your take or do not. The disclaimer makes it worse.",
      },
      {
        heading: 'Context-Dependent Patterns',
        type: 'pattern',
        content:
          "These need judgment, not automatic deletion:\n\n11. Engagement bait endings: so here is my question for you. Generally avoid. But on meme posts, asking what is your version and drop it in the comments fits the lighter tone.\n\n12. Bullets for arguments: arguments belong in prose. But workflow steps, tool lists, and technical implementations use bullets and emoji markers naturally. The rule: bullets for execution, prose for reasoning.\n\n13. False dichotomies: it is not X, it is Y. Generally avoid. But contrasting old way vs new way - manual SDR grind vs automated Clay workflow - is showing evolution, not a false dichotomy.\n\n14. Bold headers as transitions: headers for navigation only. LinkedIn posts are whitespace-driven, not header-driven.",
      },
      {
        heading: 'Your Natural Patterns (Not Slop)',
        type: 'pro-tip',
        content:
          "These look like AI tells but are actually authentic voice patterns. Do not flag them:\n\nEllipses for trailing thoughts: true story, it feels prehistoric. Arrows for workflow steps and progression. Emoji section markers (checkmarks, wrenches, links, brains, puzzle pieces) for structuring workflow walkthroughs. Here is how and here is the play as directional openers into workflow breakdowns. Pop culture references mixed into technical content. No gatekeeping as a value statement with resource delivery in comments.\n\nThe distinction: AI patterns are formulaic and repetitive across all content. Your natural patterns are contextual - they appear in specific content types where they serve a function. Ellipses show up in reflective posts, not in technical breakdowns. Emoji markers show up in plays, not in essays. Context determines whether a pattern is authentic or slop.",
      },
      {
        heading: 'Detection Checklist',
        type: 'formula',
        content:
          "Before publishing any AI-assisted content, run this scan: (1) Search for em-dashes - delete all. (2) Search for here is the thing, here is where, let me be clear, the uncomfortable truth - delete all. (3) Check the opening and closing - if they say the same thing, rewrite the closing. (4) Count parallel sentence structures - if you find three in a row with the same rhythm, cut to one. (5) Check for colon-listed statements - rewrite as natural sentences. (6) Read it out loud - if it sounds like a keynote speech, it is slop. If it sounds like you explaining something to a friend, it is voice.\n\nThis takes 3 minutes per post. Those 3 minutes are the difference between content that sounds like everyone else's AI output and content that sounds like you.",
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
      'Viral hooks and scroll-stopping openers - hook categories (curiosity, contrarian, data bomb, story, problem-first, direct challenge), platform-specific adaptation, and first-line formulas that stop the scroll.',
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
      'call-to-actions',
    ],
    sections: [
      {
        heading: 'Why Hooks Matter More Than Content',
        type: 'prose',
        content:
          "On every social platform, the first 1-3 lines determine whether anyone reads the rest. LinkedIn shows 2 lines before the see more fold. X shows the first tweet in a timeline of hundreds. TikTok gives you 1-2 seconds before the thumb scrolls. The hook is not the introduction to your content - it IS the content for 90% of people who see it. If the hook fails, the rest does not exist.\n\nThis is not about clickbait. Clickbait promises and underdelivers. A good hook promises and the content delivers. The hook earns the attention. The content rewards it. Both are required.",
      },
      {
        heading: 'Six Hook Categories',
        type: 'pattern',
        content:
          "Curiosity Pings: open a loop the reader needs closed. You are not supposed to know this, but here is the trick top founders use. The loop creates tension that only reading further resolves.\n\nContrarian POVs: challenge conventional wisdom. I ignored everyone is advice and that is why it worked. Contrarian hooks work because they create cognitive dissonance - the reader needs to understand how the opposite of what they believe can be true.\n\nData Bombs: lead with a specific, surprising number. 91% of posts fail. Here is what the top 9% are doing differently. Numbers create credibility and specificity in a feed full of vague claims.\n\nStory Openers: start in the middle of a moment. Three years ago I almost quit. Then something unexpected happened. Story hooks work because humans are wired for narrative. We cannot stop mid-story.\n\nProblem-First: name the pain directly. Your content is not boring. It is just missing this one thing. Problem-first hooks work because the reader self-identifies with the pain and needs to know the solution.\n\nDirect Challenge: provoke the reader's identity. If you cannot explain your product in 10 words, you do not understand it. Challenge hooks work because they trigger a need to prove or disprove the claim.",
      },
      {
        heading: 'Platform-Specific Hook Adaptation',
        type: 'pattern',
        content:
          "LinkedIn: lean into professional stakes, career journeys, insights with emotional or intellectual weight. Hooks can be slightly longer - you have 2 lines before the fold. Example: the first time I fired someone I cried in the bathroom.\n\nX: fast hooks, punchy facts, meme-ability, concise. Must work in the first 10 words. Example: this founder built 3 products before he ever launched one.\n\nTikTok and Reels and Shorts: on-screen text IS the hook. 8 words or fewer. Must work without sound. Result-first hooks drive replay value - show the outcome, then how. Example on-screen text: you are using Claude wrong, here is why. Example result-first: 30 minutes of work, 3 seconds.\n\nThe same insight can be hooked differently for each platform. A LinkedIn hook can be reflective and emotional. The X version of the same hook is compressed and punchy. The TikTok version is visual and immediate. Same core idea, different delivery optimized for the platform is attention pattern.",
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
      'CTAs that actually convert - CTA placement strategy, soft vs hard CTAs, platform-specific CTA patterns for LinkedIn, X, Substack, and TikTok, and the value-delivery CTA framework.',
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
          "Most CTAs fail because they ask before giving. Follow me for more tips. Like if you agree. Subscribe for updates. These ask the reader to do something for the creator with no clear value exchange. The alternative: value-delivery CTAs. Instead of asking for engagement, deliver value and let the engagement follow naturally.\n\nThe framework: give the reader something genuinely useful (a prompt, a formula, a template, a resource), then tell them where to get it. The CTA is not asking for a favor - it is directing them to more value. The engagement (comments, follows, shares) happens as a side effect of the value delivery.",
      },
      {
        heading: 'Three CTA Types',
        type: 'pattern',
        content:
          "Value Delivery CTAs (primary): prompt is in the comments, formula plus HTTP API setup in the comments, do not sleep on the comments the prompt and scoring guide is there, documented the full process and the full doc is in the comments. These work because the reader gets something tangible. The comment section becomes a resource, not a discussion.\n\nCo-Building CTAs (for narrative posts): DM me if you are building something similar, if you are building with Cursor and figuring it out too DM me, follow along if you want to see how it plays out. These work on building-and-sharing posts because they create peer connection, not follower hierarchy.\n\nEngagement CTAs (meme posts only): what is your version drop it in the comments, what is the coldest cold email practice you have seen still running in 2026. These work on lightweight content because they invite shared experience. Never use these on educational or tactical posts - they cheapen the substance.",
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
          "Where you place the CTA matters as much as what it says. On LinkedIn: the CTA goes at the end, after the substance. Never before. The reader needs to receive value before they are willing to act. A CTA in the middle of a post interrupts the flow and signals that the content is a vehicle for the CTA rather than the CTA being a natural extension of the content.\n\nException: for plays-series posts, a soft CTA can appear mid-post as a teaser - keep reading, the prompt is below - which functions as a hook to keep them scrolling, not an ask.\n\nOn X: CTA is the last tweet in a thread or a reply to the main tweet. On Substack: CTA is at the very end, after the sign-off if it is a share-ask, or inline if it is a resource link. On TikTok: CTA is the last 2 seconds of the video, visual or verbal.",
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
      'Commenting style and engagement strategy - value pin comments, 6 comment bucket system (technical depth, encouragement, pattern recognition, observational, stack reveal, contrarian), and authentic reply patterns.',
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
          "Comments are not afterthoughts - they are a content channel. On LinkedIn, your comments appear in other people's feeds. A thoughtful comment on a high-visibility post can get more impressions than your own posts. On your own posts, the comment section is where you deliver resources, add depth, and continue the conversation.\n\nThis means commenting deserves the same voice calibration as posting. A great comment adds value, shows expertise, and feels like it came from a real person - not a bot farm running through a list of influencer posts dropping fire emoji.",
      },
      {
        heading: 'The Six Comment Buckets',
        type: 'pattern',
        content:
          "Technical Depth: add specific technical context that the post did not cover. If someone posts about Clay enrichment, comment with a specific column formula or API endpoint you have used. This establishes credibility through specifics, not claims.\n\nEncouragement: genuine recognition of good work. Not great post but I built something similar last month and the hardest part was X, which you nailed. Encouragement that adds context is value. Encouragement without context is noise.\n\nPattern Recognition: connect the post to a broader pattern you have observed. This is the same dynamic I see in how teams adopt Cursor - it starts with one person and spreads when the output quality becomes undeniable. This adds perspective and shows systems thinking.\n\nObservational: notice something in the post that most readers miss. The subtle part here is that the scoring model runs after the enrichment, not during. Most people would put them in the same column. This shows you read deeply and think carefully.\n\nStack Reveal: share the specific tools, configurations, or setups that relate to the post. We run a similar flow but with LeadMagic instead of Apollo for European coverage and the hit rate difference is significant. This is useful information wrapped in engagement.\n\nContrarian: respectfully challenge an assumption in the post. I have found the opposite - smaller batches actually cost more per contact when you factor in the fixed overhead of table setup. Not disagreeing for attention, but adding a real counterpoint with evidence.",
      },
      {
        heading: 'Value Pin Comments',
        type: 'pattern',
        content:
          "A value pin comment is the first comment on your own post, pinned to the top, that delivers the resource promised in the post. If your post says prompt is in the comments, the pinned comment IS the prompt. Full text. No gatekeeping.\n\nStructure: start with the resource itself (prompt, formula, code, link). Then add 2-3 lines of context about how to use it or adapt it. The pinned comment should be standalone-valuable - someone who reads only the comment and not the post should still get something useful.\n\nThe pinned comment also functions as an engagement anchor. People reply to the pinned comment with their own adaptations, questions, and results. This creates a comment thread that the LinkedIn algorithm reads as high engagement, pushing the post to more feeds.",
      },
      {
        heading: 'Replying to Commenters',
        type: 'pro-tip',
        content:
          "Reply to every comment in the first 2 hours. This is not about being polite - it is about the algorithm. LinkedIn's distribution engine weights early comment activity heavily. A post with 20 comments in the first hour gets more distribution than a post with 20 comments over 3 days.\n\nBut the replies need substance. One-line value adds, not generic thanks. If someone shares their experience, build on it with a specific follow-up. If someone asks a question, answer it thoroughly. If someone disagrees, engage the substance of their point.\n\nNever use: thanks for sharing, great point, totally agree. These are zero-value replies that signal you are replying for the engagement metric, not the conversation. A silent like on their comment is better than a meaningless reply.",
      },
      {
        heading: 'Anti-Pattern: Spray and Pray Commenting',
        type: 'anti-pattern',
        content:
          "The spray-and-pray strategy - commenting on 50 posts per day with generic responses - is visible and damaging. People notice when the same account drops love this or great insight on every post in their feed. It reads as automated, even if it is manual.\n\nThe alternative: comment on 5-10 posts per day with genuine substance. Pick posts where you have actual expertise to add. Write 2-3 sentences minimum. Reference specific details from the post. Add information the reader would not have gotten from the post alone.\n\nFive substantive comments per day build more credibility than fifty generic ones. The people whose posts you comment on notice quality. They engage back. They become part of your network. That is how commenting drives growth - through relationship, not volume.",
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
      'Content anti-patterns to avoid - purple gradient posts, thought leader traps, over-polish, generic advice, template-driven content, and how to recognize and fix each pattern.',
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
      'ai-slop-detector-expanded',
    ],
    sections: [
      {
        heading: 'The Thought Leader Trap',
        type: 'anti-pattern',
        content:
          "Performing wisdom instead of sharing lessons. Abstract principles without concrete examples. Three perfect parallel examples that illustrate the point with suspicious symmetry. Branding concepts instead of explaining them - this is what I call the velocity framework.\n\nThe fix: replace every abstract principle with a specific story. Instead of leaders need to communicate clearly, try last tuesday I told my team we were pivoting the campaign targeting and three people had completely different interpretations of what that meant. Specifics are interesting. Abstractions are forgettable.",
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
          "Spending 4 hours on a post that should take 30 minutes. Optimizing language instead of adding substance. Making it perfect instead of shipping it. The over-polish trap is insidious because it feels productive - you are improving the content. But past a certain point, you are improving the words while the ideas stay the same.\n\nThe rule of thumb: if you have edited a post more than 3 times without adding new information, you are polishing, not improving. Ship it. The feedback from publishing teaches you more than another round of editing. A good post published today beats a perfect post published never.",
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
          "The purple gradient template post is the visual equivalent of AI slop. Inspirational quote on a gradient background. Leadership wisdom in a carousel with smooth transitions. These perform well in vanity metrics (likes, impressions) but build zero credibility and zero relationship with the reader.\n\nWhy they fail for builders: the audience you want - technical operators, GTM engineers, startup founders - sees through template content instantly. A purple gradient carousel about the 5 principles of effective leadership tells them nothing about your actual expertise. A raw screenshot of your terminal with a one-paragraph explanation of what you just built tells them everything.\n\nThe rule: if a post could have been written by literally anyone, it should not have your name on it. Your content should be impossible to attribute to someone else because it contains your specific tools, your specific workflow, and your specific results.",
      },
      {
        heading: 'What X Taught Me Templates',
        type: 'anti-pattern',
        content:
          "What my failed startup taught me about leadership. What running taught me about business. What my dog taught me about patience. This template has been so overused that it triggers an immediate scroll-past from experienced LinkedIn users. The analogy structure (thing from life = lesson for business) is the laziest form of content because it lets you avoid saying anything specific.\n\nIf you actually learned something from a failure, share the failure with specifics. What went wrong, what the numbers looked like, what you changed. The lesson emerges from the details. You do not need to frame it as what X taught me - the teaching is implicit when the story is good enough.",
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
      'Recursive content flow - how one piece of content becomes 5+ pieces across LinkedIn, X, Substack, TikTok, and Reddit. The full recursive loop with examples and timing.',
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
      'content-clustering-architecture',
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
          "Start with the long-form version - usually a LinkedIn post or a Substack article. This is where you develop the full idea with all the context, examples, and nuance. This is the source of truth.\n\nFrom LinkedIn to X: compress the core insight into a single tweet or a 4-6 tweet thread. Each tweet stands alone. The thread is the cliff notes version of the LinkedIn post. Schedule 1-2 days after LinkedIn.\n\nFrom LinkedIn to Substack: expand the insight into a 500-800 word deep dive. Add screenshots, code snippets, and extended examples that LinkedIn's format cannot support. Schedule 3-5 days after LinkedIn.\n\nFrom LinkedIn to TikTok: extract the single most visual moment - the screenshot, the demo, the before-and-after. Build a 16-second video around it. This is the most compressed version.\n\nFrom LinkedIn to Reddit: rewrite as a how-I-did-it breakdown with specific numbers and results. Reddit-native framing, no self-promotion. The Reddit version gives the most technical detail because Reddit audiences demand specifics.",
      },
      {
        heading: 'Timing and Sequencing',
        type: 'pattern',
        content:
          "Day 1: LinkedIn post (the source). Day 1-2: X tweet or thread (compressed). Day 3-5: Substack expansion (deep dive). Day 3-7: TikTok video (visual extraction). Day 5-7: Reddit post (technical breakdown).\n\nThe stagger matters. Posting the same idea across all platforms on the same day looks automated and cannibalistic - your followers who are on multiple platforms see the same content everywhere. Staggering by days means each platform gets the content at a natural pace. The LinkedIn audience has moved on by the time the Substack version drops, so it feels fresh rather than repetitive.\n\nException: X can go same-day as LinkedIn because the formats are different enough and the audiences overlap less than you think.",
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
      'Building a content repo - git-based content operating system, directory structure, draft and final workflow, version control for content, and skill-based automation from inside a code editor.',
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
      'programmatic-video-content',
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
          "Every piece of content follows the same lifecycle: (1) Capture - an idea gets recorded, either manually in a draft file or via the idea-bank skill. (2) Draft - the content is written as a markdown file in content/drafts/ with a date-prefixed filename. (3) Voice normalization - the final-copy or final-substack skill reads the draft, applies voice rules, strips AI slop, and produces platform-ready text. (4) Review - you read the normalized version, make final edits. (5) Publish - Typefully MCP or Substack MCP pushes the content to the platform. (6) Archive - the draft moves to content/final/ with publication metadata.\n\nThis workflow is the same regardless of platform. LinkedIn, X, Substack, TikTok scripts - they all follow capture, draft, normalize, review, publish, archive. The skills handle the platform-specific formatting.",
      },
      {
        heading: 'Version Control for Content',
        type: 'pro-tip',
        content:
          "Git diff on a content file shows you exactly what changed between drafts. This is powerful for voice calibration - you can see which phrases the AI suggested, which ones you edited, and which patterns keep appearing across posts.\n\nCommit messages on content files follow the same convention as code: add for new drafts, update for edits, finalize for publication-ready versions. The git log for a content file tells the story of how that piece evolved from first idea to published post.\n\nBranching is useful for experimental content. Want to try a different hook on the same post? Branch it. Write both versions. Merge the one that feels right. The other version is preserved in git history as a reference for future hook decisions.",
      },
      {
        heading: 'Scaling the System',
        type: 'pattern',
        content:
          "The repo-based content system scales in three dimensions: (1) More platforms - add a new playbook to tier-2, a new skill for publishing, and the same workflow extends to a new platform. (2) More content types - add a new pillar definition to tier-3, a new series to the workflow index, and the system tracks it alongside everything else. (3) More automation - each manual step in the workflow is a candidate for a new skill. If you find yourself doing the same formatting task repeatedly, write a skill for it.\n\nThe system also scales for teams. Multiple contributors can work on content in the same repo with standard git collaboration - branches, pull requests, reviews. The voice system ensures consistency regardless of who is writing because the rules are codified, not tribal knowledge.",
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
      'Agent skills for content automation - how skills like final-copy, play-draft, skill-play, and tiktok-script automate the creation pipeline, writing your own content skills, and the skill architecture.',
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
      'elevenlabs-overview',
      'repos-and-skills-for-builders',
      'typefully-mcp',
      'notetaker-tools',
    ],
    sections: [
      {
        heading: 'What Content Skills Do',
        type: 'prose',
        content:
          "Agent skills are structured instructions that tell the AI agent in your code editor how to perform a specific task. For content, this means: generate a LinkedIn post from a screenshot, convert a draft to platform-ready text, create a TikTok script from a topic, generate terminal-style images, and push to publishing platforms. Each skill encapsulates the full workflow for one content type - inputs, voice loading, generation rules, output format, and publishing steps.\n\nThe power: instead of prompting an AI with write me a LinkedIn post and hoping for the best, you invoke a skill that loads the right voice files, follows the right format structure, applies the right anti-slop rules, and outputs exactly what you need. Consistency through codified process, not repeated prompting.",
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
          "Every content skill follows the same architecture. A SKILL.md file in .cursor/skills/ contains: metadata (name, description, trigger phrases), context loading instructions (which voice files to read first), input requirements (what the skill needs from the user), generation rules (step-by-step instructions for the agent), output format (where to save, what format, file naming conventions), and optional publishing steps (MCP calls, scheduling).\n\nThe skill file is essentially a detailed recipe. The AI agent reads it and executes each step. Because the recipe is explicit, the output is consistent. Because the recipe lives in the repo, it is versioned and improvable. When you notice a skill producing suboptimal output, you edit the SKILL.md - not your prompting strategy - and every future invocation reflects the improvement.",
      },
      {
        heading: 'Writing Your Own Content Skill',
        type: 'pattern',
        content:
          "To create a new content skill: (1) Identify a repeating content workflow that follows the same pattern every time. (2) Document the inputs - what does the skill need from you (a topic, a screenshot, a draft file, a partner name). (3) List the voice files to load - which tier-1, tier-2, and tier-3 files are relevant. (4) Write the generation instructions step by step - be explicit about format, length, structure, and style. (5) Define the output - where does the file get saved, what is the filename convention, what format. (6) Add optional automation - MCP calls for publishing, image generation for visuals.\n\nThe test for whether something should be a skill: if you have done it manually more than 3 times and the process was the same each time, it should be a skill. The upfront cost of writing the SKILL.md is 30-60 minutes. The ongoing savings are 15-30 minutes per content piece, forever.",
      },
      {
        heading: 'The Compound Effect',
        type: 'pro-tip',
        content:
          "Each new skill reduces the time between idea and published content. The first skill saves 15 minutes per post. The tenth skill means your entire pipeline - from idea capture to multi-platform publishing - runs in minutes instead of hours. The compound effect is not just time savings. It is consistency. Every post goes through the same voice normalization, the same anti-slop scan, the same format checks. The quality floor rises because the process catches errors that manual workflows miss.\n\nAfter 20+ content skills, the content operating system effectively runs itself. You provide the idea and the approval. The system handles everything in between.",
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
      'Content pillars framework - the 5-pillar system (Plays, Building/Sharing, Memes, Release Reactions, Skill System Shares), how to develop and track pillars, and balancing pillar distribution.',
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
      'content-clustering-architecture',
    ],
    sections: [
      {
        heading: 'What Content Pillars Are',
        type: 'prose',
        content:
          "Content pillars are the 3-5 recurring themes that all your content maps to. They are not rigid categories - they are gravitational centers. Every post should clearly belong to one pillar or intentionally bridge two. Without pillars, content becomes random. With pillars, your audience knows what to expect and your creation process has structure.\n\nPillars solve two problems: for the creator, they eliminate the what should I post about question because every idea maps to a pillar. For the audience, they create predictability - people follow you because they want more of a specific type of content, and pillars ensure they get it.",
      },
      {
        heading: 'The Five Pillars',
        type: 'pattern',
        content:
          "Pillar 1 - Plays Series: step-by-step workflow walkthroughs showing how you use specific tools to solve specific problems. This is the highest-performing pillar because it delivers immediate, actionable value. Format: pain point hook, numbered steps with emoji markers, resource delivery in comments.\n\nPillar 2 - Building and Sharing: personal narrative about what you are building, what broke, what you learned. More storytelling, less structure. This pillar builds relationship and trust through vulnerability and authenticity.\n\nPillar 3 - GTM Memes: humor-based content that makes technical concepts relatable. Short text plus meme or GIF. Pop culture references with real lessons underneath. This pillar drives the widest reach because humor is shareable.\n\nPillar 4 - Release Reactions: first-hand takes on new tool releases, platform updates, and industry changes. Tested against real work, not theoretical analysis. This pillar positions you as someone who builds with tools, not just writes about them.\n\nPillar 5 - Skill and System Shares: sharing your actual frameworks, skill files, and automation systems. What you built, how it works, where to get it. This pillar attracts the most technical audience and drives the deepest engagement.",
      },
      {
        heading: 'Pillar Distribution',
        type: 'pattern',
        content:
          "Not every pillar should get equal posting frequency. The distribution follows performance and audience expectations: Plays Series at 30-40% of posts (highest ROI, most engagement). Building and Sharing at 20-25% (relationship building). GTM Memes at 15-20% (reach expansion). Release Reactions at 10-15% (relevance, only when new releases happen). Skill System Shares at 10-15% (deep engagement, niche audience).\n\nTrack actual distribution in your daily tracker or content pipeline. If you notice you have posted 5 plays in a row, the next post should be from a different pillar. Variety prevents audience fatigue and ensures you are building different aspects of your brand - not just the tactical side.",
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
      'Pre-publish quality checklist - structure and style check, substance verification, safety review, voice calibration, and anti-slop scan. The final gate before any content goes live.',
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
          "The difference between amateur content and professional content is not talent - it is process. A pre-publish checklist catches errors that your eyes skip after writing and editing the same piece for 30 minutes. It catches voice drift that creeps in during revision. It catches substance gaps that feel filled when you are deep in the topic but read as empty to someone seeing it for the first time.\n\nThe checklist takes 3 minutes. Those 3 minutes prevent publishing something that sounds like everyone else's AI output, contains an accidental company reference, or reads as thought leadership fluff instead of builder substance.",
      },
      {
        heading: 'Structure and Style Check',
        type: 'formula',
        content:
          "Run these checks on every post before publishing: (1) Lowercase first line - the first word should be lowercase unless it is a proper noun or I. This is a voice signature. (2) 1-2 sentence paragraphs maximum - no walls of text. Mobile readers need whitespace. (3) No em-dashes - delete all of them. Use periods, commas, or ellipses. (4) No authority signaling phrases - search for let me be clear, the uncomfortable truth, here is what nobody tells you. Delete them. (5) Natural rhythm - read the post out loud. If it sounds like a keynote speech, it is over-polished. If it sounds like you explaining something to a friend, it is right.",
      },
      {
        heading: 'Substance Check',
        type: 'formula',
        content:
          "Every post must pass the substance gate: (1) At least one specific example with details - not use data to make better decisions but check the source_campaign property in HubSpot to see which Clay table drove the conversion. (2) Technical specifics - column names, tool names, numbers, metrics. Vague posts are forgettable. Specific posts are useful. (3) Reasoning or consequences shown - not just what to do, but why it matters and what happens if you do not. (4) Practical value or lesson - someone who reads this post should be able to do something differently afterward. If the post does not change behavior or thinking, it is not ready.",
      },
      {
        heading: 'Safety Check',
        type: 'formula',
        content:
          "Before publishing, verify: (1) No named companies or people criticized - patterns over persons, always. You can say I have seen people with 20,000-row Clay tables but never say Company X has terrible Clay hygiene. (2) Pattern vs person test - would the person or company you are referencing feel attacked if they read this? If yes, abstract the pattern further. (3) No ecosystem players targeted - do not criticize competitors, platforms, or tools by name in a negative context. You can state factual limitations but not opinions framed as facts.\n\nThis is not about being soft. It is about building a reputation as someone who shares useful patterns rather than someone who tears others down. The builder community is small. Everyone talks. One careless post burns relationships that took months to build.",
      },
      {
        heading: 'Voice Check',
        type: 'formula',
        content:
          "The final gate: (1) Sounds like you, not a content machine - if you would not say it in a conversation, do not post it. (2) Builder tone, not thought leader - you are sharing what you built and learned, not dispensing wisdom from above. (3) Casual but competent - the tone should feel like a knowledgeable friend, not a textbook or a motivational speaker. (4) No generic B2B speak - no leverage, optimize, synergize, drive results, actionable insights. These words mean nothing. Replace them with specifics about what actually happened.\n\nIf the post passes all four checks - structure, substance, safety, voice - it is ready. If it fails any one, fix it before publishing. No exceptions. The checklist is the quality floor, not the quality ceiling.",
      },
      {
        heading: 'Anti-Slop Quick Scan',
        type: 'formula',
        content:
          "The fastest anti-slop check: (1) Search for em-dashes (the long dash character) - delete all. (2) Search for here is the thing and here is where - delete. (3) Check opening and closing - if they say the same thing, rewrite the closing. (4) Count parallel sentence structures - three in a row with the same rhythm means two need cutting. (5) Check for colon-listed statements - rewrite as natural sentences. (6) Look for three-example patterns - AI loves groups of three. Two specific examples hit harder than three generic ones.\n\nThis scan takes 2 minutes and catches the most visible AI writing tells. Combined with the full pre-publish checklist, it ensures every published post passes the does this sound like a real person wrote it test.",
      },
    ],
  },

  /* ================================================================== */
  /*  WORKFLOWS - CLUSTERING + VIDEO                                     */
  /* ================================================================== */

  {
    id: 'content-clustering-architecture',
    title: 'Content Clustering Architecture',
    subtitle:
      'Hub-and-spoke topology for multi-site content that compounds authority',
    category: 'workflows',
    description:
      'Content clustering architecture - hub-and-spoke topology, taxonomy-driven routing, canonical site designation, bidirectional cross-linking, and breadcrumb schema that tells AI engines exactly how your content connects across multiple websites.',
    keywords: [
      'content clustering',
      'hub and spoke content',
      'multi-site content strategy',
      'content topology',
      'cross-site linking',
      'content architecture workflow',
    ],
    difficulty: 'advanced',
    related: [
      'content-pillars',
      'repo-content-system',
      'recursive-content-flow',
    ],
    sections: [
      {
        heading: 'What Content Clustering Is',
        type: 'prose',
        content:
          'Content clustering is the deliberate architecture of how content connects within and across websites. Individual pages are nodes. Internal links and cross-references are edges. The topology determines how authority flows through the graph. A flat blog with no internal linking means every page starts from zero - no authority passes between pieces. A cluster topology with bidirectional links and explicit hierarchy creates a graph where every new page strengthens every existing page. AI engines evaluate topical authority by measuring this graph. Sites with comprehensive, interconnected coverage of a topic get preferential citation over sites with isolated content.',
      },
      {
        heading: 'Hub-and-Spoke Model',
        type: 'pattern',
        content:
          'One parent concept serves as the hub. Specialized verticals branch as spokes. The hub covers the meta-narrative - the process of building. The spokes cover the outputs - what the process produces. Each spoke builds deep authority in one vertical. The hub connects the verticals into a unified graph. Cross-site links between hub and spokes signal to search engines that these sites are one entity covering different facets of the same expertise. The key is that each site content proves the other sites thesis. The building process IS hub content. The workflows produced ARE spoke content. The methodology of creating content IS the other spoke. The recursion is structural, not accidental.',
      },
      {
        heading: 'Taxonomy-Driven Routing',
        type: 'code',
        content:
          'Define the topology in a version-controlled taxonomy file. Map every content pillar to a domain. Map routing rules explicitly: personal stories go to the hub, GTM systems go to spoke one, content strategy goes to spoke two. Cross-domain posts get a primary domain plus cross-links to siblings. The taxonomy file becomes the single source of truth for content placement. Any team member, any AI agent, any automation skill can read the file and know where content belongs. The lifecycle - draft, review, final, published, archived - applies uniformly across all domains. The taxonomy routes by pillar, not by platform or format.',
      },
      {
        heading: 'Canonical Site Designation',
        type: 'pattern',
        content:
          'Every shared content entry gets a canonical site field designating which domain renders it natively. When a how-to guide has its canonical set to a spoke site, it renders on that spoke and generates a redirect from the hub. The hub does not duplicate spoke content - it routes to it. This prevents duplicate content penalties while maintaining the cross-site graph. In a monorepo setup, all sites import the same data package. The canonical designation is a field on the data object, not a DNS or CMS configuration. Changing which site owns a piece of content means changing one field value.',
      },
      {
        heading: 'Bidirectional Cross-Linking Protocol',
        type: 'pattern',
        content:
          'Every new entry must link to existing related entries. Every existing entry that relates to the new one must link back. This creates bidirectional edges in the content graph. No dead ends, no orphans. The implementation is simple: related arrays on every data object. When you add a new entry, populate its related array with existing entry IDs. Then update those existing entries to include the new ID in their related arrays. The template pages render these arrays as clickable links. Programmatic internal linking handles mention-level connections automatically. The result is a graph where you can reach any node from any other node within two or three clicks.',
      },
      {
        heading: 'Breadcrumb Schema as Topology Signal',
        type: 'pro-tip',
        content:
          'Breadcrumbs are not just navigation. BreadcrumbList schema markup in JSON-LD tells AI engines exactly where a page sits in your hierarchy. A guide on a spoke site gets breadcrumbs that communicate the spoke is the authority for that topic. Cross-site breadcrumbs combined with sameAs schema connecting the domains signal a multi-site cluster, not three independent blogs. This is how you build entity count. The breadcrumb protocol becomes a forward-referencing navigation system where each page knows its position in the topology and signals that position to machines.',
      },
    ],
  },

  {
    id: 'programmatic-video-content',
    title: 'Programmatic Video as Content',
    subtitle:
      'React components that render to MP4 - video as a first-class content type',
    category: 'tools',
    description:
      'Programmatic video rendering using Remotion and React - turning video from a separate creative workflow into a first-class content type that shares design tokens, data, and deploy pipelines with your websites.',
    keywords: [
      'programmatic video',
      'remotion video content',
      'react video rendering',
      'video content pipeline',
      'video as code',
      'automated video creation',
    ],
    difficulty: 'advanced',
    related: [
      'repo-content-system',
      'content-skills',
      'content-mcps',
      'gif-creation-for-web',
      'video-editing-tools',
    ],
    sections: [
      {
        heading: 'Why Video Belongs in the Repo',
        type: 'prose',
        content:
          'Video has traditionally been a separate creative workflow. After Effects exports sit on hard drives. Canva projects live in a SaaS database. Neither shares design tokens, data, or deploy pipelines with your content system. Programmatic video changes this. When video is a React component in your monorepo, it imports the same shared package as your websites. Same color palette. Same type definitions. Same build pipeline. Change a brand color in the shared tokens and the websites and videos all update on the next build. Video stops being a separate content silo and becomes another node in the content graph.',
      },
      {
        heading: 'The Remotion Model',
        type: 'code',
        content:
          'Remotion evaluates React components frame by frame at your target FPS and encodes the result to video. You write JSX. It renders pixels. No GPU required. No timeline editor. The video app lives inside the monorepo alongside the website apps. It imports the shared data package for design tokens, colors, and brand configuration. Compositions in a root file define what gets rendered - each composition specifies dimensions, FPS, duration, and the component tree. A render script generates all variants in one command.',
      },
      {
        heading: 'Multi-Format Output',
        type: 'pattern',
        content:
          'Define aspect ratio presets as constants: LinkedIn 4:5, Reels 9:16, landscape 16:9. A responsive scaling hook normalizes rendering to a base resolution and scales proportionally. Each brand gets one composition per aspect ratio. Three brands times three formats equals nine compositions from one component tree. Adding a new brand or format means adding entries to the preset constants and the composition registry. No component code changes. The multi-format approach means one design session produces all social media variants automatically.',
      },
      {
        heading: 'Deterministic Animation',
        type: 'pattern',
        content:
          'Programmatic video requires deterministic rendering. Random values change between frames and break the output. The solution is seeded noise functions. Perlin noise driven by frame number produces organic animation - particle drift, character rain, opacity shimmer - that is fully reproducible. Same seed, same output, every render. This is critical for iteration: you can change one parameter and re-render knowing exactly which frames changed and why. It also enables caching - unchanged compositions skip rendering entirely.',
      },
      {
        heading: 'Video in the Content Index',
        type: 'code',
        content:
          'A content index that tracks your repo should also track video files. Parse filenames for brand, aspect ratio, and format. Track source files (render output) separately from deployed files (copied to site public directories). The index tells you which videos are rendered, which are deployed, and which are missing. Combined with the content graph, you can query for brands without video coverage or formats that need updating. Video becomes queryable, auditable, and integrated into the same content operations as blog posts and wiki entries.',
      },
      {
        heading: 'The Monorepo Advantage',
        type: 'pro-tip',
        content:
          'The real win is not Remotion itself. It is video living in the same codebase as everything else. Design tokens are shared, not duplicated. Brand updates propagate automatically. The deploy pipeline handles video alongside web content. The content index tracks video files alongside blog posts. The knowledge graph can reference video compositions. The same CI that builds the websites can render the videos. Video is no longer a creative island - it is part of the system. That integration is the competitive advantage. Any tool can render video. Only a monorepo can integrate video into every other content type seamlessly.',
      },
    ],
  },

  /* ── AI IMAGE GENERATION ──────────────────────── */
  {
    id: 'midjourney-fundamentals',
    title: 'midjourney for builders (not artists)',
    subtitle: 'generate brand visuals and character art that don\'t look like stock photos',
    category: 'tools',
    difficulty: 'beginner',
    description: 'A practical guide to Midjourney for product builders. Covers subscription tiers, prompt parameters, aspect ratios, and when to use MJ vs. DALL-E vs. Flux.',
    keywords: ['midjourney', 'ai image generation', 'prompt engineering', 'brand visuals', 'character art', 'discord', 'generative ai'],
    sections: [
      {
        heading: 'what midjourney actually is',
        content: 'Midjourney is a Discord-based AI image generator. You type a prompt, it returns four image options. That\'s the core loop.\n\nOriginally it only ran inside Discord via the /imagine command. Now there\'s also a web UI at midjourney.com, but Discord is still where most power users live because you can watch other people\'s generations and reverse-engineer their prompts.\n\nIt\'s not a photo editor. It\'s not a design tool. It generates raw visual assets from text descriptions. You then take those assets into Figma, Canva, or Photoshop to do the actual compositing.',
        type: 'prose',
      },
      {
        heading: 'subscription tiers and which one to get',
        content: 'Basic ($10/mo): 200 fast GPU minutes per month. Runs out fast if you\'re iterating seriously. Fine for one-off experiments.\n\nStandard ($30/mo): unlimited relaxed mode generations + 15 fast GPU hours. This is the sweet spot. Relaxed mode takes 0-4 minutes per generation but you\'re never throttled.\n\nPro ($60/mo): stealth mode (private generations), 30 fast GPU hours, 12 concurrent jobs. Worth it if you\'re doing client work where you don\'t want your prompts visible in public Discord channels.\n\nMega ($120/mo): 60 fast GPU hours. Only makes sense if you\'re generating hundreds of assets per month.\n\nFor most builders: start with Standard. Relaxed mode gives you unlimited runway to iterate.',
        type: 'prose',
      },
      {
        heading: 'model versions and how prompts changed',
        content: 'v5 (2023): required very specific, comma-separated keywords. Prompt style: "chibi character, blue hair, holding laptop, white background, detailed, 8k, artstation"\n\nv6 (late 2023): shifted toward natural language. You can write prompts like sentences. "A chibi character with blue hair holding a laptop against a white background" works better than keyword soup.\n\nv7 (2025): even stronger natural language understanding, better consistency, significantly improved hands and text. Still not perfect on text, but noticeably better.\n\nPractical impact: if you copy a v5 prompt from a tutorial, it may produce worse results on v6+. Strip the keyword-list formatting and rewrite as a description.',
        type: 'prose',
      },
      {
        heading: 'parameters that matter',
        content: 'Aspect ratio ... --ar 16:9 for hero banners and landscape thumbnails. --ar 1:1 for avatars and profile images. --ar 9:16 for mobile-first verticals and stories. --ar 4:5 for Instagram feed posts.\n\n--stylize (or --s): controls how strongly Midjourney applies its aesthetic "taste." Range 0-1000, default 100. Low values (0-50) stick closer to your prompt. High values (750+) lean into MJ\'s house style. For brand work, stay between 50-300.\n\n--chaos (or --c): controls variation between the four generated options. Low chaos = four similar images. High chaos (50-100) = wildly different interpretations. Useful early in exploration, bad when you\'re close to what you want.\n\n--no: negative prompts. --no text, watermark, hands gives the model explicit avoid signals.',
        type: 'pattern',
      },
      {
        heading: 'image-to-image prompting',
        content: 'Upload a reference image before your prompt text to use it as a visual anchor. In Discord: attach the image to your message, copy its URL, then include that URL at the start of your prompt.\n\nExample: [image URL] chibi version of this character, same color palette, holding a sword --ar 1:1\n\n--iw controls image weight (0.5-2.0). Higher weight = generation stays closer to the reference. Default is 1.0.\n\nUseful for: iterating on a character you\'re developing, maintaining color palette consistency across a set, remixing a composition with a different art style.',
        type: 'pattern',
      },
      {
        heading: 'when to use midjourney vs. the alternatives',
        content: 'Midjourney: best for stylized art, character design, brand visuals, editorial illustration. Output has a recognizable aesthetic that reads as intentional and artistic rather than AI-generated stock.\n\nDALL-E 3 (via ChatGPT): better at following precise instructions and rendering text. Worse at consistent art direction. Good for quick one-off assets when you\'re already in ChatGPT.\n\nStable Diffusion: free, runs locally, infinitely customizable with LoRAs and fine-tuning. High ceiling, high floor. Worth learning if you need character consistency across many frames or have privacy requirements.\n\nFlux (via Replicate or fal.ai): strong photorealism, good at following complex instructions. Newer, improving fast. Watch this one.\n\nFor building character-driven brand assets like the neobots on shawnos.ai: Midjourney is the right tool. Treat prompts like engineering specs ... specific about style, mood, composition, and what NOT to include.',
        type: 'prose',
      },
      {
        heading: 'frequently asked questions',
        content: 'Can I use Midjourney images commercially?\nYes, on paid plans. The Basic, Standard, Pro, and Mega tiers all include commercial usage rights. Free tier does not.\n\nWhy do my prompts keep ignoring parts of the description?\nLong prompts dilute attention. The model weights earlier tokens more heavily. Put your most important descriptors first. Use --no for things to avoid rather than "no X" in the prompt body.\n\nHow do I get consistent results?\nSave your core style parameters as a custom suffix in Midjourney settings. For example, setting --style raw --ar 1:1 --s 150 as your default means every generation starts from that baseline.\n\nCan it generate logos?\nNot reliably. It\'ll generate logo-like images but they\'re not vector, have no precision, and usually include garbled text. Generate the visual concept in MJ, then recreate it properly in Figma.\n\nIs the web UI different from Discord?\nSame model, different interface. Web UI has a cleaner workspace and image organization. Discord gives you community context and prompt discovery. Most serious users use both.',
        type: 'prose',
      },
    ],
    related: ['character-design-with-ai', 'ai-image-limitations', 'image-generation-tools', 'design-tools'],
  },
  {
    id: 'character-design-with-ai',
    title: 'how we built the neobots with midjourney',
    subtitle: 'the actual prompt structure and iteration loop behind a chibi character system',
    category: 'tools',
    difficulty: 'intermediate',
    description: 'How the neobot characters on shawnos.ai were designed with Midjourney. Covers prompt structure, iteration workflow, style consistency, and web export.',
    keywords: ['character design', 'midjourney', 'chibi', 'anime art', 'brand characters', 'neobots', 'ai illustration'],
    sections: [
      {
        heading: 'why a chibi character system for a tech brand',
        content: 'Most GTM and SaaS sites look identical: hero image, three feature cards, testimonials, gradient CTA. The visual language is interchangeable.\n\nCharacter-driven design breaks that pattern. Memorable, differentiating, immediately communicates personality before a visitor reads a word. Chibi and anime-inspired styles work specifically because they read as intentional and branded rather than stock-photo-generic.\n\nThe neobot system on shawnos.ai gives each AI tool in the stack a character: Nio (the assistant), RemBot (the slop detector), and others. This makes abstract AI capabilities concrete and gives users something to form a relationship with. It\'s the same logic Pokemon uses ... each character represents a concept, and the design encodes its personality.',
        type: 'prose',
      },
      {
        heading: 'prompt structure that produces consistent results',
        content: 'Order matters. Build prompts in this sequence:\n\n[art style] + [character description] + [pose/action] + [outfit and props] + [color palette] + [background] + [negative prompts via --no]\n\nExample prompt for a tech-themed chibi character:\n\n"chibi anime character, small round face, large expressive eyes, short spiky blue hair, sitting cross-legged on a floating server rack, wearing a hoodie with circuit board patterns, holding a glowing laptop, cool blue and white color palette, soft gradient background, clean linework, flat shading --ar 1:1 --s 150 --no text, watermark, realistic proportions, photorealism"\n\nThe --no list is as important as the positive prompt. Without it, the model will default toward photorealism, add watermarks to signage in the scene, or drift toward adult proportions on a chibi character.',
        type: 'pattern',
      },
      {
        heading: 'the iteration loop: expect 20-50 generations per final character',
        content: 'Generation 1-5: exploration. Use high --chaos (50-80) to see how MJ interprets the concept. Don\'t fall in love with anything yet.\n\nGeneration 6-15: direction lock. Pick the closest option, hit U (upscale) on it, then V (variation) to explore nearby design space. Refine the prompt based on what\'s working and what isn\'t.\n\nGeneration 15-30: refinement. Lower --chaos to 10-20. Tighten the prompt. Remove vague language ("cool", "nice", "detailed") and replace with specific descriptors ("cobalt blue", "isometric perspective", "cel-shaded").\n\nGeneration 30-50: final polish. You should be in V (variation) territory at this point, making small adjustments to pose, expression, or props.\n\nThe mistake most people make: giving up after 5-10 generations because "the AI isn\'t getting it." The iteration loop is the process, not a sign something is wrong.',
        type: 'pattern',
      },
      {
        heading: 'using anime references as structural inspiration',
        content: 'This isn\'t about copying characters. It\'s about using structural design language as a reference point.\n\nOne Piece\'s Zoro has a three-item loadout concept: three swords that define his fighting style and personality. That\'s an architectural idea, not a visual one. Nio\'s design borrows the concept ... three tools that define their function ... without any visual similarity to the character.\n\nHow this works in prompts: instead of "looks like [character]" (which MJ will hallucinate badly), describe the structural elements. "Character carries three signature items that represent their role: [item 1], [item 2], [item 3]" is a prompt-safe way to encode the archetype.\n\nColor coding is another structural tool. Rem/RemBot uses red-and-white as a scan/alert color language because that\'s the cognitive association with system warnings. The color choice isn\'t arbitrary ... it carries meaning.',
        type: 'prose',
      },
      {
        heading: 'consistency across a character system',
        content: 'The hardest part of AI character design isn\'t generating one good character. It\'s making six characters look like they belong in the same universe.\n\nCore consistency parameters: lock in art style (chibi, anime, cel-shaded) and never deviate. Lock in linework style (clean, flat shading vs. detailed crosshatching). Lock in color temperature (warm or cool, not both). Define a shared background treatment (soft gradient, flat color, transparent).\n\nCreate a style anchor prompt that you prepend to every character. Example: "chibi anime character, cel-shaded, clean linework, flat shading, consistent proportions (2-3 head heights), cool blue-toned color palette" ... then add character-specific details after.\n\nSave this as a Midjourney custom suffix in /settings so it applies automatically.',
        type: 'pattern',
      },
      {
        heading: 'exporting and preparing images for web',
        content: 'Midjourney outputs JPGs or PNGs with backgrounds. For web use you usually want transparent backgrounds.\n\nWorkflow: Upscale the final image in MJ (U button). Download the upscaled PNG. Take it into remove.bg, Adobe Express, or Photoshop\'s Remove Background tool. Export as PNG with transparency preserved.\n\nCompression matters. An uncompressed PNG of a character illustration can be 2-4MB. Run it through Squoosh (squoosh.app) targeting WebP format at 80-85% quality. For a chibi character at 512x512 this should land under 80KB without visible quality loss.\n\nFor the neobots on shawnos.ai: characters are served as WebP, compressed at build time via Next.js image optimization, with explicit width/height to prevent layout shift. The transparent PNG is the source file; the build handles delivery format.',
        type: 'prose',
      },
      {
        heading: 'frequently asked questions',
        content: 'How many characters should a brand system have?\nStart with one and get it right. Adding characters before nailing the first one produces an incoherent visual system. The neobots expanded from one to several over months, not days.\n\nCan I get the exact same character twice?\nNo. MJ doesn\'t have character memory. You can get close through detailed prompts and seeded variations, but not pixel-identical. Plan for "same design language" not "same render."\n\nShould I use an existing character as the reference image?\nOnly for style extraction, not character copying. Uploading a screenshot of an anime character and asking MJ to copy it is copyright territory. Using it to anchor "I want this art style for an original character" is standard practice.\n\nWhat if my character keeps drifting toward a different style?\nYour style keywords are probably not specific enough. "Anime" is extremely broad. "Chibi with 2-head-height proportions, large eyes relative to face, rounded shapes, flat cel shading" is specific. Add more architectural descriptors, fewer aesthetic adjectives.\n\nHow do I handle the same character in different poses or scenes?\nGenerate a "reference sheet" generation first: front view, side view, expression sheet on one canvas. Then use that as your image reference for scene-specific generations.',
        type: 'prose',
      },
    ],
    related: ['midjourney-fundamentals', 'ai-image-limitations', 'image-generation-tools', 'ai-slop-detector-expanded'],
  },
  {
    id: 'ai-image-limitations',
    title: 'what AI image generation can not do (yet)',
    subtitle: 'the real failure modes and how to route around them',
    category: 'tools',
    difficulty: 'beginner',
    description: 'Honest breakdown of what AI image generators consistently fail at: text, hands, consistency, precise control, and photorealism. Plus practical workarounds for each.',
    keywords: ['ai image limitations', 'midjourney problems', 'ai generated images', 'image generation failures', 'generative ai', 'ai art'],
    sections: [
      {
        heading: 'text in images: just don\'t',
        content: 'Every major AI image generator ... Midjourney, DALL-E, Flux, Stable Diffusion ... struggles with rendering legible text inside images. Letters get transposed, words get garbled, fonts get hallucinated. On v7, short words like "Nio" or "OK" sometimes render correctly. Anything longer than 5-6 characters is a coin flip.\n\nWorkaround: generate the image without text. Export it. Add text as a real text layer in Canva, Figma, or Photoshop. This is always the better approach anyway because you can edit, resize, and translate text layers without regenerating the entire image.\n\nThe one exception: stylized lettering where legibility isn\'t the point. "Graffiti-style letters, abstract" as a texture element can work because you\'re not asking the model to produce readable content.',
        type: 'anti-pattern',
      },
      {
        heading: 'hands and fingers: plan around them',
        content: 'Hand rendering has improved significantly in v6 and v7, but it\'s still the most common failure mode in photorealistic or semi-realistic styles. Six fingers, fused digits, hands that don\'t connect to wrists correctly.\n\nIn stylized art (chibi, anime, cartoon), this matters much less because stylized hands are intentionally simplified. A chibi character with mitten-like hands reads as a style choice, not a failure.\n\nFor realistic styles: use --no hands to push the model toward compositions that hide or minimize hands. Design the shot around it. A character holding something behind their back, hands in pockets, arms crossed with fists visible from behind. Photography studios do this anyway for complex shots.\n\nIf you need visible hands: generate several variations, cherry-pick the cleanest result, and fix any remaining issues in Photoshop with generative fill.',
        type: 'anti-pattern',
      },
      {
        heading: 'consistency across frames',
        content: 'AI image generators don\'t have character memory. Generate the same prompt twice and you get two similar but not identical characters. This makes animation from AI stills extremely difficult and makes maintaining a character across a long series of images time-consuming.\n\nThis is why stable diffusion with LoRA fine-tuning exists. You train a small model on your specific character and it produces that character consistently across generations. High ceiling, high effort.\n\nFor Midjourney users: the closest workaround is using an upscaled image of your character as the reference image (--iw 1.5-2.0) for subsequent generations. You\'ll get similar-but-not-identical results. Good enough for a web context where images appear in different sections. Not good enough for sequential frames in a video.\n\nFor animation: treat AI images as concept art, then recreate them in a vector tool or commission a human animator to use them as style guides.',
        type: 'prose',
      },
      {
        heading: 'precise control: AI generates, you composite',
        content: 'You can\'t tell an AI image generator "put the logo in the top-left corner at 200x80 pixels." You can influence composition ("logo in top-left, minimal, white background") but you can\'t control placement precisely.\n\nThe mental model that works: AI is a raw asset generator. The design tool (Figma, Canva, Photoshop) is where you do layout and composition. Never try to do both in the AI.\n\nFor UI mockups: generate background textures, illustration elements, and decorative assets in MJ. Import them as layers. Place UI elements as real layers on top. This workflow produces better results than trying to prompt a full UI mockup.\n\nInpainting (filling a masked region of an image) in tools like Stable Diffusion or DALL-E gives you more surgical control. Midjourney\'s remix mode gets you partway there. But for pixel-precise placement, use a design tool.',
        type: 'pattern',
      },
      {
        heading: 'copyright, licensing, and the uncanny valley',
        content: 'Copyright: on paid Midjourney plans, you own commercial rights to your outputs. The law around AI-generated images is still evolving, but using MJ outputs in commercial projects is generally accepted on paid tiers. Don\'t replicate copyrighted characters or use celebrity likenesses.\n\nLicensing gotcha: if you cancel your subscription and let it lapse, check the terms. Some platforms revoke commercial rights on content generated during a free period.\n\nThe uncanny valley problem: photorealistic AI images often look slightly wrong in a way that\'s hard to articulate but immediately felt. Over-smoothed skin, lighting that doesn\'t quite match physics, eyes that are almost right. This is why stylized art (anime, chibi, illustration, pixel art) often performs better in brand contexts than photorealism ... the stylized aesthetic signals "intentional art direction" rather than "almost-real."',
        type: 'prose',
      },
      {
        heading: 'practical workarounds summary',
        content: 'Text in images ... generate without text, add text layer in Canva or Figma.\n\nHand problems ... use stylized art styles where simplified hands are a feature, or use --no hands and design around it.\n\nCharacter consistency ... use the character\'s upscaled image as a reference with high --iw, accept near-identical rather than pixel-identical.\n\nPrecise placement ... use AI for raw asset generation, composite in a design tool.\n\nPhotorealism uncanny valley ... lean into stylized art: anime, chibi, cel-shaded, pixel art, watercolor. These styles read as intentional rather than almost-real.\n\nCopyright uncertainty ... use paid plan, generate original characters, avoid celebrity likenesses, document your generation workflow.',
        type: 'pattern',
      },
      {
        heading: 'frequently asked questions',
        content: 'Will these limitations be fixed soon?\nText rendering and hands are improving generation over generation. Midjourney v7 is noticeably better than v5 on both. Expect continued improvement but don\'t expect perfection within the next 12-18 months.\n\nCan I fix AI image failures in post?\nYes. Photoshop\'s generative fill, Adobe Firefly, and CleanUp.pictures all let you fix specific regions. For occasional fixes this is fine. If you\'re fixing the same failure every time, redesign the prompt instead.\n\nIs there an AI image tool that handles text reliably?\nNot yet. DALL-E 3 is marginally better than Midjourney on very short text. Ideogram was built specifically for text-in-image generation and is the current leader for legible text, but it has a less polished aesthetic for everything else.\n\nWhy does my realistic character look slightly off even when technically correct?\nThe uncanny valley. Switch to a stylized aesthetic and the problem largely disappears. The "off" feeling is a perception response to near-real rather than a technical failure you can prompt your way out of.',
        type: 'prose',
      },
    ],
    related: ['midjourney-fundamentals', 'character-design-with-ai', 'image-generation-tools', 'design-tools'],
  },

  /* ── AI VOICE AND AUDIO ───────────────────────── */
  {
    id: "elevenlabs-overview",
    title: "elevenlabs for content builders",
    subtitle: "text-to-speech, voice cloning, and audio APIs that actually sound human",
    category: "tools",
    description: "ElevenLabs turns written content into natural-sounding audio. Voice cloning, multilingual support, and an API for building audio into your content pipeline.",
    keywords: ["elevenlabs", "text-to-speech", "voice cloning", "ai audio", "content pipeline", "tts api", "podcast"],
    difficulty: "beginner",
    sections: [
      {
        heading: "what elevenlabs does",
        content: "ElevenLabs is a text-to-speech platform that covers four main capabilities: standard TTS (paste text, get audio), voice cloning (train on your samples), speech-to-speech (convert one voice to another in real time), and sound effects generation from text prompts.\n\nThe flagship use case is TTS that doesn't sound robotic. Five years ago AI voices had this stilted cadence and weird emphasis patterns that made them immediately identifiable as fake. ElevenLabs changed that. The voices breathe naturally, handle punctuation correctly, and can convey actual emotion... not perfect, but close enough that most listeners won't flag it as AI on first listen.\n\nThey currently support 29+ languages from English input text, which matters if you're distributing content internationally.",
        type: "prose"
      },
      {
        heading: "use cases for builders",
        content: "Four concrete use cases worth paying for:\n\n1. Blog post narration. Take a written post, pipe it through the API, embed the audio player at the top. Readers who prefer listening don't leave. This is a real accessibility win, not just a nice-to-have.\n\n2. Product demo voiceover. Record your screen, drop in an ElevenLabs narration track. Faster than waiting for your own schedule to free up for recording.\n\n3. Documentation audio. Knowledge base articles, onboarding flows, tutorial content. These don't need your personal voice ... they need clarity and consistency. AI handles that well at scale.\n\n4. Podcast-style content from written posts. You write a newsletter, the pipeline generates an audio version, you distribute it as a podcast episode. One piece of content, two distribution channels.",
        type: "prose"
      },
      {
        heading: "voice cloning",
        content: "Clone your own voice with about 3-5 minutes of clean audio samples. ElevenLabs takes those samples, builds a model, and from that point your content can have your actual voice even when AI generates the audio.\n\nThe gotcha is sample quality. Background noise, room echo, inconsistent microphone distance ... all of these degrade the clone. Record in a quiet room with a decent USB microphone, speak naturally at a consistent volume, and avoid sentences that end with trailing off. Clear, confident read is what the model learns from.\n\nInstant Voice Cloning (IVC) uses your samples with the base model. Professional Voice Cloning (PVC) takes longer to train but produces a more accurate result. For most builders IVC is good enough. PVC is worth it if the clone is going to represent you publicly on a podcast or YouTube channel.\n\nOne real limitation: emotional range. A cloned voice can sound like you but doesn't capture the full dynamic range of how you actually speak. Excited, frustrated, whispering ... the clone flattens some of that. It's improving, but it's not there yet.",
        type: "prose"
      },
      {
        heading: "the API",
        content: "ElevenLabs has a clean REST API. Pass your text, specify a voice ID, and get back an MP3 or PCM stream. That's enough to build voice into any content pipeline.\n\nBasic call structure:\n\nPOST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}\nHeaders: xi-api-key: your-key, Content-Type: application/json\nBody: { \"text\": \"your content here\", \"model_id\": \"eleven_multilingual_v2\" }\n\nFor real-time streaming, the /stream endpoint lets you start playing audio before the full generation completes. Matters for latency-sensitive use cases like voice interfaces or live demos. Not relevant if you're batch-generating audio files for a blog.\n\nThe API also supports voice settings ... stability, similarity boost, style, speaker boost. Stability higher = more consistent but flatter. Lower = more expressive but variable. For long-form content narration, keep stability around 0.7-0.8 or you'll get weird energy spikes mid-paragraph.",
        type: "prose"
      },
      {
        heading: "pricing and limits",
        content: "The free tier gives you 10,000 characters per month. That's roughly 5-7 minutes of audio. Good for testing, not enough for production.\n\nCreator tier ($22/month) gives 100,000 characters. A 1,500-word blog post is around 8,000 characters ... so you're getting about 12 posts per month. If you're generating audio for more than that, the Independent Publisher or Growing Business tiers scale to 500K and 2M characters.\n\nThe main constraint is characters, not minutes. Long-form content with simple vocabulary burns fewer characters than short-form with lots of technical terms and proper nouns.\n\nOne thing to watch: the multilingual v2 model costs more characters than the English-only v1 model. If you're only doing English content, stick with v1 or the turbo variants unless you specifically need the quality improvement.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Can I use ElevenLabs audio commercially? Yes, on paid tiers. The free tier restricts commercial use. Check the current terms because they update these policies.\n\nHow does ElevenLabs compare to Google TTS or Amazon Polly? More natural sounding, higher cost. Polly is cheaper and easier to scale but the voices are noticeably more robotic. If voice quality is part of your product experience, ElevenLabs is worth the premium.\n\nWill it mispronounce technical terms? Yes, sometimes. Acronyms, product names, and domain jargon get mispronounced. You can add pronunciation guides in the settings, or use SSML tags to phonetically spell out problem words. Always listen before publishing.\n\nDoes it work for languages other than English? The multilingual v2 model supports 29+ languages and handles code-switching (mixing languages mid-sentence) reasonably well. Quality varies by language. Spanish and French are excellent. Less common languages are more hit-or-miss.",
        type: "prose"
      }
    ],
    related: ["voice-in-content-pipelines", "super-whisper-for-content", "content-os-full-stack", "content-skills"]
  },

  {
    id: "voice-in-content-pipelines",
    title: "building voice into your content system",
    subtitle: "the pipeline from written draft to published audio without doing it manually each time",
    category: "workflows",
    description: "How to automate audio generation for your content. Covers batch processing, quality control, combining with video, and when to use AI voice vs your real voice.",
    keywords: ["content pipeline", "elevenlabs api", "audio automation", "voice workflow", "super whisper", "podcast", "content ops"],
    difficulty: "intermediate",
    sections: [
      {
        heading: "the core pipeline",
        content: "The basic flow: written content -> ElevenLabs API -> MP3 file -> hosted and embedded or distributed as podcast episode.\n\nFor a blog-to-audio pipeline, you need three things: a script that reads your post content, an API call to ElevenLabs, and a place to store the resulting MP3. S3 or Cloudflare R2 for storage. Your CMS or site builder for embedding.\n\nThe script looks roughly like this in Python:\n\nimport requests, os\ntext = open(\"post.txt\").read()\nres = requests.post(\n  f\"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}\",\n  headers={\"xi-api-key\": os.environ[\"XI_KEY\"]},\n  json={\"text\": text, \"model_id\": \"eleven_monolingual_v1\"}\n)\nopen(\"output.mp3\", \"wb\").write(res.content)\n\nThat's the whole thing. You wrap that in whatever automation you already have, whether it's a GitHub Action, a cron job, or a build step.",
        type: "prose"
      },
      {
        heading: "batch processing",
        content: "One-off generation is fine for occasional posts. For a content operation generating audio regularly, you want batch processing.\n\nBatch approach: queue all posts that don't have audio yet, generate them in sequence (not parallel, to avoid rate limit issues), store results, update your CMS to mark them as having audio available.\n\nThe rate limit on ElevenLabs API is per-second concurrent requests, not per-day volume. So sequential calls with a short sleep between them (0.5-1 second) avoids 429 errors without meaningfully slowing down a batch run.\n\nFor a 30-post backlog, a batch script runs in under 10 minutes and generates audio for everything at once. After that, new posts get audio generated as part of the publish workflow, not as a separate manual step.\n\nCharacter tracking matters in batch mode. Build in a check that logs characters used per run so you can see where you're tracking against your monthly quota.",
        type: "prose"
      },
      {
        heading: "quality control before publishing",
        content: "AI voice needs a human listen before it goes live. This is not optional.\n\nCommon issues to listen for:\n- Technical term mispronunciation (API, SaaS, specific product names like \"Figma\" or \"Supabase\")\n- Incorrect emphasis on compound words or acronyms\n- Awkward pauses mid-sentence from punctuation the model interprets differently than you intended\n- Energy drop at the end of long paragraphs where the model seems to run out of steam\n\nThe fix for most of these is editing the source text rather than the audio. Add commas to control pacing. Spell out acronyms phonetically for the model (\"S-A-A-S\" instead of \"SaaS\"). Break up sentences that are too long.\n\nA full listen on every post takes 3-5 minutes per piece. Spot-checking (first 30 seconds, a middle section, the end) cuts that to 60-90 seconds and catches most issues. Pick your threshold based on how prominent the audio feature is on your site.",
        type: "prose"
      },
      {
        heading: "combining voice with video",
        content: "AI-generated voice as narration track over screen recordings or animations is a workflow that removes one of the hardest constraints in video production: needing to record good audio at the same time as capturing screen content.\n\nThe workflow: capture your screen silently while doing the thing you want to show. Write the narration separately as a script. Generate audio from the script. Drop the audio over the video in your editor and sync.\n\nThis is faster than trying to narrate live because you can iterate on the script without re-recording the screen capture. The script can be shorter or longer than the raw recording ... you adjust pacing in the edit.\n\nOne gotcha: AI voice pacing is consistent and slightly mechanical compared to live narration. When the audio says \"and here you can see...\" but there's a 2-second gap before that thing appears on screen, the sync feels off. Script your narration to match the actual timing of what happens on screen, not just what you want to explain.",
        type: "prose"
      },
      {
        heading: "Super Whisper integration",
        content: "Super Whisper is speech-to-text. You speak messy, it transcribes. ElevenLabs is text-to-audio. You pass clean text, it reads it back.\n\nThe combination: speak a rough draft into Super Whisper while you're walking, cooking, or commuting. Get back a messy transcript. Clean it up in your editor. Pass the cleaned version to ElevenLabs. Publish both the text post and the audio version.\n\nThis is a real workflow for people who think better out loud than at a keyboard. The speaking-to-draft step captures ideas in flow state that keyboard drafting sometimes kills. The AI voice step means you don't have to also record a clean audio read ... which would require setting up a microphone, a quiet environment, and doing multiple takes.\n\nThe friction you're removing: you speak when inspiration hits -> clean text appears -> polished audio gets generated automatically -> both formats published. Three steps that used to require maybe five different sessions collapsed into one continuous flow.",
        type: "prose"
      },
      {
        heading: "real voice vs AI voice",
        content: "The distinction that matters: is this content building a personal relationship or distributing information at scale?\n\nUse your real voice for:\n- LinkedIn video posts where you want people to feel they know you\n- Podcast appearances and interviews\n- Sales calls, demos where you're present\n- Content where authenticity and real-time reaction are the whole point\n\nUse AI voice for:\n- Documentation and knowledge base audio\n- Tutorial narration over screen recordings\n- Content that needs to exist in audio form but isn't a personal brand moment\n- Any content you're generating faster than you could record\n\nThe wrong framing: \"AI voice = lazy.\" The right framing: AI voice at scale gets content to people who prefer listening, in a format they can consume on a commute, without requiring you to block out recording time for every piece of content you publish.\n\nFrequently asked questions:\n\nDoes AI voice hurt SEO? No. The text content is what Google indexes. Audio is supplementary.\n\nWill listeners know it's AI? Some will. Most won't on casual listen. If you're cloning your own voice, it's close enough that the gap is shrinking. Disclosure norms are still forming but leaning toward transparency being standard practice.\n\nHow long should audio versions be? Same length as the content. Don't truncate for audio. If the post is long, the audio is long. Listeners who click play expect the full version.",
        type: "prose"
      }
    ],
    related: ["elevenlabs-overview", "super-whisper-for-content", "recursive-content-flow", "content-os-full-stack"]
  },

  /* ── VIDEO AND GIF CREATION ──────────────────── */
  {
    id: "gif-creation-for-web",
    title: "making GIFs that do not suck (for your site and socials)",
    subtitle: "file size, frame rate, tooling, and the ffmpeg commands you'll actually use",
    category: "tools",
    description: "GIFs still work everywhere that video doesn't. How to create, optimize, and deploy them without blowing up your page load time or getting wrecked by platform compression.",
    keywords: ["gif creation", "animated gif", "ffmpeg", "gifsicle", "web performance", "social media", "screen recording"],
    difficulty: "intermediate",
    sections: [
      {
        heading: "why GIFs still matter in 2025",
        content: "GIFs autoplay everywhere that video doesn't. LinkedIn autoplays GIFs in the feed with no click required. Email clients render GIFs (most video embeds get stripped). Slack previews them inline. Twitter/X treats them as native animations.\n\nThe format is 30 years old and refuses to die because it solves a real problem: showing motion without requiring a video player, audio considerations, or user interaction. For product demos, feature announcements, tutorial snippets, and attention-grabbing feed content, a well-made GIF does the job in a format that works universally.\n\nThe tradeoff: file size and color limitations. A GIF of a gradient-heavy UI can look terrible and weigh 15MB. A GIF of a clean screen recording with flat UI elements can be crisp and under 2MB. Knowing which situations favor GIF and which don't is the whole skill.",
        type: "prose"
      },
      {
        heading: "frame rate and file size",
        content: "12-15 fps is the sweet spot for web GIFs. At 12 fps, motion is smooth enough that the human eye reads it as continuous animation rather than a slideshow. At 24 fps (film rate), file size roughly doubles without a perceptible quality improvement for most content types.\n\nThe math: a 5-second GIF at 24 fps = 120 frames. At 12 fps = 60 frames. Half the data, nearly identical perceived smoothness for UI recordings and product demos.\n\nDimensions matter more than frame rate for file size. A 800px wide GIF at 12 fps is often 3-4x larger than the same content at 480px. Most social platforms display GIFs at 400-600px wide anyway. Exporting at 480px width covers 90% of use cases without the file size penalty of higher resolution.\n\nRule of thumb: target under 5MB for social media GIFs. Under 2MB is better. Over 5MB and platforms will recompress your GIF, which usually makes it look worse than if you'd optimized it yourself.",
        type: "prose"
      },
      {
        heading: "the 256 color limitation",
        content: "GIF supports a maximum of 256 colors per frame. This is not a suggestion, it's a hard technical constraint from the format specification.\n\nWhere this bites you:\n- Gradients: a blue-to-purple gradient that looks smooth at 16 million colors becomes visibly banded at 256 colors. The GIF format tries to approximate the gradient by dithering (alternating pixels of different colors to simulate blending), but this adds noise and file size.\n- Photography and complex imagery: photographs have thousands of subtle color variations. Forcing them into 256 colors produces visible artifacts.\n- Shadows and transparency effects: most macOS UI shadows use semi-transparency over a variable background. GIF's 1-bit transparency (fully transparent or fully opaque, no in-between) makes shadows look harsh or disappear.\n\nWhere this doesn't bite you:\n- Clean UI recordings with flat colors and minimal gradients\n- Terminal/code recordings (text is high contrast, limited palette)\n- Diagrams, flowcharts, and illustrations designed with flat colors\n\nDesign GIFs with their format constraints in mind rather than recording something gradient-heavy and wondering why it looks bad.",
        type: "prose"
      },
      {
        heading: "tools for creation",
        content: "For Mac:\n- Kap (free, open source): records your screen and exports directly to GIF, MP4, or WebM. The GIF export settings let you set frame rate and quality. Simple and reliable. The default settings are usually fine for quick social content.\n- LICEcap (free): older but still solid. Very small footprint. Records a region of your screen to GIF. No bells, no friction.\n\nFor Windows:\n- ScreenToGif (free): screen recorder with a built-in editor. You can trim, add captions, adjust frame timing, and optimize before export. More features than you need for most use cases but good for precise control.\n\nFor converting existing video to GIF:\nffmpeg is the most reliable option. Two-step command that produces a properly optimized palette:\n\n# Step 1: generate color palette\nffmpeg -i input.mp4 -vf \"fps=12,scale=480:-1,palettegen\" palette.png\n\n# Step 2: use palette to generate GIF\nffmpeg -i input.mp4 -i palette.png -vf \"fps=12,scale=480:-1,paletteuse\" -loop 0 output.gif\n\nThe two-step approach with a palette file produces significantly better color quality than the single-command version. Takes 10 extra seconds, worth it every time.",
        type: "prose"
      },
      {
        heading: "optimization with gifsicle",
        content: "Always optimize before deploying. gifsicle is a command-line tool that can reduce GIF file size by 30-60% without visible quality loss by removing redundant frame data and optimizing the color tables.\n\nInstall on Mac: brew install gifsicle\n\nBasic optimization command:\ngifsicle -O3 --lossy=80 input.gif -o output.gif\n\nThe -O3 flag applies the most aggressive lossless optimization (reorders frames for smaller delta). The --lossy=80 flag applies lossy compression similar to JPEG (80 is a good default, lower = smaller file but visible artifacts, higher = less savings). On a 10MB raw GIF this often produces a 4-6MB output with no visible quality difference.\n\nFor batch optimization of a folder:\nfor f in *.gif; do gifsicle -O3 --lossy=80 \"$f\" -o \"${f%.gif}_opt.gif\"; done\n\nRun gifsicle after exporting from any tool, before you upload anywhere. Platforms compress on top of whatever you give them, so starting smaller means ending up with a better result after their compression pass.",
        type: "pro-tip"
      },
      {
        heading: "GIF vs MP4 vs WebP animated",
        content: "GIF: universal compatibility, large file size, limited colors. Use when you need it to work everywhere including email.\n\nMP4 (autoplay muted loop): 10-15x smaller than equivalent GIF, full color, but requires a video player and browser support for autoplay. Use for web pages where you control the embedding. Many builders use the pattern of displaying a looping muted MP4 instead of a GIF on their own site, then exporting actual GIFs specifically for social and email.\n\nAnimated WebP: smaller than GIF, better color than GIF, but not supported in all email clients or older browsers. Use when you're confident in your audience's browser stack.\n\nThe practical workflow for most builders: export MP4 from your recording tool, use it directly on your site (as a video element with autoplay muted loop), convert to GIF with ffmpeg when you need the format for social media or email, optimize the GIF with gifsicle before uploading.\n\nFrequently asked questions:\n\nWhy does my GIF look great locally but terrible on LinkedIn? LinkedIn recompresses GIFs on upload. Starting with a well-optimized GIF (gifsicle) gives the platform better source material to work with. Also stay under 5MB ... larger files trigger more aggressive compression.\n\nCan GIFs have transparent backgrounds? Yes, but only 1-bit transparency. Pixels are either fully transparent or fully opaque. No feathered edges, no drop shadows with soft falloff. Design your GIF content with solid backgrounds if you need edge quality.\n\nWhat's the max GIF dimensions for Twitter/X? Twitter accepts GIFs up to 15MB and 1280x1080 pixels. Practically, staying under 5MB and under 720px wide produces the best feed results after their compression.",
        type: "prose"
      }
    ],
    related: ["gif-creation-for-web", "video-editing-tools", "programmatic-video-content", "design-tools"]
  },

  {
    id: "video-editing-tools",
    title: "video editing for builders who are not video editors",
    subtitle: "the minimum viable video toolkit to ship product demos, clips, and social content",
    category: "tools",
    description: "You need to edit video sometimes. Here's which tools to use for which jobs, the builder workflow for a 60-second clip, and where AI actually helps vs where it falls short.",
    keywords: ["video editing", "veed", "capcut", "davinci resolve", "canva video", "screen recording", "content production"],
    difficulty: "beginner",
    sections: [
      {
        heading: "the actual bar you need to clear",
        content: "You are not trying to become a video editor. You are trying to ship product demos, record feature walkthroughs, clip longer recordings into social posts, and occasionally explain something visually that would take paragraphs to write.\n\nThe bar for builder video is: clear, watchable, and under 2 minutes. That's it. Nobody is grading your color grading or your b-roll transitions. They want to understand the thing you're showing them.\n\nThis means your tool selection should optimize for speed and minimal friction, not maximum features. A video that takes 45 minutes to edit in Adobe Premiere and 15 minutes to edit in VEED is the same video to your audience. Ship the 15-minute version.",
        type: "prose"
      },
      {
        heading: "VEED: browser-based and good enough for most things",
        content: "VEED is a browser-based video editor. Upload your recording, trim clips, add subtitles, resize for different platforms, export. No install, no project files, no complicated timeline.\n\nWhat it's genuinely good at:\n- Auto-subtitles: upload video, click auto-subtitle, get captions in under a minute. Accuracy is around 90-95% for clear speech. Better than YouTube's auto-captions for most accents. This alone saves hours if you caption everything.\n- Resizing for platforms: one click to resize a 16:9 recording to 9:16 for Reels or TikTok, with auto-repositioning.\n- Simple cuts and trims: removing dead air from the start and end, cutting out the section where you paused to think for 8 seconds.\n\nWhere it fights you:\n- The free tier adds a watermark. If you're publishing anything to clients or under your brand, you need a paid plan ($18/month starter).\n- Precise frame-level edits are painful. If you need to cut exactly between two words without losing a syllable, VEED's timeline can be finicky. Experienced this firsthand trying to fix a mispronounced word in an intro... ended up re-recording the intro rather than making the edit work.\n- Large files (over 1GB) can be slow to upload and process.\n\nVerdict: correct tool for 80% of builder video needs. Subtitle, trim, export, done.",
        type: "prose"
      },
      {
        heading: "CapCut: free and the best for short-form",
        content: "CapCut is free, has no watermark on standard exports, and is optimized for TikTok-style vertical video. It's the tool to know if you're posting Reels, TikToks, or YouTube Shorts.\n\nAuto-captions are solid and styled well out of the box ... the animated word-by-word captions that TikTok popularized are a native feature, not a workaround. This matters because that caption style consistently drives higher watch time on short-form platforms.\n\nThe desktop version exists and works, but CapCut is primarily a mobile editing experience and it shows. The desktop UI is less intuitive than VEED for someone used to desktop software.\n\nBest use: you recorded something on your phone or have a clip you want to turn into a vertical social post. Start and finish in CapCut. Don't fight the tool's primary use case by trying to do horizontal 16:9 work in it.\n\nOne concrete limitation: if you want to export at higher than 1080p, you need a paid plan. For social media distribution, 1080p is fine. For anything going on your actual website or a presentation, you might want the headroom.",
        type: "prose"
      },
      {
        heading: "Canva video and DaVinci Resolve",
        content: "Canva video: if you're already in Canva for graphics, the video editor works for branded social clips and simple animations. The strength is brand consistency ... your fonts, colors, and brand kit carry over from graphics work into video without setup. Weakness is the timeline is basic and long-form editing is frustrating. Use it for 15-30 second branded clips, not for editing a 5-minute demo.\n\nDaVinci Resolve: this is the free pro-grade option. Color grading, advanced effects, multi-track audio, precision editing, Fusion for motion graphics. It's genuinely professional software that Hollywood editors use.\n\nWhy most builders shouldn't start here: the learning curve is steep and the interface is complex. You can spend an hour learning the tool instead of shipping the video. The payoff is worth it if you're doing high-volume video production where quality matters at every frame. For occasional demos and clips, it's more tool than you need.\n\nThe exception: if you have audio issues (background noise, inconsistent mic levels), DaVinci Resolve's Fairlight audio tab is genuinely the best free option for fixing them. The noise removal is better than anything in VEED or CapCut.",
        type: "prose"
      },
      {
        heading: "the builder video workflow",
        content: "For a 60-second product demo or explainer clip, this workflow takes under 15 minutes:\n\n1. Record screen with OBS (free, works on all OS) or the built-in recorder (Shift+Cmd+5 on Mac). Don't try to be perfect on the first take. Record the whole thing, pause and restart when you fumble, keep going.\n\n2. Open in VEED. Trim the dead air from the start and end. Cut the obvious fumbles. Don't over-edit ... two or three cuts is usually enough.\n\n3. Run auto-subtitles. Fix the words it got wrong (usually 3-5 corrections for a 60-second clip). Lock in the caption style.\n\n4. Export at 1080p. Upload directly from the export, don't re-edit after the fact.\n\nTotal time: 10-15 minutes for a polished-enough clip. The trap is spending 45 minutes perfecting timing and transitions on content that will be watched once and scrolled past. Ship fast, iterate on what resonates.",
        type: "pattern"
      },
      {
        heading: "where AI helps and where it doesn't",
        content: "AI capabilities in video editing are real but narrow.\n\nAI is genuinely useful for:\n- Auto-subtitles (all three tools have this, VEED and CapCut are the best implementations)\n- Background noise removal (DaVinci Resolve Fairlight, also in Adobe tools)\n- Filler word removal ... some tools can identify and cut \"um\", \"uh\", and silence automatically. Descript does this best if you want to add a fourth tool to your stack.\n- Auto-reframe for different aspect ratios (identifies the main subject and keeps it in frame when you change dimensions)\n\nAI cannot:\n- Decide what to cut. It doesn't know which part of your demo is the compelling part and which is you navigating through menus to get to the compelling part.\n- Fix pacing. If your explanation is too slow or too fast, no AI tool adjusts that without sounding unnatural.\n- Make creative decisions about structure, what to show first, what the hook should be.\n\nFrequently asked questions:\n\nDo I need to learn keyboard shortcuts? For VEED and CapCut, no. Spacebar to play/pause, that's enough. For DaVinci Resolve, yes ... keyboard shortcuts are how the pros move 10x faster.\n\nShould I script before recording? For content where you're explaining something complex, yes. For product demos where you're showing a flow, a bullet point outline is enough. Reading from a full script makes delivery feel robotic.\n\nHow important is audio quality? More important than video quality. Viewers will watch blurry footage if the audio is clear. They will leave crisp 4K footage with bad audio within 10 seconds. Get a decent USB microphone ($50-100 range) before you invest in anything else.",
        type: "prose"
      }
    ],
    related: ["gif-creation-for-web", "tiktok-playbook", "programmatic-video-content", "content-os-full-stack"],
  },

  /* ── AI AGENTS FOR CONTENT ────────────────────── */
  {
    id: 'grok-as-scout-agent',
    title: 'why Grok is the best scout agent for social content',
    subtitle: 'Real-time X data makes Grok the research layer your content pipeline is missing.',
    category: 'tools',
    description: 'Grok has live access to X/Twitter data, making it the best tool for scouting trending topics, angles, and questions before you create. Free, fast, and built for the platform.',
    keywords: ['Grok', 'X Twitter', 'content research', 'trending topics', 'AI scouting', 'social intelligence', 'content pipeline'],
    sections: [
      {
        heading: 'what makes Grok different',
        content: 'Most AI models are trained on data with a cutoff date. Grok isn\'t. It has live access to X/Twitter, which means when you ask it what\'s trending in B2B SaaS today, it\'s actually looking at today\'s posts, not data from six months ago.\n\nThat real-time awareness is the whole point. You can ask: "what angles on AI automation are getting engagement right now?" and get an answer grounded in actual current signal, not pattern-matched from stale training data.\n\nFor content creators, this closes a gap that every other AI tool leaves open.',
        type: 'prose'
      },
      {
        heading: 'the scout agent pattern',
        content: 'The mental model: Grok is your research layer, not your publishing layer. Before you create anything, you send Grok in to scout.\n\nAsk it:\n- "What questions are people asking about [topic] on X this week?"\n- "What angles on [topic] are getting the most replies?"\n- "What\'s the current conversation around [competitor or concept]?"\n\nYou take that raw intelligence, filter it through your own perspective, and build content from what you find. The scouting happens in five minutes. The creating still requires you.',
        type: 'pattern'
      },
      {
        heading: 'generating post drafts',
        content: 'Grok drafts posts that are natively formatted for X because it\'s been trained on X content. It understands thread structure, hook patterns, reply dynamics ... the platform\'s rhythm is baked in.\n\nThis doesn\'t mean you post raw Grok output. It means you have a structurally correct draft in 30 seconds and spend your time making it sound like you instead of making it sound like a post.\n\nSpecific prompt that works: "Draft three different X posts about [topic] using the current conversation as context. Keep them under 280 characters. Make them opinionated."',
        type: 'prose'
      },
      {
        heading: 'competitive intelligence without the scroll',
        content: 'You can ask Grok to analyze what\'s working for specific creators or accounts without manually scrolling their feed for an hour.\n\n"What types of posts from [creator] get the most engagement?" gives you a pattern analysis. "What topics does [account] post about that their audience responds to?" gives you content strategy intel.\n\nThis is useful before entering a new niche or before engaging with a community you\'re not deeply embedded in yet. Know the landscape before you post in it.',
        type: 'pattern'
      },
      {
        heading: 'where Grok is weaker',
        content: 'Grok is strongest on X-native content. For LinkedIn drafts, it\'s less effective ... it doesn\'t have the same live data signal for that platform, and the post format norms are different enough that you\'ll spend more time fixing drafts than if you\'d started in Claude or ChatGPT.\n\nFor email, newsletters, or long-form writing, use a different tool. Grok is a scout, not a ghostwriter. The more you try to use it outside its lane, the more you\'ll be editing output that wasn\'t built for your actual context.',
        type: 'anti-pattern'
      },
      {
        heading: 'the full workflow',
        content: 'Step 1: Open Grok. Ask what\'s trending in your niche and what questions are getting traction.\nStep 2: Read the output. Pick 1-2 angles that match something you actually have a perspective on.\nStep 3: Draft your post using those angles as a starting point. Add your experience. Add the specific detail only you would know.\nStep 4: If you want a structural draft, ask Grok to write it ... then rewrite in your voice.\nStep 5: Post. Grok does the research, you supply the substance.',
        type: 'formula'
      },
      {
        heading: 'frequently asked questions',
        content: 'Is Grok free?\nYes. The base version is free with an X account. The real-time search functionality is available without a paid subscription, which makes it accessible for builders who aren\'t ready to pay for five different AI tools.\n\nCan Grok replace a social media manager?\nNo. It can replace the research and first-draft phase. The editorial judgment, the voice, the decision about what\'s worth posting ... that\'s still yours.\n\nHow often should I use Grok to scout?\nBefore any new content series or when entering a new topic. Not for every single post. The goal is awareness, not dependency.\n\nDoes Grok work for niches outside tech?\nYes, but quality varies. For highly technical or niche professional topics it\'s strongest. For very offline or local communities, the X data signal is thinner.',
        type: 'prose'
      }
    ],
    related: ['platform-specific-ai-strategy', 'x-algorithm', 'x-best-practices', 'content-os-full-stack'],
    difficulty: 'beginner'
  },
  {
    id: 'platform-specific-ai-strategy',
    title: 'which AI to use on which platform (the honest breakdown)',
    subtitle: 'The right AI for LinkedIn is wrong for Reddit. Here\'s where each tool actually fits.',
    category: 'tools',
    description: 'Platform-by-platform breakdown of which AI tools work, which fail, and why Reddit will expose AI content faster than anywhere else. No generic advice.',
    keywords: ['AI for LinkedIn', 'AI for Reddit', 'platform AI strategy', 'content tools', 'Grok', 'Claude', 'AI slop', 'Super Whisper'],
    sections: [
      {
        heading: 'LinkedIn: draft with AI, rewrite with your brain',
        content: 'Claude or ChatGPT for structure, you for substance. The workflow: give the AI your raw idea and ask for a post outline or first draft. Take that draft, gut the generic parts, and replace them with the specific thing you actually know ... the project name, the exact number, the outcome that wasn\'t obvious.\n\nTechnical LinkedIn audiences detect AI slop immediately. The tell isn\'t that it\'s AI, it\'s that it\'s nonspecific. "I learned that systems matter more than hustle" is slop. "I cut our onboarding time from 14 days to 3 by killing the welcome email sequence and moving everything into an interactive checklist" is not.\n\nTools like Tapio exist for LinkedIn scheduling. They\'re useful when starting out. But the more you build your own content operating system ... voice rules, templates, automated workflows ... the less you need them. The content just comes out naturally once the system is running.',
        type: 'prose'
      },
      {
        heading: 'X/Twitter: Grok for research, your voice for output',
        content: 'The platform rewards speed and takes. Grok\'s real-time X access gives you signal on what\'s trending right now, which is a structural advantage over any other AI tool for this platform specifically.\n\nThe pattern: Grok scouts the conversation, you post the take. Your post should be short, opinionated, and grounded in something specific. AI can get you to a draft in 30 seconds. You spend the other two minutes making it sound like you and not like a thought leadership template.\n\nDon\'t overthink X. Volume and consistency beat any optimization. One well-reasoned opinion posted daily beats five AI-polished posts per week.',
        type: 'prose'
      },
      {
        heading: 'TikTok: AI for prep, not for content',
        content: 'Your face and camera are the content on TikTok. AI belongs in the prep layer, not in the video itself.\n\nWhere AI helps: loose script outlines (not full scripts ... scripted-sounding delivery kills engagement), hashtag research, trend identification in your niche. CapCut\'s built-in AI features ... auto-captions, background removal, auto-cut on silence ... are the most practically useful AI layer for TikTok creators.\n\nWhere AI hurts: if you\'re reading an AI-written script verbatim, viewers feel it. The delivery goes flat. TikTok rewards authenticity more literally than any other platform because you\'re on camera.',
        type: 'prose'
      },
      {
        heading: 'Reddit: do not use AI for posting, full stop',
        content: 'Reddit communities detect AI content faster than anywhere else. Not because they have special tools ... because they\'re actively suspicious and they read carefully. One AI-sounding paragraph in a 400-word comment and you\'re getting called out in the replies.\n\nThe move for Reddit: Super Whisper. Speak your thoughts naturally, let it transcribe, clean up manually. The content is 100% your words and your thinking. That\'s the difference between AI content and AI-assisted workflow.\n\nNever be an NPC on Reddit. Non-playable character: someone running on a script instead of thinking for themselves. Reddit karma is built on genuine participation and cannot be shortcutted. You need karma before posting in most subreddits. The only way to build it is commenting on posts you actually care about, adding real value, asking genuine questions. No AI post generator will get you there.',
        type: 'anti-pattern'
      },
      {
        heading: 'email and newsletters: AI for structure, you for tone',
        content: 'Email is the most intimate channel. Readers feel when it\'s not you ... not because they can detect AI technically, but because the warmth and specificity of a real person writing to them is distinctive.\n\nUse Claude to break blank page paralysis: paste in your rough notes and ask for a draft. Then rewrite almost everything. Keep the structure, kill the generic sentences, add back in the personal detail.\n\nThe test: would you say this to a specific person you know? Email should pass that test. AI drafts usually don\'t on first pass.',
        type: 'prose'
      },
      {
        heading: 'the VA + AI anti-pattern',
        content: 'Hiring a VA to run AI tools and reviewing the output is where most content goes generic and stays generic. The content looks the same because it is the same ... same prompts, same output patterns, same LinkedIn commenting templates.\n\nThe worst offender: the "great point, [rephrasing what they said]" comment format. That\'s the fingerprint of someone running ChatGPT on other people\'s posts to generate engagement. Every technical person on LinkedIn recognizes this pattern immediately.\n\nIf you\'re using a VA, have them speak their response to a voice memo first, then transcribe and clean. The one test that matters: does it sound like a specific human made a specific observation? Not "does it pass an AI detector" ... those tools are unreliable. Does it sound human? That\'s the only metric.',
        type: 'anti-pattern'
      },
      {
        heading: 'building your own OS vs. depending on tools',
        content: 'Fiverr, Tapio, Later.com, Buffer ... they have a real place when you\'re starting out and need scaffolding. Use them. But they\'re training wheels, not a destination.\n\nThe shift happens when you internalize enough about voice, platform rhythm, and your own content patterns that the system runs through you rather than around you. At that point you\'re not drafting anymore in the traditional sense. You have hundreds of drafts, notes, half-formed ideas ... and the content just surfaces naturally through the recursive process you\'ve built.\n\nThat\'s the real operating system. Not the tools. The version of yourself that has published enough to know exactly what resonates, why, and how to produce more of it.',
        type: 'prose'
      },
      {
        heading: 'frequently asked questions',
        content: 'Can I use the same AI for every platform?\nTechnically yes. Strategically no. Platform norms are different enough that a LinkedIn draft sounds wrong on X and a Reddit comment sounds wrong in a newsletter. Match the tool to the platform\'s actual content patterns.\n\nIs it okay to use AI at all on Reddit?\nFor research, yes. For transcription via Super Whisper, yes. For drafting your actual post or comment, no. The community will notice.\n\nHow much should I edit AI output?\nEnough that no specific sentence is verbatim AI unless it was already perfect. Rule of thumb: if you can\'t remember why you wrote a specific sentence, it\'s probably AI output you didn\'t properly edit.\n\nDo AI detectors work?\nNot reliably enough to depend on them, in either direction. Don\'t use them to "clear" your content. Just write like a human.\n\nWhat\'s the fastest path to building my own content OS?\nPublish consistently for six months using AI as a draft layer. Track what you actually had to rewrite every time. Those rewrites are your voice rules.',
        type: 'prose'
      }
    ],
    related: ['grok-as-scout-agent', 'super-whisper-for-content', 'ai-slop-guide', 'content-os-full-stack', 'commenting-strategy', 'favikon-overview'],
    difficulty: 'intermediate'
  },
  {
    id: 'super-whisper-for-content',
    title: 'Super Whisper is the most underrated content tool',
    subtitle: 'Speak your ideas, get a transcript, edit it into content. No blank page required.',
    category: 'tools',
    description: 'Super Whisper transcribes speech locally on Mac with no cloud processing. For builders who think faster than they type, it removes blank-page paralysis from the entire content workflow.',
    keywords: ['Super Whisper', 'speech to text', 'voice transcription', 'content creation', 'Mac tools', 'Reddit content', 'voice-first workflow'],
    sections: [
      {
        heading: 'what Super Whisper actually is',
        content: 'Super Whisper is a macOS app that transcribes your speech to text locally on your device. No audio sent to a server. No account required to process your voice. The model runs on your Mac.\n\nIt\'s not Siri dictation. It\'s not Otter.ai. It\'s a fast, accurate transcription tool that runs in the background with a keyboard shortcut to start and stop. Hold the key, talk, release ... and your words appear wherever your cursor is.\n\nThe local processing matters for two reasons: speed and privacy. You get near-instant transcription without latency from a round-trip to a cloud API, and nothing you say goes anywhere.',
        type: 'prose'
      },
      {
        heading: 'why it matters if you build for a living',
        content: 'Your brain runs faster than your fingers. This is the core problem with most content workflows ... by the time you\'ve typed out the first paragraph, you\'ve already lost three other ideas you had while typing.\n\nSpeaking eliminates that gap. You can brain-dump at actual thought speed. A 10-minute voice session produces 1,200 to 1,800 words of raw material ... more than enough for a week of posts, a newsletter draft, or documentation that used to take a full afternoon.\n\nThe edit from a transcript is fundamentally different from writing from scratch. You\'re cutting and shaping, not generating. For most builders, that\'s dramatically faster.',
        type: 'prose'
      },
      {
        heading: 'where it fits in the content workflow',
        content: 'The loop: speak your idea ... Super Whisper transcribes ... you edit the transcript into whatever you\'re publishing.\n\nSpecific use cases that work well:\n\nReddit comments: speak your response to a post naturally, the way you\'d explain it to someone in person. Transcribe. Clean up filler words and false starts. Post. This is the highest-quality Reddit content workflow that doesn\'t get you called out for AI.\n\nLong-form drafts: 10-minute brain dump on a topic you know well gives you 1,500+ words to work with. Better than staring at a blank doc.\n\nSlack explanations: for complex technical explanations in async channels, speaking is faster and usually clearer than typing.\n\nDocumentation: speak the workflow as you\'re doing it, transcribe, clean. Faster than writing docs after the fact.',
        type: 'pattern'
      },
      {
        heading: 'the Reddit connection specifically',
        content: 'Reddit is the one platform where AI-drafted content gets detected and punished most aggressively. Communities are suspicious, read carefully, and will call you out in replies.\n\nSuper Whisper is the bridge. It\'s technically AI-powered transcription ... Whisper is an OpenAI model ... but the content is 100% your words and your actual thinking. You\'re not generating ideas with AI. You\'re converting your voice to text.\n\nThat distinction matters. Reddit doesn\'t hate AI-assisted workflows. It hates AI-generated opinions that nobody actually holds. Speak your real take, transcribe it, clean it up ... and you have authentic content that passes every human test because it is human.',
        type: 'pro-tip'
      },
      {
        heading: 'voice-first beats blank page every time',
        content: 'Writer\'s block is almost exclusively a text-first problem. Very few people get "talker\'s block." You don\'t freeze up when someone asks you to explain something you know ... you just explain it.\n\nSuper Whisper applies that to content creation. Instead of "what should I write about X," you ask yourself "how would I explain X to someone who\'s learning it?" Then you talk for three minutes. Then you edit.\n\nThe shift from generation to editing changes the emotional experience of content creation. Editing feels like progress. Staring at a blank text field feels like failure.',
        type: 'prose'
      },
      {
        heading: 'setup and real limitations',
        content: 'Setup: download from superwhisper.app, install, set your keyboard shortcut for push-to-talk or toggle. Runs in the menu bar. Supports multiple languages. Works system-wide wherever your cursor is.\n\nActual limitations you\'ll hit:\n\nMac only. No Windows or Linux version. If you\'re not on Mac, this tool doesn\'t exist for you yet.\n\nMic quality matters. Built-in MacBook mic works. External mic or AirPods Pro is noticeably better for accuracy, especially in noisy environments.\n\nTranscription is literal. Filler words ("um," "like," "you know") come through. False starts come through. You need to edit the transcript, not just paste it. Budget 20-30% of your speaking time for cleanup.\n\nYou still have to think. Super Whisper transcribes whatever you say. If you ramble without a point, you get a rambling transcript. The tool removes the text-entry bottleneck, not the thinking bottleneck.',
        type: 'anti-pattern'
      },
      {
        heading: 'frequently asked questions',
        content: 'Is it really private? Nothing leaves my device?\nYes. The Whisper model runs locally. No audio is sent to a server. This is different from most transcription services.\n\nDoes it work for non-English languages?\nYes. Whisper supports 99 languages with varying accuracy. English is strongest. Other major languages are reliable. Less common languages may have more errors.\n\nHow long does it take to get accurate transcriptions?\nImmediately, no training required. Unlike older voice dictation tools, Whisper doesn\'t need to learn your voice. It works well out of the box for most speakers.\n\nCan I use this on my phone?\nNot directly. Super Whisper is Mac-only. There are iOS apps built on Whisper but they\'re separate products with different privacy models.\n\nIs this better than just using ChatGPT to write my Reddit comments?\nCompletely different category. ChatGPT generates content that didn\'t come from you. Super Whisper transcribes content that did. The result is your actual thinking in text form, which is what Reddit communities are actually looking for.',
        type: 'prose'
      }
    ],
    related: ['platform-specific-ai-strategy', 'grok-as-scout-agent', 'voice-in-content-pipelines', 'reddit-strategy'],
    difficulty: 'beginner',
  },

  /* ── ANALYTICS AND ALGORITHM INTELLIGENCE ────── */
  {
    id: "favikon-overview",
    title: "favikon is how you see what the algorithm sees",
    subtitle: "Creator analytics and ranking platform that turns social presence into a single score brands actually use.",
    category: "tools",
    description: "Favikon aggregates your LinkedIn, X, TikTok, Instagram, and YouTube presence into one creator score. Here's how to read it and use it.",
    keywords: ["favikon", "creator score", "influence score", "creator analytics", "category ranking", "campaign value", "cross-platform analytics"],
    difficulty: "beginner",
    sections: [
      {
        heading: "what favikon actually is",
        content: "Favikon is a creator analytics platform that aggregates your social presence across LinkedIn, X, TikTok, Instagram, and YouTube into a single creator profile. It's not a scheduling tool or a growth hack. It's a visibility layer ... brands, recruiters, and partnership teams use it to evaluate creators before reaching out.\n\nWhen someone searches for creators in a category, Favikon is often how they find and vet you. Your Favikon profile is a public-facing summary of your social footprint whether you've claimed it or not. Claiming it gives you control over which platforms are connected and which category you rank in.",
        type: "prose"
      },
      {
        heading: "the influence score (and what moves it)",
        content: "Favikon scores creators out of 100 based on a mix of signals: engagement quality, follower count, content frequency, and cross-platform presence. The score isn't public in methodology but the levers are observable.\n\nEngagement quality matters more than raw follower count. A creator with 5K followers and a 4% engagement rate will often outscore one with 20K followers and 0.3% engagement. Consistency is scored too ... posting twice a week for three months moves the needle more than a viral post followed by silence.\n\nThe score is what brands look at when filtering creator lists. At 6-7K followers with strong engagement, expect a score in the 65-75 range depending on category. That range typically unlocks partnership conversations.",
        type: "prose"
      },
      {
        heading: "category rankings and why the category choice is the strategy",
        content: "Favikon lets you rank within a category. Common ones: Sales and Marketing, Lead Generation, Growth, Entrepreneurship, Technology. Your global and country rank within that category is what shows on your profile.\n\nThe category you choose determines who you're competing against and what ranking is achievable. \"Sales and Marketing\" is crowded with every marketing influencer on the planet. \"Lead Generation\" or \"B2B Growth\" might have fewer creators but much better alignment if your content is tactical and demand-gen focused.\n\nSwitching from \"Sales and Marketing\" to \"Lead Generation\" can move your rank from 8,000th globally to 2,000th with zero new posts ... just better alignment between content and category. Check what your top posts are actually about, then pick the category that matches the content you already make.",
        type: "pattern"
      },
      {
        heading: "estimated campaign value",
        content: "Favikon estimates what a sponsored post on your profile is worth. At 6-7K LinkedIn followers with above-average engagement, the estimate typically lands around $400-600 per post. At 15K+ with consistent content, that range moves to $1,200-2,500.\n\nThese numbers aren't what brands necessarily pay, but they set a floor for negotiation. If a brand offers $50 for a post and Favikon estimates your value at $500, you have data to push back with.\n\nThe estimates factor in platform, follower count, engagement rate, and content niche. LinkedIn posts are valued higher than X posts at the same follower count because the professional audience commands higher CPMs in brand budgets.",
        type: "prose"
      },
      {
        heading: "connecting platforms (and when not to)",
        content: "Favikon combines connected platforms into one profile score. The aggregation can help or hurt depending on what you connect.\n\nIf a connected platform has strong engagement relative to followers, connect it ... it adds positive signal. If a platform has low followers AND low engagement (like a TikTok account you started but didn't stick with), wait to connect until you have traction. A 200-follower TikTok with 1% engagement can pull your overall profile score down.\n\nThe rule: connect platforms where your engagement rate is above 2%. Disconnect or don't connect platforms where you're still building. You can always add them later when the numbers improve.",
        type: "pro-tip"
      },
      {
        heading: "using favikon for competitor analysis",
        content: "Search any creator or brand in Favikon to see their score, engagement rate, posting frequency, and top-performing content themes. This isn't about copying anyone ... it's about understanding what the algorithm rewards in your category.\n\nIf the top 10 creators in \"B2B Growth\" are posting 4x per week on LinkedIn and averaging 3.2% engagement, that's your calibration point. If they're all using document posts and carousels, the algorithm is signaling format preference.\n\nCheck your top competitors monthly. When their score drops, look at what changed in their posting behavior. When it rises, look at what they did differently. The pattern over time is more valuable than any single data point.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Do I need to pay for Favikon to see my score?\nA: Basic profile and score visibility is free. Advanced analytics, competitor tracking, and campaign value estimates are behind a paid plan. Start free, upgrade when you're actively pursuing brand partnerships.\n\nQ: How often does Favikon update scores?\nA: Typically every few days to once a week depending on account tier. Don't check daily ... check weekly and look for directional trends.\n\nQ: Can I game the Favikon score?\nA: Not sustainably. The score reflects actual engagement. Buying followers tanks your engagement rate. Pod activity can inflate short-term but the system accounts for engagement quality over time.\n\nQ: What if Favikon has my profile wrong?\nA: Claim your profile and correct it. Categories, connected platforms, and profile info are all editable after claiming.",
        type: "prose"
      }
    ],
    related: ["algorithm-literacy", "linkedin-playbook", "x-algorithm", "content-pillars"]
  },

  {
    id: "algorithm-literacy",
    title: "understanding how algorithms read your content",
    subtitle: "Every platform uses ML to decide who sees your posts. knowing the signals is the competitive edge.",
    category: "platforms",
    description: "LinkedIn, X, TikTok, Reddit all use different algorithmic signals. Understanding what each platform rewards lets you post smarter without gaming the system.",
    keywords: ["algorithm", "engagement signals", "dwell time", "LinkedIn algorithm", "TikTok algorithm", "Reddit algorithm", "content distribution"],
    difficulty: "intermediate",
    sections: [
      {
        heading: "what the algorithm is actually doing",
        content: "Every major social platform runs an ML model that decides how widely to distribute your content. The model is trained on what keeps users on platform longest and coming back most often. When your content produces those outcomes, the algorithm distributes it more. When it doesn't, distribution stops.\n\nUnderstanding this changes how you think about posting. You're not trying to trick the algorithm. You're trying to produce content that genuinely keeps people engaged ... which turns out to be the same thing as producing good content. The overlap between \"what algorithms reward\" and \"what audiences actually want\" is larger than most creators think.",
        type: "prose"
      },
      {
        heading: "LinkedIn algorithm signals",
        content: "LinkedIn's distribution model weights these signals in roughly this order:\n\nDwell time: how long someone stops scrolling on your post. A 600-word post with a strong hook that people read fully beats a 100-word post that people scroll past in two seconds. LinkedIn can detect when someone pauses versus when they skip.\n\nEarly engagement velocity: comments in the first 60-90 minutes after posting have outsized impact. LinkedIn interprets early engagement as a quality signal and widens distribution in response. This is why posting when your audience is online matters more than most other timing advice.\n\nComment depth: replies to comments (threaded discussions) signal richer engagement than single comments. Responding to every comment in your first hour isn't just good manners ... it's algorithmic fuel.\n\nPosting cadence: LinkedIn rewards accounts that post consistently. Going from 3x per week to 1x per week signals lower priority and distribution drops. Going from 0 to 3x signals new activity and can get an early boost.",
        type: "pattern"
      },
      {
        heading: "X/Twitter algorithm signals",
        content: "X's algorithm changed significantly with the Elon-era changes but the core engagement signals remain: engagement rate relative to follower count, reply thread depth, retweet and quote velocity, and topic relevance to follower interests.\n\nX rewards accounts that generate conversation, not just consumption. A tweet with 50 replies and 20 retweets on an account with 2K followers will get broader distribution than a tweet with 200 likes and 5 replies on an account with 10K followers. The ratio matters more than the raw number.\n\nX also rewards Premium subscribers with additional distribution ... this is a documented algorithmic boost, not speculation. Long-form posts (the \"article\" format) are being pushed by X as a platform feature and get algorithmic support as a result.\n\nEngagement rate on your last 10-20 posts affects how the next post is initially seeded. Consistent 2%+ engagement keeps the baseline distribution high.",
        type: "pattern"
      },
      {
        heading: "TikTok algorithm signals (the watch time model)",
        content: "TikTok's algorithm is the most transparent in terms of what it rewards: watch time percentage. If people watch 80% of your video on average, TikTok distributes it aggressively. If they watch 20%, distribution stops after the initial seed.\n\nThe critical difference from every other platform: TikTok does not care about your follower count for initial distribution. Every video gets seeded to a test group of 200-500 users regardless of whether you have 100 or 100,000 followers. Watch time in that test group determines whether it gets pushed to a larger pool.\n\nReplay rate is the second-biggest signal. Videos people rewatch signal high value. This is why short, dense, replayable content does well on TikTok even when longer videos perform better on LinkedIn.\n\nShares push TikTok distribution harder than any other interaction. A video shared to someone's DMs counts. A video saved to a collection counts. These off-platform signals tell TikTok the content has real value beyond passive entertainment.",
        type: "pattern"
      },
      {
        heading: "Reddit algorithm and why it's different",
        content: "Reddit's algorithm is the most anti-manipulation system of the major platforms. It weights upvote/downvote ratio, comment velocity, community karma, and account age ... but it also actively penalizes suspected bot behavior and cross-posting patterns that look like coordinated promotion.\n\nReddit users, not the algorithm, are the primary gatekeepers. Post something that feels promotional or AI-generated in a subreddit and the downvotes come fast. The algorithm then deprioritizes the post and sometimes the account. This is different from every other platform where bad content just doesn't get distribution ... on Reddit, bad content can actively hurt your standing.\n\nThe account age and karma system means you can't just create an account and start posting self-promotional content. Subreddits track account age and karma minimums. r/entrepreneur requires 30+ days account age and positive karma to post. Building Reddit presence is a 3-6 month project, not a week.",
        type: "pattern"
      },
      {
        heading: "favikon as a weekly algorithm feedback loop",
        content: "Your Favikon score and category ranking change weekly based on engagement trends. Treating it as a weekly check-in creates a feedback loop: post, check score movement, identify what changed, adjust.\n\nScore dropped? Look at your engagement rate from the past two weeks. Usually it's a dip in comment volume or posting frequency. Score rose? Find which posts drove above-average engagement and look for the pattern ... was it the format, the topic, the time of day?\n\nFavikon also shows your engagement rate trend over time, not just the current number. A rising engagement rate even at lower follower count signals to both the algorithm and the Favikon score that your content is improving. That's the metric worth tracking more than follower count in the first 6-12 months.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Should I use pods (engagement groups) to boost early engagement?\nA: Pods can trigger the early engagement signal on LinkedIn but the quality signal matters too. Irrelevant comments from pod members don't generate replies or dwell time, which limits the downstream boost. Genuine peer networks where members actually read and comment are more effective and lower risk.\n\nQ: Do platform-native formats actually get algorithmic boosts?\nA: Yes, documented on LinkedIn (newsletters, document posts) and TikTok (trending sounds, duet/stitch). Platforms want adoption of new features and reward early users with distribution. Not permanent, but real.\n\nQ: How often should I post to each platform?\nA: LinkedIn: 3-5x per week for growth, 1-2x to maintain. X: daily or near-daily. TikTok: 5-7x per week minimum for growth phase. Reddit: 2-3x per week per relevant subreddit, never pure self-promotion.\n\nQ: Does posting time matter?\nA: Less than consistency, more than most people think. LinkedIn peaks 7-9am and 12-1pm in your audience's primary timezone. TikTok is more forgiving because of how it seeds content to test groups. Reddit varies heavily by subreddit.",
        type: "prose"
      }
    ],
    related: ["favikon-overview", "linkedin-playbook", "x-algorithm", "tiktok-playbook", "reddit-strategy"]
  },

  /* ── CONTENT OS ──────────────────────────────── */
  {
    id: "content-os-full-stack",
    title: "the content OS tool stack (what we actually use and why)",
    subtitle: "Every tool in the stack creates, distributes, or measures content. if it doesn't do one of those, it doesn't belong.",
    category: "workflows",
    description: "The full tool stack behind an AI-native content operation: AI layer, creation layer, distribution layer, analytics, and infrastructure. What each tool does and why it's in the stack.",
    keywords: ["content OS", "tool stack", "Claude Code", "Cursor IDE", "content automation", "creator tools", "AI content workflow"],
    difficulty: "intermediate",
    sections: [
      {
        heading: "the AI layer",
        content: "Claude is the primary AI for long-form writing, code generation, system design, and anything requiring sustained reasoning. The context window and instruction-following make it reliable for complex workflows that can't afford hallucinations.\n\nChatGPT handles project organization, API integration brainstorming, and quick iterative tasks. The project memory feature is useful for storing persistent context that doesn't need to be rebuilt each session.\n\nGrok is the social scout. It has real-time X access and a personality that's calibrated for understanding what's actually trending versus what just looks like it's trending. Use it to monitor what conversations are happening before writing takes on a topic.\n\nMidjourney handles character art and brand visuals. The Nio character and brand visual system were built in Midjourney. ElevenLabs handles voice generation when audio content is in the pipeline. The quality gap between ElevenLabs and other TTS tools is still significant.",
        type: "prose"
      },
      {
        heading: "the creation layer",
        content: "Cursor IDE is an AI-native code editor with inline completions, codebase-aware chat, and debugging. It's where interactive building happens ... when you want to write code alongside AI explanation and iteration.\n\nClaude Code CLI is the automated layer. It runs as an agent in your terminal, reads your entire repo, writes code, runs tests, and commits. The nightly cron pipeline uses Claude Code to run automated content builds and repo management while you sleep. It's the difference between AI as a tool you use and AI as a system that runs.\n\nSuper Whisper is voice-to-text drafting. Talking through a post idea and editing the transcript is 3-4x faster than writing from scratch for most people. The quality of modern voice recognition means transcript cleanup takes under a minute for a 500-word post.\n\nCanva handles quick graphics and social templates. VEED does video editing and auto-subtitles for longer content. CapCut is TikTok and Reels specific ... the built-in template library and trending audio integration are worth the context switch from a more general editor.",
        type: "prose"
      },
      {
        heading: "the distribution layer",
        content: "LinkedIn is the primary platform. 6.7K+ followers, long-form tactical content, 3-5x per week cadence. The audience skews B2B decision-makers and practitioners which makes it the highest-value distribution channel for any business-adjacent content.\n\nX is an expanding channel for short-form takes and real-time commentary. The strategy is complementary to LinkedIn, not competitive ... LinkedIn for depth, X for speed and conversation.\n\nTikTok is video-first builder content. The platform's algorithm doesn't punish low follower count the way LinkedIn does, so it's a viable growth channel even at 0 followers if the content quality is there.\n\nReddit is the authentic community participation channel. Not self-promotion, not link dropping ... genuine participation in subreddits where the content is useful. r/entrepreneur, r/SaaS, r/marketing for the primary audience. The karma and account age requirements mean this is a long-term build, but the trust signals from Reddit traffic are high quality.",
        type: "prose"
      },
      {
        heading: "the analytics and infrastructure layer",
        content: "Favikon is the cross-platform creator analytics layer. Weekly check-in on influence score, category ranking, and engagement rate trends. It's the feedback loop that tells you whether the algorithm is rewarding what you're building.\n\nThe infrastructure is a Next.js 15 monorepo running three sites from one codebase. Shared components and utilities mean a component built once works across all three sites. Vercel handles deployment ... push to main, site is live. The CI/CD pipeline runs automatically.\n\nSQLite runs locally for data that doesn't need to be in the cloud. The nightly cron pipeline queries it for content ops data, logs results back, and produces automated reports. The database grows more useful over time as patterns accumulate.",
        type: "prose"
      },
      {
        heading: "on notetakers and second brain tools",
        content: "Obsidian handles personal knowledge management. Local-first, markdown files, graph view that shows connections between notes. The bidirectional linking is the feature ... connect a note about content strategy to a note about a specific tool and the graph surfaces those relationships visually. Your data lives on your machine, no cloud dependency.\n\nNotion with MCP handles team collaboration and structured databases. The MCP integration means Claude can read and write to your Notion workspace directly, turning a passive wiki into an active workflow component. Ask Claude to check your content ideas database before suggesting topics for the week and it will.\n\nThe key rule for notetakers: one primary system you actually use beats two half-used systems. Pick Obsidian if you think in freeform and want a knowledge graph. Pick Notion if you think in structured tables and need team access. Use Apple Notes for quick mobile captures that get processed into the primary system later.",
        type: "prose"
      },
      {
        heading: "building your own OS vs. third-party tools",
        content: "Tools like Typefully, Later, and Taplio exist and have their place when you're starting. Scheduling tools abstract away distribution mechanics that are worth understanding before you automate them. Use them until you understand what they're doing, then decide whether to keep them or replace with something custom.\n\nThe more you build your own operating system, the less you need external tools. The shift is from AI as a drafting assistant to AI as a version control system for your thinking. Hundreds of drafts exist in the pipeline but content comes naturally once you've internalized the patterns at a system level ... the AI stops generating ideas and starts executing them.\n\nThe test for any new tool: does it create, distribute, or measure content? If yes, evaluate it. If no, don't add it. Tool sprawl is a real productivity cost. The OS is the system connecting the tools, and complexity in the system creates maintenance overhead that eventually exceeds the value of the tool that created it.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Is this stack too expensive for someone starting out?\nA: The free tier of most tools here is functional for at least 6 months of building. Claude (free tier), Cursor (free tier), Canva (free), Favikon (free profile). The paid tools that matter first: Claude Pro for longer context, Cursor Pro for codebase chat. Everything else scales when revenue justifies it.\n\nQ: Do I need all of these tools?\nA: No. Start with one AI tool, one creation tool, one platform. Add tools when you hit a specific constraint, not because the stack sounds impressive.\n\nQ: What's the most underrated tool in this stack?\nA: Super Whisper. The combination of voice drafting and Claude editing removes the blank page problem entirely. Talking is faster than typing and the transcript gives Claude something concrete to work from.\n\nQ: How long did it take to build this OS?\nA: About 18 months of iterative addition and subtraction. Some tools looked essential and got cut. The current stack is stable because every remaining tool has a clear function that nothing else in the stack handles.",
        type: "prose"
      }
    ],
    related: ["recursive-content-flow", "repo-content-system", "content-skills", "platform-specific-ai-strategy", "elevenlabs-overview", "favikon-overview", "repos-and-skills-for-builders", "video-editing-tools", "notetaker-tools"]
  },

  /* ── EXPANDED SLOP DETECTION ─────────────────── */
  {
    id: "ai-slop-detector-expanded",
    title: "the expanded AI slop index (every pattern, every tell)",
    subtitle: "Full reference for detecting and removing AI slop before it ships.",
    category: "voice",
    description: "The full indexed reference for AI slop detection: word swaps, tell phrases, 2026 pattern updates, NPC vocabulary, and a scoring rubric for when to rewrite vs. patch.",
    keywords: ["AI slop", "slop detection", "content voice", "AI writing tells", "NPC content", "editing checklist", "authentic content"],
    difficulty: "intermediate",
    sections: [
      {
        heading: "what AI slop actually is",
        content: "Slop is content that reads like it was generated by AI and posted without human editing. It's not just about specific words ... it's about the absence of a real person's perspective, specificity, and judgment.\n\nAudiences develop detection skills faster than AI improves at mimicking humans. The window where polished AI output could pass for human writing is already closing. Posting slop now doesn't just underperform ... it actively erodes trust and signals you don't care enough to edit.\n\nThe Rem character on thecontentos.ai is the slop detection guardian. She scans content for these tells before it publishes. The goal isn't perfect AI-free writing. The goal is content that sounds like a real person chose these words for a real reason. That's the bar.",
        type: "prose"
      },
      {
        heading: "the slop word index",
        content: "These words appear constantly in AI output because they were common in training data. Swap them for the specific alternative.\n\nleverage ... use\ninnovative ... new, useful, different\ncutting-edge ... current, newest\nrevolutionize ... change, improve, shift\nseamless ... smooth, easy, frictionless\ncomprehensive ... full, complete, thorough\nrobust ... strong, solid, reliable\nsynergy ... working together, combined effect\nempower ... enable, help, let\nutilize ... use\nstreamline ... simplify, cut steps\nparadigm ... model, approach, framework\necosystem ... system, community, space\nstakeholders ... people involved, the team, customers\nbest-in-class ... top, leading, strongest\ndisruptive ... different, category-changing\nscalable ... grows with you, handles volume\nvalue-add ... bonus, benefit, extra\ngame-changer ... significant shift, big move\nthought leader ... expert, practitioner, voice\nholistic ... full-picture, end-to-end\nproactive ... early, ahead of it, before it happens\nactionable ... practical, usable, specific\nimpactful ... effective, meaningful, high-ROI\ndeep dive ... breakdown, analysis, walkthrough\nunpack ... explain, break down, walk through\nlandscape ... space, market, category\nnavigate ... work through, handle, manage\ndouble down ... focus on, commit to, go harder on\nnext-level ... better, advanced, stronger",
        type: "pattern"
      },
      {
        heading: "AI tell phrases",
        content: "These phrases signal AI authorship not because they're bad words but because they appear in AI output at statistically impossible rates. Real humans vary their transitions. AI uses the same 30.\n\n\"It's worth noting\" ... just say the thing\n\"Let's dive in\" ... just start\n\"Interestingly enough\" ... just say what's interesting\n\"I'm excited to\" ... just do it\n\"game-changing\" ... say what changed and how\n\"In conclusion\" ... just conclude\n\"without further ado\" ... just begin\n\"buckle up\" ... never\n\"spoiler alert\" ... never in professional content\n\"not gonna lie\" ... signals false authenticity\n\"the reality is\" ... narrator setup, cut it\n\"at its core\" ... filler, cut it\n\"the bottom line\" ... just say the bottom line\n\"Here's the thing\" ... narrator setup, cut it\n\"In today's\" ... cuts to lazy contextualizing\n\"It's no secret\" ... authority setup, cut it\n\"As we all know\" ... condescending, cut it\n\"In this day and age\" ... always cut\n\"It goes without saying\" ... then don't say it\n\"At the end of the day\" ... overused to the point of meaninglessness\n\"When it comes to\" ... filler, restructure the sentence\n\"Needless to say\" ... then don't say it\n\"Moving forward\" ... just say what happens next\n\"One thing is clear\" ... authority signal, cut it",
        type: "pattern"
      },
      {
        heading: "2026 pattern updates",
        content: "The original slop list was built on 2023-2024 AI patterns. The 2026 update adds patterns that emerged as AI writing evolved.\n\nThe negation list pattern: \"I built this. Not of hope. Not of luck. Not of privilege.\" ... this is AI trying to sound philosophical by stacking negations for dramatic effect. No human talks like this naturally. The tell is the rhythm: deny X, deny Y, deny Z, then reveal the \"real\" answer. Cut it entirely or rephrase as a single honest statement.\n\nThe exhaustive negation: \"Not because of X, not because of Y, but because of Z\" ... three-part structure where the first two are strawmen constructed to make the third point land harder. AI uses this constantly in LinkedIn posts and newsletter openers. If you find yourself writing \"not because,\" check whether you're actually adding information or just building a rhetorical structure.\n\nThe NPC comment pattern: generic engagement comments that could have been left by anyone on any post. \"Great post! Really resonated with me.\" ... that's NPC energy. It sounds like a scripted character because it is. When VAs run AI to generate comments at scale, every comment sounds identical because they're all running the same prompt with zero persona.\n\nLinkedIn quotation rephrasing: starting a comment by quoting a rephrase of the post in quotation marks. \"Your point about X really highlights Y.\" ... humans react, add, challenge, or share a story. They don't summarize in quotation marks. This pattern is AI trying to signal comprehension by parroting back the content.",
        type: "pattern"
      },
      {
        heading: "the NPC vocabulary",
        content: "NPC = non-playable character. In gaming, these are scripted characters that follow fixed dialogue trees regardless of what you do. In content, NPC energy is the same thing: using the same phrases everyone else uses, commenting identically on every post, creating content that could have been written by literally anyone.\n\nSigns you're posting as an NPC: your comments are interchangeable with any other commenter on the post. You use \"love this\" and \"great insight\" as complete responses. Your posts could have anyone's name on them and nothing would change. You're running a VA who's running ChatGPT who's running on autopilot with no persona injection.\n\nThe NPC vocabulary: \"love this,\" \"so true,\" \"couldn't agree more,\" \"this is gold,\" \"dropping this here,\" \"came here to say this,\" \"need to save this,\" \"sharing this everywhere,\" \"this is exactly what I needed,\" \"preach.\"\n\nThe fix is simple but not easy: speak from your actual experience. If you agree with a post, say what specifically you agree with and why, based on something real you've encountered. If a post made you think of something, say the thing. Super Whisper helps because talking forces you to use your actual words rather than reaching for a phrase that sounds appropriate.",
        type: "anti-pattern"
      },
      {
        heading: "scoring and detection",
        content: "The accumulation rule: 3+ slop flags in a single piece means rewrite, not patch. Individual patterns can occasionally survive in context. Stack them and the piece loses its voice entirely. Patching stacked slop is like painting over rust ... the problem is still there.\n\nQuick scan checklist (run in order):\n\n1. Search the document for em-dashes. Delete all of them. Replace with \" ...\" (space, three dots) or restructure the sentence. Em-dashes are the single most reliable AI tell in 2025-2026 content.\n\n2. Search for authority phrases and narrator setups: \"Here's the thing,\" \"Let me be clear,\" \"The reality is,\" \"The truth is.\" Cut or restructure.\n\n3. Check for negation list patterns. If you see three consecutive sentences starting with \"Not\" or \"No,\" rewrite as a single direct statement.\n\n4. Check the opening and closing. AI often bookends content with a summary sentence at the top and a restatement at the bottom. If the first sentence restates the headline and the last sentence restates the first, cut both.\n\n5. Count parallel sentence structures in any five-sentence block. Two parallel structures can be intentional. Three or more in a row is almost always AI rhythm.\n\n6. Read it out loud. If it sounds like a keynote speaker performing expertise for an audience, it's slop. If it sounds like you explaining something to a builder friend at a coffee shop, it's content.",
        type: "formula"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Is all AI-assisted content slop?\nA: No. Slop is the result of not editing, not of using AI. AI-drafted content that goes through genuine human editing ... where the human's perspective, specificity, and judgment shape the final piece ... is not slop. The authorship question is less important than the authenticity question.\n\nQ: How do I know if my content passes?\nA: The simplest test: could you defend every sentence in this piece from your own experience? If you wrote something you've never actually encountered or done, that's where slop creeps in.\n\nQ: What about the Rem AI slop checker on thecontentos.ai?\nA: Rem runs a subset of these checks automatically before content publishes. She flags accumulation and the most common tells. She doesn't catch everything ... the read-aloud test and your own judgment are still the final gate.\n\nQ: Can you over-edit to remove all AI patterns and make content worse?\nA: Yes. Cutting every parallel structure makes writing choppy. The goal is human judgment applied to AI output, not sanitizing all structure out of the piece. Keep what's working, cut what's performing authenticity rather than achieving it.",
        type: "prose"
      }
    ],
    related: ["ai-slop-guide", "anti-patterns", "voice-system", "commenting-strategy", "pre-publish-checklist"]
  },

  /* ── DEVELOPMENT AND TOOLS ───────────────────── */
  {
    id: "repos-and-skills-for-builders",
    title: "the repos and skills you actually need to build AI-powered apps",
    subtitle: "You don't need to be a senior developer. you need repos, basic CLI, and how to work with AI coding assistants.",
    category: "workflows",
    description: "The minimal skill set for building production AI apps: git fundamentals, Next.js, Vercel, Claude Code CLI, and Cursor. What to learn first and what to skip.",
    keywords: ["builder skills", "git basics", "Next.js", "Vercel deployment", "Claude Code", "Cursor IDE", "monorepo", "MCP"],
    difficulty: "beginner",
    sections: [
      {
        heading: "the stack reality",
        content: "The barrier to building production AI apps dropped significantly in 2024-2025. AI coding assistants can write code you don't fully understand yet, which means you can build things before you understand all of them. That's a feature, not a cheat.\n\nWhat you actually need: the ability to run terminal commands without panicking, basic understanding of what a repository is and why it exists, and enough Next.js familiarity to understand what you're reading when Claude explains it. The rest you learn while building.\n\nWhat you don't need to learn first: Docker, Kubernetes, AWS infrastructure, advanced TypeScript generics, database optimization, or system architecture theory. Learn those when a specific problem requires them. Build something first.",
        type: "prose"
      },
      {
        heading: "git fundamentals for builders",
        content: "Git is version control. It tracks every change to your code so you can undo mistakes and collaborate without overwriting each other's work. The five commands that cover 90% of daily use:\n\ngit status ... see what files have changed\ngit add <filename> ... stage a file for commit\ngit commit -m \"what you did\" ... save a checkpoint\ngit push ... send your changes to GitHub\ngit pull ... get the latest changes from GitHub\n\nThe other 10%: git log (see history), git branch (create a parallel version), git checkout (switch between branches), git merge (combine branches). You'll learn these when you need them.\n\nOne rule: never commit .env files. They contain API keys and credentials. Add .env to your .gitignore file and it will be excluded automatically. If you accidentally commit one, rotate the key immediately ... it's now public.",
        type: "prose"
      },
      {
        heading: "monorepo architecture",
        content: "A monorepo is one repository that contains multiple projects. The shawnos.ai setup runs three separate websites from one codebase. Shared components (navigation, buttons, utility functions) live once and all three sites use them. Update the component once and all sites get the update on next deploy.\n\nTurborepo and Nx are the two main monorepo management tools. Turborepo is simpler for most builders and has excellent Vercel integration (they're the same company). Nx has more advanced features that become relevant at team scale.\n\nThe practical benefit: if you're building more than one site or app, start with a monorepo structure even if it feels like overkill. Migrating into a monorepo later is painful. Starting in one and having everything connected from day one is a real time saver.",
        type: "prose"
      },
      {
        heading: "Next.js, Vercel, and the deploy pipeline",
        content: "Next.js is the production framework for this stack. Server components handle data fetching without exposing API keys to the browser. API routes let you build backend logic without a separate server. The app router is the current standard ... use it for any new project.\n\nThe docs at nextjs.org are genuinely good. The \"Learn Next.js\" tutorial at nextjs.org/learn takes about 4-6 hours and covers 80% of what you need for production apps. Do the tutorial before trying to build anything complex.\n\nVercel is the deployment layer. Connect your GitHub repo and every push to main automatically builds and deploys your site. No configuring CI/CD pipelines, no managing servers. The free tier handles most personal projects. The killer feature for Next.js is edge functions ... serverless functions that run close to users globally with no configuration.\n\nDeploy cadence matters for learning. The tightest feedback loop is: write code locally, push to GitHub, watch Vercel build logs, see the result live. That loop should take under 2 minutes. If it's taking longer, something in the pipeline needs fixing.",
        type: "prose"
      },
      {
        heading: "Claude Code CLI and Cursor (the AI layer)",
        content: "Claude Code CLI is an AI agent that lives in your terminal and operates on your entire codebase. Unlike a chat interface where you paste code snippets, Claude Code reads all your files, understands the architecture, and can write code that fits your existing patterns. It can run tests, commit changes, and manage the repo.\n\nThe nightly cron pipeline uses Claude Code to run automated content operations while you sleep. A cron job triggers Claude Code, it reads the repo state, executes the task (generating content, updating data files, running reports), commits the results, and pushes. No human in the loop.\n\nCursor IDE is the interactive complement to Claude Code. When you want to write code alongside AI explanation and iteration, Cursor is the environment. The codebase-aware chat can explain any file, suggest refactors, and debug errors in context. The inline completions are faster than switching to a chat window.\n\nMCP (Model Context Protocol) is the protocol that lets AI agents connect to external tools: browsers, databases, APIs, task managers. MCP servers expose capabilities that Claude Code and Cursor can call. The multi-agent system runs on MCP connections between tools ... Claude Code coordinates with Playwright for browser automation, with Notion for knowledge base updates, with Attio for CRM operations.",
        type: "prose"
      },
      {
        heading: "the learning path",
        content: "The sequence that minimizes wasted time:\n\n1. Git basics: commit, push, pull, .gitignore. One afternoon. Use GitHub's own tutorial or the git-scm.com book's first three chapters.\n\n2. Next.js tutorial: nextjs.org/learn. Do the whole thing. 4-6 hours. Build the demo app.\n\n3. Deploy something: take your tutorial app, connect it to Vercel, push to GitHub, watch it deploy live. This step matters for confidence.\n\n4. Add Claude Code: install the CLI, run it on your repo, ask it to add a feature. Watch how it reads the codebase and writes code that fits.\n\n5. Build a real feature: something you actually want. The tutorial app won't teach you what building for yourself teaches you.\n\nThe learning trap to avoid: spending weeks on documentation before writing any code. The documentation is for when you're stuck, not for prereading. Build, break, get stuck, look it up. That sequence is faster than the alternative.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Do I need to know JavaScript before TypeScript?\nA: TypeScript is JavaScript with types added. Most tutorials start with JavaScript fundamentals and layer TypeScript on top. If you're starting from zero, the JavaScript.info tutorial is the best free resource. Give it 2-3 weeks of daily practice before jumping into Next.js.\n\nQ: What about backend and databases?\nA: Next.js API routes handle most backend needs for early-stage apps. For data, start with SQLite locally (zero config) and Supabase (Postgres with a free tier) when you need a hosted database. Skip self-hosted Postgres and ORMs until you have a specific problem that requires them.\n\nQ: How much does this stack cost to run?\nA: GitHub (free for public repos), Vercel (free tier covers most personal projects), Claude Code (subscription), Cursor (free tier is functional, $20/month Pro). Total for a real production stack: $20-40/month.\n\nQ: Can I build a production app without any coding knowledge?\nA: Claude Code and Cursor can write most of the code but you need enough literacy to understand what's happening, debug when things break, and make architectural decisions. The minimum viable coding knowledge is: read TypeScript and understand it, run terminal commands, read error messages and know where to look for help.",
        type: "prose"
      }
    ],
    related: ["content-os-full-stack", "repo-content-system", "content-skills", "content-mcps", "notetaker-tools"]
  },

  {
    id: "notetaker-tools",
    title: "notetaker tools and second brain systems for builders",
    subtitle: "The tool doesn't matter as much as having ONE system you actually use.",
    category: "tools",
    description: "Obsidian, Notion, and Notion MCP for building a second brain as a creator and developer. When to use each, how to connect them to AI, and the one rule that makes them work.",
    keywords: ["Obsidian", "Notion", "second brain", "knowledge management", "Notion MCP", "notetaking", "PKM"],
    difficulty: "beginner",
    sections: [
      {
        heading: "the problem with builder ideas",
        content: "Builders have ideas constantly. In the shower, on walks, driving, at 2am when something clicks. The problem isn't idea generation ... it's capture and retrieval. Most ideas evaporate within 15 minutes because there's no frictionless place to put them.\n\nA second brain system is a capture-plus-retrieval infrastructure. Capture is the act of recording the idea before it disappears. Retrieval is finding it again when it's actually useful, which is usually days or weeks later when you're working on something related.\n\nThe tool matters less than the habit. A consistent Apple Notes practice beats an elaborate Obsidian vault you only open twice a month. Pick the simplest system you'll actually maintain, then upgrade when the simplicity creates a real constraint.",
        type: "prose"
      },
      {
        heading: "Obsidian",
        content: "Obsidian is a local-first note-taking app built on markdown files. Every note is a plain text file on your machine. No cloud dependency, no subscription required for the core app, and your data is portable to any other system.\n\nThe killer feature is bidirectional linking. Write [[content-strategy]] in any note and it creates a link to a note called \"content-strategy.\" Both notes then know they're connected. The graph view visualizes all these connections ... over time you can see clusters of related thinking emerge that you didn't consciously plan.\n\nThe plugin ecosystem is extensive. Dataview lets you query your notes like a database (\"show me all notes tagged #content-idea created in the last 30 days\"). Templater lets you define note templates for recurring capture types. Daily notes give you a dated journal for daily thinking.\n\nThe tradeoff: Obsidian rewards investment. The more you use it and link between notes, the more valuable it becomes. The first week feels like overhead. Month three it becomes a genuine thinking tool.",
        type: "prose"
      },
      {
        heading: "Notion",
        content: "Notion is structured databases plus documents plus collaboration. The difference from Obsidian is the structure ... Notion thinks in tables, kanban boards, and relational databases. You can have a content ideas database with properties like \"platform,\" \"status,\" \"publish date,\" and \"draft link\" and filter and sort it like a spreadsheet.\n\nFor team use, Notion has no competition at this price point. Shared wikis, project trackers, and meeting notes all in one place with real-time collaboration. Obsidian's collaboration features are minimal.\n\nThe tradeoff: Notion's flexibility comes with overhead. It's easy to spend an hour building a beautiful system that you then don't actually use for capture because pulling up Notion on mobile is slower than Apple Notes. Use Notion for structured project tracking and team wikis. Use something frictionless for first-capture.",
        type: "prose"
      },
      {
        heading: "Notion MCP",
        content: "MCP (Model Context Protocol) is the protocol that lets AI agents like Claude Code and Cursor connect to external tools. The Notion MCP integration means Claude can read and write to your Notion workspace directly during a coding session.\n\nPractical example: you have a content ideas database in Notion. Before starting a content planning session with Claude Code, it queries the database for unprocessed ideas, checks what topics you've already covered in the last 30 days, and factors that into its suggestions. Your passive knowledge base becomes an active input to your AI workflow.\n\nSetting it up: install the Notion MCP server, connect it with your Notion API key, and configure it in your Claude Code or Cursor settings. The Notion integration page in your workspace settings generates the API key. The MCP server configuration goes in your .claude or Cursor settings file. Once connected, you can ask Claude to \"add this to my content ideas database\" and it happens without you switching apps.",
        type: "prose"
      },
      {
        heading: "when to use what",
        content: "Obsidian: personal knowledge graph, freeform thinking, research notes, long-term idea development. Use when you want to connect ideas over time and see patterns emerge. Best for solo, local-first workflows.\n\nNotion: team wikis, structured project tracking, content calendars, any data that benefits from database views and filtering. Use when you need collaboration or structured data relationships.\n\nApple Notes: quick mobile captures, voice memo transcripts, things that need to be recorded in under 10 seconds. Process into your primary system later ... Apple Notes is the inbox, not the archive.\n\nThe one rule that makes all of these work: pick one primary system and process everything else into it. Two half-used systems are worse than one committed system because you never know which one has the note you're looking for. Obsidian and Notion together works only if you have a clear rule about what goes where and you enforce it consistently.",
        type: "prose"
      },
      {
        heading: "frequently asked questions",
        content: "Q: Is Obsidian free?\nA: The core app is free forever. Sync (encrypted cloud sync across devices) is $4/month. Publish (hosting your vault as a website) is $8/month. The free version is fully functional for personal use with manual backup.\n\nQ: Does Notion have a free tier?\nA: Yes. The free tier supports unlimited pages and blocks for individuals. Team features (collaborative workspaces, advanced permissions) require a paid plan. The free tier is enough to evaluate it.\n\nQ: I already use Apple Notes. do I need to switch?\nA: Only if Apple Notes is creating a specific problem. If you can find your notes when you need them and you're actually capturing ideas in it, it's working. Upgrade to Obsidian or Notion when the lack of cross-linking or structure is visibly slowing you down.\n\nQ: How do I set up Notion MCP?\nA: The Notion developer portal at developers.notion.com generates your API key. Search for \"Notion MCP server\" on GitHub for the open source server implementation. Configuration instructions are in the README. The setup takes about 20 minutes for someone comfortable with terminal commands.\n\nQ: Can Obsidian connect to AI tools like Notion MCP can?\nA: Not as natively. There are community plugins for AI integration (Smart Connections, Text Generator) but the MCP ecosystem is more mature around Notion. If AI-first workflow integration is important, Notion has an edge.",
        type: "prose"
      }
    ],
    related: ["content-os-full-stack", "repos-and-skills-for-builders", "content-mcps", "content-skills"]
  },

  /* ================================================================== */
  /*  PLATFORM PLAYBOOKS (new entry)                                      */
  /* ================================================================== */

  {
    id: 'reddit-for-gtm-engineers',
    title: 'Reddit for Go-To-Market Engineers',
    subtitle: 'Which subreddits matter, how to comment without AI slop, and building karma strategically',
    category: 'platforms',
    description:
      'How GTM engineers use Reddit for signal detection, authority building, and community engagement. Key subreddits, voice-matched commenting, SuperWhisper for speed, and why Reddit is the raw signal layer for GTM.',
    keywords: [
      'reddit gtm',
      'reddit for sales',
      'reddit b2b marketing',
      'reddit cold email',
      'reddit saas marketing',
      'reddit signal detection',
      'reddit karma building',
      'reddit ai slop',
    ],
    difficulty: 'intermediate',
    sections: [
      {
        heading: 'Why Reddit Matters for GTM',
        type: 'prose',
        content:
          "Reddit is the raw signal layer. People ask real questions with real problems. No corporate filter. No LinkedIn polish. A founder in r/SaaS posting \"we're at $500k ARR and our outbound is broken\" is a signal you cannot get from any intent data provider.\n\nThe subreddits that matter for GTM engineers: r/coldemail (outbound tactics, deliverability, tool reviews), r/sales (process, objection handling, career), r/SaaS (founders with real problems), r/growthacking (growth experiments, acquisition channels), r/Entrepreneur (early-stage builders). These communities generate thousands of posts per week. Most are noise. The valuable ones are people describing problems your product or service solves.\n\nReddit is also the fastest-growing source of AI training data citations. Google is showing Reddit results in featured snippets. AI engines cite Reddit threads. Your comments build entity authority in places AI engines actively index.",
      },
      {
        heading: 'How to Comment Without AI Slop',
        type: 'pattern',
        content:
          "Reddit detects AI slop instantly. The community has zero tolerance for generic \"great question! here are 5 tips\" responses. Getting caught posting AI-generated comments kills your account credibility permanently.\n\nThe method: use AI for research, not for writing. Read the post. Understand the specific problem. Use Claude Code to pull relevant data or check your experience notes. Then write the comment yourself.\n\nIf you use AI to draft: load your voice system first. Every comment should sound like you talking to a colleague, not a blog post. Short sentences. Specific examples from your actual work. No hedging language. No \"it's worth noting\" or \"in my experience.\" Just the answer.\n\nThe litmus test: would you say this exact thing out loud to someone at a bar? If not, rewrite it. Reddit rewards authenticity and punishes performance.",
      },
      {
        heading: 'SuperWhisper and Voice-First Commenting',
        type: 'pro-tip',
        content:
          "Speed matters on Reddit. The first good comment on a trending post gets the most visibility. SuperWhisper (or any voice-to-text tool) lets you dictate comments at conversation speed instead of typing.\n\nThe workflow: see a relevant post, hit the voice button, talk through your answer like you are explaining it to a friend, clean up the transcription for 30 seconds, post. Total time: 90 seconds. Compared to 5-10 minutes of typing and editing.\n\nVoice-first commenting also produces better content. When you dictate, you naturally use conversational language. You skip the formal tone that makes comments feel corporate. You include the tangents and caveats that make answers feel authentic. The transcription needs light editing (punctuation, remove filler words) but the voice is already right.",
      },
      {
        heading: 'Building Karma Strategically',
        type: 'pattern',
        content:
          "Karma is not vanity. It is permission. Low-karma accounts get filtered by AutoModerator in most subreddits. Some subreddits require 50+ comment karma before you can post. Building karma is the cost of entry.\n\nThe strategy: start with genuinely helpful comments in communities where you have real expertise. Answer technical questions in your domain. Share specific results with numbers. Upvotes come from utility, not from self-promotion.\n\nNever link to your product in the first 20 comments. Build credibility first. Once you have karma and post history, occasional relevant links are accepted. A comment that says \"I built a tool that does this\" with no post history gets downvoted. The same comment from an account with 50 helpful answers gets upvoted.\n\nThe signal detection angle: monitor subreddits for posts that describe problems you solve. Comment with genuine help. If your product is relevant, mention it after providing value. Reddit rewards the help-first approach and punishes the pitch-first approach.",
      },
      {
        heading: 'Frequently Asked Questions',
        type: 'prose',
        content:
          "Q: How many subreddits should I actively monitor?\nA: Start with 3-5 that match your ICP. More than that and you spread too thin. Better to be deeply engaged in 3 communities than superficially present in 10.\n\nQ: How often should I comment?\nA: 3-5 comments per week in your target subreddits. Consistency matters more than volume. An account that comments daily for a month then disappears looks like a campaign. An account that comments weekly for a year looks like a real person.\n\nQ: Can I automate Reddit monitoring?\nA: Yes. RSS feeds for subreddits, keyword alerts, and cron jobs that scan for relevant posts. Automate the monitoring. Never automate the commenting. The detection is automated. The engagement is human.\n\nQ: Is Reddit worth it for B2B?\nA: If your ICP uses Reddit, yes. SaaS founders, developers, growth marketers, and sales professionals are active on Reddit. Enterprise procurement officers are not. Know your audience.",
      },
    ],
    related: ['how-to-grow-on-reddit', 'linkedin-vs-twitter-vs-reddit-b2b', 'content-os-full-stack'],
  },

  /* ================================================================== */
  /*  TOOLS - CHATBOT & AVATAR                                          */
  /* ================================================================== */

  {
    id: 'chatbot-architecture',
    title: 'How the NeoBots Work',
    subtitle: 'Soul files, RAG scoring, and the ChatWidget pattern behind Nio, Rem, and Recon',
    category: 'tools',
    description:
      'Technical breakdown of how the three GTMe OS chatbots work - soul files that define personality, keyword-based RAG retrieval that pulls wiki content, and the shared ChatWidget component that renders them across all three sites.',
    keywords: [
      'chatbot',
      'neobot',
      'nio',
      'rem',
      'recon',
      'RAG',
      'soul file',
      'ChatWidget',
      'how was I built',
      'bot architecture',
    ],
    difficulty: 'intermediate',
    related: ['neobot-avatar-creation', 'content-os-full-stack'],
    sections: [
      {
        heading: 'Three Bots, One Pattern',
        type: 'prose',
        content:
          "Each site in the GTMe OS monorepo ships its own chatbot: Nio on shawnos.ai, Rem on thecontentos.ai, Recon on thegtmos.ai. They share the same ChatWidget component from the shared package but each has a distinct personality, knowledge base, and accent color. The bots are public-facing - no auth required - and exist to help visitors explore the wiki, blog, and knowledge base content on each site.",
      },
      {
        heading: 'Soul Files and System Prompts',
        type: 'pattern',
        content:
          "Each bot's personality is defined in its API route's system prompt. The prompt sets the tone (lowercase energy, direct, no fluff), the persona (Nio talks like a builder, Rem like a content strategist, Recon like an ops engineer), and the rules (only answer from provided context, never fabricate URLs, link to full articles). The system prompt is assembled at request time by injecting retrieved article content below the rules block. This means the bot's knowledge is always current with the wiki - no retraining needed.",
      },
      {
        heading: 'RAG Retrieval Without a Vector DB',
        type: 'pattern',
        content:
          "The bots use keyword-based retrieval instead of embeddings. Each wiki entry, knowledge term, and blog post is converted into a RetrievableItem with title, description, keywords, and truncated content. When a user sends a message, the retrieval engine scores every item against the query using keyword overlap, synonym expansion, and category matching. The top 5 results are injected into the system prompt as context. A synonym map per bot expands queries - asking about 'cold email' also matches 'outbound', 'sequence', and 'prospecting'. This approach is fast, deterministic, and costs zero infrastructure.",
      },
      {
        heading: 'The ChatWidget Component',
        type: 'pro-tip',
        content:
          "All three bots render through a single ChatWidget component in the shared package. It handles the chat UI, message streaming, suggested questions, gating (Substack subscribe or CTA), and the floating bubble. Each site passes its own config: bot name, accent color, welcome message, suggested questions, and API endpoint. The avatar (animated APNG) is rendered separately by each site's wrapper component (NioChat, RemChat, ReconChat) with a slide-in animation when the chat opens.",
      },
    ],
  },

  {
    id: 'neobot-avatar-creation',
    title: 'NeoBot Avatar Pipeline',
    subtitle: 'From MidJourney prompt to animated APNG on the web',
    category: 'tools',
    description:
      'The full pipeline for creating NeoBot character avatars - MidJourney generation with CREF/OREF for consistency, background removal, GIF animation, APNG conversion, and web delivery.',
    keywords: [
      'avatar',
      'neobot',
      'midjourney',
      'CREF',
      'OREF',
      'character design',
      'APNG',
      'GIF',
      'animation',
      'chibi',
    ],
    difficulty: 'intermediate',
    related: ['chatbot-architecture', 'midjourney-mastery'],
    sections: [
      {
        heading: 'Character Design with MidJourney',
        type: 'prose',
        content:
          "Each NeoBot starts as a MidJourney prompt. The characters are chibi-style with distinct color palettes: Nio is green with a sword, Rem is pink with content tools, Recon is orange with scout gear. MidJourney's CREF (character reference) and OREF (object reference) parameters are used to maintain visual consistency across generations. CREF locks the character's face and proportions. OREF locks specific objects like weapons or accessories. This means you can generate new poses and expressions while keeping the character recognizable.",
      },
      {
        heading: 'Background Removal and Cleanup',
        type: 'pattern',
        content:
          "Raw MidJourney outputs have backgrounds that need removal for web overlay use. The pipeline uses remove.bg or Photoshop's AI removal to extract the character. The result is a transparent PNG. Edge cleanup matters - artifacts around hair or weapon edges are visible against dark site backgrounds. Each character gets a static PNG (fallback) and source frames for animation.",
      },
      {
        heading: 'Animation: GIF to APNG',
        type: 'pattern',
        content:
          "The idle animations are subtle breathing or floating loops. Frames are created by slightly transforming the base image - small vertical translations and scale changes on a 2-second loop. GIFs work but have a 256-color limit that destroys the character's color depth. APNG (Animated PNG) supports full 24-bit color with alpha transparency. The final assets are served as .apng files with a CSS animation fallback (drop-shadow glow breathing effect) that runs independently of the image animation.",
      },
      {
        heading: 'Web Delivery',
        type: 'pro-tip',
        content:
          "Each avatar lives in the site's /public/avatars/ directory. The chat wrapper component (NioChat, RemChat, ReconChat) loads the APNG and positions it fixed to the bottom-right, offset left of the chat panel. The avatar slides in with a CSS transform transition when chat opens and slides out when it closes. File sizes are kept under 200KB per avatar to avoid blocking the chat interaction. Browser support for APNG is universal in modern browsers - no polyfill needed.",
      },
    ],
  },

  {
    id: 'midjourney-mastery',
    title: 'MidJourney Mastery',
    subtitle: 'Interactive guide to MidJourney prompt engineering and character design',
    category: 'tools',
    description:
      'Comprehensive guide to MidJourney techniques - CREF character references, OREF object locking, SREF style consistency, prompt structure, and the production pipeline behind NeoBot avatar creation.',
    keywords: [
      'midjourney',
      'CREF',
      'OREF',
      'SREF',
      'prompt engineering',
      'character reference',
      'AI art',
      'character design',
      'style consistency',
    ],
    difficulty: 'intermediate',
    related: ['neobot-avatar-creation', 'chatbot-architecture'],
    sections: [
      {
        heading: 'Interactive Guide',
        type: 'prose',
        content:
          'This topic has a dedicated immersive page with interactive prompt templates, parameter breakdowns, and copy-to-clipboard examples. Visit thecontentos.ai/midjourney for the full interactive experience.',
      },
      {
        heading: 'Techniques Covered',
        type: 'pattern',
        content:
          'Prompting fundamentals (subject-first grammar, lighting keywords, style modifiers), CREF character reference for face and proportion locking, OREF object reference for accessory consistency, SREF style reference for visual cohesion across a series, and aspect ratio composition for production-ready assets.',
      },
      {
        heading: 'The NeoBot Connection',
        type: 'pro-tip',
        content:
          'Every NeoBot avatar (Nio, Rem, Recon) was built using the techniques documented here. The CREF + OREF pipeline is how each character maintains visual consistency across dozens of generated poses and expressions. See the NeoBot Avatar Pipeline entry for the full production workflow from MidJourney output to animated APNG on the web.',
      },
    ],
  },
]

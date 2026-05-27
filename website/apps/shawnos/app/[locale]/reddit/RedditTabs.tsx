'use client'

import React, { useState } from 'react'
import { EvidenceCard } from './EvidenceCard'

/* ── post type archetypes with linked examples ──────── */

const POST_ARCHETYPES = [
  {
    name: 'the pattern read',
    emoji: '📡',
    desc: 'scan complaints, releases, pricing pages — turn the pattern into a post. people upvote synthesis they could not do themselves.',
    valueLead: 'for B2B marketing: synthesize 30 customer complaints, not 3 LinkedIn posts. for SaaS: link the raw scan output.',
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
      body: 'three months on the $200 Max plan, zero rate limits. ran Claude over every rate-limit complaint thread in this sub to figure out what the heavy users were doing wrong. shared the pattern, not the punchline.',
      lesson: 'the value was the scan, not my opinion. cross-posted variant in r/ClaudeAI hit 227 upvotes the same way.',
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
    valueLead: 'for GTM eng: name your real constraint, not a hypothetical. for Clay: include the table you got stuck on.',
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
      body: 'picking up a MacBook Neo as a portable terminal. all my actual compute lives on a Mac Mini that runs 24/7. the plan is basically: SSH in, tmux attach, run Claude Code on the Mini\'s hardware.',
      lesson: 'genuine question — I was actually buying the Neo. 48 comments of real technical answers because people could tell it was real.',
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
      body: 'Ryan Gosling meme — posted the morning Claude Code remote access dropped. zero effort, maximum relatability.',
      lesson: 'timing is everything. this took 30 seconds to post and outperformed most of my long-form content.',
    },
  },
  {
    name: 'the crossover',
    emoji: '🔀',
    desc: "find unexpected subreddits where your story resonates. a plumber's son in r/NYCapartments shouldn't work — but it does.",
    valueLead: 'for SaaS founders: bring your operator story to subs that buy what you sell, not subs that build what you sell.',
    stats: '188 upvotes, 26 comments, 28K views',
    evidence: {
      title: 'I spent 10 years as a plumber in NYC alongside my dad. Now I\'m using tech to share everything he knows. for free.',
      sub: 'r/NYCapartments',
      tag: 'Advice/Question',
      tagColor: '#58a6ff',
      upvotes: 188,
      comments: 26,
      views: '28K',
      image: '/images/reddit-evidence/dad-plumber-nyc.png',
      body: 'I\'m Shawn. For 10 years I worked plumbing in New York City with my father, Reuven. Not holding tools. running jobs. Every borough. Pre-war brownstones where nothing is where the blueprints say it is.',
      lesson: 'my highest-upvoted post is in a plumbing subreddit. find where your story fits that nobody expects.',
    },
  },
  {
    name: 'the hot take',
    emoji: '🔥',
    desc: 'ride breaking news within hours. have a real opinion backed by experience.',
    valueLead: 'for Clay: 18 months of daily usage is the receipt. for B2B marketing: name the vendor and the line item, not the category.',
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
    valueLead: 'for Clay: the actual checklist you use, not a teaser to a course. for GTM eng: the SQL query or the Python script, copy-paste ready.',
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
      body: 'MIT-licensed monorepo. ABM pipeline, Clay wiki, voice system, content OS, the works. every script that runs my business is in there. no email gate, no waitlist.',
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
      lesson: 'career arc story. linked repos, not landing pages. showed the method, not just the results.',
    },
  },
]

/* ── rules ──────────────────────────────────────────── */

const RULES = [
  { rule: 'find 3 subreddits that match your niche', detail: '5K-50K members is the sweet spot. look for engagement ratios, not subscriber count. mine: r/ClaudeCode, r/gtmengineering, r/GTMBuilders.' },
  { rule: 'comment like a madman', detail: "50/50 post-comment karma ratio is the goal. comment naturally, add value, comment again. say something worth reading." },
  { rule: 'the post is the hook, the comments are the delivery', detail: 'write a tight post. then drop the depth, the links, the repos in the comments. this is how you get 225 comments on a single post.' },
  { rule: 'publish everything fully', detail: 'MIT the repos. post the checklist inline. link the live site in the body, not behind a DM. the people who watch you give it away are the ones who hire you later.' },
  { rule: 'be genuine', detail: "post real questions you actually have. share real work you actually shipped. give real takes you actually believe. Reddit's immune system rewards the same signal it filters for." },
  { rule: 'mix your post types', detail: "memes one day, showcases the next, questions in between. variety signals you're a real person. monotone reads like a content machine." },
  { rule: 'ride the wave', detail: 'when news breaks, post within hours. my Clay pricing posts hit because I was there first with a real opinion and 18 months of daily usage behind it.' },
  { rule: 'write like you talk', detail: "if it sounds like you wrote it at 2am after a long day, post it. dictate if you have to. real cadence is what Reddit's immune system rewards." },
]

/* ── all receipts (for expandable section) ──────────── */

const ALL_RECEIPTS = [
  {
    title: 'Never hit a rate limit on $200 Max. Had Claude scan every complaint to figure out why.',
    sub: 'r/ClaudeCode', tag: 'Pattern Read', tagColor: '#fbbf24',
    upvotes: 308, comments: 115, views: '~50K',
    image: '/images/reddit-evidence/rate-limit-max-plan-308.png',
    body: 'three months on the $200 Max plan, zero rate limits. Claude-scanned the rate-limit complaint threads to surface the pattern.',
    lesson: 'top post on the account. the synthesis was the value, not the opinion.',
  },
  {
    title: 'On the $200 Max plan and never been rate limited once. Ran the numbers.',
    sub: 'r/ClaudeAI', tag: 'Pattern Read', tagColor: '#fbbf24',
    upvotes: 227, comments: 122, views: '~40K',
    image: '/images/reddit-evidence/max-plan-claudeai-227.png',
    body: 'cross-post variant of the rate-limit thread, sharpened for r/ClaudeAI. same scan, different framing.',
    lesson: 'the same pattern read works in two subs if the framing matches the audience.',
  },
  {
    title: 'I spent 10 years as a plumber in NYC alongside my dad.',
    sub: 'r/NYCapartments', tag: 'Crossover', tagColor: '#58a6ff',
    upvotes: 188, comments: 26, views: '28K',
    image: '/images/reddit-evidence/dad-plumber-nyc.png',
    body: 'personal story in an unexpected subreddit. the crossover play that built the dad-plumber arc.',
    lesson: 'authenticity in unexpected places wins. arc continued in r/AskNYC the next week.',
  },
  {
    title: 'life now with cc remote control',
    sub: 'r/ClaudeCode', tag: 'Humor', tagColor: '#f472b6',
    upvotes: 95, comments: 23, views: '18K',
    image: '/images/reddit-evidence/cc-remote-gosling.png',
    body: 'Ryan Gosling meme posted the morning Claude Code remote dropped.',
    lesson: 'best upvote-to-effort ratio. 30 seconds of work.',
  },
  {
    title: 'been mass building with Claude Code every day for 6 weeks straight.',
    sub: 'r/ClaudeCode', tag: 'Showcase', tagColor: '#4ade80',
    upvotes: 71, comments: 225, views: '145K',
    image: '/images/reddit-evidence/6week-claude-code.png',
    body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms.',
    lesson: '145K views. highest impression count across all posts. 225 comments because I replied to every one.',
  },
  {
    title: 'Supabase + Google Sheets + Claude Code replaced Clay for me. here is how.',
    sub: 'r/gtmengineering', tag: 'Pattern Read', tagColor: '#fbbf24',
    upvotes: 65, comments: 42, views: '~30K',
    image: '/images/reddit-evidence/supabase-replaced-clay-65.png',
    body: 'workflow-by-workflow swap after Clay re-priced. each task: what Clay did, what replaced it, what it now costs.',
    lesson: 'competitor-mention magnet. half the comments were Clay users running the same math.',
  },
  {
    title: '3 weeks running HubSpot from Claude Code CLI instead of MCP. 7 gotchas.',
    sub: 'r/hubspot', tag: 'Showcase', tagColor: '#4ade80',
    upvotes: 33, comments: 29, views: '~15K',
    image: '/images/reddit-evidence/hubspot-cli-gotchas-33.png',
    body: 'CLI-first HubSpot CRM ops, all 7 gotchas listed inline with the workaround under each.',
    lesson: 'r/hubspot was a brand-new sub for me. real receipts beat domain history.',
  },
  {
    title: 'from SDR to solo GTM engineer. the AI development method behind my entire operation',
    sub: 'r/gtmengineering', tag: 'Thought Piece', tagColor: '#4ade80',
    upvotes: 27, comments: 9, views: '4.1K',
    image: '/images/reddit-evidence/sdr-to-gtm-engineer.png',
    body: 'career arc story. 3 months of Claude Code, 4 full stack websites.',
    lesson: 'linked repos, not landing pages.',
  },
  {
    title: 'open-sourced my entire GTM engineering stack. not selling anything yet.',
    sub: 'r/gtmengineering', tag: 'Value Drop', tagColor: '#c084fc',
    upvotes: 25, comments: 8, views: '~8K',
    image: '/images/reddit-evidence/open-sourced-gtm-stack-25.png',
    body: 'MIT-licensed monorepo. ABM pipeline, Clay wiki, voice system, content OS. every script that runs the business.',
    lesson: 'pure value. no email gate. the people who watched me give it away are the ones who hire me later.',
  },
  {
    title: 'anyone running Claude Code over SSH from a thin client?',
    sub: 'r/ClaudeCode', tag: 'Question', tagColor: '#58a6ff',
    upvotes: 22, comments: 48, views: '45K',
    image: '/images/reddit-evidence/ssh-thin-client.png',
    body: 'genuine question about the MacBook Neo setup.',
    lesson: '48 comments of real technical answers because the stakes were real.',
  },
  {
    title: "Clay's new pricing changes what I build with. here's my updated stack.",
    sub: 'r/gtmengineering', tag: 'Hot Take', tagColor: '#f87171',
    upvotes: 21, comments: 18, views: '~6K',
    image: '/images/reddit-evidence/clay-pricing-dual.png',
    body: '18 months of daily Clay usage. side-by-side stack: what Clay still owns vs what moved to Supabase + Sheets.',
    lesson: 'hot take with a stack diagram beats hot take with adjectives.',
  },
  {
    title: 'Intent signals are qualification scores, not buying intent.',
    sub: 'r/GTMbuilders', tag: 'Thought Piece', tagColor: '#4ade80',
    upvotes: 7, comments: 14, views: '~2K',
    image: '/images/reddit-evidence/intent-signals-qualification-7.png',
    body: 'the Clearbox thesis stated in plain English. someone scrolling Reddit is not asking to buy — they are showing you which problem to solve first.',
    lesson: 'low score, high conversion. 3 of the 14 commenters turned into Clearbox early-access signups.',
  },
]

/* ── comment types ──────────────────────────────────── */

const COMMENT_TYPES = [
  {
    name: 'the mega comment',
    emoji: '💎',
    desc: 'a comment that IS a post. one sentence that captures the moment so perfectly it outperforms every post you\'ve ever written.',
    highlight: '239 upvotes, 27K views — my highest-performing piece of content is a comment.',
    examples: [
      { image: '/images/reddit-evidence/comment-adhd-btw-237.png', context: 'r/ClaudeCode — "Claude just released /BTW and it\'s clutch"', upvotes: 239, views: '27K', text: '"Ah man, this is a gift to us Claude Code homies that have the ADHD brain. pressing escape and changes their plans every three sub-agent runs."' },
    ],
  },
  {
    name: 'the expert drop',
    emoji: '🎯',
    desc: 'answer a question with real experience and specific numbers. no hedging, no "it depends."',
    highlight: 'highest comment karma per impression. people upvote confidence backed by receipts.',
    examples: [
      { image: '/images/reddit-evidence/comment-claude-appstore.png', context: 'r/ClaudeAI — "Claude overtaken ChatGPT in App Store"', upvotes: 30, views: '5.9K', text: '"No surprise. now we have remote control access. You basically have a dev in your back pocket and Opus 4.6 is elite."' },
      { image: '/images/reddit-evidence/comment-quality-over-marginal.png', context: 'r/ClaudeAI — "should I just always use opus?"', upvotes: 20, views: '9.5K', text: '"Don\'t overthink it...quality over marginalization, especially when it\'s not budget-wise."' },
    ],
  },
  {
    name: 'the one-liner',
    emoji: '⚡',
    desc: 'short, punchy, personality. zero fluff. keeps you visible between big posts.',
    highlight: 'low effort, high personality. the comments that make people check your profile.',
    examples: [
      { image: '/images/reddit-evidence/comment-skill-issue.png', context: 'r/vibecoding — "Vibe coding sucks"', upvotes: 9, views: '170', text: '"Skill issue my guy. You gotta learn version control"' },
      { image: '/images/reddit-evidence/comment-oneliner-terminals.png', context: 'r/ClaudeCode — "Claude Code on a piece of wood from 1872"', upvotes: 4, views: '1.5K', text: '"Color coded terminals??"' },
    ],
  },
  {
    name: 'the cross-pollinator',
    emoji: '🔗',
    desc: 'drop your work in someone else\'s thread — but only when it\'s genuinely relevant.',
    highlight: 'the plumber website dropped in r/ClaudeCode got 10K views. 5% of that is 500 visitors to dad\'s site.',
    examples: [
      { image: '/images/reddit-evidence/comment-crosspollin-plumber-claudecode.png', context: 'r/ClaudeCode — own post, replying about what he shipped', upvotes: 5, views: '10K', text: '"theplumbernyc.com Website I built for my father\'s company is already averaging 2,000 visitors a week."' },
      { image: '/images/reddit-evidence/comment-crosspollin-plumber-frankenstein.png', context: 'r/NYCapartments — someone else\'s plumber post', upvotes: 5, views: '2.8K', text: '"You should definitely check out some of the homeowner guide articles in his website"' },
    ],
  },
  {
    name: 'the thread keeper',
    emoji: '🔄',
    desc: 'reply to every commenter on your own posts. every reply bumps the post and shows you\'re real.',
    highlight: 'your own thread is your territory. this is where 46 upvotes turns into 164 comments and 145K views.',
    examples: [
      { image: '/images/reddit-evidence/comment-thread-keeper-feedback.png', context: 'r/NYCapartments — replying to feedback', upvotes: 9, views: '919', text: '"Thank you so much and you\'re the second person to see that."' },
      { image: '/images/reddit-evidence/comment-podcast-idea.png', context: 'r/NYCapartments — someone suggests a podcast', upvotes: 10, views: '708', text: '"Oh that sounds like a cool idea. I\'ve actually been pushing him to do a podcast"' },
    ],
  },
  {
    name: 'the hype man',
    emoji: '🚀',
    desc: 'genuine excitement for someone else\'s work. builds real relationships.',
    highlight: 'the karma you build hyping others lets you post your own work without looking like a self-promoter.',
    examples: [
      { image: '/images/reddit-evidence/comment-rookie-hype.png', context: 'r/GTMbuilders — "My rookie project"', upvotes: 3, views: '58', text: '"that awesome!! Exactly the type of workflows you should be starting out with"' },
      { image: '/images/reddit-evidence/comment-jury-rigged-fire.png', context: 'r/ClaudeCode — "My jury-rigged rate limit solution"', upvotes: 8, views: '796', text: '"yeah not gonna lie, that\'s fire. If I could I\'d sponsor you to get a Claude Code max plan"' },
    ],
  },
  {
    name: 'the value lead',
    emoji: '🪞',
    desc: 'state the principle in someone else\'s thread without selling. the comment is the credential.',
    highlight: 'value-leading proof in B2B subs — where readers buy what you build. the kind of comment that gets profile-checked.',
    examples: [
      { image: '/images/reddit-evidence/comment-b2bmarketing-reddit-art.png', context: 'r/b2bmarketing — thread on Reddit growth tactics', upvotes: 8, views: '~1K', text: '"Reddit is an art though. To share value and grow your brand on Reddit is such a different muscle from LinkedIn or X. the readers are sharper and the immune system is faster."' },
      { image: '/images/reddit-evidence/comment-claudeai-never-claim.png', context: 'r/ClaudeAI — someone accusing a post of being slop', upvotes: 7, views: '~1.5K', text: '"Never claim to make some big analysis or uncover some ungodly new thing. I share what I shipped. that is the only post worth posting."' },
    ],
  },
]

/* ── expandable post type card ──────────────────────── */

function PostArchetype({ archetype }: { archetype: typeof POST_ARCHETYPES[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={archetypeCard}>
      <button onClick={() => setExpanded(!expanded)} style={archetypeHeader}>
        <span style={archetypeName}>
          {archetype.emoji} {archetype.name}
        </span>
        <span style={archetypeStats}>{archetype.stats}</span>
        <span style={expandIcon}>{expanded ? '▾' : '▸'}</span>
      </button>
      <p style={archetypeDesc}>{archetype.desc}</p>
      {archetype.valueLead && (
        <p style={archetypeValueLead}>↳ {archetype.valueLead}</p>
      )}
      {expanded && (
        <div style={{ marginTop: '16px' }}>
          <EvidenceCard {...archetype.evidence} />
        </div>
      )}
    </div>
  )
}

/* ── main tabs component ────────────────────────────── */

export function RedditTabs() {
  const [tab, setTab] = useState<'posts' | 'comments' | 'beyond'>('posts')
  const [receiptsOpen, setReceiptsOpen] = useState(false)

  return (
    <div>
      {/* Tab buttons */}
      <div style={tabRow}>
        <button onClick={() => setTab('posts')} style={tab === 'posts' ? activeTab : inactiveTab}>
          posts guide
        </button>
        <button onClick={() => setTab('comments')} style={tab === 'comments' ? activeTab : inactiveTab}>
          comments guide
        </button>
        <button onClick={() => setTab('beyond')} style={tab === 'beyond' ? activeTab : inactiveTab}>
          beyond buy-intent
        </button>
      </div>

      {/* ── POSTS TAB ── */}
      {tab === 'posts' && (
        <div style={{ marginTop: '24px' }}>
          {/* 8 Post Archetypes */}
          <h2 style={sectionTitle}>the 8 post types that work</h2>
          <p style={sectionIntro}>
            I tested all of these across 3 months. each one hits differently.
            click any type to see the real example with stats, plus the value-lead note for SaaS / B2B marketing / Clay / GTM-engineering readers.
          </p>

          {POST_ARCHETYPES.map((a, i) => (
            <PostArchetype key={i} archetype={a} />
          ))}

          <hr style={divider} />

          {/* 8 Rules */}
          <h2 style={sectionTitle}>the 8 rules</h2>
          <p style={sectionIntro}>
            these aren&apos;t theory. every rule came from watching what worked and what got me destroyed.
          </p>

          {RULES.map((r, i) => (
            <div key={i} style={ruleCard}>
              <span style={ruleNumber}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={ruleTitle}>{r.rule}</p>
                <p style={ruleDetail}>{r.detail}</p>
              </div>
            </div>
          ))}

          <hr style={divider} />

          {/* Receipts — collapsed by default */}
          <button onClick={() => setReceiptsOpen(!receiptsOpen)} style={receiptsToggle}>
            <span>{receiptsOpen ? '▾' : '▸'} the receipts</span>
            <span style={receiptsSubtext}>all {ALL_RECEIPTS.length} posts with screenshots</span>
          </button>

          {receiptsOpen && (
            <div style={{ marginTop: '20px' }}>
              <p style={sectionIntro}>
                every post below is real. screenshots from my Reddit dashboard. no cherry-picking — wins and flops included.
              </p>
              {ALL_RECEIPTS.map((e, i) => (
                <EvidenceCard key={i} {...e} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── COMMENTS TAB ── */}
      {tab === 'comments' && (
        <div style={{ marginTop: '24px' }}>
          <p style={sectionIntro}>
            my highest-performing piece of content on Reddit isn&apos;t a post. it&apos;s a comment.
            239 upvotes, 27K views. one sentence about ADHD and Claude Code.
          </p>
          <p style={sectionIntro}>
            comments are where karma actually lives. here are the 7 comment types I use and why each one matters.
          </p>

          {COMMENT_TYPES.map((ct, i) => (
            <div key={i} style={commentSection}>
              <h3 style={commentName}>{ct.emoji} {ct.name}</h3>
              <p style={commentDesc}>{ct.desc}</p>
              <p style={commentHighlight}>{ct.highlight}</p>
              <div style={exampleGrid}>
                {ct.examples.map((ex, j) => (
                  <EvidenceCard
                    key={j}
                    title={ex.context}
                    sub=""
                    tag="Comment"
                    tagColor="#FF4500"
                    upvotes={ex.upvotes}
                    comments={0}
                    views={ex.views}
                    image={ex.image}
                    body={ex.text}
                    lesson=""
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── BEYOND BUY-INTENT TAB ── */}
      {tab === 'beyond' && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={sectionTitle}>every conversation is worth more than the close</h2>
          <p style={sectionIntro}>
            most people read Reddit looking for someone asking to buy. that&apos;s less than 1% of the value.
            the other 99% is qualification surface area — pre-buy signals, competitor mentions, and the engagement that tells you
            which problem to solve first. these three categories are how Clearbox labels every thread.
          </p>

          {/* lead surfacing */}
          <div style={beyondSection}>
            <h3 style={beyondName}>🎯 lead surfacing</h3>
            <p style={beyondDesc}>
              pre-buy signals. someone complaining about Clay pricing isn&apos;t saying &quot;sell me Clay alternatives.&quot;
              they&apos;re showing you the budget pressure that comes before the switch.
              the question, the complaint, the &quot;has anyone tried X&quot; — that&apos;s the lead.
            </p>
            <p style={beyondClearboxNote}>in Clearbox terms: <strong>lead</strong> — a thread Aura scores for prospect intent before the buyer self-identifies.</p>
            <EvidenceCard
              title="Intent signals are qualification scores, not buying intent."
              sub="r/GTMbuilders"
              tag="Lead Signal"
              tagColor="#fbbf24"
              upvotes={7}
              comments={14}
              views="~2K"
              image="/images/reddit-evidence/intent-signals-qualification-7.png"
              body="the Clearbox thesis stated in plain English. someone scrolling a problem thread is not asking to buy — they are showing you which problem to solve first."
              lesson="low post-score, high conversion. 3 of the 14 commenters turned into Clearbox early-access signups."
            />
          </div>

          {/* competitor mentions */}
          <div style={beyondSection}>
            <h3 style={beyondName}>⚔️ competitor mentions</h3>
            <p style={beyondDesc}>
              &quot;we just switched off X.&quot; &quot;Apollo is overpriced.&quot; &quot;Clay&apos;s new model broke our workflow.&quot;
              these threads tell you exactly which competitor is bleeding which segment, and what the trigger was.
              the comments are the dataset.
            </p>
            <p style={beyondClearboxNote}>in Clearbox terms: <strong>competitor</strong> — a thread Aura tags for active brand displacement.</p>
            <EvidenceCard
              title="Supabase + Google Sheets + Claude Code replaced Clay for me. here is how."
              sub="r/gtmengineering"
              tag="Competitor Signal"
              tagColor="#f87171"
              upvotes={65}
              comments={42}
              views="~30K"
              image="/images/reddit-evidence/supabase-replaced-clay-65.png"
              body="workflow-by-workflow swap after Clay re-priced. each task: what Clay did, what replaced it, what it now costs. half the comments were Clay users running the same math."
              lesson="competitor-mention magnet. you don't need to mention competitors to attract competitor-shopping readers — the swap diagram does it for you."
            />
          </div>

          {/* engagement value */}
          <div style={beyondSection}>
            <h3 style={beyondName}>🔍 engagement value &gt; buy intent</h3>
            <p style={beyondDesc}>
              the conversation is the asset. someone asking a question, someone challenging your take,
              someone sharing their own stack — every reply tells you what to build next, who to talk to,
              and which pitch lands. the qualification surface area IS the value.
            </p>
            <p style={beyondClearboxNote}>in Clearbox terms: <strong>engager</strong> — a thread Aura scores for relationship depth, not just intent.</p>
            <EvidenceCard
              title='r/b2bmarketing — thread on Reddit growth tactics'
              sub=""
              tag="Engagement Signal"
              tagColor="#58a6ff"
              upvotes={8}
              comments={0}
              views="~1K"
              image="/images/reddit-evidence/comment-b2bmarketing-reddit-art.png"
              body='"Reddit is an art though. To share value and grow your brand on Reddit is such a different muscle from LinkedIn or X. the readers are sharper and the immune system is faster."'
              lesson="the comment landed because it described the work, not the outcome. five DMs from B2B marketers checking the profile within 48 hours."
            />
          </div>

          {/* Clearbox bridge note */}
          <div style={beyondBridge}>
            <p style={beyondBridgeText}>
              the playbook above is the manual version of the same three-label system Clearbox runs at scale.
              <br />
              every Reddit thread, X reply, LinkedIn comment your buyers post — labeled, scored by Aura, ranked by what to act on first.
            </p>
            <a
              href="https://clearbox.to"
              target="_blank"
              rel="noopener noreferrer"
              style={beyondBridgeLink}
            >
              See your market. Move first. →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── styles ─────────────────────────────────────────── */

const tabRow: React.CSSProperties = {
  display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)',
}

const activeTab: React.CSSProperties = {
  padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#FF4500',
  background: 'none', border: 'none', borderBottom: '2px solid #FF4500',
  cursor: 'pointer', fontFamily: 'var(--font-editorial-body)', marginBottom: '-1px',
  letterSpacing: '-0.01em',
}

const inactiveTab: React.CSSProperties = {
  padding: '12px 24px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)',
  background: 'none', border: 'none', borderBottom: '2px solid transparent',
  cursor: 'pointer', fontFamily: 'var(--font-editorial-body)', marginBottom: '-1px',
  letterSpacing: '-0.01em',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '28px', fontWeight: 400, color: 'var(--text-primary)',
  margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.2,
}

const sectionIntro: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '22px',
}

const divider: React.CSSProperties = {
  border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0',
}

/* archetype cards */
const archetypeCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '16px 20px', marginBottom: '10px',
}

const archetypeHeader: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: 'var(--font-editorial-body)', textAlign: 'left',
}

const archetypeName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', flex: 1,
  letterSpacing: '-0.01em',
}

const archetypeStats: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px', color: '#FF4500', fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}

const expandIcon: React.CSSProperties = {
  fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px',
}

const archetypeDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.65,
  margin: '8px 0 0',
}

const archetypeValueLead: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '13px', color: '#FF4500', lineHeight: 1.55,
  margin: '6px 0 0', fontStyle: 'italic', fontWeight: 400, opacity: 0.9,
}

/* rules */
const ruleCard: React.CSSProperties = {
  display: 'flex', gap: '16px', padding: '16px 20px',
  background: 'var(--canvas-subtle)', border: '1px solid var(--border)',
  borderRadius: '10px', marginBottom: '10px',
}

const ruleNumber: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '24px', fontWeight: 300, color: '#FF4500',
  minWidth: '32px', lineHeight: 1, paddingTop: '2px',
  fontVariantNumeric: 'tabular-nums',
}

const ruleTitle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px',
  letterSpacing: '-0.01em',
}

const ruleDetail: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0,
}

/* receipts toggle */
const receiptsToggle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', padding: '20px 24px',
  background: 'var(--canvas-subtle)', border: '1px solid var(--border)',
  borderRadius: '12px', cursor: 'pointer',
  fontFamily: 'var(--font-editorial-display)', fontSize: '20px', fontWeight: 400,
  color: 'var(--text-primary)', letterSpacing: '-0.01em',
}

const receiptsSubtext: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)',
}

/* comment sections */
const commentSection: React.CSSProperties = {
  marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid var(--border)',
}

const commentName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '22px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 10px',
  letterSpacing: '-0.01em',
}

const commentDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 8px',
}

const commentHighlight: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '14px', color: '#FF4500', fontWeight: 400, margin: '0 0 16px', fontStyle: 'italic',
}

const exampleGrid: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '8px',
}

/* beyond buy-intent tab */
const beyondSection: React.CSSProperties = {
  marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--border)',
}

const beyondName: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '24px', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 12px',
  letterSpacing: '-0.01em',
}

const beyondDesc: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 14px',
}

const beyondClearboxNote: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '14px', color: '#FF4500', lineHeight: 1.6, margin: '0 0 20px',
  padding: '12px 16px',
  background: 'rgba(255, 69, 0, 0.06)',
  borderLeft: '2px solid #FF4500',
  borderRadius: '4px',
  fontStyle: 'italic',
}

const beyondBridge: React.CSSProperties = {
  marginTop: '24px',
  padding: '32px 36px',
  background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.08), rgba(255, 69, 0, 0.02))',
  border: '1px solid rgba(255, 69, 0, 0.2)',
  borderRadius: '16px',
  textAlign: 'center',
}

const beyondBridgeText: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '15px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 20px',
}

const beyondBridgeLink: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: '#FF4500',
  padding: '11px 26px',
  borderRadius: '8px',
  textDecoration: 'none',
  letterSpacing: '0.01em',
}

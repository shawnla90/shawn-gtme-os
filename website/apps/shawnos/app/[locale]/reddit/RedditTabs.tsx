'use client'

import React, { useState } from 'react'
import { EvidenceCard } from './EvidenceCard'

/* ── post type archetypes with linked examples ──────── */

const POST_ARCHETYPES = [
  {
    name: 'the showcase',
    emoji: '🏗️',
    desc: 'show what you shipped. numbers, repos, screenshots. the post is the hook, the comments deliver the depth.',
    stats: '46 upvotes, 164 comments, 145K views',
    evidence: {
      title: 'been mass building with Claude Code every day for 6 weeks straight.',
      sub: 'r/ClaudeCode',
      tag: 'Showcase',
      tagColor: '#4ade80',
      upvotes: 46,
      comments: 164,
      views: '145K',
      image: '/images/reddit-evidence/6week-claude-code.png',
      body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms, and cron jobs running nightly on a single Mac Mini. all Claude Code.',
      lesson: 'the post was the hook, the comments were the delivery. 164 comments because I replied to every single one.',
    },
  },
  {
    name: 'the question',
    emoji: '❓',
    desc: "ask something you genuinely want to know. technical depth invites technical answers. don't fake it.",
    stats: '22 upvotes, 46 comments, 45K views',
    evidence: {
      title: 'anyone running Claude Code over SSH from a thin client?',
      sub: 'r/ClaudeCode',
      tag: 'Question',
      tagColor: '#58a6ff',
      upvotes: 22,
      comments: 46,
      views: '45K',
      image: '/images/reddit-evidence/ssh-thin-client.png',
      body: 'picking up a MacBook Neo as a portable terminal. all my actual compute lives on a Mac Mini that runs 24/7. the plan is basically: SSH in, tmux attach, run Claude Code on the Mini\'s hardware.',
      lesson: 'genuine question — I was actually buying the Neo. 46 comments of real technical answers because people could tell it was real.',
    },
  },
  {
    name: 'the meme',
    emoji: '😂',
    desc: 'relatable humor, perfectly timed. post when a feature drops or a trend is peaking.',
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
    desc: 'ride breaking news within hours. have a real opinion backed by experience, not just outrage.',
    stats: '16 upvotes, 14 comments, 3.1K views',
    evidence: {
      title: 'tool devotion is a trap. Clay just proved the thesis.',
      sub: 'r/GTMbuilders + r/gtmengineering',
      tag: 'Hot Take',
      tagColor: '#f87171',
      upvotes: 16,
      comments: 14,
      views: '3.1K',
      image: '/images/reddit-evidence/tool-devotion-trap.png',
      body: 'for the past two months I\'ve been pushing the same thesis. the builder is the moat, not the tool. if your entire value proposition is proficiency with a specific platform, you\'re one pricing change away from a career problem.',
      lesson: 'timely contrarian take. backed by 18 months of daily Clay usage. cross-posted to both subs.',
    },
  },
  {
    name: 'the value drop',
    emoji: '🎁',
    desc: 'give away something useful. checklists, frameworks, audits. no gate, no DM, no email capture.',
    stats: '10 upvotes, 6 comments, 2K views',
    evidence: {
      title: 'Before You Hire a Clay Agency. Free Audit Checklist.',
      sub: 'r/gtmengineering',
      tag: 'Resource',
      tagColor: '#c084fc',
      upvotes: 10,
      comments: 6,
      views: '2K',
      image: '/images/reddit-evidence/clay-agency-audit.png',
      body: 'I\'ve been building in Clay daily for over a year. 60+ Clay Wiki entries, open-source GTM OS. I keep getting asked "should I hire a Clay agency?" so I put together the 5-question audit I run before answering.',
      lesson: 'pure value. no email gate. just the checklist. people saved this one.',
    },
  },
  {
    name: 'the thought piece',
    emoji: '🧠',
    desc: 'career arc, methodology, thesis. show the journey, link the receipts.',
    stats: '18 upvotes, 9 comments, 4.1K views',
    evidence: {
      title: 'from SDR to solo GTM engineer. the AI development method behind my entire operation',
      sub: 'r/gtmengineering',
      tag: 'Showcase',
      tagColor: '#4ade80',
      upvotes: 18,
      comments: 9,
      views: '4.1K',
      image: '/images/reddit-evidence/sdr-to-gtm-engineer.png',
      body: '4 weeks ago I started using Claude Code heavy. since then I\'ve shipped four full stack websites, built a arsenal of reusable skills, a voice system for content, a progression engine. all one monorepo, one Mac Mini.',
      lesson: 'career arc story. linked repos, not landing pages. showed the method, not just the results.',
    },
  },
]

/* ── rules ──────────────────────────────────────────── */

const RULES = [
  { rule: 'find 3 subreddits that match your niche', detail: '5K-50K members is the sweet spot. look for engagement ratios, not subscriber count. mine: r/ClaudeCode, r/gtmengineering, r/GTMBuilders.' },
  { rule: 'comment like a madman', detail: "50/50 post-comment karma ratio is the goal. comment naturally, add value, comment again. don't say \"great post\" — say something worth reading." },
  { rule: 'the post is the hook, the comments are the delivery', detail: 'write a tight post. then drop the depth, the links, the repos in the comments. this is how you get 163 comments on a single post.' },
  { rule: 'no gatekeeping', detail: "never say \"comment PLAYBOOK and I'll DM it.\" never gate behind email. MIT license your repos. the people who watch you give it away are the ones who hire you later." },
  { rule: 'be genuine', detail: "post real questions you actually have. share real work you actually shipped. give real takes you actually believe. Reddit's immune system detects performance instantly." },
  { rule: 'mix your post types', detail: "memes one day, showcases the next, questions in between. monotone accounts get ignored. variety signals you're a real person, not a content machine." },
  { rule: 'ride the wave', detail: 'when news breaks, post within hours. my Clay pricing posts hit because I was there first with a real opinion and 18 months of daily usage behind it.' },
  { rule: "don't post AI slop", detail: "Reddit will destroy you. no ChatGPT-generated posts. no em-dashes. no \"here's the uncomfortable truth.\" write like you talk. dictate if you have to." },
]

/* ── all receipts (for expandable section) ──────────── */

const ALL_RECEIPTS = [
  {
    title: 'I spent 10 years as a plumber in NYC alongside my dad.',
    sub: 'r/NYCapartments', tag: 'Crossover', tagColor: '#58a6ff',
    upvotes: 188, comments: 26, views: '28K',
    image: '/images/reddit-evidence/dad-plumber-nyc.png',
    body: 'personal story in an unexpected subreddit. the crossover play that became my highest-upvoted post.',
    lesson: '188 upvotes. authenticity in unexpected places wins.',
  },
  {
    title: 'life now with cc remote control',
    sub: 'r/ClaudeCode', tag: 'Humor', tagColor: '#f472b6',
    upvotes: 95, comments: 23, views: '18K',
    image: '/images/reddit-evidence/cc-remote-gosling.png',
    body: 'Ryan Gosling meme posted the morning Claude Code remote dropped.',
    lesson: 'best upvote-to-effort ratio of any post. 30 seconds of work.',
  },
  {
    title: 'been mass building with Claude Code every day for 6 weeks straight.',
    sub: 'r/ClaudeCode', tag: 'Showcase', tagColor: '#4ade80',
    upvotes: 46, comments: 164, views: '145K',
    image: '/images/reddit-evidence/6week-claude-code.png',
    body: 'shipped 4 open source repos, 3 production websites, a content pipeline across 6 platforms.',
    lesson: '145K views. highest impression count across all posts.',
  },
  {
    title: 'anyone running Claude Code over SSH from a thin client?',
    sub: 'r/ClaudeCode', tag: 'Question', tagColor: '#58a6ff',
    upvotes: 22, comments: 46, views: '45K',
    image: '/images/reddit-evidence/ssh-thin-client.png',
    body: 'genuine question about the MacBook Neo setup.',
    lesson: '46 comments of real technical answers.',
  },
  {
    title: 'Testing the new 1M context window be like...',
    sub: 'r/ClaudeCode', tag: 'Humor', tagColor: '#f472b6',
    upvotes: 12, comments: 3, views: '3.4K',
    image: '/images/reddit-evidence/1m-context-meme.png',
    body: 'anime meme on launch day. keeps you visible between big posts.',
    lesson: 'low effort, high relatability.',
  },
  {
    title: 'tool devotion is a trap. Clay just proved the thesis.',
    sub: 'r/GTMbuilders + r/gtmengineering', tag: 'Hot Take', tagColor: '#f87171',
    upvotes: 16, comments: 14, views: '3.1K',
    image: '/images/reddit-evidence/tool-devotion-trap.png',
    body: 'the builder is the moat, not the tool. Clay pricing change proved it.',
    lesson: 'timely contrarian take backed by 18 months of experience.',
  },
  {
    title: 'from SDR to solo GTM engineer.',
    sub: 'r/gtmengineering', tag: 'Thought Piece', tagColor: '#4ade80',
    upvotes: 18, comments: 9, views: '4.1K',
    image: '/images/reddit-evidence/sdr-to-gtm-engineer.png',
    body: 'career arc story. 4 weeks of Claude Code, 4 full stack websites.',
    lesson: 'linked repos, not landing pages.',
  },
  {
    title: 'Before You Hire a Clay Agency. Free Audit Checklist.',
    sub: 'r/gtmengineering', tag: 'Value Drop', tagColor: '#c084fc',
    upvotes: 10, comments: 6, views: '2K',
    image: '/images/reddit-evidence/clay-agency-audit.png',
    body: '5-question audit checklist. no email gate.',
    lesson: 'pure value. people saved this one.',
  },
  {
    title: 'stop renting your audience. build your own website.',
    sub: 'r/gtmengineering', tag: 'Blog Posts', tagColor: '#4ade80',
    upvotes: 1, comments: 0, views: '365',
    image: '/images/reddit-evidence/stop-renting-audience.png',
    body: 'thesis post that was too preachy.',
    lesson: 'not every post hits. lead with story, not advice.',
  },
  {
    title: 'the new GTM resume is a GitHub repo and Reddit karma',
    sub: 'r/GTMbuilders', tag: 'Blog Posts', tagColor: '#4ade80',
    upvotes: 3, comments: 8, views: '738',
    image: '/images/reddit-evidence/gtm-resume-github-repo.png',
    body: 'thesis post seeding the builder identity conversation.',
    lesson: 'small numbers but seeded future conversations.',
  },
]

/* ── comment types ──────────────────────────────────── */

const COMMENT_TYPES = [
  {
    name: 'the mega comment',
    emoji: '💎',
    desc: 'a comment that IS a post. one sentence that captures the moment so perfectly it outperforms every post you\'ve ever written.',
    highlight: '237 upvotes, 27K views — my highest-performing piece of content is a comment.',
    examples: [
      { image: '/images/reddit-evidence/comment-adhd-btw-237.png', context: 'r/ClaudeCode — "Claude just released /BTW and it\'s clutch"', upvotes: 237, views: '27K', text: '"Ah man, this is a gift to us Claude Code homies that have the ADHD brain. pressing escape and changes their plans every three sub-agent runs."' },
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
  const [tab, setTab] = useState<'posts' | 'comments'>('posts')
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
      </div>

      {/* ── POSTS TAB ── */}
      {tab === 'posts' && (
        <div style={{ marginTop: '24px' }}>
          {/* 7 Post Archetypes */}
          <h2 style={sectionTitle}>the 7 post types that work</h2>
          <p style={sectionIntro}>
            I tested all of these in my first month. each one hits differently.
            click any type to see the real example with stats.
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
            237 upvotes, 27K views. one sentence about ADHD and Claude Code.
          </p>
          <p style={sectionIntro}>
            comments are where karma actually lives. here are the 6 comment types I use and why each one matters.
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
    </div>
  )
}

/* ── styles ─────────────────────────────────────────── */

const tabRow: React.CSSProperties = {
  display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)',
}

const activeTab: React.CSSProperties = {
  padding: '12px 24px', fontSize: '14px', fontWeight: 700, color: '#FF4500',
  background: 'none', border: 'none', borderBottom: '2px solid #FF4500',
  cursor: 'pointer', fontFamily: 'var(--font-mono)', marginBottom: '-1px',
}

const inactiveTab: React.CSSProperties = {
  padding: '12px 24px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)',
  background: 'none', border: 'none', borderBottom: '2px solid transparent',
  cursor: 'pointer', fontFamily: 'var(--font-mono)', marginBottom: '-1px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)',
  margin: '0 0 12px', letterSpacing: '-0.02em',
}

const sectionIntro: React.CSSProperties = {
  fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px',
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
  fontFamily: 'var(--font-mono)', textAlign: 'left',
}

const archetypeName: React.CSSProperties = {
  fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', flex: 1,
}

const archetypeStats: React.CSSProperties = {
  fontSize: '12px', color: '#FF4500', fontWeight: 600, whiteSpace: 'nowrap',
}

const expandIcon: React.CSSProperties = {
  fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px',
}

const archetypeDesc: React.CSSProperties = {
  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
  margin: '8px 0 0',
}

/* rules */
const ruleCard: React.CSSProperties = {
  display: 'flex', gap: '16px', padding: '16px 20px',
  background: 'var(--canvas-subtle)', border: '1px solid var(--border)',
  borderRadius: '10px', marginBottom: '10px',
}

const ruleNumber: React.CSSProperties = {
  fontSize: '20px', fontWeight: 700, color: '#FF4500',
  minWidth: '28px', lineHeight: 1, paddingTop: '2px',
}

const ruleTitle: React.CSSProperties = {
  fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px',
}

const ruleDetail: React.CSSProperties = {
  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
}

/* receipts toggle */
const receiptsToggle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', padding: '20px 24px',
  background: 'var(--canvas-subtle)', border: '1px solid var(--border)',
  borderRadius: '12px', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700,
  color: 'var(--text-primary)',
}

const receiptsSubtext: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)',
}

/* comment sections */
const commentSection: React.CSSProperties = {
  marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid var(--border)',
}

const commentName: React.CSSProperties = {
  fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px',
}

const commentDesc: React.CSSProperties = {
  fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px',
}

const commentHighlight: React.CSSProperties = {
  fontSize: '13px', color: '#FF4500', fontWeight: 600, margin: '0 0 16px', fontStyle: 'italic',
}

const exampleGrid: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '8px',
}

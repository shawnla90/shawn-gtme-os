'use client'

import React, { useState } from 'react'

/* ── comment data ──────────────────────────────────── */

const COMMENT_TYPES = [
  {
    name: 'the mega comment',
    emoji: '💎',
    desc: 'a comment that IS a post. one sentence that captures the moment so perfectly it outperforms every post you\'ve ever written.',
    highlight: '237 upvotes, 27K views — my highest-performing piece of content is a comment.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-adhd-btw-237.png',
        context: 'r/ClaudeCode — "Claude just released /BTW and it\'s clutch"',
        upvotes: 237,
        views: '27K',
        text: '"Ah man, this is a gift to us Claude Code homies that have the ADHD brain. pressing escape and changes their plans every three sub-agent runs."',
      },
    ],
  },
  {
    name: 'the expert drop',
    emoji: '🎯',
    desc: 'answer a question with real experience and specific numbers. no hedging, no "it depends." say what you actually think.',
    highlight: 'highest comment karma per impression. people upvote confidence backed by receipts.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-claude-appstore.png',
        context: 'r/ClaudeAI — "Claude has overtaken ChatGPT in the Apple App Store"',
        upvotes: 30,
        views: '5.9K',
        text: '"No surprise. now we have remote control access. You basically have a dev in your back pocket and Opus 4.6 is elite."',
      },
      {
        image: '/images/reddit-evidence/comment-quality-over-marginal.png',
        context: 'r/ClaudeAI — "should I just always use opus?"',
        upvotes: 20,
        views: '9.5K',
        text: '"Don\'t overthink it...quality over marginalization, especially when it\'s not budget-wise."',
      },
      {
        image: '/images/reddit-evidence/comment-claude-max-value.png',
        context: 'r/ClaudeAI — "The reality of Claude limits in 2026: Pro vs Max"',
        upvotes: 7,
        views: '5.2K',
        text: '"I have 3-5 terminals running, almost 24 hours...I have yet to be throttled by any limits. For $200 you can have basically multiple developers running at the same time."',
      },
    ],
  },
  {
    name: 'the one-liner',
    emoji: '⚡',
    desc: 'short, punchy, personality. zero fluff. these keep you visible between big posts and build your voice recognition.',
    highlight: 'low effort, high personality. the comments that make people check your profile.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-skill-issue.png',
        context: 'r/vibecoding — "Vibe coding sucks"',
        upvotes: 9,
        views: '170',
        text: '"Skill issue my guy. You gotta learn version control"',
      },
      {
        image: '/images/reddit-evidence/comment-oneliner-terminals.png',
        context: 'r/ClaudeCode — "Claude Code on a piece of wood from 1872"',
        upvotes: 4,
        views: '1.5K',
        text: '"Color coded terminals??"',
      },
      {
        image: '/images/reddit-evidence/comment-remote-hottub.png',
        context: 'r/ClaudeCode — "Remote Control just got a major upgrade"',
        upvotes: 5,
        views: '3K',
        text: '"This is exciting...definitely keeping an eye out for the day that I can just code for my hot tub."',
      },
    ],
  },
  {
    name: 'the cross-pollinator',
    emoji: '🔗',
    desc: 'drop your work in someone else\'s thread — but only when it\'s genuinely relevant. contextual, not spammy. this is how you drive traffic without being a marketer.',
    highlight: 'the plumber website dropped in r/ClaudeCode got 10K views. 5% of that is 500 visitors to dad\'s site from one comment.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-crosspollin-plumber-claudecode.png',
        context: 'r/ClaudeCode — own "6 weeks building" post, replying about what he shipped',
        upvotes: 5,
        views: '10K',
        text: '"theplumbernyc.com Website I built for my father\'s company is already averaging 2,000 visitors a week. We\'ve generated over 40k in apartment renovation deals since launch."',
      },
      {
        image: '/images/reddit-evidence/comment-crosspollin-plumber-frankenstein.png',
        context: 'r/NYCapartments — "30+ years as a NYC master plumber" (someone else\'s post)',
        upvotes: 5,
        views: '2.8K',
        text: '"You should definitely check out some of the homeowner guide articles in his website this is all 30 year tribal knowledge"',
      },
    ],
  },
  {
    name: 'the thread keeper',
    emoji: '🔄',
    desc: 'reply to every single commenter on your own posts. keep the conversation alive. this is where 43 upvotes turns into 164 comments and 145K views.',
    highlight: 'your own thread is your territory. every reply bumps the post and shows you\'re real.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-thread-keeper-feedback.png',
        context: 'r/NYCapartments — replying to feedback on dad\'s website',
        upvotes: 9,
        views: '919',
        text: '"Thank you so much and you\'re the second person to see that. There are still a few functions I\'m working on and changing..."',
      },
      {
        image: '/images/reddit-evidence/comment-podcast-idea.png',
        context: 'r/NYCapartments — someone suggests a podcast for dad',
        upvotes: 10,
        views: '708',
        text: '"Oh that sounds like a cool idea. I\'ve actually been pushing him to do a podcast or something so love to hear that."',
      },
      {
        image: '/images/reddit-evidence/comment-nio-screen-size.png',
        context: 'r/ClaudeCode — SSH thin client post, replying about screen size',
        upvotes: 7,
        views: '1.7K',
        text: '"To small a screen tried that. I feel like this Nio is the perfect balance...As a matter of fact it\'s cheaper than an iPhone."',
      },
    ],
  },
  {
    name: 'the hype man',
    emoji: '🚀',
    desc: 'genuine excitement for someone else\'s work. specific praise, not generic "great post." this builds real relationships and people remember who showed up for them.',
    highlight: 'the karma you build hyping others is the karma that lets you post your own work without looking like a self-promoter.',
    examples: [
      {
        image: '/images/reddit-evidence/comment-rookie-hype.png',
        context: 'r/GTMbuilders — "My rookie project"',
        upvotes: 3,
        views: '58',
        text: '"that awesome!! Exactly the type of workflows you should be starting out with...I\'m going to start it right now for you"',
      },
      {
        image: '/images/reddit-evidence/comment-jury-rigged-fire.png',
        context: 'r/ClaudeCode — "My jury-rigged solution to the rate limit"',
        upvotes: 8,
        views: '796',
        text: '"yeah not gonna lie, that\'s fire. If I could I\'d sponsor you to get a Claude Code max plan. At the very least I\'ll star your repo"',
      },
    ],
  },
]

/* ── tab component ─────────────────────────────────── */

export function RedditTabs() {
  const [tab, setTab] = useState<'posts' | 'comments'>('posts')

  return (
    <div>
      {/* Tab buttons */}
      <div style={tabRow}>
        <button
          onClick={() => setTab('posts')}
          style={tab === 'posts' ? activeTab : inactiveTab}
        >
          posts guide
        </button>
        <button
          onClick={() => setTab('comments')}
          style={tab === 'comments' ? activeTab : inactiveTab}
        >
          comments guide
        </button>
      </div>

      {tab === 'posts' && (
        <div id="posts-section" />
      )}

      {tab === 'comments' && (
        <div style={{ marginTop: '24px' }}>
          <p style={introText}>
            my highest-performing piece of content on Reddit isn&apos;t a post. it&apos;s a comment.
            237 upvotes, 27K views. one sentence about ADHD and Claude Code.
          </p>
          <p style={introText}>
            comments are where karma actually lives. here are the 6 comment types I use and why each one matters.
          </p>

          {COMMENT_TYPES.map((ct, i) => (
            <div key={i} style={commentTypeSection}>
              <h3 style={commentTypeName}>
                {ct.emoji} {ct.name}
              </h3>
              <p style={commentTypeDesc}>{ct.desc}</p>
              <p style={commentTypeHighlight}>{ct.highlight}</p>

              <div style={exampleGrid}>
                {ct.examples.map((ex, j) => (
                  <div key={j} style={exampleCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ex.image}
                      alt={ex.context}
                      style={exampleImage}
                      loading="lazy"
                    />
                    <div style={exampleBody}>
                      <p style={exampleContext}>{ex.context}</p>
                      <div style={exampleStats}>
                        <span>↑ {ex.upvotes}</span>
                        <span>👁 {ex.views} views</span>
                      </div>
                    </div>
                  </div>
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
  display: 'flex',
  gap: '4px',
  marginBottom: '8px',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '0',
}

const activeTab: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#FF4500',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid #FF4500',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  marginBottom: '-1px',
}

const inactiveTab: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  marginBottom: '-1px',
  transition: 'color 0.15s',
}

const introText: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  marginBottom: '16px',
}

const commentTypeSection: React.CSSProperties = {
  marginBottom: '40px',
  paddingBottom: '32px',
  borderBottom: '1px solid var(--border)',
}

const commentTypeName: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: '0 0 8px',
}

const commentTypeDesc: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: '0 0 8px',
}

const commentTypeHighlight: React.CSSProperties = {
  fontSize: '13px',
  color: '#FF4500',
  fontWeight: 600,
  margin: '0 0 20px',
  fontStyle: 'italic',
}

const exampleGrid: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const exampleCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  overflow: 'hidden',
}

const exampleImage: React.CSSProperties = {
  width: '100%',
  display: 'block',
  borderBottom: '1px solid var(--border)',
}

const exampleBody: React.CSSProperties = {
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
}

const exampleContext: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  margin: 0,
}

const exampleStats: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  fontSize: '12px',
  color: 'var(--text-secondary)',
}

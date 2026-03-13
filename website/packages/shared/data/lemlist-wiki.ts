/**
 * ShawnOS — Lemlist Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { WikiSection } from './clay-wiki'

/* ── types ─────────────────────────────────────────── */

export type LemlistWikiCategory =
  | 'core-concepts'
  | 'sequences'
  | 'deliverability'
  | 'integrations'

export interface LemlistWikiEntry {
  id: string // URL slug
  title: string
  subtitle: string // one-liner for cards
  category: LemlistWikiCategory
  description: string // SEO meta description
  keywords: string[]
  sections: WikiSection[]
  related: string[] // other wiki entry IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const LEMLIST_WIKI_CATEGORIES: {
  id: LemlistWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    description: 'Multichannel outreach architecture, campaign design, and lead management fundamentals',
    prompt: '$ cd ~/lemlist-wiki/core-concepts/',
  },
  {
    id: 'sequences',
    label: 'Sequences',
    description: 'Email sequence patterns, follow-up cadences, and multichannel workflows',
    prompt: '$ cd ~/lemlist-wiki/sequences/',
  },
  {
    id: 'deliverability',
    label: 'Deliverability',
    description: 'Warm-up, domain health, inbox rotation, and sender reputation management',
    prompt: '$ cd ~/lemlist-wiki/deliverability/',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'CRM sync, Clay enrichment handoffs, and webhook automation patterns',
    prompt: '$ cd ~/lemlist-wiki/integrations/',
  },
]

/* ── wiki entries ──────────────────────────────────── */

export const LEMLIST_WIKI_ENTRIES: LemlistWikiEntry[] = [
  /* ── core-concepts ── */
  {
    id: 'multichannel-architecture',
    title: 'Multichannel Outreach Architecture',
    subtitle: 'Email + LinkedIn + calls in one sequence. How to structure it without being annoying.',
    category: 'core-concepts',
    description: 'How to design multichannel outreach sequences in Lemlist combining email, LinkedIn, and phone touches in a single campaign without overwhelming prospects.',
    keywords: ['lemlist multichannel', 'outreach sequence design', 'email linkedin sequence', 'multichannel cadence'],
    sections: [
      {
        heading: 'Why Multichannel Beats Email-Only',
        content: '<p>Single-channel email campaigns hit 15-20% open rates on a good day. Add LinkedIn touches and you\'re looking at 40-60% connection rates on warm prospects. The math is simple - more surface area, more replies.</p><p>Lemlist\'s advantage over pure email tools: native LinkedIn steps, conditional branching, and unified tracking across channels. You see the full picture in one dashboard instead of stitching together three tools.</p>',
        type: 'prose',
      },
      {
        heading: 'The 3-2-1 Pattern',
        content: '<p><strong>3 emails, 2 LinkedIn touches, 1 phone call.</strong> Spread over 14 days.</p><ul><li>Day 1: Email 1 (value-first, no ask)</li><li>Day 3: LinkedIn connect request (personalized note)</li><li>Day 5: Email 2 (case study or specific insight)</li><li>Day 8: LinkedIn message (reference the email)</li><li>Day 10: Email 3 (direct ask, calendar link)</li><li>Day 14: Phone call (if engaged but no reply)</li></ul><p>This isn\'t gospel. Adjust based on your ICP. Enterprise prospects need more breathing room. SMB founders respond faster to direct asks.</p>',
        type: 'pattern',
      },
    ],
    related: ['sequence-timing', 'linkedin-steps'],
    difficulty: 'beginner',
  },
  {
    id: 'campaign-vs-sequence',
    title: 'Campaign vs Sequence Mental Model',
    subtitle: 'Campaigns hold leads. Sequences hold steps. Get the hierarchy right.',
    category: 'core-concepts',
    description: 'Understanding Lemlist campaign and sequence hierarchy - how campaigns contain leads and sequences contain steps, and why this distinction matters for your outreach architecture.',
    keywords: ['lemlist campaign', 'lemlist sequence', 'campaign vs sequence', 'outreach hierarchy'],
    sections: [
      {
        heading: 'The Hierarchy',
        content: '<p>Campaign = container. It holds your leads, settings, and tracking. Sequence = the steps inside that campaign - the emails, LinkedIn actions, delays, and conditions.</p><p>Think of it like a playlist vs songs. The campaign is the playlist (audience + rules). The sequence is the tracklist (what happens and when).</p>',
        type: 'prose',
      },
      {
        heading: 'One Campaign Per ICP Segment',
        content: '<p>Don\'t dump 500 leads from different ICPs into one campaign. Split by persona. VP of Sales gets different messaging than Head of Growth. Different pain points, different proof points, different CTAs.</p><p>This also makes A/B testing meaningful. You\'re comparing apples to apples instead of blending signals across personas.</p>',
        type: 'pattern',
      },
    ],
    related: ['multichannel-architecture', 'ab-testing'],
    difficulty: 'beginner',
  },
  {
    id: 'lead-management',
    title: 'Lead Management & Deduplication',
    subtitle: 'Stop emailing the same person from three campaigns. Lemlist handles this if you set it up.',
    category: 'core-concepts',
    description: 'How to manage leads across multiple Lemlist campaigns - deduplication rules, blocklists, and preventing overlap between concurrent campaigns.',
    keywords: ['lemlist leads', 'lead deduplication', 'blocklist', 'lead management outreach'],
    sections: [
      {
        heading: 'Built-in Dedup',
        content: '<p>Lemlist deduplicates by email address across your entire workspace. If a lead is already in an active campaign, they won\'t be added to a second one. This is on by default - don\'t turn it off.</p><p>The edge case: same person, different email. Company email in Campaign A, personal email in Campaign B. Lemlist can\'t catch this. Your enrichment layer (Clay, Apollo) should dedupe by domain before handoff.</p>',
        type: 'pro-tip',
      },
    ],
    related: ['campaign-vs-sequence', 'clay-to-lemlist'],
    difficulty: 'beginner',
  },

  /* ── sequences ── */
  {
    id: 'sequence-timing',
    title: 'Sequence Timing & Delay Strategy',
    subtitle: 'When to wait 2 days vs 5 days between touches. The answer depends on your ICP.',
    category: 'sequences',
    description: 'Optimal delay timing between Lemlist sequence steps for different ICP segments - SMB, mid-market, and enterprise cadence patterns.',
    keywords: ['lemlist timing', 'sequence delay', 'outreach cadence', 'follow-up timing'],
    sections: [
      {
        heading: 'Timing by Segment',
        content: '<p><strong>SMB / Founders:</strong> 2-3 day gaps. They\'re moving fast, decisions happen quickly, and your email drops below the fold in 48 hours.</p><p><strong>Mid-Market:</strong> 3-4 day gaps. More stakeholders, longer eval cycles, but still responsive to well-timed follow-ups.</p><p><strong>Enterprise:</strong> 5-7 day gaps. Patience is the play. These people get 200 emails a day. Shorter gaps look desperate.</p>',
        type: 'pattern',
      },
      {
        heading: 'Send Window Matters More Than Gaps',
        content: '<p>The gap between emails matters less than <em>when</em> those emails land. Lemlist lets you set send windows per campaign. Use them.</p><p>B2B sweet spot: Tuesday-Thursday, 8-10am recipient\'s timezone. Monday is inbox-clearing day. Friday is checked-out day. Controversial take: Sunday evening 7-8pm works surprisingly well for founders.</p>',
        type: 'pro-tip',
      },
    ],
    related: ['multichannel-architecture', 'ab-testing'],
    difficulty: 'intermediate',
  },
  {
    id: 'linkedin-steps',
    title: 'LinkedIn Steps in Sequences',
    subtitle: 'Native LinkedIn actions inside Lemlist. Profile visits, connects, and messages without switching tabs.',
    category: 'sequences',
    description: 'How to use Lemlist native LinkedIn integration for profile visits, connection requests, and InMail as part of multichannel outreach sequences.',
    keywords: ['lemlist linkedin', 'linkedin outreach', 'linkedin automation', 'multichannel linkedin'],
    sections: [
      {
        heading: 'Available LinkedIn Actions',
        content: '<p>Lemlist supports three LinkedIn step types:</p><ul><li><strong>Profile Visit</strong> - Silent touch. They see you viewed their profile. Good as a pre-email warm-up.</li><li><strong>Connection Request</strong> - With personalized note (300 char limit). Don\'t waste it on "I\'d love to connect."</li><li><strong>LinkedIn Message</strong> - Only works if already connected. Use after connection is accepted.</li></ul>',
        type: 'prose',
      },
      {
        heading: 'The Warm-Up Sequence',
        content: '<p>Day 0: LinkedIn profile visit (silent). Day 1: Email 1. Day 3: LinkedIn connect with personalized note referencing your email topic. Day 5: Email 2.</p><p>The profile visit before the first email creates a subtle familiarity signal. They\'ve seen your name before they open your email. Small edge, but edges compound.</p>',
        type: 'pattern',
      },
    ],
    related: ['multichannel-architecture', 'sequence-timing'],
    difficulty: 'intermediate',
  },
  {
    id: 'ab-testing',
    title: 'A/B Testing in Sequences',
    subtitle: 'Test subject lines, not entire emails. One variable at a time or the data is useless.',
    category: 'sequences',
    description: 'How to run meaningful A/B tests in Lemlist sequences - what to test, sample sizes, and avoiding the most common testing mistakes in outreach.',
    keywords: ['lemlist ab testing', 'email ab test', 'outreach testing', 'subject line testing'],
    sections: [
      {
        heading: 'What to Test (In Order)',
        content: '<p>1. <strong>Subject lines</strong> - Highest leverage. Same email body, different subject. Need 100+ sends per variant for significance.</p><p>2. <strong>Opening line</strong> - Personalized vs generic opener. This is your second-highest leverage point.</p><p>3. <strong>CTA</strong> - Calendar link vs "reply with a time" vs question. Test this after you\'ve optimized open rates.</p><p>4. <strong>Send time</strong> - Morning vs afternoon. Only test this with 200+ sends per variant.</p>',
        type: 'pattern',
      },
      {
        heading: 'The Most Common Testing Mistake',
        content: '<p>Changing the subject line AND the email body AND the CTA between variants. Now you have no idea what moved the needle. One variable. Always one variable.</p><p>Lemlist makes it easy to create variants at each step. Use step-level A/B, not campaign-level duplication.</p>',
        type: 'anti-pattern',
      },
    ],
    related: ['sequence-timing', 'campaign-vs-sequence'],
    difficulty: 'intermediate',
  },

  /* ── deliverability ── */
  {
    id: 'domain-warmup',
    title: 'Domain Warm-Up Strategy',
    subtitle: 'New domain? Send 5 emails day one, not 500. Lemwarm handles this.',
    category: 'deliverability',
    description: 'How to warm up a new sending domain using Lemwarm - ramp schedules, reputation building, and when your domain is ready for production volume.',
    keywords: ['domain warmup', 'lemwarm', 'email warmup', 'sender reputation', 'domain reputation'],
    sections: [
      {
        heading: 'Lemwarm Basics',
        content: '<p>Lemwarm is Lemlist\'s built-in warm-up tool. It sends and receives emails between real inboxes in Lemlist\'s warm-up network. The emails get opened, replied to, and moved out of spam - all signals that tell email providers your domain is legitimate.</p><p>Turn it on day one when you set up a new domain. Keep it running even after you start campaigns. Warm-up volume supplements your sending volume and maintains reputation.</p>',
        type: 'prose',
      },
      {
        heading: 'Ramp Schedule',
        content: '<p><strong>Week 1-2:</strong> Lemwarm only. Zero campaign emails. Let the domain build baseline reputation.</p><p><strong>Week 3:</strong> Start with 10-15 campaign emails per day. Lemwarm still running.</p><p><strong>Week 4:</strong> Scale to 25-30 per day if bounce rate stays under 3%.</p><p><strong>Week 5+:</strong> Full volume (50-75 per inbox per day max). Never exceed this regardless of how "warm" you think you are.</p>',
        type: 'pattern',
      },
    ],
    related: ['inbox-rotation', 'bounce-management'],
    difficulty: 'beginner',
  },
  {
    id: 'inbox-rotation',
    title: 'Inbox Rotation & Sender Distribution',
    subtitle: 'Multiple sending accounts, one campaign. Spread the load to protect each inbox.',
    category: 'deliverability',
    description: 'How to set up inbox rotation in Lemlist to distribute sending volume across multiple email accounts and protect sender reputation.',
    keywords: ['inbox rotation', 'sender rotation', 'email rotation', 'multiple senders', 'lemlist rotation'],
    sections: [
      {
        heading: 'Why Rotate',
        content: '<p>One inbox sending 200 emails a day = spam folder. Four inboxes sending 50 each = inbox. The math is simple but most teams skip it because setting up multiple accounts feels like overhead.</p><p>Lemlist lets you attach multiple sending accounts to a single campaign and automatically rotates between them. Set it up once, forget about it.</p>',
        type: 'prose',
      },
      {
        heading: 'Setup Pattern',
        content: '<p>For every 50 emails/day you want to send, provision one inbox. Naming convention: <code>shawn@</code>, <code>shawn.t@</code>, <code>s.tenam@</code> on the same domain or redirect domains.</p><p>Each inbox gets its own Lemwarm warm-up. Each inbox maxes at 50-75 sends per day. Lemlist distributes evenly across all connected accounts.</p>',
        type: 'pattern',
      },
    ],
    related: ['domain-warmup', 'bounce-management'],
    difficulty: 'intermediate',
  },
  {
    id: 'bounce-management',
    title: 'Bounce Rate & List Hygiene',
    subtitle: 'Over 3% bounce rate? Stop sending. Fix your list. Then resume.',
    category: 'deliverability',
    description: 'Managing bounce rates in Lemlist campaigns - acceptable thresholds, verification workflows, and how to maintain list hygiene for sustained deliverability.',
    keywords: ['bounce rate', 'email bounce', 'list hygiene', 'email verification', 'deliverability'],
    sections: [
      {
        heading: 'The 3% Rule',
        content: '<p>Keep bounce rate under 3%. Period. Over 5% and email providers start throttling your domain. Over 8% and you\'re heading for the spam folder across the board.</p><p>Lemlist auto-pauses leads that hard bounce. But prevention beats treatment - verify emails before they enter your campaign.</p>',
        type: 'pattern',
      },
      {
        heading: 'Verification Before Handoff',
        content: '<p>Your enrichment tool (Clay, Apollo) should verify emails before pushing to Lemlist. Accept only "valid" and "catch-all" status. Reject "invalid" and "unknown."</p><p>Catch-all domains (common in enterprise) won\'t bounce but also won\'t verify. Accept them but monitor bounce rates on enterprise campaigns more closely.</p>',
        type: 'pro-tip',
      },
    ],
    related: ['domain-warmup', 'inbox-rotation'],
    difficulty: 'beginner',
  },

  /* ── integrations ── */
  {
    id: 'clay-to-lemlist',
    title: 'Clay to Lemlist Pipeline',
    subtitle: 'Enriched, scored, verified leads flowing straight into personalized sequences.',
    category: 'integrations',
    description: 'How to build a Clay-to-Lemlist pipeline that pushes enriched and verified leads into personalized outreach sequences with custom variables.',
    keywords: ['clay lemlist', 'clay to lemlist', 'enrichment to outreach', 'outreach pipeline'],
    sections: [
      {
        heading: 'The Handoff Architecture',
        content: '<p>Clay enriches. Lemlist executes. The handoff happens via Lemlist\'s API or Clay\'s native Lemlist integration.</p><p>Key fields to pass: email, first name, company, custom variables for personalization (industry, tech stack, recent news). The more context you push from Clay, the less manual work in Lemlist.</p>',
        type: 'pattern',
      },
      {
        heading: 'Custom Variables Are Everything',
        content: '<p>Don\'t just push name and email. Push the enrichment output. Company size tier, tech stack matches, recent funding, mutual connections - all as custom variables that your email templates can reference.</p><p><code>Hey {{firstName}}, saw {{companyName}} just {{recentEvent}}...</code> - this hits different than a generic opener because it\'s actually specific.</p>',
        type: 'pro-tip',
      },
    ],
    related: ['lead-management', 'webhook-automation'],
    difficulty: 'intermediate',
  },
  {
    id: 'crm-sync',
    title: 'CRM Sync Patterns',
    subtitle: 'Lemlist to HubSpot/Attio sync. Keep outreach activity in your CRM without manual entry.',
    category: 'integrations',
    description: 'Patterns for syncing Lemlist campaign activity to your CRM - HubSpot, Attio, and webhook-based approaches for tracking outreach alongside pipeline data.',
    keywords: ['lemlist crm sync', 'lemlist hubspot', 'lemlist attio', 'outreach crm integration'],
    sections: [
      {
        heading: 'What to Sync',
        content: '<p>Sync these events from Lemlist to your CRM: email sent, email opened, email replied, link clicked, lead unsubscribed. Don\'t sync bounces - handle those in Lemlist.</p><p>For HubSpot: use Lemlist\'s native integration. For Attio or other CRMs: use webhooks + a lightweight handler.</p>',
        type: 'pattern',
      },
    ],
    related: ['clay-to-lemlist', 'webhook-automation'],
    difficulty: 'intermediate',
  },
  {
    id: 'webhook-automation',
    title: 'Webhook Automation',
    subtitle: 'React to Lemlist events in real-time. Reply received? Trigger your next move automatically.',
    category: 'integrations',
    description: 'Using Lemlist webhooks to trigger automations on campaign events - reply notifications, lead scoring updates, and CRM activity logging.',
    keywords: ['lemlist webhooks', 'outreach automation', 'email webhook', 'campaign automation'],
    sections: [
      {
        heading: 'Key Webhook Events',
        content: '<p>Lemlist fires webhooks on: <code>emailsSent</code>, <code>emailsOpened</code>, <code>emailsClicked</code>, <code>emailsReplied</code>, <code>emailsBounced</code>, <code>emailsUnsubscribed</code>.</p><p>The highest-value automation: on <code>emailsReplied</code>, create a CRM task and notify your team in Slack. Replies are the signal that matters - everything else is vanity.</p>',
        type: 'pattern',
      },
    ],
    related: ['crm-sync', 'clay-to-lemlist'],
    difficulty: 'advanced',
  },
]

/* ── helper ─────────────────────────────────────────── */

export function getLemlistWikiEntry(slug: string): LemlistWikiEntry | undefined {
  return LEMLIST_WIKI_ENTRIES.find((e) => e.id === slug)
}

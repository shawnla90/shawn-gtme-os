'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── types ───────────────────────────────────────── */

export interface GTMTerm {
  id: string
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  related: string[]
}

export interface GTMCategory {
  id: string
  name: string
  prompt: string
  terms: GTMTerm[]
}

/* ── content data ────────────────────────────────── */

export const GTM_CATEGORIES: GTMCategory[] = [
  {
    id: 'email-campaigns',
    name: 'Email Campaigns',
    prompt: '$ ls ~/gtm-os/email-campaigns/',
    terms: [
      {
        id: 'sequence',
        name: 'Sequence',
        definition:
          'A series of emails sent automatically over time to the same contact. Email 1 on day 0, email 2 on day 3, email 3 on day 7.',
        whyItMatters:
          "Manual follow-ups don't scale. You're not going to remember to email 200 people three days apart. Sequences turn \"I should follow up\" into \"the system follows up.\"",
        howYouUseIt:
          'In Instantly or HeyReach, I set up 2-3 email sequences for each campaign. Email 1 is the opener with an icebreaker and value. Email 2 is a short callback with a company-specific pain point. Email 3 (if I use one) is the breakup email — "looks like timing\'s off, circling back in Q3." The sequence runs. I check replies.',
        related: ['cadence', 'follow-up', 'merge-fields'],
      },
      {
        id: 'cadence',
        name: 'Cadence',
        definition:
          'The timing between touches in a sequence. Day 0, day 3, day 7. How long you wait before the next email.',
        whyItMatters:
          "Too fast feels spammy. Too slow loses momentum. The right cadence balances persistence with patience. Most tools default to day 2, day 4, day 6 — which feels robotic. Real humans don't follow up 48 hours apart on the dot.",
        howYouUseIt:
          "I default to 3-day gaps for email sequences. Email 1, wait 3 days, email 2, wait 4-5 days, email 3. Not symmetrical. Not immediate. Feels more like someone actually checking back in versus an automated drip. When it's multi-channel (LinkedIn + email), I stagger them — LinkedIn message day 1, email day 3, LinkedIn follow-up day 6.",
        related: ['sequence', 'follow-up', 'deliverability'],
      },
      {
        id: 'follow-up',
        name: 'Follow-up',
        definition:
          'Any message sent after the first one. The second email. The third. The reply to "not now."',
        whyItMatters:
          "Most deals don't happen on the first touch. Most replies don't either. SDRs who don't follow up lose 80% of their pipeline. The follow-up is where the actual conversion happens — not the opener.",
        howYouUseIt:
          "In every campaign I write, the follow-up does more work than email 1. Email 1 introduces. Email 2 reinforces with a pain point or proof. If they don't reply, email 3 closes the loop so it doesn't feel abandoned. I also use \"manual follow-up\" as a routing step — if a lead is warm but not ready, I flag them for a personalized follow-up later instead of auto-nurture.",
        related: ['sequence', 'cadence', 'personalization'],
      },
      {
        id: 'deliverability',
        name: 'Deliverability',
        definition:
          'Whether your emails actually land in the inbox (not spam, not promotions, not nowhere).',
        whyItMatters:
          "I learned this the hard way. when I was an SDR, I sent 200+ emails a day from primary domains with zero warmup. no one told me about deliverability. I thought if the email sent, it worked. then I started checking spam folders. half my emails were there. I was torching my domain reputation and didn't even know it. now I obsess over deliverability before I obsess over copy. because the best email in the world doesn't matter if no one sees it.",
        howYouUseIt:
          "I check MX records before routing contacts to email platforms. Google Workspace domains go to Instantly (because that's where I have Google-only sending infrastructure). Non-Google domains go to HeyReach on LinkedIn because I can't reliably deliver to Microsoft 365 or other providers from my Instantly setup. I also monitor bounce rates. If a campaign hits >5% hard bounces, something's broken upstream — usually the email provider or MX routing. I learned to fix the plumbing before I write the copy.",
        related: ['mx-record', 'domain-warming', 'enrichment', 'instantly'],
      },
      {
        id: 'spin-text',
        name: 'Spin Text',
        definition:
          'Randomized word/phrase variations in email copy so each message reads slightly different. "I noticed" vs "I saw" vs "I came across." Prevents identical emails across a campaign.',
        whyItMatters:
          "If 100 people get the exact same email word-for-word, and they all report it as spam, email providers notice. The pattern looks automated (because it is). Spin text breaks the fingerprint. Deliverability stays higher. It also just reads more human — real people don't copy-paste the same opener 200 times.",
        howYouUseIt:
          'I don\'t overuse it. Most of my campaigns have 2-3 spin variations max per email. Subject lines get spin text. First sentence gets spin text. The rest stays consistent. Too much spin and the message loses coherence. The goal is "human variation," not "random Mad Libs."',
        related: ['deliverability', 'sequence', 'merge-fields'],
      },
      {
        id: 'merge-fields',
        name: 'Merge Fields',
        definition:
          'Placeholders in email templates that get replaced with actual data when the email sends. {first_name}, {company_name}, {icebreaker}.',
        whyItMatters:
          "Merge fields turn one template into 1,000 personalized emails. You write the structure once. The platform fills in the variables per contact. Without merge fields, you're copy-pasting names manually. With them, you're running campaigns at scale.",
        howYouUseIt:
          "Every campaign I build has 4-6 merge fields. {first_name} and {company_name} come from Clay enrichment. {icebreaker} and {pain_point} come from a Clay research prompt I write specifically for that campaign. The prompt embeds the full email bodies so the AI knows where the variables land and writes them to fit naturally in context. Merge fields aren't magic — they're only as good as the data and prompts that generate them.",
        related: ['personalization', 'variable', 'research-prompt', 'icebreaker'],
      },
    ],
  },
  {
    id: 'outreach-platforms',
    name: 'Outreach Platforms',
    prompt: '$ ls ~/gtm-os/outreach/',
    terms: [
      {
        id: 'instantly',
        name: 'Instantly',
        definition:
          'Email campaign platform. Send sequences, track opens/replies, manage sending domains, warm inboxes, route leads.',
        whyItMatters:
          "Email still works if you do it right. I use Instantly because it handles the part I used to do manually as an SDR — domain rotation, throttling, warmup, deliverability monitoring. back then, I was sending from one inbox with no infrastructure. now I'm sending from multiple domains with automated warmup and health checks. Instantly is the infrastructure layer between \"I wrote an email\" and \"500 people received it in their inbox.\"",
        howYouUseIt:
          "I route Google Workspace contacts to Instantly because that's the only MX provider my Instantly setup can reliably deliver to. I paste in the static email bodies (from campaign-copy.md), connect the merge fields to Clay columns, and launch. I check replies daily. Hard bounces and spam reports go back into Clay for enrichment debugging. Instantly doesn't write the emails or qualify the leads — that's all upstream in Clay. Instantly just sends. it's the deployment layer for email.",
        related: ['heyreach', 'deliverability', 'mx-record', 'sequence'],
      },
      {
        id: 'heyreach',
        name: 'HeyReach',
        definition:
          'LinkedIn outreach platform. Send connection requests, messages, and InMails at scale without manually clicking in Sales Navigator.',
        whyItMatters:
          "LinkedIn is locked down. You can't scrape it easily. You can't automate it without risking your account. HeyReach runs campaigns through real LinkedIn accounts (not bots) with natural delays and behavior patterns. It's the only way to do LinkedIn outbound at scale without getting banned.",
        howYouUseIt:
          "I route non-Google contacts to HeyReach because I can't reliably email them from Instantly. I also use it for accepted/unaccepted tracking — when someone accepts a connection request, HeyReach flags them, I export the CSV, run LinkedIn recon (browser-based profile scraping), and hand the enriched list to a caller. HeyReach doesn't qualify leads. It just executes the LinkedIn motion. Qualification happens upstream in Clay.",
        related: ['instantly', 'routing', 'linkedin-recon'],
      },
      {
        id: 'waterfall',
        name: 'Waterfall',
        definition:
          'A sequence of fallback providers tried in order until one succeeds. The traditional approach to email finding — stack 4-6 providers and hope one hits.',
        whyItMatters:
          "I used to run 6-provider waterfalls — Apollo → Hunter → Clearbit → RocketReach → Prospeo → Dropcontact. it felt thorough. but when I layered in MX-based routing (Google → Instantly, non-Google → HeyReach), I realized the waterfall logic made no sense. I was burning 8-12 credits per contact chasing marginal coverage gains, and validation still bounced anyway. the routing layer downstream made most of that effort pointless. so I stopped. now I use one provider, validate with MX records, and route. simpler. cheaper. same deliverability.",
        howYouUseIt:
          "I don't use waterfalls anymore. I go single-provider — Prospeo or LeadMagic — and check MX records instead of stacking fallback providers. if the single provider finds an email, I validate the domain's MX record (Google vs non-Google) and route: Google → Instantly, non-Google → HeyReach, no email → HeyReach for LinkedIn. the old waterfall burned credits trying to squeeze out emails that bounced anyway. single-provider + MX routing gets me the same result at a fraction of the cost. waterfalls are a concept worth understanding, but my philosophy is: don't use them.",
        related: ['enrichment', 'routing', 'deliverability', 'clay'],
      },
      {
        id: 'mx-record',
        name: 'MX Record',
        definition:
          'Mail exchange record. DNS setting that tells you which email provider a domain uses (Google, Microsoft, custom).',
        whyItMatters:
          "Not all email providers are equal. I can deliver reliably to Google Workspace from my Instantly setup. I can't deliver reliably to Microsoft 365 or custom Exchange servers. If I try, the emails bounce or land in spam. MX records let me route contacts to the right platform before I send. It's a filter, not a guess.",
        howYouUseIt:
          'In Clay, I use the HTTP API to check MX records on every contact\'s email domain. If the result contains "google.com," the contact routes to Instantly. If it contains "outlook" or "protection.outlook" or anything non-Google, the contact routes to HeyReach. This prevents wasted sends and preserves domain reputation. MX classification is Play 14 in my series — one of the highest ROI filters in the whole workflow.',
        related: ['deliverability', 'routing', 'instantly', 'waterfall'],
      },
      {
        id: 'domain-warming',
        name: 'Domain Warming',
        definition:
          "Gradually increasing sending volume from a new domain so email providers trust it and don't flag messages as spam.",
        whyItMatters:
          "If you register a domain today and send 500 emails tomorrow, they all land in spam. Email providers don't know you. You have no reputation. Domain warming builds that reputation by starting slow (10-20 emails/day), engaging with real inboxes (automated or manual), and scaling up over 2-4 weeks. By the time you hit full volume, the domain looks legit.",
        howYouUseIt:
          "Instantly has built-in warming. I enable it for every new sending domain. It sends low-volume emails between \"real\" mailboxes in the warming pool, replies are automated, and the system gradually ramps volume. I don't touch it. It just runs. After 3-4 weeks, I route real campaign traffic to that domain. If I skip warming, deliverability tanks immediately.",
        related: ['deliverability', 'instantly'],
      },
    ],
  },
  {
    id: 'data-operations',
    name: 'Data Operations',
    prompt: '$ ls ~/gtm-os/data-ops/',
    terms: [
      {
        id: 'clay',
        name: 'Clay',
        definition:
          'Data enrichment and automation platform. Find emails, validate companies, scrape LinkedIn, run AI research prompts, route contacts to CRMs and outreach tools. The orchestration layer for GTM.',
        whyItMatters:
          "Clay is where I went from manual SDR to GTM engineer. when I was building buying committees in Salesforce by hand, I was the orchestration layer. I was the one pulling emails from Apollo, checking LinkedIn, researching pain points, deciding who to target. Clay does all of that. but faster. and at scale. and without forgetting. everything I used to do in my head now lives in a Clay table. qualification, enrichment, personalization, routing. all of it.",
        howYouUseIt:
          "every play in my series uses Clay. web reveal → Clay table. qualification prompts → Clay. personalization research → Clay. single-provider email enrichment → Clay. MX record check → Clay. then Clay syncs qualified + enriched contacts to HubSpot or Instantly or HeyReach. I don't use Clay for CRM. I use it for everything that makes the CRM data actually useful. it's the brain. the CRM is just the notebook.",
        related: ['enrichment', 'claygent', 'routing', 'web-reveal', 'hubspot'],
      },
      {
        id: 'enrichment',
        name: 'Enrichment',
        definition:
          'Adding data to a contact or company record. Find their email, pull their LinkedIn profile, grab their tech stack, scrape recent posts, validate their title.',
        whyItMatters:
          "You can't personalize with incomplete data. You can't qualify without firmographics. You can't route without an email address. Enrichment turns \"name + domain\" into a full actionable record. It's the difference between \"spray and pray\" and \"targeted and relevant.\"",
        howYouUseIt:
          "I run single-provider enrichment in Clay — one email provider (Prospeo or LeadMagic), not a 6-provider waterfall. I used to stack all the providers. I stopped because the routing logic made it pointless — once you check MX records and route Google vs non-Google, the marginal coverage from extra providers doesn't matter. I pull LinkedIn profiles when available. I scrape company posts with Apify. I validate job titles against persona tiers. I check MX records for routing. I run research prompts to generate icebreakers and pain points. All of that is enrichment. It happens before the contact moves downstream.",
        related: ['clay', 'routing', 'personalization', 'validation'],
      },
      {
        id: 'claygent',
        name: 'Claygent',
        definition:
          'AI agent inside Clay that browses the web, reads pages, extracts data, and returns structured answers. Think of it as ChatGPT with a browser, running inside a Clay table column.',
        whyItMatters:
          "Manual research doesn't scale. You can't visit 500 websites and summarize positioning by hand. Claygents do it for you. They read markdown, analyze content, extract signals, and output JSON. They're also expensive (credit cost) and unreliable (hallucination risk), so you validate everything.",
        howYouUseIt:
          "I use Claygents for LinkedIn post analysis (Play 10), competitive intelligence (Play 11), and full-site markdown research (Play 12). I don't use them for simple lookups — that's what enrichment providers are for. I use them when I need reasoning and extraction from unstructured content. I also run a 6-step validation system before I scale any Claygent column: test on 5 rows, check for hallucinations, enforce JSON schema, score confidence, cap credit spend.",
        related: ['clay', 'enrichment', 'validation', 'research-prompt'],
      },
      {
        id: 'sculptor',
        name: 'Sculptor',
        definition:
          'AI deduplication tool inside Clay. You give it messy data (company names with typos, multiple formats, edge cases) and it groups duplicates intelligently without you writing complex formulas.',
        whyItMatters:
          'Most deduplication is basic: exact match on email or domain. But what if the same company appears as "Microsoft," "Microsoft Corporation," and "MSFT"? Formula-based dedupe misses it. Sculptor catches it. It\'s AI-powered fuzzy matching without manual rules.',
        howYouUseIt:
          "I use Sculptor for enterprise dedupe (Play 15). When I'm enriching a big list and multiple contacts come from the same parent company, I use Sculptor to group them by company, then dedupe within each subset. It's also useful for cleaning messy imports where the same lead appears 3 times with slight name variations. Sculptor groups them. I keep the best record.",
        related: ['clay', 'validation'],
      },
      {
        id: 'validation',
        name: 'Validation',
        definition:
          'Checking if data is real, accurate, and usable before you act on it. Email validation (does it exist?), persona validation (does the title match?), company validation (do they fit ICP?), Claygent validation (did the AI hallucinate?).',
        whyItMatters:
          "Bad data kills campaigns. If 20% of your emails are invalid, your bounce rate tanks deliverability. If your AI-generated icebreakers are fabricated, your reply rate goes to zero and you look like an idiot. Validation is the filter between \"data exists\" and \"data is trustworthy.\"",
        howYouUseIt:
          "I validate emails with MX records — not by stacking providers in a waterfall. single provider finds the email, MX record confirms the domain's mail server, routing logic takes it from there. I validate personas by running job titles through a qualification prompt that checks them against tier definitions. I validate companies with a scoring prompt that checks firmographics against ICP. I validate Claygent outputs with a 6-step checklist: row sample → hallucination check → JSON schema → confidence scoring → credit cap → scale. Validation happens at every layer. It's not one tool. It's a discipline.",
        related: ['enrichment', 'qualification', 'claygent', 'icp'],
      },
    ],
  },
  {
    id: 'personalization',
    name: 'Personalization',
    prompt: '$ ls ~/gtm-os/personalization/',
    terms: [
      {
        id: 'icebreaker',
        name: 'Icebreaker',
        definition:
          'The opening line of a cold email that proves you researched the person. A specific observation, recent activity, shared interest, or company signal. Not "I see you\'re in SaaS." More like "saw your post on signal-based SDR workflows last week."',
        whyItMatters:
          "when I was an SDR sending 200 emails a day, I didn't have time for icebreakers. every email started the same. \"Hey [name], I noticed you're a VP at [company]...\" and they all got ignored. because everyone could tell I didn't actually look. now I automate the research part so the icebreaker is real. generic openers get deleted. specific icebreakers get replies. the first sentence is the filter.",
        howYouUseIt:
          "every campaign I build has an {icebreaker} merge field in email 1. I don't write the icebreakers manually anymore. I write a Clay research prompt that pulls LinkedIn profiles, recent posts, and headline data, then generates 1-2 sentence icebreakers that reference something specific. the prompt embeds the full email body so the AI knows where the icebreaker lands and writes it to flow naturally. if the profile is thin, the prompt falls back to company-level signals instead of making things up. I learned to automate the research I used to skip when I was rushing to hit quota.",
        related: ['personalization', 'research-prompt', 'merge-fields', 'variable'],
      },
      {
        id: 'variable',
        name: 'Variable',
        definition:
          'A placeholder in a template that gets replaced with dynamic content. Same as merge field, but "variable" is the Clay/AI terminology. {icebreaker}, {pain_point}, {company_name}.',
        whyItMatters:
          "Variables let you scale personalization. You write the structure once, the AI generates the content per contact, and the platform merges it in. Without variables, you're writing 500 unique emails. With variables, you're writing one template and filling 500 blanks intelligently.",
        howYouUseIt:
          'I define variables in my campaign research prompts. Each prompt outputs a JSON array with fields like icebreaker, pain_point, service_fit, confidence. Those become columns in Clay. Then I map them to merge fields in Instantly or HeyReach. The variable names have to match exactly — if the prompt outputs pain_point but the email references {pain_signal}, the merge breaks. Naming consistency matters.',
        related: ['merge-fields', 'icebreaker', 'research-prompt'],
      },
      {
        id: 'research-prompt',
        name: 'Research Prompt',
        definition:
          'An AI prompt (usually in Clay) that takes enriched data (LinkedIn profile, company domain, job title) and generates personalization variables (icebreaker, pain point, service fit) for outbound campaigns.',
        whyItMatters:
          "You can't manually research 500 contacts. The research prompt does it for you. It reads the LinkedIn \"About\" section, scans recent posts, checks the company domain, and outputs 2-3 personalized hooks per contact. It's the automation layer between \"raw data\" and \"usable copy.\"",
        howYouUseIt:
          'I write one research prompt per campaign. The prompt embeds the full email bodies so the AI knows exactly where each variable appears and writes them to read naturally in context. I define strict rules for each variable (icebreaker = recent post or profile headline, no fabrication; pain_point = company-level signal, not contact-level guess). The prompt outputs JSON with fields that map to merge fields in the email. I test it on 5 rows, check for hallucinations, then scale. Research prompts are the bridge between enrichment and sending.',
        related: ['icebreaker', 'variable', 'claygent'],
      },
      {
        id: 'dynamic-fields',
        name: 'Dynamic Fields',
        definition:
          'Content blocks in emails or messages that change based on recipient data. Could be variables (icebreaker, company name), conditional logic (if title = VP, say X; if title = Director, say Y), or triggered insertions (if recent funding, mention growth).',
        whyItMatters:
          "Static emails don't convert at scale. Dynamic fields let you personalize without writing 50 versions of the same email. The template structure stays the same, but the details shift per contact. It's how you get \"mass personalization\" without it feeling mass.",
        howYouUseIt:
          "Most of my dynamic fields are simple variables ({first_name}, {icebreaker}). Occasionally I use conditional logic in Clay before the email sends — if persona tier = 1-2, route to high-priority sequence; if tier = 3-4, route to standard sequence. If company score < 6, skip entirely. The \"dynamic\" part happens in Clay. By the time the email reaches Instantly, the content is already personalized and locked in.",
        related: ['variable', 'merge-fields', 'routing'],
      },
      {
        id: 'pain-point-signal',
        name: 'Pain Point Signal',
        definition:
          'A data point or observation that indicates a problem the contact\'s company is facing. Recent leadership change. Outdated tech stack. Competitor mention in job postings. Declining search traffic.',
        whyItMatters:
          'Generic pain points don\'t work. "I know scaling is hard" gets ignored. Specific pain signals get replies. If I can point to a real, observable problem (your company just posted 5 SDR roles, your site runs on outdated infrastructure, your competitor is outranking you in search), the email feels less like a cold pitch and more like "how did you know?"',
        howYouUseIt:
          "I pull pain signals from enrichment and research. LinkedIn post scraping (Apify) shows what the company is talking about publicly. Semrush shows search traffic drops or competitor gaps. Job postings show hiring urgency. Tech stack data shows legacy tools. I feed all of that into a research prompt that extracts 1-2 pain signals per company, then uses them in the {pain_point} variable in email 2. The signal has to be real. If I can't prove it, I don't use it.",
        related: ['research-prompt', 'enrichment', 'signals'],
      },
      {
        id: 'poke-the-bear',
        name: 'Poke the Bear',
        definition:
          "A personalization variable that challenges a contact's current approach or status quo. Different from an icebreaker (observational) and a pain point (problem identification). Poke the bear is a pattern interrupt.",
        whyItMatters:
          "not everyone is ready to buy. but that doesn't mean they're not ready to know you exist. if you can't sell to your ICP right now, at least educate them. the poke the bear variable is how you stay on their radar without being pushy. it's the middle ground between \"here's our demo\" and \"never mind.\" it keeps the conversation open.",
        howYouUseIt:
          'I have three favorite custom variables — {icebreaker}, {poke_the_bear}, and {pain_point}. I split them across a three-email sequence. email 1 gets the icebreaker (observational, personal). email 2 gets the poke the bear (challenging, thought-provoking). email 3 gets the pain point (problem-focused, specific). this works especially well for low-hanging fruit — leads that fit ICP but aren\'t high priority.',
        related: ['icebreaker', 'pain-point-signal', 'variable', 'sequence'],
      },
      {
        id: 'signals',
        name: 'Signals',
        definition:
          'Data points that indicate intent, fit, or timing. Funding announcements, job postings, tech stack changes, web visits, content downloads, competitor mentions, G2 reviews. Anything that suggests "this company is worth talking to right now."',
        whyItMatters:
          "not all signals are created equal. some are unique and actionable. some are overrated noise that everyone's already using. the signal itself doesn't matter as much as what you can offer based on it. my guiding principle: rather than obsessing over the perfect signal, focus on what you can give them that's low-hanging fruit and actually valuable.",
        howYouUseIt:
          "I always spec out signals when working on an account. what signals are actually unique for this ICP? what can I pull that competitors aren't using? for example, if I'm selling to marketers, I pull competitor intelligence (who's outranking them in search, what topics their competitors are writing about). I pull G2 reviews (what their customers are complaining about). I pull job postings (are they hiring SDRs? are they scaling a new team?). those are unique signals. funding announcements? everyone sees those. that's overrated.",
        related: ['pain-point-signal', 'web-reveal', 'enrichment'],
      },
    ],
  },
  {
    id: 'qualification',
    name: 'Qualification',
    prompt: '$ ls ~/gtm-os/qualification/',
    terms: [
      {
        id: 'icp',
        name: 'ICP',
        definition:
          'Ideal Customer Profile. The type of company you\'re targeting. Industry, size, revenue, tech stack, geography, maturity stage. "Who\'s a fit?"',
        whyItMatters:
          "If you don't know your ICP, you're guessing. You waste time on companies that will never buy. You burn budget on enrichment and outreach for leads that don't qualify. ICP is the filter that separates signal from noise before you spend a dollar.",
        howYouUseIt:
          'Every partner I work with has an icp.md file in their research folder. It defines firmographics (employee count, revenue, industry), qualification criteria (must have Atlassian footprint, must have 1,000-20,000 units under management), and scoring thresholds (8-10 = qualified, 6-7 = needs research, <6 = skip). I use that ICP to build a company qualification prompt in Clay. The prompt evaluates every company against those criteria and outputs a score + reasoning. Only qualified companies move downstream.',
        related: ['persona', 'scoring', 'web-reveal'],
      },
      {
        id: 'persona',
        name: 'Persona',
        definition:
          'The type of person you\'re targeting within a company. Job title, department, seniority. "Who do we talk to?"',
        whyItMatters:
          "You can target the right company and still lose if you're talking to the wrong person. Personas define who has budget, authority, pain, and interest. A VP of Sales cares about pipeline. A Director of Ops cares about efficiency. Same company, different pitch.",
        howYouUseIt:
          'Every partner has a personas.md file with 3-5 tiers. Tier 1 = primary buyers (VP Sales, CRO). Tier 2 = secondary decision-makers (Director Sales Ops). Tier 3 = influencers (SDR Manager). Tier 4-5 = edge cases or champions. I use those tiers in a persona qualification prompt that checks job titles and assigns outreach priority. Tier 1-2 = high priority, custom research. Tier 3 = standard sequence. Tier 4-5 = nurture or skip.',
        related: ['icp', 'routing', 'scoring'],
      },
      {
        id: 'web-reveal',
        name: 'Web Reveal',
        definition:
          'When someone visits your website and you capture their company, sometimes their identity, and route them into outbound workflows based on ICP fit.',
        whyItMatters:
          "Inbound interest is the warmest signal you can get. If someone from a target account visits your pricing page, they're researching. If you wait for them to fill out a form, you lose. Web reveal lets you capture that intent and act on it immediately — route qualified visitors into outreach, enrich contacts at that company, prioritize them in your pipeline.",
        howYouUseIt:
          "I use Vector + Midbound for web reveal. When a qualified company visits, the signal fires into Clay. Clay runs company qualification (does it fit ICP?), persona enrichment (find the right contacts), single-provider email lookup (get addresses), MX routing (Google → Instantly, non-Google → HeyReach), and personalization research (generate icebreakers referencing the site visit). Web reveal is Play 5. It's one of the highest-converting workflows because the intent signal is real.",
        related: ['icp', 'routing', 'signals'],
      },
      {
        id: 'routing',
        name: 'Routing',
        definition:
          'The logic that determines where a contact goes after qualification. Qualified + Google email → Instantly. Qualified + non-Google email → HeyReach. Not qualified → skip. Needs research → manual review.',
        whyItMatters:
          'Qualification without routing is useless. You know who\'s a fit — now what? Routing automates the "now what." It connects qualification to action. Instead of "this lead is good," it\'s "this lead is good AND going to the high-priority Instantly sequence AND getting handed to the AE."',
        howYouUseIt:
          'I build routing logic in Clay with formula columns and conditional filters. After company + persona qualification, I run a routing decision prompt that outputs: route (outreach / enrich_company / manual_review / skip), priority (high / medium / low), and next step. High-priority routes sync to HubSpot and Instantly. Medium routes go to standard sequences. Low goes to nurture. Manual_review gets flagged for human check. Routing is the bridge between "data in" and "action out."',
        related: ['icp', 'persona', 'routing'],
      },
      {
        id: 'scoring',
        name: 'Scoring',
        definition:
          'Assigning a numeric value to a company or contact based on how well they match your criteria. 0-10 scale. 8-10 = qualified, 6-7 = research, <6 = skip.',
        whyItMatters:
          "Binary yes/no qualification is too rigid. Scoring adds nuance. A company might be a 7 — not perfect, but close. Maybe they're missing one signal. Maybe they're in a gray-zone industry. Scoring lets you tier leads by strength instead of just pass/fail. It also lets you route by priority — 9-10 gets the premium sequence, 6-7 gets standard.",
        howYouUseIt:
          "I use scoring in company qualification prompts. The prompt checks firmographics (employee count, industry, tech stack) against ICP criteria and outputs a score (0-10), confidence (High/Medium/Low), and reasoning. I set thresholds per partner — some require 8+ to qualify, others accept 6+. I also use scoring for persona fit — Tier 1-2 = 8-10, Tier 3 = 5-7, Tier 4-5 = 3-4. Scoring makes qualification measurable instead of subjective.",
        related: ['icp', 'routing', 'persona'],
      },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    prompt: '$ ls ~/gtm-os/crm/',
    terms: [
      {
        id: 'properties',
        name: 'Properties',
        definition:
          'Custom fields in a CRM (HubSpot, Salesforce) that store data about contacts, companies, or deals. "Industry," "Employee Count," "ICP Score," "Last Outreach Date," "Lifecycle Stage."',
        whyItMatters:
          "when I was manually building buying committees in Salesforce, I didn't understand properties. I just filled in the default fields and hoped they were enough. they weren't. CRMs are useless without custom properties. they're just contact lists. properties turn them into databases. I learned this when a sales rep asked \"show me everyone we contacted in Q4 who didn't reply\" and I had to scroll through 2,000 records because we didn't have a last_outreach_date property.",
        howYouUseIt:
          'I create custom properties in HubSpot for every enrichment field that matters. icp_score (0-10), persona_tier (1-5), mx_provider (Google/Microsoft/Other), web_reveal_date, last_clay_sync. I map Clay columns to HubSpot properties in the sync so enriched data flows automatically. I also use properties to build views — "show me all contacts with icp_score >= 8 AND persona_tier <= 2 AND last_outreach_date is unknown." properties are the query language. learn them or drown in your own data.',
        related: ['views', 'lifecycle-stage', 'contact-object'],
      },
      {
        id: 'lifecycle-stage',
        name: 'Lifecycle Stage',
        definition:
          'A property in HubSpot that defines where a contact is in the sales process. Subscriber → Lead → MQL → SQL → Opportunity → Customer.',
        whyItMatters:
          "Lifecycle stages let you filter and automate by intent and readiness. You don't email a Customer the same way you email a Lead. You don't score an Opportunity the same way you score an MQL. Lifecycle stage is the primary segmentation axis in most CRMs.",
        howYouUseIt:
          'I sync qualified contacts from Clay into HubSpot as "Lead" by default. If they reply to outbound, they move to "MQL." If an AE qualifies them, they move to "SQL." If a deal opens, they move to "Opportunity." I use lifecycle stage in views — "show me all SQLs created this month" or "show me Leads with no outreach in 30 days." I don\'t manually update lifecycle. It\'s automated based on activity (reply = MQL, meeting booked = SQL).',
        related: ['properties', 'pipeline', 'views'],
      },
      {
        id: 'pipeline',
        name: 'Pipeline',
        definition:
          'The stages a deal moves through from open to close. Discovery → Demo → Proposal → Negotiation → Closed Won / Closed Lost.',
        whyItMatters:
          "Pipeline is how you track revenue. It's not enough to know \"we have 50 deals.\" You need to know where they are, how long they've been there, and what the next step is. Pipeline visibility is the difference between \"we're busy\" and \"we're forecasting $200k closing this quarter.\"",
        howYouUseIt:
          "I don't manage pipeline manually — that's the AE's job. But I do care about pipeline creation. When a qualified lead from Clay moves to SQL and an AE opens a deal, that deal enters the pipeline. I track \"deals created from web reveal\" vs \"deals created from cold outbound\" as separate sources so I know which workflows are actually driving revenue. Pipeline isn't a GTM engineer's daily tool, but it's the end goal. Everything upstream (qualification, enrichment, routing, personalization) exists to fill the pipeline with real opportunities.",
        related: ['lifecycle-stage', 'scoring'],
      },
      {
        id: 'views',
        name: 'Views',
        definition:
          'Saved filters in a CRM that show a specific segment of contacts, companies, or deals. "All MQLs created this week," "Companies with ICP score 8-10 and no outreach," "Deals in Discovery stage over 30 days."',
        whyItMatters:
          "Views turn a CRM from a database into a workspace. Without views, you're scrolling through thousands of records trying to find the ones that matter. With views, you click \"High-priority leads\" and see exactly who to call today. Views are how you operationalize your data.",
        howYouUseIt:
          'I build views in HubSpot based on properties. "ICP score >= 8 AND persona tier <= 2 AND last contacted is unknown" = outreach-ready leads. "Lifecycle stage = MQL AND create date is last 7 days" = fresh inbound. "Web reveal date is known AND deal associated is unknown" = intent signal with no follow-up. I don\'t create views for every possible filter. I create views for the 5-10 segments that matter daily. Views are shortcuts. Build them for the actions you repeat.',
        related: ['properties', 'lifecycle-stage'],
      },
      {
        id: 'contact-object',
        name: 'Contact Object',
        definition:
          'The database record type in a CRM that stores individual people. Name, email, title, company association, lifecycle stage, custom properties.',
        whyItMatters:
          "Contacts are the atomic unit of outbound. Companies are targets. Deals are revenue. But contacts are the people you actually email, call, and pitch. Understanding the contact object — what properties it has, how it syncs, what triggers updates — is the foundation of CRM hygiene.",
        howYouUseIt:
          "I sync enriched contacts from Clay to HubSpot contact objects. Each contact gets: email (primary key), first name, last name, job title, company association (linked to company object), persona tier, ICP score, enrichment date. I map Clay columns to HubSpot contact properties in the sync settings. I don't create duplicate contacts — Clay checks for existing emails before syncing. Contact objects are where all the enrichment and qualification data lives in the CRM. If the contact object is messy (duplicate emails, missing properties, stale data), the whole CRM breaks.",
        related: ['properties', 'lifecycle-stage'],
      },
    ],
  },
]

/* ── styles ──────────────────────────────────────── */

const pageWrapper: React.CSSProperties = {
  maxWidth: 1040,
  margin: '0 auto',
  padding: '40px 20px 60px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '32px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '16px',
  lineHeight: 1.3,
}

const heroBody: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
  maxWidth: 720,
}

const heroMuted: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-muted)',
  marginBottom: '32px',
  maxWidth: 720,
}

const twoColumnLayout: React.CSSProperties = {
  display: 'flex',
  gap: '48px',
  alignItems: 'flex-start',
}

const mainContent: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  maxWidth: 720,
}

const tocSidebar: React.CSSProperties = {
  width: 240,
  flexShrink: 0,
  position: 'sticky' as const,
  top: 24,
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto' as const,
}

const tocTitle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border)',
}

const tocCategoryLink: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  padding: '4px 0',
  marginTop: '12px',
  transition: 'color 0.15s ease',
}

const tocTermLink: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  padding: '2px 0 2px 12px',
  transition: 'color 0.15s ease',
  borderLeft: '1px solid transparent',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--accent)',
  fontWeight: 400,
  letterSpacing: '0.5px',
  marginBottom: '16px',
  fontFamily: 'var(--font-mono)',
}

const categoryTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '24px',
  lineHeight: 1.3,
}

const termCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
  transition: 'border-color 0.15s ease',
}

const termName: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
  letterSpacing: '0.02em',
}

const termDefinition: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.65,
  color: 'var(--text-primary)',
  marginBottom: '12px',
  fontWeight: 500,
}

const termLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '4px',
  marginTop: '12px',
}

const termBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
}

const relatedList: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '6px',
  marginTop: '12px',
}

const relatedTag: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '2px 8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease, color 0.15s ease',
  cursor: 'pointer',
}

const backLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

const ctaBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--accent)',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
}

const ctaTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
}

const ctaBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
}

const ctaSecondary: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 18px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 6,
  textDecoration: 'none',
  marginTop: '10px',
  transition: 'border-color 0.15s ease',
}

/* mobile TOC toggle */
const mobileTocToggle: React.CSSProperties = {
  display: 'none',
  width: '100%',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left' as const,
  marginBottom: '16px',
}

/* ── Component ───────────────────────────────────── */

export function GTMKnowledgeGuidePage() {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  /* build a flat list of all IDs (categories + terms) for the observer */
  const allIds = GTM_CATEGORIES.flatMap((cat) => [
    cat.id,
    ...cat.terms.map((t) => t.id),
  ])

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 24
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMobileTocOpen(false)
  }, [])

  /* scroll-spy via IntersectionObserver */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    const visibleEntries = new Map<string, boolean>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleEntries.set(entry.target.id, entry.isIntersecting)
        })

        /* find the topmost visible section */
        for (const id of allIds) {
          if (visibleEntries.get(id)) {
            setActiveId(id)
            return
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )

    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* find term name from id for related tag display */
  const termNameMap = new Map<string, string>()
  GTM_CATEGORIES.forEach((cat) =>
    cat.terms.forEach((t) => termNameMap.set(t.id, t.name)),
  )

  const termCount = GTM_CATEGORIES.reduce((n, c) => n + c.terms.length, 0)

  return (
    <>
      <style>{`
        .kg-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: kg-blink-kf 1s step-end infinite;
        }
        @keyframes kg-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .kg-term-card:hover {
          border-color: var(--accent) !important;
        }
        .kg-related-tag:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
        .kg-toc-cat:hover { color: var(--accent) !important; }
        .kg-toc-term:hover {
          color: var(--text-secondary) !important;
          border-left-color: var(--border) !important;
        }
        .kg-toc-active-cat { color: var(--accent) !important; }
        .kg-toc-active-term {
          color: var(--accent) !important;
          border-left-color: var(--accent) !important;
        }
        @media (max-width: 820px) {
          .kg-two-col { flex-direction: column !important; }
          .kg-toc-sidebar { display: none !important; }
          .kg-mobile-toc-toggle { display: block !important; }
          .kg-mobile-toc-content {
            background: var(--canvas-subtle);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 821px) {
          .kg-mobile-toc-toggle { display: none !important; }
          .kg-mobile-toc-content { display: none !important; }
        }
        /* scrollbar for TOC */
        .kg-toc-sidebar::-webkit-scrollbar { width: 4px; }
        .kg-toc-sidebar::-webkit-scrollbar-track { background: transparent; }
        .kg-toc-sidebar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
      `}</style>

      <div style={pageWrapper}>
        {/* ── Terminal header ── */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cat
          ~/gtm-os/knowledge.md
          <span className="kg-blink" />
        </h1>

        {/* ── Hero ── */}
        <section>
          <h2 style={heroTitle}>GTM OS Knowledge Guide</h2>
          <p style={heroBody}>
            it&apos;s 2026. you don&apos;t need to be an engineer, but you need
            to know these terms.
          </p>
          <p style={heroBody}>
            the vibe coders will take over. not AI. the people who speak both
            languages. the people who can look at a Clay table and a HubSpot
            view and see where the data should flow. who can debug a
            qualification prompt the same way they&apos;d debug a CRM property.
            who can build systems because they learned the vocabulary.
          </p>
          <p style={heroMuted}>
            {GTM_CATEGORIES.length} categories &middot; {termCount} terms &middot;
            from the builder side
          </p>
        </section>

        <hr style={divider} />

        {/* ── Mobile TOC toggle ── */}
        <button
          className="kg-mobile-toc-toggle"
          style={mobileTocToggle}
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
        >
          {mobileTocOpen ? '▾' : '▸'} table of contents
        </button>

        {mobileTocOpen && (
          <nav className="kg-mobile-toc-content">
            {GTM_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleScrollTo(cat.id)
                  }}
                  style={{
                    ...tocCategoryLink,
                    color:
                      activeId === cat.id
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {cat.name}
                </a>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {cat.terms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleScrollTo(term.id)
                        }}
                        style={{
                          ...tocTermLink,
                          color:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'var(--text-muted)',
                          borderLeftColor:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'transparent',
                        }}
                      >
                        {term.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}

        {/* ── Two-column layout ── */}
        <div className="kg-two-col" style={twoColumnLayout}>
          {/* ── Main content ── */}
          <main style={mainContent}>
            {GTM_CATEGORIES.map((cat, catIdx) => (
              <React.Fragment key={cat.id}>
                <section id={cat.id}>
                  <div style={sectionPrompt}>{cat.prompt}</div>
                  <h2 style={categoryTitle}>{cat.name}</h2>

                  {cat.terms.map((term) => (
                    <div
                      key={term.id}
                      id={term.id}
                      className="kg-term-card"
                      style={termCard}
                    >
                      <h3 style={termName}>
                        <Link
                          href={`/knowledge/${term.id}`}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            borderBottom: '1px solid transparent',
                            transition: 'border-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                          }}
                          onMouseLeave={(e) => {
                            ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                          }}
                        >
                          {term.name} →
                        </Link>
                      </h3>
                      <p style={termDefinition}>{term.definition}</p>

                      <div style={termLabel}>Why it matters</div>
                      <p style={termBody}>{term.whyItMatters}</p>

                      <div style={termLabel}>How I use it</div>
                      <p style={termBody}>{term.howYouUseIt}</p>

                      {term.related.length > 0 && (
                        <div style={relatedList}>
                          {term.related.map((relId) => {
                            const name = termNameMap.get(relId)
                            if (!name) return null
                            return (
                              <a
                                key={relId}
                                href={`#${relId}`}
                                className="kg-related-tag"
                                style={relatedTag}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleScrollTo(relId)
                                }}
                              >
                                {name}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                {catIdx < GTM_CATEGORIES.length - 1 && <hr style={divider} />}
              </React.Fragment>
            ))}

            <hr style={divider} />

            {/* ── Closing + CTA ── */}
            <section>
              <div style={sectionPrompt}>$ ./build --ready</div>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                }}
              >
                this isn&apos;t a glossary. it&apos;s a translation layer.
              </p>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                  marginBottom: '32px',
                }}
              >
                if you can read these terms and see how they connect — how
                enrichment feeds personalization, how qualification drives
                routing, how properties enable views — you&apos;re halfway to
                building your own GTM system. the other half is doing it.
              </p>

              <div style={ctaBlock}>
                <div style={ctaTitle}>Ready to see the engineering side?</div>
                <p style={ctaBody}>
                  Git, Vercel, AI agents, cron jobs, and the technical terms you
                  need to know as a builder in 2026.
                </p>
                <Link href="/knowledge" style={ctaLink}>
                  engineering &amp; AI guide &rarr;
                </Link>
                <br />
                <Link href="/knowledge/email" style={ctaSecondary}>
                  email infrastructure guide &rarr;
                </Link>
                <br />
                <Link href="/api" style={ctaSecondary}>
                  see the API docs &rarr;
                </Link>
              </div>
            </section>

            {/* ── Navigation ── */}
            <div
              style={{
                marginTop: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <Link href="/knowledge" style={backLink}>
                &larr; engineering &amp; AI guide
              </Link>
              <Link href="/knowledge/email" style={backLink}>
                email infrastructure &rarr;
              </Link>
            </div>
          </main>

          {/* ── Sticky TOC sidebar ── */}
          <nav className="kg-toc-sidebar" style={tocSidebar}>
            <div style={tocTitle}>On this page</div>
            {GTM_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className={`kg-toc-cat ${activeId === cat.id ? 'kg-toc-active-cat' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleScrollTo(cat.id)
                  }}
                  style={{
                    ...tocCategoryLink,
                    color:
                      activeId === cat.id
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {cat.name}
                </a>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {cat.terms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        className={`kg-toc-term ${activeId === term.id ? 'kg-toc-active-term' : ''}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleScrollTo(term.id)
                        }}
                        style={{
                          ...tocTermLink,
                          color:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'var(--text-muted)',
                          borderLeftColor:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'transparent',
                        }}
                      >
                        {term.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

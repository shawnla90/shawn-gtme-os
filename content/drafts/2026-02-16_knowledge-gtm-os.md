# GTM OS Knowledge Guide

it's 2026. you don't need to be an engineer, but you need to know these terms.

the vibe coders will take over. not AI. the people who speak both languages. the people who can look at a Clay table and a HubSpot view and see where the data should flow. who can debug a qualification prompt the same way they'd debug a CRM property. who can build systems because they learned the vocabulary.

this is how I learned it. no overcomplicated BS. just what you actually need. 

I was an SDR who sent way too many emails from primary domains with no warmup. now I build the systems that automate what I used to do by hand. these are the terms that matter in that translation. each one is something I use every day, explained from the builder side.

---

## Email Campaigns

### Sequence

A series of emails sent automatically over time to the same contact. Email 1 on day 0, email 2 on day 3, email 3 on day 7.

**Why it matters**: Manual follow-ups don't scale. You're not going to remember to email 200 people three days apart. Sequences turn "I should follow up" into "the system follows up."

**How you use it**: In Instantly or HeyReach, I set up 2-3 email sequences for each campaign. Email 1 is the opener with an icebreaker and value. Email 2 is a short callback with a company-specific pain point. Email 3 (if I use one) is the breakup email — "looks like timing's off, circling back in Q3." The sequence runs. I check replies.

**Related**: Cadence, Follow-up, Merge fields

### Cadence

The timing between touches in a sequence. Day 0, day 3, day 7. How long you wait before the next email.

**Why it matters**: Too fast feels spammy. Too slow loses momentum. The right cadence balances persistence with patience. Most tools default to day 2, day 4, day 6 — which feels robotic. Real humans don't follow up 48 hours apart on the dot.

**How you use it**: I default to 3-day gaps for email sequences. Email 1, wait 3 days, email 2, wait 4-5 days, email 3. Not symmetrical. Not immediate. Feels more like someone actually checking back in versus an automated drip. When it's multi-channel (LinkedIn + email), I stagger them — LinkedIn message day 1, email day 3, LinkedIn follow-up day 6.

**Related**: Sequence, Follow-up, Deliverability

### Follow-up

Any message sent after the first one. The second email. The third. The reply to "not now." 

**Why it matters**: Most deals don't happen on the first touch. Most replies don't either. SDRs who don't follow up lose 80% of their pipeline. The follow-up is where the actual conversion happens — not the opener.

**How you use it**: In every campaign I write, the follow-up does more work than email 1. Email 1 introduces. Email 2 reinforces with a pain point or proof. If they don't reply, email 3 closes the loop so it doesn't feel abandoned. I also use "manual follow-up" as a routing step — if a lead is warm but not ready, I flag them for a personalized follow-up later instead of auto-nurture.

**Related**: Sequence, Cadence, Personalization

### Deliverability

Whether your emails actually land in the inbox (not spam, not promotions, not nowhere). 

**Why it matters**: I learned this the hard way. when I was an SDR, I sent 200+ emails a day from primary domains with zero warmup. no one told me about deliverability. I thought if the email sent, it worked. then I started checking spam folders. half my emails were there. I was torching my domain reputation and didn't even know it. now I obsess over deliverability before I obsess over copy. because the best email in the world doesn't matter if no one sees it.

**How I use it**: I check MX records before routing contacts to email platforms. Google Workspace domains go to Instantly (because that's where I have Google-only sending infrastructure). Non-Google domains go to HeyReach on LinkedIn because I can't reliably deliver to Microsoft 365 or other providers from my Instantly setup. I also monitor bounce rates. If a campaign hits >5% hard bounces, something's broken upstream — usually the email validation waterfall. I learned to fix the plumbing before I write the copy.

**Related**: MX record, Domain warming, Waterfall, Instantly

### Spin text

Randomized word/phrase variations in email copy so each message reads slightly different. "I noticed" vs "I saw" vs "I came across." Prevents identical emails across a campaign.

**Why it matters**: If 100 people get the exact same email word-for-word, and they all report it as spam, email providers notice. The pattern looks automated (because it is). Spin text breaks the fingerprint. Deliverability stays higher. It also just reads more human — real people don't copy-paste the same opener 200 times.

**How you use it**: I don't overuse it. Most of my campaigns have 2-3 spin variations max per email. Subject lines get spin text. First sentence gets spin text. The rest stays consistent. Too much spin and the message loses coherence. The goal is "human variation," not "random Mad Libs."

**Related**: Deliverability, Sequence, Merge fields

### Merge fields

Placeholders in email templates that get replaced with actual data when the email sends. `{first_name}`, `{company_name}`, `{icebreaker}`.

**Why it matters**: Merge fields turn one template into 1,000 personalized emails. You write the structure once. The platform fills in the variables per contact. Without merge fields, you're copy-pasting names manually. With them, you're running campaigns at scale.

**How you use it**: Every campaign I build has 4-6 merge fields. `{first_name}` and `{company_name}` come from Clay enrichment. `{icebreaker}` and `{pain_point}` come from a Clay research prompt I write specifically for that campaign. The prompt embeds the full email bodies so the AI knows exactly where the variables land and writes them to fit naturally in context. Merge fields aren't magic — they're only as good as the data and prompts that generate them.

**Related**: Personalization, Variable, Research prompt, Icebreaker

---

## Outreach Platforms

### Instantly

Email campaign platform. Send sequences, track opens/replies, manage sending domains, warm inboxes, route leads.

**Why it matters**: Email still works if you do it right. I use Instantly because it handles the part I used to do manually as an SDR — domain rotation, throttling, warmup, deliverability monitoring. back then, I was sending from one inbox with no infrastructure. now I'm sending from multiple domains with automated warmup and health checks. Instantly is the infrastructure layer between "I wrote an email" and "500 people received it in their inbox."

**How I use it**: I route Google Workspace contacts to Instantly because that's the only MX provider my Instantly setup can reliably deliver to. I paste in the static email bodies (from campaign-copy.md), connect the merge fields to Clay columns, and launch. I check replies daily. Hard bounces and spam reports go back into Clay for waterfall debugging. Instantly doesn't write the emails or qualify the leads — that's all upstream in Clay. Instantly just sends. it's the deployment layer for email.

**Related**: HeyReach, Deliverability, MX record, Sequence

### HeyReach

LinkedIn outreach platform. Send connection requests, messages, and InMails at scale without manually clicking in Sales Navigator.

**Why it matters**: LinkedIn is locked down. You can't scrape it easily. You can't automate it without risking your account. HeyReach runs campaigns through real LinkedIn accounts (not bots) with natural delays and behavior patterns. It's the only way to do LinkedIn outbound at scale without getting banned.

**How you use it**: I route non-Google contacts to HeyReach because I can't reliably email them from Instantly. I also use it for accepted/unaccepted tracking — when someone accepts a connection request, HeyReach flags them, I export the CSV, run LinkedIn recon (browser-based profile scraping), and hand the enriched list to a caller. HeyReach doesn't qualify leads. It just executes the LinkedIn motion. Qualification happens upstream in Clay.

**Related**: Instantly, LinkedIn recon, Routing, Accepted/unaccepted

### Waterfall

A sequence of fallback options tried in order until one succeeds. Used for email finding (try Apollo, then Hunter, then RocketReach) and routing (try Google email, then non-Google email, then LinkedIn).

**Why it matters**: No single data provider has every email. No single platform works for every contact. Waterfalls let you stack multiple options so if the first one fails, the second one runs. If that fails, the third. You don't lose the lead — you just try the next method.

**How you use it**: My email waterfall in Clay runs: Apollo → Hunter.io → Clearbit → RocketReach → Prospeo → Dropcontact. First valid email wins. If no email found after 6 providers, the contact routes to HeyReach for LinkedIn outreach. I also use waterfall logic for routing: if Google MX, send to Instantly. If non-Google MX, send to HeyReach. If no email at all, send to HeyReach. Waterfalls turn "lead lost" into "lead routed."

**Related**: Enrichment, Routing, Deliverability, Clay

### MX record

Mail exchange record. DNS setting that tells you which email provider a domain uses (Google, Microsoft, custom).

**Why it matters**: Not all email providers are equal. I can deliver reliably to Google Workspace from my Instantly setup. I can't deliver reliably to Microsoft 365 or custom Exchange servers. If I try, the emails bounce or land in spam. MX records let me route contacts to the right platform before I send. It's a filter, not a guess.

**How you use it**: In Clay, I use the HTTP API to check MX records on every contact's email domain. If the result contains "google.com," the contact routes to Instantly. If it contains "outlook" or "protection.outlook" or anything non-Google, the contact routes to HeyReach. This prevents wasted sends and preserves domain reputation. MX classification is Play 14 in my series — one of the highest ROI filters in the whole workflow.

**Related**: Deliverability, Routing, Instantly, Waterfall

### Domain warming

Gradually increasing sending volume from a new domain so email providers trust it and don't flag messages as spam.

**Why it matters**: If you register a domain today and send 500 emails tomorrow, they all land in spam. Email providers don't know you. You have no reputation. Domain warming builds that reputation by starting slow (10-20 emails/day), engaging with real inboxes (automated or manual), and scaling up over 2-4 weeks. By the time you hit full volume, the domain looks legit.

**How you use it**: Instantly has built-in warming. I enable it for every new sending domain. It sends low-volume emails between "real" mailboxes in the warming pool, replies are automated, and the system gradually ramps volume. I don't touch it. It just runs. After 3-4 weeks, I route real campaign traffic to that domain. If I skip warming, deliverability tanks immediately.

**Related**: Deliverability, Instantly, Sending volume

---

## Data Operations

### Clay

Data enrichment and automation platform. Find emails, validate companies, scrape LinkedIn, run AI research prompts, route contacts to CRMs and outreach tools. The orchestration layer for GTM.

**Why it matters**: Clay is where I went from manual SDR to GTM engineer. when I was building buying committees in Salesforce by hand, I was the orchestration layer. I was the one pulling emails from Apollo, checking LinkedIn, researching pain points, deciding who to target. Clay does all of that. but faster. and at scale. and without forgetting. everything I used to do in my head now lives in a Clay table. qualification, enrichment, personalization, routing. all of it.

**How I use it**: every play in my series uses Clay. web reveal → Clay table. qualification prompts → Clay. personalization research → Clay. email waterfall → Clay. MX record check → Clay. then Clay syncs qualified + enriched contacts to HubSpot or Instantly or HeyReach. I don't use Clay for CRM. I use it for everything that makes the CRM data actually useful. it's the brain. the CRM is just the notebook.

**Related**: Enrichment, Claygent, Waterfall, Web reveal, HubSpot

### Enrichment

Adding data to a contact or company record. Find their email, pull their LinkedIn profile, grab their tech stack, scrape recent posts, validate their title.

**Why it matters**: You can't personalize with incomplete data. You can't qualify without firmographics. You can't route without an email address. Enrichment turns "name + domain" into a full actionable record. It's the difference between "spray and pray" and "targeted and relevant."

**How you use it**: I run enrichment waterfalls in Clay. For every contact, I try 6 email providers in sequence. I pull LinkedIn profiles when available. I scrape company posts with Apify. I validate job titles against persona tiers. I check MX records for routing. I run research prompts to generate icebreakers and pain points. All of that is enrichment. It happens before the contact moves downstream.

**Related**: Clay, Waterfall, Personalization, Validation

### Claygent

AI agent inside Clay that browses the web, reads pages, extracts data, and returns structured answers. Think of it as ChatGPT with a browser, running inside a Clay table column.

**Why it matters**: Manual research doesn't scale. You can't visit 500 websites and summarize positioning by hand. Claygents do it for you. They read markdown, analyze content, extract signals, and output JSON. They're also expensive (credit cost) and unreliable (hallucination risk), so you validate everything.

**How you use it**: I use Claygents for LinkedIn post analysis (Play 10), competitive intelligence (Play 11), and full-site markdown research (Play 12). I don't use them for simple lookups — that's what enrichment providers are for. I use them when I need reasoning and extraction from unstructured content. I also run a 6-step validation system before I scale any Claygent column: test on 5 rows, check for hallucinations, enforce JSON schema, score confidence, cap credit spend.

**Related**: Clay, Enrichment, Validation, Research prompt

### Sculptor

AI deduplication tool inside Clay. You give it messy data (company names with typos, multiple formats, edge cases) and it groups duplicates intelligently without you writing complex formulas.

**Why it matters**: Most deduplication is basic: exact match on email or domain. But what if the same company appears as "Microsoft," "Microsoft Corporation," and "MSFT"? Formula-based dedupe misses it. Sculptor catches it. It's AI-powered fuzzy matching without manual rules.

**How you use it**: I use Sculptor for enterprise dedupe (Play 15). When I'm enriching a big list and multiple contacts come from the same parent company, I use Sculptor to group them by company, then dedupe within each subset. It's also useful for cleaning messy imports where the same lead appears 3 times with slight name variations. Sculptor groups them. I keep the best record.

**Related**: Clay, Validation, Data hygiene

### Validation

Checking if data is real, accurate, and usable before you act on it. Email validation (does it exist?), persona validation (does the title match?), company validation (do they fit ICP?), Claygent validation (did the AI hallucinate?).

**Why it matters**: Bad data kills campaigns. If 20% of your emails are invalid, your bounce rate tanks deliverability. If your AI-generated icebreakers are fabricated, your reply rate goes to zero and you look like an idiot. Validation is the filter between "data exists" and "data is trustworthy."

**How you use it**: I validate emails through the waterfall — first provider to return a valid result wins. I validate personas by running job titles through a qualification prompt that checks them against tier definitions. I validate companies with a scoring prompt that checks firmographics against ICP. I validate Claygent outputs with a 6-step checklist: row sample → hallucination check → JSON schema → confidence scoring → credit cap → scale. Validation happens at every layer. It's not one tool. It's a discipline.

**Related**: Enrichment, Qualification, Claygent, ICP

---

## Personalization

### Icebreaker

The opening line of a cold email that proves you researched the person. A specific observation, recent activity, shared interest, or company signal. Not "I see you're in SaaS." More like "saw your post on signal-based SDR workflows last week."

**Why it matters**: when I was an SDR sending 200 emails a day, I didn't have time for icebreakers. every email started the same. "Hey [name], I noticed you're a VP at [company]..." and they all got ignored. because everyone could tell I didn't actually look. now I automate the research part so the icebreaker is real. generic openers get deleted. specific icebreakers get replies. the first sentence is the filter.

**How I use it**: every campaign I build has an `{icebreaker}` merge field in email 1. I don't write the icebreakers manually anymore. I write a Clay research prompt that pulls LinkedIn profiles, recent posts, and headline data, then generates 1-2 sentence icebreakers that reference something specific. the prompt embeds the full email body so the AI knows where the icebreaker lands and writes it to flow naturally. if the profile is thin, the prompt falls back to company-level signals instead of making things up. I learned to automate the research I used to skip when I was rushing to hit quota.

**Related**: Personalization, Research prompt, Merge fields, Variable

### Variable

A placeholder in a template that gets replaced with dynamic content. Same as merge field, but "variable" is the Clay/AI terminology. `{icebreaker}`, `{pain_point}`, `{company_name}`.

**Why it matters**: Variables let you scale personalization. You write the structure once, the AI generates the content per contact, and the platform merges it in. Without variables, you're writing 500 unique emails. With variables, you're writing one template and filling 500 blanks intelligently.

**How you use it**: I define variables in my campaign research prompts. Each prompt outputs a JSON array with fields like `icebreaker`, `pain_point`, `service_fit`, `confidence`. Those become columns in Clay. Then I map them to merge fields in Instantly or HeyReach. The variable names have to match exactly — if the prompt outputs `pain_point` but the email references `{pain_signal}`, the merge breaks. Naming consistency matters.

**Related**: Merge fields, Icebreaker, Research prompt, Personalization

### Research prompt

An AI prompt (usually in Clay) that takes enriched data (LinkedIn profile, company domain, job title) and generates personalization variables (icebreaker, pain point, service fit) for outbound campaigns.

**Why it matters**: You can't manually research 500 contacts. The research prompt does it for you. It reads the LinkedIn "About" section, scans recent posts, checks the company domain, and outputs 2-3 personalized hooks per contact. It's the automation layer between "raw data" and "usable copy."

**How you use it**: I write one research prompt per campaign. The prompt embeds the full email bodies so the AI knows exactly where each variable appears and writes them to read naturally in context. I define strict rules for each variable (icebreaker = recent post or profile headline, no fabrication; pain_point = company-level signal, not contact-level guess). The prompt outputs JSON with fields that map to merge fields in the email. I test it on 5 rows, check for hallucinations, then scale. Research prompts are the bridge between enrichment and sending.

**Related**: Icebreaker, Variable, Personalization, Claygent

### Dynamic fields

Content blocks in emails or messages that change based on recipient data. Could be variables (icebreaker, company name), conditional logic (if title = VP, say X; if title = Director, say Y), or triggered insertions (if recent funding, mention growth).

**Why it matters**: Static emails don't convert at scale. Dynamic fields let you personalize without writing 50 versions of the same email. The template structure stays the same, but the details shift per contact. It's how you get "mass personalization" without it feeling mass.

**How you use it**: Most of my dynamic fields are simple variables (`{first_name}`, `{icebreaker}`). Occasionally I use conditional logic in Clay before the email sends — if persona tier = 1-2, route to high-priority sequence; if tier = 3-4, route to standard sequence. If company score < 6, skip entirely. The "dynamic" part happens in Clay. By the time the email reaches Instantly, the content is already personalized and locked in.

**Related**: Variable, Merge fields, Personalization, Routing

### Pain point signal

A data point or observation that indicates a problem the contact's company is facing. Recent leadership change. Outdated tech stack. Competitor mention in job postings. Declining search traffic.

**Why it matters**: Generic pain points don't work. "I know scaling is hard" gets ignored. Specific pain signals get replies. If I can point to a real, observable problem (your company just posted 5 SDR roles, your site runs on outdated infrastructure, your competitor is outranking you in search), the email feels less like a cold pitch and more like "how did you know?"

**How you use it**: I pull pain signals from enrichment and research. LinkedIn post scraping (Apify) shows what the company is talking about publicly. Semrush shows search traffic drops or competitor gaps. Job postings show hiring urgency. Tech stack data shows legacy tools. I feed all of that into a research prompt that extracts 1-2 pain signals per company, then uses them in the `{pain_point}` variable in email 2. The signal has to be real. If I can't prove it, I don't use it.

**Related**: Research prompt, Personalization, Enrichment, Signal stacking

### Poke the Bear

A personalization variable that challenges a contact's current approach or status quo. Different from an icebreaker (observational) and a pain point (problem identification). Poke the bear is a pattern interrupt. A question, a counterintuitive take, or a "you might be doing this wrong" signal.

**Why it matters**: not everyone is ready to buy. but that doesn't mean they're not ready to know you exist. if you can't sell to your ICP right now, at least educate them. the poke the bear variable is how you stay on their radar without being pushy. it's the middle ground between "here's our demo" and "never mind." it keeps the conversation open.

**How I use it**: I have three favorite custom variables — `{icebreaker}`, `{poke_the_bear}`, and `{pain_point}`. I split them across a three-email sequence. email 1 gets the icebreaker (observational, personal). email 2 gets the poke the bear (challenging, thought-provoking). email 3 gets the pain point (problem-focused, specific). this works especially well for low-hanging fruit — leads that fit ICP but aren't high priority. they might not convert today, but they'll remember the sequence. and when they're ready, you're the first name they think of.

**Example poke the bear variables**:
- "most SDR teams hire more reps when they should be fixing their data"
- "if your best leads come from inbound, your outbound strategy is guesswork"
- "you're enriching contacts after they're in your CRM — that's backwards"

The poke isn't a pitch. It's a perspective. It positions you as someone who thinks differently. And that sticks longer than a feature list.

**Related**: Icebreaker, Pain point signal, Variable, Sequence

### Signals

Data points that indicate intent, fit, or timing. Funding announcements, job postings, tech stack changes, web visits, content downloads, competitor mentions, G2 reviews. Anything that suggests "this company is worth talking to right now."

**Why it matters**: not all signals are created equal. some are unique and actionable. some are overrated noise that everyone's already using. the signal itself doesn't matter as much as what you can offer based on it. my guiding principle: rather than obsessing over the perfect signal, focus on what you can give them that's low-hanging fruit and actually valuable.

**How I use it**: I always spec out signals when working on an account. what signals are actually unique for this ICP? what can I pull that competitors aren't using? for example, if I'm selling to marketers, I pull competitor intelligence (who's outranking them in search, what topics their competitors are writing about). I pull G2 reviews (what their customers are complaining about). I pull job postings (are they hiring SDRs? are they scaling a new team?). those are unique signals. funding announcements? everyone sees those. that's overrated. the best signals are the ones that let you lead with value, not just "I noticed you raised $10M."

**Examples of unique signals**:
- G2 reviews mentioning specific pain points in their current tools
- Competitor content analysis (gaps in their blog vs competitors)
- Job postings indicating team expansion or new initiatives
- Search traffic declines (for selling to marketers/growth teams)
- Tech stack changes (migrating platforms, adding integrations)

**Examples of overrated signals**:
- Funding announcements (everyone sees them, inbox is flooded)
- LinkedIn job changes (unless super recent and relevant)
- Generic "congrats on the new role" (lazy, templated)

Signals are only valuable if they unlock something you can offer. Otherwise you're just proving you can use Google.

**Related**: Pain point signal, Web reveal, Intent signal, Personalization

---

## Qualification

### ICP

Ideal Customer Profile. The type of company you're targeting. Industry, size, revenue, tech stack, geography, maturity stage. "Who's a fit?"

**Why it matters**: If you don't know your ICP, you're guessing. You waste time on companies that will never buy. You burn budget on enrichment and outreach for leads that don't qualify. ICP is the filter that separates signal from noise before you spend a dollar.

**How you use it**: Every partner I work with has an `icp.md` file in their research folder. It defines firmographics (employee count, revenue, industry), qualification criteria (must have Atlassian footprint, must have 1,000-20,000 units under management), and scoring thresholds (8-10 = qualified, 6-7 = needs research, <6 = skip). I use that ICP to build a company qualification prompt in Clay. The prompt evaluates every company against those criteria and outputs a score + reasoning. Only qualified companies move downstream.

**Related**: Persona, Qualification, Scoring, Web reveal

### Persona

The type of person you're targeting within a company. Job title, department, seniority. "Who do we talk to?"

**Why it matters**: You can target the right company and still lose if you're talking to the wrong person. Personas define who has budget, authority, pain, and interest. A VP of Sales cares about pipeline. A Director of Ops cares about efficiency. Same company, different pitch.

**How you use it**: Every partner has a `personas.md` file with 3-5 tiers. Tier 1 = primary buyers (VP Sales, CRO). Tier 2 = secondary decision-makers (Director Sales Ops). Tier 3 = influencers (SDR Manager). Tier 4-5 = edge cases or champions. I use those tiers in a persona qualification prompt that checks job titles and assigns outreach priority. Tier 1-2 = high priority, custom research. Tier 3 = standard sequence. Tier 4-5 = nurture or skip.

**Related**: ICP, Qualification, Routing, Tier

### Web reveal

When someone visits your website and you capture their company, sometimes their identity, and route them into outbound workflows based on ICP fit.

**Why it matters**: Inbound interest is the warmest signal you can get. If someone from a target account visits your pricing page, they're researching. If you wait for them to fill out a form, you lose. Web reveal lets you capture that intent and act on it immediately — route qualified visitors into outreach, enrich contacts at that company, prioritize them in your pipeline.

**How you use it**: I use Vector + Midbound for web reveal. When a qualified company visits, the signal fires into Clay. Clay runs company qualification (does it fit ICP?), persona enrichment (find the right contacts), email waterfall (get addresses), MX routing (Google → Instantly, non-Google → HeyReach), and personalization research (generate icebreakers referencing the site visit). Web reveal is Play 5. It's one of the highest-converting workflows because the intent signal is real.

**Related**: ICP, Qualification, Routing, Intent signal

### Routing

The logic that determines where a contact goes after qualification. Qualified + Google email → Instantly. Qualified + non-Google email → HeyReach. Not qualified → skip. Needs research → manual review.

**Why it matters**: Qualification without routing is useless. You know who's a fit — now what? Routing automates the "now what." It connects qualification to action. Instead of "this lead is good," it's "this lead is good AND going to the high-priority Instantly sequence AND getting handed to the AE."

**How you use it**: I build routing logic in Clay with formula columns and conditional filters. After company + persona qualification, I run a routing decision prompt that outputs: route (outreach / enrich_company / manual_review / skip), priority (high / medium / low), and next step. High-priority routes sync to HubSpot and Instantly. Medium routes go to standard sequences. Low goes to nurture. Manual_review gets flagged for human check. Routing is the bridge between "data in" and "action out."

**Related**: Qualification, ICP, Persona, Waterfall

### Scoring

Assigning a numeric value to a company or contact based on how well they match your criteria. 0-10 scale. 8-10 = qualified, 6-7 = research, <6 = skip.

**Why it matters**: Binary yes/no qualification is too rigid. Scoring adds nuance. A company might be a 7 — not perfect, but close. Maybe they're missing one signal. Maybe they're in a gray-zone industry. Scoring lets you tier leads by strength instead of just pass/fail. It also lets you route by priority — 9-10 gets the premium sequence, 6-7 gets standard.

**How you use it**: I use scoring in company qualification prompts. The prompt checks firmographics (employee count, industry, tech stack) against ICP criteria and outputs a score (0-10), confidence (High/Medium/Low), and reasoning. I set thresholds per partner — some require 8+ to qualify, others accept 6+. I also use scoring for persona fit — Tier 1-2 = 8-10, Tier 3 = 5-7, Tier 4-5 = 3-4. Scoring makes qualification measurable instead of subjective.

**Related**: ICP, Qualification, Routing, Tier

---

## CRM

### Properties

Custom fields in a CRM (HubSpot, Salesforce) that store data about contacts, companies, or deals. "Industry," "Employee Count," "ICP Score," "Last Outreach Date," "Lifecycle Stage."

**Why it matters**: when I was manually building buying committees in Salesforce, I didn't understand properties. I just filled in the default fields and hoped they were enough. they weren't. CRMs are useless without custom properties. they're just contact lists. properties turn them into databases. I learned this when a sales rep asked "show me everyone we contacted in Q4 who didn't reply" and I had to scroll through 2,000 records because we didn't have a `last_outreach_date` property.

**How I use it**: I create custom properties in HubSpot for every enrichment field that matters. `icp_score` (0-10), `persona_tier` (1-5), `mx_provider` (Google/Microsoft/Other), `web_reveal_date`, `last_clay_sync`. I map Clay columns to HubSpot properties in the sync so enriched data flows automatically. I also use properties to build views — "show me all contacts with icp_score >= 8 AND persona_tier <= 2 AND last_outreach_date is unknown." properties are the query language. learn them or drown in your own data.

**Related**: Views, Lifecycle stage, Contact object, HubSpot

### Lifecycle stage

A property in HubSpot that defines where a contact is in the sales process. Subscriber → Lead → MQL → SQL → Opportunity → Customer.

**Why it matters**: Lifecycle stages let you filter and automate by intent and readiness. You don't email a Customer the same way you email a Lead. You don't score an Opportunity the same way you score an MQL. Lifecycle stage is the primary segmentation axis in most CRMs.

**How you use it**: I sync qualified contacts from Clay into HubSpot as "Lead" by default. If they reply to outbound, they move to "MQL." If an AE qualifies them, they move to "SQL." If a deal opens, they move to "Opportunity." I use lifecycle stage in views — "show me all SQLs created this month" or "show me Leads with no outreach in 30 days." I don't manually update lifecycle. It's automated based on activity (reply = MQL, meeting booked = SQL).

**Related**: Properties, Pipeline, Views, HubSpot

### Pipeline

The stages a deal moves through from open to close. Discovery → Demo → Proposal → Negotiation → Closed Won / Closed Lost.

**Why it matters**: Pipeline is how you track revenue. It's not enough to know "we have 50 deals." You need to know where they are, how long they've been there, and what the next step is. Pipeline visibility is the difference between "we're busy" and "we're forecasting $200k closing this quarter."

**How you use it**: I don't manage pipeline manually — that's the AE's job. But I do care about pipeline creation. When a qualified lead from Clay moves to SQL and an AE opens a deal, that deal enters the pipeline. I track "deals created from web reveal" vs "deals created from cold outbound" as separate sources so I know which workflows are actually driving revenue. Pipeline isn't a GTM engineer's daily tool, but it's the end goal. Everything upstream (qualification, enrichment, routing, personalization) exists to fill the pipeline with real opportunities.

**Related**: Lifecycle stage, Deal object, Opportunity, HubSpot

### Views

Saved filters in a CRM that show a specific segment of contacts, companies, or deals. "All MQLs created this week," "Companies with ICP score 8-10 and no outreach," "Deals in Discovery stage over 30 days."

**Why it matters**: Views turn a CRM from a database into a workspace. Without views, you're scrolling through thousands of records trying to find the ones that matter. With views, you click "High-priority leads" and see exactly who to call today. Views are how you operationalize your data.

**How you use it**: I build views in HubSpot based on properties. "ICP score >= 8 AND persona tier <= 2 AND last contacted is unknown" = outreach-ready leads. "Lifecycle stage = MQL AND create date is last 7 days" = fresh inbound. "Web reveal date is known AND deal associated is unknown" = intent signal with no follow-up. I don't create views for every possible filter. I create views for the 5-10 segments that matter daily. Views are shortcuts. Build them for the actions you repeat.

**Related**: Properties, Lifecycle stage, Filters, HubSpot

### Contact object

The database record type in a CRM that stores individual people. Name, email, title, company association, lifecycle stage, custom properties.

**Why it matters**: Contacts are the atomic unit of outbound. Companies are targets. Deals are revenue. But contacts are the people you actually email, call, and pitch. Understanding the contact object — what properties it has, how it syncs, what triggers updates — is the foundation of CRM hygiene.

**How you use it**: I sync enriched contacts from Clay to HubSpot contact objects. Each contact gets: email (primary key), first name, last name, job title, company association (linked to company object), persona tier, ICP score, enrichment date. I map Clay columns to HubSpot contact properties in the sync settings. I don't create duplicate contacts — Clay checks for existing emails before syncing. Contact objects are where all the enrichment and qualification data lives in the CRM. If the contact object is messy (duplicate emails, missing properties, stale data), the whole CRM breaks.

**Related**: Properties, Company object, Lifecycle stage, HubSpot

---

## What's Next

this isn't a glossary. it's a translation layer.

if you can read these terms and see how they connect — how enrichment feeds personalization, how qualification drives routing, how properties enable views — you're halfway to building your own GTM system.

the other half is doing it. pick one workflow. web reveal, or email waterfall, or persona scoring. build it in Clay. break it. fix it. learn what the terms actually mean when they're running in production.

the vibe coders are the ones who can look at a Clay table and a HubSpot view and see the same system from two angles. this guide is your Rosetta Stone.

now go build something.

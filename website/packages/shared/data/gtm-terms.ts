/* ── types ───────────────────────────────────────── */

export interface UseCase {
  title: string
  problem: string
  solution: string
  result: string
  tools: string[]
  playbookLink?: string
}

export interface GTMTerm {
  id: string
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  related: string[]
  useCases?: UseCase[]
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
      { id: 'instantly', name: 'Instantly', definition: 'Email campaign platform. Send sequences, track opens/replies, manage sending domains, warm inboxes, route leads.', whyItMatters: "Email still works if you do it right. I use Instantly because it handles the part I used to do manually as an SDR \u2014 domain rotation, throttling, warmup, deliverability monitoring. back then, I was sending from one inbox with no infrastructure. now I'm sending from multiple domains with automated warmup and health checks. Instantly is the infrastructure layer between \"I wrote an email\" and \"500 people received it in their inbox.\"", howYouUseIt: "I route Google Workspace contacts to Instantly because that's the only MX provider my Instantly setup can reliably deliver to. I paste in the static email bodies (from campaign-copy.md), connect the merge fields to Clay columns, and launch. I check replies daily. Hard bounces and spam reports go back into Clay for enrichment debugging. Instantly doesn't write the emails or qualify the leads \u2014 that's all upstream in Clay. Instantly just sends. it's the deployment layer for email.", related: ['heyreach', 'deliverability', 'mx-record', 'sequence'] },
      { id: 'heyreach', name: 'HeyReach', definition: 'LinkedIn outreach platform. Send connection requests, messages, and InMails at scale without manually clicking in Sales Navigator.', whyItMatters: "LinkedIn is locked down. You can't scrape it easily. You can't automate it without risking your account. HeyReach runs campaigns through real LinkedIn accounts (not bots) with natural delays and behavior patterns. It's the only way to do LinkedIn outbound at scale without getting banned.", howYouUseIt: "I route non-Google contacts to HeyReach because I can't reliably email them from Instantly. I also use it for accepted/unaccepted tracking \u2014 when someone accepts a connection request, HeyReach flags them, I export the CSV, run LinkedIn recon (browser-based profile scraping), and hand the enriched list to a caller. HeyReach doesn't qualify leads. It just executes the LinkedIn motion. Qualification happens upstream in Clay.", related: ['instantly', 'routing', 'linkedin-recon'] },
      { id: 'waterfall', name: 'Waterfall', definition: 'A sequence of fallback providers tried in order until one succeeds. The traditional approach to email finding \u2014 stack 4-6 providers and hope one hits.', whyItMatters: "I used to run 6-provider waterfalls \u2014 Apollo \u2192 Hunter \u2192 Clearbit \u2192 RocketReach \u2192 Prospeo \u2192 Dropcontact. it felt thorough. but when I layered in MX-based routing (Google \u2192 Instantly, non-Google \u2192 HeyReach), I realized the waterfall logic made no sense. I was burning 8-12 credits per contact chasing marginal coverage gains, and validation still bounced anyway. the routing layer downstream made most of that effort pointless. so I stopped. now I use one provider, validate with MX records, and route. simpler. cheaper. same deliverability.", howYouUseIt: "I don't use waterfalls anymore. I go single-provider \u2014 Prospeo or LeadMagic \u2014 and check MX records instead of stacking fallback providers. if the single provider finds an email, I validate the domain's MX record (Google vs non-Google) and route: Google \u2192 Instantly, non-Google \u2192 HeyReach, no email \u2192 HeyReach for LinkedIn. the old waterfall burned credits trying to squeeze out emails that bounced anyway. single-provider + MX routing gets me the same result at a fraction of the cost. waterfalls are a concept worth understanding, but my philosophy is: don't use them.", related: ['enrichment', 'routing', 'deliverability', 'clay'] },
      { id: 'mx-record', name: 'MX Record', definition: 'Mail exchange record. DNS setting that tells you which email provider a domain uses (Google, Microsoft, custom).', whyItMatters: "Not all email providers are equal. I can deliver reliably to Google Workspace from my Instantly setup. I can't deliver reliably to Microsoft 365 or custom Exchange servers. If I try, the emails bounce or land in spam. MX records let me route contacts to the right platform before I send. It's a filter, not a guess.", howYouUseIt: "In Clay, I use the HTTP API to check MX records on every contact's email domain. If the result contains \"google.com,\" the contact routes to Instantly. If it contains \"outlook\" or \"protection.outlook\" or anything non-Google, the contact routes to HeyReach. This prevents wasted sends and preserves domain reputation. MX classification is Play 14 in my series \u2014 one of the highest ROI filters in the whole workflow.", related: ['deliverability', 'routing', 'instantly', 'waterfall'] },
      { id: 'domain-warming', name: 'Domain Warming', definition: "Gradually increasing sending volume from a new domain so email providers trust it and don't flag messages as spam.", whyItMatters: "If you register a domain today and send 500 emails tomorrow, they all land in spam. Email providers don't know you. You have no reputation. Domain warming builds that reputation by starting slow (10-20 emails/day), engaging with real inboxes (automated or manual), and scaling up over 2-4 weeks. By the time you hit full volume, the domain looks legit.", howYouUseIt: "Instantly has built-in warming. I enable it for every new sending domain. It sends low-volume emails between \"real\" mailboxes in the warming pool, replies are automated, and the system gradually ramps volume. I don't touch it. It just runs. After 3-4 weeks, I route real campaign traffic to that domain. If I skip warming, deliverability tanks immediately.", related: ['deliverability', 'instantly'] },
    ],
  },
  {
    id: 'data-operations',
    name: 'Data Operations',
    prompt: '$ ls ~/gtm-os/data-ops/',
    terms: [
      { id: 'clay', name: 'Clay', definition: 'Data enrichment and automation platform. Find emails, validate companies, scrape LinkedIn, run AI research prompts, route contacts to CRMs and outreach tools. The orchestration layer for GTM.', whyItMatters: "Clay is where I went from manual SDR to GTM engineer. when I was building buying committees in Salesforce by hand, I was the orchestration layer. I was the one pulling emails from Apollo, checking LinkedIn, researching pain points, deciding who to target. Clay does all of that. but faster. and at scale. and without forgetting. everything I used to do in my head now lives in a Clay table. qualification, enrichment, personalization, routing. all of it.", howYouUseIt: "every play in my series uses Clay. web reveal \u2192 Clay table. qualification prompts \u2192 Clay. personalization research \u2192 Clay. single-provider email enrichment \u2192 Clay. MX record check \u2192 Clay. then Clay syncs qualified + enriched contacts to HubSpot or Instantly or HeyReach. I don't use Clay for CRM. I use it for everything that makes the CRM data actually useful. it's the brain. the CRM is just the notebook.", related: ['enrichment', 'claygent', 'routing', 'web-reveal', 'hubspot'] },
      { id: 'enrichment', name: 'Enrichment', definition: 'Adding data to a contact or company record. Find their email, pull their LinkedIn profile, grab their tech stack, scrape recent posts, detect trigger signals, generate personalization variables. Turns a name + domain into a full actionable record.', whyItMatters: "You can't personalize with incomplete data. You can't qualify without firmographics. You can't route without an email address. Enrichment turns \"name + domain\" into a full actionable record. It's the difference between \"spray and pray\" and \"targeted and relevant.\" and enrichment isn't one step — it's a multi-layer process. email lookup is enrichment. signal detection is enrichment. icebreaker research is enrichment. persona identification is enrichment. each layer adds something the next step needs.", howYouUseIt: "I have two enrichment paths depending on the data type. path 1 — Clay: single-provider email enrichment (Prospeo or LeadMagic, not a waterfall), LinkedIn profiles, job title validation, MX record checks, and research prompts for personalization variables. this handles contact-level enrichment. path 2 — Exa SDK: company-level enrichment at scale. Python scripts that crawl domains for case studies and thought leadership (icebreakers), sweep for 6 signal types with date filters (trigger signals), search LinkedIn for specific titles (persona widening), and discover lookalike companies (TAM expansion). Exa handles the research that Clay can't — it reads actual web pages and returns semantic matches, not just keyword hits. the two paths converge in Clay. Exa outputs go into CSV files that import into Clay tables, where they join contact-level enrichment data. the combined record — company research + contact data + signals + personalization variables — is what moves downstream to email sequences.", related: ['clay', 'routing', 'personalization', 'validation', 'exa', 'enrichment-pipeline'] },
      { id: 'claygent', name: 'Claygent', definition: 'AI agent inside Clay that browses the web, reads pages, extracts data, and returns structured answers. Think of it as ChatGPT with a browser, running inside a Clay table column.', whyItMatters: "Manual research doesn't scale. You can't visit 500 websites and summarize positioning by hand. Claygents do it for you. They read markdown, analyze content, extract signals, and output JSON. They're also expensive (credit cost) and unreliable (hallucination risk), so you validate everything.", howYouUseIt: "I use Claygents for LinkedIn post analysis (Play 10), competitive intelligence (Play 11), and full-site markdown research (Play 12). I don't use them for simple lookups \u2014 that's what enrichment providers are for. I use them when I need reasoning and extraction from unstructured content. I also run a 6-step validation system before I scale any Claygent column: test on 5 rows, check for hallucinations, enforce JSON schema, score confidence, cap credit spend.", related: ['clay', 'enrichment', 'validation', 'research-prompt'] },
      { id: 'sculptor', name: 'Sculptor', definition: 'AI deduplication tool inside Clay. You give it messy data (company names with typos, multiple formats, edge cases) and it groups duplicates intelligently without you writing complex formulas.', whyItMatters: "Most deduplication is basic: exact match on email or domain. But what if the same company appears as \"Microsoft,\" \"Microsoft Corporation,\" and \"MSFT\"? Formula-based dedupe misses it. Sculptor catches it. It's AI-powered fuzzy matching without manual rules.", howYouUseIt: "I use Sculptor for enterprise dedupe (Play 15). When I'm enriching a big list and multiple contacts come from the same parent company, I use Sculptor to group them by company, then dedupe within each subset. It's also useful for cleaning messy imports where the same lead appears 3 times with slight name variations. Sculptor groups them. I keep the best record.", related: ['clay', 'validation'] },
      { id: 'validation', name: 'Validation', definition: 'Checking if data is real, accurate, and usable before you act on it. Email validation (does it exist?), persona validation (does the title match?), company validation (do they fit ICP?), Claygent validation (did the AI hallucinate?).', whyItMatters: "Bad data kills campaigns. If 20% of your emails are invalid, your bounce rate tanks deliverability. If your AI-generated icebreakers are fabricated, your reply rate goes to zero and you look like an idiot. Validation is the filter between \"data exists\" and \"data is trustworthy.\"", howYouUseIt: "I validate emails with MX records \u2014 not by stacking providers in a waterfall. single provider finds the email, MX record confirms the domain's mail server, routing logic takes it from there. I validate personas by running job titles through a qualification prompt that checks them against tier definitions. I validate companies with a scoring prompt that checks firmographics against ICP. I validate Claygent outputs with a 6-step checklist: row sample \u2192 hallucination check \u2192 JSON schema \u2192 confidence scoring \u2192 credit cap \u2192 scale. Validation happens at every layer. It's not one tool. It's a discipline.", related: ['enrichment', 'qualification', 'claygent', 'icp'] },
    ],
  },
  {
    id: 'personalization',
    name: 'Personalization',
    prompt: '$ ls ~/gtm-os/personalization/',
    terms: [
      { id: 'icebreaker', name: 'Icebreaker', definition: "The opening line of a cold email that proves you researched the person. A specific observation, recent activity, shared interest, or company signal. Not \"I see you're in SaaS.\" More like \"saw your post on signal-based SDR workflows last week.\"", whyItMatters: "when I was an SDR sending 200 emails a day, I didn't have time for icebreakers. every email started the same. \"Hey [name], I noticed you're a VP at [company]...\" and they all got ignored. because everyone could tell I didn't actually look. now I automate the research part so the icebreaker is real. generic openers get deleted. specific icebreakers get replies. the first sentence is the filter.", howYouUseIt: "every campaign I build has an {icebreaker} merge field in email 1. I don't write the icebreakers manually anymore. I have two paths depending on scale. path 1: a Clay research prompt that pulls LinkedIn profiles, recent posts, and headline data, then generates 1-2 sentence icebreakers. the prompt embeds the full email body so the AI writes it to flow naturally. path 2: an Exa SDK script that crawls each company's domain for case studies, news, and thought leadership — then outputs a CSV of contextual icebreakers ready to merge. I ran this across 73 companies in one session. the script hits site:{domain} for case studies, then runs a separate news search with date filters, cleans the HTML boilerplate, and outputs structured research per company. 73 companies, 150KB of contextual intel, zero manual research. that's the difference between spending a week on icebreaker research and spending an afternoon writing the script that does it for you.", related: ['personalization', 'research-prompt', 'merge-fields', 'variable', 'exa'], useCases: [{ title: 'Automated Icebreaker Generation at Scale', problem: 'Needed personalized icebreakers for 73 companies before a major trade show. Manual research was not feasible at that volume.', solution: 'Built two parallel paths - a Clay research prompt for LinkedIn-based icebreakers and an Exa SDK script that crawls each company domain for case studies, news, and thought leadership.', result: '73 companies got unique, contextual icebreakers. Zero manual research. The Exa script produced 150KB of contextual intel in one afternoon.', tools: ['Clay', 'Exa SDK', 'Python', 'CSV pipeline'] }] },
      { id: 'variable', name: 'Variable', definition: 'A placeholder in a template that gets replaced with dynamic content. Same as merge field, but "variable" is the Clay/AI terminology. {icebreaker}, {pain_point}, {company_name}.', whyItMatters: "Variables let you scale personalization. You write the structure once, the AI generates the content per contact, and the platform merges it in. Without variables, you're writing 500 unique emails. With variables, you're writing one template and filling 500 blanks intelligently.", howYouUseIt: "I define variables in my campaign research prompts. Each prompt outputs a JSON array with fields like icebreaker, pain_point, service_fit, confidence. Those become columns in Clay. Then I map them to merge fields in Instantly or HeyReach. The variable names have to match exactly \u2014 if the prompt outputs pain_point but the email references {pain_signal}, the merge breaks. Naming consistency matters.", related: ['merge-fields', 'icebreaker', 'research-prompt'] },
      { id: 'research-prompt', name: 'Research Prompt', definition: 'An AI prompt (usually in Clay) that takes enriched data (LinkedIn profile, company domain, job title) and generates personalization variables (icebreaker, pain point, service fit) for outbound campaigns.', whyItMatters: "You can't manually research 500 contacts. The research prompt does it for you. It reads the LinkedIn \"About\" section, scans recent posts, checks the company domain, and outputs 2-3 personalized hooks per contact. It's the automation layer between \"raw data\" and \"usable copy.\"", howYouUseIt: "I write one research prompt per campaign. The prompt embeds the full email bodies so the AI knows exactly where each variable appears and writes them to read naturally in context. I define strict rules for each variable (icebreaker = recent post or profile headline, no fabrication; pain_point = company-level signal, not contact-level guess). The prompt outputs JSON with fields that map to merge fields in the email. I test it on 5 rows, check for hallucinations, then scale. Research prompts are the bridge between enrichment and sending.", related: ['icebreaker', 'variable', 'claygent'] },
      { id: 'dynamic-fields', name: 'Dynamic Fields', definition: 'Content blocks in emails or messages that change based on recipient data. Could be variables (icebreaker, company name), conditional logic (if title = VP, say X; if title = Director, say Y), or triggered insertions (if recent funding, mention growth).', whyItMatters: "Static emails don't convert at scale. Dynamic fields let you personalize without writing 50 versions of the same email. The template structure stays the same, but the details shift per contact. It's how you get \"mass personalization\" without it feeling mass.", howYouUseIt: "Most of my dynamic fields are simple variables ({first_name}, {icebreaker}). Occasionally I use conditional logic in Clay before the email sends \u2014 if persona tier = 1-2, route to high-priority sequence; if tier = 3-4, route to standard sequence. If company score < 6, skip entirely. The \"dynamic\" part happens in Clay. By the time the email reaches Instantly, the content is already personalized and locked in.", related: ['variable', 'merge-fields', 'routing'] },
      { id: 'pain-point-signal', name: 'Pain Point Signal', definition: "A data point or observation that indicates a problem the contact's company is facing. Recent leadership change. Outdated tech stack. Competitor mention in job postings. Declining search traffic. Not a guess — a verifiable signal.", whyItMatters: "Generic pain points don't work. \"I know scaling is hard\" gets ignored. Specific pain signals get replies. If I can point to a real, observable problem (your company just posted 5 SDR roles, your site runs on outdated infrastructure, your competitor is outranking you in search), the email feels less like a cold pitch and more like \"how did you know?\" the signal has to be real. if I can't prove it from research, I don't use it.", howYouUseIt: "I pull pain signals from multiple sources and layer them. LinkedIn post scraping (Apify) shows what the company is talking about publicly. Semrush shows search traffic drops or competitor gaps. Job postings show hiring urgency. Tech stack data shows legacy tools. and now Exa — I built a signal detection script that sweeps 6 signal types per company: funding activity, M&A activity, hiring signals, market expansion, technology adoption, and customer complaints. it ran across 73 companies and detected 342 signals in one session. each signal gets categorized, timestamped, and matched to a pain point in the partner's pain library. I feed those signals into a research prompt that generates the {pain_point} variable for email sequences. the prompt maps signals to industry-specific pain language — OTIF chargebacks for CPG, deployment complexity for enterprise IT, tool sprawl for tech companies. the output is a one-sentence pain observation that feels researched, not generic.", related: ['research-prompt', 'enrichment', 'signals', 'exa'] },
      { id: 'poke-the-bear', name: 'Poke the Bear', definition: "A personalization variable that challenges a contact's current approach or status quo. Different from an icebreaker (observational) and a pain point (problem identification). Poke the bear is a pattern interrupt — it makes the reader feel the cost of their status quo without pitching a solution.", whyItMatters: "not everyone is ready to buy. but that doesn't mean they're not ready to know you exist. if you can't sell to your ICP right now, at least educate them. the poke the bear variable is how you stay on their radar without being pushy. it's the middle ground between \"here's our demo\" and \"never mind.\" it creates tension — makes someone feel the cost of inaction — without offering the fix. that tension is what gets the reply. an icebreaker says \"I see you.\" a poke the bear says \"I see what you're ignoring.\"", howYouUseIt: "I run a 3-variable personalization model across every campaign. {icebreaker} goes in email 1 (observational, personal — proves research). {poke_the_bear} goes in email 2 (challenging, thought-provoking — creates urgency). {pain_point} goes in email 3 (problem-focused, specific — names the real issue). the poke the bear is the hardest to write because it has to be specific enough to feel researched but edgy enough to create discomfort. example: \"Most $200M CPG brands are still paying 2019 3PL rates on 2026 volume — and calling it a logistics strategy.\" that's not a pitch. it's an observation that makes someone pause. I generate these with research prompts that map to the target's industry bucket — CPG gets supply chain pokes, SaaS gets tool sprawl pokes, enterprise IT gets deployment pokes. bucket-specific pain mapping is what makes the poke feel personal instead of generic.", related: ['icebreaker', 'pain-point-signal', 'variable', 'sequence'], useCases: [{ title: '3-Variable Personalization Model', problem: 'Standard 1-variable emails (just an icebreaker) were getting replies but not enough pattern interrupts to stand out in crowded inboxes.', solution: 'Built a 3-variable model that splits personalization across a sequence - {icebreaker} in email 1, {poke_the_bear} in email 2, {pain_point} in email 3. Each variable maps to industry-specific buckets with unique language.', result: 'Higher reply rates on email 2 (the poke). Bucket-specific pain mapping makes the poke feel personal instead of generic. CPG gets supply chain pokes, SaaS gets tool sprawl pokes.', tools: ['Clay', 'Research Prompts', 'Industry bucket mapping'] }] },
      { id: 'signals', name: 'Signals', definition: 'Data points that indicate intent, fit, or timing. Funding announcements, job postings, tech stack changes, web visits, content downloads, competitor mentions, G2 reviews. Anything that suggests "this company is worth talking to right now."', whyItMatters: "not all signals are created equal. some are unique and actionable. some are overrated noise that everyone's already using. the signal itself doesn't matter as much as what you can offer based on it. my guiding principle: rather than obsessing over the perfect signal, focus on what you can give them that's low-hanging fruit and actually valuable. funding announcements? everyone sees those. that's overrated. but a customer complaint thread about fulfillment delays on a company's own website? that's a signal only you found because you actually looked.", howYouUseIt: "I spec out signals per partner. what signals are unique for this ICP? what can I pull that competitors aren't using? I have 6 signal categories I sweep for: (1) funding activity — Series B-D raises that indicate scaling pressure. (2) M&A activity — acquisitions that create integration pain. (3) hiring signals — bulk job postings that reveal strategic direction. (4) market expansion — new regions, new retail partners, new product lines. (5) technology adoption — ERP migrations, new tech stack mentions. (6) customer complaints — negative reviews, WISMO threads, fulfillment issues. I built an Exa script that sweeps all 6 signal types per company with date filters (last 6 months only — signals are time-sensitive). it ran across 73 companies and returned 342 hits. each hit includes the signal type, source URL, and a cleaned text summary. those signals feed directly into research prompts that generate {pain_point} and {poke_the_bear} variables. the signal is the proof. the variable is how you use it.", related: ['pain-point-signal', 'web-reveal', 'enrichment', 'exa'] },
    ],
  },
  {
    id: 'qualification',
    name: 'Qualification',
    prompt: '$ ls ~/gtm-os/qualification/',
    terms: [
      { id: 'icp', name: 'ICP', definition: "Ideal Customer Profile. The type of company you're targeting. Industry, size, revenue, tech stack, geography, maturity stage. \"Who's a fit?\"", whyItMatters: "If you don't know your ICP, you're guessing. You waste time on companies that will never buy. You burn budget on enrichment and outreach for leads that don't qualify. ICP is the filter that separates signal from noise before you spend a dollar.", howYouUseIt: "Every partner I work with has an icp.md file in their research folder. It defines firmographics (employee count, revenue, industry), qualification criteria (must have Atlassian footprint, must have 1,000-20,000 units under management), and scoring thresholds (8-10 = qualified, 6-7 = needs research, <6 = skip). I use that ICP to build a company qualification prompt in Clay. The prompt evaluates every company against those criteria and outputs a score + reasoning. Only qualified companies move downstream.", related: ['persona', 'scoring', 'web-reveal'] },
      { id: 'persona', name: 'Persona', definition: "The type of person you're targeting within a company. Job title, department, seniority. \"Who do we talk to?\"", whyItMatters: "You can target the right company and still lose if you're talking to the wrong person. Personas define who has budget, authority, pain, and interest. A VP of Sales cares about pipeline. A Director of Ops cares about efficiency. Same company, different pitch.", howYouUseIt: "Every partner has a personas.md file with 3-5 tiers. Tier 1 = primary buyers (VP Sales, CRO). Tier 2 = secondary decision-makers (Director Sales Ops). Tier 3 = influencers (SDR Manager). Tier 4-5 = edge cases or champions. I use those tiers in a persona qualification prompt that checks job titles and assigns outreach priority. Tier 1-2 = high priority, custom research. Tier 3 = standard sequence. Tier 4-5 = nurture or skip.", related: ['icp', 'routing', 'scoring'] },
      { id: 'web-reveal', name: 'Web Reveal', definition: 'When someone visits your website and you capture their company, sometimes their identity, and route them into outbound workflows based on ICP fit.', whyItMatters: "Inbound interest is the warmest signal you can get. If someone from a target account visits your pricing page, they're researching. If you wait for them to fill out a form, you lose. Web reveal lets you capture that intent and act on it immediately \u2014 route qualified visitors into outreach, enrich contacts at that company, prioritize them in your pipeline.", howYouUseIt: "I use Vector + Midbound for web reveal. When a qualified company visits, the signal fires into Clay. Clay runs company qualification (does it fit ICP?), persona enrichment (find the right contacts), single-provider email lookup (get addresses), MX routing (Google \u2192 Instantly, non-Google \u2192 HeyReach), and personalization research (generate icebreakers referencing the site visit). Web reveal is Play 5. It's one of the highest-converting workflows because the intent signal is real.", related: ['icp', 'routing', 'signals'] },
      { id: 'routing', name: 'Routing', definition: "The logic that determines where a contact goes after qualification. Qualified + Google email \u2192 Instantly. Qualified + non-Google email \u2192 HeyReach. Not qualified \u2192 skip. Needs research \u2192 manual review.", whyItMatters: "Qualification without routing is useless. You know who's a fit \u2014 now what? Routing automates the \"now what.\" It connects qualification to action. Instead of \"this lead is good,\" it's \"this lead is good AND going to the high-priority Instantly sequence AND getting handed to the AE.\"", howYouUseIt: "I build routing logic in Clay with formula columns and conditional filters. After company + persona qualification, I run a routing decision prompt that outputs: route (outreach / enrich_company / manual_review / skip), priority (high / medium / low), and next step. High-priority routes sync to HubSpot and Instantly. Medium routes go to standard sequences. Low goes to nurture. Manual_review gets flagged for human check. Routing is the bridge between \"data in\" and \"action out.\"", related: ['icp', 'persona', 'mx-record'] },
      { id: 'scoring', name: 'Scoring', definition: 'Assigning a numeric value to a company or contact based on how well they match your criteria. Simple version: 0-10 scale. Advanced version: 200-point composite with weighted dimensions.', whyItMatters: "Binary yes/no qualification is too rigid. Scoring adds nuance. A company might be a 7 \u2014 not perfect, but close. Maybe they're missing one signal. Maybe they're in a gray-zone industry. Scoring lets you tier leads by strength instead of just pass/fail. It also lets you route by priority \u2014 9-10 gets the premium sequence, 6-7 gets standard. and when you move from a simple 0-10 scale to a multi-dimensional composite score, you can weight what matters most per partner. persona fit might matter more than revenue size. vertical match might matter more than tech stack. the weights tell the model what to prioritize.", howYouUseIt: "I use two scoring models depending on partner complexity. model 1 — simple 0-10: the qualification prompt checks firmographics against ICP and outputs a score, confidence level, and reasoning. 8-10 = qualified, 6-7 = needs research, <6 = skip. this works for most campaigns. model 2 — 200-point composite: I built this for a partner with complex qualification needs. 100 points for Fit Score (Persona Match 30pts, Revenue Band 25pts, Vertical Match 25pts, Tech Stack 20pts) and 100 points for Engagement Score (Email Opens 5pts, Link Clicks 15pts, Website Visit 10pts, Demo Page Visit 25pts, Reply 25pts, Meeting Booked 20pts). the composite score lets you rank leads by both fit AND engagement — a perfect-fit company with zero engagement scores differently than a good-fit company that's been clicking every email. the 200-point model feeds into Clay routing logic: 150+ = hot lead (route to AE immediately), 100-149 = warm (high-priority sequence), 50-99 = nurture, <50 = skip. scoring models should match the complexity of the sales motion. don't build a 200-point model for a 2-email campaign.", related: ['icp', 'routing', 'persona'] },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    prompt: '$ ls ~/gtm-os/crm/',
    terms: [
      { id: 'properties', name: 'Properties', definition: 'Custom fields in a CRM (HubSpot, Salesforce) that store data about contacts, companies, or deals. "Industry," "Employee Count," "ICP Score," "Last Outreach Date," "Lifecycle Stage."', whyItMatters: "when I was manually building buying committees in Salesforce, I didn't understand properties. I just filled in the default fields and hoped they were enough. they weren't. CRMs are useless without custom properties. they're just contact lists. properties turn them into databases. I learned this when a sales rep asked \"show me everyone we contacted in Q4 who didn't reply\" and I had to scroll through 2,000 records because we didn't have a last_outreach_date property.", howYouUseIt: "I create custom properties in HubSpot for every enrichment field that matters. icp_score (0-10), persona_tier (1-5), mx_provider (Google/Microsoft/Other), web_reveal_date, last_clay_sync. I map Clay columns to HubSpot properties in the sync so enriched data flows automatically. I also use properties to build views \u2014 \"show me all contacts with icp_score >= 8 AND persona_tier <= 2 AND last_outreach_date is unknown.\" properties are the query language. learn them or drown in your own data.", related: ['views', 'lifecycle-stage', 'contact-object'] },
      { id: 'lifecycle-stage', name: 'Lifecycle Stage', definition: 'A property in HubSpot that defines where a contact is in the sales process. Subscriber \u2192 Lead \u2192 MQL \u2192 SQL \u2192 Opportunity \u2192 Customer.', whyItMatters: "Lifecycle stages let you filter and automate by intent and readiness. You don't email a Customer the same way you email a Lead. You don't score an Opportunity the same way you score an MQL. Lifecycle stage is the primary segmentation axis in most CRMs.", howYouUseIt: "I sync qualified contacts from Clay into HubSpot as \"Lead\" by default. If they reply to outbound, they move to \"MQL.\" If an AE qualifies them, they move to \"SQL.\" If a deal opens, they move to \"Opportunity.\" I use lifecycle stage in views \u2014 \"show me all SQLs created this month\" or \"show me Leads with no outreach in 30 days.\" I don't manually update lifecycle. It's automated based on activity (reply = MQL, meeting booked = SQL).", related: ['properties', 'pipeline', 'views'] },
      { id: 'pipeline', name: 'Pipeline', definition: 'The stages a deal moves through from open to close. Discovery \u2192 Demo \u2192 Proposal \u2192 Negotiation \u2192 Closed Won / Closed Lost.', whyItMatters: "Pipeline is how you track revenue. It's not enough to know \"we have 50 deals.\" You need to know where they are, how long they've been there, and what the next step is. Pipeline visibility is the difference between \"we're busy\" and \"we're forecasting $200k closing this quarter.\"", howYouUseIt: "I don't manage pipeline manually \u2014 that's the AE's job. But I do care about pipeline creation. When a qualified lead from Clay moves to SQL and an AE opens a deal, that deal enters the pipeline. I track \"deals created from web reveal\" vs \"deals created from cold outbound\" as separate sources so I know which workflows are actually driving revenue. Pipeline isn't a GTM engineer's daily tool, but it's the end goal. Everything upstream (qualification, enrichment, routing, personalization) exists to fill the pipeline with real opportunities.", related: ['lifecycle-stage', 'scoring'] },
      { id: 'views', name: 'Views', definition: 'Saved filters in a CRM that show a specific segment of contacts, companies, or deals. "All MQLs created this week," "Companies with ICP score 8-10 and no outreach," "Deals in Discovery stage over 30 days."', whyItMatters: "Views turn a CRM from a database into a workspace. Without views, you're scrolling through thousands of records trying to find the ones that matter. With views, you click \"High-priority leads\" and see exactly who to call today. Views are how you operationalize your data.", howYouUseIt: "I build views in HubSpot based on properties. \"ICP score >= 8 AND persona tier <= 2 AND last contacted is unknown\" = outreach-ready leads. \"Lifecycle stage = MQL AND create date is last 7 days\" = fresh inbound. \"Web reveal date is known AND deal associated is unknown\" = intent signal with no follow-up. I don't create views for every possible filter. I create views for the 5-10 segments that matter daily. Views are shortcuts. Build them for the actions you repeat.", related: ['properties', 'lifecycle-stage'] },
      { id: 'contact-object', name: 'Contact Object', definition: 'The database record type in a CRM that stores individual people. Name, email, title, company association, lifecycle stage, custom properties.', whyItMatters: "Contacts are the atomic unit of outbound. Companies are targets. Deals are revenue. But contacts are the people you actually email, call, and pitch. Understanding the contact object \u2014 what properties it has, how it syncs, what triggers updates \u2014 is the foundation of CRM hygiene.", howYouUseIt: "I sync enriched contacts from Clay to HubSpot contact objects. Each contact gets: email (primary key), first name, last name, job title, company association (linked to company object), persona tier, ICP score, enrichment date. I map Clay columns to HubSpot contact properties in the sync settings. I don't create duplicate contacts \u2014 Clay checks for existing emails before syncing. Contact objects are where all the enrichment and qualification data lives in the CRM. If the contact object is messy (duplicate emails, missing properties, stale data), the whole CRM breaks.", related: ['properties', 'lifecycle-stage'] },
    ],
  },
  {
    id: 'ai-mcp',
    name: 'AI & MCP',
    prompt: '$ ls ~/gtm-os/ai-mcp/',
    terms: [
      {
        id: 'mcp-server',
        name: 'MCP Server',
        definition:
          'Model Context Protocol server. A bridge that connects an AI agent (like Claude) to an external tool — Instantly, HeyReach, Slack, Exa, Smartlead — so the agent can read data and take actions without you copy-pasting between tabs.',
        whyItMatters:
          "before MCPs, using AI in GTM meant copying data out of one tool, pasting it into ChatGPT, copying the output, and pasting it into another tool. that's not automation — that's a human clipboard with extra steps. MCP servers let the AI talk directly to your tools. it can read your Instantly campaign stats, check your Smartlead inbox, search Exa for company intel, and post to Slack — all without you touching any of those platforms. the AI becomes an operator, not just a text generator. that's what changed my workflow from \"AI-assisted\" to \"AI-operated.\"",
        howYouUseIt:
          "I run MCP servers for every tool in my GTM stack. Exa MCP for company research and people search. Smartlead MCP for campaign monitoring and lead management. Slack MCP for team notifications. Typefully MCP for content scheduling. each one is a JSON config block that tells Claude how to connect — the command to run, the API key to use, the endpoints available. when I say \"check Smartlead for replies in the last 24 hours,\" Claude calls the Smartlead MCP directly. when I say \"find companies similar to this seed list,\" it calls Exa. no browser tabs. no copy-paste. the MCP layer is what turns Claude from a chatbot into a GTM co-pilot.",
        related: ['exa', 'smartlead', 'orchestration', 'clay'],
      },
      {
        id: 'exa',
        name: 'Exa',
        definition:
          'AI-native search API. Find companies, people, news, and content using natural language queries instead of keyword matching. Available as both an MCP server (for Claude) and a Python SDK (for scripts).',
        whyItMatters:
          "traditional search APIs return keyword matches. Exa returns meaning matches. when I search \"CPG brands struggling with 3PL fulfillment,\" I don't get SEO-optimized blog posts — I get actual companies dealing with that problem. that's a fundamentally different search. it also has a find_similar() function that takes a seed URL and returns companies like it. that's TAM expansion in one API call. I went from manually researching companies one by one to enriching 73 companies in a single session — icebreakers, trigger signals, and new contacts — all from Exa.",
        howYouUseIt:
          "I use Exa two ways. first, the MCP server — Claude connects directly to Exa for real-time research during conversations. I ask \"find recent news about this company\" and Claude searches Exa and returns results inline. second, the Python SDK — I wrote 4 enrichment scripts that run at scale: (1) icebreaker enrichment — crawls each company's domain for case studies and thought leadership, outputs contextual icebreakers. (2) signal detection — sweeps for 6 trigger types (funding, M&A, hiring, expansion, tech adoption, complaints) with date filters. (3) persona widening — searches LinkedIn for specific job titles at target companies to fill persona gaps. (4) TAM expansion — uses find_similar() with seed company URLs to discover net-new lookalike companies. 73 companies processed, 342 signals detected, 122 new contacts found, 19 new TAM companies discovered. one session. the SDK does what would take a human researcher weeks.",
        related: ['mcp-server', 'enrichment', 'signals', 'find-similar', 'enrichment-pipeline'],
        useCases: [
          {
            title: 'Exa Icebreaker Search',
            problem: 'Needed contextual icebreakers for 73 partner-play companies before ShopTalk. Manual research would take days.',
            solution: 'Python script using Exa SDK that crawls each domain for case studies, news, and thought leadership with site:{domain} queries and date-filtered news searches.',
            result: '73 companies enriched, 150KB of contextual research, ~4 hours saved vs manual research.',
            tools: ['Exa SDK', 'Python', 'CSV pipeline'],
          },
          {
            title: 'Exa Signal Detection Sweep',
            problem: 'Needed to find trigger events (funding, hiring, expansion) across 73 target accounts to fuel personalized outreach.',
            solution: 'Script sweeps 6 signal types per company with date filters (last 6 months). Each signal is categorized, timestamped, and matched to a pain point.',
            result: '342 signals detected across 73 companies. Signals mapped directly to {pain_point} and {poke_the_bear} variables.',
            tools: ['Exa SDK', 'Python', 'Signal categorization'],
          },
          {
            title: 'Exa TAM Expansion',
            problem: 'Partner needed to expand their target account list beyond known companies. Traditional list building was slow.',
            solution: 'Used find_similar() with 10 diverse seed company URLs to discover lookalike companies based on semantic similarity.',
            result: '19 net-new TAM companies discovered from 10 seed URLs. Companies scored against ICP and added to pipeline.',
            tools: ['Exa SDK', 'find_similar()', 'ICP scoring'],
          },
        ],
      },
      {
        id: 'smartlead',
        name: 'Smartlead',
        definition:
          'Email campaign platform focused on cold outreach at scale. Manages sending accounts, warmup, lead routing, and reply tracking. Alternative to Instantly with different strengths.',
        whyItMatters:
          "not every partner uses the same email tool. I use Instantly for some partners and Smartlead for others. Smartlead's strength is its campaign management at scale — it handles sender rotation, subsequences, and lead categorization natively. when you're running multi-sender campaigns across 10+ mailboxes with different warmup stages, Smartlead's architecture handles the complexity better than manually configuring it in Instantly. knowing both tools means I can pick the right one for each partner's sending volume and complexity.",
        howYouUseIt:
          "I use Smartlead for partners with high sending volume and complex sender rotation needs. the Smartlead MCP lets me monitor campaigns, check reply rates, and manage lead categories directly from Claude. I can pull campaign analytics, check which mailboxes are healthy, and flag leads that need follow-up — all without opening the Smartlead dashboard. the MCP also lets me push leads to subsequences based on engagement signals. for day-to-day monitoring, I ask Claude to check Smartlead stats and it returns open rates, reply rates, and bounce rates per campaign. that used to be a 15-minute daily dashboard check. now it's one sentence.",
        related: ['instantly', 'deliverability', 'mcp-server', 'sequence'],
      },
      {
        id: 'orchestration',
        name: 'Orchestration',
        definition:
          'The meta-pattern. How Clay, Exa, email tools, MCPs, and CRMs chain together into a complete workflow. Not one tool — the connective tissue between all of them.',
        whyItMatters:
          "every tool in a GTM stack does one thing well. Clay enriches. Exa researches. Instantly sends. HubSpot tracks. but none of them know about each other by default. orchestration is the layer that makes them work together — the routing logic, the data handoffs, the trigger conditions, the quality gates. without orchestration, you have 6 tools and 6 separate workflows. with orchestration, you have one pipeline. I learned this the hard way. I used to run each tool manually and move data between them with CSV exports. now the orchestration layer handles it: signal fires → Clay enriches → Exa researches → Instantly sends → HubSpot records. the tools didn't change. the orchestration did.",
        howYouUseIt:
          "my orchestration layer lives in Clay + MCP servers + Python scripts. Clay is the hub — it receives signals (web reveals, list imports, manual adds), runs qualification and enrichment, and syncs downstream. MCP servers let Claude monitor everything from one conversation — check Smartlead stats, search Exa for intel, post to Slack. Python scripts handle batch operations that Clay can't — like running Exa enrichment across 73 companies with rate limiting and deduplication. the orchestration pattern for a typical campaign looks like: signal trigger → Clay table → company qualification prompt → persona enrichment → Exa research (icebreakers + signals) → email enrichment → MX routing → platform sync (Instantly or HeyReach) → CRM sync (HubSpot). each step has a quality gate. if a company scores below threshold, it stops. if Exa finds no signals, it flags for manual review. orchestration isn't a tool — it's the architecture.",
        related: ['clay', 'exa', 'mcp-server', 'routing', 'enrichment-pipeline'],
      },
      {
        id: 'parallel-agents',
        name: 'Parallel Agents',
        definition:
          'Running multiple AI tasks simultaneously instead of one at a time. While one agent researches companies, another monitors campaigns, and a third drafts content. Concurrency for AI workflows.',
        whyItMatters:
          "sequential AI work is slow. if you ask Claude to research 5 companies, then check your campaign stats, then draft a LinkedIn post — that's 3 tasks in a row. with parallel agents, all 3 run at the same time. the research agent searches Exa. the monitoring agent checks Smartlead. the content agent drafts the post. you get all 3 results back in the time it would take to do one. this is especially powerful for morning ops — instead of checking each tool one by one, I launch parallel agents that check everything simultaneously and return a unified brief.",
        howYouUseIt:
          "I use parallel agents in Claude Code for multi-tool operations. when I need to enrich a batch of companies, I'll spin up an Explore agent to search the codebase while a general-purpose agent runs Exa queries and another handles data processing. for daily monitoring, parallel agents check Smartlead stats, scan for new web reveals, and review overnight Slack messages — all at once. the key is knowing which tasks are independent (can run in parallel) vs dependent (need results from a previous step). research tasks are almost always parallelizable. data processing that depends on research results is not. getting this right is the difference between a 5-minute morning brief and a 30-minute manual check.",
        related: ['mcp-server', 'orchestration'],
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Scripts',
    prompt: '$ ls ~/gtm-os/automation/',
    terms: [
      {
        id: 'enrichment-pipeline',
        name: 'Enrichment Pipeline',
        definition:
          'The full flow from raw data to scored, personalized, routed contacts. CSV in → Exa research → Clay enrichment → scoring → variable generation → platform sync → outreach. Not one step — the whole chain.',
        whyItMatters:
          "most people think of enrichment as \"find an email address.\" that's step 3 of 10. a real enrichment pipeline starts with raw company data and ends with a fully qualified, personalized, routed contact sitting in an email sequence with custom icebreakers and pain points. every step in between — company research, signal detection, persona identification, email lookup, MX routing, variable generation — is part of the pipeline. if any step fails, the output degrades. a pipeline with great enrichment but no personalization sends generic emails. a pipeline with great personalization but bad email validation sends to spam. every link matters.",
        howYouUseIt:
          "my standard enrichment pipeline for a new partner engagement: (1) seed list → Clay table with company domains. (2) Exa icebreaker enrichment — crawl each domain for case studies, news, thought leadership. (3) Exa signal detection — sweep for funding, M&A, hiring, expansion, tech adoption, complaints. (4) Clay company qualification — score against ICP criteria. (5) Clay persona enrichment — find contacts matching persona tiers. (6) Exa persona widening — if certain persona tiers are thin, broaden the title search. (7) single-provider email lookup — one provider, not a waterfall. (8) MX record check — Google vs non-Google routing. (9) Clay research prompt — generate {icebreaker}, {pain_point}, {poke_the_bear} per contact. (10) platform sync — qualified + enriched contacts push to Instantly or HeyReach. this pipeline ran across 73 companies in one session. the Exa steps alone produced 150KB of contextual research, 342 trigger signals, and 122 new contacts.",
        related: ['enrichment', 'exa', 'clay', 'orchestration', 'routing'],
        useCases: [
          {
            title: 'Full Pipeline Run - 73 Companies',
            problem: 'New partner engagement needed a complete enrichment run from raw company list to outreach-ready contacts with personalized variables.',
            solution: '10-step pipeline: seed list to Clay, Exa icebreaker enrichment, Exa signal detection, company qualification, persona enrichment, persona widening, email lookup, MX routing, research prompt variable generation, platform sync.',
            result: '73 companies processed end-to-end. 150KB contextual research, 342 signals, 122 new contacts, all qualified, scored, and routed to outreach platforms.',
            tools: ['Clay', 'Exa SDK', 'Python', 'Instantly', 'HeyReach', 'HubSpot'],
          },
        ],
      },
      {
        id: 'rate-limiting',
        name: 'Rate Limiting',
        definition:
          'Deliberately slowing down API calls so you don\'t get blocked, hit quotas, or crash the provider\'s servers. Usually 1-2 seconds between calls. Boring but essential.',
        whyItMatters:
          "every API has rate limits. Exa, Clay, LinkedIn, Instantly — they all throttle you if you hit too fast. and getting rate-limited mid-pipeline is worse than going slow from the start. when you're processing 73 companies with 3 API calls each, that's 219 calls. without rate limiting, you'll get blocked around call 50 and have to restart. with a 1-second delay between calls, you finish in ~4 minutes with zero failures. I learned this after crashing several enrichment runs. now every script has a configurable DELAY constant. it's the first thing I set.",
        howYouUseIt:
          "every Python script I write has a DELAY variable at the top — usually 1.0 to 1.5 seconds. between each API call, the script sleeps for that duration. I also build in deduplication checks before API calls — if a company was already enriched in a previous run, skip it. that saves API credits and reduces total runtime. for Exa specifically, I space calls at 1.0s for search_and_contents() and 1.5s for find_similar() (which is heavier). for batch operations, I log progress after every call so I can see where a pipeline is and estimate time remaining. rate limiting isn't exciting, but it's the difference between a script that runs reliably and one that fails halfway through.",
        related: ['enrichment-pipeline', 'batch-processing', 'exa'],
      },
      {
        id: 'batch-processing',
        name: 'Batch Processing',
        definition:
          'Processing a list of records all at once instead of one at a time. Load a CSV of 73 companies, enrich all of them, output a new CSV with the results. The script does the work while you do something else.',
        whyItMatters:
          "interactive enrichment doesn't scale. if you're researching one company at a time in Clay or asking Claude about one prospect, you'll spend all day on 20 accounts. batch processing lets you define the workflow once — what data to pull, how to clean it, where to output it — and run it across hundreds of records. the script handles rate limiting, error recovery, deduplication, and progress logging. you come back to a finished CSV. this is the difference between \"using AI\" and \"building AI systems.\"",
        howYouUseIt:
          "I use Python scripts with csv.DictReader/DictWriter for batch processing. the pattern is always the same: (1) load input CSV. (2) load existing output CSV for deduplication. (3) iterate through each row. (4) call the API (Exa search, enrichment provider, etc.). (5) clean and structure the response. (6) append to output CSV. (7) log progress. every script supports a --test flag that only processes the first 3-5 records — so I can validate the output before running the full batch. I also build text cleaning functions that strip HTML entities, nav boilerplate, and excessive whitespace from API responses. raw API output is messy. cleaned output is usable. the cleaning step is half the work.",
        related: ['enrichment-pipeline', 'rate-limiting', 'deduplication'],
      },
      {
        id: 'deduplication',
        name: 'Deduplication',
        definition:
          'Checking for and removing duplicate records before processing. If a company was already enriched in a previous run, skip it. If a contact appears twice with slightly different names, merge them.',
        whyItMatters:
          "duplicate records waste API credits, create confusion in CRMs, and inflate your pipeline numbers. if you run an enrichment script twice without dedup, you get duplicate rows. if you import contacts to HubSpot without dedup, you get duplicate contact objects. if you send emails to duplicates, the same person gets two identical messages and marks you as spam. deduplication is a gate that should exist at every handoff point in the pipeline.",
        howYouUseIt:
          "I build dedup into every script. at the start of a batch run, I load the existing output CSV and build a set of already-processed domains or emails. before each API call, I check: is this domain already in the set? if yes, skip. if no, process and add to the set. this means I can re-run scripts safely — if a run fails at record 40 of 73, I restart and it picks up at record 41 automatically. for CRM dedup, Clay has Sculptor (AI-powered fuzzy matching) that catches \"Microsoft\" vs \"Microsoft Corporation\" vs \"MSFT.\" for contact-level dedup, I use email as the primary key — if the email already exists in HubSpot, update the record instead of creating a new one.",
        related: ['batch-processing', 'sculptor', 'validation', 'enrichment-pipeline'],
      },
      {
        id: 'find-similar',
        name: 'Find Similar',
        definition:
          'Exa SDK function that takes a seed URL and returns companies with similar web presence, positioning, and content. TAM expansion in one API call — give it your best customers, get back companies that look like them.',
        whyItMatters:
          "building a target account list usually means manual research — searching LinkedIn, scanning industry directories, asking for referrals. find_similar() flips that. you give it your 5-10 best-fit companies and it finds more like them. it's not keyword matching — it's semantic similarity based on web content. a supply chain consulting firm and a 3PL strategy firm look different on paper but similar in Exa's model. that's the kind of match you'd miss with traditional search. I used it to expand a partner's TAM by 19 net-new companies from 10 seed URLs. those are companies we never would have found manually.",
        howYouUseIt:
          "I pick 5-10 diverse seed companies from the top tier of an existing account list — different segments, different sizes, but all strong ICP fits. I pass their domains to exa.find_similar() with num_results=20 (wide net). the response includes company descriptions, domain authority signals, and content summaries. I then dedup against the existing account list, remove known companies, and score the remainder against ICP criteria. the output is a CSV of net-new lookalike companies ready for qualification. the key insight: diverse seeds produce better results than similar seeds. if all your seeds are the same type of company, find_similar() returns the same type. spread your seeds across segments and you discover adjacent markets you didn't know existed.",
        related: ['exa', 'enrichment-pipeline', 'icp', 'batch-processing'],
      },
    ],
  },
  {
    id: 'tool-evaluation',
    name: 'Tool Evaluation',
    prompt: '$ ls ~/gtm-os/tool-evaluation/',
    terms: [
      {
        id: 'data-lake',
        name: 'Data Lake',
        definition:
          'A persistent store of every enrichment result, qualification score, and engagement signal your GTM team has ever generated. Keyed by company domain. Queried before enrichment to avoid re-paying for data you already have.',
        whyItMatters:
          "most GTM teams treat enrichment as a per-campaign expense. they enrich 500 leads, run the campaign, archive the table, and start fresh next quarter. if 200 of those leads overlap, they just paid for the same data twice. a data lake stores every enrichment result with a timestamp. before running a new campaign, you query the lake first and only enrich the gaps. I've seen this cut enrichment costs by 40-60% for teams with overlapping target lists. beyond cost savings, a data lake builds institutional knowledge. you can see how a company's tech stack, headcount, and hiring signals changed over six months. that context makes outbound more relevant than any single-point enrichment.",
        howYouUseIt:
          "I build a simple data lake as the foundation of every GTM engagement. PostgreSQL or SQLite with three core tables: companies (keyed by domain), contacts (keyed by email), and enrichment_results (timestamped). every enrichment pipeline checks the lake first. if the company was enriched within 90 days, use the cached data. only call Clay, Apollo, or Exa for stale or missing records. the lake also feeds analytics - which companies appeared in multiple campaigns, which contacts engaged across channels, which enrichment providers returned the best data. that is the kind of analysis you cannot do when every campaign is a throwaway CSV.",
        related: ['enrichment-pipeline', 'batch-processing', 'deduplication', 'credit-transparency'],
      },
      {
        id: 'mcp-litmus-test',
        name: 'MCP Litmus Test',
        definition:
          'A three-level evaluation framework for GTM tools: Level 1 - does it have an API? Level 2 - is there a CLI? Level 3 - does it ship an MCP server? The score determines how automatable the tool is and whether it belongs in a modern GTM stack.',
        whyItMatters:
          "every GTM tool has a web interface. that is table stakes. the real question is whether the tool can be operated without clicking. can an AI agent call it? can a cron job trigger it? can a script run it at 2 AM? a tool stuck at GUI-only has an automation ceiling. you can scale the team, but you cannot scale the process. I evaluate every tool in a client's stack against this test. the results usually reveal why certain workflows bottleneck - the enrichment layer is fully automatable (Level 3) but the outreach layer requires manual intervention (Level 0). that mismatch is where pipeline velocity dies.",
        howYouUseIt:
          "I score every tool in the stack 0-3 during a stack audit. Level 0 means GUI only - no programmatic access at all. Level 1 means REST API with authentication. Level 2 means official CLI tooling. Level 3 means MCP server available. tools like HubSpot and GitHub score 3. tools like Clay score 1-2 (API exists but most power is in the GUI). tools with no API score 0 and get flagged for replacement. the aggregate score across the stack tells you how automatable your GTM motion is. a stack averaging 2.5+ is ready for agent-driven orchestration. a stack averaging 1.0 needs infrastructure work before automation makes sense.",
        related: ['mcp-server', 'orchestration', 'vendor-lock-in', 'credit-transparency'],
      },
      {
        id: 'credit-transparency',
        name: 'Credit Transparency',
        definition:
          'The ability to see exactly what each enrichment, send, and lookup costs at the per-action level. Not just total credits consumed, but credits per workflow, per campaign, per lead. The foundation of GTM cost management.',
        whyItMatters:
          "most GTM tools use credit-based pricing, but most teams have no idea what they are spending per lead or per campaign. a Clay table with 10 enrichment columns processing 500 leads can burn 5000-7500 credits in one run. without per-action tracking, you do not know until you hit your limit and enrichments stop mid-pipeline. I treat credit tracking the same way a CFO treats expense tracking. every credit should be attributable to a campaign. the teams I audit that have credit transparency in place consistently spend 30-40% less than teams operating blind - not because they do less, but because they stop wasting credits on low-performing campaigns.",
        howYouUseIt:
          "I implement a simple credit tracking layer in the first week of every engagement. a spreadsheet or database that logs credits consumed per campaign alongside pipeline outcomes. campaign A used 2000 credits and generated 8 meetings. campaign B used 3000 credits and generated 2 meetings. the decision is obvious. I also set credit budgets per campaign before launch - if you estimate 500 leads at 10 credits each, budget 5000 credits. if the campaign exceeds budget, pause and investigate. this framework takes 30 minutes per week to maintain and saves thousands per quarter.",
        related: ['data-lake', 'vendor-lock-in', 'mcp-litmus-test'],
      },
      {
        id: 'vendor-lock-in',
        name: 'Vendor Lock-In',
        definition:
          'When switching away from a tool or agency requires starting from zero - no data export, no workflow portability, no institutional knowledge transfer. The cost of leaving exceeds the cost of staying, even when staying means suboptimal results.',
        whyItMatters:
          "vendor lock-in is the most expensive problem in GTM that nobody budgets for. it shows up when the agency controls your tool logins, when your enrichment data lives in their accounts, when your outbound sequences are built on their templates in their platforms. you are paying a premium for campaigns, but you own none of the infrastructure. I see this pattern in almost every agency audit. the client has been running outbound for two years and owns zero assets - no data, no workflows, no documentation. if they leave the agency tomorrow, they start from scratch. that is not a partnership. that is a dependency.",
        howYouUseIt:
          "during every stack audit, I check three things. first, who owns the logins? every tool should be in the client's accounts with their credentials. second, can the data be exported? enrichment results, campaign analytics, contact lists - all should be exportable in standard formats. third, is the workflow documented? if the person who built it leaves, can someone else operate it? a go-to-market engineer builds everything in the client's accounts from day one. documentation is written as the system is built, not after. when the engagement ends, the client has a running system with full ownership. that is the opposite of lock-in.",
        related: ['credit-transparency', 'mcp-litmus-test', 'data-lake'],
      },
      {
        id: 'go-to-market-engineer-consultant',
        name: 'Go-to-Market Engineer Consultant',
        definition:
          'An independent practitioner who evaluates GTM stacks, audits agency relationships, recommends tools based on fit (not vendor allegiance), builds infrastructure in client accounts, and transfers full ownership. The strategist to the strategist.',
        whyItMatters:
          "the GTM space has agencies, vendors, recruiters, and in-house engineers. what it lacks is an independent evaluator - someone who can look at your stack, your agency, your tools, and your workflows with no bias toward any platform or provider. agencies recommend tools they have partnerships with. vendors recommend themselves. recruiters recommend hiring. a go-to-market engineer consultant recommends what actually fits your situation, even when the answer is 'you do not need to buy anything new.' that independence is the value proposition. the same tribal knowledge agencies charge for, but aligned to your outcomes, not their retainer.",
        howYouUseIt:
          "the engagement follows four phases. audit: evaluate the current stack, agency relationships, tool consumption, and workflow efficiency. recommend: provide independent tool recommendations with buy-vs-build analysis for every layer. build: construct the enrichment pipelines, qualification workflows, and outbound automation in the client's accounts. transfer: document everything, train the team, and hand over full ownership. the client owns every login, every workflow, every piece of data. no lock-in, no dependency. the system runs independently after handoff. this is what makes the model different from an agency retainer - there is a defined endpoint where the client is self-sufficient.",
        related: ['vendor-lock-in', 'credit-transparency', 'mcp-litmus-test', 'data-lake'],
      },
    ],
  },
]

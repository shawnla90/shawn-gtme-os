/* ── types ───────────────────────────────────────── */

export interface EmailTerm {
  id: string
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  related: string[]
}

export interface EmailCategory {
  id: string
  name: string
  prompt: string
  terms: EmailTerm[]
}

/* ── affiliate link placeholder ─────────────────── */

export const INBOX_KIT_AFFILIATE_LINK = '#inbox-kit-affiliate'

/* ── content data ────────────────────────────────── */

export const EMAIL_CATEGORIES: EmailCategory[] = [
  {
    id: 'infrastructure-basics',
    name: 'Infrastructure Basics',
    prompt: '$ ls ~/gtm-os/email-infra/',
    terms: [
      {
        id: 'secondary-domains',
        name: 'Secondary Domains',
        definition:
          'Separate domains used exclusively for outbound email. Not your primary company domain. Variations like "acme-team.com" or "tryacme.io" that protect your main brand reputation if something goes wrong.',
        whyItMatters:
          "If you send cold email from your primary domain and deliverability tanks, your entire company's email reputation goes with it. Sales emails, support emails, internal comms — all damaged. Secondary domains create a firewall. If one burns, you rotate it out. Your primary domain stays clean. I learned this the hard way when I was an SDR sending from the company's main domain with zero warmup. Half my emails hit spam. IT had to intervene.",
        howYouUseIt:
          "Every partner campaign gets dedicated secondary domains. I register variations of the brand — close enough to be recognizable, different enough to protect the primary. Each domain gets its own DNS records (SPF, DKIM, DMARC), its own warmup cycle, and its own sending limits. If a domain's reputation drops, I pull it from rotation and swap in a spare. The primary domain never touches outbound.",
        related: ['dns-records', 'domain-warming', 'domain-mailbox-rotation'],
      },
      {
        id: 'dns-records',
        name: 'DNS Records (SPF / DKIM / DMARC)',
        definition:
          'Three DNS authentication records that prove your emails are legitimate. SPF says which servers can send on your behalf. DKIM adds a cryptographic signature. DMARC tells receiving servers what to do if SPF or DKIM fail.',
        whyItMatters:
          "Without these three records, your emails look unverified to inbox providers. Google and Microsoft check all three before deciding whether to deliver, flag, or reject your message. Missing SPF? Suspicious. No DKIM? No signature. No DMARC? No policy. You're basically sending unsigned mail from an unverified address. Most cold emailers skip DMARC entirely. That's a mistake.",
        howYouUseIt:
          "Every secondary domain I set up gets all three configured before a single email sends. SPF points to the sending platform (Instantly's servers). DKIM gets configured through the inbox provider (Google Workspace or Microsoft 365). DMARC starts at p=none for monitoring, then moves to p=quarantine once I confirm alignment. I verify all three with MXToolbox before warmup starts. If any record is missing or misconfigured, I don't send.",
        related: ['secondary-domains', 'domain-warming', 'inbox-providers'],
      },
      {
        id: 'inbox-setup',
        name: 'Inbox Setup',
        definition:
          'The process of creating sending mailboxes on secondary domains. Each mailbox is a "from" address — the identity that sends the email. john@acme-team.com, sarah@tryacme.io.',
        whyItMatters:
          "You can't send from a domain alone. You need mailboxes. Each mailbox has its own reputation, its own sending limits, and its own warmup timeline. The number of mailboxes you set up determines your total daily sending capacity. Too few and you can't reach enough people. Too many without proper warmup and you burn them all.",
        howYouUseIt:
          "I set up mailboxes through the inbox provider — Google Workspace or Microsoft 365 — on each secondary domain. Each mailbox gets a real-looking name (not noreply@). I configure display names, profile photos when possible, and email signatures. Then each mailbox goes into the sending platform (Instantly) for warmup. I don't send real campaigns from a mailbox until it's been warming for at least 2 weeks.",
        related: ['secondary-domains', 'inbox-providers', 'sending-volume-rules', 'domain-mailbox-rotation'],
      },
    ],
  },
  {
    id: 'inbox-providers',
    name: 'Inbox Providers',
    prompt: '$ ls ~/gtm-os/inbox-providers/',
    terms: [
      {
        id: 'inbox-kit',
        name: 'Inbox Kit',
        definition:
          'A service that handles secondary domain registration, inbox provider setup, DNS configuration, and mailbox provisioning in one workflow. Instead of manually buying domains, configuring Google Workspace, setting up SPF/DKIM/DMARC, and creating mailboxes one by one — Inbox Kit does it all.',
        whyItMatters:
          "Setting up 18-36 sending mailboxes across 18-36 domains manually is brutal. Each domain needs DNS records. Each mailbox needs an inbox provider account. Each account needs configuration. If you're doing it yourself, that's hours of repetitive work per campaign launch. Inbox Kit collapses that into a single workflow. Time saved compounds — especially when you're managing infrastructure for multiple partners.",
        howYouUseIt:
          "I use Inbox Kit to spin up sending infrastructure for every partner campaign. I specify the number of domains and mailboxes I need, the naming conventions, and the inbox provider split (Google Workspace + Microsoft 365). Inbox Kit provisions everything — domains, DNS, mailboxes — and I connect them to Instantly for warmup. It's the fastest path from \"we need email infrastructure\" to \"we're warming inboxes.\"",
        related: ['google-workspace', 'microsoft-365', 'secondary-domains', 'dns-records'],
      },
      {
        id: 'google-workspace',
        name: 'Google Workspace',
        definition:
          'Google\'s business email platform. When you set up a mailbox on Google Workspace, you\'re sending through Gmail\'s infrastructure. Your emails come from "you@yourdomain.com" but route through Google\'s servers.',
        whyItMatters:
          "Google Workspace has the best deliverability to other Google Workspace inboxes. Google trusts Google. If your target audience uses Gmail or Google Workspace (check their MX records), sending from Google Workspace gives you the highest chance of landing in the primary inbox. It's also the most reliable provider for Instantly's warmup network.",
        howYouUseIt:
          'I set up Google Workspace mailboxes on secondary domains for contacts whose MX records show Google. This is the core of my routing logic — Google-to-Google delivers best. These mailboxes connect to Instantly for warmup and sending. Google Workspace has stricter sending limits than Microsoft (start at 25/day vs 10-15/day for Microsoft), but the deliverability advantage is worth it for Google-to-Google sends.',
        related: ['microsoft-365', 'mx-routing', 'inbox-kit', 'instantly'],
      },
      {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        definition:
          'Microsoft\'s business email platform. Mailboxes send through Outlook/Exchange infrastructure. Your emails come from "you@yourdomain.com" but route through Microsoft\'s servers.',
        whyItMatters:
          "Enterprise companies disproportionately use Microsoft 365. If your ICP is enterprise, a significant chunk of your contacts have Outlook/Exchange inboxes. Sending from Microsoft 365 to Microsoft 365 improves deliverability for the same reason Google-to-Google works — providers trust their own infrastructure. But Microsoft is also stricter about cold email and harder to warm.",
        howYouUseIt:
          "I use Microsoft 365 mailboxes for contacts whose MX records show Microsoft/Outlook. These mailboxes have lower daily sending limits (start at 10-15/day, ramp carefully). I split my sending infrastructure — some domains on Google Workspace, some on Microsoft 365 — so I can route to the best-matching provider. Microsoft warmup takes longer and requires more patience. I don't rush it.",
        related: ['google-workspace', 'mx-routing', 'inbox-kit', 'sending-volume-rules'],
      },
      {
        id: 'provider-split',
        name: 'Why You Split Google + Microsoft',
        definition:
          'The practice of maintaining sending infrastructure on both Google Workspace and Microsoft 365 instead of picking one. You split because your contacts use both, and provider-to-provider matching improves deliverability.',
        whyItMatters:
          "If 60% of your contacts use Google and 40% use Microsoft, sending everything from Google means 40% of your emails are crossing provider lines. Cross-provider sends have lower deliverability — Microsoft doesn't trust Google's sending servers as much as its own. By splitting your infrastructure, you match sender to recipient at the provider level. Google sends to Google. Microsoft sends to Microsoft.",
        howYouUseIt:
          "When I set up infrastructure through Inbox Kit, I specify a provider split based on the ICP's likely inbox distribution. If the partner targets SMBs (mostly Google), I go 70/30 Google/Microsoft. If they target enterprise (mostly Microsoft), I flip it. The MX record check in Clay determines which contact goes to which provider. The split isn't always 50/50 — it follows the data.",
        related: ['google-workspace', 'microsoft-365', 'mx-routing', 'inbox-kit'],
      },
      {
        id: 'cheapest-route',
        name: 'Cheapest Route Rationale',
        definition:
          "The principle of using the most cost-effective inbox provider setup that still delivers results. Google Workspace costs more per mailbox than Microsoft 365. But cost alone doesn't determine the split — deliverability and ICP match do.",
        whyItMatters:
          "Teams overspend on email infrastructure because they don't think about cost per mailbox at scale. If you need 36 mailboxes and Google Workspace costs $7/user/month while Microsoft 365 costs $6/user/month, that's a $36/month difference. Not huge — but it adds up across multiple partner campaigns. The cheapest route isn't always the best route. It's the one that balances cost with deliverability for your specific ICP.",
        howYouUseIt:
          "I factor cost into the provider split but I don't optimize purely for price. If a partner's ICP is 80% Google, I'm not going to use Microsoft mailboxes because they're cheaper. I go Google because that's where deliverability is highest. But for the 20% that's Microsoft, I use Microsoft 365 at its lower price point. The cheapest route is the one that doesn't waste money sending to the wrong provider.",
        related: ['google-workspace', 'microsoft-365', 'provider-split'],
      },
    ],
  },
  {
    id: 'mx-routing',
    name: 'MX Records & Routing',
    prompt: '$ ls ~/gtm-os/mx-routing/',
    terms: [
      {
        id: 'mx-record-lookup',
        name: 'MX Record Lookups',
        definition:
          "Querying a domain's DNS to find its mail exchange (MX) records. The MX record tells you which email servers handle mail for that domain — Google, Microsoft, Mimecast, Barracuda, custom Exchange, etc.",
        whyItMatters:
          "You can't route contacts effectively without knowing their inbox provider. If you guess wrong, your emails hit spam or bounce. MX record lookups remove the guessing. They tell you exactly which provider a company uses for email. That one data point determines your entire routing logic — which platform sends the email, which infrastructure it sends from, and whether you email at all.",
        howYouUseIt:
          "In Clay, I run an MX record lookup on every contact's email domain using the HTTP API integration. The API returns the domain's MX records (e.g., 'aspmx.l.google.com' for Google, 'mail.protection.outlook.com' for Microsoft). I parse the result with a formula column that classifies the provider. This classification feeds the routing decision downstream. MX lookups are one of the cheapest, highest-ROI enrichment steps in any campaign.",
        related: ['enterprise-mx-patterns', 'routing-logic', 'clay-http-api'],
      },
      {
        id: 'enterprise-mx-patterns',
        name: 'Enterprise = More Microsoft / Outlook',
        definition:
          'The pattern that enterprise companies (1,000+ employees) disproportionately use Microsoft 365 / Exchange / Outlook for email. SMBs and startups lean Google Workspace. Mid-market is mixed.',
        whyItMatters:
          "This pattern shapes your entire infrastructure strategy. If your ICP is enterprise, you need more Microsoft 365 sending infrastructure because most of your contacts are on Microsoft. If you only set up Google Workspace mailboxes and try to reach enterprise contacts, you're sending cross-provider for the majority of your list. Deliverability suffers.",
        howYouUseIt:
          "Before I set up infrastructure for a new partner, I check the ICP. Enterprise ICP? I lean the provider split toward Microsoft 365 (60/40 or 70/30 Microsoft/Google). SMB ICP? I lean toward Google Workspace. I also validate this assumption with a test batch — run MX lookups on the first 500 contacts and check the actual distribution. Sometimes the assumption is wrong. The data tells me the real split.",
        related: ['mx-record-lookup', 'provider-split', 'microsoft-365'],
      },
      {
        id: 'routing-logic',
        name: 'Routing Logic (Google → Instantly, Non-Google → HeyReach)',
        definition:
          'The decision tree that determines where a contact goes based on their MX record. Google MX → route to Instantly (email). Non-Google MX → route to HeyReach (LinkedIn). No email found → route to HeyReach (LinkedIn).',
        whyItMatters:
          "I can deliver reliably to Google Workspace inboxes from my Instantly setup. I can't deliver reliably to Microsoft 365 or custom Exchange servers. Instead of forcing bad sends, I route non-Google contacts to LinkedIn outreach via HeyReach. This preserves my email domain reputation and reaches the contact through a channel where provider mismatch doesn't matter.",
        howYouUseIt:
          "After the MX record lookup in Clay, a routing formula checks the result. If the MX contains 'google' or 'googlemail,' the contact routes to the Instantly campaign. If it contains 'outlook,' 'protection.outlook,' or anything else, the contact routes to HeyReach for LinkedIn. If there's no email at all, it routes to HeyReach by default. This logic runs automatically. I don't manually sort contacts.",
        related: ['mx-record-lookup', 'instantly', 'heyreach', 'deliverability'],
      },
      {
        id: 'clay-http-api',
        name: 'Clay HTTP API Pattern',
        definition:
          'Using Clay\'s built-in HTTP API integration to make external API calls — like MX record lookups — directly inside a Clay table. No code, no Zapier, no middleware. Just configure the endpoint, map the response, and the data lands in a column.',
        whyItMatters:
          "Clay has native integrations for common enrichment providers, but MX record lookups aren't one of them. The HTTP API integration fills that gap. It lets you call any API from inside Clay and parse the response. This is how you extend Clay's capabilities beyond its built-in integrations without leaving the platform.",
        howYouUseIt:
          "I set up an HTTP API column in Clay that calls an MX lookup service (like dns.google/resolve or a dedicated MX API). The input is the contact's email domain. The output is the raw MX record. I then use a formula column to classify the result — Google, Microsoft, or Other. This two-column pattern (HTTP API → formula classifier) is reusable. I use the same approach for tech stack lookups, SSL certificate checks, and other DNS-based enrichment.",
        related: ['mx-record-lookup', 'routing-logic', 'clay'],
      },
    ],
  },
  {
    id: 'sending-volume-rules',
    name: 'Sending Volume Rules',
    prompt: '$ ls ~/gtm-os/sending-rules/',
    terms: [
      {
        id: 'microsoft-sending-limits',
        name: 'Microsoft: 10-15/day Start, Ramp After Warmed',
        definition:
          'Microsoft 365 mailboxes should start sending at 10-15 emails per day during warmup. Don\'t increase volume until the mailbox has been warming for at least 2 weeks and shows healthy engagement metrics.',
        whyItMatters:
          "Microsoft is stricter than Google about cold email. Their spam filters are more aggressive, and new mailboxes have zero reputation. If you start at 25/day on a fresh Microsoft mailbox, you'll trigger spam filters within days. Starting at 10-15 and ramping slowly builds reputation without raising flags. Patience here saves domains.",
        howYouUseIt:
          "I configure Microsoft 365 mailboxes in Instantly with a starting limit of 10 emails/day. After 2 weeks of clean warmup (no bounces, healthy open rates in the warming pool), I bump to 15. After another week, 20. I rarely push Microsoft mailboxes past 25/day even when fully warmed. The lower ceiling means I need more Microsoft mailboxes to hit the same volume as Google — that's factored into the infrastructure plan from the start.",
        related: ['google-sending-limits', 'domain-warming', 'per-inbox-limits'],
      },
      {
        id: 'google-sending-limits',
        name: 'Google: 25/day Start, 30 Ramp',
        definition:
          'Google Workspace mailboxes can start sending at 25 emails per day and ramp to 30 after warmup. Google is more forgiving than Microsoft, but still has limits. Exceeding them triggers throttling or spam classification.',
        whyItMatters:
          "Google gives you more headroom than Microsoft, but it's not unlimited. Starting at 25/day is the sweet spot — enough volume to be useful, low enough to stay under the radar. Ramping to 30 after warmup gives you incremental capacity without pushing into risky territory. Some people push to 40-50/day. I don't. The risk isn't worth the marginal volume.",
        howYouUseIt:
          "Google Workspace mailboxes in Instantly start at 25/day. After 2-3 weeks of warmup with good engagement (opens, replies in the warming pool), I bump to 30. That's the ceiling. With 18 Google mailboxes sending 30/day, that's 540 emails/day from Google infrastructure alone. Plenty for most campaigns. If I need more, I add mailboxes — I don't increase per-mailbox limits.",
        related: ['microsoft-sending-limits', 'domain-warming', 'per-inbox-limits', 'sender-accounts'],
      },
      {
        id: 'per-inbox-limits',
        name: 'Per-Inbox Limits',
        definition:
          'The maximum number of emails a single mailbox should send per day. Not a platform-imposed limit (though those exist) — a self-imposed limit based on what delivers reliably without triggering spam filters.',
        whyItMatters:
          "Every mailbox has a reputation. Push it too hard and the reputation drops. Once a mailbox is flagged for high volume, every email from it gets scrutinized. Per-inbox limits protect individual mailbox reputation. It's better to spread volume across many mailboxes at low limits than concentrate volume in a few mailboxes at high limits.",
        howYouUseIt:
          "I set per-inbox limits in Instantly's campaign settings. Google mailboxes: 25-30/day max. Microsoft mailboxes: 10-20/day max (depending on warmup stage). These limits are non-negotiable. If a partner needs higher total volume, I add more mailboxes instead of raising per-inbox limits. The math is simple: 36 mailboxes × 25/day = 900 emails/day. That's enough for almost any campaign. More mailboxes, not more emails per mailbox.",
        related: ['microsoft-sending-limits', 'google-sending-limits', 'sender-accounts'],
      },
      {
        id: 'sender-accounts',
        name: '18-36 Sender Accounts ("From" Addresses)',
        definition:
          'The typical range of sending mailboxes for a cold email operation. 18 is the minimum for a meaningful campaign. 36 gives you redundancy, rotation capacity, and room to scale. Each sender account is a unique "from" address.',
        whyItMatters:
          "You can't run cold email at scale from 3 mailboxes. The volume per mailbox would be too high, the rotation wouldn't work, and one spam report tanks a third of your infrastructure. 18-36 accounts distribute risk, enable rotation, and give you the total daily volume you need. It's infrastructure planning, not overkill.",
        howYouUseIt:
          "For a new partner campaign, I start with 18 sender accounts as the baseline. That gives me 18 domains and 18 mailboxes — enough for 450-540 emails/day (at 25-30/mailbox). If the contact list is over 10,000 and we need faster throughput, I scale to 36 accounts. At 36 accounts with 25/day, that's 900 emails/day. I also build in rotation capacity — if 36 is my sending set, I might provision 40-45 total so I have spares ready if a domain needs to rest.",
        related: ['per-inbox-limits', 'domain-mailbox-rotation', 'campaign-math'],
      },
    ],
  },
  {
    id: 'domain-mailbox-rotation',
    name: 'Domain & Mailbox Rotation',
    prompt: '$ ls ~/gtm-os/rotation/',
    terms: [
      {
        id: 'domain-to-sender-ratio',
        name: 'Domain-to-Sender Ratio',
        definition:
          'The relationship between the number of domains and the number of sending mailboxes. At minimum, 1 domain per sender (18 senders = 18 domains). For redundancy, 1 domain with 2 mailboxes (18 senders = 18 domains, 36 mailboxes).',
        whyItMatters:
          "If you put 3 senders on 1 domain and that domain gets flagged, you lose 3 senders at once. A 1:1 domain-to-sender ratio limits blast radius — one domain flagged means one sender offline. Adding a second mailbox per domain (1:2 ratio) gives you a backup. If one mailbox's reputation dips, you rotate to the second while the first recovers. Redundancy isn't waste — it's insurance.",
        howYouUseIt:
          "My standard setup is 1 domain with 2 mailboxes. So if I need 18 active senders, I provision 18 domains with 36 mailboxes — 18 primary, 18 backup. The primary mailboxes send in the current campaign. The backups warm passively. If a primary mailbox's deliverability drops, I swap in the backup and let the primary rest. This rotation happens without pausing the campaign. If I'm running 36 active senders, I provision 36 domains with 72 mailboxes.",
        related: ['rotation-logic', 'sender-accounts', 'domain-warming'],
      },
      {
        id: 'rotation-logic',
        name: 'Rotation Logic',
        definition:
          'The system for cycling sending mailboxes in and out of active campaigns. Some mailboxes send, some rest, some warm. Rotation prevents any single mailbox from being overused and distributes reputation risk across the infrastructure.',
        whyItMatters:
          "Even with per-inbox limits, mailboxes degrade over time. Consistent cold email volume, even at safe limits, slowly erodes reputation. Rotation counteracts this by giving mailboxes rest periods. A mailbox that sends for 4 weeks and rests for 2 recovers reputation. A mailbox that sends continuously for 12 weeks burns out. Rotation is the difference between infrastructure that lasts months and infrastructure you rebuild every quarter.",
        howYouUseIt:
          "I rotate on a 4-week cycle. A mailbox sends for 4 weeks, then rests for 1-2 weeks while its backup takes over. During rest, the mailbox still warms (low-volume, engagement-based emails in Instantly's warming pool) to maintain baseline reputation. I track rotation schedules in a spreadsheet — which mailboxes are active, which are resting, when the next swap happens. It's manual but critical. Automated rotation is on my roadmap.",
        related: ['domain-to-sender-ratio', 'domain-warming', 'per-inbox-limits'],
      },
      {
        id: 'redundancy-planning',
        name: 'Redundancy: Why 1:1 Isn\'t Enough',
        definition:
          'The principle that having exactly one mailbox per domain with zero spares is a fragile setup. If any single mailbox goes down (reputation hit, bounce spike, provider suspension), you lose that sender permanently until you provision a replacement.',
        whyItMatters:
          "In cold email, things break. Domains get flagged. Mailboxes hit bounce thresholds. Inbox providers suspend accounts for \"suspicious activity.\" If you're running 18 senders with 18 domains and 18 mailboxes (1:1:1), every failure is a permanent capacity reduction. You can't just spin up a new mailbox instantly — it needs 2-3 weeks of warmup before it's usable. Redundancy means you always have warmed, ready mailboxes on standby.",
        howYouUseIt:
          "I never run a 1:1:1 setup. Minimum is 1:1:2 (1 domain, 1 active sender, 2 total mailboxes). For critical partner campaigns where downtime isn't acceptable, I go 1:1:3. The extra mailboxes cost a few dollars per month each but save weeks of recovery time when something breaks. The redundancy math: if I need 18 active senders and I want 2x redundancy, I provision 18 domains with 36 mailboxes. If I need 36 active senders with 2x redundancy, it's 36 domains with 72 mailboxes.",
        related: ['domain-to-sender-ratio', 'rotation-logic', 'sender-accounts'],
      },
      {
        id: 'pulling-domains',
        name: 'Pulling a Domain Without Killing a Campaign',
        definition:
          'The ability to remove a domain from active sending — due to reputation issues, bounce spikes, or spam reports — without disrupting the overall campaign. Requires redundancy and rotation infrastructure.',
        whyItMatters:
          "If a domain gets flagged by Gmail or Microsoft, continuing to send from it tanks deliverability for every email from that domain. You need to pull it immediately. But if pulling a domain means losing 1/18th of your sending capacity with no backup, the campaign slows down. Having pre-warmed backup mailboxes on standby means pulling a domain is a swap, not a loss.",
        howYouUseIt:
          "When I see deliverability metrics drop for a specific domain (open rates cratering, bounce rates spiking, spam complaints increasing), I pull that domain from the active campaign in Instantly. The backup mailbox on that domain stays in warming mode. I swap in a backup mailbox from a different domain that's been warming passively. The campaign continues at full volume. The flagged domain rests for 2-4 weeks. If it recovers, it re-enters rotation. If it doesn't, I retire it and provision a replacement.",
        related: ['rotation-logic', 'redundancy-planning', 'domain-warming'],
      },
    ],
  },
  {
    id: 'warming-deliverability',
    name: 'Warming & Deliverability',
    prompt: '$ ls ~/gtm-os/warming/',
    terms: [
      {
        id: 'minimum-warmup-period',
        name: 'Minimum 2-Week Warmup',
        definition:
          'The minimum time a new domain and mailbox must spend in warmup before sending real campaign emails. Two weeks of gradually increasing volume with engagement signals (opens, replies) from the warmup pool.',
        whyItMatters:
          "New domains have zero reputation. Email providers don't know if you're legitimate or a spammer. Warmup builds that reputation by proving your emails get opened, replied to, and don't bounce. Two weeks is the floor — not the ceiling. Some domains need 3-4 weeks, especially on Microsoft 365. Sending real campaigns from a domain that hasn't warmed is the fastest way to burn it.",
        howYouUseIt:
          "I enable Instantly's built-in warmup on every new mailbox from day one. The warmup pool sends low-volume emails between real mailboxes, generates opens and replies, and gradually increases volume. I don't touch the mailbox during warmup — no manual emails, no test sends, nothing. After 2 weeks, I check the warmup stats. If the domain shows healthy engagement and no flags, I start routing low-volume campaign traffic to it. If anything looks off, I extend warmup another week.",
        related: ['ramp-to-sixty', 'open-rate-rule', 'domain-warming'],
      },
      {
        id: 'ramp-to-sixty',
        name: 'Raise to 60',
        definition:
          'The warmup target where a mailbox\'s daily sending volume (warmup + campaign combined) reaches approximately 60 emails per day. This is the point where the mailbox has enough reputation data to send reliably at its campaign-level limits (25-30/day for Google, 10-20/day for Microsoft) while warmup continues in the background.',
        whyItMatters:
          "Warmup doesn't stop when campaigns start. Even during active sending, the warmup pool continues running to maintain engagement metrics. The \"raise to 60\" target means the mailbox handles ~30 warmup emails + ~30 campaign emails (for Google). This blended volume keeps the mailbox's engagement rate healthy because warmup emails always get opened and replied to. It's a counterweight to the cold campaign emails that may not get engagement.",
        howYouUseIt:
          "In Instantly's warmup settings, I set the ramp-up target to 60 per day. As the mailbox warms, Instantly gradually increases warmup volume. Once it hits 60 and I start campaigns, the split is roughly 50/50 warmup/campaign. Over time, as the mailbox builds campaign-level reputation, I can shift the ratio — more campaign, less warmup. But I never fully disable warmup on an active sending mailbox. The warmup pool is the safety net.",
        related: ['minimum-warmup-period', 'open-rate-rule', 'per-inbox-limits'],
      },
      {
        id: 'open-rate-rule',
        name: '5% Open Rate Rule for First 2 Weeks',
        definition:
          'During the first 2 weeks of a new campaign, expect low open rates (around 5%) and don\'t panic. The mailbox is building reputation with real contacts. Real open rates stabilize after 2-3 weeks of consistent sending with healthy infrastructure.',
        whyItMatters:
          "New senders freak out when their first campaign shows 5% open rates. They think the copy is bad, the list is wrong, or the platform is broken. Usually it's none of those. It's just a new domain with new mailboxes that haven't built inbox-level reputation yet. Email providers are cautious with new senders — they route some emails to spam, some to promotions, some to primary. After 2 weeks of consistent, clean sending, the ratio shifts. Open rates climb.",
        howYouUseIt:
          "I tell every partner: ignore open rates for the first 2 weeks of a new campaign on new infrastructure. The data is noise. What I watch instead is bounce rate (<5% hard bounces), spam complaints (near zero), and warmup engagement (healthy in Instantly's dashboard). If those metrics are clean, the low open rates are just the inbox providers testing us. By week 3-4, open rates should climb to 15-30% depending on the campaign. If they don't, then something's actually wrong.",
        related: ['minimum-warmup-period', 'bounce-rate-monitoring', 'ignore-twenty-percent'],
      },
      {
        id: 'ignore-twenty-percent',
        name: 'Ignore the 20% Suggestion from Instantly / Smartlead',
        definition:
          'Sending platforms like Instantly and Smartlead suggest you should aim for 20%+ open rates from the start. This is misleading for new infrastructure. It applies to warmed, established domains — not fresh setups.',
        whyItMatters:
          "Platform-suggested benchmarks cause bad decisions. A partner sees \"target: 20% open rate\" in Instantly's dashboard, their campaign is at 5% after week one, and they want to change the copy, swap the list, or pause the campaign. None of that is the right move for new infrastructure. The 20% benchmark applies to domains with months of reputation. New domains need patience, not panic.",
        howYouUseIt:
          "I set expectations upfront with every partner. I show them the warmup timeline: weeks 1-2 are reputation building (low opens expected), weeks 3-4 are stabilization (opens climbing), weeks 5+ are steady state (benchmark comparison makes sense). I ignore Instantly's in-app suggestions about target open rates during the first 2 weeks. I rely on infrastructure-level metrics (bounce rate, spam rate, warmup engagement) instead of campaign-level metrics (open rate) for early performance assessment.",
        related: ['open-rate-rule', 'minimum-warmup-period', 'bounce-rate-monitoring'],
      },
      {
        id: 'bounce-rate-monitoring',
        name: 'Bounce Rate Monitoring',
        definition:
          'Tracking the percentage of emails that fail to deliver (hard bounces = email doesn\'t exist, soft bounces = temporary failure like full inbox or server issue). Hard bounce rate above 5% indicates a data quality or infrastructure problem.',
        whyItMatters:
          "High bounce rates are the fastest way to destroy domain reputation. If 10% of your emails bounce, email providers flag your domain as sending to invalid addresses — a hallmark of spam lists. Once flagged, even valid emails from that domain go to spam. Bounce rate monitoring is the early warning system for data quality issues upstream and infrastructure problems in the sending layer.",
        howYouUseIt:
          "I check bounce rates daily for the first week of every new campaign, then weekly once metrics stabilize. In Instantly's dashboard, I monitor per-domain and per-mailbox bounce rates. If any domain exceeds 3% hard bounces, I investigate immediately — usually it's a bad batch of emails from enrichment or an MX routing error. If a specific mailbox is bouncing higher than others on the same domain, the mailbox is the problem. I pull it from the campaign and investigate. Bounce rate is the metric I watch most closely. Not opens. Not replies. Bounces.",
        related: ['open-rate-rule', 'deliverability', 'domain-warming'],
      },
    ],
  },
  {
    id: 'campaign-math',
    name: 'Campaign Math',
    prompt: '$ ls ~/gtm-os/campaign-math/',
    terms: [
      {
        id: 'minimum-contacts',
        name: 'No Campaign Under 10,000 Contacts',
        definition:
          'The principle that cold email campaigns need a minimum list size of 10,000 contacts to produce statistically meaningful results and generate enough pipeline to justify the infrastructure investment.',
        whyItMatters:
          "A 1,000-contact campaign with a 1% reply rate gives you 10 replies. After qualification, maybe 3-4 are worth pursuing. After no-shows and objections, maybe 1-2 become opportunities. That's not a pipeline — it's a rounding error. Scale is what makes cold email work. 10,000 contacts at 1% reply = 100 replies. 10-20 qualified opportunities. That's a pipeline. The infrastructure cost (domains, mailboxes, warmup) is the same whether you send to 1,000 or 10,000. Amortize it over more contacts.",
        howYouUseIt:
          "I set a minimum of 10,000 contacts for any partner campaign. If the TAM (total addressable market) is smaller than 10,000, cold email at scale might not be the right channel — we look at ABM or direct outreach instead. The contact minimum also forces better list building. You can't scrape 10,000 relevant contacts from a bad ICP definition. The list size requirement pushes teams to define ICP tightly and build comprehensive lists.",
        related: ['starting-contacts', 'message-volume', 'three-campaigns'],
      },
      {
        id: 'starting-contacts',
        name: 'Start with at Least 5,000 Contacts',
        definition:
          'For a single campaign launch, load at least 5,000 contacts into the sending platform. This is the per-campaign minimum that ensures enough volume to warm infrastructure, test messaging, and generate early signal.',
        whyItMatters:
          "5,000 contacts per campaign spread across 18 sending accounts at 25/day means the campaign runs for roughly 11 days. That's enough to cycle through the full list, measure open/reply rates with statistical significance, and decide whether to scale. Fewer than 5,000 and the data is too thin to optimize. You're guessing, not testing.",
        howYouUseIt:
          "When I set up a new campaign in Instantly, I load a minimum of 5,000 qualified, enriched, MX-routed contacts. I don't start a campaign with 500 contacts \"just to test.\" That tells me nothing. I start with 5,000, measure for 2 weeks, and make data-driven decisions about copy, targeting, and channel mix based on real metrics at meaningful volume.",
        related: ['minimum-contacts', 'message-volume', 'three-campaigns'],
      },
      {
        id: 'message-volume',
        name: 'Up to 20,000 Messages',
        definition:
          'The approximate message ceiling for a single campaign cycle. 10,000 contacts × 2-3 emails per sequence = 20,000-30,000 total messages. This is the volume that standard infrastructure (18-36 sender accounts) can handle in a 4-6 week campaign window.',
        whyItMatters:
          "Message volume determines infrastructure requirements. 20,000 messages across 18 senders at 25/day = ~44 days. 20,000 messages across 36 senders at 25/day = ~22 days. The relationship between message volume, sender count, and time-to-completion drives every infrastructure decision. If you need to send faster, add senders. Don't raise per-inbox limits.",
        howYouUseIt:
          "I calculate message volume before infrastructure provisioning. Total contacts × emails per sequence = total messages. Total messages ÷ (sender accounts × daily limit) = days to complete. If the math says the campaign takes longer than 6 weeks with current infrastructure, I add sender accounts. If it completes in under 2 weeks, I might reduce senders to save cost. The math determines the infrastructure. Not the other way around.",
        related: ['sender-accounts', 'per-inbox-limits', 'three-campaigns'],
      },
      {
        id: 'three-campaigns',
        name: '3 Campaigns as the Standard',
        definition:
          'The standard campaign structure: run 3 parallel or sequential campaigns targeting different segments, personas, or angles. Not one massive blast. Three campaigns with distinct messaging, targeting, and performance tracking.',
        whyItMatters:
          "One campaign is a bet. Three campaigns are a test. If campaign A uses pain-point messaging, campaign B uses social proof, and campaign C uses the \"poke the bear\" approach, you learn which angle resonates with this ICP. One campaign that fails teaches you nothing about why it failed. Three campaigns that perform differently teach you everything about what works.",
        howYouUseIt:
          "For every partner, I build 3 campaigns. They might target different persona tiers (campaign 1 = VPs, campaign 2 = Directors, campaign 3 = Managers). Or different verticals (campaign 1 = SaaS, campaign 2 = FinTech, campaign 3 = Healthcare). Or different messaging angles. Each campaign has its own contact list, email copy, merge fields, and performance tracking. I compare across campaigns to find the winning formula, then scale what works and kill what doesn't.",
        related: ['minimum-contacts', 'starting-contacts', 'cat-framework'],
      },
    ],
  },
  {
    id: 'cat-framework',
    name: 'The Cat Framework',
    prompt: '$ ls ~/gtm-os/cat-framework/',
    terms: [
      {
        id: 'three-campaign-structure',
        name: 'The 3-Campaign Structure',
        definition:
          'A campaign architecture where you run three distinct campaigns simultaneously, each with a different approach, angle, or persona target. Not A/B testing within one campaign — three separate campaigns with different strategic bets.',
        whyItMatters:
          "A single campaign gives you one data point. You either win or lose. Three campaigns give you comparison data. Campaign 1 might outperform 2 and 3 — now you know the angle that works. Campaign 2 might have higher open rates but lower reply rates — now you know the subject line works but the body needs adjustment. The 3-campaign structure turns outbound from gambling into experimentation.",
        howYouUseIt:
          "I structure the three campaigns with intentionally different approaches. Campaign 1 is usually the \"safe\" bet — proven messaging, primary persona, highest-fit segment. Campaign 2 is the test — new angle, secondary persona, or different vertical. Campaign 3 is the wildcard — \"poke the bear\" messaging, edge-case persona, or a segment I'm not sure about. I run all three for 2-3 weeks, compare metrics, then double down on winners and iterate on losers.",
        related: ['poke-the-bears', 'campaign-layering', 'three-campaigns'],
      },
      {
        id: 'poke-the-bears',
        name: '"Poke the Bears" Strategy',
        definition:
          'A campaign approach designed to provoke a response rather than directly sell. Uses pattern-interrupt messaging, challenges the status quo, or calls out a specific behavior. The goal is engagement (positive or negative), not immediate booking.',
        whyItMatters:
          "Not every contact is ready to buy. But some contacts who aren't ready to buy are ready to engage. A \"poke the bear\" email that challenges their current approach or flags a competitor move gets replies that a standard pitch wouldn't. Some replies are \"tell me more.\" Some are \"you're wrong.\" Both are engagement. Both start conversations. The silent majority? They weren't going to reply to your pitch either.",
        howYouUseIt:
          "Campaign 3 in my standard structure is often the \"poke the bear\" campaign. The email copy is shorter, more direct, and deliberately provocative (but not rude). Instead of \"I'd love to help you with X,\" it's \"your competitors are doing X and you're not — curious if that's intentional.\" The reply rate on these campaigns is often higher than the \"safe\" campaign, though the replies require more skill to handle. It's a calculated bet for contacts who've ignored traditional outreach.",
        related: ['three-campaign-structure', 'campaign-layering', 'poke-the-bear'],
      },
      {
        id: 'campaign-layering',
        name: 'Campaign Layering Approach',
        definition:
          'The strategy of running multiple campaigns in sequence or parallel that build on each other. Campaign 1 warms the market. Campaign 2 targets engaged contacts. Campaign 3 picks up non-responders with a different angle. Each layer compounds the previous.',
        whyItMatters:
          "Campaigns don't exist in isolation. A contact who opened Campaign 1's email but didn't reply is warmer than a cold contact. Campaign 2 can reference that awareness. A contact who replied \"not now\" to Campaign 1 can enter Campaign 3 with \"circling back\" messaging. Layering turns a one-shot campaign into a multi-touch strategy that captures value at every stage.",
        howYouUseIt:
          "I layer campaigns across time. Month 1: Campaign 1 hits the full list with standard messaging. Month 2: Campaign 2 targets contacts who opened but didn't reply (\"noticed you checked out our last note\"). Month 3: Campaign 3 targets the remaining non-responders with a completely different angle (poke the bear, new pain point, or industry-specific trigger). The contact list for each layer comes from the previous layer's performance data. It's a feedback loop. This approach was shared by a friend and I've incorporated it into every partner's workflow since.",
        related: ['three-campaign-structure', 'poke-the-bears', 'three-campaigns'],
      },
    ],
  },
  {
    id: 'anti-patterns',
    name: 'Mindset & Anti-Patterns',
    prompt: '$ ls ~/gtm-os/anti-patterns/',
    terms: [
      {
        id: 'overthinking-credits',
        name: 'Stop Overthinking Credits and Tooling',
        definition:
          'The anti-pattern of spending more time comparing enrichment providers, optimizing credit usage, and evaluating tools than actually building and sending campaigns. Analysis paralysis disguised as due diligence.',
        whyItMatters:
          "I see this constantly. Teams spend 3 weeks evaluating 6 email providers, building comparison spreadsheets, negotiating credits, and debating Apollo vs ZoomInfo vs Prospeo vs LeadMagic. Meanwhile, zero emails have been sent. Zero pipeline has been created. The credit difference between providers is pennies per contact. The cost of not sending for 3 weeks is thousands of dollars in lost pipeline. Pick one. Send. Optimize later.",
        howYouUseIt:
          "I pick one enrichment provider per campaign (usually Prospeo or LeadMagic), validate with MX records, and move on. I don't waterfall 6 providers chasing 3% marginal coverage. I don't spend a week comparing pricing tiers. I spend that time building the campaign — copy, research prompts, qualification logic, infrastructure. The campaigns that win aren't the ones with the cheapest credits. They're the ones that actually launched.",
        related: ['basics-beat-hacks', 'get-infrastructure-up'],
      },
      {
        id: 'basics-beat-hacks',
        name: 'The Basics Beat the Hacks Every Time',
        definition:
          'The principle that fundamental email infrastructure (domains, DNS, warmup, per-inbox limits, rotation) consistently outperforms clever tricks, shortcuts, and "growth hacks." The basics aren\'t sexy. They\'re just what works.',
        whyItMatters:
          "Every week I see someone on LinkedIn promoting a new deliverability hack — custom SMTP headers, invisible tracking pixel tricks, AI-generated unique snowflake emails, inbox rotation algorithms. Most of it is noise. The campaigns that actually deliver consistently are the ones with properly configured DNS, warmed domains, reasonable sending limits, and clean data. No hack compensates for bad infrastructure. But good infrastructure makes average copy deliver.",
        howYouUseIt:
          "Before I optimize copy, test subject lines, or experiment with send times, I verify the basics. Are DNS records configured correctly? Has the domain warmed for at least 2 weeks? Are per-inbox limits set appropriately? Is the bounce rate under 5%? Is the data clean? If any of those answers is no, I fix the basics first. I don't add complexity on top of broken fundamentals. Fix the plumbing before you decorate the house.",
        related: ['overthinking-credits', 'get-infrastructure-up', 'stop-optimizing'],
      },
      {
        id: 'get-infrastructure-up',
        name: 'Get the Infrastructure Up, Get the Domains Warmed, Get the Contacts Loaded, and Send',
        definition:
          'The action-biased mindset of prioritizing launch velocity over perfection. Get infrastructure live, start warmup, load qualified contacts, and send — then optimize based on real data. Don\'t wait for perfect.',
        whyItMatters:
          "The biggest cost in cold email isn't a bad subject line or suboptimal enrichment provider. It's delay. Every week you spend perfecting infrastructure that could be warming is a week of lost pipeline. Every month you spend building \"the perfect list\" is a month your competitors are generating replies. Speed to live beats perfection every time. You can iterate a running campaign. You can't iterate a plan that never launched.",
        howYouUseIt:
          "My partner onboarding timeline is 2 weeks from kickoff to first emails sent. Week 1: provision domains, set up mailboxes, configure DNS, start warmup, build contact list in Clay, write campaign copy. Week 2: finalize enrichment, route contacts, load campaigns in Instantly, begin sending at low volume while warmup continues. By day 14, emails are in inboxes. Not perfect emails. Not optimized emails. Real emails generating real data I can optimize from.",
        related: ['basics-beat-hacks', 'overthinking-credits', 'stop-optimizing'],
      },
      {
        id: 'stop-optimizing',
        name: 'Stop Optimizing What Doesn\'t Matter Yet',
        definition:
          'The anti-pattern of optimizing second-order variables (send time, subject line length, emoji usage, signature format) before first-order variables (infrastructure, data quality, deliverability) are solid. Premature optimization for email.',
        whyItMatters:
          "If your emails aren't landing in the inbox, it doesn't matter what time you send them. If your data is 30% invalid, it doesn't matter how good your subject line is. If your domains aren't warmed, it doesn't matter how personalized your icebreakers are. First-order variables (deliverability, data quality, infrastructure) determine whether your email gets seen. Second-order variables (copy, timing, personalization) determine whether it gets replied to. Fix them in order.",
        howYouUseIt:
          "When a partner asks about send time optimization or subject line testing, I check the fundamentals first. Is deliverability healthy? Is the bounce rate low? Is the data clean? Are domains warmed? If yes to all — great, let's optimize copy and timing. If no to any — we're not optimizing copy yet. We're fixing infrastructure. I've seen teams obsess over A/B testing subject lines while 40% of their emails land in spam. The subject line isn't the problem. The fundamentals are.",
        related: ['basics-beat-hacks', 'get-infrastructure-up', 'overthinking-credits'],
      },
    ],
  },
]

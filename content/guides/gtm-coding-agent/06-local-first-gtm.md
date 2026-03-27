---
title: "Local-First GTM"
subtitle: "Run your pipeline on your own machine. No vendor lock-in. No monthly fees."
part: 2
order: 6
date: "2026-03-27"
---

I have a Mac Mini on a shelf in my office. It cost $599. It runs 24/7. It handles my daily enrichment pipeline, lead scoring, data hygiene, content scheduling, and pipeline reporting. It replaced roughly $400/month in SaaS tools.

The Mini paid for itself in less than two months. Since then, every month it runs is pure savings. And I'm not locked into any vendor's pricing page, data format, or feature roadmap. If I want to change how scoring works, I edit a Python file. If I want to add a new data source, I write a script. If Apollo triples their price tomorrow, I swap in a different enrichment API and my pipeline doesn't skip a beat.

This isn't a minimalist philosophy exercise. It's practical economics. If you're a solo operator, a small team, or a founder doing GTM yourself, the math on local-first is so good that it's almost irresponsible not to at least consider it.

> **GitHub reference:** This chapter expands on the [original chapter 06](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/06-local-first-gtm.md) with real cost comparisons, the Mac Mini setup, and when cloud makes sense.

## What "Local-First" Actually Means

Local-first means your data, scripts, and automations live on your machine first. The cloud is a tool you reach for, not a place you live. You reach out for API calls (enrichment, email sends), for hosting public-facing pages, and for pushing code to GitHub. But the brain of your GTM operation, the data, the logic, the scheduling, all of that sits on hardware you own.

The practical consequences:

**Your prospect list never lives on someone else's server.** No SaaS vendor can get breached and leak your contacts. No acquisition can lock you out of your own data. No pricing change can hold your pipeline hostage.

**You don't lose access when you cancel a subscription.** Your data is files on a disk. Your scripts are code in a git repo. Cancel anything and your operation keeps running.

**Your automations run whether or not a vendor is up.** I've watched Zapier have outages that froze people's entire sales process. My launchd jobs don't know what Zapier is. They just run.

**It's dramatically cheaper.** But we'll get to the specific numbers in a minute.

## The Local-First Stack

Everything you need is already on your Mac. Seriously. Let's walk through each component.

### launchd: Your Task Scheduler

Every Mac has `launchd` running in the background. It's the macOS equivalent of cron, but better in ways that matter for GTM automation.

The key advantage: if your Mac is asleep at the scheduled time, launchd runs the job as soon as the machine wakes up. Cron just skips it. For a GTM pipeline where you want enrichment to run every morning, this is the difference between reliable and "sometimes it works."

Here's a real launchd plist for a daily enrichment job:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.gtm.daily-enrich</string>

    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/you/gtm-os/scripts/daily_enrich.py</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>6</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/Users/you/gtm-os/logs/enrich.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/you/gtm-os/logs/enrich-error.log</string>
</dict>
</plist>
```

Save this to `~/Library/LaunchAgents/com.gtm.daily-enrich.plist`, then:

```bash
# Load it (starts running on schedule)
launchctl load ~/Library/LaunchAgents/com.gtm.daily-enrich.plist

# Verify it's loaded
launchctl list | grep gtm

# Test it right now
launchctl start com.gtm.daily-enrich

# Stop it
launchctl unload ~/Library/LaunchAgents/com.gtm.daily-enrich.plist
```

That's a complete, production-ready automation. No Docker. No cloud. No monthly bill. The script runs at 6am, output goes to a log file, errors go to a separate log. If you want to run five different GTM jobs, you create five plists. They all run independently.

### SQLite: Your Database

SQLite is the most deployed database engine in the world. It runs on every Mac out of the box. And for GTM data, it's not just adequate. It's genuinely excellent.

Why SQLite instead of Postgres or MySQL or a cloud database:

**Zero setup.** It's already on your Mac. No server to install, configure, secure, update, or pay for. Run `sqlite3 mydata.db` and you have a database.

**File-based.** Your entire database is a single file. Back it up by copying it. Move it to another machine by dragging it. Version it with git if you want (though for large databases, just back up the file).

**Fast enough for any GTM use case.** SQLite handles millions of rows comfortably. Your contact list, campaign tracking, lead scores, activity logs, and pipeline data will never outgrow it. I've run GTM operations with 50,000+ contacts in SQLite without any performance issues.

**Your agent speaks it.** This is the killer feature. Claude Code can query SQLite directly. You say "how many leads did we add this week?" and the agent writes and runs the SQL query. No dashboard needed. No data export needed. The data is right there.

A practical GTM database schema:

```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    title TEXT,
    company TEXT,
    domain TEXT,
    linkedin_url TEXT,
    lead_score INTEGER DEFAULT 0,
    source TEXT,
    status TEXT DEFAULT 'new',
    enriched_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'draft',
    started_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER REFERENCES contacts(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW v_hot_leads AS
SELECT c.*, COUNT(a.id) as activity_count
FROM contacts c
LEFT JOIN activity_log a ON c.id = a.contact_id
WHERE c.lead_score >= 80
GROUP BY c.id
ORDER BY c.lead_score DESC;
```

With this schema, your agent can answer questions like: "Show me all contacts from Stripe who haven't been contacted." "What's the reply rate on the VP Engineering campaign?" "How many hot leads did we add this week?" All through natural language, all querying local data.

### Git: Your Version Control and Backup

Your GTM workspace is a git repo. This gives you:

- **History of every change.** Your ICP definition evolved over three months? `git log demand/icp.md` shows every iteration. Your scoring logic changed? The diff shows exactly what shifted and when.
- **Backup via GitHub.** Push to a private repo. Your laptop could catch fire and you'd lose nothing.
- **Collaboration if needed.** If you bring on a team member, they clone the repo and they're running.

Compare this to a SaaS tool where your ICP definition lives in a text field inside a settings page, your scoring rules are buried in a workflow builder, and your campaign history disappears when you cancel your subscription.

### Python: Your Scripting Runtime

Python runs everything. Enrichment scripts, data processing, API calls, report generation, lead scoring. Python 3 comes with macOS (or install via `brew install python`), and the ecosystem of libraries for GTM work is unmatched.

### Local AI: Ollama

This is the piece that changed the economics most recently. [Ollama](https://ollama.com) lets you run open-source language models locally. No API key. No per-token cost. No data leaving your machine.

```bash
brew install ollama
ollama pull qwen2.5:14b
```

Now you have a 14-billion parameter model running on your Mac. It handles lead scoring, data classification, email categorization, content summarization. Tasks that run hundreds of times a day and would cost real money at API prices.

**When to use local models vs. API models:**

| Use Local (Ollama) | Use API (Claude, GPT) |
|---|---|
| High-frequency tasks: scoring, classification, categorization | Quality-critical: customer-facing content, research, strategy |
| Cost-sensitive: runs hundreds of times daily | Occasional: runs a few times a day |
| Privacy-critical: processing sensitive prospect data | Context-heavy: needs large context windows |

The best setup uses both. Local models handle the high-frequency grunt work at zero marginal cost. API models handle the tasks where quality and nuance matter. My Mac Mini runs Qwen 2.5 14B for lead scoring and data classification. It uses Claude API for content creation and strategic analysis. The local model handles 90% of the volume. The API handles 10% of the volume but the work that needs the most intelligence.

## The Full Picture: File-Based GTM

Here's what the directory structure looks like in practice:

```
~/gtm-os/
  CLAUDE.md              # Agent operating instructions
  data/
    gtm.db               # SQLite database
  demand/
    icp.md               # Ideal Customer Profile
    positioning.md       # Messaging and positioning
    competitors.md       # Competitive landscape
  scripts/
    daily_enrich.py      # Daily enrichment
    weekly_report.py     # Monday pipeline report
    score_leads.py       # Lead scoring logic
    content_tracker.py   # Content performance tracking
  logs/
    enrich.log           # Script output logs
    errors.log           # Error logs
  exports/
    hot_leads.csv        # Lists for outbound tools
  .env                   # API keys (never committed)
```

Everything is version controlled. Everything is text files and a database file. Everything is queryable by your agent. There's no admin panel, no dashboard, no login page. Just files, scripts, and a database. And that's the point.

## The Cost Comparison

Let me be specific. Here's what a typical early-stage GTM tech stack costs with SaaS tools vs. local-first:

### SaaS Stack (Monthly)

| Tool | Purpose | Monthly Cost |
|------|---------|-------------|
| HubSpot Starter | CRM | $20-50 |
| Apollo | Enrichment | $49-99 |
| Clay or similar | Data workflow | $149-349 |
| Zapier | Automation | $50-200 |
| Notion or Airtable | Data/docs | $10-25 |
| Analytics dashboard | Reporting | $50-100 |
| **Total** | | **$328-823/mo** |
| **Annual** | | **$3,936-9,876** |

### Local-First Stack

| Component | Purpose | Cost |
|-----------|---------|------|
| Mac Mini (one-time) | Runs everything | $599 once |
| Apollo API credits | Enrichment | $20-50/mo |
| Claude/GPT API | AI tasks | $20-50/mo |
| Email sending API | Outbound | $20-30/mo |
| GitHub private repo | Backup | $0-4/mo |
| **Monthly ongoing** | | **$60-134/mo** |
| **Annual (incl. hardware)** | | **$1,319-2,207** |

The local-first stack costs 50-75% less in year one and 75-85% less every year after that. And you own everything. No lock-in. No data portability issues. No "we're sunsetting this feature" surprises.

Now, to be fair: the SaaS stack is easier to set up initially. HubSpot gives you a CRM in 20 minutes. Building the equivalent local database and scripts takes a few days. But that setup cost is one-time. The savings compound every month.

And there's a hidden cost in the SaaS stack that nobody mentions: context switching. When your data lives in six different tools, you spend real time switching between them, exporting from one to import into another, reconciling conflicting data between systems. With local-first, everything is in one place. Your agent queries one database, reads one set of files, runs scripts in one workspace.

### What About HubSpot?

I'm not saying to ditch your CRM. If you're using HubSpot Free or Starter, keep it. It's good at what it does: managing deals, tracking emails, providing a shared view for teams. The local-first approach works alongside a CRM, not instead of it.

The difference is where the intelligence lives. In a SaaS-heavy stack, your enrichment logic lives in Clay, your scoring lives in HubSpot workflows, your automation lives in Zapier, and your reporting lives in a dashboard tool. In a local-first stack, all of that intelligence lives in your scripts and database. Your CRM is the display layer, the place where you and your team interact with the data. But the brain is local.

You sync to HubSpot when you need to. You pull from HubSpot when you need to. But the processing, scoring, enrichment, and decision-making happen on your machine, where it's fast, free, and under your control.

## The Security Advantage

This matters more than most operators realize, especially if you're handling prospect data.

When your contact list lives in HubSpot, it also lives on HubSpot's servers, their backup systems, their analytics pipeline, and potentially their AI training data. When you use Clay for enrichment, your target accounts pass through their infrastructure. When you use Zapier for automation, your API keys are stored in their vault.

Each vendor is an attack surface. Each integration is a potential leak.

With local-first:

- **Your prospect data stays on your encrypted disk.** FileVault encrypts everything at rest. The only time data leaves your machine is when you make an explicit API call.
- **Your API keys are in one place.** Your local `.env` file or system keychain. Not scattered across eight vendor settings pages.
- **There's no admin panel to hack.** No "forgot password" flow to exploit. No OAuth tokens to steal from a vendor breach.
- **Your database is a file.** It doesn't have a network port. It doesn't accept remote connections. It sits on your disk and is accessible only to processes running on your machine.

This isn't bulletproof security. Someone with physical access to your machine (or remote access via malware) could still reach your data. But the attack surface is radically smaller than a stack of SaaS tools, each with their own authentication, their own infrastructure, and their own breach history.

## The Mac Mini Setup

Here's the actual setup for running a Mac Mini as your always-on GTM server.

**Hardware:** Mac Mini M2 or later. 8GB RAM is plenty for Python scripts, SQLite, and Ollama with smaller models. 16GB if you want to run larger local models.

**One-time setup:**

1. **Disable sleep.** System Settings > Energy > Prevent automatic sleeping when the display is off. Your scripts need the machine awake.

2. **Enable Remote Login.** System Settings > General > Sharing > Remote Login. This lets you SSH in from your laptop, your phone, or anywhere.

3. **Install Tailscale** (optional but recommended). Gives you secure remote access from any network without opening ports or configuring a router. `brew install tailscale`.

4. **Enable FileVault.** System Settings > Privacy & Security > FileVault. Encrypts your entire disk at rest. Non-negotiable if you're storing prospect data.

5. **Clone your GTM workspace.** `git clone your-repo ~/gtm-os`.

6. **Set up your Python environment.** Create a venv, install your dependencies.

7. **Create your launchd plists.** One per scheduled job. Load them all.

8. **Install Ollama.** `brew install ollama && ollama pull qwen2.5:14b`.

After this setup, the Mini runs silently. You SSH in to check logs, update scripts, or pull reports. Your launchd jobs handle the daily and weekly automation. Git pushes to GitHub handle backup. The machine draws about 5-10 watts of power. Your electricity cost for running it 24/7 is roughly $1-2/month.

## When Cloud Makes Sense

I'm not a zealot about this. Some things genuinely need the cloud.

**Receiving inbound webhooks.** Your Mac Mini has a private IP address. It can't receive HTTP requests from the internet without a tunnel (like ngrok or Cloudflare Tunnel). If you need to process form submissions, payment events, or CRM webhooks in real time, you need either a cloud function or a tunnel.

**Hosting public-facing pages.** Landing pages, your website, documentation sites. Use Vercel or Cloudflare Pages. They're built for this and they're cheap or free.

**Sending email at scale.** Deliverability is a real discipline. Use a proper email service (Amazon SES, Postmark, or a tool like Instantly) for outbound. Don't try to run your own mail server. That's a rabbit hole that's swallowed better operators than us.

**Team collaboration at scale.** If you're a team of 10+ people who need shared access to pipeline data, a cloud CRM makes sense. Local-first is optimized for solo operators and small teams.

**Multi-region reliability.** If your automation absolutely cannot go down (the Mini loses power, your internet drops), running critical jobs on a cloud function as a backup makes sense.

The key insight is that the thinking and storage happen locally. The cloud is for sending, receiving, and hosting. Your Mac is the brain. The cloud is the megaphone.

## What Runs Where

Here's the complete picture of what stays local vs. what reaches for the internet:

**Runs locally (no internet needed):**
- Database queries and reporting
- Lead scoring and segmentation
- Data cleaning and deduplication
- Content drafting (with Ollama)
- CSV processing and file manipulation
- Git version control

**Runs locally but calls APIs:**
- Enrichment (Apollo, Clearbit) -- data comes back to your machine
- Email sends (Instantly, SES) -- outbound only
- CRM sync (push/pull from HubSpot)
- Web research (Exa, Firecrawl)
- AI inference via API (Claude, GPT) -- prompts go out, responses come back

**Genuinely cloud-hosted:**
- Public-facing websites and landing pages
- Inbound webhook receivers
- Email delivery infrastructure
- Code backup (GitHub)

When you look at it this way, the cloud isn't where you live. It's where you visit when you need to interact with the outside world. Everything else is local, fast, private, and free.

## Getting Started

If this resonates with you, here's what to do this week:

**Day 1:** Create your GTM database. Copy the schema from this chapter and run `sqlite3 ~/gtm-os/data/gtm.db < schema.sql`. Insert a few test contacts. Run some queries. Get comfortable with SQLite.

**Day 2:** Write one automation script. Pick the most tedious recurring task in your GTM workflow. Write a Python script that does it. Run it manually. Verify the output.

**Day 3:** Schedule it with launchd. Create a plist. Load it. Let it run overnight. Check the logs in the morning.

**Day 4:** Check FileVault. If it's off, turn it on. Check that your `.env` file is in `.gitignore`. Check that your GitHub repo is private.

**Day 5:** Install Ollama. Pull a model. Test a simple task, lead scoring or email classification. See how it feels to run AI locally at zero cost.

That's a week of work. After that week, you have the foundation of a local-first GTM stack. Everything else is iteration: more scripts, more scheduled jobs, more data flowing through your pipeline. The foundation doesn't change.

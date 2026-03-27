---
title: "OAuth, CLI, and APIs"
subtitle: "Three ways to connect tools to your agent. Pick the right one for each job."
part: 2
order: 4
date: "2026-03-27"
---

The first time I tried to connect Apollo to Claude Code, I spent two hours debugging an OAuth flow that didn't need to exist.

I was following a tutorial that walked through setting up OAuth credentials, configuring redirect URIs, handling token refresh logic. The whole enterprise authentication dance. About ninety minutes in, I stopped and read Apollo's actual docs. Turns out they have a simple API key. You drop it in a header, you get data back. Five lines of Python. Done in ten minutes.

That experience taught me something I now consider a core principle of GTM engineering: the fastest path to a working integration is almost never the fanciest one. Every tool your agent needs to talk to connects in one of three ways. Learn which pattern fits which situation, and you'll save yourself days of unnecessary complexity.

> **GitHub reference:** This chapter expands on the [original chapter 04](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/04-oauth-cli-apis.md) with more real-world GTM examples and integration stories.

## The Three Patterns

Every integration you will ever build falls into one of these:

1. **OAuth** (via MCP servers) for SaaS platforms with rich, two-way data access
2. **CLI tools** for cloud services and developer infrastructure
3. **API calls** (via Python scripts) for everything else

That's it. Three patterns. Once you recognize which one applies, the actual connection work takes minutes, not hours.

Let's walk through each one with real GTM examples.

## Pattern 1: OAuth via MCP Servers

MCP stands for Model Context Protocol. Think of it as USB for AI agents. Instead of writing custom integration code for every SaaS tool, MCP provides a standard interface. An MCP server handles the OAuth dance, exposes actions your agent can take, and returns structured data the agent understands.

Here's how it works in practice. You want your agent to search HubSpot contacts. Without MCP, you'd write a Python script that authenticates with HubSpot's OAuth2 flow, manages token refresh, constructs API calls, and parses responses. With MCP, you configure the HubSpot MCP server once, authorize through a browser popup, and then just talk to your agent in plain language: "Find all contacts with the title VP of Engineering who were created this month."

The agent handles the rest. It knows what actions the MCP server exposes. It constructs the right queries. It returns structured results you can work with.

**Where MCP shines in GTM:**

- **CRM access.** HubSpot and Salesforce both have MCP servers. Your agent can search contacts, create deals, update properties, pull pipeline reports. All through conversation.
- **Productivity tools.** Google Drive, Slack, Notion, Linear. Your agent can search documents, post messages, create tasks.
- **Data sources.** PostgreSQL, BigQuery. Your agent can query databases directly.

**The ecosystem is growing fast.** Check [modelcontextprotocol.io](https://modelcontextprotocol.io) for the current list. New servers ship weekly. As of early 2026, you'll find MCP servers for most major CRMs, productivity tools, developer platforms, and data sources.

**When OAuth/MCP is overkill:**

Here's the thing most tutorials won't tell you. For many GTM use cases, MCP is more setup than you need. If all you want is to pull a list of contacts matching certain criteria, a simple API call with an API key gets you there faster. MCP makes sense when you need rich, ongoing, bidirectional access to a platform. It doesn't make sense when you need to hit one endpoint once.

I've seen people spend an afternoon configuring a Salesforce MCP server just to pull a report they could have exported as a CSV. Match the tool to the job.

## Pattern 2: CLI Tools

CLI tools are programs you install on your machine and run from the terminal. Your coding agent runs in a terminal. So it can use any CLI tool you can.

This is one of those things that sounds obvious but has huge implications. When you say "deploy the landing page," Claude Code runs `vercel --prod`. When you say "upload this CSV to S3," it runs `aws s3 cp`. When you say "create a GitHub issue for this bug," it runs `gh issue create`. No API wrappers needed. No authentication code. The CLI handles all of that.

**The CLI tools that matter for GTM:**

| Tool | What It Does | One-Time Setup |
|------|-------------|----------------|
| `gh` | GitHub: repos, issues, PRs, releases | `brew install gh && gh auth login` |
| `gcloud` | Google Cloud: BigQuery, Cloud Functions, Sheets API | `brew install google-cloud-sdk && gcloud auth login` |
| `aws` | AWS: S3 storage, Lambda functions, SES email | `brew install awscli && aws configure` |
| `vercel` | Deploy websites and landing pages | `npm i -g vercel && vercel login` |
| `wrangler` | Cloudflare Workers, Pages, R2 storage | `npm i -g wrangler && wrangler login` |
| `sqlite3` | Local database queries | Already on your Mac |

Notice the pattern: install once, authenticate once, use forever. These tools store credentials in your system keychain, not in plaintext files. That's more secure than any `.env` file.

**Real GTM example: BigQuery for pipeline analytics.**

Say you track website visits and form submissions in BigQuery (common if you use Google Analytics or a custom event pipeline). Your agent can query that data directly:

```bash
gcloud bigquery query --use_legacy_sql=false \
  'SELECT landing_page, COUNT(*) as visits,
   COUNTIF(converted = true) as conversions
   FROM `analytics.events`
   WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
   GROUP BY landing_page
   ORDER BY conversions DESC
   LIMIT 10'
```

You don't write that query. You tell your agent "show me which landing pages converted best this week" and it writes and runs the query for you. The CLI is just the bridge.

**Real GTM example: GitHub for content operations.**

If you manage your blog or content in a GitHub repo (like many technical companies do), the `gh` CLI turns your agent into a content operations assistant:

```bash
# List all draft blog posts (stored as issues with a "draft" label)
gh issue list --repo your-org/content --label "draft" --state open

# Create a new content brief
gh issue create --repo your-org/content --title "Blog: Why SDRs Should Learn Python" \
  --label "draft" --body "Target keyword: SDR automation..."
```

Your agent manages the editorial calendar, creates briefs, tracks what's in review, and can even draft the posts themselves. All through a CLI tool that was already on your machine.

## Pattern 3: API Calls from Python Scripts

This is the workhorse. When there's no MCP server and no CLI tool, you write a Python script that calls the API directly. And for GTM-specific tools, this is the pattern you'll use most.

Here's why: the enrichment, research, and outbound tools that power modern GTM are API-first companies. Apollo, Clearbit, Exa, Firecrawl, Instantly, Smartlead. They all work the same way. You send an HTTP request with your API key. You get data back. That's the whole thing.

The standard pattern looks like this:

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()

response = requests.get(
    "https://api.apollo.io/api/v1/organizations/enrich",
    params={
        "api_key": os.getenv("APOLLO_API_KEY"),
        "domain": "stripe.com"
    }
)

data = response.json()["organization"]
print(f"{data['name']}: {data['estimated_num_employees']} employees")
```

That's a real, working Apollo enrichment call. Swap the URL, params, and response parsing and you can connect to any REST API in your stack.

**Why API keys are the GTM operator's best friend.**

I want to make a case that might sound counterintuitive: for most GTM work, simple API keys beat OAuth every time.

OAuth exists for a reason. When a third-party app needs to act on behalf of a user (like when you "Sign in with Google"), OAuth is the right protocol. But when you're calling an enrichment API from a script that runs on your own machine? You don't need delegated authentication. You need a key that says "this is me, give me data."

API keys are:

- **Instant to set up.** Sign up, go to settings, copy the key. Done.
- **Easy to manage.** One `.env` file, one variable per service.
- **Simple to debug.** If a call fails, you check the key and the endpoint. Two things to verify, not twenty.
- **Perfect for scripts.** Your Python script loads the key from `.env`, includes it in the request header, and makes the call. No token refresh logic. No redirect URIs. No callback URLs.

The GTM tools you'll use daily almost all use API keys: Apollo, Exa, Firecrawl, Instantly, Smartlead, Hunter, Clearbit. This isn't a coincidence. These companies built their APIs for operators who want to script against them, not for enterprise SSO flows.

**Real example: connecting Apollo the right way.**

When I finally connected Apollo properly (after my two-hour OAuth detour), the whole integration was this:

1. Signed up for Apollo. Went to Settings > API. Copied my key.
2. Added `APOLLO_API_KEY=xyz` to my `.env` file.
3. Asked Claude Code to write me an enrichment script.
4. Ran it. Got data back. Moved on with my day.

Total time: about fifteen minutes, and most of that was reading Apollo's API docs to understand what fields come back.

## The Decision Framework

When you need to connect a new tool to your agent workflow, work through this:

**Step 1: Does an MCP server exist?** Check [modelcontextprotocol.io](https://modelcontextprotocol.io) or search "tool-name MCP server." If one exists and you need ongoing, bidirectional access to the platform, use it. If you just need to make a few API calls, skip to Step 3.

**Step 2: Does a CLI tool exist?** Google "tool-name CLI" or check if the tool has a `brew install` option. If a CLI exists and you use the tool frequently, install it. The one-time setup pays off every time your agent uses it.

**Step 3: Does the tool have a REST API?** Almost everything does. Write a Python wrapper. This takes 15-30 minutes for a basic integration and works for any tool with documented endpoints.

**Step 4: None of the above?** Check if the tool has a Zapier integration or supports webhooks. You can trigger those from scripts. If the tool truly has no programmatic access, it might not belong in an automated GTM stack.

In practice, here's how this maps to a typical GTM stack:

| Tool | Best Connection | Why |
|------|----------------|-----|
| HubSpot | MCP server | Rich bidirectional CRM access |
| Salesforce | MCP server | Same reasoning |
| GitHub | CLI (`gh`) | Fast, already authenticated |
| Google Cloud / BigQuery | CLI (`gcloud`) | Complex queries, good CLI support |
| AWS (S3, SES) | CLI (`aws`) | File operations, email sending |
| Apollo | API (Python) | Simple key-based enrichment |
| Clearbit | API (Python) | Same pattern as Apollo |
| Exa | API (Python) | Search and research queries |
| Firecrawl | API (Python) | Web scraping and content extraction |
| Instantly / Smartlead | API (Python) | Outbound email management |
| Vercel | CLI (`vercel`) | Deployment in one command |
| Your SQLite database | CLI (`sqlite3`) | Already on your Mac |

## Building a Real Integration: Enrichment Pipeline

Let me walk through a complete, practical integration. This is the kind of thing you'd build in your first week of using a coding agent for GTM.

**The goal:** Take a CSV of prospect domains, enrich each one with company data from Apollo, and output a scored list ready for outbound.

**Step 1: Set up your environment.**

Create a `.env` file (this file goes in `.gitignore`, never gets committed):

```
APOLLO_API_KEY=your_key_here
```

**Step 2: The enrichment script.**

```python
import requests
import csv
import os
import time
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("APOLLO_API_KEY")

def enrich_domain(domain):
    """Get company data from Apollo."""
    resp = requests.get(
        "https://api.apollo.io/api/v1/organizations/enrich",
        params={"api_key": API_KEY, "domain": domain},
        timeout=10
    )
    if resp.status_code == 200:
        org = resp.json().get("organization", {})
        return {
            "domain": domain,
            "name": org.get("name", ""),
            "employees": org.get("estimated_num_employees", ""),
            "industry": org.get("industry", ""),
            "revenue": org.get("annual_revenue_printed", ""),
        }
    return {"domain": domain, "name": "NOT_FOUND", "employees": "",
            "industry": "", "revenue": ""}

def enrich_list(input_csv, output_csv):
    """Enrich a full CSV of domains."""
    with open(input_csv) as infile:
        domains = [row["domain"] for row in csv.DictReader(infile)]

    results = []
    for i, domain in enumerate(domains):
        print(f"  [{i+1}/{len(domains)}] {domain}")
        results.append(enrich_domain(domain))
        time.sleep(0.5)  # respect rate limits

    with open(output_csv, "w", newline="") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)

    print(f"Done. {len(results)} companies enriched -> {output_csv}")

if __name__ == "__main__":
    enrich_list("prospects.csv", "prospects_enriched.csv")
```

**Step 3: Run it.** Tell your agent: "Enrich the domains in prospects.csv using the enrichment script." Or just run `python3 enrich.py` yourself. Either way, you get a clean CSV with company data attached to every domain.

The beauty is that you wrote this once. Next week, when you have a new list, you run the same script. Or better, you schedule it with cron to run every morning against new contacts from your CRM. The pattern compounds.

## Security: Three Rules, No Exceptions

I'm going to be brief here because the rules are simple and there's no room for interpretation.

**Rule 1: API keys go in `.env` files, never in code.**

```python
# Wrong. The key is visible to anyone who reads the code.
headers = {"Authorization": "Bearer sk-abc123xyz"}

# Right. The key is loaded from environment.
headers = {"Authorization": f"Bearer {os.getenv('API_KEY')}"}
```

**Rule 2: `.env` is in `.gitignore`.** Verify this before your first commit on any project. If you push an API key to GitHub, assume it's compromised. Rotate it immediately.

**Rule 3: Use the system keychain when possible.** CLI tools like `gh`, `gcloud`, and `aws` store credentials in your system keychain, not in plaintext. This is strictly better than `.env` files. When a tool supports keychain auth, use it.

```bash
# These store credentials in your system keychain
gh auth login
gcloud auth login
aws configure
```

## The Integration Mindset

Here's the thing that separates operators who get value from coding agents in their first week from those who spend a month "setting things up." The best integrations are the simplest ones.

You don't need a perfectly abstracted API client library. You don't need comprehensive error handling on day one. You don't need to support every endpoint a tool offers. You need a script that calls one endpoint, gets data, and does something useful with it. You can refine later.

When I was an SDR, I would have given anything for a script that enriched my target account list overnight. Not a perfect enrichment pipeline with retry logic and deduplication and CRM sync. Just a script that took my domains and gave me back employee counts and industries. That script is twenty lines of Python and an API key. That's where you start.

The fancy stuff, the MCP servers, the complex orchestration, the event-driven workflows, all of that comes later, when you've outgrown the simple version. And you'll know when you've outgrown it because you'll feel the friction. Don't add complexity in anticipation of problems you don't have yet.

Start with an API key and a Python script. That's enough to change how you work.

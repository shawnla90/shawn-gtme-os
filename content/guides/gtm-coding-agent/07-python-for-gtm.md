---
title: "Python for GTM"
subtitle: "The language that connects every API in your stack."
part: 2
order: 7
date: "2026-03-27"
---

I was an SDR when I wrote my first Python script. "Wrote" is generous. I described what I wanted to Claude Code and it generated a script that pulled company data from Apollo, filtered to my ICP, and spit out a prioritized list. The whole thing was maybe 40 lines. I ran it, and in 90 seconds I had a scored list that would have taken me two hours to build manually in a spreadsheet.

I didn't understand every line of that script. I still don't understand every line of every script my agent writes for me. But I understood what it did. I could read it and see the logic: pull data, filter, score, output. And when something went wrong (the API key was expired, a CSV column was named differently than expected), I could describe the error to the agent and it would fix it.

That's the relationship you're building with Python. Not mastery. Literacy. You're not becoming a software engineer. You're becoming someone who can read, run, and direct code. That's a different thing, and it's a much shorter journey.

> **GitHub reference:** This chapter expands on the [original chapter 07](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/07-python-for-gtm.md) with more real script examples and the practical case for Python over alternatives.

## Why Python and Not Something Else

This is worth addressing directly because you'll encounter people who suggest JavaScript, no-code tools, or other languages. They're not wrong in the abstract. They're wrong for this specific use case.

**Why not JavaScript/TypeScript?** JavaScript is a great language. If you're building web apps, it's the obvious choice. But for GTM scripting, Python wins on library ecosystem. The enrichment, data processing, and AI libraries you need are Python-first. Apollo's SDK, pandas for data manipulation, the OpenAI client library, Anthropic's client library. Yes, most of these exist in JavaScript too. But the Python versions are better documented, more widely used, and have more Stack Overflow answers when something goes wrong. And when your coding agent writes Python, it draws on a massive training corpus of Python data scripts. The code it generates is more reliable.

**Why not no-code (Zapier, Make, Clay)?** No-code tools are perfect for non-technical operators who need automation today and can't wait to learn scripting. If that's you, use them. No judgment. But there's a ceiling. When you need to process a CSV with custom scoring logic, when you need to call an API that isn't in the tool's integration library, when you need to do something the drag-and-drop builder doesn't support, you hit a wall. Python has no ceiling. Every API is reachable. Every data transformation is possible. Every edge case is handleable. And it's free.

**Why not Go, Rust, Ruby?** They're fine languages. But they have smaller ecosystems for GTM-specific tasks, fewer tutorials, and your coding agent generates less reliable code in them (smaller training corpus for this specific domain). Python is the lingua franca of "connect stuff to other stuff via APIs." That's what GTM scripting is.

The real answer is simpler than all of this: Python is the language your coding agent writes best for data tasks. That matters more than any technical comparison. You're not writing the code. The agent is. Pick the language the agent is best at.

## How Coding Agents Make You a Python Programmer

Let me describe the actual workflow, because it's different from what you might imagine.

You don't open a blank file, stare at it, and start typing `import requests`. That's what programming looks like in movies. Here's what it actually looks like when a GTM operator uses Python with a coding agent:

**Step 1: You describe what you want.** "I have a CSV called prospects.csv with columns domain, name, and email. I want to enrich each domain with Apollo to get employee count and industry. Filter to companies with 50-500 employees. Score them based on my ICP. Output a ranked CSV."

**Step 2: The agent writes the script.** It generates 40-80 lines of Python. It knows the Apollo API format. It knows how to read and write CSVs. It knows how to structure a scoring function. The code is clean, commented, and ready to run.

**Step 3: You read through it.** Not to debug it. To understand it. Does it load your API key from `.env`? Does the scoring match your ICP criteria? Does it handle the case where Apollo returns no data for a domain? You're doing a logic review, not a code review.

**Step 4: You run it.** `python3 enrich_and_score.py`. Watch the output scroll by. Check the resulting CSV.

**Step 5: Something breaks.** Maybe Apollo rate-limits you. Maybe one domain causes a crash. You tell the agent what happened. It fixes the script. You run it again.

That loop, describe, generate, review, run, iterate, is the entire skill. After a few weeks of this, you start recognizing patterns. You know what `for row in reader:` means. You know that `time.sleep(0.5)` is a rate limit delay. You know that `response.json()` parses the API response. You're not memorizing syntax. You're absorbing patterns through repeated exposure.

Six months in, you'll find yourself glancing at a script and knowing immediately whether it will work. Not because you studied Python. Because you've seen the same patterns hundreds of times.

## Environment Setup

Three things to get right before you write any code.

### Python 3.10+

Check what you have:

```bash
python3 --version
```

If it's 3.10 or higher, you're good. If not:

```bash
brew install python@3.12
```

### Virtual Environments

A virtual environment is a sandboxed folder where your project's packages live. It keeps one project's dependencies from conflicting with another's.

```bash
# Create a venv in your project folder
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Your prompt now shows (.venv) -- you're in the sandbox
```

Always activate your venv before installing packages or running scripts. If you forget, packages install globally and things break in confusing ways later. This is the single most common setup mistake I see GTM operators make.

### pip for Packages

pip is Python's package manager. With your venv active:

```bash
pip install requests pandas python-dotenv
```

Save your dependencies:

```bash
pip freeze > requirements.txt
```

Restore them on another machine (or after recreating your venv):

```bash
pip install -r requirements.txt
```

## The Five Libraries Every GTM Operator Needs

You could install dozens of packages. You need five. These cover 80% of GTM scripting.

### 1. requests -- Talk to any API

This is the workhorse. Every API call you make goes through `requests`. It handles HTTP methods, headers, authentication, timeouts, and response parsing.

```python
import requests

response = requests.get(
    "https://api.apollo.io/api/v1/organizations/enrich",
    params={"api_key": "your_key", "domain": "stripe.com"},
    timeout=10
)
data = response.json()
```

Three lines to call any API on the internet. That's it.

### 2. pandas -- Manipulate any dataset

pandas turns CSVs into queryable, filterable, sortable data structures. If you work with spreadsheets (and every GTM operator works with spreadsheets), pandas is the library that makes spreadsheet operations scriptable.

```python
import pandas as pd

df = pd.read_csv("companies.csv")
# Filter to mid-market SaaS
filtered = df[(df["employees"] >= 50) & (df["employees"] <= 500)]
# Sort by score
ranked = filtered.sort_values("score", ascending=False)
# Save
ranked.to_csv("target_accounts.csv", index=False)
```

What takes 5 minutes of clicking in Excel takes 4 lines in pandas. And unlike Excel, you can run it again tomorrow on a new dataset without any manual steps.

### 3. python-dotenv -- Keep secrets out of code

Loads API keys from a `.env` file so they never appear in your scripts.

```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("APOLLO_API_KEY")
```

Small library, critical job. Without it, you'll be tempted to paste API keys directly into scripts. Don't.

### 4. csv -- Read and write CSVs (built-in)

Python's built-in CSV module. No install needed. It's simpler than pandas for straightforward "read rows, process, write rows" tasks.

```python
import csv

with open("leads.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']} at {row['company']}")
```

Use `csv` when you're processing rows one at a time (like enrichment, where each row triggers an API call). Use `pandas` when you need to filter, sort, group, or analyze the whole dataset at once.

### 5. json -- Parse API responses (built-in)

Also built-in. Most APIs return JSON. Python handles it natively, and the `requests` library parses it automatically with `.json()`. But you'll sometimes need to read or write JSON files directly.

```python
import json

# Read a JSON file
with open("config.json") as f:
    config = json.load(f)

# Write a JSON file
with open("results.json", "w") as f:
    json.dump(results, f, indent=2)
```

That's the core five. `requests`, `pandas`, `python-dotenv`, `csv`, `json`. Everything else is situational.

## Pattern 1: API Enrichment

This is the script you'll write first and use most. It takes a list of domains (or emails, or company names), calls an enrichment API for each one, and outputs the enriched data.

```python
import requests
import csv
import os
import time
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("APOLLO_API_KEY")

def enrich_domain(domain):
    """Call Apollo to get company data for a single domain."""
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
    return {"domain": domain, "name": "NOT_FOUND",
            "employees": "", "industry": "", "revenue": ""}

# Read input, enrich, write output
with open("domains.csv") as f:
    domains = [row["domain"] for row in csv.DictReader(f)]

results = []
for i, domain in enumerate(domains):
    print(f"  [{i+1}/{len(domains)}] {domain}")
    results.append(enrich_domain(domain))
    time.sleep(0.5)  # respect rate limits

with open("enriched.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

print(f"Done. {len(results)} companies enriched.")
```

The `time.sleep(0.5)` matters. APIs have rate limits. Hit them too fast and you get blocked or throttled. Half a second between calls is a safe default for most GTM APIs. Apollo, Clearbit, and similar tools typically allow 50-100 requests per minute. At 0.5 seconds per call, you're well within that.

This script processes 200 domains in about two minutes. That's a list that would take an hour to enrich manually using the Apollo web UI.

## Pattern 2: CSV Pipeline (Filter, Score, Rank)

You have raw data. You need to turn it into a prioritized list. This is the most common data transformation in GTM.

```python
import pandas as pd

# Load the data
df = pd.read_csv("enriched_companies.csv")

# Filter: 50-500 employees, SaaS/software industry
filtered = df[
    (df["employees"] >= 50) &
    (df["employees"] <= 500) &
    (df["industry"].str.contains("software|saas|technology", case=False, na=False))
]

# Score against ICP
def icp_score(row):
    score = 0
    # Sweet spot employee range
    if 100 <= row["employees"] <= 300:
        score += 40
    elif 50 <= row["employees"] < 100:
        score += 20
    # Funded but not enterprise
    if row.get("funding_stage") in ["Series A", "Series B"]:
        score += 30
    # Uses a tool you integrate with
    tech = str(row.get("tech_stack", "")).lower()
    if "hubspot" in tech or "salesforce" in tech:
        score += 30
    return score

filtered = filtered.copy()
filtered["icp_score"] = filtered.apply(icp_score, axis=1)

# Rank and output
output = filtered.sort_values("icp_score", ascending=False)
output.to_csv("scored_targets.csv", index=False)

print(f"Filtered {len(df)} -> {len(output)} companies")
print(f"Top score: {output['icp_score'].max()}")
print(f"Companies with score >= 70: {len(output[output['icp_score'] >= 70])}")
```

This is the kind of script that replaces a $300/month data tool. It runs in seconds. You control every filter and scoring criterion. When your ICP changes (and it will), you change three lines instead of reconfiguring a visual workflow builder.

Notice the scoring function. It's just an `if` statement with weights. That's all lead scoring is. You're not building a machine learning model. You're encoding your judgment: "companies with 100-300 employees are better fits, funded companies are better fits, companies using tools we integrate with are better fits." Assign points, add them up, sort by total. Simple and transparent.

## Pattern 3: Email Personalization at Scale

You have qualified prospects. You need personalized first lines. This is where Python + an LLM API creates real leverage.

```python
import csv
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_first_line(name, company, role, signal):
    """Generate a personalized cold email opener."""
    prompt = f"""Write a cold email first line for:
- Name: {name}
- Company: {company}
- Role: {role}
- Recent signal: {signal}

Rules:
- One sentence only
- Reference the signal naturally
- No flattery, no "I saw that you..."
- Sound like a peer, not a vendor"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=60,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

# Process the prospect list
with open("prospects.csv") as f:
    prospects = list(csv.DictReader(f))

for p in prospects:
    p["first_line"] = generate_first_line(
        p["name"], p["company"], p["role"], p.get("signal", "")
    )
    print(f"  {p['name']}: {p['first_line']}")

with open("prospects_with_openers.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=prospects[0].keys())
    writer.writeheader()
    writer.writerows(prospects)

print(f"Generated {len(prospects)} personalized first lines.")
```

50 personalized first lines in under a minute, for about $0.02 in API costs. Fifty. Lines. Two cents. Compare that to the time it takes a human to research 50 prospects and write custom openers. An hour? Two? At any reasonable hourly rate, the math is absurd.

And the quality is better than you'd expect. Not because AI writes better than a thoughtful human. But because it writes better than a human who's on their 40th first line of the day and running out of creative energy. Consistency matters in outbound. A reliably good opener beats an occasionally great one.

## Pattern 4: Database Operations

Once you have a SQLite database (covered in Chapter 06), Python becomes your interface to it.

```python
import sqlite3

db = sqlite3.connect("data/gtm.db")
db.row_factory = sqlite3.Row  # access columns by name

# Insert enriched contacts
def insert_contact(contact):
    db.execute("""
        INSERT OR IGNORE INTO contacts (email, first_name, last_name,
            title, company, domain, lead_score, source, enriched_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        contact["email"], contact.get("first_name", ""),
        contact.get("last_name", ""), contact.get("title", ""),
        contact.get("company", ""), contact.get("domain", ""),
        contact.get("score", 0), "apollo_enrichment"
    ))
    db.commit()

# Query hot leads
def get_hot_leads(min_score=80):
    cursor = db.execute(
        "SELECT * FROM contacts WHERE lead_score >= ? ORDER BY lead_score DESC",
        (min_score,)
    )
    return [dict(row) for row in cursor.fetchall()]

# Weekly stats
def pipeline_stats():
    stats = {}
    stats["total_contacts"] = db.execute(
        "SELECT COUNT(*) FROM contacts").fetchone()[0]
    stats["hot_leads"] = db.execute(
        "SELECT COUNT(*) FROM contacts WHERE lead_score >= 80").fetchone()[0]
    stats["added_this_week"] = db.execute(
        "SELECT COUNT(*) FROM contacts WHERE created_at >= date('now', '-7 days')"
    ).fetchone()[0]
    return stats
```

This is the code that connects your enrichment scripts to your database, your database to your reports, and your reports to your Slack notifications. It's the plumbing of a local-first GTM stack.

## Error Handling: The Difference Between a Script and a Tool

Scripts crash. APIs go down. CSVs have weird encoding. A column you expected is spelled differently. A domain returns a 500 error. Row 847 has a Unicode character that breaks your parser.

The difference between a script you run once and a tool you rely on daily is error handling. Here's the pattern:

```python
import time
import logging

logging.basicConfig(
    filename="enrichment.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

def safe_enrich(domain, max_retries=3):
    """Enrich with retry logic and error handling."""
    for attempt in range(max_retries):
        try:
            result = enrich_domain(domain)
            logging.info(f"OK: {domain}")
            return result
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:  # rate limited
                wait = 2 ** attempt  # 1s, 2s, 4s
                logging.warning(f"Rate limited on {domain}, waiting {wait}s")
                time.sleep(wait)
            else:
                logging.error(f"HTTP {e.response.status_code} on {domain}")
                return None
        except requests.exceptions.Timeout:
            logging.warning(f"Timeout on {domain}, attempt {attempt + 1}")
            time.sleep(1)
        except Exception as e:
            logging.error(f"Unexpected error on {domain}: {e}")
            return None
    logging.error(f"Failed after {max_retries} attempts: {domain}")
    return None
```

The key patterns:

**try/except** wraps anything that can fail. API calls, file operations, data parsing. If it touches the outside world, wrap it.

**Retry with backoff** handles rate limits. Wait 1 second, then 2, then 4. Most rate limits clear in a few seconds. If you're still blocked after three retries, something else is wrong.

**Logging** writes to a file so you can debug after a long run. When your enrichment script processes 500 domains at 6am, you need to know which ones failed and why. Logging gives you that.

**Return None instead of crashing.** The rest of your list still processes. You can re-run the failures later. This is the difference between losing 2 minutes (the one failed domain) and losing 30 minutes (the remaining 300 domains that never ran because the script crashed on domain 200).

## The Workflow in Practice

Here's what a real day looks like when you're using Python with a coding agent for GTM.

**Morning:** You check your enrichment logs. 47 new contacts enriched overnight. 3 failures (API timeout). You tell the agent: "Re-run enrichment for the three failed domains." It runs the script against just those three. Done.

**Mid-morning:** You get a new target account list from a partner. 300 companies in a CSV. You tell the agent: "Enrich these with Apollo, filter to 50-500 employees in SaaS, score against our ICP, and give me the top 50." The agent writes a script combining Patterns 1 and 2. You review it, run it, and have your prioritized list in 5 minutes.

**Afternoon:** You want to personalize outbound for the top 25. You tell the agent: "Generate first lines for the top 25 using their recent funding rounds as signals." Pattern 3. Two minutes and $0.01 later, you have your openers.

**End of day:** You tell the agent: "How did our outbound perform this week?" The agent queries your SQLite database and gives you a summary. No dashboard. No SaaS login. Just a natural language question and a direct answer.

That's a day where Python did the mechanical work and you did the strategic work. You never opened Apollo's web UI. You never exported a CSV from one tool to import into another. You never manually scored a single lead. The scripts handled all of that. You decided which accounts to pursue, what messaging to use, and how to spend your selling time.

## Getting Comfortable

You don't need to memorize syntax. You need to recognize patterns.

After a few weeks of working with your agent, you'll start seeing the same structures over and over:

- `for item in collection:` means "do this for each thing in the list"
- `if condition:` means "only do this when something is true"
- `response = requests.get(url, params=...)` means "call an API"
- `df = pd.read_csv(file)` means "load a spreadsheet"
- `with open(file) as f:` means "open a file safely"
- `time.sleep(n)` means "wait n seconds"
- `try: ... except: ...` means "try this, and if it fails, do that instead"

Seven patterns. That's enough to read any GTM script your agent will write. You don't need to be able to write them from memory. You need to be able to look at them and know what's happening.

The rest is just practice. Every time your agent writes a script, read through it before running it. Not to find bugs. To absorb the patterns. After a month, Python will feel less like a foreign language and more like a dialect of English you're getting fluent in. Not through study. Through immersion.

That's the real pitch for Python in GTM. Not that it's the best programming language. Not that you need to become a developer. But that it's the shortest path from "I have a list of 500 companies" to "I have a scored, enriched, personalized pipeline ready for outreach." And with a coding agent writing the code, that path is shorter than you think.

---
title: "Automation Agents"
subtitle: "Build agents that run your GTM workflows while you sleep."
part: 2
order: 5
date: "2026-03-27"
---

I woke up on a Tuesday to find 47 enriched contacts in my database, a Slack message telling me three new companies matched my ICP overnight, and a CSV of scored leads sitting in my exports folder. I hadn't touched my computer since 10pm the night before.

That was the morning I stopped thinking of automation as a nice-to-have and started thinking of it as the foundation of everything else. Not because the technology was impressive. A cron job and a Python script is not impressive technology. But because of what it meant for my time. Every manual task I'd automated was a task I'd never have to remember to do again. And remembering to do things is the real tax on GTM operators. Not the doing itself.

This chapter is about building that layer. Not the theoretical kind of automation that vendors pitch in webinars. The practical kind that runs on your machine, costs nothing, and does real work while you sleep.

> **GitHub reference:** This chapter expands on the [original chapter 05](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/05-automation-agents.md) with more concrete workflow examples and operational philosophy.

## Scripts vs. Agents: A Useful Distinction

Before we get into the how, let's clarify a distinction that matters.

A **script** does what you told it to do. It runs top to bottom, executes a sequence of steps, and finishes. If step 3 fails, it either crashes or skips that step, depending on how you wrote it. A script is a recipe. Follow the instructions, get the output.

An **agent** makes decisions. It observes a situation, decides what to do, takes action, and evaluates the result. An agent might decide to retry a failed step, skip a record that looks malformed, escalate something unusual to you, or take a different path based on what it finds.

Most of what you'll build in GTM automation starts as scripts and gradually evolves toward agents. And that's fine. A script that enriches 200 contacts at 6am every morning is infinitely more valuable than an agent you never finished building because you were trying to handle every edge case from the start.

The progression looks like this:

1. Manual: you do it by hand every time
2. Script: code does it, but you trigger it
3. Scheduled script: code does it on a timer
4. Script with error handling: code does it, tells you when something breaks
5. Agent: code does it, makes decisions, handles exceptions, reports back

Most GTM operators need to get to level 3 or 4. Level 5 is there when you need it, but it's not where you start.

## The Automation Spectrum

Here's the honest picture of what automation looks like at each level:

```
Manual          Scheduled         Event-Driven       Always-On
You do it       Script runs       Webhook fires       Agent watches
every time      on a timer        and triggers         continuously
                                  a workflow

Cost:  $0       Cost: $0          Cost: $0-25/mo      Cost: $25-200/mo
Setup: None     Setup: 10 min     Setup: 1-2 hours    Setup: Half day
```

Vendors want to sell you the right side of this spectrum. Always-on platforms, real-time triggers, sophisticated orchestration. And some GTM teams genuinely need that. But the vast majority of GTM automation is "run this script at this time." Every day at 6am. Every Monday at 8am. Every hour. That's it.

I've built GTM systems for startups and for my own operation, and I'll tell you what I've learned: 80% of GTM automation is just scheduled scripts. The other 20% is webhook-triggered flows for things like form submissions and payment events. The always-on agent? I've needed that exactly once, and it was for monitoring a Slack channel.

Start at the left side. Move right only when you feel the friction.

## Level 1: cron and launchd

Your Mac has a built-in task scheduler called `launchd`. Linux machines have `cron`. Both do the same thing: run a script at a time you specify. No servers. No platforms. No monthly bill.

If your Mac is on, your scripts run.

Here are real GTM workflows that run perfectly on a schedule:

**Daily enrichment pipeline.** Every morning at 6am, a script pulls new contacts that entered your CRM yesterday. It enriches each one with Apollo (company data, employee count, industry). It calculates an ICP score. It writes everything back to your local database. By the time you open your laptop at 8am, your pipeline is enriched and scored.

**Weekly pipeline report.** Every Monday at 7:30am, a script queries your SQLite database. How many new leads last week? What's the reply rate on active campaigns? Which companies opened your emails but didn't reply? It generates a markdown summary and sends it to you via Slack webhook or email. You start Monday with full context on your pipeline without logging into a single dashboard.

**Content syndication.** You write a blog post. A scheduled script checks for new posts in your content repo every evening. When it finds one, it reformats it for LinkedIn, creates a tweet thread, and drafts an email newsletter version. All sitting in a drafts folder for you to review the next morning.

**Lead scoring refresh.** Every night at midnight, a script recalculates lead scores based on the latest data. New enrichment data, recent email engagement, website activity. It updates scores in your database and flags any contacts that crossed your threshold for outreach.

**Data hygiene.** Once a week, a script deduplicates contacts, flags records with missing data, identifies stale leads that haven't had activity in 60 days, and generates a cleanup report. This is the kind of housekeeping that most teams skip because it's tedious. A script doesn't find it tedious.

Setting up a scheduled job with cron takes one line:

```bash
# Run enrichment every day at 6:00 AM
0 6 * * * cd /Users/you/gtm-os && python3 scripts/daily_enrich.py >> logs/enrich.log 2>&1
```

On macOS, `launchd` is the native scheduler and Apple recommends it over cron. The key advantage: if your Mac is asleep at the scheduled time, launchd runs the job as soon as the machine wakes up. Cron just skips it. Chapter 06 covers launchd setup in detail.

**cron schedule cheat sheet:**

```
0 6 * * *      Every day at 6:00 AM
0 */4 * * *    Every 4 hours
0 8 * * 1      Every Monday at 8:00 AM
0 9 1 * *      First of every month at 9:00 AM
*/15 * * * *   Every 15 minutes
```

## Level 2: n8n for Visual Workflows

When cron breaks down, it's usually for one of two reasons: you need to respond to an event in real time (a form submission, a payment), or your workflow has branching logic that's getting ugly in a single script.

That's when you reach for n8n. It's a self-hosted workflow automation platform. Think Zapier, but you own it. It runs on your machine or a $5/month VPS, and you build workflows with a visual interface.

**Real GTM workflow: inbound lead routing.**

A prospect fills out a form on your website. The form sends a webhook to n8n. n8n runs a workflow:

1. Enrich the contact via Apollo API
2. Score them against your ICP
3. Branch based on score:
   - Score above 80: add to HubSpot as "hot lead," send Slack alert to you, add to priority outbound sequence
   - Score 50-80: add to nurture email sequence, log in database
   - Score below 50: log and skip

This workflow has real-time trigger needs (you want to act on form submissions within minutes, not wait for the next cron run) and branching logic that's easier to see visually than to trace through a Python script. That's n8n's sweet spot.

**Cost:** Free if self-hosted on your Mac. $5/month on a VPS. Compare that to Zapier at $50-200/month for the same workflow.

```bash
# Run n8n locally with Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
# Open http://localhost:5678
```

## Level 3: Trigger.dev for Code-First Automation

Trigger.dev sits between "write everything from scratch" and "use a visual platform." You define workflows in TypeScript, version control them with git, test them locally, and deploy to their cloud. Built-in retry logic, scheduling, and observability.

This is what you reach for when you want the reliability of a platform but the control of code. Your workflows live in your repo, not locked inside a vendor's UI.

```typescript
import { task, schedules } from "@trigger.dev/sdk/v3";

export const dailyEnrichment = schedules.task({
  id: "daily-enrichment",
  cron: "0 6 * * *",
  run: async () => {
    const newContacts = await fetchNewContacts();
    const enriched = await Promise.all(
      newContacts.map(contact => enrichContact(contact.email))
    );
    await updateCRM(enriched);
    return { processed: enriched.length };
  },
});
```

**Cost:** Free tier handles most GTM use cases. Paid starts at $25/month for higher volume.

**When it makes sense:** You're a technical operator running complex TypeScript workflows who wants version-controlled automation with built-in retry and monitoring. If you're comfortable with Python scripts and cron, you may never need this. But if you're building in a TypeScript ecosystem anyway, it's excellent.

## When Automation Goes Wrong

Let me tell you about the time my enrichment script enriched the same 200 contacts every single day for three weeks.

The script worked perfectly. It pulled contacts from the database, enriched them, wrote the results back. The problem was the query. It was pulling all contacts where `enriched_at IS NULL`. But the enrichment function wasn't updating the `enriched_at` field. So every morning, the same 200 contacts showed up as "unenriched." Every morning, I burned 200 API credits re-enriching people I'd already enriched.

I didn't notice because the script ran at 6am and I didn't check the logs. It was "automated" and I assumed it was working.

This is the most common failure mode with automation: silent success that's actually silent waste. The script doesn't crash. It doesn't send an error. It just does the wrong thing, efficiently, on repeat.

Here's what I do now for every automated workflow. I call it "set it and check it."

**Set it:** Get the automation running. Test it once manually. Verify the output.

**Check it:** For the first week, review the output every day. Is it doing what you expect? Are the numbers reasonable? After the first week, check weekly. After a month, check when something feels off.

**Build in guardrails:**

```python
# At the end of every automated script
try:
    results = run_enrichment()
    if len(results) > 500:
        send_slack_alert(f"Unusual volume: {len(results)} records. Check manually.")
    if len(results) == 0:
        send_slack_alert("Enrichment ran but found 0 new records. Possible query issue.")
    logging.info(f"Enrichment complete: {len(results)} records processed")
except Exception as e:
    send_slack_alert(f"Enrichment FAILED: {e}")
    raise
```

Three guardrails: alert on unusual volume (something might be wrong with the query), alert on zero results (is the filter too tight? is the data source dry?), and alert on failure (something actually broke). These take two minutes to add and save you from three weeks of silent waste.

## Five GTM Workflows You Should Automate This Week

I'm going to be specific here. Not "automate your enrichment" but exactly what to automate and how.

**1. Morning pipeline briefing.**

A script that runs at 7am and sends you a Slack message or email with:
- New leads added yesterday (count + top 3 by score)
- Emails sent vs opened vs replied yesterday
- Any leads that crossed your outreach threshold overnight
- Meetings booked this week

This replaces logging into HubSpot, checking your sequencer, and building a mental model of where things stand. You wake up to a summary.

**2. New contact enrichment.**

Run at 6am. Pull contacts added to your CRM or database in the last 24 hours. Enrich each with company data (Apollo or similar). Calculate ICP score. Write results back. Flag anyone scoring above your threshold.

**3. Stale lead cleanup.**

Run weekly. Find contacts with no activity in the last 60 days. Move them to a "dormant" status. Generate a list of anyone worth a re-engagement attempt. This prevents your pipeline from becoming a graveyard of old leads you keep scrolling past.

**4. Content performance tracker.**

Run daily. Check engagement on your latest LinkedIn posts, blog traffic, email open rates. Log the numbers in your database. Over time, you build a dataset of what content performs and what doesn't. A script does this in 30 seconds. Manually checking three platforms takes 15 minutes and you forget to do it on Fridays.

**5. Weekly competitor check.**

Run on Mondays. Use Exa or a web search API to check if your competitors published new content, made announcements, or got press coverage. Summarize findings and send to Slack. This is intelligence gathering that most teams skip because it's time-consuming. A script makes it free.

## The Cost Math

Here's the comparison, stripped of marketing spin:

| Solution | Monthly Cost | Setup Time | Best For |
|----------|-------------|------------|----------|
| cron / launchd | $0 | 10 minutes | Scheduled scripts, batch jobs |
| n8n (self-hosted) | $0-5/mo | 1-2 hours | Webhook flows, visual branching |
| Trigger.dev | $0-25/mo | 2-3 hours | Code-first, TypeScript workflows |
| Zapier | $50-200/mo | 30 minutes | Non-technical users, quick prototypes |
| Make (Integromat) | $15-65/mo | 30 minutes | Visual workflows, cheaper than Zapier |

The pattern: the more you can code, the less you pay. A GTM operator running Python scripts on cron replaces $200/month in Zapier automations with $0. Over a year, that's $2,400. Over three years, that's enough for a Mac Mini that runs your entire GTM operation.

But cost isn't the whole story. The bigger win is control. When your automation lives in a script you own, you can change it in seconds. When it lives in Zapier, you're working within their interface, their limitations, their pricing tiers. Your agent can modify a Python script. It can't modify a Zapier zap.

## The Graduation Path

Start simple. Graduate when something breaks or when you feel specific friction.

**Stage 1: cron + Python scripts.** You write scripts. They run on a schedule. Output goes to log files. You check logs when something seems off. This handles daily enrichment, weekly reports, scheduled sends, data cleanup. This is where most solo operators should live for their first 3-6 months.

**Stage 2: Add error notifications.** Same setup, but now your scripts send you a Slack message when they fail. Still cron, but now you know immediately when something breaks instead of discovering it three days later when you notice your pipeline data is stale.

**Stage 3: Move webhook-triggered flows to n8n or Trigger.dev.** When you have a flow that must respond to an event in real time, that specific flow moves to a platform. The rest stays in cron. You don't migrate everything. You migrate the one or two workflows that need real-time triggers.

**Stage 4: Always-on agent.** An agent that monitors something continuously. A Slack channel for inbound questions. An email inbox for replies. A CRM for status changes. Most GTM operators never need this. When you do, you'll know, because you'll be checking something manually every 30 minutes and wishing it were automated.

## The Philosophy: Automate the Boring, Keep the Human

One more thing before we move on. Not everything should be automated.

Automate enrichment, scoring, data hygiene, reporting, scheduling, formatting, deduplication. These are mechanical tasks that don't benefit from your judgment.

Don't automate the reply to a hot lead. Don't automate the decision to pursue or drop an account. Don't automate the creative part of content. Your judgment, your taste, your ability to read a situation. That's what makes you valuable. The automation exists to clear away everything that isn't that.

The best GTM operators I know spend 80% less time on operational tasks than their peers. They don't spend that saved time doing more operational tasks. They spend it thinking, writing, and having conversations with prospects. The automation handles the machine work. The human does the human work.

That's the goal. Not automation for its own sake. Automation so you can do the work that only you can do.

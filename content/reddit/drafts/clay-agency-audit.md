# Reddit: Before You Hire a Clay Agency - Free Audit Checklist

> **Platform**: Reddit
> **Pillar**: gtm-engineering, clay
> **Date**: 2026-03-10
> **Status**: draft
> **Subreddit**: r/gtmengineer
> **Format**: educational resource

---

**TL;DR**: I've been building in Clay daily for over a year - 60+ Clay Wiki entries, open-source GTM OS. I keep getting asked "should I hire a Clay agency?" so I put together the 5-question audit I run before answering. Sharing it here. Also offering free 30-min audits if anyone wants a second pair of eyes on their setup.

---

## The 5 questions to ask before signing an agency contract

I don't run an agency. I take 2-3 customers at a time doing GTM infrastructure and enablement. But I'm deep in Clay every day, and people ask me about agencies constantly.

After walking through enough setups, the same problems keep showing up. Here's the checklist I use.

### 1. How many workspaces are you running?

Workspaces multiply fast. One for the SDR team, one the agency set up, one from a pilot that nobody shut down. Each has its own credit pool and its own version of the data.

If you can't list your workspaces and explain what each one does, start there. Consolidation alone can save thousands per year.

### 2. Are credits being used efficiently?

Every enrichment, every Claygent call, every API lookup burns credits. The most common waste pattern: teams re-enrich leads they already have data on because nobody built conditional logic or a shared data layer.

Check if your tables skip enrichments when data already exists. That alone can cut credit spend by 20-40%.

### 3. Does your plan tier match your usage?

Clay's pricing has changed multiple times. Pull up billing. Compare monthly credit burn vs. allocation. If you're using 40% of what you pay for, you're overpaying. If you're buying overages every month, you might need a different tier or better table architecture.

### 4. Who owns the tables?

If an agency builds your tables, what happens when the engagement ends? Can your team maintain and modify them? Or are they black boxes?

Before signing, ask:
- Who owns the workspace?
- Does the contract include documentation and training?
- Can you export and rebuild if you switch providers?
- Are there custom integrations only the agency can maintain?

I've seen companies paying $5k/month for table maintenance they could handle internally with a week of training.

### 5. Is anyone tracking table efficiency?

Hit rates, error rates, cost-per-row. Data providers change, endpoints deprecate, and prompts that worked 6 months ago might be returning garbage now.

If nobody is monitoring this, you're flying blind regardless of whether you have an agency.

---

## Resources

I've been documenting everything I learn and sharing it publicly:

- **[Clay Wiki](https://thegtmos.ai/clay-wiki)** - 60+ entries on enrichments, formulas, Claygent patterns, HTTP API setups, workflow architectures. Updated weekly.
- **[GTM OS](https://github.com/shawnla90/shawn-gtme-os)** - Open-source GTM operating system. The infra I actually use.
- **[Full blog post](https://shawnos.ai/blog/before-you-hire-a-clay-agency)** - Longer version of this with more detail on each point.

---

## Free audit offer

I'm offering free 30-minute audits. No pitch, no follow-up sequence. Screen share, walk through your setup, written recommendations.

DM me here or on [LinkedIn](https://linkedin.com/in/shawntenam) if you want one.

Happy to answer questions in the comments too.

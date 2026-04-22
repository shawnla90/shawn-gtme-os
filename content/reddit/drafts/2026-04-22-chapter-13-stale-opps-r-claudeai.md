---
platform: reddit
draft_for: 2026-04-22
target_subreddit: r/hubspot (primary — builds on the existing CLI-vs-MCP thread momentum)
alt_subreddits:
  - r/ClaudeAI (retool opening paragraph around the slash-command pattern)
  - r/RevOps (lead with the version-control frame, drop the tool details)
status: draft-v2
---

**Title options (r/hubspot):**
1. Follow-up to my CLI-vs-MCP post: shipped the slash command + starter script
2. /stale-opportunities — a slash command for HubSpot deals that went quiet past 60 days
3. Version-controlled HubSpot workflows: a pattern that came out of the CLI-vs-MCP thread

**Pick:** #1

**Body:**

A couple weeks back I posted about running HubSpot from Claude Code CLI instead of MCP and a handful of people asked for the actual scripts. Shipping the first one today. Figured this thread would be the right place to close the loop.

The core idea that came out of that discussion: HubSpot workflows, Clay automations, Google Sheets, Miro boards — none of these have version control. u/dsecareanu2020 made the point well in the comments: one of the daily audit questions a RevOps person actually needs to answer is "list every workflow, what it does, when it was last updated, whether it has enrollments in the last 7 days." The HubSpot UI doesn't give you that view. A script does, and you can diff its output week over week.

So the pattern I've been running is: the slash command is a markdown file in `.claude/commands/`. When I type `/stale-opportunities`, Claude Code reads the file, runs a Python script, and summarizes the output. The script and the command file are both in git.

What this particular command does:

- Queries HubSpot for deals older than 60 days in the stages I care about (`qualifiedtobuy`, `presentationscheduled`)
- For each deal's primary contact, hits Apollo's `/people/match` to check current employment (did the champion leave?)
- For each account, searches Apollo for new hires in the last 30 days matching my ICP titles
- Optionally hits Exa for recent news signals (funding, layoffs, acquisitions, product launches)
- Scores the deal `actionable` / `dead` / `needs_review` and writes a one-paragraph narrative back to a custom property on the deal

The custom property schema is four fields on the Deal object: `agent_last_enriched_at`, `agent_stale_check_status`, `agent_signals_summary`, `agent_disqualify_reason`. An AE opens the deal, reads three sentences, decides.

Things I got wrong on the way:

- Tried doing the enrichment in-session via MCP. Rate limits kill you past fifty deals. Moved it into a Python script the agent calls.
- Tried having the agent draft the outbound emails too. Output felt off. Rewriting took longer than writing from scratch. Kept the agent out of the copy step.
- Tried running against all stages. Too noisy. The 60+ day window on qualified/proposal is the sweet spot.

Also — u/AIDreamer11 had a line in the previous thread that I haven't stopped thinking about: "Claude Code will sort the true RevOper's from the button pushers." That's the whole motion. The RevOps people who wire this in become different than the ones who don't.

The starter (script, .env.example, slash-command file, README with the custom property schema) is part of a larger free repo I'm maintaining. Link in comments if mods are OK with it.

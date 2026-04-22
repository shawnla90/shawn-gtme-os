---
platform: linkedin
draft_for: 2026-04-22
topic: gtm-coding-agents chapter 13 — no version control in GTM stack
status: draft-v2
---

Your GTM stack has no git log.

Clay workflows, HubSpot automations, Google Sheets, Miro boards — none of them have version control. No diff, no commit history, no "check out the state as of last Tuesday." The automation running your MQL pipeline is a black box even to the RevOps person who owns it.

That is not a Clay problem or a HubSpot problem. It's the shape of every tool in your GTM stack. Durable but not diffable. Holds the state but not the change history.

A coding agent wired to your CRM gives you the version control those systems should have had all along. The Python script is in git. The slash-command file is in git. The HubSpot custom-property schema gets defined in code and committed.

A HubSpot practitioner replying on my r/hubspot post last week put this sharper than I could:

"Claude Code will sort the true RevOper's from the button pushers."

He was naming a trend he is watching inside the HubSpot community. Another line from the same thread: the people who spend their days clicking around HubSpot and copying properties from Excel are going to have a difficult time unless they adapt.

Chapter 13 of the GTM coding agents repo ships today. `/stale-opportunities` — a slash command that hits HubSpot, finds 60+ day deals, re-checks every primary contact's current employment via Apollo, scans the account for new ICP hires, pulls recent news, and writes a one-paragraph summary back to the deal as a custom property. The AE reads three sentences in the morning and knows who to re-engage.

None of this replaces your RevOps team. It replaces the version of that team that never wrote a line of code.

Repo: github.com/shawnla90/gtm-coding-agent

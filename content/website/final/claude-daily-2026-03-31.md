---
title: "Claude Code Daily: Tuesday, March 31, 2026"
date: "2026-03-31"
excerpt: "the entire Claude Code ecosystem woke up today and chose chaos. Anthropic accidentally shipped a .map file in their npm package that exposed the full TypeScript source of Claude Code. all ~1,884 files"
category: "claude-daily"
featured: false
---

## the pulse

the entire Claude Code ecosystem woke up today and chose chaos. Anthropic accidentally shipped a .map file in their npm package that exposed the full TypeScript source of Claude Code. all ~1,884 files of it. within hours, someone uploaded it to GitHub, someone else rebuilt it from scratch, and r/ClaudeAI hit numbers I haven't seen since Opus 4 dropped.

we're talking 16,842 upvotes across 172 posts. 3,953 comments. the top post alone pulled 3,903 upvotes with 477 comments. for context, that's roughly double the biggest day we've tracked on this show. the leak didn't just dominate the conversation. it WAS the conversation. every subreddit, every angle, every hot take you can imagine.

and buried under the leak hysteria? Anthropic finally admitted Claude Code quotas are running out too fast (the usage limit saga hits day 9, for those keeping score), someone found a compromised axios package that half the vibe coders probably already installed, and Boris Cherny dropped 15 tips for using the tool he created. you know, normal Tuesday stuff.

## hottest thread

**"i dug through claude code's leaked source and anthropic's codebase is absolutely unhinged"** posted to r/ClaudeAI. 3,903 upvotes. 477 comments. velocity of 245.12, the fastest rising post we've ever tracked.

the post walked through the leaked source and surfaced some genuinely wild findings. the headline discovery: there's an entire pet system called /buddy built into Claude Code. a tamagotchi that lives in your terminal. 18 species. it evolves based on how you use the tool. someone in r/ClaudeAI even reported seeing a mushroom guy pop up in their terminal after the brief window where the new version was live.

35 build-time feature flags compiled out of public builds. a system called Kairos that nobody had documented before. Computer Use confirmed working in the source. the community went through it like archaeologists at a dig site, and the discourse split into two clean camps: people who thought the code quality was embarrassingly bad, and people who thought it was completely normal production code.

the thread also confirmed something this show has been tracking. Anthropic's internal CLAUDE.md uses a `USER_TYPE=ant` flag with different system prompting than what paying customers get. one post framed it as A/B testing paying users with a dumbed-down prompt. whether that's sinister or standard depends on your trust level, but the receipts are in the source now.

Anthropic rolled back to version 2.1.87 within hours, then quietly pushed 2.1.89 without the source maps. the fastest patch cycle in Claude Code history, driven entirely by embarrassment.

## repo of the day

**cc-cache-fix** by u/Rangizingo ([github.com/Rangizingo/cc-cache-fix](https://github.com/Rangizingo/cc-cache-fix)) - 836 upvotes, 62 comments

this one's practical. using the leaked source, the author (well, Codex did the actual work, and they're upfront about that) identified what they claim is the root cause of the insane token drain that's been burning through everyone's quotas. the fix targets prompt cache behavior, and the author reported their 5-hour usage dropping to 6%, which they say is normal.

the honesty here is refreshing. direct quote from the post: "Codex found and fixed this, not me. I work in IT and know how to ask the right questions, but it did the work." that's the builder energy we like to see. no pretending you hand-wrote the patch. just pointing the right tool at the right problem.

worth noting: this is an unofficial patch applied to leaked source code. use at your own risk. but if the token drain diagnosis is accurate, it validates what this community has been screaming about for over a week. the usage limits weren't just perception. something was genuinely broken in the caching layer.

honorable mention to [claude-code-ollama-local](https://github.com/beti5/claude-code-ollama-local) for running Claude Code locally with Ollama. someone in the comments reported running it on a 4x MacMini Exo cluster with Qwen3-Coder. not nearly as fast, but the spirit is there.

## best comment award

> Makes me think my work code is too high quality lmao

u/No_Cheek7162 in r/ClaudeAI, 783 upvotes. on the main leak thread.

back-to-back wins. u/No_Cheek7162 took best comment yesterday with 598 upvotes and came back today with 783. we might need to retire their jersey. this comment landed because it captures the exact emotion thousands of developers felt scrolling through Anthropic's source. you spend your career worrying about code quality, writing tests, refactoring for readability... and then you see what's shipping at the company building the AI that judges YOUR code. the comedic timing is chef's kiss. one sentence. no setup needed. the entire thread was the setup.

## troll of the day

> "All our software engineers aren't writing code anymore" -Dario
>
> Yeah that's pretty freaking apparent dude

u/PetyrLightbringer in r/ClaudeAI, 411 upvotes. on the token drain fix post.

this is the kind of roast that writes itself. Dario Amodei has been making the rounds talking about how Anthropic's engineers increasingly use AI to write their code. then their npm package ships with source maps exposed. u/PetyrLightbringer connected those two dots with surgical precision. it's not even trolling. it's just... observation. the funniest part is that this comment was on the post where someone used a competing AI (OpenAI's Codex) to fix the bug in Anthropic's leaked code. layers upon layers.

## fun facts

- the word "leaked" appeared in 23 of today's 172 post titles. that's 13.4% of all posts. we have never seen a single word dominate a day's vocabulary like this.
- u/No_Cheek7162 is now on a 2-day best comment streak with a combined 1,381 upvotes across both wins. dynasty behavior.
- the top 3 posts by score (3,903 + 2,066 + 1,298 = 7,267 upvotes) are all about the same event from three different subreddits. the Claude Code leak was posted to r/ClaudeAI, r/ClaudeCode, AND r/vibecoding. the takes got progressively more unhinged as you moved down the list.
- someone posted "Did Claud leak it accidentally? Because that would be funny" (155 upvotes). yes, they spelled it "Claud." yes, it was accidental. yes, it is funny.
- the usage quota saga officially hit its 9th consecutive day of front-page complaints. Anthropic finally admitted the quotas are running out too fast. the community responded with approximately zero forgiveness.

## code drop

no single code snippet dominated today, but the most actionable technical find from the leak was the discovery of 35 build-time feature flags. from the r/ClaudeCode breakdown:

```
BUDDY . Tamagotchi-style AI pet (18 species, terminal-resident)
KAIROS . Undocumented timing/scheduling system
COMPUTER_USE . Confirmed working in source
USER_TYPE=ant . Internal Anthropic employee flag
```

the practical takeaway for builders: if you're building your own CLI agent harness, Claude Code's architecture is now essentially documented. the multi-agent orchestration patterns, the permission system, the tool execution pipeline. u/Sensitive_Song4219 called it: "Waiting for 100 new coding agent harnesses to get added to GitHub within the next day." they weren't wrong. we already saw someone rebuild the full executable from source within hours.

also worth flagging: **axios@1.14.1 is compromised**. supply chain attack. if you vibe code with Claude and let it run `npm install` without checking lockfiles, today's a good day to start. 275 upvotes on that warning post. check your dependencies.

## builder takeaways

- **check your axios version immediately.** 1.14.1 has a confirmed supply chain compromise. run `npm ls axios` in your projects. if you've been letting AI handle your installs without reviewing lockfiles, this is your wake-up call.
- **the cc-cache-fix repo is worth studying** even if you don't apply it. understanding what was broken in the prompt cache helps you work around token drain in your own usage patterns today.
- **if you run multiple Claude Code terminals**, the /effort flag in one instance reportedly nukes prompt cache across all running instances. only 2 upvotes on that post, but if true, it explains a lot of the "my quota vanished" reports.
- **Boris Cherny's 15 tips thread** (229 upvotes) has features most people didn't know existed. the creator of Claude Code sharing his daily workflow is worth 10 minutes of your time.
- **Claude Code 2.1.89 is live.** the rollback from the leak is done. update with `bun update -g /claude-code` and you're on the clean version.

## the scoreboard

| metric | count |
|---|---|
| posts tracked | 172 |
| total upvotes | 16,842 |
| total comments | 3,953 |
| fastest rising | "i dug through claude code's leaked source..." (velocity: 245.12) |
| most debated | "Claude code source code has been leaked via a map file..." (420 comments, 2,066 upvotes) |
| subreddits scanned | ClaudeAI, ClaudeCode, vibecoding, gtmengineering, GTMbuilders |
| returning characters | u/No_Cheek7162 (2-day streak), u/radiationshield (635 upvotes today, troll yesterday) |
| leak-related posts | 23 of 172 (13.4%) |

biggest single-day upvote total we've tracked. the leak broke the scale. see you tomorrow to find out what the community builds with all that exposed source code.

shawn ⚡ GTM Engineer

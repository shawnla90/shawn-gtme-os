---
title: The clearbox-onboard skill
description: Turn a website domain into a researched Clearbox offer pack. One-liner, templated selling points, keywords, competitors, and tracked subreddits, every claim traced to a URL and paste-ready for the onboarding form.
source: ~/.claude/skills/clearbox-onboard/SKILL.md
updated: 2026-08-06
order: 6
---

# clearbox-onboard — one domain in, a full Clearbox offer pack out

## What this is

The Clearbox onboarding form warns you: "Don't rush this one. Clearbox scores Reddit content against what you write here." Those fields are the scoring substrate. Your keywords and competitors drive what gets matched, and the subreddit suggestions run once, at onboarding, off what you typed. This skill is the not-rushing: it researches the company first, then writes every field in the exact shapes the form accepts.

## The pipeline

1. **Read what the user supplied.** A brief, a codebase, an own-words description. That material sets positioning intent. It never counts as a source.
2. **Research, never assume.** Fetch the homepage, pricing, docs, changelog. Search "[name] alternatives" and "[name] vs" to find the real competitor set. Capture the literal words buyers use for the problem.
3. **One-liner.** 80 characters max, counted, not eyeballed. "X is a [category] for [who]".
4. **Selling points.** 5 to 8, each matching one of the seven template slots.
5. **The fields behind the form.** 10 lowercase keywords in buyer language, competitor brands from research, own brands, 5 verified subreddits plus swap candidates.
6. **Output.** Paste-ready plain-text blocks in form order, a reference JSON mirroring the offer record, and a Sources list with one URL per claim.

## The template slots

- Unlike [competitor], X does [thing]
- A unique feature of X is [feature]
- X replaces [tool]
- Only X does [thing], by [how]
- X does [thing] better than [alternative]
- Where [competitor] does [X], X does [Y]
- X is the only [category] that does [thing]

## Rules

- Every selling point traces to a URL: the company's site or the competitor's. No source, no claim.
- "Unlike [competitor]" statements are claims about the competitor. Check their site first.
- "Only X does this" asserts a category-wide absence you probably can't prove. Downgrade to "a unique feature of X is" when unsure. In the reference run this rule caught a real one: the draft said "only Freckle has a CLI for coding agents", and the competitor check found Clay ships an agent CLI now. The sourced version ("terminal-first vs bolted-on") was sharper anyway.
- Never invent a subreddit or a competitor brand. Verify each exists or cut it.
- A slot you can't fill honestly gets skipped, not faked. 5 true points beat 8 padded ones.

## The portable version

The skill ships with a standalone prompt version: self-contained, no local dependencies, pasteable into any coding agent (Claude Code, Codex, Cursor). Give it a domain and it runs the same research-first pass and returns the answers in form order with sources, so you can check every claim before you paste them into clearbox.to.

Both the skill and the pastable prompt are public in the ClearboxGTM repo (github.com/shawnla90/ClearboxGTM), alongside the rest of the Reddit motion.

---
title: "How Voice-Drift Works"
date: "2026-04-30"
excerpt: "Voice DNA is the static profile. Voice-drift is the per-meeting audit that catches you drifting toward marketing speak before the content ships."
category: "ships"
featured: true
series: "play"
play_number: 5
---

# How Voice-Drift Works

*Voice DNA is the static profile. Voice-drift is the per-meeting audit that catches you drifting toward marketing speak before the content ships.*

![Voice-drift pipeline. Transcript, principles file, examples corpus, drift candidate, human gate.](/blog/voice-invocation-cover.gif)

Newsletter #5. After last week's issue on voice-invocation, the most-asked question came back the same way every time. How does voice-drift actually work?

This week the box opens.

## The recap

Newsletter #4 covered the pipeline. Fireflies records a meeting. A cron picks up the transcript. Subagents fan out in parallel. Six things land in Discord about four minutes after the call ends. A blog draft. A LinkedIn post. An X thread. Todos. Pain points. Signals.

Plus a voice-drift report.

The drift report is the one I named but never opened up. The comments asked. So this is that.

## Voice DNA vs voice-drift

These are two different things. People conflate them.

Voice DNA is the static profile. It lives at `~/voice/principles.md` and a corpus of `~/voice/examples/*.md`. The principles file is a small set of rules. No three-part lists. No "in today's fast-paced world." No "leverage" or "synergy" or "game-changer." How I sound on a good day, written down as guardrails.

The corpus is the reference material. Past transcripts where my voice came through clean. The principles describe the voice. The corpus IS the voice. Both feed every piece of content the system generates.

Voice-drift is the per-conversation audit. Did the new transcript sound like the DNA, or did the speaker drift somewhere in the middle?

Most AI voice tools stop at the profile. They reference your DNA when generating new content and call it done. They never check whether you actually still sound like yourself in the original input. Drift detection is the half nobody builds.

The DNA is the map. Drift is the compass.

## How it actually works

Five steps. All inside one analyzer the cron fires after a transcript lands.

**Step 1. Load the DNA.** The script reads `~/voice/principles.md` and the entire `~/voice/examples/` corpus. Principles are rules. Corpus is reference material. Both load before anything else runs.

**Step 2. Extract phrasings from the new transcript.** The script pulls anything that recurs three or more times. Hook patterns. Topic-specific jargon. Cadence tells, the short clauses and sentence fragments that are mine on purpose. Three occurrences is the floor. One or two could be transcription noise.

**Step 3. Compare.** Two checks against the corpus. New phrasings that recur but don't match anything in the corpus get flagged as drift candidates. Phrasings that DO match get reinforced as signature patterns. Both signals matter. New language is either growth or drift, and you can't tell from the inside of the conversation.

**Step 4. Write the proposal.** Output lands at `~/voice/drafts/YYYY-MM-DD_<slug>_voice-update.md`. Includes the new phrasings, suggested principles diff, rationale per candidate. Each one has a reason. Add to corpus. Drop because it's a verbal tic. Drop because it contradicts an existing rule. The reasons are the value, not the flags.

**Step 5. Human gate.** Never auto-apply to `principles.md`. The drift is a draft. I read it. I merge what's mine. I drop what isn't.

That's the whole thing. Five steps, one analyzer, one markdown output. The cron also posts the drift draft to a Discord channel called `voice-drift`. Drift gets its own channel because it's the only output where the human gate is the entire point. I review drift before I do anything else with the meeting.

## What an output looks like

From a call earlier this week. The drift report flagged this:

> "AI native, meaning people that understand that most of what you can do is in your brain. But if you can actually integrate with an AI model and build a knowledge base, you can do some amazing... you can do the work of 10 people."

The drift report's notes on it:

> Definition of AI-native hiring. More specific than prior calls. Brain + AI model + knowledge base = the formula. Recommendation: add to principles.md as a reference definition for "AI native."

That's the format. Raw transcript quote. Context analysis. Recommendation.

The same call surfaced four candidates. One went into the corpus. One I dropped, it was a phrasing I picked up from the other person mid-conversation, not mine. Two are edge cases I'm sitting on for now.

The point is I never have to write a voice profile from scratch again. Every meeting refines it. The corpus grows. The principles file stays small and rule-based. The corpus does the heavy lifting.

The system catches what I missed in the moment. That's what the audit gives me.

## Why this matters in B2B 2026

Buyers can smell AI-generated content. The filter for "is this a real human" is sharp and getting sharper. Posts that open with "in today's fast-paced world" are dead on arrival. Three-part lists that go "first, second, finally" read as machine output. Em-dashes used as a verbal tic instead of punctuation are a tell. The smell is detectable.

Being real on Reddit, in DMs, on LinkedIn, in cold email, is a moat now. Not a soft skill. A hard differentiator.

But "be real" doesn't scale. One person can have so many real conversations. The leverage is using AI for distribution. Multi-channel fan-out from one real conversation. Without letting AI replace the voice.

Voice-drift is what keeps the voice in. When the same idea pushes to a blog and a LinkedIn newsletter and a feed post and an X thread, the underlying transcript is the source. Drift confirms the source still sounds like me. The fan-out preserves the signal instead of laundering it through generic AI prose.

Clearbox launches next week. Same thesis at a different layer. The signal I want is the one in the conversation, not the one a dashboard pretends it sees. Voice-drift is the personal version. Clearbox is the team version. Both run on the same loop. Surface what is already there. Don't generate more noise.

## The chapter

Chapter 14 just landed in the GTM Coding Agents repo. Includes the SKILL.md, the analyzer prompt, the SQLite schema, the dispatch routing. Nine other chapters cover the broader loop. Voice DNA setup, OAuth and CLI patterns, Python for GTM, signals dashboards, CRM automation.

[github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)

Fork it. Run it on your own transcripts. Build your own corpus. The DNA is yours.

That's the play.

shawn ⚡

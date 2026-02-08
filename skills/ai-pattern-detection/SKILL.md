---
name: ai-pattern-detection
version: "1.0"
description: 29 structural and formatting tells that trained readers spot as AI-generated content. Runs as a secondary scan on any content before publishing.
---

# AI Content Pattern Detection - 29 Flags

by Shawn Tenam | Lead Alchemy

> This is a standalone skill. It runs independently or as a secondary check called by the marketing voice skill.
> The critical patterns (1-10) are also embedded in `tier-1-voice-dna/anti-slop.md` for fast catches.
> This file is the full deep scan.

## Purpose

This skill detects and flags patterns in written content that signal AI generation. These aren't style preferences. They're structural and tonal patterns that trained readers spot instantly. Content that triggers these flags loses credibility regardless of how good the underlying ideas are.

Use this on any content before publishing: LinkedIn posts, emails, SOPs, client decks, articles, threads.

## Detection Categories

### Category 1: Structural Tells

**1. Narrator Setup Lines**
"Here's the thing about...", "here's where it gets interesting...", "and this is where the real X lives."
Why: You're guiding the reader to the point instead of making the point. Delete the setup line. Start with the actual point.

**2. Dramatic Rhetorical Framing**
"The part that actually matters?", "But here's the part where...", "And that's when it clicked.", "Want to know the crazy part?"
Why: AI narrates stories instead of telling them. State what happened. Let the reader feel it without being told to feel it.

**3. Three Parallel Dramatic Sentences**
"You can't see it. You can't copy-paste it away. You have to know it exists."
Why: Real people don't build to a crescendo in threes. One direct statement lands harder.

**4. The Bookend Summary**
Opening with a thesis, closing with the exact same thesis rephrased 800 words later.
Why: AI wraps content in neat bows. Real thinking goes somewhere new by the end.

**5. Perfect Section Symmetry**
Every section roughly the same length. Every bullet the same structure. Three points, each with three sub-points.
Why: Human thinking is uneven. Some points need more space. Uniformity screams template.

**6. The Ascending List**
Points arranged from least to most important, building to a climax. Numbered "levels" that progress in suspiciously clean steps.
Why: Real expertise doesn't organize itself into clean hierarchies. Lead with the most interesting point.

### Category 2: Tonal Tells

**7. Authority Signaling Phrases**
"The uncomfortable truth is...", "Let me be clear...", "Here's what nobody tells you...", "The hard truth is...", "Here's the reality...", "What most people miss is..."
Why: These claim authority instead of demonstrating it. A person with real authority just says the thing.

**8. False Dichotomies**
"It's not about X, it's about Y.", "Stop doing X. Start doing Y."
Why: AI loves clean binary contrasts. Real situations are messy. Most things are "both, depending on context."

**9. Self-Branded Concepts**
"This is what I call the...", "I have a framework called..."
Why: Naming your own concept before proving it's useful is a performance move. Explain the concept. Let others name it.

**10. Artificial Drama Sentences**
"The shift sounds simple. It's not.", "Easy to say. Hard to execute."
Why: Pacing tricks to create gravity around ideas that might not need it. Show why it's hard with a specific example.

**11. The Empathy Opener**
"We've all been there.", "You know that feeling when...", "Sound familiar?"
Why: Simulates relatability without being grounded in specific shared experience.

**12. Wisdom Packaging**
"The lesson? [restated point].", "The takeaway here is simple:", "What this really means is..."
Why: AI packages insights like fortune cookies. Trust your reader to extract the meaning.

### Category 3: Formatting Tells

**13. Em-Dashes Everywhere**
Using em-dashes as the primary punctuation bridge.
Why: AI defaults to em-dashes as a crutch. Most human writers use them sparingly if at all.

**14. Overcomplicated Technical Details**
Hex codes, encoding specifics, implementation minutiae that lose a general audience.
Why: AI includes technical detail indiscriminately. Real experts calibrate depth to audience.

**15. Excessive Bold for Emphasis**
Bolding key phrases in every paragraph.
Why: AI treats bold like a highlighter on every other line. Bold sparingly.

**16. Quotation Marks for Emphasis**
Using quotes around words that aren't actual quotes.
Why: AI uses air-quotes constantly. Drop the quotes.

**17. Colon-Listed Everything**
"The result: better data. The impact: faster sales. The lesson: architecture matters."
Why: Colon-statement pattern is an AI signature. Write natural sentences.

### Category 4: Content Pattern Tells

**18. The Obvious Insight Dressed Up**
Taking something everyone knows and presenting it like a revelation.
Why: AI generates "insights" that are really just common knowledge with dramatic framing. Show the specific experience that made it real.

**19. The Perfect Pivot**
"But then I realized..." "That's when everything changed."
Why: AI loves clean narrative pivots. Real learning is messy and gradual. Describe the actual process.

**20. Engagement Bait Endings**
"So here's my question for you...", "Curious to hear your thoughts."
Why: Hollow engagement tactics. End with substance or stop when you're done.

**21. The Humble Brag Disclaimer**
"I don't have all the answers, but...", "Not claiming to be an expert, but..."
Why: False humility before confident statements. State your position.

**22. Metaphor Stacking**
Using 2-3 different metaphors for the same concept in one post.
Why: AI generates metaphors easily and doesn't know when to stop. Pick one or zero.

**23. The "Most People" Strawman**
"Most people think X. They're wrong.", "Everyone focuses on X. Nobody talks about Y."
Why: Creates unnamed opposition. Skip the framing, present your perspective with evidence.

**24. Numbered Wisdom Lists**
"3 things I learned from...", "5 rules for..." where each item is a self-contained maxim.
Why: Each item can be generated independently. Real thinking connects ideas.

**25. The Reframe Play**
"X isn't about [obvious thing]. It's about [slightly different framing]."
Why: If your reframe doesn't change how someone would act, cut it.

### Category 5: Sentence-Level Tells

**26. Adverb Overload**
"Truly", "actually", "fundamentally", "essentially", "ultimately", "literally"
Why: Intensifying adverbs add weight to sentences that should stand on their own. Delete the adverb.

**27. The Qualifying Hedge**
"It's worth noting that...", "Interestingly enough...", "What's fascinating is..."
Why: Filler phrases that delay the actual point. Start with what you're actually saying.

**28. Overly Smooth Transitions**
"Speaking of which...", "This brings us to...", "Building on this idea..."
Why: AI generates seamless transitions. Real writing has rougher edges. Let paragraphs follow each other.

**29. Parenthetical Asides for Relatability**
"(yes, really)", "(trust me on this)", "(I learned this the hard way)"
Why: AI uses parentheticals to simulate casual voice. If it's worth saying, say it as a regular sentence.

## Severity Levels

**Critical (rewrite required):** Patterns 1, 2, 7, 13, 18
**High (fix before publishing):** Patterns 3, 8, 10, 11, 17, 20, 23
**Medium (consider fixing):** Patterns 4, 5, 9, 12, 15, 16, 19, 21, 22
**Low (context dependent):** Patterns 6, 14, 24, 25, 26, 27, 28, 29

## The Accumulation Rule

One pattern in isolation might be fine. 3+ flags in a single piece means the content needs a rewrite, not a patch. The issue isn't individual phrases. It's the underlying structure.

## Quick Self-Test

Read your content out loud. If you wouldn't say it that way to a colleague at a whiteboard, it's probably an AI pattern. Real voice has pauses, rough edges, and uneven emphasis.

# Reddit Post: r/ClaudeCode

**Title:** I built a fully automated daily blog for the Claude Code community. here's the architecture.

**Body:**

I've been running Claude Code Daily for 8 days now. it's a daily digest of this subreddit (plus r/ClaudeAI, r/vibecoding, and a couple others). fully automated. zero manual editing. publishes at midnight every night.

some of you have already seen the editions. yesterday's covered the /dream launch (1,675 upvotes) and the usage limit crisis. Monday's covered computer use dropping and Opus telling everyone to go to sleep.

today I'm open sourcing the full pipeline architecture: https://github.com/shawnla90/claude-code-daily

and I wrote a deep dive on how it actually works: https://shawnos.ai/blog/claude-code-daily-how-it-works

## the pipeline

single Python script. 5 phases.

1. **COLLECT** - scans Reddit's public JSON API across 5 subreddits. ~250 posts. top 5 comments per post. velocity scoring.
2. **ANALYZE** - Claude CLI (Sonnet) scores 10 content angles on viral potential, voice fit, gap score.
3. **GENERATE** - multi-platform versions. Reddit via Claude, X via Grok, LinkedIn via Claude.
4. **BLOG** - Opus generates the full daily digest. ~2,500 words. late night show format.
5. **PUBLISH** - git push triggers Vercel deploy. also posts to LinkedIn via Typefully and sends a Slack notification.

total runtime: ~5 minutes. cost per issue: ~$0.15 in API calls.

## the part that makes auto-publishing work

three layers of trust:

**voice DNA.** two markdown files (130 lines of voice rules + 29 anti-slop patterns) get loaded into every prompt. the model doesn't generate generic content because the voice constraints are specific enough to prevent it. lowercase style, builder perspective, specific tools referenced, no corporate speak.

**anti-slop engine.** 16 regex patterns catch AI writing tells before they ship. em-dashes, authority signaling ("the uncomfortable truth"), narrator setups ("here's where it gets interesting"), hype words ("game changer"). every piece of content scores against these. under 80% = regenerate with violations as explicit constraints.

**the scoreboard.** every issue includes exact numbers. posts tracked, upvotes, velocity scores, real usernames. if Opus hallucinated a thread, the numbers would be verifiably wrong. specificity is the trust mechanism.

## the continuity layer

this was the hardest part. each issue generates from scratch with no context of previous issues. without memory, every edition reads like the pilot.

the fix: `story_tracker.json`. after each issue, the pipeline parses the blog with regex (no extra API calls) and extracts the troll of the day, best comment, repo of the day, and active multi-day stories. before the next generation, this gets injected as continuity context.

result: the March 24 edition naturally referenced the usage limit saga as "entering day two" because the tracker knew it started on March 23. no forced recaps. just natural show continuity.

## what I learned building this

- voice DNA files are the actual product. the pipeline is plumbing.
- residential IP matters for Reddit scanning. cloud IPs get blocked.
- anti-slop as a gate (prevent bad content) works better than anti-slop as a filter (fix bad content).
- Opus averages 90%+ anti-slop scores on first generation. the retry path rarely fires.
- the continuity tracker adds show memory for zero extra API cost.

full architecture breakdown: https://github.com/shawnla90/claude-code-daily

deep dive blog post: https://shawnos.ai/blog/claude-code-daily-how-it-works

daily editions: https://shawnos.ai/claude-daily

curious what you'd add or change. especially interested if anyone's running similar automated content pipelines with Claude Code.

# LinkedIn Post

I built a daily blog that publishes itself at midnight. no human editing. 8 consecutive issues.

Claude Code Daily scans 5 subreddits, generates a 2,500-word digest with awards and commentary, validates it against an anti-slop engine, and auto-deploys to my website. every single night.

the part everyone asks about: how do you trust it enough to skip review?

three things.

voice DNA. two markdown files (130 lines of rules) loaded into every prompt. the model doesn't write generically because the voice constraints are specific enough to prevent it.

an anti-slop engine. 16 regex patterns catch AI writing tells before they ship. em-dashes, authority signaling, hype words. anything under 80% gets regenerated.

real numbers in every issue. posts tracked, upvote counts, velocity scores, actual usernames. if the model hallucinated, the data would be verifiably wrong.

8 issues. 90%+ anti-slop scores. ~$0.15 per issue in API costs. 5 minutes runtime.

I open sourced the full pipeline architecture today.

github.com/shawnla90/claude-code-daily

deep dive on how it works: shawnos.ai/blog/claude-code-daily-how-it-works

the pipeline is plumbing. the voice files are the product. the anti-slop engine is the trust layer.

shawn ⚡

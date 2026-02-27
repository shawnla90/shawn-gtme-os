# Growth Engine Buildout — Plain English

**Date:** February 23, 2026
**What this is:** We added 3 automated growth systems to the Nio ecosystem in one session.

---

## The Spark

Saw a viral post from Nevo David (124K views) about growth hacking with AI agents. He broke down 5 strategies. We mapped them against what we already have and found 3 that we could start building immediately.

## What We Built

### 1. TikTok Video Factory

**The idea:** TikTok slideshows are the current growth hack. They get insane views relative to effort, and they work with new accounts. Nevo's data shows one product (Snugly) hit $1K MRR from TikTok alone.

**What we did:** Built a video slideshow system that generates TikTok-ready vertical videos automatically. It uses the same cinematic engine (Remotion) that already makes our LinkedIn and YouTube videos. Dark theme, animated text, particle effects, sound effects. Looks professional, not like AI slop.

**What it needs next:** Someone to hit "render" and upload the first one to TikTok. The content is already written (2 slideshow scripts about Nio and AI assistant setup). Future goal: fully automated rendering + posting.

### 2. SEO Content Targeting

**The idea:** Instead of writing whatever comes to mind for the daily blog post, we should be targeting keywords people actually search for. This is how you rank on Google.

**What we did:** Built a keyword research pipeline that runs every morning at 7:45 AM. It checks what people are searching for (using Google autocomplete), scores the keywords by how relevant they are to our topics, and picks the best one. Then at 8:00 AM, when the daily blog post gets written, it uses that keyword as the topic.

**In plain terms:** Before today, the daily blog wrote about whatever. Now it writes about what Google users are actually searching for. Same authentic Nio voice, but aimed at real search traffic.

**First keyword it picked:** "how to build AI assistant using python" — scored 95 out of 100 for relevance. That's a real search term with real people looking for answers, and we literally have a guide for it.

### 3. Twitter/X Auto-Posting

**The idea:** We have 9 finished Twitter posts sitting in a folder. They've been written, edited, and approved. But they're not posted because posting is manual.

**What we did:** Built a script that reads those posts, understands the thread format (some are 10-tweet threads), and posts them automatically. It tracks what's been posted so it doesn't double-post.

**What it needs next:** Twitter API keys. We need to sign up for developer access at developer.x.com. Once the keys are in, we flip a switch and it posts every weekday at 9 AM ET.

## Why This Matters

Before tonight, the content pipeline looked like this:
- Blog posts: automated (daily)
- Discord announcements: automated (daily + hourly RSS)
- Everything else: manual copy-paste

Now it looks like this:
- Blog posts: automated + SEO-targeted
- Discord: automated
- TikTok: one-click render (automation next)
- Twitter/X: automated once API keys are added
- LinkedIn: still manual (next phase)
- Instagram: nothing yet (future phase)

## What's Next

**Immediate (this week):**
1. Get Twitter API keys and turn on auto-posting
2. Render and upload the first TikTok slideshow
3. Watch if the SEO-targeted blog posts start ranking differently

**Soon (next 2-3 sessions):**
1. Auto-render TikTok videos on a schedule
2. Cross-post the same video to Instagram Reels and YouTube Shorts
3. Add LinkedIn API for auto-posting

**Long term:**
1. Package our AI setup as a sellable skill/template
2. Build a CLI for Nio so other AI agents can interact with it
3. Full cross-platform content distribution from a single source

## The Bottom Line

We saw a playbook that's working for someone else ($18K to $28K MRR in 2 weeks). We mapped it to our stack. We built the infrastructure for 3 of the 5 plays in one session. The SEO play is already running. The other two are one step away from live.

We're not sleeping on the job.

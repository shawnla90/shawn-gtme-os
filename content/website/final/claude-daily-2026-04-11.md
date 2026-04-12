---
title: "Claude Code Daily: Saturday, April 11, 2026"
date: "2026-04-11"
excerpt: "saturday in the Claude ecosystem and the pitchforks are out. not the fun kind where everybody's building something cool. the kind where paying customers are running data analysis on their own API call"
category: "claude-daily"
featured: false
---

## the pulse

saturday in the Claude ecosystem and the pitchforks are out. not the fun kind where everybody's building something cool. the kind where paying customers are running data analysis on their own API calls to prove they're getting scammed. r/ClaudeCode and r/ClaudeAI basically merged into a single support group today, with 163 posts generating nearly 12,000 upvotes and over 4,100 comments. the ratio tells you everything. people are not here to share wins.

the big story is a one-two punch. someone pulled 120,000 API call logs across two machines and found that Anthropic silently cut cache TTL from one hour to five minutes back on March 6th. that's not a conspiracy theory. that's timestamped data. meanwhile, the AMD lobotomization thread continues to snowball past 1,750 upvotes, and a separate post called Anthropic: Stop shipping. Seriously. racked up 1,336 upvotes in r/ClaudeAI and another 450 when it got crossposted to r/ClaudeCode. there's also someone who set up a transparent API proxy and found a hidden `fallback-percentage: 0.5` header, suggesting every plan gets 50% of advertised capacity. the community is doing Anthropic's QA for them at this point.

the one bright spot? someone discovered that switching to the older Opus 4.5 model with `/model claude-opus-4-5-20251101` makes Claude Code dramatically better. 162 upvotes and comments like "it's fast too, ~100t/s." so the escape hatch exists. you just have to know it's there.

## hottest thread

**Anthropic: Stop shipping. Seriously.** (r/ClaudeAI, 1,336 upvotes, 232 comments)

a Claude Max subscriber wrote what amounts to an open letter to Anthropic leadership. the premise: stop adding flashy features and fix the core product. the post hit r/ClaudeAI first and exploded, then someone crossposted it to r/ClaudeCode where it picked up another 450 upvotes and 84 comments. combined, that's nearly 1,800 upvotes and 316 comments across two subreddits, all saying the same thing.

the top comment in r/ClaudeCode nailed the sentiment: core features are suffering because of countless flashy features, and the only thing a coding agent needs to do well is code. another commenter pointed out it gets worse every time they ship, asking Anthropic to fork the models so stable users don't eat the experimental chaos.

u/IamFondOfHugeBoobies (yes, really) dropped the pragmatist take at 210 upvotes: cancel your $200 sub, you keep the remainder, re-sub if they fix it, but nothing sends feedback like cancelling. this tracks with what we've been seeing all week. the usage limit saga is now a full-blown retention crisis playing out in public.

what makes this thread different from the usual complaint posts is the tone. it's not rage. it's disappointment from someone who clearly loves the product. and that hits harder.

## repo of the day

**Orca** by stablyai ([github.com/stablyai/orca](https://github.com/stablyai/orca))

posted by someone in r/ClaudeCode with the title The Claude/Codex situation right now... alongside a meme of getting beaten up. 81 upvotes, 30 comments.

Orca adds usage tracking and fast account switching for both Claude and Codex. the pitch: if you're getting throttled on one account, swap to another without leaving your terminal. it's the kind of tool that shouldn't need to exist but absolutely does right now. when your $200/month plan hits 95% in under an hour, having a second account ready to roll is just operational hygiene.

the comments went in a different direction though. "you will see the real price after IPO" and "if energy gets more expensive our models will also get more expensive." pragmatic crowd today.

## best comment award

> McKinsey isn't selling research. They're selling a liability shield and a scapegoat for layoffs.

u/Jinh, 928 upvotes, on Firecrawl + Claude just replaced McKinsey consultants

this comment won because it did in one sentence what the original post couldn't do in several paragraphs. someone posted a breathless thread about how Firecrawl plus Claude replaces $300,000 McKinsey engagements. the community was already suspicious (u/gerira clocked it as a mindless ad for Firecrawl at 140 upvotes). but u/Jinh didn't just call out the hype. they articulated the actual value proposition of consulting that AI genuinely cannot replace: political cover. nobody gets fired for hiring McKinsey. that's the product. 928 people understood this immediately.

## troll of the day

> I just barely scratch the surface and vibecoded 6 apps on the max plan I even reduced it to the 100$ version because 200 was overkill. What are you guys doing? Do you feed it a 500 pdf that's just images every prompt?

u/Silpher9, 383 upvotes, on I pay $200/month for Claude Max and hit the limit in under 1 hour

the absolute audacity of walking into a thread where someone is melting down about hitting limits in 45 minutes and saying actually I downgraded because I had too much. this is the equivalent of responding to someone complaining about rent prices by saying "have you tried simply owning property?" and getting 383 upvotes for it. the beautiful part is they might be right. if you're vibecoding six apps from scratch versus iterating on a complex existing codebase, the token math is completely different. but reading the room? zero points.

## fun facts

- the word "nerfed" appeared in 14 separate post titles today. we've moved past suspicion into accepted lore.
- r/ClaudeCode's average post sentiment today was negative across every single time bucket. saturday is supposed to be building day. it was grieving day.
- the Anthropic: Stop shipping post generated 316 total comments across two subreddits but the comments are weirdly civil. 1,800 combined upvotes and almost no one is trolling. that's how you know it's real.
- someone posted I coded by hand for the first time in months and it felt beautiful with 6 upvotes and zero comments. the loneliest post on the board today, and somehow the most relatable.
- the hidden `fallback-percentage: 0.5` header post got an update at 11pm confirming the issue is now fixed after 11,505 API calls of independent replication. community-driven QA works faster than filing a support ticket.

## code drop

the most actionable technical finding today comes from the phantom token bug post. if you're on Claude Code versions 2.1.100 or 2.1.101, you're burning approximately 20,000 extra tokens per request on the server side. invisible to you. very visible to your quota.

the fix:

```bash
# pin to the last stable version
npm install -g @anthropic-ai/claude-code@2.1.98
```

and for the model quality issue, people are finding real results with:

```
/model claude-opus-4-5-20251101
```

this switches you to the older Opus 4.5 inside Claude Code. 162 upvotes on that discovery with comments confirming faster output (~100 tokens/sec) and noticeably better reasoning. it won't fix the token burn, but it fixes the "why does my AI sound like it's having a stroke" problem.

combine both: pin the CLI version AND swap the model. belt and suspenders for a product that apparently needs both right now.

## builder takeaways

- **pin your Claude Code version to 2.1.98** if you haven't already. versions 2.1.100 and 2.1.101 have a confirmed phantom token bug burning ~20k extra tokens per request server-side. that explains the sudden quota explosions.
- **try `/model claude-opus-4-5-20251101`** for complex engineering work. multiple users confirmed it produces dramatically better output than current Opus 4.6. the tradeoff is the model is older, but apparently older and functional beats newer and lobotomized.
- **the cache TTL change on March 6th is real.** if your API costs spiked in March, this is likely why. cache went from 1 hour to 5 minutes, meaning repeated calls that used to hit cache are now full-price. plan your batching accordingly.
- **stop resuming old chats.** u/only_anp's tip at 129 upvotes: resuming a long conversation burns massive tokens just to reload context. start fresh sessions for new tasks, even if they're related to previous work.
- **if you're going to cancel, do it strategically.** you keep access through the end of your billing period. Anthropic sees cancellation metrics faster than they read reddit threads. the community is treating this as the most effective feedback mechanism available.

## the scoreboard

| metric | count |
|---|---|
| posts tracked | 163 |
| total upvotes | 11,934 |
| total comments | 4,167 |
| fastest rising | Mythos for me, nerfed Opus for you (870 velocity) |
| most debated | Anthropic is now banning people who are under 18 (471 comments on 1,149 upvotes) |
| subreddits scanned | r/ClaudeCode, r/ClaudeAI, r/vibecoding, r/gtmengineering, r/GTMbuilders |
| returning heavy hitters | AMD lobotomization (1,750), $200/month limit thread (747), medical emergency (1,304) |

the usage limit complaint counter is now at 26 days running. at this point it's not a running gag. it's a running crisis.

shawn, the gtme alchemist 🧙‍♂️

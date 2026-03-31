---
title: "Claude Code Daily: Sunday, March 29, 2026"
date: "2026-03-29"
excerpt: "Sunday morning. Most of the Claude ecosystem was presumably asleep. Then someone noticed a .map file in Anthropic's npm package contained the full Claude Code source. All 1,884 TypeScript files. Withi"
category: "claude-daily"
featured: false
---

## the pulse

Sunday morning. Most of the Claude ecosystem was presumably asleep. Then someone noticed a .map file in Anthropic's npm package contained the full Claude Code source. All 1,884 TypeScript files. Within hours it was on GitHub, ccleaks.com was live, and r/ClaudeAI turned into the world's largest code review party.

Four separate posts about the leak across three subreddits pulled a combined 5,036 upvotes and 895 comments. The top thread alone hit a velocity of 291, the fastest anything has moved since I started tracking this show. Inside the source: 35 build-time feature flags compiled out of public builds, an entire Tamagotchi pet system called /buddy with 18 species, and internal architecture patterns that had engineers either losing their minds or shrugging depending on how many production codebases they've maintained.

The leak wasn't even the only fire. Anthropic officially acknowledged the usage limit crisis with a post titled Investigating usage limits hitting faster than expected. Nine days of the community screaming into the void, and the official response finally dropped. 1,563 combined upvotes across both subreddits. Then 2.1.88 shipped, broke custom skills, accidentally contained the source leak, and got rolled back to 2.1.87. Someone rewrote the leaked code in Python claiming clean-room copyright immunity. An axios supply chain attack hit. A mayor of a 40,000-person city asked Reddit what to use Claude for. All before Monday.

## hottest thread

**i dug through claude code's leaked source and anthropic's codebase is absolutely unhinged** in r/ClaudeAI. 1,918 upvotes. 280 comments. Velocity: 291.15.

The author spent hours reading through the leaked source and came back with a breakdown that split the community clean down the middle. On one side, builders who genuinely lost it over the /buddy Tamagotchi system and the hidden feature flags. u/Cobthecobbler spoke for that entire camp at 174 upvotes:

> I want the buddy shipped yesterday

On the other side, senior engineers who looked at the same code and called it normal. More on that in the troll section.

35 feature flags compiled out of public builds means 35 things Anthropic is actively developing internally. The leak accidentally gave the community its first real look at the roadmap, and the sheer velocity of the response shows how starved people are for that transparency. The companion post on the same topic pulled 1,610 upvotes and 306 comments. Combined on r/ClaudeAI alone, the leak story drove 3,528 upvotes and 586 comments. Add in r/ClaudeCode (970 upvotes, 173 comments) and r/vibecoding (538 upvotes, 116 comments) and you're looking at one of the biggest single-day stories this community has ever had.

Anthropic rolled 2.1.88 back to 2.1.87. Officially for bugs. Coincidentally, 2.1.88 was the version that shipped with the source. u/isakota posted a gif with 159 upvotes and the caption: they rolled it back because they pushed it with source code by mistake. Nobody believed the rollback was purely about stability.

## repo of the day

**github.com/DankoOfficial/claude-code** and **ccleaks.com** as the browsable mirror. Whether either will still be live when you read this depends entirely on Anthropic's legal team's Sunday availability.

Beyond the drama, the leak enabled real architectural analysis. The post Now that it's open source we can see why Claude Code and Codex feel so different (145 upvotes, 25 comments) compared both agent harnesses side by side now that they're both visible. The takeaway that stuck, via u/unknown:

> Claude is more willing to sin by overreaching. Codex is more willing to sin by underreaching.

That maps directly to the user experience everyone already felt but couldn't prove. Claude Code's aggressive approach is why it takes big swings and why it occasionally burns 94k tokens in 3 minutes on a single module. Codex plays it safe. Neither is wrong, but now you can read the actual code that produces those different behaviors.

Buried under the avalanche: someone built a Gemini plugin for Claude Code replicating the codex-plugin-cc experience. One upvote. Crickets in the replies. Timing is everything.

## best comment award

> accidentally open source is still open source

u/martin1744, 327 upvotes, on the leak thread in r/ClaudeAI.

Seven words that captured the legal, technical, and comedic reality of the entire day. No setup. No punchline structure. Just a clean observation that the lawyers are going to argue about while the community has already moved on to forking the repo. The beauty of this comment is that it might actually be correct, and Anthropic's legal team is probably not thrilled about that.

## troll of the day

> imma be real with you, as someone who has maintained huge codebases built before AI, this is all very pedestrian and not controversial at all. don't get me wrong, it's always fun to peek behind the curtains, but calling it "unhinged" is not fair.

u/radiationshield, 428 upvotes, on the hottest thread of the day.

While 1,918 people were collectively losing their minds over the leaked source, u/radiationshield walked into the party, looked at the same code everyone was calling unhinged, and said... pedestrian. On the same post where people are demanding the Tamagotchi feature be shipped immediately. 428 people agreed with the coldest take of the day. This is peak senior engineer energy. Technically defensible. Emotionally devastating. And probably the reality check r/ClaudeAI needed, even if nobody wanted to hear it.

## fun facts

- The source leak appeared as **4 separate posts across 3 subreddits** for a combined 5,036 upvotes and 895 comments. The story was so big it couldn't be contained to a single thread, which is ironic given the whole problem started because Anthropic couldn't contain their source code to a single package.

- **A mayor of a city of 40,000 people** asked r/ClaudeAI what to use Claude for and got 103 comments on 121 upvotes, giving it the second highest comment-to-upvote ratio of the day at 0.85. Everyone had governance advice.

- Someone tracked their **actual API cost on a $100/month Max plan: $565 in 7 days.** $9.75 per session. $0.88 per prompt. All Opus. That single post explains the usage limit crisis more clearly than any official statement has.

- The post with the most comments per upvote: **Listen, I don't have any proof, but it looks like Anthropic has quietly lowered its limits** at 1.59 comments per upvote (27 comments on 17 upvotes). Peak conspiracy energy on a day when the actual source code proved conspiracy theorists right about hidden features.

- The ClaudeAI mod bot posted a fake rate limit message on the official usage limits investigation thread and collected **560 upvotes.** When the bots are trolling about rate limits, the situation has transcended complaints and entered performance art.

## code drop

From the 2.1.88 release notes (before the rollback), one immediately useful environment variable:

```bash
# add to your .zshrc or .bashrc
export CLAUDE_CODE_NO_FLICKER=1
```

This opts into flicker-free rendering in the terminal. If the screen refresh artifacts during long Claude Code sessions have been driving you crazy, this is the fix. It'll carry over when the next stable version ships.

The bigger news from 2.1.88: two cache bug fixes found by a community member, not Anthropic's internal team. u/stathisntonas put it bluntly at 159 upvotes:

> 2.1.88 contains the 2 cache bug fixes found by that reddit user. Give that man/woman credits equivalent to your highest paid senior dev monthly salary for fucks sake for spotting a bug that existed for months.

Those cache bugs were contributing to the faster-than-expected limit consumption. A Reddit user diagnosed what internal QA missed. The fixes are in 2.1.88, which is currently rolled back, so they'll return in the next stable release. Worth monitoring.

## builder takeaways

- **axios@1.14.1 is compromised.** Supply chain attack confirmed, 238 upvotes as a PSA. If you let Claude Code run npm install (and you do), check your lockfiles today. Not tomorrow.

- **Custom skills broke in 2.1.88.** If you updated before the rollback and your .claude/skills/ stopped loading, you need to manually pin to 2.1.87 via /config under the auto-update channel.

- **The leaked source is a roadmap.** 35 feature flags in active development. Study the flags, not just the Tamagotchi. The source is still circulating and it tells you more about where Claude Code is headed than any blog post Anthropic has published.

- **Don't give Claude computer-use access on your real machine.** The PSA post hit 401 upvotes and 125 comments. Sandbox it. The convenience-to-risk ratio of letting an AI agent interact with your actual desktop is not worth it.

- **The usage limit acknowledgment changes the dynamic.** Nine days of community reports finally got an official response. The cache bug fixes are part of the solution. If you've been rationing your prompts, the next stable release should help. Should.

## the scoreboard

- **Posts tracked:** 172
- **Total upvotes:** 14,415
- **Total comments:** 4,058
- **Fastest rising:** i dug through claude code's leaked source and anthropic's codebase is absolutely unhinged (velocity: 291.15)
- **Most debated:** Listen, I don't have any proof, but it looks like Anthropic has quietly lowered its limits (1.59 comments per upvote)
- **Most crossposted story:** Claude Code source leak (4 posts, 3 subreddits, 5,036 combined upvotes)
- **Subreddits scanned:** ClaudeAI, ClaudeCode, vibecoding, GTMbuilders, gtmengineering
- **Usage limit saga:** day 9. officially acknowledged. community sentiment: cautiously furious.
- **Sleep gag update:** u/Dry_Incident6424 with 254 upvotes on the unhinged Claude post. Given how often Claude tells me to go to Bed, I think you accidentally got Evil Claude. the streak lives.

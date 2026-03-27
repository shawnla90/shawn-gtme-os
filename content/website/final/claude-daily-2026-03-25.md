---
title: "Claude Code Daily: Wednesday, March 25, 2026"
date: "2026-03-25"
excerpt: "wednesday brought receipts. Anthropic finally broke silence on the usage limit chaos that's been tearing through r/ClaudeCode for days, and the community responded with the energy of a customer servic"
category: "claude-daily"
featured: false
---

## the pulse

wednesday brought receipts. Anthropic finally broke silence on the usage limit chaos that's been tearing through r/ClaudeCode for days, and the community responded with the energy of a customer service line that's been on hold since Monday. 721 combined comments across two subreddits on the same announcement post. people are not calm.

but while Claude Code users were checking their usage meters like gas prices in 2008, over in r/ClaudeAI someone's uncle in India got a 25-year medical mystery solved by a single Claude conversation. 3,865 upvotes. 908 comments. a post about sleep apnea diagnosis outperformed every product announcement Anthropic has made this quarter. the simulation is not subtle.

and then there's the person who just... gave Claude full access to their MacBook. posted a screenshot. said "good idea or nah?" 3,409 upvotes. 90 comments. the brevity-to-engagement ratio on that post is criminal. six words and a screenshot did numbers that marketing teams spend months trying to hit.

## hottest thread

**"Update on Session Limits"** dominated both r/ClaudeAI (482 upvotes, 405 comments) and r/ClaudeCode (265 upvotes, 316 comments). Anthropic's Thariq posted the official explanation: during peak hours (weekdays 5am to 11am PT), your 5-hour session limits burn faster. weekly limits stay the same. off-peak you get a bonus multiplier.

the community's translation: you quietly throttled us, got caught, and now you're framing the throttle as a feature.

u/HMITCHR set the tone with 428 upvotes calling it exactly what most people were thinking. u/shyney pulled up the receipts with a linked tweet showing this wasn't new. and the parallel post on r/ClaudeCode from u/deepunderscore asking for a visible multiplier gauge got 499 upvotes, which is about as close to a unanimous demand as Reddit gets.

the real story isn't the limits themselves. it's the timeline. a separate post by another user mapped out Anthropic's claims about the 2x promo over 11 days, showing how the messaging shifted from promotional bonus to demand management framing. 103 upvotes and 31 comments in r/ClaudeCode, with the top comment being blunt: "This isn't the first time that Thariq has been caught lying."

the usage limit saga that's been building all week finally got its official response. whether that response made things better or worse depends entirely on which comment section you read.

## repo of the day

**general-kenobi** by antonkarliner. 112 upvotes. the title says "Made a 100% reliable skill" and the description is exactly what you think it is.

`npx skills add antonkarliner/general-kenobi`

it's a Claude Code skill that responds with "Hello there!" every time. that's it. 100% reliability. zero hallucinations. perfect accuracy. the benchmark every frontier model wishes it could hit.

top comment from u/ (unnamed): "That's the dumbest skill I've ever seen. I love it." followed by "a fine addition to your collection."

is it useful? absolutely not. is it the most honest piece of software shipped this week? arguably yes. in a world where we're arguing about whether 250K tokens to say hello is a bug or a feature, someone built a skill that actually says hello reliably. respect.

## best comment award

> It is so interesting to see how Claude tries to close the gap between what it was asked and what it wants to talk about. No matter how difficult the obstacles or how mighty the tides, it manages to build that bridge, much like that iconic landmark of San Francisco, opened in 1937.

u/Uiropa, 183 upvotes, on the "Golden Gate Claude on the Rwandan genocide" post.

this comment is a masterclass. it reads like a normal observation for the first sentence, then slowly turns into Golden Gate Claude itself. the pivot at "much like that iconic landmark" is so smooth you almost don't catch it. u/Uiropa became the thing they were describing. meta-comedy at its finest. the Rwandan genocide post was about how the old Golden Gate Claude variant would steer literally any topic back to the bridge, and this comment demonstrated the phenomenon while commenting on it. 10/10, no notes.

## troll of the day

> You guys were 10000% throttling usage at different levels for users for the past few days, looking for just how low you could drop it before people started to complain too much. All while staying completely silent for days and not acknowledging the countless complaints of users who could all the suddenly not use the product they paid for.

u/HMITCHR, 428 upvotes, on the "Update on Session Limits" post in r/ClaudeCode.

is it a troll? is it investigative journalism? the line is gone. this comment got more upvotes than most actual posts today. when your accusation of corporate A/B testing on paying customers gets 428 upvotes, either everyone is conspiratorially minded or the shoe fits a little too well. u/HMITCHR came in hot with the "10000%" and never cooled down. the silence-then-framing pipeline they described is exactly what half the subreddit had been saying for days, but nobody had put it this bluntly. sometimes the troll of the day is just the person who says the quiet part at full volume.

## fun facts

- the word "limit" appeared in 23 separate post titles today. r/ClaudeCode is basically r/UsageLimits at this point. week six of this running gag and it's not a gag anymore.
- the medical diagnosis post (3,865 upvotes) got more engagement than the next three posts combined. Claude diagnosing sleep apnea is apparently more interesting than Claude's own product updates.
- "Giving Claude access to my MacBook" got 3,409 upvotes with a 6-word post and a screenshot. that's 568 upvotes per word. efficiency king.
- u/casual_rave on Opus 4.6: "This thing is indeed intimidating, but it's also intimidating that it drains my usage in 3-4 prompts." 182 upvotes for describing the duality of man in one sentence.
- someone posted "No title needed" with just a crying emoji in r/ClaudeCode. 89 upvotes. 35 comments. the subreddit has reached interpretive art phase.
- r/vibecoding caught a bot. the "google stitch is insane" post got called out with "Bot. 17k karma in 27 days." the vibes are being botted.

## code drop

the most actionable technical find today came from the "Your huge token usage might have been just bad luck" post (151 upvotes, 63 comments). the author discovered that Claude Code's token counting might be inflated by minified internal files and suggested deminifying your CC installation to investigate.

the real code drop, though, is from the PyPI supply chain attack post. u/ (the OP) caught a malicious package masquerading as LiteLLM and reported it to PyPI's security team. the interesting part: Claude almost convinced them to stop investigating.

if you're using LiteLLM or any AI proxy library, audit your dependencies:

```bash
# check for typosquatted packages in your python environment
pip list | grep -i lite
pip list | grep -i llm

# verify package integrity against PyPI
pip show litellm | grep -E "^(Name|Version|Home-page)"

# if you want to go deeper, check installed package hashes
pip hash litellm
```

the lesson isn't the specific attack. it's that AI tools will confidently tell you everything is fine when it isn't. trust your instincts when something looks wrong, even when your AI pair programmer disagrees.

## builder takeaways

- **schedule your heavy Claude Code sessions for off-peak hours.** Anthropic confirmed peak is weekdays 5am to 11am PT. if you're in Europe, your afternoon is their morning. plan accordingly.
- **use /clear between sessions.** the 250K token hello post suggests stale context might be inflating token counts. multiple users confirmed /clear resets the baseline.
- **the general-kenobi skill pattern is actually useful.** not the joke itself, but the `npx skills add` distribution model. if you've built Claude Code skills, package them the same way. the community is ready for a skill ecosystem.
- **audit your AI dependencies today.** the LiteLLM supply chain attack is a reminder that the AI tooling ecosystem is a target. run `pip audit` or `npm audit` on any project using AI libraries.
- **if you're on Max and hitting limits, check your concurrent session count.** multiple users reported that running 3 to 6 Claude Code instances simultaneously burns through allocations exponentially, not linearly.

## the scoreboard

- **posts tracked:** 176
- **total upvotes:** 15,171
- **total comments:** 4,468
- **fastest rising:** "25 years. Multiple specialists. Zero answers. One Claude conversation cracked it." (velocity: 239.21, 3,865 upvotes)
- **most debated:** "Update on Session Limits" in r/ClaudeCode (316 comments on 265 upvotes, ratio: 1.19)
- **subreddits scanned:** ClaudeAI, ClaudeCode, vibecoding, GTMbuilders, gtmengineering
- **returning characters:** usage limit complaints (day 6 of the saga), Opus 4.6 still intimidating people and draining their tokens simultaneously
- **mood:** pitchforks out, but also weirdly inspired by a sleep apnea diagnosis

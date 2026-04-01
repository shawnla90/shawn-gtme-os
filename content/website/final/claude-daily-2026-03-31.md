---
title: "Claude Code Daily: Tuesday, March 31, 2026"
date: "2026-03-31"
excerpt: "the entire Claude Code source leaked today through a .map file left in the npm package. 1,884 TypeScript files. 500k+ lines. every system prompt, every feature flag, every internal tool. and buried in"
category: "claude-daily"
featured: false
---

## the pulse

the entire Claude Code source leaked today through a .map file left in the npm package. 1,884 TypeScript files. 500k+ lines. every system prompt, every feature flag, every internal tool. and buried in the codebase... a tamagotchi virtual pet system called /buddy. I cannot make this up.

r/ClaudeCode, r/ClaudeAI, and r/vibecoding collectively lost their minds. the leak dominated every feed. people found 35 build-time feature flags compiled out of public builds, discovered that Anthropic employees get a different CLAUDE.md than the rest of us (USER_TYPE=ant), and someone used OpenAI's Codex to find and patch a token drain bug in Claude Code's own source. the irony is so thick you could spread it on toast. Anthropic shipped 2.1.89 within hours to strip the source maps. fast turnaround. but the damage (or gift, depending on your perspective) was already done.

meanwhile, the usage limit saga enters its ninth consecutive day of community rage. Anthropic officially admitted quotas are running out too fast. and in a beautiful subplot, the leaked source might have revealed why. the token drain patch post hit 1,049 upvotes. people are literally fixing Anthropic's product for them using a competitor's tool. we are living in the greatest timeline.

## hottest thread

**"i dug through claude code's leaked source and anthropic's codebase is absolutely unhinged"** on r/ClaudeAI. 4,088 upvotes. 496 comments. this post went nuclear.

the author spent hours combing through the leaked TypeScript source and cataloged everything wild they found. the buddy system (a full tamagotchi-style virtual pet that lives in your terminal and comments on your code). internal feature flags that public users never see. the system prompts that shape Claude Code's behavior. and a now-infamous profanity tracking chart that Boris, Claude Code's creator, publicly responded to without denying the leak.

the community reaction split into three camps: people who wanted /buddy shipped immediately, people terrified about security implications of installing random GitHub repos reconstructed from leaked source, and people who just thought the whole thing was the funniest dev story of the year. u/Cobthecobbler spoke for camp one with 405 upvotes: I want the buddy shipped yesterday. u/SandPac was camp two, warning people that 500k+ lines of reconstructed code could hide anything. and camp three? they were too busy making memes to comment coherently.

the 496-comment thread is genuinely worth reading. it's part code archaeology, part corporate comedy, part open source manifesto.

## repo of the day

**cc-cache-fix** by u/Rangizingo. the post that proved the leak was actually useful.

someone took the leaked source, fed it to OpenAI's Codex (yes, a competitor's tool), found the root cause of the insane token drain that's been bleeding Max plan subscribers dry for a week, and patched it. the fix brought their 5-hour usage down to 6%, which is normal. 1,049 upvotes. 86 comments. the repo is at github.com/Rangizingo/cc-cache-fix.

the author was refreshingly honest about it too. Codex found and fixed this, not me. I work in IT and know how to ask the right questions, but it did the work. that's the most 2026 sentence I've ever read. debugging one AI's code with a different AI. we really are just prompt engineers arguing about which AI does our job better.

worth noting: this is an unofficial patch against leaked source. run it at your own risk. but the fact that the community identified and fixed a billing-impacting bug faster than the company that wrote the code? that's a statement.

## best comment award

> "All our software engineers aren't writing code anymore" -Dario
>
> Yeah that's pretty freaking apparent dude

u/PetyrLightbringer, 545 upvotes, on the token drain patch thread.

this comment won because it operates on three levels simultaneously. surface level: a joke about Anthropic's CEO bragging that engineers use AI now. second level: a roast implying the leak happened because nobody was actually reviewing the code. third level: the quiet devastation of pointing out that a .map file shipped in a production npm package is exactly what happens when your engineers stop writing (and reviewing) code. three layers of burn in two sentences. surgical.

## troll of the day

> Now someone needs to dump all of their full models and we're good for a while.

u/AnywhereHorrorX on r/vibecoding. 105 upvotes.

buddy. pal. friend. we got the CLI source code from a stray .map file and you're out here asking for the full model weights next? that's like finding a spare key under someone's doormat and saying great, now someone needs to steal the whole house. I appreciate the ambition but maybe let's walk before we run a multinational IP theft operation. also love the casual "and we're good for a while" like model weights are a grocery run. just stocking up the pantry with a few hundred billion parameters. totally normal request.

## fun facts

- the word "leaked" appeared in 14 separate post titles today. r/ClaudeCode became r/WikiLeaks for 24 hours
- the single post "i dug through claude code's leaked source..." generated 496 comments. that's more comments than 170 of today's 179 tracked posts combined
- leak-related posts accounted for roughly 10,000 of today's 18,803 total upvotes. over 53% of all engagement was about one .map file
- /buddy, a tamagotchi feature nobody knew existed 24 hours ago, already has a standalone TypeScript recreation on GitHub with its own repo. the speed of the internet remains undefeated
- someone asked "Is this marketing tactics by claude?" and honestly... at this point I can't rule it out. accidental open source is still open source

## code drop

the security review prompt pulled directly from the leaked Claude Code source by a r/vibecoding user is worth bookmarking. this is what Anthropic uses internally for code review:

```
Review the complete diff above. This contains all code changes in the PR.

OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE
security issues. Focus on:
- Injection vulnerabilities (SQL, command, XSS, etc.)
- Authentication/authorization flaws
- Sensitive data exposure
- Insecure cryptographic practices
- Path traversal vulnerabilities
```

the full prompt is longer and more structured, but the pattern is clear. specific vulnerability categories. high-confidence qualifier to reduce false positives. diff-based review so it only looks at what changed. if you're building any kind of automated PR review into your Claude Code workflow, this is a battle-tested template straight from the source. literally.

drop this into a custom slash command or a CLAUDE.md security review section. it's free now. no gatekeeping required when Anthropic already did it for us (accidentally).

## builder takeaways

- **audit your npm packages for source maps.** if Anthropic shipped a .map file in production, your projects might have them too. run `find node_modules -name "*.map" | head -20` and check what you're exposing
- **the USER_TYPE=ant flag in the leaked CLAUDE.md shows Anthropic employees get different system prompts.** you can study their internal config and adapt patterns for your own CLAUDE.md. several posts broke down exactly what's different
- **if you're hitting token limits, the cc-cache-fix repo identified a caching issue as the root cause.** even if you don't apply the patch, understanding that the problem is cache-related (not model-related) changes how you troubleshoot
- **/buddy is real and coming.** version 2.1.89 added buddy mode instructions to the system prompt. a terminal companion that reacts to your coding. whether you find that delightful or horrifying says a lot about you
- **claude code now runs locally with Ollama** via beti5/claude-code-ollama-local. 103 upvotes, 44 comments. for builders who want the harness without the API costs, this is worth exploring

## the scoreboard

| metric | count |
|---|---|
| posts tracked | 179 |
| total upvotes | 18,803 |
| total comments | 4,576 |
| fastest rising | "i dug through claude code's leaked source..." (4,088 pts, 496 comments) |
| most debated | "He Rewrote Leaked Claude Code in Python, And Dodged Copyright" (109 comments on 354 upvotes) |
| subreddits scanned | GTMbuilders, gtmengineering, ClaudeCode, vibecoding, ClaudeAI |
| leak-related posts | 20+ across all subs |
| time from leak to patch release (2.1.89) | hours, not days |

---

*one .map file. 500k lines of source. 18,000 upvotes. a tamagotchi. and the entire community debugging Anthropic's product with a competitor's AI. tuesday was not boring.*

shawn, the gtme alchemist 🧙‍♂️

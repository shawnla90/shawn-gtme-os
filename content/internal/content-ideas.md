# Content Ideas Index — future content inspiration

Running index of content seeds. Newest at top. Each entry is a brief a future
drafting session (or `/code`) can pick up. Status: `seed` → `drafting` → `shipped`.

---

## 2026-06-23 · "Why I never hit token limits" (the cache thesis)
**Status:** seed
**Surfaces:** LinkedIn (primary), X thread, Reddit (r/Claude / r/ClaudeAI), maybe blog
**Voice:** builder, show-the-receipts, slightly contrarian

**Hook options:**
- "I average ~30M tokens a day and never hit a limit. Not a special plan. It's how the tokens are spent."
- "Everyone's scared of token limits. I burned 1.16 billion tokens in 40 days and never hit one. Here's why."

**Thesis:** The limit isn't tokens, it's *how* you spend them. Long-running terminal
sessions (Claude Code) keep a stable context prefix — system prompt + your loaded
repo + tools — that gets cached once and re-read on every turn at a fraction of the
price. So the more you iterate in one session, the cheaper each turn gets. Chat
doesn't work this way: every turn is fresh, full-weight tokens, no persistent
project/tooling to cache against. That's why building real things in the terminal
(databases, sequences, pipelines) makes economic sense and chat-only usage stays small.

**Proof (my real 40-day data, May 15 – Jun 23, from ~/.claude/projects transcripts):**
- 1.16B total tokens, but only **12.2M** is real "work" (input + output). ~99% is cache.
- **~22:1 cache reuse ratio** (1.1B read vs 50M written) — the whole trick in one number.
- "30M tokens/day" average, but the part that counts against the limit is ~**300K/day**.
- Effective multiplier on the limit is ~100x because the volume is cache reads, which
  bill at ~10% of fresh input.

**The teaching nuance (get this right or builders will push back):** tokens don't
"go into" cache like storage. Cache = the model re-reading a stable prefix cheaply.
High reuse only happens with a persistent, iterative session — i.e. the terminal.

**Payoff line:** "When the marginal turn is cheap, you stop rationing. You let it
scrape 227 leads, match them against a 144K-row database, build the sheet, and draft
the sequence in one session — because re-reading that context costs almost nothing
after the first load. People paying full-price chat tokens can't think that way, so
they stay small."

**Concrete example to cite:** the db-campaign build (Ben Reed post → 227 engagers →
177 in-ICP → 106 NEW → color-coded sheet) all in one cached session.

**Do NOT:** quote named commenters; lead with thesis-as-headline; use slop ("unlock",
"game changer"). Show the numbers first, explain second.

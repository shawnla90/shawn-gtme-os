# CONTEXT: ApolloNEXT content pack (initial reactions)

> Created 2026-10-01. Consumed by downstream drafting. Creator-contract deliverables: newsletter, article, post, reddit.

## Decisions (locked)

- **Lead piece**: LinkedIn newsletter. Approve it first, then derive the other three from the approved copy. Nothing else drafts until the newsletter is approved.
- **Disclosure**: every piece carries a one-line creator-contract disclosure, and the LinkedIn pieces publish with the Apollo Brand Affiliate label (same as the July API pack).
- **Vendor and agency stay unnamed**: the backstory says "my agency" and "a vendor with a great product." No names. Pattern vs. person.
- **Fact-checked claims only**: ApolloNEXT, Sept 30 2026, SFJAZZ Center SF. Matt Curl CEO since Feb 3 2026 (COO to CEO; Tim Zheng chairman). Builder Studio in beta. Messaging OS announced, available soon. Intelligence Layer rounds out the AI GTM System. Website Visitors: company-level free, person-level via the Inbound add-on, June 2026 release notes added a Workflows tab and UTM attribution.
- **Willy Hernandez** (The GTM Factory). Research found the spelling Willy, not Willie. Shawn confirms before publish.
- **No verbatim CEO quotes** unless Shawn supplies the exact words. Paraphrase only, marked in the draft.
- **Ungated receipt**: `scripts/apollo/title_search_workflow.py` in the public repo. Newsletter links it. Reddit post pastes the key logic inline.
- **Format**: newsletter body in sentence case (matches the Apollo-approved July newsletter). Feed posts lowercase-first-line. Capital I everywhere. No em dashes. No quotation marks around phrases.

## Deliverable map

| Contract item | Piece | Channel | File |
|---|---|---|---|
| newsletter | ApolloNEXT: initial reactions | LinkedIn newsletter | `content/linkedin/drafts/2026-10-01_apollo-next-newsletter.md` |
| article | blog version of the newsletter (strip newsletter scaffolding, add TL;DR + FAQ per AEO standard) | shawnos.ai via `/publish-blog` | `content/blog/2026-10-0X_apollo-next-initial-reactions.md` |
| post | Apollo channel post (the one Apollo reshares; feed-length, Brand Affiliate label, UTM if Apollo supplies one) | LinkedIn feed | `content/linkedin/drafts/2026-10-0X_apollo-next-channel-post.md` |
| post | GTM engineering post (the title-filter workflow as a play, script in comments) | LinkedIn feed | `content/linkedin/drafts/2026-10-0X_apollo-title-filter-play.md` |
| reddit | r/GTMBuilders post (continuity cue + the workflow as a receipt, script logic inline) | Reddit | `content/reddit/drafts/2026-10-0X_apollo-next-r-gtmbuilders.md` |

Assumption: "article" = the blog version on shawnos.ai. If Shawn means a LinkedIn article instead, the same copy ports with the frontmatter removed.

## Agent routing (per `.claude/skills/agent-routing/SKILL.md`)

Pattern A, single focused session, with lightweight subagents. The main session holds the voice system and writes every piece. Subagents do research and cross-review only.

| Role | Agent | Model | Scope |
|---|---|---|---|
| Fact-check researcher | general-purpose, web | sonnet | Done. Fact sheet in this folder's `research.md`. |
| Writer | main session | this session | All four pieces, one at a time, newsletter first |
| Reviewer | general-purpose, read-only | sonnet | Runs `skills/ai-pattern-detection` 29 patterns + anti-slop + safety filters + substance 2-of-5 on each draft. Returns flags, does not rewrite. 3+ flags = rewrite, not patch. |
| Script QA | main session | this session | Done. py_compile, dry-run payload, title filter unit check, missing-key exit path. Live API run pending on a machine with `APOLLO_API_KEY`. |

## Sequence and gates

1. Newsletter draft (this session) -> reviewer pass -> Shawn approves (`approve newsletter` or edits).
2. On approval: draft Apollo channel post, GTME play post, r/GTMBuilders post in one wave. Reviewer pass on each.
3. Shawn approves each. Blog article drafts last from the approved newsletter via `/publish-blog`.
4. Pre-publish: `skills/tier-3-content-ops/pre-publish-checklist.md`, blocklist scan via `/update-github`, Brand Affiliate label on LinkedIn.
5. Visual: one cover (1200x627, same lockup style as the July pack) plus one conference photo and one terminal screenshot of the script summary. Shawn supplies the photo.

## Open items for Shawn

- Confirm Willy vs. Willie spelling and whether to link his profile.
- Supply one exact Matt Curl line if a direct quote is wanted. Otherwise the paraphrase stands.
- Confirm whether "article" means the shawnos.ai blog or a LinkedIn article.
- Run the script live once with a real key and paste the summary block for the screenshot.

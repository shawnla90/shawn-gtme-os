# Task Tracker

> Write plans here with checkable items before starting work.
> Mark items complete as you go. Add a review section when done.

---

<!-- Tasks will be added below per session -->

## 2026-07-24 Apollo API + CLI + MCP newsletter revision

- [x] Verify Apollo's current API, CLI, MCP, limits, and Apollo Anywhere claims from first-party sources.
- [x] Rewrite the approved LinkedIn copy into a longer newsletter with a clear interface-selection framework.
- [x] Embed the supplied UTM behind descriptive anchor text for LinkedIn's newsletter editor.
- [x] Build a new Apollo-only 1200x627 newsletter cover with equal API, CLI, and MCP hierarchy.
- [x] Update the manifest and source notes.
- [x] Run factual, voice, safety, link, SVG, render, and visual checks.
- [x] Put the final rich-text newsletter on the macOS clipboard only after validation.

### Boundaries

- Keep the original screenshot-to-SQLite workflow and measured results as the empirical core.
- Do not include Clearbox branding in the cover.
- Distinguish official Apollo capabilities from Shawn's recommended way of using them.
- Use the Apollo Brand Affiliate label when publishing.
- Draft only. Do not send the partner reply, dispatch, publish, stage, commit, or push.

### Review

- Newsletter title: `Apollo API, CLI, or MCP? Where each one fits in a GTM system`.
- Expanded the approved 441-word feed copy into a 1,140-word LinkedIn newsletter with the original screenshot-to-SQLite workflow as the empirical core.
- Added the interface rule: MCP for a conversation, CLI for a terminal play, API for a production workflow.
- Updated the credit language against Apollo's current docs: People API Search is zero-credit; enrichment and selected company endpoints can consume credits; limits vary by endpoint and plan.
- Added an explicit Apollo partnership disclosure and embedded the supplied Apollo Anywhere UTM behind descriptive link text.
- Built and visually inspected an Apollo-only 1200x627 cover with equal API, CLI, and MCP cards. Editable SVG and official Apollo mark source are retained.
- Verified: zero dispatcher anti-slop flags, zero safety hits, zero deep-pattern matches, ASCII unchanged, valid JSON/HTML/SVG, all manifest paths present, and HTTP 200 from all ten public sources and campaign links.
- The macOS clipboard contains a rich HTML body with the UTM embedded and the raw tracking URL hidden. The article title remains separate for LinkedIn's title field.
- No reply was sent and no content was dispatched, published, staged, committed, or pushed.

### Revision 2 - hook title and network TLDR

- [x] Replace the explanatory newsletter title with a conviction-led hook.
- [x] Set `The Power API Wire` as the visible subtitle.
- [x] Draft the short `Tell your network` post with a feed-native hook and TLDR.
- [x] Carry the subtitle onto the newsletter cover.
- [x] Rebuild rich HTML and the cover PNG, then repeat copy and artifact checks.

#### Review

- Hook title: `The Apollo API wired into an agent does more than the tools I pay for`.
- Subtitle: `The Power API Wire`.
- Added a 131-word Tell Your Network post that maps API, CLI, and MCP without repeating the full newsletter.
- Regenerated the rich newsletter body with the subtitle first and the UTM still embedded behind `Apollo Anywhere`.
- Re-rendered and visually inspected the 1200x627 cover with the subtitle added to the Apollo lockup.
- Verified both copy files return zero anti-slop flags, zero safety hits, zero deep-pattern matches, and unchanged ASCII normalization. Manifest, HTML, SVG, assets, and image dimensions all pass.

## 2026-07-24 Apollo approved-post handoff

- [x] Locate the canonical Apollo API content pack and confirm the approved copy.
- [x] Verify the supplied Apollo Anywhere UTM resolves and matches the coding-agent angle.
- [x] Add the UTM to the LinkedIn draft without rewriting approved copy.
- [x] Draft an exact ETA response for the Apollo team.
- [x] Re-run content, safety, manifest, and URL checks.

### Boundaries

- Preserve the Apollo-approved body except for the supplied campaign CTA.
- Keep the GitHub repo link as the ungated technical receipt.
- Draft only. Do not send the partner reply, publish, dispatch, copy to clipboard, stage, commit, or push.
- Use LinkedIn's Apollo Brand Affiliate label at publication.

### Review

- Preserved the Apollo-approved post and added the supplied Apollo Anywhere UTM immediately before the ungated GitHub receipt.
- Drafted a partner reply targeting Monday, July 27 at 9:30 AM ET for the first post.
- Verified: valid manifest JSON, 441-word LinkedIn body, three hook variants, all referenced files present, ASCII normalization unchanged, zero safety hits, zero deep-pattern matches, and HTTP 200 from both public links.
- The standard anti-slop scan retains one pre-existing colon-list flag from the approved body, below the three-flag rewrite threshold.
- No reply was sent and no content was dispatched, published, copied, staged, committed, or pushed.

## 2026-07-22 Programmatic GTM / Google Workspace CLI Reddit Pack

- [x] Inspect the current Mac mini hardware, installed `gws`, prior GWS content, and GTMBuilders draft style.
- [x] Verify the current CLI architecture, security model, creator backstory, Apple specs, and React Flow source.
- [x] Draft a distinct r/GTMBuilders post around the always-on Mac mini and programmatic GTM thesis.
- [x] Include a pasteable Claude prompt for a local-first workflow builder using React Flow.
- [x] Create source notes and a LinkedIn-later angle without drafting the LinkedIn post yet.
- [x] Run anti-slop, safety, link, manifest, and content-difference checks.

### Boundaries

- Draft only. Do not dispatch, post to Reddit, copy to clipboard, stage git changes, or publish.
- Attribute the firing story to Justin Poehnelt; Google has not publicly confirmed his stated reason.
- Do not frame Clay or any named vendor as dead. Critique the API/headless architecture pattern.
- Do not expose machine identifiers, credential paths, tokens, or account details.

### Review

- Canonical draft pack: `/Users/shawnos.ai/content/drafts/2026-07-22_programmatic-gtm-gws-cli/`.
- Primary Reddit title: `GTM builders: another system share - how GWS CLI turned my Mac mini into a GTM server`.
- The 957-word post opens as another transparent system share, uses the verified M4 Pro / 24GB receipt, attributes Justin Poehnelt's firing claim, separates `gws` from LinkedIn tooling, and includes a 113-word React Flow prompt.
- LinkedIn work is limited to an angle note; no LinkedIn post was drafted.
- Verified: zero dispatcher anti-slop flags, zero safety hits, no deep-pattern matches, ASCII normalization unchanged, all five public source URLs return HTTP 200, manifest JSON and paths pass, and the copy is distinct from the March GWS draft.
- No dispatch, Reddit post, clipboard write, staging, commit, push, or publication was performed.

### Revision 2 - GTMBuilders share hook

- [x] Call GTM builders into the title and opening line.
- [x] Frame the post as another transparent share from Shawn's working system.
- [x] Keep the machine and Google Workspace CLI as the concrete receipt.
- [x] Re-run anti-slop, safety, manifest, and deep-pattern checks.

#### Review

- The primary hook now calls in GTM builders and frames the post as another share before introducing the tool.
- Verified: zero anti-slop flags, zero safety hits, zero deep-pattern matches, valid manifest JSON, three hook variants, and all referenced draft files present.

## 2026-06-12 Clearbox Email Open Tracking

- [ ] Store Clearbox PostHog credentials in `niobot.db`.
- [ ] Add a public email-open pixel route to the Vercel app serving `clearbox.to`.
- [ ] Add local outbound open-event tables/helpers and insert the pixel into campaign HTML sends.
- [ ] Update Mission Control campaign metrics to show opens.
- [ ] Verify with build checks, local API checks, and a manual pixel request.

## 2026-07-21 How I Would Build GTM Today Content Pack

- [x] Verify Jesse's source post, Satellyte positioning, Shawn's current stack, and logo sources.
- [x] Draft the LinkedIn post plus three hook variants around relevance over personalization.
- [x] Build an editable SVG and rendered PNG of the Satellyte + Clearbox allbound workflow.
- [x] Run anti-slop, safety, factual, link, and visual checks.
- [x] Add a review section with final artifact paths and verification results.

### Boundaries

- Draft only. Do not dispatch to Discord, post to LinkedIn, stage git changes, or deploy.
- Keep all new pack artifacts isolated from unrelated in-flight worktree changes.

### Review

- Initial Satellyte x Clearbox framing was superseded by the system-first revision below.
- Canonical draft pack: `/Users/shawnos.ai/content/drafts/2026-07-22_how-i-would-build-gtm-today/`.
- Deliverables: LinkedIn post, two first comments, three manifest hooks, editable SVG, 1200x1500 PNG, proportional logo/brand assets, source notes.
- Verified: all three public copy files return zero dispatcher anti-slop flags; filtered blocklist scan passes; manifest JSON and SVG XML parse; all product links return HTTP 200; final PNG was visually inspected at full resolution.
- No dispatch, publication, staging, commit, push, or deployment was performed.

### Revision 2 - system-first correction

- [x] Reframe the post as how Shawn would build GTM today, not a Satellyte x Clearbox product story.
- [x] Make Reddit the upstream research source and coding agents the orchestration brain.
- [x] Rebuild the visual on the canonical near-black Aura canvas with violet engine treatment.
- [x] Reuse the authored subreddit, beam, Aura core, and extracted-signal visual vocabulary.
- [x] Re-render and repeat all copy, safety, manifest, link, and visual checks.

### Revision 3 - equal logo hierarchy (superseded)

- [x] Normalize every product logo to the same 40x40 optical footprint.
- [x] Replace the oversized EmailBison wordmark treatment with an equal-size icon and text label.
- [x] Re-render the 1200x1500 PNG and inspect the visual hierarchy at full resolution.
- [x] Re-parse the SVG and confirm every product image instance is 40x40.

#### Review

- This revision over-applied a Clearbox icon correction to every brand asset and was reverted in Revision 4.

### Revision 4 - icon-only correction

- [x] Restore each brand's original logo and wordmark treatment from Revision 2.
- [x] Keep only the Clearbox icon reduced from 56x56 to 40x40.
- [x] Remove the temporary EmailBison icon wrapper and restore its wordmark.
- [x] Re-render, validate the SVG, and inspect the final 1200x1500 PNG.

#### Review

- Clearbox remains in the semantic/citation layer; only its icon changed from 56x56 to 40x40.
- EmailBison, Deepline, Satellyte, Apollo, Prospeo, and all other brand treatments match the approved Revision 2 composition.
- SVG XML parses successfully; the final PNG is 1200x1500 and was inspected at full resolution.

### Revision 5 - stronger LinkedIn post

- [x] Rewrite the post around a sharper Reddit-first hook.
- [x] Keep Clearbox explicit in the semantic research layer without making it the whole system.
- [x] Run voice, anti-slop, ASCII, and safety checks.
- [x] Copy the exact approved LinkedIn body to the macOS clipboard.

#### Review

- Primary hook: `your CRM knows who the buyer is. Reddit tells you why they care right now.`
- The post names Clearbox + Aura in the first workflow layer as the full-thread semantic reader.
- The 340-word body has zero dispatcher anti-slop flags, zero safety hits, and no LinkedIn markdown artifacts.
- `pbpaste` matches the saved LinkedIn draft byte-for-byte.

## 2026-07-24 Apollo LinkedIn Comment TLDR

- [x] Draft a comment-length TLDR that distinguishes Apollo MCP, CLI, and API.
- [x] Include the approved Apollo Anywhere UTM as a LinkedIn-compatible raw URL.
- [x] Validate voice, safety, link response, and exact clipboard contents.

### Boundaries

- Draft and clipboard only. Do not post, dispatch, stage, commit, push, or deploy.

### Review

- Saved an 88-word LinkedIn first-comment TLDR with the Apollo partnership disclosure and approved influencer UTM.
- Verified zero anti-slop flags, zero safety hits, ASCII-safe copy, valid manifest JSON, and HTTP 200 from the tracked Apollo Anywhere link.
- Confirmed the macOS clipboard matches the saved comment byte-for-byte.

---
name: Weekend Launch Skills Audit
overview: Audit and plan which skills, MCPs, and tooling are needed for the shawnos.ai weekend launch (Feb 14-15), which are optional enhancements, and whether the repo needs restructuring or side-repo offloading.
todos:
  - id: vercel-mcp
    content: Install Vercel MCP via /addmcp vercel (Friday evening alongside domain purchase)
    status: pending
  - id: domain-dns
    content: Purchase shawnos.ai + shawnos.com, configure Cloudflare DNS (manual, no skill needed)
    status: pending
  - id: website-post-skill
    content: Build /websitepost skill in .cursor/skills/website-post/SKILL.md (Sunday afternoon)
    status: pending
  - id: final-website-skill
    content: Build /finalwebsite skill in .cursor/skills/final-website/SKILL.md (Sunday afternoon)
    status: pending
  - id: website-playbook
    content: Create skills/tier-2-context-playbooks/website.md platform playbook (Sunday afternoon)
    status: pending
  - id: website-index
    content: Create workflows/website-index.md post tracking index (Sunday afternoon)
    status: pending
isProject: false
---

# Weekend Launch Skills & Repo Readiness Audit

## Current Repo Snapshot

- **33 Cursor skills** in `.cursor/skills/`, 1 in `.claude/skills/`, 4 tiered skill directories in root `skills/`
- **~783 files / ~324 directories** (a chunk of this is the xlsx skill's schema tree)
- **16 MCP servers** configured in `~/.cursor/mcp.json`
- **No website directory** exists yet -- entirely planning stage
- **No deploy tooling** -- no `vercel.json`, `package.json`, `wrangler.toml`

---

## Part 1: Skills REQUIRED for Weekend Launch

These are the things that directly support the Saturday build + Sunday ship plan.

### 1A. Vercel MCP (Priority: HIGH -- add Friday evening)

The [launch plan](website_weekend_launch_d1ec0310.plan.md) explicitly calls for "Add Vercel MCP to `.cursor/mcp.json`." This is the one new MCP you actually need. It lets you:

- Trigger deploys from Cursor
- Check deploy status
- Manage environment variables
- Connect the custom domain

**Action**: Use `/addmcp vercel` to install it Friday evening alongside domain purchase + DNS setup.

### 1B. Two New Content Skills (Priority: MEDIUM -- build Sunday afternoon)

The plan already scopes these for Sunday's "Repo Integration" block:

- `**.cursor/skills/website-post/SKILL.md**` -- draft blog posts for shawnos.ai (mirrors `/substackpost` pattern)
- `**.cursor/skills/final-website/SKILL.md**` -- finalize + deploy to website, syndicate to Substack (mirrors `/finalsubstack` pattern)

These are lightweight skills that follow your existing patterns. Build them Sunday when the blog engine is working.

### 1C. Platform Playbook (Priority: MEDIUM -- build Sunday)

- `**skills/tier-2-context-playbooks/website.md**` -- voice rules for long-form blog content on shawnos.ai
- `**workflows/website-index.md**` -- post tracking index (mirrors `substack-index.md`)

---

## Part 2: Answering the "Do We Need These?" Questions

### Cloudflare Deploy Skill/MCP -- NO

Cloudflare's role in your stack is **DNS + CDN only** (free tier). You are NOT hosting on Cloudflare Pages or Workers. The DNS setup is a one-time manual task in the Cloudflare dashboard (point nameservers, add A/CNAME records for Vercel). No skill or MCP needed for this -- it is 10 minutes of clicking in a web UI.

### Vercel Deploy Skill (separate from MCP) -- NOT THIS WEEKEND

The plan already lists this under "What Does NOT Ship This Weekend":

> External skills installation (vercel-deploy, nextjs-optimization, tailwind-css)

The Vercel MCP handles deploy management. A dedicated `/vercel-deploy` Cursor skill would be a convenience wrapper for common deploy patterns, but it is not needed for v1. The MCP is sufficient.

### Next.js Optimization / Tailwind CSS Skills -- NOT THIS WEEKEND

Same category -- nice-to-have skills that codify patterns, but Cursor already has strong Next.js + Tailwind knowledge built in. These would only matter if you wanted to encode your specific patterns (terminal design tokens, your MDX pipeline config) into repeatable skills. That is Phase 2 work.

---

## Part 3: Skills Worth Adding That Do Not Touch IP

These are "side-off" skills that enhance the repo without exposing partner data or proprietary workflows. Organized by whether they belong in the main repo or a side repo.

### Keep in Main Repo (directly support the OS)


| Skill                           | Why                                        | Effort        |
| ------------------------------- | ------------------------------------------ | ------------- |
| Website Post (`/websitepost`)   | Already planned, mirrors existing patterns | Low -- Sunday |
| Final Website (`/finalwebsite`) | Already planned, mirrors `/finalsubstack`  | Low -- Sunday |
| Vercel MCP                      | Required for deploy workflow               | Low -- Friday |


### Could Go in a Side Repo (generic utilities, not OS-specific)


| Skill Idea         | What It Does                                                           | Why Side Repo                                |
| ------------------ | ---------------------------------------------------------------------- | -------------------------------------------- |
| OG Image Generator | Generates Open Graph images using Pillow (reuse aios-image patterns)   | Generic utility, not brand-specific          |
| SEO Audit          | Runs Lighthouse/CWV checks, outputs report                             | Generic web skill                            |
| Markdown Linter    | Validates frontmatter, checks broken links in content dirs             | Generic content utility                      |
| RSS Feed Generator | Generates RSS XML from markdown content folders                        | Generic utility                              |
| Screenshot-to-Post | Takes a screenshot and generates a blog post (extension of play-draft) | Already partially covered by existing skills |


**Honest take**: None of these are urgent. The main repo skills (`/websitepost`, `/finalwebsite`) are what matter for the weekend. The side-repo ideas are "nice to build someday" and would not meaningfully accelerate the launch.

---

## Part 4: Is the Repo Overloaded?

**Short answer: No.** 783 files is well within healthy range for a monorepo. For context:

- Git handles repos with tens of thousands of files without issue
- Your `.gitignore` already excludes `clients/`, `data/`, `scripts/`, `partners/` -- the sensitive/heavy stuff
- The xlsx skill's schema directory accounts for a disproportionate chunk of the file count
- Cursor loads skills on-demand, not all at once -- 33 skills does not slow anything down

### What to Watch

- **MCP count** (16 servers) is more likely to cause startup lag than file count. Each MCP spawns a process. If Cursor starts feeling slow on launch, audit which MCPs you actually use weekly.
- **Plan files** (59 `.plan.md` files in `~/.cursor/plans/`) are harmless but could be cleaned up -- old/completed plans can be archived or deleted.
- **Content growth** is fine because it is flat files. You could have 1,000 markdown posts and git would not care.

---

## Part 5: Recommended Weekend Execution Changes

Based on this audit, the launch plan is solid as-is. The only additions:

1. **Friday evening**: Purchase domains, set up Cloudflare DNS, install Vercel MCP (`/addmcp vercel`), create Vercel project
2. **Saturday**: Build as planned (scaffold, design system, blog engine, easter egg stubs)
3. **Sunday morning**: SEO + polish as planned
4. **Sunday afternoon**: Deploy live, then build the two new skills (`/websitepost`, `/finalwebsite`) + platform playbook + workflow index
5. **Skip**: Cloudflare deploy skill, vercel-deploy skill, nextjs-optimization skill, tailwind-css skill -- none needed for v1

The "technical" skills (Cloudflare deploy, Vercel deploy) are not needed because:

- Cloudflare = DNS config (one-time manual)
- Vercel = MCP handles it + auto-deploys on git push
- Next.js/Tailwind = Cursor already knows these frameworks natively

---

## Side Repo Decision

If you want to start a utility skills repo (e.g., `shawn-cursor-skills`), the candidates would be:

- `xlsx` (heaviest skill, generic utility)
- `content-images` (generic Pillow utility)
- `aios-image` (could be generalized)
- Future: OG image gen, SEO audit, markdown linter

But this is a **post-launch optimization**, not a weekend priority. The repo is healthy as-is.
---
name: Website Launch Plan
overview: Build a minimalist terminal-aesthetic personal brand website on Next.js + Vercel, mirroring the AI/os Pillow design system, with POSSE blog syndication to Substack and full integration into the repo as its own platform entity alongside LinkedIn, X, Reddit, and Substack.
todos:
  - id: domain-register
    content: Research and register domain(s) via Cloudflare Registrar (osailabs.ai + optionally shawntenam.ai)
    status: pending
  - id: vercel-setup
    content: Create Vercel account/project, add Vercel MCP to .cursor/mcp.json, connect GitHub repo
    status: pending
  - id: nextjs-scaffold
    content: Scaffold Next.js 15 project in website/ directory with App Router, Tailwind, terminal design system (exact Pillow palette)
    status: pending
  - id: blog-engine
    content: "Build markdown blog engine: reads from content/website/final/, SSG pages, MDX support, SEO metadata"
    status: pending
  - id: terminal-design
    content: "Implement terminal chrome UI: traffic light dots, AI/os branding, dark panels, green accents, scanlines, monospace font"
    status: pending
  - id: platform-playbook
    content: Create skills/tier-2-context-playbooks/website.md platform playbook following the same pattern as substack.md and linkedin.md
    status: pending
  - id: website-skills
    content: Create /websitepost and /finalwebsite Cursor skills for drafting and finalizing blog posts with POSSE syndication to Substack
    status: pending
  - id: external-skills
    content: Install vercel-deploy, nextjs-optimization, and tailwind-css skills from SkillsMP/agent-skills repos
    status: pending
  - id: seo-config
    content: Configure sitemap, RSS feed, structured data (JSON-LD), robots.txt, OG image generation, canonical URLs
    status: pending
  - id: website-index
    content: Create workflows/website-index.md post index and content/website/ folder structure (drafts, final, images)
    status: pending
isProject: false
---

# Personal Brand Website: AI/os Terminal-Aesthetic Blog on Vercel

## The Vision

A minimalist, dark, terminal-aesthetic personal website that matches the Pillow-generated branding (near-black canvas, green accent, Menlo monospace) already established across LinkedIn, X, and Substack content. The site is the canonical home for blog content, with POSSE syndication to Substack. It positions Shawn Tenam as the go-to builder in the AI agent / bespoke operating system space.

The Xavier Caffrey workflow from the screenshot is the target: slash command turns content into a blog post, pushes to GitHub, Vercel auto-deploys, SEO/GEO ranking improves automatically.

---

## Phase 1: Domain and Infrastructure

### Domain Name Options (brainstorm)

Strong candidates that combine personal identity + OS/AI brand:

- **osailabs.ai** -- matches the newsletter brand "OS.AI Labs" exactly, clean, memorable
- **shawnaios.ai** -- personal name + AIOS, but harder to spell/say
- **shawn-os.ai** -- hybrid, cleaner than above
- **shawntenam.ai** -- pure personal brand, future-proof if brand name changes
- **thegtmealchemist.ai** -- too long but captures the identity
- **gtme-os.ai** -- matches the repo name, technical audience would get it

**Recommendation**: Register **osailabs.ai** as the primary (matches Substack brand) AND **shawntenam.ai** as a redirect (personal brand insurance). Both through **Cloudflare Registrar** (at-cost pricing, no markup, includes DNSSEC + privacy).

**.ai domain pricing**: ~$80-100/year per domain through Cloudflare (registry cost, no markup).

### Hosting Stack


| Layer     | Choice                                           | Cost             | Why                                                                                        |
| --------- | ------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------ |
| Hosting   | **Vercel Pro**                                   | $20/mo           | Auto-deploy from GitHub, global CDN, analytics, custom domain, MCP integration with Cursor |
| DNS + CDN | **Cloudflare**                                   | Free tier        | Domain registrar + DNS + DDoS protection + edge caching                                    |
| Domain(s) | Cloudflare Registrar                             | ~$80-100/yr each | At-cost .ai domains                                                                        |
| CMS       | **Markdown files in the repo**                   | $0               | Content lives in `content/website/` -- same pattern as all other platforms                 |
| Analytics | **Vercel Analytics** + **Vercel Speed Insights** | Included in Pro  | Core Web Vitals, page views, SEO performance                                               |


**Total estimated cost**: ~$40-45/month all-in (Vercel Pro + 2 domains amortized).

No Squarespace needed. The entire site lives in the repo, deploys via `git push`, and is managed through Cursor skills. This is the builder brand -- the website should be built, not drag-and-dropped.

---

## Phase 2: Technical Architecture

### Framework: Next.js 15 + App Router + MDX

```
shawn-gtme-os/
├── website/                          # NEW -- Next.js project root
│   ├── app/
│   │   ├── layout.tsx                # Root layout (terminal chrome, nav)
│   │   ├── page.tsx                  # Landing / hero page
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog index (all posts)
│   │   │   └── [slug]/page.tsx       # Individual post (SSG from markdown)
│   │   ├── about/page.tsx            # About / identity page
│   │   └── lab/page.tsx              # OS.AI Labs portal (links to Substack)
│   ├── components/
│   │   ├── TerminalChrome.tsx        # Top bar with dots + AI/os branding
│   │   ├── PostCard.tsx              # Blog post preview card (panel style)
│   │   ├── Footer.tsx                # "built with Cursor + Claude Code"
│   │   └── Navigation.tsx            # Minimal nav (monospace, green accents)
│   ├── lib/
│   │   ├── posts.ts                  # Read markdown from content/website/
│   │   └── markdownToHtml.ts         # remark + rehype pipeline
│   ├── styles/
│   │   └── globals.css               # Tailwind + terminal design tokens
│   ├── public/                       # Static assets (OG images, favicon)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
├── content/
│   ├── website/                      # NEW -- canonical blog content
│   │   ├── drafts/                   # Markdown drafts (same pattern as other platforms)
│   │   └── final/                    # Published posts (SSG reads from here)
│   ├── linkedin/
│   ├── x/
│   ├── substack/
│   └── reddit/
```

### Design System (CSS/Tailwind mapping of the Pillow palette)

Directly translating the existing `aios-image` color palette into Tailwind CSS custom tokens:

```css
/* Terminal design tokens -- exact match to Pillow brand */
:root {
  --bg: rgb(12, 13, 17);           /* near-black canvas */
  --panel: rgb(22, 24, 30);        /* dark panel fill */
  --border: rgb(40, 44, 54);       /* subtle panel outline */
  --green: rgb(78, 195, 115);      /* primary accent */
  --txt: rgb(185, 195, 210);       /* body text */
  --bright: rgb(230, 236, 245);    /* titles, emphasis */
  --muted: rgb(100, 110, 128);     /* annotations, secondary */
  --amber: rgb(210, 165, 60);      /* warnings */
  --cyan: rgb(80, 190, 210);       /* info, links */
}
```

Font: **JetBrains Mono** (open-source monospace, closest to Menlo for web) via `next/font/google`, with Menlo as fallback.

### Key Design Elements

- **Terminal window chrome** on every page (traffic light dots + AI/os branding in header)
- **Dark panels with rounded corners** for content cards (matching Pillow panels)
- **Green accent** on links, active nav, code blocks
- **Scanline texture** (subtle CSS overlay, matching the Pillow CRT effect)
- **Boot sequence** loading animation on first visit
- **No gradients, no glow, no decorative elements** -- every element conveys information
- **Footer**: `built with Cursor + Claude Code // shawn ⚡ the gtme alchemist`

---

## Phase 3: Blog Syndication (POSSE Strategy)

The website is the **canonical source**. Substack is a **syndication channel**.

### Flow

```
content/website/final/{slug}.md  (canonical)
        │
        ├──> Next.js SSG reads it → deployed to osailabs.ai/blog/{slug}
        │
        ├──> /finalwebsite skill pushes to Substack via MCP (reformatted)
        │
        └──> Cross-promo drafts generated for LinkedIn + X (same as /finalsubstack)
```

### How Substack Syndication Works

Substack has no write API. But you already have the **Substack MCP** (`create_draft_post`) working. The flow stays the same:

1. Write the post as markdown in `content/website/drafts/`
2. Finalize with a new `/finalwebsite` skill (voice normalization + save to `content/website/final/`)
3. The skill also calls `create_draft_post` on the Substack MCP to push a copy as a Substack draft
4. You review/publish on Substack manually (add images, hit publish)
5. The canonical version on osailabs.ai is auto-deployed via `git push`

**SEO benefit**: Google indexes osailabs.ai as canonical. Substack version has `rel=canonical` pointing back to osailabs.ai. Both rank, but osailabs.ai gets the primary SEO juice.

### Vercel Auto-Deploy Pipeline (Xavier Caffrey pattern)

1. Content written/finalized in Cursor via slash command
2. `git add` + `git commit` + `git push` to GitHub
3. Vercel detects push, auto-builds, auto-deploys
4. Live on osailabs.ai in ~30 seconds
5. Substack copy pushed separately via MCP

---

## Phase 4: Repo Integration -- Website as a First-Class Platform

Just like LinkedIn, X, Reddit, and Substack each have their own:

- Content folder (`content/{platform}/`)
- Platform playbook (`skills/tier-2-context-playbooks/{platform}.md`)
- Cursor skills (drafting, finalizing, publishing)
- Workflows index

The website gets the same treatment:

### New Files to Create


| File                                               | Purpose                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| `content/website/drafts/`                          | Blog post markdown drafts                                            |
| `content/website/final/`                           | Published/finalized posts (Next.js reads from here)                  |
| `content/website/images/`                          | OG images, post images                                               |
| `skills/tier-2-context-playbooks/website.md`       | Platform playbook (tone, structure, SEO rules)                       |
| `workflows/website-index.md`                       | Post index (same pattern as `workflows/substack-index.md`)           |
| `.cursor/skills/website-post/SKILL.md`             | Draft blog posts (like `/substackpost`)                              |
| `.cursor/skills/final-website/SKILL.md`            | Finalize + deploy + syndicate to Substack (like `/finalsubstack`)    |
| `.cursor/skills/website-build/SKILL.md`            | Next.js dev/build/deploy commands, component scaffolding, Vercel MCP |
| `skills/tier-3-content-ops/pillars/website-seo.md` | SEO pillar strategy (keywords, meta, backlinks)                      |


### External Skills to Install (from SkillsMP / agent-skills repos)


| Skill                   | Source                             | Purpose                                                          |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| **vercel-deploy**       | `vercel-labs/agent-skills`         | Deploy to Vercel from Cursor/Claude Code without leaving the IDE |
| **nextjs-optimization** | `Atman36/AI-Vibe-Prompts`          | Core Web Vitals, performance, SSG best practices                 |
| **tailwind-css**        | `manutej/luxor-claude-marketplace` | Tailwind utility reference, responsive patterns, dark mode       |


These install into `.claude/skills/` (for Claude Code) or `.cursor/skills/` and complement the custom skills above.

### Vercel MCP Setup

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "vercel": {
      "url": "https://mcp.vercel.com"
    }
  }
}
```

This gives Cursor direct access to Vercel project management, deployment logs, and deployment inspection -- no terminal switching needed.

---

## Phase 5: SEO Strategy

### Target Keywords

- "AI operating system builder"
- "bespoke AI agents"
- "custom agentic systems"
- "GTM engineer"
- "Cursor AI skills"
- "personal AI operating system"
- "build your own AI OS"

### Technical SEO (built into the Next.js site)

- `generateMetadata()` on every page (title, description, OG image, Twitter card)
- Sitemap generation (`next-sitemap`)
- Blog RSS feed at `/feed.xml` (other platforms can pull from this)
- `robots.txt` allowing full crawl
- Structured data (JSON-LD for articles, person, organization)
- Canonical URLs on all pages
- Fast load times (SSG, no client-side rendering for blog content)

### Content SEO (built into the skills)

- Every blog post gets a meta description, OG image, and target keyword
- The `/website-post` skill enforces SEO metadata in frontmatter
- Cross-linking between blog posts (internal linking strategy)
- Backlinks from Substack, LinkedIn, Reddit posts pointing to osailabs.ai

---

## Estimated Timeline


| Phase     | Work                                                                          | Time                      |
| --------- | ----------------------------------------------------------------------------- | ------------------------- |
| Phase 1   | Register domains, set up Cloudflare, create Vercel account + project          | 1 session (~1 hour)       |
| Phase 2   | Scaffold Next.js project, implement terminal design system, build blog engine | 2-3 sessions              |
| Phase 3   | Wire up POSSE syndication (website -> Substack), build `/finalwebsite` skill  | 1 session                 |
| Phase 4   | Create all repo integration files (playbook, index, skills, pillar)           | 1 session                 |
| Phase 5   | SEO config, sitemap, structured data, OG image generation                     | 1 session                 |
| **Total** |                                                                               | **~6-8 focused sessions** |


---

## Cost Summary


| Item                                    | Cost        |
| --------------------------------------- | ----------- |
| osailabs.ai domain (annual)             | ~$80-100/yr |
| shawntenam.ai domain (annual, optional) | ~$80-100/yr |
| Vercel Pro                              | $20/mo      |
| Cloudflare (DNS/CDN)                    | Free        |
| **Year 1 total**                        | ~$400-440   |


---

## What NOT to Do

- **Do not use Squarespace** -- kills the builder brand, can't integrate with repo/skills
- **Do not build a complex CMS** -- markdown files in the repo ARE the CMS
- **Do not try to automate Substack publishing fully** -- no write API exists; MCP creates drafts, you review and publish
- **Do not over-design v1** -- ship the terminal aesthetic with blog functionality first, iterate from there


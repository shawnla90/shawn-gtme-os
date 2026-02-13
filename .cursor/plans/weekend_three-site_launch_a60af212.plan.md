---
name: Weekend Three-Site Launch
overview: "Unified weekend execution plan: purchase thegtmos.ai + thecontentos.ai, scaffold all three sites as a Turborepo monorepo, build shawnos.ai to production-ready, deploy placeholders for the other two, and embed the recursive awareness DNA into the voice system so all future content feeds toward the blogs."
todos:
  - id: buy-gtmos-domain
    content: Purchase thegtmos.ai on Cloudflare Registrar + configure DNS (A record 76.76.21.21 + CNAME www -> cname.vercel-dns.com, DNS only mode)
    status: pending
  - id: buy-contentos-domain
    content: Purchase thecontentos.ai on Cloudflare Registrar + configure DNS (same A record + CNAME pattern)
    status: pending
  - id: create-vercel-projects
    content: Create 3 Vercel projects (shawnos, thegtmos, thecontentos) all pointing to same GitHub repo with different rootDirectory values (website/apps/shawnos, website/apps/gtmos, website/apps/contentos)
    status: pending
  - id: scaffold-turborepo
    content: Scaffold Turborepo monorepo in website/ with root package.json (workspaces), turbo.json, packages/shared/, apps/shawnos/, apps/gtmos/, apps/contentos/
    status: pending
  - id: shared-design-system
    content: "Build packages/shared/: TerminalChrome, Navigation, Footer, NetworkBanner, PostCard components + tokens.css (Pillow palette) + lib/posts.ts + lib/markdown.ts"
    status: pending
  - id: shawnos-tailwind-font
    content: "Configure apps/shawnos/ Tailwind with shared tokens + JetBrains Mono via next/font/google + --accent: green override"
    status: pending
  - id: shawnos-layout
    content: "Build shawnos.ai root layout: TerminalChrome > Navigation > children > NetworkBanner > Footer"
    status: pending
  - id: shawnos-blog-engine
    content: Wire shared blog engine to read from content/website/final/ -- install gray-matter, unified, remark-parse, remark-gfm, remark-rehype, rehype-stringify, rehype-highlight, rehype-slug
    status: pending
  - id: shawnos-blog-pages
    content: Create blog index page (app/blog/page.tsx), post page (app/blog/[slug]/page.tsx) with SSG + generateStaticParams, PostCard component
    status: pending
  - id: shawnos-landing-about
    content: Build landing page (hero + latest posts + boot aesthetic) and about page (SDR-to-GTME arc, tool stack)
    status: pending
  - id: shawnos-seo
    content: "Full SEO: next-sitemap, RSS feed route handler, JSON-LD (Person + WebSite + Article with sameAs for sister sites), OG image generation, canonical URLs, full meta tags"
    status: pending
  - id: placeholder-gtmos
    content: "Build minimal gtmos app: layout.tsx + page.tsx (coming soon page with amber accent, terminal chrome, link to shawnos.ai, NetworkBanner)"
    status: pending
  - id: placeholder-contentos
    content: "Build minimal contentos app: layout.tsx + page.tsx (coming soon page with cyan accent, terminal chrome, link to shawnos.ai, NetworkBanner)"
    status: pending
  - id: content-folders
    content: Create content/website/ (drafts + final), content/gtmos/ (drafts + final), content/contentos/ (drafts + final) with README.md in each
    status: pending
  - id: test-post
    content: "Write hello-world.md test post in content/website/final/ -- verify full pipeline: markdown -> SSG -> rendered page"
    status: pending
  - id: deploy-all-three
    content: "Git commit + push, verify all three sites deploy: shawnos.ai (full site), thegtmos.ai (placeholder), thecontentos.ai (placeholder). Check SEO endpoints."
    status: pending
  - id: wire-related-projects
    content: Add relatedProjects to each app's vercel.json with the other two project IDs. Install @vercel/related-projects in shared package.
    status: pending
  - id: dna-core-voice
    content: Add 'Recursive awareness' to Voice Characteristics in core-voice.md -- the loop principle, the three-site network as the pattern made visible
    status: pending
  - id: dna-recursive-loop-doc
    content: Create skills/tier-3-content-ops/recursive-loop.md -- names the concept, documents 1-to-3 split framework, cross-reference patterns, blog-first funnel direction
    status: pending
  - id: update-linkedin-playbook
    content: Update linkedin.md CTAs to point to blog posts as primary destination (not just Substack)
    status: pending
  - id: update-x-playbook
    content: Update x-twitter.md thread endings to link to relevant blog domain
    status: pending
  - id: update-newsletter-growth
    content: Update newsletter-growth.md funnel to include blogs as middle layer between social and Substack
    status: pending
  - id: update-reddit-playbook
    content: Update reddit-growth-seo.md profile links to point to the relevant blog, add blog layer to reverse-funnel strategy
    status: pending
  - id: website-post-skill
    content: Create .cursor/skills/website-post/SKILL.md (/websitepost command) mirroring substackpost pattern
    status: pending
  - id: final-website-skill
    content: Create .cursor/skills/final-website/SKILL.md (/finalwebsite command) mirroring finalsubstack pattern
    status: pending
  - id: workflow-indexes
    content: Create workflows/website-index.md + workflows/gtmos-index.md (stub) + workflows/contentos-index.md (stub)
    status: pending
  - id: playbook-stubs
    content: Create skills/tier-2-context-playbooks/website.md + gtmos.md (stub) + contentos.md (stub)
    status: pending
isProject: false
---

# Weekend Build: Three-Site Network Launch

This replaces the previous `website_build_and_launch` plan. Same shawnos.ai build, restructured as a Turborepo monorepo with the other two domains purchased, deployed as placeholders, and the recursive awareness DNA baked into the voice system.

## What Ships This Weekend

- shawnos.ai live and production-ready (full blog, SEO, terminal aesthetic)
- thegtmos.ai purchased, DNS configured, deployed as "coming soon" placeholder on Vercel
- thecontentos.ai purchased, DNS configured, deployed as "coming soon" placeholder on Vercel
- All three share a design system from day one (no future refactor needed)
- Recursive awareness principle added to [core-voice.md](skills/tier-1-voice-dna/core-voice.md)
- New content ops doc codifying the three-site loop and blog-first funnel
- Content folders created for all three sites
- Vercel `relatedProjects` wired between all three projects

## Execution Sequence

### Block 1: Domains + Infrastructure (Saturday Morning, ~1 hour)

**Purchase domains on Cloudflare Registrar** (same flow as existing [domain_purchase_dns_setup plan](domain_purchase_dns_setup_d819a0bc.plan.md)):

- Buy `thegtmos.ai` on domains.cloudflare.com
- Buy `thecontentos.ai` on domains.cloudflare.com
- Optional: grab `.com` variants as redirect insurance

**Configure DNS for both new domains** (DNS only mode, grey cloud):

- A record: `@` -> `76.76.21.21`
- CNAME: `www` -> `cname.vercel-dns.com`

**Create Vercel projects** (via dashboard or MCP):

- Project `shawnos` -- rootDirectory: `website/apps/shawnos`
- Project `thegtmos` -- rootDirectory: `website/apps/gtmos`
- Project `thecontentos` -- rootDirectory: `website/apps/contentos`
- All three pointing to the same GitHub repo (`shawn-gtme-os`)
- Add custom domains to each project in Vercel dashboard

---

### Block 2: Turborepo Scaffold + Shared Design System (Saturday Morning, ~1.5 hours)

Scaffold the monorepo structure at repo root. This is the architectural change from the old plan -- instead of a flat `website/` with one Next.js app, it's a Turborepo workspace.

**Target structure:**

```
website/
  package.json              (workspace root, turbo dependency)
  turbo.json                (build pipeline config)
  packages/
    shared/
      package.json
      components/
        TerminalChrome.tsx
        Navigation.tsx
        NetworkBanner.tsx    (cross-site nav linking all 3 domains)
        Footer.tsx
        PostCard.tsx
      lib/
        posts.ts             (shared markdown blog engine)
        markdown.ts          (remark/rehype pipeline)
        related.ts           (cross-site URL resolver via @vercel/related-projects)
      styles/
        tokens.css           (Pillow palette as CSS variables)
  apps/
    shawnos/                 (FULL BUILD this weekend)
      package.json
      next.config.ts
      vercel.json            (relatedProjects: [gtmos_id, contentos_id])
      app/
        layout.tsx
        page.tsx             (landing)
        blog/
          page.tsx           (blog index)
          [slug]/page.tsx    (post page, SSG)
        about/page.tsx
        feed.xml/route.ts    (RSS)
        og/route.tsx         (OG image generation)
      tailwind.config.ts     (extends shared tokens, --accent: green)
    gtmos/                   (PLACEHOLDER this weekend)
      package.json
      next.config.ts
      vercel.json            (relatedProjects: [shawnos_id, contentos_id])
      app/
        layout.tsx
        page.tsx             (coming soon page)
      tailwind.config.ts     (extends shared tokens, --accent: amber)
    contentos/               (PLACEHOLDER this weekend)
      package.json
      next.config.ts
      vercel.json            (relatedProjects: [shawnos_id, gtmos_id])
      app/
        layout.tsx
        page.tsx             (coming soon page)
      tailwind.config.ts     (extends shared tokens, --accent: cyan)
```

**Turborepo setup specifics:**

- Root `package.json` with `"workspaces": ["apps/*", "packages/*"]`
- `turbo.json` with build pipeline and `dependsOn: ["^build"]`
- Shared package exports components and lib via package.json `exports` field
- Each app imports from `@shawnos/shared` (internal package name)

**Shared design system** (`packages/shared/`):

The Pillow palette from the existing plan becomes CSS variables in `tokens.css`. Each app overrides `--accent`:

- shawnos: `--accent: rgb(78, 195, 115)` (green)
- gtmos: `--accent: rgb(210, 165, 60)` (amber)
- contentos: `--accent: rgb(80, 190, 210)` (cyan)

Shared components use `var(--accent)` everywhere, so the same component renders with the right brand color per site.

**NetworkBanner component** -- the cross-site linker:

A subtle component (footer or top bar) present on every page of every site. Shows the three domain names with the current site highlighted. Uses `@vercel/related-projects` to resolve correct URLs in both preview and production.

---

### Block 3: Build shawnos.ai to Production (Saturday Midday-Afternoon, ~4 hours)

This is the same build from the old plan, now living inside `apps/shawnos/` and importing shared components. Steps unchanged:

1. **Terminal design in Tailwind** -- configure `tailwind.config.ts` extending shared tokens, JetBrains Mono via `next/font/google`
2. **Root layout** -- compose TerminalChrome > Navigation > children > NetworkBanner > Footer
3. **Blog engine** -- `packages/shared/lib/posts.ts` reads from `content/website/final/` (path resolves up from `website/apps/shawnos/` to repo root). Install `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`, `rehype-highlight`, `rehype-slug`
4. **Blog pages** -- `app/blog/page.tsx` (index), `app/blog/[slug]/page.tsx` (SSG), `PostCard.tsx`
5. **Landing page** -- boot sequence aesthetic, hero, latest 3 posts, links to /blog and /about
6. **About page** -- identity from core-voice.md, SDR-to-GTME arc, tool stack

---

### Block 4: SEO + Placeholders for gtmos/contentos (Saturday Afternoon, ~2 hours)

**Full SEO for shawnos.ai** (same as old plan Step 7):

- `next-sitemap` for sitemap.xml + robots.txt
- RSS feed at `/feed.xml` via route handler
- JSON-LD structured data (Person + WebSite + Article schemas). **New**: include `sameAs` referencing thegtmos.ai and thecontentos.ai
- OG image generation via `next/og`
- Canonical URLs, full meta tags
- `generateMetadata()` on every page

**Placeholder pages for gtmos and contentos:**

Minimal Next.js apps (2 files each: `layout.tsx` + `page.tsx`) that render a "coming soon" page using the shared terminal design with their respective accent color. Content:

- The domain name in the terminal chrome header
- A brief tagline: "the gtm operating system. launching soon." / "the content operating system. launching soon."
- Link back to shawnos.ai: "in the meantime, follow the build at shawnos.ai"
- Same JetBrains Mono, dark canvas, NetworkBanner component

These are literally 2-file apps. Minimal effort, but they're deployed and live on their domains.

---

### Block 5: Content Folders + Test Post + Deploy (Saturday Evening, ~1.5 hours)

**Create all content folders:**

```
content/
  website/               (shawnos.ai content)
    drafts/
    final/
    README.md
  gtmos/                 (thegtmos.ai content -- empty for now)
    drafts/
    final/
    README.md
  contentos/             (thecontentos.ai content -- empty for now)
    drafts/
    final/
    README.md
```

**Seed shawnos.ai with test post** at `content/website/final/hello-world.md` -- verify the full pipeline (markdown -> SSG -> rendered page).

**Deploy all three:**

- `git add`, commit, push to trigger Vercel auto-deploy for all three projects
- Verify shawnos.ai is live with full blog, SEO endpoints (sitemap, RSS, OG)
- Verify thegtmos.ai shows the "coming soon" placeholder
- Verify thecontentos.ai shows the "coming soon" placeholder
- Verify NetworkBanner links work across all three

---

### Block 6: Recursive Awareness DNA (Saturday Evening or Sunday, ~1.5 hours)

This is the voice system update. Three files to create/edit:

**1. Add to [core-voice.md**](skills/tier-1-voice-dna/core-voice.md) -- new entry in Voice Characteristics section (after "Pattern articulation"):

```markdown
- **Recursive awareness**: You see the loop. The system you build becomes the content.
  The content documents the system. The documentation IS the system. Every post is both
  a deliverable and a seed for the next one across three domains. When you name this
  pattern in public, it signals a different level of intentionality. This isn't a gimmick --
  it's how the OS actually works. The three sites (shawnos.ai, thegtmos.ai, thecontentos.ai)
  are the recursive loop made visible.
```

Also add to the Priority Hierarchy (currently: Substance > Authenticity > Interesting > Polish), a note that "Interesting (pattern recognition, conviction)" now includes recursive self-reference as a signature pattern.

**2. New file: `skills/tier-3-content-ops/recursive-loop.md**` -- the operational doc:

- Names the concept and the three layers (story / system / meta)
- Documents the 1-to-3 split framework: one experience -> shawnos.ai version (personal story) + thegtmos.ai version (technical walkthrough) + thecontentos.ai version (content methodology meta)
- Defines cross-reference patterns: how each post naturally links to its siblings
- Defines the funnel direction: social (LinkedIn, X, Reddit) -> blogs (the three sites) -> Substack (deepest layer)

**3. Update funnel direction in existing playbooks:**

The current [newsletter-growth.md](skills/tier-3-content-ops/pillars/newsletter-growth.md) funnel is: `LinkedIn/X post -> Substack newsletter -> teases next social post`. The new funnel adds the blog layer:

```
Social (LinkedIn, X, Reddit) -- hooks, compressed insights, engagement
    |
    v
Blogs (shawnos.ai, thegtmos.ai, thecontentos.ai) -- full builds, SEO, canonical
    |
    v
Substack -- deepest layer, subscriber-only depth, series continuity
```

This means updating the CTA language in:

- [linkedin.md](skills/tier-2-context-playbooks/linkedin.md) -- CTAs now point to blog posts, not just Substack
- [x-twitter.md](skills/tier-2-context-playbooks/x-twitter.md) -- thread endings link to the relevant blog
- [newsletter-growth.md](skills/tier-3-content-ops/pillars/newsletter-growth.md) -- funnel diagram updated to include blogs as the middle layer
- [reddit-growth-seo.md](skills/tier-3-content-ops/pillars/reddit-growth-seo.md) -- profile links now point to the relevant blog, not just Substack

Each platform now has a clear purpose in the funnel:

- **LinkedIn**: Hook + authority building. CTAs send to the blog for the full breakdown.
- **X**: Fast-twitch engagement + reach. Thread endings link to blog posts.
- **Reddit**: SEO + niche community credibility. Profile links to the blogs. Posts tease deeper content on the sites.
- **Blogs (the three sites)**: The canonical home. Full posts with SEO, cross-links, and structured data. This is where Google indexes you.
- **Substack**: The deepest relationship layer. Subscriber-only expansions, series continuity, lead magnets.

---

### Block 7: Cursor Skills + Workflow Indexes (Sunday, ~2 hours)

**Create skills for shawnos.ai** (same as old plan Step 10):

- `.cursor/skills/website-post/SKILL.md` -- `/websitepost`
- `.cursor/skills/final-website/SKILL.md` -- `/finalwebsite`

**Create workflow indexes:**

- `workflows/website-index.md` (shawnos.ai post tracking)
- `workflows/gtmos-index.md` (thegtmos.ai -- empty for now, structure ready)
- `workflows/contentos-index.md` (thecontentos.ai -- empty for now, structure ready)

**Create platform playbook stubs:**

- `skills/tier-2-context-playbooks/website.md` (shawnos.ai voice/structure guide)
- `skills/tier-2-context-playbooks/gtmos.md` (stub -- filled out when site goes active)
- `skills/tier-2-context-playbooks/contentos.md` (stub -- filled out when site goes active)

Skills for thegtmos.ai and thecontentos.ai (`/gtmospost`, `/contentospost`, etc.) are NOT built this weekend -- those come when the full sites go active. The stubs and indexes are just placeholder structure so the system knows they exist.

---

## What This Weekend Does NOT Include

- Full builds of thegtmos.ai or thecontentos.ai (they're placeholders)
- `/gtmospost`, `/finalgtmos`, `/contentospost`, `/finalcontentos` skills (Phase 2)
- The `/recursiveloop` repurpose skill (needs all three sites active first)
- Boot sequence animations, easter eggs (Phase 2)
- Lead capture / email signup (Phase 2)
- "From the Network" RSS cross-feed component (Phase 2 -- needs posts on all three sites)

## Key Architecture Decision

By scaffolding as a Turborepo monorepo from day one, the shared design system (`@shawnos/shared`) is built ONCE and inherited by all three sites. When you're ready to build out thegtmos.ai and thecontentos.ai, it's just creating pages inside existing Next.js apps that already have the terminal aesthetic, NetworkBanner, blog engine, and SEO config available. No migration, no refactor. Just add content.

## Cost Impact (for tomorrow's purchases)

- `thegtmos.ai`: ~$60-70/year
- `thecontentos.ai`: ~$60-70/year
- No additional Vercel cost (Pro plan covers multiple projects)
- Total new spend: ~$120-140 for domains


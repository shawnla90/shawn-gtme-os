---
name: Three-Domain Network Strategy
overview: Purchase thegtmos.ai and thecontentos.ai, deploy all three sites (plus shawnos.ai) as a Turborepo monorepo on Vercel with shared design system and native cross-project linking via @vercel/related-projects.
todos:
  - id: ship-shawnos
    content: "Phase 0: Ship shawnos.ai first using existing website_build_and_launch plan (prerequisite for everything else)"
    status: pending
  - id: buy-domains
    content: Purchase thegtmos.ai and thecontentos.ai from Cloudflare Registrar, configure DNS (A record + CNAME) pointing to Vercel
    status: pending
  - id: turborepo-refactor
    content: Refactor website/ from single Next.js app to Turborepo monorepo with apps/shawnos, apps/gtmos, apps/contentos and packages/shared
    status: pending
  - id: vercel-projects
    content: Create 2 new Vercel projects (thegtmos, thecontentos) pointing to same GitHub repo with different rootDirectory values, wire up relatedProjects
    status: pending
  - id: shared-design
    content: Extract shared design system into packages/shared with accent color overrides per site (green/amber/cyan)
    status: pending
  - id: content-folders
    content: Create content/gtmos/ and content/contentos/ folder structures with drafts/ and final/ subdirectories
    status: pending
  - id: cross-linking
    content: Build NetworkBanner component and 'From the Network' RSS cross-feed section using @vercel/related-projects
    status: pending
  - id: skills-automation
    content: Create /gtmospost, /finalgtmos, /contentospost, /finalcontentos skills + platform playbooks + workflow indexes
    status: pending
  - id: repurpose-skill
    content: Build 1-to-3 repurpose workflow skill that generates all three site versions from one experience
    status: pending
isProject: false
---

# Three-Domain Network: shawnos.ai + thegtmos.ai + [thecontentos.ai](http://thecontentos.ai)

## The Three Sites and What Lives Where

**shawnos.ai** (already planned, domain purchased) -- The origin hub

- Content pillar: "Building and Sharing" -- personal journey, reflective storytelling, the human behind the builder
- Cursor origin story, personal breakthroughs, meta-reflections
- The canonical "about me" -- all roads lead back here
- Existing plan: [website_build_and_launch_804674b5.plan.md](website_build_and_launch_804674b5.plan.md)

**thegtmos.ai** -- The GTM systems library

- Content pillars: "Plays Series" + "Skill/System Shares"
- MCP documentation, top 5 lists, skill file walkthroughs, Clay/HeyReach/Instantly workflows
- The plays series ("gtm plays i use every day") gets its own home here
- Lead magnets: MCP guides, security guides, playbook starters (already in `content/substack/lead-magnet/`)

**thecontentos.ai** -- The content creation methodology site

- How to build a content OS, voice systems, anti-slop frameworks, content pipelines
- "How I turn one screenshot into 5 posts" type content
- Platform playbook breakdowns (LinkedIn strategy, X micro-tips methodology, Substack growth)
- The content creation meta-content that currently lives in your "Building and Sharing" pillar but is more instructional than personal

## Why This Works (SEO + Authority Advantages)

- **Topical authority**: Google rewards sites that go deep on one topic. A site purely about GTM systems will rank higher for "MCP server setup guide" than a personal blog that also has GTM posts mixed with personal stories
- **Backlink network**: Three domains cross-linking to each other creates a legitimate link graph. Each site can reference the others contextually ("I built this system -- here's the personal story on shawnos.ai" or "Full GTM play breakdown at thegtmos.ai")
- **Content multiplication**: One experience becomes 3 posts. Build a new MCP skill -> personal reflection on shawnos.ai, technical walkthrough on thegtmos.ai, "how I turned this into content" on thecontentos.ai
- **Lead segmentation**: Different audiences land on different sites. GTM ops people find thegtmos.ai, content creators find thecontentos.ai, people curious about you find shawnos.ai

## Architecture: Turborepo Monorepo (Single Repo, Three Vercel Projects)

All three sites live in your existing `shawn-gtme-os` repo. Vercel natively supports this via monorepo configuration -- each site gets its own Vercel project pointing to a different root directory.

```
shawn-gtme-os/                    (existing repo root)
  website/                        (NEW - monorepo root)
    turbo.json                    (Turborepo config)
    package.json                  (workspace root)
    packages/
      shared/                     (shared design system)
        components/
          TerminalChrome.tsx
          Navigation.tsx
          Footer.tsx
          NetworkBanner.tsx       (cross-site links)
          PostCard.tsx
        styles/
          tokens.css              (Pillow palette)
        lib/
          posts.ts                (shared markdown engine)
          markdown.ts             (remark/rehype pipeline)
          related.ts              (cross-site URL resolver)
    apps/
      shawnos/                    (shawnos.ai - Next.js app)
        app/
        vercel.json               {"relatedProjects": ["prj_gtmos", "prj_contentos"]}
        next.config.ts
      gtmos/                      (thegtmos.ai - Next.js app)
        app/
        vercel.json               {"relatedProjects": ["prj_shawnos", "prj_contentos"]}
        next.config.ts
      contentos/                  (thecontentos.ai - Next.js app)
        app/
        vercel.json               {"relatedProjects": ["prj_shawnos", "prj_gtmos"]}
        next.config.ts
  content/                        (existing, extended)
    website/                      (shawnos.ai content - already planned)
      drafts/
      final/
    gtmos/                        (NEW - thegtmos.ai content)
      drafts/
      final/
    contentos/                    (NEW - thecontentos.ai content)
      drafts/
      final/
    linkedin/                     (existing, unchanged)
    x/                            (existing, unchanged)
    substack/                     (existing, unchanged)
```

## How They "Ping" Each Other (Vercel Related Projects)

Vercel has a first-party feature called **Related Projects** built for exactly this. In each site's `vercel.json`:

```json
{ "relatedProjects": ["prj_gtmos_id"] }
```

This injects the other project's URL as an environment variable at build time. The `@vercel/related-projects` npm package provides a typed helper:

```typescript
import { withRelatedProject } from '@vercel/related-projects';

const gtmosHost = withRelatedProject({
  projectName: 'thegtmos',
  defaultHost: 'thegtmos.ai',
});
// Returns the correct URL in preview deployments AND production
```

This means:

- In **production**: links resolve to `thegtmos.ai`, `thecontentos.ai`, `shawnos.ai`
- In **preview deploys**: links automatically resolve to the matching preview URL, so you can test the full network before shipping

### Cross-Link Surfaces

- **NetworkBanner component** (shared): A subtle top bar or footer section on every page: `[shawnos.ai] [thegtmos.ai] [thecontentos.ai]` -- signals these are connected properties
- **"From the Network" section** on each blog index: Pull latest 2-3 posts from the other two sites via their RSS feeds at build time
- **Contextual inline links** in blog posts: "I wrote about the personal journey of building this [on shawnos.ai](link)" or "Full technical breakdown [on thegtmos.ai](link)"
- **Schema.org `sameAs**`: All three sites reference each other plus your LinkedIn/X/Substack in structured data. Google treats them as a connected entity
- **Shared RSS**: Each site has its own feed, plus an optional combined `/network-feed.xml` that aggregates all three

## Content Pipeline Extension

Your existing skill system extends naturally. The pattern already works for LinkedIn, X, Substack -- each new site is just another "platform."

New skills to create:

- `/gtmospost` and `/finalgtmos` -- mirror `/substackpost` and `/finalsubstack`
- `/contentospost` and `/finalcontentos` -- same pattern
- Update `/finalcopy` to support `--site gtmos|contentos|shawnos` flag

New workflow indexes:

- `workflows/gtmos-index.md` (post tracking for thegtmos.ai)
- `workflows/contentos-index.md` (post tracking for thecontentos.ai)

New platform playbooks:

- `skills/tier-2-context-playbooks/gtmos.md`
- `skills/tier-2-context-playbooks/contentos.md`

### The 1-to-3 Repurpose Flow

```
One experience (e.g., built a new MCP skill)
    |
    +-> shawnos.ai: "I almost mass-deleted 500 leads by accident. 
    |   Here's what debugging at 2am taught me about building safety rails."
    |   (personal story, Building and Sharing pillar)
    |
    +-> thegtmos.ai: "MCP Safety Skill: 29 pre-push validation checks  
    |   for your GTM pipeline. Here's the full skill file and how to use it."
    |   (technical walkthrough, Skill System Shares pillar)
    |
    +-> thecontentos.ai: "How I turn one debugging session into 3 blog 
        posts across 3 domains. The content OS repurpose workflow."
        (meta-content about the process itself)
```

## Shared Design System with Distinct Identity

All three sites share the terminal aesthetic (Pillow palette, JetBrains Mono, dark canvas) but each has a distinct accent:

- **shawnos.ai**: Green accent (`rgb(78, 195, 115)`) -- the original, the "OS"
- **thegtmos.ai**: Amber accent (`rgb(210, 165, 60)`) -- warm, operational, pipeline energy
- **thecontentos.ai**: Cyan accent (`rgb(80, 190, 210)`) -- creative, content, flow

The shared `packages/shared/` provides the base components. Each app overrides the CSS variable `--accent` to get its own flavor while keeping the family resemblance.

## Domain Purchase and DNS

Same playbook as your existing [domain_purchase_dns_setup plan](domain_purchase_dns_setup_d819a0bc.plan.md):

- Purchase `thegtmos.ai` and `thecontentos.ai` from Cloudflare Registrar (at-cost pricing)
- Optionally grab `.com` variants as redirects
- DNS: A record `76.76.21.21` + CNAME `www` -> `cname.vercel-dns.com` (DNS only, no Cloudflare proxy)
- Each domain gets its own Vercel project, all pointing to the same GitHub repo but different `rootDirectory` values

### Cost Estimate

- `thegtmos.ai`: ~$60-70/year
- `thecontentos.ai`: ~$60-70/year
- `.com` variants (optional): ~$10-12/year each
- Vercel Pro (covers all 3 projects): $20/month ($240/year) -- one account covers multiple projects
- **Total additional cost**: ~$120-160/year for the two new domains

## Execution Phases

### Phase 0 (prerequisite): Ship shawnos.ai first

Your existing website build plan covers this. The three-site network builds ON TOP of a working first site. Get shawnos.ai live, verify the blog engine, deploy pipeline, and skills work -- then extend.

### Phase 1: Turborepo refactor + domain purchase

- Convert `website/` from a single Next.js app to the Turborepo monorepo structure above
- Extract shared components into `packages/shared/`
- Purchase the two new domains, configure DNS
- Create two new Vercel projects pointing to `website/apps/gtmos/` and `website/apps/contentos/`
- Wire up `relatedProjects` in each `vercel.json`

### Phase 2: Site scaffolding + content pipeline

- Scaffold `gtmos` and `contentos` Next.js apps using shared design system
- Create `content/gtmos/` and `content/contentos/` folder structures
- Create platform playbooks and workflow indexes
- Build the NetworkBanner and "From the Network" cross-feed components
- Seed each site with 2-3 posts

### Phase 3: Skills + automation

- Create `/gtmospost`, `/finalgtmos`, `/contentospost`, `/finalcontentos` skills
- Update `/finalcopy` to support multi-site targeting
- Build the 1-to-3 repurpose workflow skill (`/repurpose3` or similar)
- Cross-promo generation: when you publish on one site, auto-generate teasers for the other two

## Key Decisions to Make Later

- **Shared analytics**: One Vercel Analytics dashboard for all three, or separate? (Vercel Pro covers all)
- **Email/newsletter split**: Does each site get its own Substack, or does one Substack aggregate all three?
- **Lead magnets**: Which site hosts downloadable skill files and guides? (thegtmos.ai is the natural home)
- **Comments/community**: Do you add comments (Giscus/GitHub Discussions) to any of the sites?


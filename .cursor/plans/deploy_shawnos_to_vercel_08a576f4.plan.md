---
name: Deploy shawnos to Vercel
overview: Deploy the shawnos.ai app from the monorepo to Vercel with proper monorepo configuration, custom domain, taxonomy.yaml, and endpoint verification -- shawnos only, stress-test before gtmos/contentos.
todos:
  - id: taxonomy-yaml
    content: Create website/taxonomy.yaml with domain mapping, content types, status lifecycle, and routing rules
    status: pending
  - id: vercel-json
    content: Create website/apps/shawnos/vercel.json with framework, install, and build config
    status: pending
  - id: vercel-link-deploy
    content: Use Vercel CLI to link the shawnos app to the existing Vercel project and deploy to production
    status: pending
  - id: custom-domain
    content: Add shawnos.ai custom domain to the Vercel project
    status: pending
  - id: verify-endpoints
    content: Verify all routes, SEO endpoints (sitemap, RSS, OG, robots.txt), and blog content renders correctly
    status: pending
isProject: false
---

# Deploy shawnos.ai to Vercel (First Site Only)

## Problem

The Vercel project `shawnos-site` is connected to a **different GitHub repo** (`shawnla90/shawnos-site` -- a bare Create Next App). The actual shawnos app lives in the monorepo `shawnla90/shawn-gtme-os` at `website/apps/shawnos/`. We need to reconnect Vercel to the right repo and deploy the real app.

## Key Architecture Context

- **Monorepo**: `website/` is an npm workspace root with `apps/*` and `packages/*`
- **App location**: `website/apps/shawnos/` (Next.js 16, standalone output, Turbopack)
- **Shared package**: `@shawnos/shared` at `website/packages/shared/` (components, blog engine, tokens)
- **Content**: blog posts at `content/website/final/` (repo root level), accessed via `path.join(process.cwd(), '../../../content/website/final')`
- **SEO**: sitemap, robots.txt, RSS feed, OG images, JSON-LD, meta tags -- all already built
- **Domain**: `shawnos.ai` purchased, DNS pointed to Vercel

---

## Step 1: Create taxonomy.yaml

New file at [website/taxonomy.yaml](website/taxonomy.yaml) -- a simple config mapping domains, content types, and status lifecycles for multi-site routing. Skills/agents reference this when deciding where content goes.

```yaml
domains:
  shawnos:
    url: https://shawnos.ai
    label: "shawn/os"
    accent: "#00FF41"      # green (from tokens.css)
    focus: personal brand, build-in-public, GTM engineering
    status: active
  gtmos:
    url: https://thegtmos.ai
    label: "the gtm/os"
    accent: "#D2A53C"      # amber
    focus: GTM operations, partner playbooks, systems
    status: placeholder
  contentos:
    url: https://thecontentos.ai
    label: "the content/os"
    accent: "#9B72CF"      # purple
    focus: content methodology, voice systems, AI-assisted writing
    status: placeholder

content_types:
  - blog-post
  - newsletter
  - social-post
  - tiktok-script
  - case-study

status_lifecycle:
  - draft
  - review
  - final
  - published
  - archived

routing_rules:
  - "Personal stories, build-in-public, career → shawnos"
  - "GTM systems, partner ops, outbound playbooks → gtmos"
  - "Content strategy, voice DNA, AI writing methodology → contentos"
  - "Cross-domain posts get primary domain + cross-links to siblings"
```

## Step 2: Create vercel.json for shawnos

New file at [website/apps/shawnos/vercel.json](website/apps/shawnos/vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm install --workspace=@shawnos/web",
  "buildCommand": "npm run build"
}
```

Notes:

- `relatedProjects` will be added later when gtmos/contentos Vercel projects exist
- No `outputDirectory` needed -- Next.js standalone is auto-detected
- `installCommand` ensures the workspace installs all deps including `@shawnos/shared`

## Step 3: Reconfigure Vercel Project

The existing project needs its Git repo changed from `shawnla90/shawnos-site` to `shawnla90/shawn-gtme-os`. This requires either:

- **Option A (Vercel Dashboard)**: Project Settings -> Git -> disconnect current repo -> connect `shawn-gtme-os` -> set Root Directory to `website/apps/shawnos`
- **Option B (Vercel CLI)**: Run `npx vercel link` from `website/apps/shawnos/` to link the directory to the project, then `npx vercel --prod` to deploy

**I recommend Option B (CLI)** because:

1. We can do it from the terminal without leaving Cursor
2. It automatically handles the monorepo detection
3. We keep the existing project + domain config

CLI sequence:

```bash
cd website/apps/shawnos
npx vercel link          # link to existing project 'shawnos-site'
npx vercel --prod        # deploy to production
```

## Step 4: Add Custom Domain

After successful deployment, add `shawnos.ai` to the project via CLI or Vercel dashboard. Since DNS is already pointed, this should activate immediately.

```bash
npx vercel domains add shawnos.ai
```

## Step 5: Verify Endpoints

After deployment completes, verify:

- `/` -- homepage renders with hero, boot log, latest posts
- `/about` -- about page renders
- `/blog` -- blog index shows hello-world post
- `/blog/hello-world` -- individual post renders with Article JSON-LD
- `/feed.xml` -- RSS feed returns valid XML
- `/og` -- OG image generates (1200x630)
- `/sitemap.xml` + `/robots.txt` -- generated by next-sitemap postbuild
- NetworkBanner shows cross-links to thegtmos.ai and thecontentos.ai (those will 404 for now, which is expected)

---

## Content Path Risk

The blog engine reads from `path.join(process.cwd(), '../../../content/website/final')`. With Vercel's Root Directory = `website/apps/shawnos`, this resolves to `content/website/final` at the repo root. Vercel clones the full repo so this **should work**, but we verify in Step 5. If it fails, we add a `CONTENT_DIR` env var as fallback.

## What This Does NOT Include (deferred)

- gtmos placeholder deployment (after shawnos stress-test)
- contentos placeholder deployment (after shawnos stress-test)
- `relatedProjects` in vercel.json (needs gtmos/contentos project IDs)
- `@vercel/related-projects` package integration (after all 3 projects exist)


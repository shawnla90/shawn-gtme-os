---
name: ""
overview: ""
todos: []
isProject: false
---

# Build Shared Design Package (Todo 2)

## Context

This is Todo 2 of the Weekend Three-Site Launch plan. Todo 1 (Turborepo scaffold) is complete. The monorepo structure at `website/` is working:

- `website/package.json` -- workspace root with turbo v2.8.7, workspaces: `["apps/*", "packages/*"]`
- `website/turbo.json` -- build pipeline with `dependsOn: ["^build"]`, outputs for `.next/**` and `dist/**`
- `website/tsconfig.json` -- base TypeScript config (ES2017, bundler moduleResolution, JSX preserve)
- `website/.gitignore` -- covers node_modules, .next, .turbo, dist, out, *.tsbuildinfo, .vercel
- `website/apps/` -- empty (populated in Todos 3-5)
- `website/packages/` -- empty (this todo populates it)
- Turbo CLI verified working (`npx turbo --version` returns 2.8.7)

## What This Todo Builds

Create `website/packages/shared/` -- the internal package `@shawnos/shared` that all three site apps import.

### Target Structure

```
website/packages/shared/
  package.json
  tsconfig.json
  components/
    TerminalChrome.tsx
    Navigation.tsx
    NetworkBanner.tsx
    Footer.tsx
    PostCard.tsx
    index.ts              (barrel export)
  lib/
    posts.ts              (shared markdown blog engine)
    markdown.ts           (remark/rehype pipeline)
    related.ts            (cross-site URL resolver stub)
    index.ts              (barrel export)
  styles/
    tokens.css            (Pillow palette as CSS variables)
  index.ts                (root barrel export)
```

### 1. `package.json`

```json
{
  "name": "@shawnos/shared",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./components": "./components/index.ts",
    "./lib": "./lib/index.ts",
    "./styles": "./styles/tokens.css"
  },
  "dependencies": {
    "gray-matter": "latest",
    "unified": "latest",
    "remark-parse": "latest",
    "remark-gfm": "latest",
    "remark-rehype": "latest",
    "rehype-stringify": "latest",
    "rehype-highlight": "latest",
    "rehype-slug": "latest"
  },
  "devDependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@types/react": "^19",
    "typescript": "^5"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  }
}
```

### 2. `tsconfig.json`

Extends the root config:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["components", "lib", "index.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. `styles/tokens.css` -- The Pillow Palette as CSS Variables

This is the locked color system. DO NOT change these values:

```css
:root {
  /* === Canvas === */
  --canvas: #0D1117;
  --canvas-subtle: #161B22;
  --canvas-border: #30363D;

  /* === Text === */
  --text-primary: #C9D1D9;
  --text-secondary: #8B949E;
  --text-muted: #484F58;

  /* === shawnos.ai palette === */
  --shawnos-green: #4EC373;
  --shawnos-purple: #9B72CF;
  --shawnos-amber: #D2A53C;

  /* === thegtmos.ai palette === */
  --gtmos-teal: #3DBFA0;
  --gtmos-red: #E05555;

  /* === thecontentos.ai palette === */
  --contentos-purple: #9B72CF;
  --contentos-green: #4EC373;

  /* === Per-app accent (overridden by each app's tailwind/globals) === */
  --accent: #4EC373;  /* default to green -- the connective tissue */

  /* === Shared functional colors === */
  --link: var(--accent);
  --link-hover: color-mix(in srgb, var(--accent) 80%, white);
  --border: var(--canvas-border);
  --code-bg: var(--canvas-subtle);

  /* === Font === */
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}
```

### 4. Components

All components are React Server Components (no "use client" unless explicitly needed). They use `var(--accent)` and other CSS variables from `tokens.css` so they automatically adapt to each site's brand.

**TerminalChrome.tsx** -- wraps page content in a terminal window frame:

- Dark background (`var(--canvas)`)
- Top bar with three dots (red/yellow/green) and a title prop
- Border using `var(--border)`
- Children slot for page content
- Props: `title?: string`, `children: React.ReactNode`

**Navigation.tsx** -- site navigation:

- Logo/site name on left (uses `var(--accent)`)
- Nav links: Home, Blog, About
- Props: `siteName: string`, `links?: { href: string; label: string }[]`

**NetworkBanner.tsx** -- cross-site linker bar:

- Shows all three domain names: shawnos.ai | thegtmos.ai | thecontentos.ai
- Current site is highlighted with its accent color
- Other sites are dimmed (`var(--text-muted)`)
- Props: `currentSite: 'shawnos' | 'gtmos' | 'contentos'`
- Links use absolute URLs for now (production domains). Later upgraded to use `@vercel/related-projects`

**Footer.tsx** -- site footer:

- "built in public. powered by cursor." or similar
- Copyright
- Props: `siteName?: string`

**PostCard.tsx** -- blog post preview card for listing pages:

- Title, date, excerpt, read more link
- Uses `var(--accent)` for the title link color
- Props: `title: string`, `date: string`, `excerpt: string`, `slug: string`

### 5. Lib

**posts.ts** -- shared blog engine:

- `getPostSlugs(contentDir: string)` -- reads filesystem for .md files
- `getPostBySlug(slug: string, contentDir: string)` -- reads markdown, parses frontmatter with gray-matter, returns `{ slug, title, date, excerpt, content }`
- `getAllPosts(contentDir: string)` -- returns all posts sorted by date descending
- Content dir is passed as a param so each app can point to its own content folder

**markdown.ts** -- remark/rehype pipeline:

- `markdownToHtml(markdown: string): Promise<string>` -- unified pipeline with remark-parse, remark-gfm, remark-rehype, rehype-highlight, rehype-slug, rehype-stringify
- Returns rendered HTML string

**related.ts** -- cross-site URL resolver (stub for now):

- `getSiteUrl(site: 'shawnos' | 'gtmos' | 'contentos'): string`
- For now returns hardcoded production URLs. Later wraps `@vercel/related-projects`

### 6. Barrel Exports

`components/index.ts`:

```typescript
export { TerminalChrome } from './TerminalChrome'
export { Navigation } from './Navigation'
export { NetworkBanner } from './NetworkBanner'
export { Footer } from './Footer'
export { PostCard } from './PostCard'
```

`lib/index.ts`:

```typescript
export { getPostSlugs, getPostBySlug, getAllPosts } from './posts'
export { markdownToHtml } from './markdown'
export { getSiteUrl } from './related'
```

`index.ts` (root):

```typescript
export * from './components'
export * from './lib'
```

## Locked Color System (reference -- DO NOT change)

- **shawnos.ai**: Primary Green #4EC373, Secondary Purple #9B72CF, Tertiary Amber #D2A53C
- **thegtmos.ai**: Primary Teal #3DBFA0, Secondary Red #E05555
- **thecontentos.ai**: Primary Purple #9B72CF, Secondary Green #4EC373
- Body text: #C9D1D9 on dark canvas #0D1117
- Font: JetBrains Mono
- Green is the connective tissue across all three sites

## After `npm install`

Run `npm install` from `website/` root after creating the package. This should resolve the workspace dependency. Verify with `npx turbo build` (it will warn about no apps yet, but shouldn't error on the shared package).

## After This Todo

Spin off a new agent for Todo 3 (shawnos.ai app at `apps/shawnos/`). That agent will:

- Create the Next.js app that imports `@shawnos/shared`
- Configure Tailwind with `--accent: #4EC373` (green)
- Build the root layout composing TerminalChrome > Navigation > children > NetworkBanner > Footer
- Wire up the blog engine to read from `content/website/final/`


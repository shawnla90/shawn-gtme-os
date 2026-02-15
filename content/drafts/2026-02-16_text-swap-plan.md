# Monday Launch: Exact Text Swap Plan

> Status: **READY FOR EXECUTION**
> Files touched: 3 (2 pending, 1 already done)
> Complexity: Simple string replacements / appends — no new components

---

## Swap 1: RPG Page Title + Subtitle ✅ ALREADY DONE

**File:** `website/apps/shawnos/app/rpg-preview/page.tsx`

No action needed. The following swaps were already applied:

- **Title**: "The Progression System" (was "RPG Title Progression Preview")
- **Subtitle**: "11 tiers. 5 classes. every title earned through daily output, tracked in the build log." (was "Edit rpg.ts and hot reload")
- **Footer link**: "see how this score is earned" → `/log` (already present)
- **Metadata**: title and description already updated to match

---

## Swap 2: Landing Page — "Choose Your Path" Section

**File:** `website/apps/shawnos/app/page.tsx`

**Location:** AFTER the boot log / system status section (after the closing `</section>` on ~line 342), BEFORE the final `</div>` on ~line 343.

**What to add:** A 3-line "choose your path" block below the system status box. Terminal-styled, matches the existing monospace aesthetic.

### Exact insertion (add between closing `</section>` and closing `</div>`):

```tsx
      {/* ── Choose Your Path ── */}
      <section
        style={{
          marginTop: 32,
          padding: '20px 24px',
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          fontSize: '13px',
          lineHeight: 2,
        }}
      >
        <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          <span style={promptChar}>$</span> ls ~/paths
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>building content systems?</span>{' '}
          <a
            href="https://thecontentos.ai"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            theContentOS.ai &rarr;
          </a>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>building GTM pipelines?</span>{' '}
          <a
            href="https://thegtmos.ai"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            theGTMOS.ai &rarr;
          </a>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>want to see how it all works?</span>{' '}
          <Link
            href="/blog"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >
            read the blog &rarr;
          </Link>
        </div>
      </section>
```

### Why this placement:

- Boot log is the "system is online" moment — the path selector is the natural "now what?" follow-up
- Visitors who scroll past blog posts and logs to the bottom are the most engaged — reward them with direction
- Uses the same `canvas-subtle` background + border pattern as the boot log box for visual consistency
- Terminal prompt `$ ls ~/paths` maintains the shell aesthetic
- External links use `<a>` (external sites), internal `/blog` uses `<Link>` (Next.js routing)

---

## Swap 3: Hello World Blog Post — "Start Here" Section

**File:** `content/website/final/hello-world.md`

**Location:** REPLACE the final line `` `$ echo "stay tuned"` `` with an expanded ending that includes navigation links.

### Before (line 36):

```markdown
`$ echo "stay tuned"`
```

### After:

```markdown
### start here

- [see the daily receipts](/log) — every day's output, scored and logged
- [explore the progression system](/rpg-preview) — 11 tiers, 5 classes, titles earned through output
- [grab the tracker prompt](/log/build-your-own) — the full prompt, copy-paste ready

`$ echo "stay tuned"`
```

### Why this structure:

- `### start here` heading matches the lowercase terminal voice of the rest of the post
- Three links cover the three depth paths for builders/curious visitors (log → RPG → build-your-own)
- Each link has a short descriptor after the em dash — enough context to click, not enough to overwhelm
- The original `$ echo "stay tuned"` stays as the final line — it's the sign-off, not something to replace
- Links use relative paths (not full URLs) so they work in both dev and production

---

## Execution Checklist

When executing these swaps (Monday morning before deploy):

- [ ] **Swap 2**: Insert "choose your path" section in `page.tsx` after system status
- [ ] **Swap 3**: Add "start here" section to `hello-world.md` above the sign-off line
- [ ] **Verify**: Run `npm run dev` in the shawnos app and check all 3 pages render correctly
- [ ] **Verify**: All links resolve (internal: `/log`, `/rpg-preview`, `/log/build-your-own`, `/blog`; external: `thecontentos.ai`, `thegtmos.ai`)
- [ ] **Deploy**: Once verified, run `/deploy`

---

## Notes

- No new components are needed. All additions are inline JSX or markdown.
- The RPG page (`rpg-preview/page.tsx`) is already complete — title, subtitle, metadata, and footer link all updated.
- The landing page `<Link>` import already exists (line 3 of `page.tsx`).
- External site links (`thecontentos.ai`, `thegtmos.ai`) use standard `<a>` tags since they're outside the Next.js app.

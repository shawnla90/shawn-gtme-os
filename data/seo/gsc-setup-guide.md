# Google Search Console Setup Guide

> Step-by-step for connecting all three domains.
> Priority: HIGH - this is blocking all organic indexing.

## Why This Matters

All three sites have 0 pages indexed by Google. Without GSC:
- Google doesn't know these sites exist
- No way to submit sitemaps
- No way to request indexing for specific pages
- No way to see crawl errors or coverage issues
- No search performance data

## Step 1: Access Google Search Console

1. Go to https://search.google.com/search-console
2. Sign in with google account (shawn@leadalchemy.co or personal gmail)
3. Click "Add property" (top-left dropdown)

## Step 2: Add Each Domain

Repeat for each domain: `shawnos.ai`, `thegtmos.ai`, `thecontentos.ai`

### Option A: Domain property (recommended)
- Select "Domain" verification type
- Enter just the domain: `shawnos.ai`
- This covers all subdomains + www/non-www + http/https
- Requires DNS TXT record verification:
  1. Copy the TXT record Google provides
  2. Go to your DNS provider (Vercel / domain registrar)
  3. Add TXT record to root domain
  4. Wait 5-10 minutes for DNS propagation
  5. Click "Verify" in GSC

### Option B: URL prefix property (faster but less complete)
- Select "URL prefix" verification type
- Enter `https://shawnos.ai`
- Verify via HTML tag method:
  1. Copy the meta tag Google provides
  2. Add to the `<head>` of your root layout.tsx:
     ```tsx
     // In metadata export:
     verification: {
       google: 'YOUR_VERIFICATION_CODE_HERE',
     },
     ```
  3. Deploy to Vercel
  4. Click "Verify" in GSC

## Step 3: Submit Sitemaps

For each verified property:

1. Go to "Sitemaps" in left nav
2. Submit these sitemaps:

**shawnos.ai:**
- `https://shawnos.ai/sitemap.xml`
- `https://shawnos.ai/feed.xml`

**thegtmos.ai:**
- `https://thegtmos.ai/sitemap.xml`
- `https://thegtmos.ai/feed/updates.xml`

**thecontentos.ai:**
- `https://thecontentos.ai/sitemap.xml`
- `https://thecontentos.ai/feed.xml`

## Step 4: Request Indexing for Key Pages

Use the URL Inspection tool (top search bar in GSC) to request indexing for high-priority pages first:

**shawnos.ai (top 5):**
1. `https://shawnos.ai/` (homepage)
2. `https://shawnos.ai/about`
3. `https://shawnos.ai/blog`
4. `https://shawnos.ai/method`
5. `https://shawnos.ai/knowledge`

**thegtmos.ai (top 5):**
1. `https://thegtmos.ai/` (homepage)
2. `https://thegtmos.ai/features`
3. `https://thegtmos.ai/clay-wiki`
4. `https://thegtmos.ai/knowledge`
5. `https://thegtmos.ai/how-to`

**thecontentos.ai (top 5):**
1. `https://thecontentos.ai/` (homepage)
2. `https://thecontentos.ai/content-wiki`
3. `https://thecontentos.ai/method`
4. `https://thecontentos.ai/how-to`
5. `https://thecontentos.ai/anti-slop`

For each URL:
1. Paste URL in inspection bar
2. Wait for Google to check
3. Click "Request Indexing"
4. Note: Google limits to ~10-12 index requests per day

## Step 5: Verify Coverage

After 3-5 days, check:
1. Go to "Pages" report in GSC
2. Look for "Not indexed" reasons:
   - "Discovered - currently not indexed" = Google found it but hasn't crawled yet (normal for new sites)
   - "Crawled - currently not indexed" = Google crawled but chose not to index (content quality issue)
   - "Blocked by robots.txt" = check your robots.txt
   - "Noindex" = check for stray noindex tags

## Step 6: Add Verification to Code (for URL prefix method)

If using HTML meta tag verification, add to each site's layout.tsx:

```tsx
// website/apps/shawnos/app/layout.tsx
export const metadata: Metadata = {
  // ... existing metadata
  verification: {
    google: 'SHAWNOS_VERIFICATION_CODE',
  },
}
```

Repeat for gtmos and contentos layout.tsx files.

## Timeline

- Day 0: Add properties + submit sitemaps + request indexing for top 5 pages each
- Day 1-3: Request indexing for remaining high-value pages (10 per day limit)
- Day 3-5: Check coverage report for issues
- Day 7-14: First pages should start appearing in Google
- Day 14-30: Majority of sitemap pages should be indexed (if content quality is sufficient)

## After GSC is Connected

- Check weekly for crawl errors
- Monitor "Core Web Vitals" report (Vercel Speed Insights data will complement this)
- Watch for mobile usability issues
- Track search impressions and clicks as they start appearing

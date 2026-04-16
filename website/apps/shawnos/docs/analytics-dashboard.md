# shawnos.ai Analytics Dashboard

PostHog project: **325806** (US cloud)
Read API key: stored in `POSTHOG_READ_KEY` env / 1Password. Not committed.
Query endpoint: `POST https://us.posthog.com/api/projects/325806/query/`

Midbound script key (live): `Yvy2M9X0v59ygzOV0tP2tNSRyJnzOGyk`

## Event model

Every `$pageview` now carries:

| Property | Example | Source |
|---|---|---|
| `page_type` | `home`, `blog`, `claude-daily`, `guide`, `services`, `media`, `knowledge`, `about`, `how-to`, `geo`, `log`, `api` | derived from first path segment after locale strip |
| `slug` | `competitive-intel-sqlite-git` | last path segment when path has 2+ segments |
| `$current_url` | `https://shawnos.ai/blog/competitive-intel-sqlite-git?utm_source=linkedin` | full URL with query |
| `utm_*` | `linkedin`, `x`, `newsletter` | persisted from first visit as super properties |
| `internal_user` | `true` | set when `?_shawnos=1` cookie is present (filter out self-traffic) |

Additional custom events still fire:
- `content_viewed`, `content_scroll_depth` (25/50/75/100), `content_time_on_page`
- `cta_clicked`
- `newsletter_signup` (client-side), `newsletter_signup_server` (server-side, reliable)
- `cross_site_navigation`, `outbound_link_clicked`
- `nio_chat_opened`, `nio_chat_closed`

## Insights to create in PostHog UI

Each should exclude `internal_user = true` to keep Shawn's own traffic out of the numbers.

### 1. Unique visitors (daily rollup)
```sql
SELECT toDate(timestamp) as day,
       count(DISTINCT person_id) as unique_visitors,
       count() as total_pageviews
FROM events
WHERE event = '$pageview'
  AND timestamp >= now() - INTERVAL 30 DAY
  AND (properties.internal_user IS NULL OR properties.internal_user = false)
GROUP BY day
ORDER BY day DESC
```

### 2. Traffic by page_type (7 days)
```sql
SELECT properties.page_type as page_type,
       count() as pageviews,
       count(DISTINCT person_id) as unique_visitors
FROM events
WHERE event = '$pageview'
  AND timestamp >= now() - INTERVAL 7 DAY
  AND (properties.internal_user IS NULL OR properties.internal_user = false)
GROUP BY page_type
ORDER BY pageviews DESC
```

### 3. Claude Daily deep-dive (per slug)
```sql
SELECT properties.slug as slug,
       count() as pageviews,
       count(DISTINCT person_id) as unique_visitors
FROM events
WHERE event = '$pageview'
  AND properties.page_type = 'claude-daily'
  AND timestamp >= now() - INTERVAL 14 DAY
  AND (properties.internal_user IS NULL OR properties.internal_user = false)
GROUP BY slug
ORDER BY pageviews DESC
LIMIT 30
```

### 4. Blog heatmap (top posts with engagement)
Combines pageviews with scroll-depth and time-on-page for the real engagement picture.
```sql
WITH views AS (
  SELECT properties.slug as slug, count(DISTINCT person_id) as visitors
  FROM events
  WHERE event = '$pageview'
    AND properties.page_type = 'blog'
    AND timestamp >= now() - INTERVAL 30 DAY
    AND (properties.internal_user IS NULL OR properties.internal_user = false)
  GROUP BY slug
),
scrolls AS (
  SELECT properties.slug as slug,
         avg(toFloat(properties.depth)) as avg_scroll
  FROM events
  WHERE event = 'content_scroll_depth'
    AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY slug
),
times AS (
  SELECT properties.slug as slug,
         avg(toFloat(properties.seconds)) as avg_time_s
  FROM events
  WHERE event = 'content_time_on_page'
    AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY slug
)
SELECT v.slug, v.visitors,
       round(coalesce(s.avg_scroll, 0)) as avg_scroll_pct,
       round(coalesce(t.avg_time_s, 0)) as avg_time_s
FROM views v
LEFT JOIN scrolls s USING (slug)
LEFT JOIN times t USING (slug)
ORDER BY v.visitors DESC
LIMIT 20
```

### 5. Signup funnel by source
```sql
SELECT coalesce(properties.$referring_domain, '(direct)') as source,
       count() as signups
FROM events
WHERE event = 'newsletter_signup_server'
  AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY source
ORDER BY signups DESC
```

### 6. Chapter 12 launch tracker (48-hour window)
Plug in the launch start time in place of `<LAUNCH_START>`.
```sql
SELECT toStartOfHour(timestamp) as hour,
       count() as pageviews,
       count(DISTINCT person_id) as unique_visitors
FROM events
WHERE event = '$pageview'
  AND properties.$current_url LIKE '%/blog/competitive-intel-sqlite-git%'
  AND timestamp >= toDateTime('<LAUNCH_START>')
  AND timestamp <= toDateTime('<LAUNCH_START>') + INTERVAL 48 HOUR
GROUP BY hour
ORDER BY hour
```

### 7. Referrer attribution with signup conversion
```sql
WITH traffic AS (
  SELECT coalesce(properties.$referring_domain, '(direct)') as source,
         count(DISTINCT person_id) as visitors
  FROM events
  WHERE event = '$pageview'
    AND timestamp >= now() - INTERVAL 30 DAY
    AND (properties.internal_user IS NULL OR properties.internal_user = false)
  GROUP BY source
),
signups AS (
  SELECT coalesce(properties.$referring_domain, '(direct)') as source,
         count() as signups
  FROM events
  WHERE event = 'newsletter_signup_server'
    AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY source
)
SELECT t.source, t.visitors, coalesce(s.signups, 0) as signups,
       round(coalesce(s.signups, 0) * 100.0 / t.visitors, 2) as conv_pct
FROM traffic t
LEFT JOIN signups s USING (source)
WHERE t.visitors >= 10
ORDER BY t.visitors DESC
```

## Dashboard layout (recommended)

Create a single PostHog Dashboard named **ShawnOS — Launch Ops**, grouped as:

- **Row 1 — Today at a glance**: Unique visitors (24h), Pageviews (24h), Signups (24h), Signup conversion (24h).
- **Row 2 — Traffic shape**: Daily unique visitors (30 days), Traffic by page_type (7 days), Referrer attribution with conversion.
- **Row 3 — Content performance**: Blog heatmap, Claude Daily deep-dive.
- **Row 4 — Campaign windows**: Chapter 12 launch tracker (48h window, pin it). Add a new 48h Insight per future drop.

## Verification

Run `scripts/verify-analytics.sh` after every deploy that touches the provider or the layout. The script fails loudly if any of the four checks break.

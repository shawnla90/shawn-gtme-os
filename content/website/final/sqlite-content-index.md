---
title: "Querying Your Repo Like a Database"
date: "2026-02-22"
excerpt: "100+ content files across 6 platforms became opaque. So I built a SQLite index that makes the entire repo queryable from the command line."
---

## the problem

the repo had over 100 content files. LinkedIn drafts, X threads, Substack newsletters, Reddit posts, website blog entries, TikTok scripts. spread across 6 platforms, split between draft and final stages. the directory structure was clean, but the data was opaque. I couldn't answer basic questions without manually scanning files.

how many LinkedIn posts went final this week? which content has cross-platform siblings? what's the total word count for February? which assets are deployed and which are sitting in source?

the file system is great for organizing. it's terrible for querying.

## the solution: a derived SQLite database

`scripts/build_index.py` walks the repo, parses every content file, and loads the results into a 9-table SQLite database at `data/index.db`. zero external dependencies — stdlib only. json, sqlite3, pathlib, re. that's it.

the index is derived data. it's rebuilt from git-tracked files every time you run it. delete the database, run the script, get the same result. the source of truth is always the repo. the database is just a query layer on top.

```
$ python3 scripts/build_index.py

Building index: data/index.db
  Content:      80 files indexed
  Daily logs:   11 days indexed
  Skills:       54 indexed
  Assets:       522 visual assets indexed
  Videos:       3 video files indexed
  Content links: 75 series-sibling pairs detected
```

## the schema

nine tables. each one indexes a different content type.

**content** — the core table. every draft and final across all platforms. fields include platform, stage, title, slug, date, pillar, arc, series, word count. metadata is parsed from two formats: blockquote syntax (`> **Key**: Value`) for most platforms, YAML frontmatter for website posts.

**daily_logs** — performance metrics from the daily tracker. output score, letter grade, word count, shipped count, agent cost, ROI multiplier, commits.

**sessions** — context handoff history. this table is append-only and survives index rebuilds. every other table gets dropped and recreated. sessions persist because they're historical records, not derived data.

**skills** — the Claude and Cursor skill registry. 54 skills indexed with name, description, file path, category.

**content_links** — the relationship graph. two link types: `series_sibling` (same date and slug across platforms, detected automatically) and `cross_platform_note` (explicit references parsed from Cross-Platform Notes sections).

**assets** — 522 visual assets across the progression system. tier avatars, class badges, tool icons, Nio variants, sprite sheets. filename patterns get parsed into structured data: `tier-3-idle-256.gif` becomes asset_type=tier, tier=3, variant=idle, size_px=256.

**videos** — video file catalog with brand, aspect ratio, format, deployment status.

**thumbnails** — thumbnail inventory by brand and variant.

## the query CLI

`scripts/query_index.py` is the read-only interface. eight subcommands with filtering.

```
$ python3 scripts/query_index.py content --platform linkedin --since 2026-02-15
$ python3 scripts/query_index.py stats --latest 3
$ python3 scripts/query_index.py skills --category claude
$ python3 scripts/query_index.py links --date 2026-02-17
$ python3 scripts/query_index.py assets --site shawnos --type tier --tier 3
$ python3 scripts/query_index.py videos --brand gtmos --source-only
```

output modes: table (default), JSON (`--json`), row count (`--count`). the table output is human-readable. the JSON output pipes into other scripts.

## cross-platform link detection

this is where it gets interesting. the index doesn't just catalog files — it discovers relationships between them.

**implicit sibling detection**: files with identical (date, slug) across platforms get linked as `series_sibling`. if you have `linkedin/final/2026-02-17_build-your-own-os.md` and `substack/final/2026-02-17_build-your-own-os.md`, the index knows they're related without you telling it.

**explicit cross-reference detection**: the script parses `## Cross-Platform Notes` sections, looks for platform keywords with aliases (LinkedIn, X/Twitter, Reddit), and matches them to existing content by date and platform.

75 sibling pairs and 4 explicit cross-links in the current index. the content graph is real and queryable.

## dead page detection

this is why this post exists. the index revealed its own gap.

query the content table for files with zero inbound links from content_links. those are orphans — content that exists but nothing points to. query for files with zero outbound links. those are dead ends — content that doesn't connect to anything else.

I ran those queries and found that three major systems had shipped with zero blog coverage: the Remotion video system, this SQLite index itself, and the content cluster topology. the tool that finds content gaps revealed content gaps about the tool.

## the recursive meta

this post is a direct result of the system it describes. the SQLite index made the repo queryable. a query revealed that no content covered the index. so I wrote this post. when I rebuild the index, this post appears in it. the system documents itself.

that's not a gimmick. that's the content engineering thesis. the system produces the content that describes the system. every new capability becomes a new piece of content. every new piece of content strengthens the knowledge graph. the loop compounds.

`$ python3 scripts/query_index.py content --platform website --stage final`

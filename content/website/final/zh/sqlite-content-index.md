---
title: "像查数据库一样查询你的代码仓库"
date: "2026-02-22"
excerpt: "100多个内容文件分布在6个平台上，变得不透明了。所以我建了一个 SQLite 索引，让整个仓库都可以从命令行查询。"
---

## 问题

仓库有超过100个内容文件。LinkedIn 草稿、X 线程、Substack 通讯、Reddit 帖子、网站博客文章、TikTok 脚本。分布在6个平台，分为草稿和定稿阶段。目录结构是清晰的，但数据是不透明的。不手动扫描文件就无法回答基本问题。

这周有多少 LinkedIn 帖子进入定稿？哪些内容有跨平台兄弟内容？二月的总字数是多少？哪些资源已部署，哪些还在源文件里？

文件系统擅长组织。但不擅长查询。

## 方案：派生的 SQLite 数据库

`scripts/build_index.py` 遍历仓库，解析每个内容文件，并将结果加载到 `data/index.db` 的一个9表 SQLite 数据库中。零外部依赖 - 只用标准库。json、sqlite3、pathlib、re。就这些。

索引是派生数据。每次运行时从 git 跟踪的文件重建。删除数据库，运行脚本，得到相同的结果。真相之源始终是仓库。数据库只是上面的查询层。

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

## 数据结构

九张表。每张索引不同的内容类型。

**content** - 核心表。所有平台的所有草稿和定稿。字段包括平台、阶段、标题、slug、日期、支柱、弧线、系列、字数。元数据从两种格式解析：大多数平台的引用块语法（`> **Key**: Value`），网站文章的 YAML 前置元数据。

**daily_logs** - 每日追踪器的性能指标。产出分数、字母评级、字数、发布数、智能体成本、ROI 倍率、提交数。

**sessions** - 上下文交接历史。这张表是仅追加的，在索引重建时保留。所有其他表都被删除并重建。会话之所以保留是因为它们是历史记录，不是派生数据。

**skills** - Claude 和 Cursor 技能注册表。54个技能被索引，包含名称、描述、文件路径、类别。

**content_links** - 关系图。两种链接类型：`series_sibling`（跨平台的相同日期和 slug，自动检测）和 `cross_platform_note`（从跨平台注释部分解析的显式引用）。

**assets** - 成长系统中的522个视觉资源。等级头像、职阶徽章、工具图标、Nio 变体、精灵图表。文件名模式被解析为结构化数据：`tier-3-idle-256.gif` 变成 asset_type=tier, tier=3, variant=idle, size_px=256。

**videos** - 视频文件目录，包含品牌、宽高比、格式、部署状态。

**thumbnails** - 按品牌和变体分类的缩略图库存。

## 查询 CLI

`scripts/query_index.py` 是只读接口。八个子命令带过滤器。

```
$ python3 scripts/query_index.py content --platform linkedin --since 2026-02-15
$ python3 scripts/query_index.py stats --latest 3
$ python3 scripts/query_index.py skills --category claude
$ python3 scripts/query_index.py links --date 2026-02-17
$ python3 scripts/query_index.py assets --site shawnos --type tier --tier 3
$ python3 scripts/query_index.py videos --brand gtmos --source-only
```

输出模式：表格（默认）、JSON（`--json`）、行数（`--count`）。表格输出适合人类阅读。JSON 输出可以传给其他脚本。

## 跨平台链接检测

这里开始有意思了。索引不只是编目文件 - 它发现文件之间的关系。

**隐式兄弟检测**：跨平台具有相同（日期，slug）的文件被链接为 `series_sibling`。如果你有 `linkedin/final/2026-02-17_build-your-own-os.md` 和 `substack/final/2026-02-17_build-your-own-os.md`，索引知道它们相关，不需要你告诉它。

**显式交叉引用检测**：脚本解析 `## Cross-Platform Notes` 部分，查找带别名的平台关键词（LinkedIn、X/Twitter、Reddit），并按日期和平台匹配到现有内容。

当前索引中有75对兄弟关系和4个显式交叉链接。内容图谱是真实的且可查询的。

## 死页面检测

这就是这篇文章存在的原因。索引揭示了自身的空白。

查询 content 表中 content_links 没有入站链接的文件。那些是孤儿 - 存在但没有东西指向的内容。查询没有出站链接的文件。那些是死胡同 - 不连接到任何东西的内容。

我运行了这些查询，发现三个主要系统在发布时零博客覆盖：Remotion 视频系统、这个 SQLite 索引本身，以及内容集群拓扑。发现内容空白的工具揭示了关于该工具的内容空白。

## 递归的元叙事

这篇文章是它所描述的系统的直接结果。SQLite 索引使仓库可查询。一个查询揭示没有内容覆盖这个索引。所以我写了这篇文章。当我重建索引时，这篇文章出现在其中。系统记录自身。

这不是噱头。这是内容工程论点。系统产生描述系统的内容。每个新能力变成一条新内容。每条新内容加强知识图谱。循环复利。

`$ python3 scripts/query_index.py content --platform website --stage final`

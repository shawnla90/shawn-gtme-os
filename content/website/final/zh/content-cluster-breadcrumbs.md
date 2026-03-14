---
title: "内容集群和面包屑协议"
date: "2026-02-22"
excerpt: "三个网站，一个父关键词，以及一个精心设计的拓扑结构，告诉搜索引擎和 AI 平台一切是如何连接的。"
---

## 拓扑问题

三个网站。shawnos.ai、thegtmos.ai、thecontentos.ai。每个都有自己的内容。博客文章、知识术语、操作指南、Wiki 条目。单独看都很扎实。但搜索引擎和 AI 平台看到的不是单个页面 - 它们看到的是一个图。而一个没有显式边的图只是一堆断开的节点。

问题不是你有什么内容。而是你的内容如何连接。

## 中心辐射模型

拓扑是中心辐射式的。一个父概念 - "用 AI 构建" - 三个专业化的垂直分支从它延伸出去。

**shawnos.ai** 是中心。构建者的个人品牌。系统构建过程本身。

**thegtmos.ai** 是第一条辐射。GTM 工作流、合作伙伴实战手册、外呼自动化。中心工具包产出的 GTM 系统。

**thecontentos.ai** 是第二条辐射。内容方法论、语音 DNA、AI 辅助写作。中心展示的内容管道和方法论。

递归结构就是重点。构建系统的行为就是 shawnos 的内容。系统产出的 GTM 工作流就是 gtmos 的内容。用系统创建内容的方法论就是 contentos 的内容。每个网站的内容证明了另外两个网站的论点。

## taxonomy.yaml

拓扑定义在 `website/taxonomy.yaml` 中。不是在某人脑子里。不是在 Notion 文档里。在一个机器可读的版本控制 YAML 文件中。

这个文件将每个内容支柱映射到一个域：

- building-sharing → shawnos
- plays-series → gtmos
- skill-system-shares → gtmos
- release-reactions → shawnos
- newsletter-editorial → shawnos
- newsletter-growth → contentos
- reddit-growth-seo → contentos

路由规则是明确的：个人故事去 shawnos。GTM 系统去 gtmos。内容策略去 contentos。跨域文章有一个主域加上到兄弟内容的交叉链接。

## 面包屑协议

网站上的面包屑通常是事后考虑。首页 > 博客 > 文章标题。基本层级。这个系统中的面包屑协议不同 - 它是一个前向引用的跨站导航系统。

每个页面知道自己在拓扑中的位置。shawnos 上的一个操作指南知道它属于 `geo-seo` 类别。它知道相关指南存在于 gtmos 上。面包屑结构化标记（JSON-LD 中的 BreadcrumbList）将这个层级传达给搜索引擎。

但前向引用部分才是重要的。当一个新的操作指南条目有 `canonicalSite: 'gtmos'` 时，它在 thegtmos.ai 上原生渲染，并从 shawnos.ai 创建重定向。gtmos 上的面包屑显示 `GTMOS > How-To > Content Cluster Strategy`。shawnos 上的重定向告诉搜索引擎这个内容在辐射上，不在中心。

这是精心设计的拓扑。不只是导航。

## 数据层

跨站链接架构存在于 `website/packages/shared/data/` 中的三个 TypeScript 数据文件里：

**how-to-wiki.ts** - 每个条目有一个 `canonicalSite` 字段和一个 `related` 数组。规范站点决定哪个域渲染页面。相关数组创建到其他条目的双向链接。

**engineering-terms.ts** - 知识术语带有 `related` 数组，链接到其他术语。程序化内部链接自动将每个术语的提及连接到它的定义页面。

**content-wiki.ts** - ContentOS 的 Wiki 条目，有自己的相关数组。

`related` 数组是内容图谱的边。每次你添加一个带相关链接的新条目，你就在添加边。每次一个现有条目添加到新条目的反向链接，你就在使边变成双向的。没有死胡同。没有孤儿。

## 规范路由

操作指南条目上的 `canonicalSite` 字段是跨站内容放置的机制。当一个条目有 `canonicalSite: 'gtmos'` 时，shawnos.ai 的操作指南页面生成到 `thegtmos.ai/how-to/[slug]` 的重定向。gtmos 站点从 `@shawnos/shared` 导入相同的数据并原生渲染。

一个数据文件。三个网站。自动路由。单仓库使这无缝，因为三个网站共享同一个包。没有 API 调用，没有内容同步，没有 CMS 复制。就是一个 TypeScript 导入。

## 为什么集群对 AI 引用很重要

AI 引擎不只是索引单个页面。它们评估主题权威性。对一个主题有全面覆盖的网站 - 多个页面交叉链接，不同内容类型从不同角度覆盖 - 获得优先引用。

主题集群是这个的显式版本。一个支柱页面覆盖广泛话题。支持集群页面深入子话题。所有页面交叉链接。集群向 AI 引擎发出信号：这个网站拥有这个主题。

三站架构放大了这个效果。shawnos、gtmos 和 contentos 各自在它们的垂直领域建立权威。跨站链接连接各个垂直领域。`sameAs` 结构化标记告诉搜索引擎这三个网站代表一个实体。集群不只在一个站点内 - 它跨越整个网络。

## 复利效应

每条新内容都加强集群。一个新的知识术语获得定义页面，出现在 RSS 订阅中，获得结构化标记，并可用于从每个提到它的页面进行程序化内部链接。一个新的操作指南链接到相关术语、相关指南和相关 Wiki 条目 - 在图谱中创建新的边。

SQLite 内容索引追踪所有这些。分类法路由它。面包屑导航它。结构化标记描述它。而每一块都是版本控制文件中的 TypeScript 数据对象。

系统不只是保存内容。它就是内容架构。

`$ cat website/taxonomy.yaml | head -20`

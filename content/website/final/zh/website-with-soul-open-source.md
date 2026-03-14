---
title: "我开源了构建有灵魂网站的完整实战手册"
date: "2026-03-14"
excerpt: "32章，一个可运行的入门模板，以及拥有你的内容、受众和算法的完整系统。90%免费技术栈。三部曲的收官之作。"
category: "ships"
featured: true
---

## 三部曲完成了

我今天把 [website-with-soul](https://github.com/shawnla90/website-with-soul) 推到了 GitHub。这是三部曲中的第三个也是最后一个仓库，从方法论开始，到基础设施，以产品结束。

[recursive-drift](https://github.com/shawnla90/recursive-drift) 是与 AI 思考的操作系统。如何把 Claude Code 当作协作者而不丢失你的声音。六个状态，一个自读反馈循环，零 API 密钥。

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) 是管道工程。6层上下文基础设施，让 Claude Code 不用每次会话从零开始。并行安全的交接、结构化记忆、自我改进循环。

website-with-soul 是一切落地的地方。前两个仓库中的一切都是为了让这个能工作。构建一个听起来像你的真实网站，在搜索中排名，喂养 AI 系统，并随时间复利增长。

## 里面有什么

两个东西。

**一个可运行的入门模板。** 克隆它，运行 `npm install && npm run dev`，15分钟就有一个网站。暗色终端美学，markdown 博客，带关键词 RAG 的 AI 聊天小组件，PostHog 分析带代理模式，带 AI 爬虫白名单的站点地图，OG 图片生成，RSS 订阅，安全头。全部基于 Next.js 15 + Tailwind v4。

**32章实战手册。** 四个阶段覆盖从空目录到内容机器的完整弧线。

第一阶段是构建。11章逐一讲解入门模板中的每个文件。设置、博客系统、聊天小组件、分析、站点地图、OG 图片、RSS、安全头、性能、部署、Claude Code 设置。

第二阶段是赋予灵魂。语音 DNA、反垃圾模式、内容归档、博客工作流、多平台分发、SEO 管道。这是大多数人跳过的部分，也是最重要的部分。

第三阶段是有机增长。分发矩阵、Reddit 策略（带关于 AI 索引内容的 GEO 论点）、LinkedIn 构建者声音、X 线程格式。没有付费广告。你的网站是枢纽，社交平台是分发渠道。

第四阶段是扩展。单仓库升级、自主博客管道、定时任务自动化、Claude Code 智能体系统、Cloudflare Pages 迁移。

## 技术栈几乎零成本

| 工具 | 成本 |
|------|------|
| Next.js 15 | 免费 |
| Tailwind CSS v4 | 免费 |
| Vercel | 免费 |
| Cloudflare | ~$10/年（仅域名） |
| PostHog | 免费 |
| Claude Code | ~$200/月 |

域名每年$10。其他一切要么免费要么可选。Claude Code 订阅是唯一真实的成本，而且你可能已经在付了。

## 人们搞错的部分

每个人都说"公开构建。"几乎没人谈论拥有基础设施。

你可以在 LinkedIn 上每天发帖一整年，建立真实的受众。LinkedIn 改了算法。你的触达一夜之间下降60%。你在租来的土地上建了房子。

网站才是你拥有的东西。每篇博客文章都在复利。每个页面都被索引。每个 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot）消费你的内容并开始引用你作为来源。这就是实战手册中的 GEO 论点。你不再只是为 Google 优化。你在为正在取代 Google 的 AI 系统优化。

社交平台是分发渠道。它们把流量引回你拥有的东西。网站。

## 为什么我公开构建这个

三个网站运行在完全相同的技术栈上。[shawnos.ai](https://shawnos.ai)、[thegtmos.ai](https://thegtmos.ai)、[thecontentos.ai](https://thecontentos.ai)。同一个代码库，同一个实战手册，同一个语音系统。入门模板直接从生产代码中提取。

我可以把这个做成私有的。做成付费课程或 SaaS 产品。但递归漂移的整个论点是方法论通过分享而改进。使用它并提出挑战的人越多，它就变得越好。

所以它是 MIT 许可的。随便用。

## 开始使用

三条路，取决于你想深入到什么程度。

**15分钟。** 克隆入门模板，自定义内容，部署到 Vercel。你有了一个网站。

**1小时。** 跟着第一阶段实战手册走。你理解每个文件并用自定义域名上线。

**1天。** 完成全部4个阶段。结束时你有一个带语音系统、分发管道和 SEO 策略的内容机器。

仓库在 [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)。

没有门槛。全部内容都在那里。

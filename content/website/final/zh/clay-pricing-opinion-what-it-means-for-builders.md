---
title: "Clay 的定价对企业合理。我们这些人被挤了。"
date: "2026-03-12"
excerpt: "我的职业生涯建立在 Clay 上。我在公开 Wiki 中记录了60多个模式。但我认为新定价把下一波构建者挡在了门外。"
category: "gtm-engineering"
featured: true
---

## 先说感谢

Clay 改变了我的职业生涯。我从一个在 SalesLoft 上每天苦磨200封邮件的 SDR，变成了一个构建补全架构、HTTP API 集成和完整 GTM 管道的人。我在 [Clay Wiki](https://thegtmos.ai/clay-wiki) 记录了60多个模式。Clay 给了我一个沙盒，让系统化思维真正派上用场，我因此学会了用系统的方式思考。

所以当我说新定价把下一波构建者挡在了门外，这是作为一个欠了这个平台很多的人在说这话。

## 正在关上的门

Explorer 层级没了。

那个计划是 $349/月，那是构建者的计划。HTTP API 访问、webhooks、足够实验的积分。在你用完了 Starter 但还没准备好承诺 $800 的 Pro 之间，它就是你的落脚点。那是学习层。一个有野心的 SDR 可以在那里开始把 Clay 连接到真实系统，看看 GTM 工程到底长什么样。

新定价从 Launch $185（没有 HTTP API、没有 webhooks、没有 CRM 同步）直接跳到 Growth $495。那不是一个台阶，那是一堵墙。墙后面的东西，正是让 Clay 值得深入学习的所有功能。

如果你是一个想搞清楚 GTM 工程是否适合自己的学习者，现在你需要先承诺每月 $495 才能碰到那些真正重要的工具。入门坡度陡到刚好把 Clay 社区赖以建立的那群人过滤掉了。

## HTTP API 的问题

这是作为一个构建者，最让我不舒服的部分。

Clay 的 HTTP API 列允许你调用外部服务。Apollo 的 API。你自己的 webhook 端点。n8n 自动化。自定义脚本。你在用别人的基础设施向别人的服务器发请求。Clay 是中间人，负责路由这个调用。

在新定价下，每次 HTTP API 调用都消耗一个 Action。Clay 现在在计量你对第三方服务器的请求。回来的数据不是 Clay 的数据。处理请求的服务器不是 Clay 的服务器。但计量器在转。

与此同时，我可以用 Claude Code 免费发同样的 API 调用。或者用 n8n。或者用一个 cron 上跑的 Python 脚本。HTTP 请求本身不花钱，因为它就是... 一个 HTTP 请求。

Clay 的价值在于编排和界面 - 让 API 调用对非技术操盘手变得可用。这是真正的价值。但对外部服务器的透传流量按请求收费，那是另一回事了。尤其是当替代方案既免费又越来越好用的时候。

## 代理商最先感受到

我每周都跟代理商老板聊。数学马上就打到他们了。

一个典型的 Clay 代理商管理5-6个客户账号。每个客户至少需要 Growth 才能用 HTTP API。那就是 $495 x 5-6个账号。仅平台成本就是 $2,475 到 $2,970/月。还没算补全积分。还没算代理商的费用。还没算工具栈里的其他工具。

按旧定价，同样的代理商可以用 Explorer 账号跑，$349。从 $349 涨到 $495 每个账号，乘以整个客户组合，纯平台成本增加 $730 到 $876/月。那是每年 $8,760 到 $10,512 的额外支出，而能力没有任何增加。

代理商会把成本转嫁给客户。客户会问涨价换来了什么。答案是：跟之前一样的东西，但地板抬高了。

如果你现在正在评估代理商合作，先做[免费审计](https://shawnos.ai/blog/before-you-hire-a-clay-agency)。定价变动让了解你的实际使用情况变得比以往更重要。

## Clay 课程应该教什么

过去一年我看着 Clay 教育生态不断壮大。训练营、课程、认证。大多数教的是 Clay 界面操作。怎么建表、怎么用 Sculptor、怎么在 Clay 界面里搭补全瀑布流。

这些技能的保质期刚刚变短了。

2026年真正重要的是：Git。版本控制。Agent 编排。写直接调用 API 的脚本。发布在 cron 上运行的代码。一次 Apollo API 调用就返回结构化 JSON，包含人员、公司、邮箱和电话。免费的。当第一个数据源就能返回你需要的80%时，你不需要六个瀑布流供应商。

教 Clay 界面的训练营，是在为一个刚刚抬高入门门槛的平台培训人。应该存在的训练营，是在教人构建不依赖任何单一平台定价决策的系统。

## 构建者本身就是产品

这是我反复回到的核心论点。

不是 Clay 让我变得有价值。是我在 Clay 上构建时学到的模式让我变得有价值。补全架构。数据编排。ICP 评分。管道自动化。这些模式可以迁移到任何工具。Apollo 的 API。Supabase。Claude Code。n8n。一个 bash 脚本。

只懂 Clay 界面的构建者被锁定在 Clay 的定价上。通过 Clay 学会了系统化思维的构建者，可以在一个周末用免费基础设施重建同样的管道。

Clay 的社区是由那些公开分享工作的构建者建起来的。LinkedIn 帖子。Clay University 提交。开放的 playbook。那些构建者给 Clay 带来了客户。他们就是增长引擎。

而现在定价在向企业级账号优化，那些账号不需要社区。推动了平台增长的构建者，恰恰是感受到挤压最深的那群人。

## 我的方向

我没有离开 Clay。我仍然每天在用。对于某些工作流，它仍然是市场上最好的编排界面。

但我正在把更多管道路由到我自己控制的基础设施上。用 [Apollo 的免费 API](https://shawnos.ai/blog/why-apollo-should-be-your-first-sourcing-run-not-clay) 做采集。用 Supabase 做存储。用 Claude Code 做脚本和 Agent 编排。用 n8n 做自动化。一台 Mac Mini 在我睡觉时跑 cron。

我从 Clay 迁出的那部分每月总成本：大约为零。代码在我的代码仓库里。数据在我的数据库里。没有 Action 计量器。没有双币种数学。

Clay 教会了我所有需要的东西，让我能够超越 Clay。我对此心怀感激。但我认为他们刚刚让下一个人更难拥有同样的经历了。

---

*完整的定价变动、层级和迁移数学的事实拆解，请阅读[第一部分](https://shawnos.ai/blog/clay-changed-their-pricing-heres-what-it-actually-means-for-builders)。*

*[Clay Wiki](https://thegtmos.ai/clay-wiki) · [免费代理商审计](https://shawnos.ai/blog/before-you-hire-a-clay-agency) · [Apollo 采集指南](https://shawnos.ai/blog/why-apollo-should-be-your-first-sourcing-run-not-clay)*

shawn ⚡ GTM Engineer

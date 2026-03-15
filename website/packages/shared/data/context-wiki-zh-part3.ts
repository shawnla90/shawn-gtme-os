/**
 * ShawnOS - Context Wiki Data (Simplified Chinese - Part 3)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 *
 * Entries: claude-md, skill-trees, multi-model-optimization,
 *          cli-first-philosophy, co-work-sessions
 */

import type { ContextWikiEntry, ContextWikiCategory } from './context-wiki'

export const PART3: ContextWikiEntry[] = [
  {
    id: 'claude-md',
    title: 'CLAUDE.md',
    subtitle: '你的 AI 队友在每次会话前阅读的入职文档',
    category: 'code',
    description:
      '如何编写高效的 CLAUDE.md 文件。这个位于项目根目录的配置文件为每个 AI 会话设定环境默认值、代码风格和行为规则。',
    keywords: [
      'claude md file',
      'claude.md',
      'claude code configuration',
      'ai onboarding document',
      'claude md context engineering',
      'project root ai config',
    ],
    difficulty: 'beginner',
    related: [
      'context-repository',
      'skills',
      'grounding',
      'context-engineering',
    ],
    sections: [
      {
        heading: 'CLAUDE.md 的作用',
        type: 'prose',
        content:
          'CLAUDE.md 文件位于项目根目录。它是 Claude 启动会话时第一个读取的文件。可以把它想象成你 AI 队友的入职文档。在 Claude 读取任何其他文件之前，在它处理你的提示之前，在它查看你的代码之前，它都会先读取 CLAUDE.md。这使其成为整个系统中优先级最高的上下文。你在这里放的内容会影响之后的每一次交互。',
      },
      {
        heading: '配置层级体系',
        type: 'pattern',
        content:
          'AI 配置有三个层级，按顺序加载。\n\nCLAUDE.md 最先加载。环境默认值、包管理规则、代码风格偏好、语言默认设置。这是基础层，适用于每个会话，不论你在做什么。\n\n技能文件在调用时加载。当你输入 /deploy，部署技能文件加载到上下文中。当你输入 /tracker，跟踪器技能加载。技能是工作流特定的，不触发就不会加载。\n\n规则在你接触匹配文件时加载。如果你打开一篇博文，博文格式规则加载。如果你编辑一个组件，组件模式规则加载。规则是文件特定的，根据你编辑的内容激活。\n\n层级关系很重要。CLAUDE.md 设定基线。技能添加工作流上下文。规则添加文件特定的上下文。它们共同为 Claude 提供完整画面，无需你做任何解释。',
      },
      {
        heading: 'CLAUDE.md 里应该放什么',
        type: 'pro-tip',
        content:
          '保持 CLAUDE.md 聚焦于适用于每个会话的内容。环境细节：操作系统、shell、主要编程语言。包管理规则：如何安装、如何处理权限、如何验证版本。代码风格默认值：TypeScript 优先于 JavaScript、格式偏好、导入约定。\n\n不要在 CLAUDE.md 中放工作流特定的指令，那些属于技能文件。不要在 CLAUDE.md 中放文件特定的模式，那些属于规则文件。CLAUDE.md 应该简短且通用。如果一条规则只是偶尔适用，它就不属于这里。\n\n我的 CLAUDE.md 只有几段话。环境信息、包管理规则、语言默认设置，仅此而已。其他所有内容都放在技能和规则中，按需加载，而不是每次会话都占用上下文窗口空间。',
      },
      {
        heading: '常见错误：过度填充 CLAUDE.md',
        type: 'anti-pattern',
        content:
          '我见过有人把完整的工作流文档、编码标准、风格指南和项目架构全部塞进 CLAUDE.md。文件膨胀到 500 多行。问题在于：Claude 在每次会话中都会读取全部内容，即使 90% 与当前任务无关。这浪费了上下文窗口空间，而且当不同工作流的指令互相矛盾时，实际上会让模型困惑。\n\n保持 CLAUDE.md 精简。只放通用默认值。把其他所有内容移到技能（用于工作流）和规则（用于文件模式）中。这样 Claude 只获取当前任务所需的上下文，而不是你记录过的所有内容的洪流。',
      },
    ],
  },

  {
    id: 'skill-trees',
    title: '技能树',
    subtitle: '用 RPG 风格可视化展示你构建的一切',
    category: 'code',
    description:
      '如何构建 RPG 风格的技能树来映射你的整个 GTM OS。扫描代码仓库、分类能力、让不可见的变得可见。不是为 AI 做的，是为你做的。',
    keywords: [
      'skill tree ai',
      'rpg skill tree gtm',
      'skill tree visualization',
      'ai capabilities map',
      'skill tree context engineering',
      'gamification gtm',
    ],
    difficulty: 'advanced',
    related: ['python-for-gtm', 'skills', 'context-repository', 'taxonomy'],
    sections: [
      {
        heading: '为什么要构建技能树',
        type: 'prose',
        content:
          '我构建了一个扫描整个代码仓库的技能树。内容产出、GTM 运营、语音系统、代理技能、基础设施。它将所有内容映射到 RPG 进度树上。不是因为它对 AI 有用，而是因为它对我有用。看到你的能力被映射成一棵树，能让你看到自己在哪些方面很强，在哪些方面有差距。它还让整个系统变得具象化。你可以向别人展示你的技能树，他们立刻就能理解你所构建的系统的规模。它将一个由 Markdown 文件组成的抽象仓库变成了一个可视化的能力清单。',
      },
      {
        heading: '扫描的工作原理',
        type: 'pattern',
        content:
          '/skilltree 技能会扫描仓库并对找到的一切进行分类。内容按类型计数：博文、LinkedIn 草稿、X 帖子、Substack 文章。GTM 运营按工作流计数：合作伙伴引入、活动发布、网站访客识别设置。技能按类别计数和列出：内容技能、部署技能、合作伙伴技能、数据技能。基础设施评估：monorepo 结构、部署流水线、定时任务、MCP 集成。\n\n每个类别根据数量和深度获得一个等级。0-5 篇内容可能是 1 级。50 篇以上且有多种格式可能是 10 级。等级不是科学精确的，它们是激励性的。看到"内容：7 级"会让你想要达到 8 级。',
      },
      {
        heading: '让不可见的变得可见',
        type: 'pro-tip',
        content:
          '技能树最大的价值是让你的进度对自己可见。当你每天都在构建时，很容易忘记自己实际创造了多少。仓库在增长，技能在增多，内容在积累。但除非你将它可视化，否则这一切都像是背景噪音。\n\n技能树将噪音转化为信号。40 多个技能、100 多篇内容、5 个 MCP 集成、3 个网站。带有动画精灵的 RPG 进度系统。当我看技能树时，我看到的是我构建的系统。当别人看到它时，他们看到的是他们可以构建的系统。这才是真正的价值。不是数据本身，而是可见性。',
      },
    ],
  },

  {
    id: 'multi-model-optimization',
    title: '多模型 AI 优化',
    subtitle: '如何用不到 1 美元/天运行 4 个 AI 模型，并使用构建时静态数据',
    category: 'infrastructure',
    description:
      '运行多模型 AI 技术栈的实用指南。如何将任务路由到合适的模型、在构建时生成静态 JSON 使仪表盘在 Vercel 上运行，以及在不牺牲关键质量的前提下将 API 成本降低 99%。',
    keywords: [
      'multi model ai optimization',
      'ai model cost optimization',
      'ollama local model',
      'build time static json',
      'vercel static data generation',
      'ai agent cost reduction',
      'multi model stack',
      'ai model routing',
    ],
    difficulty: 'advanced',
    related: [
      'model-selection',
      'cron-jobs',
      'deployments-vercel',
      'skills',
    ],
    sections: [
      {
        heading: '单一模型的问题',
        type: 'prose',
        content:
          '大多数人选择一个 AI 模型用于所有场景。这就像用大锤来挂相框 - 能用，但你在多花钱和过度建设。我曾经用 Claude Opus 处理 104 个每日定时 API 调用，输出价格为 $75/百万 token。WhatsApp 自聊循环产生了级联回复。账单是每天 50 美元，而这些工作一个本地 14B 模型就能处理。解决方案不是停止使用 AI，而是根据一个问题将每个任务路由到合适的模型：有人类会阅读这个输出吗？',
      },
      {
        heading: '四模型阵容',
        type: 'pattern',
        content:
          '<strong>1. Ollama / Qwen 2.5 14B（免费，本地）</strong><br/>在 Mac Mini M4 Pro 上运行。处理所有重复性定时任务：提交追踪、RSS 监控、仪表盘数据生成、状态报告。这些任务每天运行 4 次以上。按 Opus 定价，这意味着 96 次 API 调用在为结构化数据提取烧真金白银，而一个 14B 模型完全能胜任。M4 Pro 配 24GB 内存运行约 9GB 显存。<br/><br/><strong>2. Claude Sonnet 4（$15/百万输出 token）</strong><br/>所有对话、编排和代理协调。这是主代理。聊天、WhatsApp、Discord、记忆管理。Sonnet 比 Opus 便宜 5 倍，但处理对话同样出色。质量差异只在长篇内容创作中才有体现。<br/><br/><strong>3. Claude Opus 4（$75/百万输出 token）</strong><br/>仅用于内容创作。博文、Substack 文章、LinkedIn 草稿、深度分析。内容创作是模型质量直接影响输出质量的领域。在 2000 字的文章中你能感受到差异。对于提交摘要？零差异。<br/><br/><strong>4. Claude Code / Opus 4.6（免费，Max 订阅）</strong><br/>基础设施层。调试、部署、Git 操作、架构决策、对其他模型输出的质量审查。通过订阅无限使用，无按 token 计费。这是你做重活的地方。',
      },
      {
        heading: '决策框架',
        type: 'formula',
        content:
          '一个问题决定选择哪个模型：输出质量对人类读者重要吗？<br/><br/><strong>定时任务（追踪、监控、更新）</strong> -> Ollama 本地。运行频繁，输出是结构化数据，质量不重要。<br/><strong>对话、路由、记忆</strong> -> Sonnet。足以应对实时交互，比 Opus 便宜 5 倍。<br/><strong>博文、文章、内容</strong> -> Opus。质量就是产品，人类会阅读。<br/><strong>基础设施、调试、部署</strong> -> Claude Code。订阅免费，需要完整的代码库上下文。<br/><br/>如果没有人类阅读输出，使用最便宜的可用模型。如果有人类阅读输出，使用你能负担得起的最好模型。如果涉及基础设施，使用 Claude Code。',
      },
      {
        heading: '构建时静态 JSON 模式',
        type: 'pattern',
        content:
          '这是让仪表盘在 Vercel 上运行的关键架构模式。问题：读取本地文件（如 <code>~/.openclaw/workspace/HEARTBEAT.md</code>）或运行 <code>execSync("git log")</code> 的 API 路由在本地完美工作，但在 Vercel 上完全崩溃。构建服务器无法访问你的笔记本文件系统。<br/><br/>解决方案：在构建时生成静态 JSON。提交 JSON。Vercel 直接提供服务。<br/><br/>生成器脚本读取所有本地数据源（Markdown 文件、定时任务配置、Git 日志）并将结构化 JSON 写入 <code>public/data/*.json</code>。API 路由从这些 JSON 文件读取，而不是从绝对路径读取。生成器在 <code>prebuild</code> 中运行，因此每次部署都能获取最新数据。定时任务重新生成数据、提交并推送。推送触发 Vercel 以更新后的数据重新构建。<br/><br/>五个 JSON 文件覆盖整个仪表盘：<code>tasks.json</code> 来自 HEARTBEAT.md 复选框，<code>calendar.json</code> 来自 Git 提交和定时计划，<code>memories.json</code> 来自工作区记忆文件，<code>team.json</code> 来自定时任务模型统计，<code>status.json</code> 来自状态更新 Markdown。',
      },
      {
        heading: 'API 路由如何改变的',
        type: 'code',
        content:
          '之前：每个 API 路由都有硬编码的绝对路径和 shell 命令。<br/><br/><code>const heartbeatPath = "/Users/shawnos.ai/.openclaw/workspace/HEARTBEAT.md"</code><br/><code>execSync("git log --since=...", { cwd: "/Users/shawnos.ai/shawn-gtme-os" })</code><br/><code>const jobsPath = "/Users/shawnos.ai/.openclaw/cron/jobs.json"</code><br/><br/>之后：每个 API 路由从相对的静态 JSON 文件读取。<br/><br/><code>const dataPath = path.join(process.cwd(), "public/data/tasks.json")</code><br/><code>const data = JSON.parse(fs.readFileSync(dataPath, "utf8"))</code><br/><code>return data.tasks || []</code><br/><br/>没有 execSync。没有绝对路径。没有文件系统依赖。在任何地方都能运行。生成器脚本在构建时处理所有本地文件系统访问，因此生产环境的 API 永远不需要它。',
      },
      {
        heading: '保持数据新鲜',
        type: 'pattern',
        content:
          '生成器在两个地方运行。首先，package.json 中的 <code>prebuild</code> 在 <code>next build</code> 之前运行，因此每次部署都能获取最新数据。其次，本地机器上的定时任务运行生成器、提交新的 JSON 并推送到 GitHub。推送触发 Vercel 部署。<br/><br/>数据新鲜度取决于定时频率。每 30 分钟意味着仪表盘永远不会过时超过 30 分钟。对于状态仪表盘来说，这完全足够了。你不需要 WebSocket 或实时订阅。定时任务加 Git 推送加重新构建，简单、可靠且免费。',
      },
      {
        heading: '实际节省了多少',
        type: 'pro-tip',
        content:
          '之前：全部用 Opus。104 次每日定时 API 调用，输出价格 $75/百万 token。WhatsApp 自聊循环产生级联回复。API 成本约 50 美元/天。<br/><br/>之后：96 次定时调用迁移到免费的本地 Ollama。8 次剩余 API 调用使用 Sonnet，价格 $15/百万。内容创作使用 Opus，每天 1-2 次调用。自聊循环用 3 秒防抖消除。API 成本约 0.50 美元/天。<br/><br/>这是 99% 的成本降低。在关键处保持了相同的输出质量。仪表盘在 Vercel 上运行。团队花名册显示来自真实定时任务数据的实际模型统计。任务面板读取 HEARTBEAT.md 中的真实复选框。没有模拟数据。没有本地依赖。直接上线。',
      },
      {
        heading: '常见错误',
        type: 'anti-pattern',
        content:
          '<strong>所有任务都用 Opus。</strong>最大的烧钱坑。大多数任务不需要前沿级别的推理能力。一个 14B 本地模型处理结构化数据提取完全没问题。<br/><br/><strong>从无服务器函数读取本地文件。</strong>你的生产服务器不是你的笔记本电脑。绝对路径在 Vercel、AWS Lambda 或任何云平台上都会失败。在部署前生成数据。<br/><br/><strong>数据缺失时没有回退。</strong>始终返回空数组而不是崩溃。如果 tasks.json 还不存在，返回 []。仪表盘应该渲染为空，而不是报错。<br/><br/><strong>在 API 路由中运行 Git 命令。</strong>execSync("git log") 在本地工作但在生产环境中失败，因为那里没有 Git 仓库。将其移到构建时。<br/><br/><strong>过度设计刷新机制。</strong>状态仪表盘不需要 WebSocket。定时任务加 Git 推送加重新构建，简单且可靠。',
      },
    ],
  },

  {
    id: 'cli-first-philosophy',
    title: 'CLI 优先理念',
    subtitle: '为什么终端访问最重要以及自然语言 CLI 如何改变一切',
    category: 'foundations',
    description:
      'GTM 工程师的 CLI 优先理念。为什么 CLI 访问的摩擦最小、MCP 如何消耗上下文、哪些工具现在有 CLI，以及通过 Claude Code 实现的自然语言 CLI 未来。',
    keywords: [
      'cli first',
      'cli philosophy',
      'terminal first',
      'cli vs gui',
      'natural language cli',
      'claude code cli',
      'cli access gtm',
    ],
    sections: [
      {
        heading: '为什么 CLI 访问最重要',
        type: 'prose',
        content:
          'CLI 访问是从意图到行动之间摩擦最小的路径。输入命令，获得结果。不用点击菜单，不用等待页面加载，不用导航仪表盘。文本输入，文本输出。<br/><br/>对于 AI 代理来说，这更加重要。AI 代理处理文本，CLI 输出文本。接口是原生的。当 Claude Code 运行 Vercel CLI 命令时，它直接读取输出。不需要浏览器自动化，不需要截图解析，不需要 DOM 遍历。只有文本。<br/><br/>MCP 赋予了我们对外部工具的程序化访问，但它们有代价。每个 MCP 服务器都会将其工具定义加载到上下文窗口中。5 个 MCP 服务器各有 20 个工具，在你提问之前就消耗了 20,000-50,000 个 token。你机器上的 CLI 二进制文件在使用前的上下文成本为零。数学很清楚：对于大多数操作，CLI 访问更便宜、更快、更可靠。',
      },
      {
        heading: '哪些工具现在有 CLI',
        type: 'pattern',
        content:
          'CLI 生态正在快速扩展。Vercel CLI 部署网站和管理基础设施。Salesforce CLI (sf) 是最成熟的 GTM CLI - 从终端完成完整的 CRM 操作。HubSpot CLI (hs) 处理 CRM 对象和报告。GitHub CLI (gh) 管理仓库、PR 和 issues。Attio 正在构建 CLI 访问。Cargo.ai 通过终端命令暴露流水线操作。<br/><br/>规律是：每个提供 CLI 的平台都在发出信号，程序化访问是一等公民。他们是为自动化而构建的，不只是为人类操作员。如果你使用的工具没有 CLI，检查它是否有 API。如果有 API，Claude Code 可以直接调用。CLI 只是 API 调用的便捷包装器。',
      },
      {
        heading: '自然语言 CLI 的未来',
        type: 'pro-tip',
        content:
          'Claude Code 是一个自然语言 CLI。你不需要记住 sf data query "SELECT Id FROM Account WHERE CreatedDate = TODAY"，只需说"拉取今天创建的所有 Salesforce 客户"。Claude Code 编写命令、运行命令并解释输出。<br/><br/>这改变了谁能使用 CLI。你不需要记语法，不需要读 man 手册。用自然语言描述你的意图，代理会将其翻译成正确的工具的正确命令。<br/><br/>复合效应：每个新发布的 CLI 都立即变得可用。一个新工具带着 CLI 发布？Claude Code 基于其对 CLI 模式的训练知识，在第一天就能使用它。"这个工具存在"和"我能用这个工具"之间的障碍降到了零。',
      },
    ],
    related: ['terminal-and-cli', 'mcp-servers', 'context-engineering'],
    difficulty: 'beginner',
  },

  {
    id: 'co-work-sessions',
    title: 'Claude Code 协作工作',
    subtitle: '共享文件夹会话将被动文档变成主动工作手册',
    category: 'modes',
    description:
      'Claude Code 协作工作会话如何运作。共享文件夹上下文、SDR 现在应该如何工作、主动工作手册对比被动文档，以及为什么代码仓库就是入职培训。',
    keywords: [
      'claude code co-work',
      'co-work sessions',
      'shared ai context',
      'active playbooks',
      'team ai workflow',
      'claude code collaboration',
      'repo as onboarding',
    ],
    sections: [
      {
        heading: '什么是协作工作会话',
        type: 'prose',
        content:
          '协作工作会话是一个指向共享代码仓库的 Claude Code 实例。每个团队成员获得相同的上下文：CLAUDE.md 规则、技能、数据文件、语音系统。AI 在会话开始时读取你的工作手册。它不仅仅是存储它们 - 它执行它们。<br/><br/>传统的团队文档会腐烂。六个月前写的 Confluence 页面。没人更新的 Notion wiki。版本冲突的 Google Docs。协作工作文件夹不同，因为文档就是自动化。描述如何调研潜在客户的技能文件同时也执行该调研。解释数据充实流程的工作流同时也执行数据充实。',
      },
      {
        heading: 'SDR 现在应该如何工作',
        type: 'pattern',
        content:
          '放置一个包含以下内容的文件夹：CLAUDE.md（团队规则、语音、护栏）、scripts/（数据充实、评分、活动自动化）、skills/（调研、外联、管道审查）、data/（目标客户、充实结果）。<br/><br/>新 SDR 加入。在文件夹中打开 Claude Code。说"调研 Acme 公司用于外联"。代理运行调研技能 - 拉取 Exa 情报、通过 Apollo 充实数据、检查 Attio 历史记录、生成简报。SDR 在阅读任何一份入职文档之前就已经交付了工作。<br/><br/>这就是主动工作手册模式。仓库就是入职培训。上下文通过交接文件在会话之间积累。每次会话都建立在上一次的基础上。',
      },
      {
        heading: '主动工作手册 vs 被动文档',
        type: 'pro-tip',
        content:
          '被动文档："要调研潜在客户，检查 LinkedIn，查看融资情况，在 BuiltWith 上审查技术栈，在 Google Docs 中总结。"<br/><br/>主动工作手册：一个 Claude Code 读取并执行的技能文件。通过浏览器检查 LinkedIn，从 Exa 获取融资信息，通过 API 查询 BuiltWith，将总结写入调研文件夹。相同的工作流。一个需要人类遵循步骤，另一个需要人类说"调研这家公司"。<br/><br/>你组织中的每一份被动文档都是转换的候选对象。识别步骤，写成技能文件，测试，部署到共享文件夹。文档变成了自动化。知道该做什么和做到之间的差距缩小到零。',
      },
    ],
    related: ['skills', 'context-handoffs', 'parallel-agents'],
    difficulty: 'intermediate',
  },
]

export const CATEGORIES_ZH: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'foundations',
    label: '基础概念',
    description:
      '什么是上下文工程、如何构建上下文仓库，以及如何组织知识让 AI 真正使用它',
    prompt: '$ cd ~/context-wiki/foundations/',
  },
  {
    id: 'modes',
    label: '模式与工作流',
    description:
      '如何理解计划模式、代理模式、并行执行、技能和模型选择',
    prompt: '$ cd ~/context-wiki/modes/',
  },
  {
    id: 'infrastructure',
    label: '基础设施',
    description:
      '面向 GTM 工程师的 Git、GitHub、部署、monorepo 和定时自动化',
    prompt: '$ cd ~/context-wiki/infrastructure/',
  },
  {
    id: 'code',
    label: '代码与自动化',
    description:
      'Python 脚本、MCP 服务器、项目配置和技能树可视化',
    prompt: '$ cd ~/context-wiki/code/',
  },
]

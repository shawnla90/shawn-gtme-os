/**
 * ShawnOS - Context Wiki Data (Simplified Chinese, Part 1)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { ContextWikiEntry } from './context-wiki'

export const PART1: ContextWikiEntry[] = [
  /* ================================================================== */
  /*  FOUNDATIONS                                                        */
  /* ================================================================== */

  {
    id: 'context-engineering',
    title: '上下文工程',
    subtitle: '用正确的信息填充上下文窗口的艺术',
    category: 'foundations',
    description:
      '什么是上下文工程，它与提示词工程有何不同，以及它为何彻底改变了与 AI 代理协作的方式。这是整个 GTM OS 背后的基础概念。',
    keywords: [
      'context engineering',
      'context engineering claude code',
      'ai context window',
      'prompt engineering vs context engineering',
      'context engineering gtm',
      'karpathy context engineering',
    ],
    difficulty: 'intermediate',
    related: ['context-repository', 'grounding', 'taxonomy', 'claude-md'],
    sections: [
      {
        heading: '上下文工程到底是什么',
        type: 'prose',
        content:
          'Andrej Karpathy 将其称为"用恰到好处的信息为下一步填充上下文窗口的艺术"。这是我见过最好的一句话定义。上下文工程不是写更好的提示词。它是在 AI 看到你的提示词之前，架构好 AI 能访问的信息。同一个 AI 模型加上差劲的上下文等于千篇一律的垃圾。同一个 AI 模型加上丰富、结构化的上下文等于听起来像你、了解你的业务、无需手把手指导就能执行你的工作流的输出。大多数人完全跳过了这一步。他们打开 Claude，从头开始重新解释整个业务，然后纳闷为什么输出感觉很肤浅。这不是 AI 的问题。这是上下文的问题。',
      },
      {
        heading: '上下文工程 vs 提示词工程',
        type: 'pattern',
        content:
          '提示词工程是精心设计问题。上下文工程是在你提问之前架构好 AI 所知道的一切。可以这样理解。提示词工程："帮我写一封给 SaaS 公司销售副总裁的冷邮件。" 上下文工程：加载你的 ICP 定义、角色画像层级、语音指南、消息框架，以及三封获得回复的邮件范例。然后说"写那封冷邮件"。提示词只有一句话。上下文是其他所有东西。大多数人专注于提示词而忽略了上下文。这就像给新员工完美的指令却没有任何入职培训。如果他们不了解你的业务，再好的指令也没用。',
      },
      {
        heading: '我每天如何实践',
        type: 'pro-tip',
        content:
          '我的整个 GTM OS 仓库就是一个上下文工程系统。CLAUDE.md 加载环境默认值。Skills 加载工作流指令。Rules 加载文件特定的模式。合作伙伴文件夹为每个客户加载 ICP、角色画像和消息框架。当我输入 /deploy 时，Claude 已经知道 Git 工作流、Vercel 设置、三个域名和构建验证步骤。我没有在提示词中解释这些。它们已经在上下文窗口中了。这就是使用 AI 和工程化 AI 的区别。如果你每次会话都在向 Claude 解释同样的东西，那你做的恰恰是上下文工程的反面。',
      },
      {
        heading: '复利效应',
        type: 'pattern',
        content:
          '上下文工程会产生复利效应。你写的每一份语音文件都让未来的内容变得更好。你构建的每一个技能都让未来的工作流更快。你组织的每一个合作伙伴文件夹都让未来的入职流程更清晰。你不只是在为今天的会话而构建。你在构建一个每次使用都变得更智能的系统。我的仓库从一个 CLAUDE.md 和三个技能开始。现在它有 40 多个技能、完整的语音系统、合作伙伴工作流、RPG 进度系统和自动化仪表板。每一个部分都让其他每个部分运转得更好。这就是上下文工程的复利效应。第一个月很慢。第六个月就不可思议了。',
      },
    ],
  },

  {
    id: 'context-repository',
    title: '上下文仓库',
    subtitle: 'GitHub 仓库中的 Markdown 文件，为 AI 提供所需的一切',
    category: 'foundations',
    description:
      '如何构建和维护上下文仓库。用于产品、角色画像、消息框架和语音的 Markdown 文件，让所有 AI 系统都能访问。你的 GTM 运作的唯一事实来源。',
    keywords: [
      'context repository',
      'ai context repo',
      'gtm context repository',
      'markdown ai context',
      'context repo github',
      'ai knowledge base',
    ],
    difficulty: 'beginner',
    related: ['context-engineering', 'taxonomy', 'github-repos', 'claude-md'],
    sections: [
      {
        heading: '什么是上下文仓库',
        type: 'prose',
        content:
          '上下文仓库是 GitHub 仓库中的一组 Markdown 文件，包含你的 AI 系统需要知道的一切。产品、角色画像、消息框架、语音指南、工作流文档、合作伙伴详情。你更新一次这些文件，每个触及你仓库的 AI 代理都会自动获取最新版本。无需在聊天窗口中复制粘贴上下文。无需每次会话都重新解释你的业务。仓库就是上下文。我的整个 GTM OS 仓库就是一个上下文仓库。每个技能文件、每份语音指南、每个合作伙伴研究文件夹。它不是我在工作之外另外维护的东西。它本身就是工作。',
      },
      {
        heading: 'AI 协作的四个阶段',
        type: 'pattern',
        content:
          '阶段 1：我做，AI 协助起草。你写内容，AI 建议修改。大多数人停留在这里。\n阶段 2：AI 监控并发现偏差。AI 监视你的仓库查找不一致之处。消息框架变了但邮件模板没更新？AI 标记出来。\n阶段 3：AI 做更改，我通过 PR 审批。AI 提出更新，你审查并合并。这是最佳平衡点。90% 的效率加上 100% 的控制。你不是在交出钥匙。你是在审查工作。\n阶段 4：AI 做所有事，无需人类审查。全自动驾驶。对面向客户的内容来说风险较高。对内部自动化（如仪表板和数据同步）很有用。\n\n我的大多数工作流运行在阶段 3。Claude 写代码、写内容、写营销文案。我审查、调整、批准。上下文仓库使阶段 3 成为可能，因为 Claude 有足够的上下文来产出值得审查的工作。',
      },
      {
        heading: '仓库里放什么',
        type: 'pattern',
        content:
          '至少需要：一个 CLAUDE.md（环境默认值和代码风格）、一份语音指南（你的表达方式）、产品文档（你卖什么）、ICP 定义（你卖给谁）、角色画像层级（你和谁对话）、以及工作流文档（你怎么运作）。在此之上：带有研究资料的合作伙伴文件夹、每个重复工作流的技能文件、文件特定模式的规则文件、内容草稿和已发布存档、以及营销文案模板。你放得越多，需要解释的就越少。解释越少，速度越快。我的仓库有 40 多个技能、完整的语音系统和每个合作伙伴的研究文件夹。Claude 不需要简报。它直接读文件。',
      },
      {
        heading: '为什么选择 Markdown',
        type: 'pro-tip',
        content:
          'Markdown 是带有简单格式的纯文本。人类可读，AI 可解析，可在 Git 中进行版本控制，可渲染为 HTML。没有需要担心的专有格式。没有平台锁定。没有转换步骤。你在任何文本编辑器中编写，提交到 Git，每个 AI 工具都能原生读取。我见过团队试图用 Notion 或 Google Docs 作为上下文层。问题在于访问。AI 代理在工作流中无法方便地读取 Notion 页面。但它们可以即时读取你仓库中的 Markdown 文件。保持简单。保持在仓库中。',
      },
    ],
  },

  {
    id: 'grounding',
    title: '接地',
    subtitle: '如何让 AI 停止猜测，开始执行',
    category: 'foundations',
    description:
      'AI 代理的接地技术。上下文敏感度、假设枚举和领域知识查询。如何防止幻觉并从 Claude 获得可靠输出。',
    keywords: [
      'ai grounding',
      'claude hallucination prevention',
      'ai grounding techniques',
      'context sensitivity ai',
      'stop ai hallucinating',
      'grounding claude code',
    ],
    difficulty: 'advanced',
    related: [
      'context-engineering',
      'context-repository',
      'claude-md',
      'skills',
    ],
    sections: [
      {
        heading: '接地的含义',
        type: 'prose',
        content:
          '接地是你阻止 AI 凭空捏造的方法。当 Claude 没有足够的上下文时，它会用听起来合理的猜测来填补空白。有时这些猜测是对的。但往往不是。接地意味着给模型足够多的真实、具体信息，使它不需要猜测。区别在于"帮我写一封冷邮件"（未接地，Claude 会发明你的价值主张）和"这是我的 ICP、我的角色画像层级、我的消息框架，以及三封获得回复的邮件范例，现在写那封冷邮件"（已接地，Claude 基于真实数据工作）。',
      },
      {
        heading: '三个核心实践',
        type: 'pattern',
        content:
          '上下文敏感度：在给 Claude 任务之前，问问自己这有多难，模型需要多少独特信息。简单的格式化任务几乎不需要上下文。编写合作伙伴入职工作流需要你完整的 ICP、角色画像和消息框架。将上下文与复杂度相匹配。\n\n假设枚举：让模型在执行之前列出它的假设。要求 Claude 明确说明其假设。隐式假设变成显式的。显式假设变成可处理的。你在错误假设污染输出之前就发现了它们。\n\n领域知识查询：给 Claude 完成任务所需的具体信息。不要让它猜测你的产品定位。不要让它推断你的 ICP。加载文件。指向数据。模型的质量取决于你放进上下文窗口的内容。',
      },
      {
        heading: '我如何为 Claude 接地',
        type: 'pro-tip',
        content:
          '我通过将整个仓库作为上下文加载来为 Claude 接地。我的 CLAUDE.md 设定默认值。我的技能定义工作流。我的规则文件按文件类型强制执行模式。我的语音指南控制语气。我的合作伙伴文件夹包含每个客户的 ICP、角色画像和消息框架。Claude 不猜测，因为它需要的一切都已经在上下文窗口中了。当我运行 /partneronboard 时，Claude 读取合作伙伴的研究文件夹，提取 ICP 标准，构建资格认证提示，并搭建整个工作流。它不发明标准。它读文件。这就是实践中的接地。',
      },
      {
        heading: '接地何时失效',
        type: 'anti-pattern',
        content:
          '接地在你假设模型知道它不知道的事情时失效。常见的失败情况：要求 Claude 用你的语气写作却没有加载语音指南。要求它筛选潜在客户却没有加载 ICP 定义。要求它遵循工作流却没有加载技能文件。这些都迫使 Claude 去猜测。而 Claude 非常擅长自信地猜测，这使得失败更难被发现。如果输出看起来合理但感觉不对，问题几乎总是缺少上下文。不是差劲的提示词。不是差劲的模型。是缺少上下文。',
      },
      {
        heading: '接地检查清单',
        type: 'formula',
        content:
          '在给 Claude 任何非简单任务之前，检查以下五项：\n1. Claude 是否拥有所需的特定领域数据？（ICP、角色画像、产品文档）\n2. Claude 是否知道使用什么语气或风格？（语音指南已加载）\n3. Claude 是否知道输出格式？（提供了示例或 schema）\n4. Claude 是否已说明其假设？（执行前先问它）\n5. 任务复杂度是否与上下文深度匹配？（简单任务 = 轻量上下文，复杂任务 = 完整上下文）\n\n如果你检查了所有五项，输出就会是接地的。如果你跳过任何一项，你就是在赌 Claude 的猜测。',
      },
    ],
  },

  {
    id: 'taxonomy',
    title: '分类法',
    subtitle: '你组织文件的方式就是上下文工程',
    category: 'foundations',
    description:
      '为什么文件组织和命名约定是上下文工程的基础。文件夹结构、可预测的命名和一致的模式如何让 AI 代理显著提高效率。',
    keywords: [
      'ai taxonomy',
      'repo organization ai',
      'file structure context engineering',
      'naming conventions ai',
      'folder structure ai agents',
      'taxonomy context repo',
    ],
    difficulty: 'beginner',
    related: [
      'context-repository',
      'context-engineering',
      'github-repos',
      'grounding',
    ],
    sections: [
      {
        heading: '结构就是上下文',
        type: 'prose',
        content:
          '你组织文件的方式就是上下文工程。如果你的仓库一团糟，你的 AI 输出也会一团糟。不是因为模型被混乱的文件夹搞糊涂了。而是因为混乱的文件夹意味着模型找不到它需要的东西、加载了错误的文件，或者完全跳过了上下文。可预测的结构意味着可预测的结果。当每个合作伙伴文件夹都有相同的子文件夹（research/、prompts/、workflows/、resources/）时，Claude 确切知道去哪里找 ICP 定义、营销文案和资格认证提示。它不搜索。它不猜测。它去可预测的位置读取文件。',
      },
      {
        heading: '我的仓库分类法',
        type: 'pattern',
        content:
          'content/drafts/ 存放进行中的工作。content/published/ 存放已发布的带日期前缀的文章。partners/{name}/research/ 存放 ICP、角色画像和竞争情报。partners/{name}/prompts/ 存放 Clay 资格认证和研究提示。partners/{name}/workflows/ 存放营销序列和路由逻辑。skills/ 将每个可重用的工作流存为 SKILL.md 文件。data/ 存放生成的资产如仪表板和进度统计。scripts/ 存放 Python 自动化脚本。\n\n每个文件夹都有明确的用途。每个文件都有可预测的名称。当我告诉 Claude "检查合作伙伴研究"时，它确切知道去哪里找，因为每个合作伙伴的结构都一样。这种一致性就是分类法。',
      },
      {
        heading: '命名约定很重要',
        type: 'pro-tip',
        content:
          '日期前缀的草稿：2026-02-16_topic-name.md。这按时间排序并告诉 Claude 写作时间。合作伙伴文件夹使用小写短横线：partners/acme/、partners/contax/。技能文件在命名文件夹内始终为 SKILL.md：skills/deploy/SKILL.md、skills/tracker/SKILL.md。脚本使用下划线命名：daily_scan.py、rpg_sprites.py。\n\n命名约定不是为了美观。而是为了可预测性。当 Claude 需要找到部署技能时，它查找 skills/deploy/SKILL.md。不是 deploy-skill.md。不是 DeploySkill.md。不是 deploy.skill。一种模式。每次都一样。可预测性消除了搜索时间和虚构的文件路径。',
      },
      {
        heading: '反模式：平铺文件堆积',
        type: 'anti-pattern',
        content:
          '最糟糕的做法是把所有东西都扔在一个文件夹里。我见过根目录有 200 个文件的仓库。没有子文件夹。没有命名约定。文件名像"final_v2_ACTUAL.md"和"notes_old_backup.txt"。Claude 无法理解那些。你也不能。如果你不能在 5 秒内通过浏览文件夹树找到一个文件，你的分类法就是有问题的。在添加更多内容之前先修复结构。一个干净的 20 个文件的仓库会胜过一个混乱的 200 个文件的仓库。',
      },
    ],
  },

  /* ================================================================== */
  /*  MODES                                                              */
  /* ================================================================== */

  {
    id: 'plan-mode',
    title: '计划模式',
    subtitle: 'Claude 在触碰任何东西之前先思考的只读模式',
    category: 'modes',
    description:
      '如何在 Claude Code 和 Cursor 中使用计划模式。执行之前的只读探索、研究和步骤规划。复杂任务成功的关键。',
    keywords: [
      'claude plan mode',
      'cursor plan mode',
      'ai plan before execute',
      'claude code plan mode',
      'plan mode context engineering',
    ],
    difficulty: 'beginner',
    related: ['agent-mode', 'parallel-agents', 'model-selection', 'skills'],
    sections: [
      {
        heading: '什么是计划模式',
        type: 'prose',
        content:
          '计划模式是只读模式。Claude 探索你的代码库、读取文件、研究模式、规划步骤，而不触碰任何东西。不编辑文件。不修改代码。不运行会改变状态的命令。只是思考。在 Cursor 中，你可以切换到计划模式来强制代理在行动前先分析。在 Claude Code 中，Shift+Tab 可以切换。关键洞察：在计划模式下，Claude 会问澄清性问题而不是做假设。仅此一点就值得在任何复杂任务中使用它。',
      },
      {
        heading: '何时使用计划模式',
        type: 'pattern',
        content:
          '在有多种有效方案或重大权衡的情况下使用计划模式。构建一个涉及多个文件的新功能。重构数据模型。从零开始架构一个营销工作流。调试一个你还不完全理解的问题。\n\n不要对简单、定义明确的任务使用计划模式。如果你确切知道需要改什么、在哪改，直接进入代理模式。重命名变量、修复拼写错误、添加单个字段。这些不需要计划。\n\n经验法则：如果任务可能出错的方式不止一种，先做计划。如果任务很直接，直接执行。',
      },
      {
        heading: '我如何使用计划模式',
        type: 'pro-tip',
        content:
          '我对任何复杂任务都使用计划模式。但我不只是说"做个计划"。我特别指示 Claude 告诉我它将使用哪些代理、每个代理需要什么上下文、以什么顺序运行、哪些任务可以并行。这就是上下文工程的实际应用。你在工程化那个工程化上下文的计划。当我构建 Clay Wiki 时，计划模式的输出准确地告诉我每个代理将创建哪些文件、哪些现有文件需要编辑，并确认所有四个代理可以并行运行因为它们操作不同的文件。没有那个计划，我会启动互相干扰的代理。',
      },
      {
        heading: '计划模式的输出格式',
        type: 'pattern',
        content:
          '好的计划模式输出包括：(1) 要创建的文件，含完整路径。(2) 要修改的文件，以及需要什么更改。(3) 任务之间的依赖关系。哪些必须先运行？哪些可以并行？(4) 每个任务的模型推荐。繁重的创意工作用默认模型。复制粘贴适配的工作用快速模型。(5) 验证步骤。执行后如何确认一切正常？\n\n如果你的计划模式输出只是一个模糊步骤的编号列表，说明你没有给 Claude 足够的上下文。加载相关文件，解释架构，重新提问。计划的质量取决于你提供的上下文。计划也是上下文工程。',
      },
    ],
  },

  {
    id: 'agent-mode',
    title: '代理模式',
    subtitle: 'Claude 读取、编写和构建的执行模式',
    category: 'modes',
    description:
      '代理模式在 Claude Code 和 Cursor 中如何运作。AI 读取文件、编写代码、运行命令和构建功能的默认执行模式。如何最大化利用它。',
    keywords: [
      'claude agent mode',
      'cursor agent mode',
      'ai agent execution',
      'claude code agent',
      'agent mode context engineering',
    ],
    difficulty: 'beginner',
    related: ['plan-mode', 'parallel-agents', 'skills', 'model-selection'],
    sections: [
      {
        heading: '什么是代理模式',
        type: 'prose',
        content:
          '代理模式是默认的执行模式。Claude 读取文件、编写代码、运行终端命令、创建新文件、修改现有文件，并端到端地构建功能。这是工作真正完成的模式。Joe Rhew 将其描述为"需要入职培训的队友"。这是正确的心智模型。你不会在没有提供产品、角色画像和消息框架背景的情况下就把新员工扔进你的 GTM 运作中。代理也一样。代理模式输出的质量完全取决于你在执行开始前提供的上下文。',
      },
      {
        heading: '入职培训心智模型',
        type: 'pattern',
        content:
          '把每次代理模式会话想象成为新队友做入职培训。他们需要知道什么？你的产品（你卖什么、卖给谁）。你的语气（你如何沟通）。你的工作流（事情如何完成）。你的约束（避免什么、遵循什么格式）。如果你跳过入职培训，代理就会做假设。有些是对的。很多不是。最糟糕的是代理模式的假设看起来很自信。输出读起来很好。只是与你的实际情况不符。预先加载上下文。让代理从知识的角度执行，而不是从猜测的角度。',
      },
      {
        heading: '代理模式取决于之前发生了什么',
        type: 'pro-tip',
        content:
          '如果你在复杂任务上跳过了计划模式，代理模式会冲上去做假设。它会在没有评估替代方案的情况下选择一种方法。它会在没有检查是否存在类似文件的情况下创建文件。它会写出能运行但不符合你架构的代码。如果你先做了计划，代理模式就会干净地执行。它遵循计划。它在正确的位置创建正确的文件。它使用你已经建立的模式。计划不是浪费时间。它是让代理模式有效的上下文。',
      },
      {
        heading: '代理模式中的常见错误',
        type: 'anti-pattern',
        content:
          '给模糊指令却期望具体输出。"让网站看起来更好"是不可操作的。"将主区域背景改为深色，标题字号增加到 3rem，添加 2rem 内边距"是可操作的。\n\n在要求修改之前没有加载相关文件。如果你想让 Claude 匹配你现有的代码模式，确保它已经读取了现有代码。\n\n让代理模式运行太久而不检查输出。每个主要步骤之后都审查。尽早纠正方向。第 1 步的一个小误解到第 10 步会复合成一个大问题。',
      },
    ],
  },

  {
    id: 'parallel-agents',
    title: '并行代理',
    subtitle: '在独立任务上同时运行多个 AI 代理',
    category: 'modes',
    description:
      '如何运行并行 AI 代理以获得最大速度。识别独立任务、启动并发代理和避免冲突。将 45 分钟构建缩短为 10 分钟的模式。',
    keywords: [
      'parallel agents ai',
      'concurrent ai agents',
      'parallel agents claude',
      'multi agent ai',
      'parallel execution ai',
      'parallel agents context engineering',
    ],
    difficulty: 'intermediate',
    related: ['plan-mode', 'agent-mode', 'skills', 'model-selection'],
    sections: [
      {
        heading: '什么是并行代理',
        type: 'prose',
        content:
          '并行代理意味着同时在不同任务上运行多个 AI 代理。不是按顺序。不是一个接一个。全部同时进行。关键词是独立。如果代理 A 需要代理 B 的输出，它们就不能并行。如果它们操作不同的文件、不同的数据、不同的关注点，就同时启动它们。这是 AI 辅助开发中最大的速度倍增器。一个顺序执行需要 45 分钟的任务，用并行代理可以在 10 分钟内完成。',
      },
      {
        heading: '独立性测试',
        type: 'pattern',
        content:
          '在启动并行代理之前，对每对任务检查三件事：\n\n1. 它们是否写入相同的文件？如果是，不能并行。文件冲突会破坏输出。\n2. 一个是否需要另一个的输出？如果是，必须按顺序运行。依赖的任务在第一个完成后运行。\n3. 它们是否从尚不存在的东西导入？这更微妙。如果代理 A 创建一个数据文件而代理 B 从中导入，它们看似有依赖。但如果代理 B 是在复制一个已知模式（比如镜像一个现有的 Wiki 页面），它可以并行运行，因为导入结构在文件存在之前就是可预测的。\n\n如果三项检查都通过，并行启动。如果有任何一项不通过，按顺序执行。',
      },
      {
        heading: '我如何并行构建 Clay Wiki',
        type: 'pro-tip',
        content:
          '当我构建 Clay Wiki 时，我运行了 5 个并行代理。代理 1 编写数据文件（最重的工作，所有内容）。代理 2 构建中心页面（所有条目列表）。代理 3 构建条目页面（单篇 Wiki 文章）。代理 4 更新导出、导航和交叉链接。代理 5 验证构建。它们都在不同的文件上工作。没有一个需要等待另一个。代理 2 和 3 从代理 1 正在创建的数据文件导入，但它们镜像了一个已知模式（现有的知识页面），所以导入结构是可预测的。这将一个 45 分钟的顺序任务缩短到不到 10 分钟。五个代理，五个文件，一次构建。',
      },
      {
        heading: '并行代理的模型选择',
        type: 'pattern',
        content:
          '不是每个并行代理都需要同一个模型。编排代理（启动其他代理的那个）应该使用默认模型进行协调和复杂推理。执行简单复制粘贴适配工作的子代理可以使用快速模型。执行繁重创意工作的子代理（例如编写 17 篇 Wiki 条目）应该使用默认或更强的模型。\n\n公式：单个任务的复杂度决定模型选择。并行性决定速度。将简单任务上的快速模型与困难任务上的强力模型结合，你就能同时获得速度和质量。',
      },
      {
        heading: '反模式：什么都并行化',
        type: 'anti-pattern',
        content:
          '不是所有东西都应该并行运行。如果你启动 5 个代理，其中 3 个需要修改同一个文件，你会得到合并冲突和损坏的输出。如果你在数据文件存在之前启动一个代理来构建页面，而代理无法预测结构，它会虚构导入并在构建时失败。\n\n并行代理在任务真正独立时才有效。当它们不独立时，顺序执行不是慢。而是正确的。并行化带来的速度提升是真实的，但只有在独立性测试通过时才成立。在有依赖的任务上强行并行会创造更多工作，而不是更少。',
      },
      {
        heading: '并行代理检查清单',
        type: 'formula',
        content:
          '1. 先做计划。使用计划模式识别所有任务及其依赖关系。\n2. 将独立任务分组。这些是你的并行候选项。\n3. 将依赖任务排序。这些在其依赖项完成后运行。\n4. 分配模型。简单任务用快速模型，复杂任务用默认模型。\n5. 给每个代理具体的上下文。不要假设它们彼此共享上下文。每个代理获得自己的指令和文件引用。\n6. 所有代理完成后进行验证。运行构建。检查输出。并行代理可以各自成功但如果计划有误则整体失败。',
      },
    ],
  },

  {
    id: 'context-handoffs',
    title: '上下文交接',
    subtitle: '如何在会话之间传递上下文，让代理永远不从零开始',
    category: 'modes',
    description:
      'Claude Code 的并行安全上下文交接架构。如何从单个交接文件迁移到时间戳并行写入，在同时运行 6 个终端时也能正常工作。让会话复利增长而非重置的模式。',
    keywords: [
      'context handoffs claude code',
      'claude code session handoff',
      'parallel context handoffs',
      'agent memory between sessions',
      'context engineering handoffs',
      'claude code session persistence',
    ],
    difficulty: 'intermediate',
    related: ['parallel-agents', 'context-engineering', 'context-repository', 'claude-md'],
    sections: [
      {
        heading: '什么是上下文交接',
        type: 'prose',
        content:
          'Claude Code 会话是无状态的。关闭终端，上下文就消失了。每个新会话都从零开始。不记得你刚构建了什么、什么出了问题、做了什么决策、什么还没完成。上下文交接解决了这个问题。在每次会话结束时，写一份结构化文档，记录发生了什么、什么改变了、什么还需要做、做了什么决策。在下一次会话开始时，先读取那份文档。现在新会话就有了之前发生的完整上下文。会话不再重置，而是开始复利增长。交接不是锦上添花。它是一个会遗忘一切的 AI 和一个能在昨天基础上继续构建的 AI 之间的区别。',
      },
      {
        heading: '单文件问题',
        type: 'anti-pattern',
        content:
          '上下文交接的第一个版本总是单个文件。类似 ~/.claude/context-handoff.md。一个文件。每个会话启动时读取，结束时写入。当你一次只运行一个终端时这完全没问题。但当你打开第二个终端时就出问题了。终端 A 完成并写入它的交接。终端 B 30 秒后完成并覆盖终端 A 的。终端 A 的上下文丢失了。你直到第二天早上某个会话以缺失一半上下文的状态启动时才注意到。这是经典的最后写入者获胜的竞态条件。随着规模扩大情况更糟。我同时运行 4 到 6 个 Claude Code 终端。用单个交接文件，每天有 3 到 5 个会话的上下文被悄悄销毁。系统看起来在正常工作，因为你总能看到一个交接文件。你只是看不到它缺少了什么。',
      },
      {
        heading: '并行安全架构',
        type: 'pattern',
        content:
          '解决方案很简单。停止覆盖一个文件。改为向目录写入带时间戳的文件。每个会话写入 ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md。时间戳保证唯一性。没有两个会话会冲突。在会话启动时，读取目录中所有未消费的交接文件。合并每个文件的上下文。读取后，将每个文件从 file.md 重命名为 file_done.md，这样它不会被再次读取。清理任务删除 7 天前已消费的交接文件。整个架构是 4 个操作：写入一个唯一命名的文件、读取所有未读文件、标记文件为已消费、清理旧文件。无需数据库。无需锁文件。无需会话间协调。每个会话独立运行，目录处理合并。',
      },
      {
        heading: '流程',
        type: 'code',
        content:
          '带并行安全交接的会话生命周期：\n\n会话启动：\n  ls ~/.claude/handoffs/*.md（跳过 *_done.md）\n  --> 读取每个未消费的交接\n  --> 将 file.md 重命名为 file_done.md\n  --> 将所有上下文合并到当前会话\n\n会话结束：\n  --> 写入 ~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md\n  --> 永远不覆盖另一个会话的文件\n\n清理（定期）：\n  find ~/.claude/handoffs -name \'*_done.md\' -mtime +7 -delete\n\n并行安全来自命名约定。两个在同一秒结束的会话需要相同的 slug 才会冲突。实际上这永远不会发生，因为 slug 描述工作内容而时间戳精确到秒。',
      },
      {
        heading: '交接文档的结构',
        type: 'formula',
        content:
          '每份交接文档需要五个部分：\n\n1. 会话摘要。一段话。目标是什么、发生了什么。\n2. 变更内容。创建、修改、删除的文件。具体路径。\n3. 待完成工作。未完成的任务、已知 bug、下一步计划。\n4. 关键决策。架构选择、权衡取舍、下一个会话不应重新审视的事项。\n5. 活跃上下文。分支名称、运行中的进程、环境状态，下一个会话需要知道的关于当前机器状态的任何信息。\n\n保持事实性。没有评论，没有观点，没有叙事。交接是状态报告，不是博客文章。早上 6 点读取它的会话不需要你对重构的感受。它需要知道哪些文件改变了以及什么出了问题。',
      },
    ],
  },

  {
    id: 'skills',
    title: '技能',
    subtitle: '教 AI 代理如何执行你的工作流的 Markdown 文件',
    category: 'modes',
    description:
      '如何构建和维护 AI 代理技能。可重用的 Markdown 工作流，Claude 每次都会遵循。持续改进的铸铁锅模式。',
    keywords: [
      'ai agent skills',
      'claude skills',
      'cursor skills',
      'reusable ai workflows',
      'skill files ai',
      'skills context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'context-engineering',
      'claude-md',
      'plan-mode',
      'agent-mode',
    ],
    sections: [
      {
        heading: '什么是技能',
        type: 'prose',
        content:
          '技能是一个 Markdown 文件，记录你如何做某件事。用纯英语写一次。Claude 每次都照做。/deploy 技能知道如何在三个网站上暂存、提交、推送和验证部署。/finalcopy 技能知道你的语音指南、平台规则和反套话过滤器。/tracker 技能知道如何扫描 Git 提交、计算内容数量、计算输出分数并生成仪表板图像。技能是可移植的知识。它们将部落知识转化为可执行的自动化。',
      },
      {
        heading: '铸铁锅模式',
        type: 'pattern',
        content:
          'Joe Rhew 完美地用了这个类比。技能就像一口铸铁锅。你没有做什么特别的事。你只是在做饭。但每次使用铸铁锅时，它都会变得更有味道。一个你打磨了 20 次的技能比你第一天写的那个要好得多。而且你从未专门安排时间去改进它。你只是使用它，发现一个边界情况，修复那个边界情况，技能就变得更好了。\n\n我的 /deploy 技能开始时只有 10 行：暂存、提交、推送。现在它处理提交消息生成、三个站点的构建验证、错误恢复和部署后确认。我从未安排时间去改进它。我只是部署了 50 次，修复了出现的问题。',
      },
      {
        heading: 'SOP 已死',
        type: 'pro-tip',
        content:
          '标准操作流程是为人类编写的，让他们一步一步跟着做。它们会过时。人们会跳步骤。没人去更新它们。技能完全取代了 SOP。你不再写一个让人类阅读并遵循（会出错）的文档，而是写一个代理执行（不会出错）的技能。技能集 SOP、执行者和质量检查于一个文件之中。\n\n我的仓库中有 40 多个技能。/deploy、/tracker、/finalcopy、/substackpost、/partneronboard、/webreveal、/heyreach-export、/linkedin-recon、/daily-tracker。每个我重复超过两次的工作流都变成技能。每个我使用超过五次的技能都得到优化。结果是一个运行我整个 GTM 运作的自动化库。',
      },
      {
        heading: '优秀技能文件的结构',
        type: 'pattern',
        content:
          '一个 SKILL.md 文件需要五样东西：\n\n1. 触发描述。什么激活这个技能？斜杠命令、关键词、短语。\n2. 上下文需求。代理在执行前需要什么文件、数据或状态？明确列出它们。\n3. 分步指令。用纯英语编写。编号步骤。足够清晰，使一个没有先前对话上下文的新代理也能遵循。\n4. 输出预期。成功是什么样的？一个已部署的网站？一个生成的文件？一个已发布的草稿？\n5. 边界情况处理。什么可能出错？端口冲突、构建失败、数据缺失。代理应如何恢复？\n\n如果你的技能文件缺少其中任何一项，代理就会即兴发挥。而即兴发挥就是出问题的地方。',
      },
      {
        heading: '反模式：太模糊的技能',
        type: 'anti-pattern',
        content:
          '一个写着"部署网站"的技能文件不是技能。它是一个愿望。真正的技能会说：检查未暂存的更改、暂存所有修改的文件、从 diff 生成提交消息、用该消息提交、推送到 origin main、等待 Vercel 构建完成、检查所有三个部署 URL、确认 200 状态码、并报告结果。模糊的技能产生不一致的结果。具体的技能产生可靠的结果。编写技能时就像在为一个从未见过你代码库的承包商做入职培训。因为这正是每个新代理会话的真实情况。',
      },
    ],
  },
]

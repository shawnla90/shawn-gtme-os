/**
 * ShawnOS - Context Wiki Data (Simplified Chinese - Part 2)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { ContextWikiEntry } from './context-wiki'

export const PART2: ContextWikiEntry[] = [
  /* ================================================================== */
  /*  MODES (last entry)                                                 */
  /* ================================================================== */

  {
    id: 'model-selection',
    title: '模型选择',
    subtitle: '根据任务和预算选择合适的 AI 模型',
    category: 'modes',
    description:
      '如何根据任务复杂度和成本在不同 AI 模型之间做出选择。何时使用快速模型、何时使用强力模型。如何在不牺牲质量的前提下优化支出。',
    keywords: [
      'ai model selection',
      'claude model selection',
      'opus vs sonnet',
      'ai model cost optimization',
      'model selection context engineering',
      'choose ai model',
    ],
    difficulty: 'beginner',
    related: ['parallel-agents', 'plan-mode', 'agent-mode', 'skills'],
    sections: [
      {
        heading: '为什么模型选择很重要',
        type: 'prose',
        content:
          '不是所有 AI 模型都一样。有些速度更快、价格更低。有些更聪明、价格更高。用错了模型做任务，要么浪费钱，要么产出质量差。用强力模型做简单的格式转换任务，就像请一个高级建筑师去刷墙。用快速模型做复杂的架构任务，就像让一个实习生去设计大楼。把模型和任务匹配起来，这就是全部策略。',
      },
      {
        heading: '模型匹配框架',
        type: 'pattern',
        content:
          '快速模型（Sonnet 级别）适合：格式转换、文件模式扫描、简单代码修改、复制粘贴式的改编任务、以及直接的数据转换。这些任务输入明确、输出明确、歧义性低。\n\n强力模型（Opus 级别）适合：架构决策、复杂调试、深度研究综合分析、需要微妙语气的创意内容、以及每一步都依赖前一步的多步推理。这些任务具有歧义性、需要权衡取舍和判断力。\n\n日报追踪器记录我的模型使用情况，让我看到哪里在超支。如果我看到 Opus 级别的会话在做 Sonnet 就能处理的任务，我就调整。如果 Sonnet 级别的会话产出了垃圾结果，那就说明需要更强的模型。',
      },
      {
        heading: '并行子代理的模型选择',
        type: 'pro-tip',
        content:
          '当我启动并行代理时，我会按任务分配模型。协调代理（负责协调一切的那个）使用默认的强力模型，因为它需要推理依赖关系和上下文。做简单工作的子代理（构建一个跟现有页面一样的页面、更新配置文件、运行构建检查）使用快速模型。做重量级创意工作的子代理（比如用我的风格写 17 篇维基文章、设计新功能架构）使用强力模型。\n\n这不是为了省钱，而是为了提高效率。快速模型在简单任务上 30 秒完成，比强力模型在同样任务上花 2 分钟要好。当你同时运行 5 个代理时，速度很重要。',
      },
      {
        heading: '追踪你的支出',
        type: 'formula',
        content:
          '强力模型的会话成本大约是快速模型的 3-5 倍。一整天的构建下来，这个差距会累积。日报追踪器会计算我的模型使用情况并标记异常值。公式很简单：对每个任务问两个问题。（1）这个任务需要推理或判断吗？如果是，用强力模型。（2）这个任务是机械性的还是基于模式的？如果是，用快速模型。如果不确定，先用快速模型。如果产出不行，再升级到强力模型。先试便宜的再升级，好过什么都默认用贵的。',
      },
    ],
  },

  /* ================================================================== */
  /*  INFRASTRUCTURE                                                     */
  /* ================================================================== */

  {
    id: 'git-for-gtm',
    title: '面向 GTM 工程师的 Git',
    subtitle: '版本控制就像打包、贴标签、发快递',
    category: 'infrastructure',
    description:
      '面向 GTM 工程师的 Git 基础。通过实用类比解释暂存、提交、推送和回退。为什么版本控制对上下文工程很重要。',
    keywords: [
      'git for gtm',
      'git basics non-developers',
      'git staging committing pushing',
      'version control gtm',
      'git context engineering',
    ],
    difficulty: 'beginner',
    related: ['github-repos', 'deployments-vercel', 'monorepos', 'taxonomy'],
    sections: [
      {
        heading: '快递箱类比',
        type: 'prose',
        content:
          '把 Git 想象成打包和发快递。git add 是把东西放进箱子里。你选择哪些文件要放进这次发货。git commit 是封箱并在上面写标签，描述里面装了什么。git push 是把封好的箱子发到仓库（GitHub）。在你推送之前，没有人能看到你的工作，你的代码也没有备份。它只是放在你本地机器上的一些封好的箱子。\n\n我直到需要回退一个坏掉的首页才真正理解了 Git。我改了点东西，刷新页面，整个布局都没了。然后我发现可以撤销那个提交，回到它还能正常工作的时候。那一刻我恍然大悟。Git 不只是在追踪变更，它让你穿越时空。',
      },
      {
        heading: '为什么暂存很重要',
        type: 'pattern',
        content:
          '暂存让你控制每次提交里放什么。如果你更新了用户画像文档，这触发了营销话术角度和痛点的变化，你应该把所有这些放在同一个箱子里。这样如果你的假设是错的，可以一次性全部回滚。\n\n不好的做法：把所有东西一次性提交，附上一条 "更新" 这样的消息。你无法隔离什么改了、为什么改了。\n\n好的做法：把相关变更一起暂存，附上描述性消息。"更新 Acme 用户画像分层并调整第 2 层的营销话术角度" 能准确告诉你发生了什么以及为什么。当出问题时，你知道该打开哪个箱子。',
      },
      {
        heading: '你需要的三个命令',
        type: 'code',
        content:
          'git add .（暂存所有修改过的文件以便下次提交）\ngit commit -m "你的消息" （封箱并贴标签）\ngit push origin main（发送到 GitHub）\n\n就这三个。三个命令覆盖了日常 Git 使用的 90%。/deploy 技能会自动运行这三个命令，外加构建验证和部署确认。你不需要记住 Git 命令。你需要理解概念，让技能来处理执行。',
      },
      {
        heading: '用回退穿越时空',
        type: 'pro-tip',
        content:
          '每个提交都是一个存档点。如果你搞坏了什么，可以回去。git log 显示你的历史。git revert 可以在不擦除历史的情况下撤销特定提交。git checkout 让你查看文件的旧版本。这就是为什么提交消息很重要。当你翻看 git log 试图找到哪里出了问题时，"修修改改" 什么都没告诉你。"添加首页横幅动画" 准确告诉你哪个提交引入了变更。好的消息不是写给 Git 的，是写给晚上 11 点在找 bug 的未来的你的。',
      },
    ],
  },

  {
    id: 'github-repos',
    title: 'GitHub 仓库',
    subtitle: '你的代码和上下文的云端备份与协作平台',
    category: 'infrastructure',
    description:
      '面向 GTM 工程师的 GitHub 仓库基础。云存储、协作、公开与私有仓库、以及 .gitignore。为什么 GitHub 是上下文工程系统的骨干。',
    keywords: [
      'github repos gtm',
      'github basics',
      'github private repos',
      'gitignore secrets',
      'github context engineering',
      'github cloud backup code',
    ],
    difficulty: 'beginner',
    related: [
      'git-for-gtm',
      'deployments-vercel',
      'context-repository',
      'monorepos',
    ],
    sections: [
      {
        heading: 'GitHub 做什么的',
        type: 'prose',
        content:
          'GitHub 把你的 Git 仓库存储在云端。这是它的核心功能。在你推送到 GitHub 之前，你的代码没有备份。你的团队看不到你的工作。自动部署也不会触发。GitHub 就是存放你封好的箱子（提交）的仓库。\n\n你可以从任何机器上继续工作。克隆仓库，你就拥有了全部历史、每个文件、每个提交。如果我的笔记本明天坏了，我在新机器上克隆仓库，5 分钟就恢复了。这不是多虑，这是基础设施。',
      },
      {
        heading: '公开 vs 私有',
        type: 'pattern',
        content:
          '公开仓库对互联网上的所有人可见。任何人都可以阅读你的代码、克隆它、从中学习。适合开源项目、作品集和教育内容。\n\n私有仓库是封闭的。只有你邀请的人才能看到。适合客户工作、专有代码和任何包含敏感数据的内容。\n\n我的 GTM OS 仓库在 GitHub 上。每个技能、每个风格文件、每个合作伙伴工作流。它是唯一的真相来源。我把它设为私有，因为它包含合作伙伴专属的研究和营销策略。但网站代码从中公开部署。仓库是私有的，部署的站点是公开的。GitHub 和 Vercel 自动处理这种分离。',
      },
      {
        heading: '不让密钥泄露',
        type: 'pro-tip',
        content:
          '.gitignore 是一个告诉 Git 忽略什么的文件。把 .env 加到你的 .gitignore 中，Git 就永远不会追踪你的环境变量。加上 node_modules/，Git 就跳过你的依赖文件夹（可能有成千上万个文件）。这对安全至关重要。API 密钥、数据库密码、MCP 令牌，这些都不能放在你的仓库里。如果你的 .env 文件被提交到了公开仓库，这些密钥就暴露给了整个互联网。机器人会不断扫描 GitHub 寻找泄露的凭证。\n\n规则：如果是密钥，放进 .env。如果在 .env 里，就加到 .gitignore 里。没有例外。',
      },
      {
        heading: 'GitHub 作为上下文基础设施',
        type: 'pattern',
        content:
          'GitHub 不仅仅是存储。它是你上下文工程系统的骨干。你的上下文仓库在 GitHub 上。你的 CI/CD 流水线由 GitHub 推送触发。你的部署预览从 GitHub 分支生成。你的提交历史记录了你什么时候构建了什么。\n\n当我运行日报追踪器时，它扫描 git 提交来统计我发布了什么。当我运行 /deploy 时，它推送到 GitHub，Vercel 自动部署。当我引入新的合作伙伴时，研究资料进入一个 GitHub 文件夹，每个未来的代理会话都可以访问。GitHub 是让上下文在会话、机器和代理之间持久化的基础设施。',
      },
    ],
  },

  {
    id: 'deployments-vercel',
    title: '部署与 Vercel',
    subtitle: '推送到 GitHub，Vercel 构建，你的站点上线。不到一分钟。',
    category: 'infrastructure',
    description:
      '面向 GTM 工程师的 Vercel 部署工作原理。Git 触发的构建、预览 URL、环境变量、以及 /deploy 技能。一次推送部署三个网站。',
    keywords: [
      'vercel deployment',
      'vercel gtm',
      'deploy next.js vercel',
      'vercel preview urls',
      'vercel environment variables',
      'deploy context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'git-for-gtm',
      'github-repos',
      'monorepos',
      'cron-jobs',
    ],
    sections: [
      {
        heading: '部署的工作原理',
        type: 'prose',
        content:
          '部署就是把你本地的代码变更发布到互联网上。推送到 GitHub。Vercel 接收。构建站点。部署。完成。我第一次推送到 main 分支，看到 Vercel 在 45 秒内构建好我的站点时，感觉就像直接跳到了最精彩的部分。不用 FTP 上传。不用手动文件传输。只需要推送代码，它就上线了。三个网站（shawnos.ai、thegtmos.ai、thecontentos.ai）全部通过一次推送部署。这不是魔法，这就是现代部署的工作方式。',
      },
      {
        heading: '预览 URL',
        type: 'pattern',
        content:
          '每个分支都有自己的预览 URL。把功能分支推送到 GitHub，Vercel 会生成一个独特的 URL，你可以在上线前查看变更效果。这对测试来说非常有用。你可以把预览 URL 分享给协作者，在手机上检查，或者只是在合并到 main 之前确认变更看起来没问题。\n\n工作流程：创建分支、做变更、推送分支、检查预览 URL、如有需要修复问题、确认没问题后合并到 main、main 自动部署到生产环境。你永远不会把坏掉的代码部署到生产环境，因为你在预览阶段就发现了问题。',
      },
      {
        heading: '环境变量',
        type: 'pattern',
        content:
          '密钥放在 Vercel 上，不在你的代码里。API 密钥、数据库 URL、MCP 令牌。你在 Vercel 仪表板中为每个项目添加它们。你部署的站点通过 process.env 访问它们。它们永远不会出现在你的仓库里，永远不会被提交到 Git，永远不会出现在构建日志中。\n\n在本地，你创建一个 .env 文件放同样的变量。把 .env 加到 .gitignore 中让它永远不被提交。Vercel 有自己的生产环境副本。这种分离意味着你可以在本地开发和生产环境使用不同的值而不产生冲突。',
      },
      {
        heading: '/deploy 技能',
        type: 'pro-tip',
        content:
          '我构建了 /deploy 技能，这样我就不用记住部署步骤了。它暂存所有修改过的文件。从 diff 生成提交消息。提交。推送到 GitHub。等待 Vercel 开始构建。监控构建进度。确认所有三个站点都以 200 状态码上线。报告结果。我输入 /deploy，其他一切自动发生。三个网站，一次推送，不到一分钟。\n\n这就是技能模式应用于基础设施。我可以手动运行这些命令。但为什么要这样做？技能更快、更一致，还能捕获我会遗漏的错误。它还会为日报追踪器记录部署信息。',
      },
      {
        heading: '部署失败时怎么办',
        type: 'anti-pattern',
        content:
          '部署失败通常有三个常见原因。构建错误：TypeScript 报错、缺少导入、依赖损坏。在本地修复错误，再次推送。环境变量问题：某个变量在本地存在但不在 Vercel 上。检查 Vercel 仪表板并添加缺少的变量。依赖冲突：你的锁文件与 package.json 不同步。删除 node_modules，重新安装，推送更新后的锁文件。\n\n/deploy 技能会检查构建状态并报告失败及相关错误。但如果你跳过技能手动推送，就去 Vercel 仪表板查看构建日志。错误总在日志里。先看日志再猜原因。',
      },
    ],
  },

  {
    id: 'monorepos',
    title: 'Monorepo',
    subtitle: '一个仓库、多个项目、共享代码、一次推送全部部署',
    category: 'infrastructure',
    description:
      '面向 GTM 工程师的 Monorepo 工作原理。Turborepo、共享包、多站点架构、以及为什么一个仓库胜过三个独立仓库。一次推送部署三个网站背后的架构。',
    keywords: [
      'monorepo gtm',
      'turborepo',
      'monorepo shared code',
      'monorepo multiple websites',
      'monorepo context engineering',
      'monorepo vercel',
    ],
    difficulty: 'intermediate',
    related: [
      'deployments-vercel',
      'github-repos',
      'git-for-gtm',
      'taxonomy',
    ],
    sections: [
      {
        heading: '为什么用 Monorepo',
        type: 'prose',
        content:
          '我本来计划做一个网站。后来代理和我一起梳理了架构，发现一个站点放不下所有内容。三个受众，三个域名。shawnos.ai 用于我的个人品牌。thegtmos.ai 面向 GTM 工程师。thecontentos.ai 面向内容创作者。但我不想要三个独立仓库，带着三套依赖、三条部署流水线、三份相同的设计系统。所以我们构建了一个 Monorepo。一个仓库容纳三个站点，它们之间共享代码。一次推送部署全部三个。一套设计系统。一个真相来源。',
      },
      {
        heading: '架构是怎么工作的',
        type: 'pattern',
        content:
          'Turborepo 负责编排管理。它知道哪些项目依赖哪些包，并按正确的顺序构建。\n\napps/shawnos/ 是 shawnos.ai 站点。\napps/gtmos/ 是 thegtmos.ai 站点。\napps/contentos/ 是 thecontentos.ai 站点。\npackages/shared/ 存放三个站点共用的组件、样式、数据文件和工具函数。\n\n当我更新一个共享组件时，三个站点都会获得更新。当我添加新数据文件（比如这个维基）时，我把它放在 packages/shared/data/ 里，任何站点都可以导入。共享包是桥梁。站点从中导入，永远不复制代码。',
      },
      {
        heading: '相比独立仓库的优势',
        type: 'pro-tip',
        content:
          '一次提交可以更新三个站点。如果我修复了共享导航组件中的一个 bug，三个站点在一次推送中都得到修复。无需跨仓库同步。\n\n共享类型和数据。维基数据文件、RPG 进度系统、语音组件，全部放在 packages/shared/ 里。写一次，到处使用。\n\n一致的依赖。三个站点使用相同版本的 Next.js、React 和所有其他包。仓库之间不会出现版本漂移。\n\n一条部署流水线。推送到 main，Vercel 构建全部三个，全部上线。/deploy 技能管理一个仓库，而不是三个。',
      },
      {
        heading: 'Monorepo 的代价',
        type: 'anti-pattern',
        content:
          'Monorepo 不是免费的。构建时间更长，因为 Turborepo 要构建多个项目。初始设置比单站点仓库更复杂。包导入需要正确配置（package.json 中的 exports、TypeScript 路径解析）。而且如果你搞坏了共享包，三个站点同时挂掉。\n\n如果项目之间有共享代码，这个权衡是值得的。如果你的项目真的完全独立、没有共享组件或数据，独立仓库更简单。我的三个站点共享设计系统、数据文件、组件和工具函数。Monorepo 每周为我节省数小时。如果它们什么都不共享，我会用三个仓库。',
      },
    ],
  },

  {
    id: 'cron-jobs',
    title: '定时任务',
    subtitle: '你睡觉时自动运行的调度自动化',
    category: 'infrastructure',
    description:
      '面向 GTM 工程师的定时任务工作原理。计划任务、Cron 语法和实际例子。日报追踪器、自动部署、内容刷新、以及自动化重复工作的模式。',
    keywords: [
      'cron jobs gtm',
      'cron schedule automation',
      'cron syntax explained',
      'scheduled tasks ai',
      'cron jobs context engineering',
      'automated deploys cron',
    ],
    difficulty: 'intermediate',
    related: [
      'deployments-vercel',
      'python-for-gtm',
      'github-repos',
      'skills',
    ],
    sections: [
      {
        heading: '什么是定时任务',
        type: 'prose',
        content:
          '定时任务是在特定时间自动运行的计划任务。设置一次，然后忘掉它。你定义一个时间表和一个命令。系统按照时间表执行，无需任何手动干预。不用设闹钟，不用提醒，不用"我忘了运行追踪器"。系统会处理它。模式很简单：把你老是忘记手动做的事情自动化。',
      },
      {
        heading: 'Cron 语法详解',
        type: 'code',
        content:
          'Cron 语法看起来很神秘，但遵循一个简单的模式。五个字段：分钟、小时、日期、月份、星期几。\n\n0 20 * * * 表示"每天晚上 8:00 运行。"\n0 9 * * 1 表示"每周一早上 9:00 运行。"\n*/30 * * * * 表示"每 30 分钟运行一次。"\n0 0 1 * * 表示"每月 1 号午夜运行。"\n\n星号表示"每个"。数字表示"在这个值时"。斜杠表示"每 N 个间隔"。看几个例子之后，这个模式就懂了。你不需要背它。你需要知道怎么读现有的 Cron 时间表，以及怎么让 Claude 写新的。',
      },
      {
        heading: '我实际用的定时任务',
        type: 'pro-tip',
        content:
          '日报追踪器每晚 8 点运行。它扫描 git 提交、统计内容数量、计算产出评分、生成仪表板图片，并记录一切。我从不手动运行它，早上直接看结果就行。\n\n网站内容按计划自动更新。博客文章、日志条目和数据指标自动刷新，无需手动部署。新内容会被自动提交和推送。\n\n定时推送到 Vercel。定时任务触发 git push，Vercel 接收并重建站点。内容变更自动上线，无需我碰任何东西。\n\n这些以前都是我会忘记做的手动任务。现在它们自动运行。',
      },
      {
        heading: '定时任务在哪里运行',
        type: 'pattern',
        content:
          '定时任务可以在多个地方运行。在你的本地机器上（crontab）。在服务器上。在 Vercel 上（vercel.json cron 配置）。在 GitHub Actions 上（计划工作流）。\n\n对于网页相关的自动化，Vercel cron 和 GitHub Actions 最可靠。即使你的笔记本合上了它们也能运行。本地 crontab 适合开发和测试，但不适合生产自动化。\n\nVercel 方式：在 vercel.json 中添加 cron 配置，创建一个处理任务的 API 路由，Vercel 按计划触发。GitHub Actions 方式：创建一个带定时触发器的工作流 YAML，定义步骤，GitHub 按计划运行。两种都行。Vercel 对网页项目更简单。GitHub Actions 对通用自动化更灵活。',
      },
    ],
  },

  {
    id: 'terminal-and-cli',
    title: '终端和命令行',
    subtitle: '运行一切底层操作的黑色文字屏幕',
    category: 'infrastructure',
    description:
      '什么是终端、如何使用它、以及为什么它对做上下文工程的非开发者很重要。Homebrew、bash 命令、以及一边用工具一边学工具的递归内容模式。',
    keywords: [
      'terminal',
      'bash',
      'homebrew',
      'cli',
      'command line',
      'shell',
      'terminal commands gtm',
      'brew install',
      'mac terminal',
    ],
    difficulty: 'beginner',
    related: ['git-for-gtm', 'python-for-gtm', 'cron-jobs', 'deployments-vercel'],
    sections: [
      {
        heading: '什么是终端',
        type: 'prose',
        content:
          '终端是一个基于文本的计算机交互界面。没有图标、没有按钮、没有拖放操作。你输入命令、按回车，计算机就执行。它看起来很吓人。黑色屏幕、闪烁的光标、不知道输入什么。我理解，我也经历过。但事实是：你运行的每个技能、触发的每次部署、执行的每个脚本、安装的每个软件包，都通过终端运行。它是本知识库中所有其他内容的执行层。当你输入 /deploy 时，那个技能在终端中运行 git 命令。当你运行日报追踪器时，它在终端中执行 Python 脚本。当你用 Homebrew 安装工具时，那就是终端。你不需要成为终端高手。你需要理解它的存在、它做什么、以及看到它时不要慌。',
      },
      {
        heading: 'Homebrew：你的第一个包管理器',
        type: 'pattern',
        content:
          'Homebrew 是 Mac 上开发者工具的应用商店。不用从网站下载安装包，你只需输入 brew install，工具就安装好了。brew install git 安装 Git。brew install python 安装 Python。brew install node 安装 Node.js。一条命令，搞定。我在迁移到 Mac Mini 时学会了 Homebrew。我从零开始设置新机器，每个指南都说"先安装 Homebrew"。我不知道它是什么，也不知道包管理器是什么意思。我只是运行了安装脚本，输入 brew install git，就成功了。然后安装了 Python，然后 Node，然后其他所有东西。那个经历变成了内容。不知道 Homebrew 是什么、通过使用来学习、然后向别人解释的过程，这就是递归模式。学习过程本身就是内容。brew install 是安装命令。brew update 刷新包列表。brew list 显示已安装的所有东西。brew upgrade 更新已安装的包。这涵盖了你使用 Homebrew 90% 的需求。',
      },
      {
        heading: '你真正会用到的 Bash 命令',
        type: 'code',
        content:
          '你不需要背 200 个命令。你需要 10 个就覆盖 90% 的终端使用。\n\npwd 显示你当前所在位置。相当于"告诉我这个文件夹的地址"。\nls 列出当前文件夹的文件。ls -la 显示隐藏文件和详细信息。\ncd 切换目录。cd ~/Desktop 移动到桌面。cd .. 上移一层。\nmkdir 创建新文件夹。mkdir my-project。\ncp 复制文件。cp file.txt backup.txt。\nmv 移动或重命名文件。mv old-name.txt new-name.txt。\nrm 删除文件。rm file.txt。要小心，终端里没有回收站。\ncat 显示文件内容。cat README.md。\nchmod 修改权限。chmod +x script.sh 让脚本变成可执行。\necho 打印文本。echo $PATH 显示你的 PATH 变量。\n\n管道连接命令。ls | grep .md 只列出 Markdown 文件。管道符（|）把一个命令的输出发送到另一个命令。这就是如何把小工具串联成强大工作流的方式。',
      },
      {
        heading: '终端如何与其他一切连接',
        type: 'pro-tip',
        content:
          '终端是本知识库中所有内容实际执行的地方。git push 在终端中运行。python daily_scan.py 在终端中运行。npm run dev 在终端中启动开发服务器。brew install 通过终端添加工具。vercel deploy 从终端触发。其他每一篇知识库文章都依赖于终端的存在。Git 是终端工具。Python 脚本在终端中运行。定时任务按计划执行终端命令。部署通过终端命令推送。理解终端不是一项独立技能，它是所有其他技能赖以存在的基础。你不需要精通它，你只需要知道它在那里，不要害怕它。',
      },
      {
        heading: '递归内容模式',
        type: 'pattern',
        content:
          '这是一个元观点。我迁移到了 Mac Mini。我必须安装 Homebrew。我不知道 Homebrew 是什么。但我还是安装了，因为每个设置指南都这么说。我通过使用来学会了什么是包管理器。然后我把这个经历写成了内容。学习过程变成了内容。终端既是工具也是话题。这个模式在 GTM OS 中反复出现。我开始时不懂 Git，通过搞坏东西再回退来学。那变成了面向 GTM 的 Git 文章。我不懂 Python，通过让 Claude 写脚本并阅读输出来学。那变成了面向 GTM 的 Python 文章。终端是同样的故事。你不必等到成为专家才写某个话题。你在学的时候就写。学习过程是最容易引起共鸣的内容，因为你的读者正在经历同样的事情。',
      },
    ],
  },

  /* ================================================================== */
  /*  CODE (first 2 entries)                                             */
  /* ================================================================== */

  {
    id: 'python-for-gtm',
    title: '面向 GTM 工程师的 Python',
    subtitle: '自动化的胶水语言。Claude 写代码，你来运行。',
    category: 'code',
    description:
      '面向 GTM 工程师的 Python 基础。你不需要成为开发者。你需要知道足够多来读懂脚本，并告诉 Claude 该构建什么。来自 GTM OS 的真实例子。',
    keywords: [
      'python gtm engineers',
      'python automation gtm',
      'python scripts ai',
      'learn python gtm',
      'python context engineering',
      'python pillow automation',
    ],
    difficulty: 'beginner',
    related: ['mcp-servers', 'cron-jobs', 'skills', 'skill-trees', 'terminal-and-cli'],
    sections: [
      {
        heading: '为什么选择 Python',
        type: 'prose',
        content:
          'Python 是自动化的胶水语言。它连接各种东西。它处理文件。它生成图片。它计算统计数据。它在每个操作系统上运行。而且最重要的是，Claude 非常擅长写 Python。你不需要成为 Python 开发者。你需要知道足够多来读懂脚本、在高层理解它们做了什么、以及告诉 Claude 该构建或修复什么。这和从头写 Python 是不同的技能。就像是厨师和能看懂菜谱并告诉厨师要改什么的人之间的区别。',
      },
      {
        heading: '我的实际 Python 脚本',
        type: 'pattern',
        content:
          'daily_scan.py 扫描 git 提交和内容文件夹，计算我今天发布了什么。它统计博客文章、草稿、已发布作品和合作伙伴交付物。输出供日报追踪器使用。\n\ndaily_dashboard.py 获取扫描结果，使用 Pillow 生成一张带统计数据、评级、流水线信息和视觉格式的图片卡。它创建用来追踪进度的仪表板卡片。\n\nrpg_sprites.py 为 RPG 进度系统生成像素风头像。它创建待机动画、静态精灵图和工具专属角色变体。2900 行 Python 代码，全部由 Claude 根据我的描述编写。\n\nbatch_rename.py 批量处理文件。重命名、移动、格式转换。任何需要同时处理超过 10 个文件的操作都用脚本而不是手动操作。',
      },
      {
        heading: '模式：描述、构建、测试、修复',
        type: 'pro-tip',
        content:
          '我用的每个 Python 脚本都是 Claude 构建的。模式始终相同。我用大白话描述我想要什么。Claude 写代码。我运行它。如果能用，搞定。如果出错了，我把错误信息粘贴回给 Claude 说"这里坏了，这是错误信息"。Claude 修复它。我再运行一次。脚本在每次迭代中变得更好。\n\n这是技能模式应用于代码。你不需要自己调试 Python。你需要识别出输出有问题，并沟通出了什么问题。Claude 处理实际编程。你处理意图和验证。',
      },
      {
        heading: 'GTM 中常见的 Python 模式',
        type: 'pattern',
        content:
          '文件处理：读取 CSV、解析 Markdown、扫描目录。每个数据管道都从读取文件开始。\n\n用 Pillow 生成图片：创建仪表板卡片、品牌图片、社交媒体素材。Pillow 不用 Photoshop 就能把数据变成视觉内容。\n\n用 requests 调用 API：调用外部 API 进行数据增强、发送到 webhook、拉取营销活动统计数据。\n\nJSON 操作：读取配置文件、转换数据结构、为其他工具生成结构化输出。\n\n这四种模式覆盖了我使用的 90% 的 Python。如果你在高层理解每种模式做了什么，你就可以指挥 Claude 构建 GTM 自动化领域的任何东西。',
      },
    ],
  },

  {
    id: 'mcp-servers',
    title: 'MCP 服务器',
    subtitle: '连接你的 AI 代理和生产工具的桥梁',
    category: 'code',
    description:
      'Model Context Protocol 服务器详解。如何让 AI 代理访问 Slack、HeyReach、Substack、Vercel 和其他生产工具。让 Claude 与真实世界交互的双手。',
    keywords: [
      'mcp servers',
      'model context protocol',
      'mcp claude',
      'mcp cursor',
      'mcp slack integration',
      'mcp servers context engineering',
    ],
    difficulty: 'intermediate',
    related: [
      'claude-md',
      'skills',
      'python-for-gtm',
      'deployments-vercel',
    ],
    sections: [
      {
        heading: '什么是 MCP',
        type: 'prose',
        content:
          'Model Context Protocol 是连接你的 AI 代理和生产工具的桥梁。没有 MCP，Claude 是盲的。它能读仓库里的文件和运行终端命令，但它看不到 Slack 消息、拉不到 HeyReach 的营销数据、也推送不了草稿到 Substack。它被困在代码编辑器里。有了 MCP，Claude 就有了双手。每个 MCP 服务器把 Claude 连接到一个外部工具，并暴露一组代理可以执行的操作。读取 Slack 频道。从 HeyReach 导出线索。在 Substack 创建草稿。部署到 Vercel。MCP 把 Claude 从编码助手变成了操作系统。',
      },
      {
        heading: '我的 MCP 配置',
        type: 'pattern',
        content:
          'Slack MCP：读取频道、发送消息、搜索消息历史。当我运行 /slacksync 时，Claude 读取合作伙伴的 Slack 频道并提取行动项、决策和交付物。\n\nHeyReach MCP：导出线索、追踪连接、拉取营销活动统计数据。当我运行 /heyreach-export 时，Claude 拉取已接受和未接受的连接并生成 CSV 文件。\n\nSubstack MCP：推送草稿文章。当我运行 /finalsubstack 时，Claude 格式化内容并直接在 Substack 创建草稿。\n\nBrowserbase MCP：用于 LinkedIn 调研的浏览器自动化。Claude 访问 LinkedIn 个人页面，提取近期帖子，并生成个性化切入点。\n\nVercel MCP：部署、检查构建日志、监控部署状态。/deploy 技能使用它在推送后确认站点已上线。',
      },
      {
        heading: '如何安装 MCP 服务器',
        type: 'code',
        content:
          'MCP 服务器在你的 Cursor 设置或 Claude Code 配置中配置。每个服务器需要：一个名称（代理引用它的方式）、一个启动服务器的命令（通常是 npx 或 node）、以及任何认证令牌（API 密钥、OAuth 令牌）。\n\n服务器在你启动会话时启动，在后台运行。代理会看到服务器的工具作为其工具列表中的可用操作。你不直接调用 MCP。你使用触发 MCP 操作的技能或提示。代理处理实际的 API 调用。\n\n安装通常只需一个配置块加一个 API 密钥。/addmcp 技能为常用服务器自动化了这个过程。你输入 /addmcp slack，它就研究服务器、添加配置并验证连接。',
      },
      {
        heading: 'MCP 改变了一切',
        type: 'pro-tip',
        content:
          '在有 MCP 之前，我的工作流是：打开 Claude，写内容，复制，切换到 Substack，粘贴，排版，发布。有了 MCP：/finalsubstack 草稿就出现在 Substack 里了。在有 MCP 之前：手动导出 HeyReach 数据，下载 CSV，用 Sheets 打开，筛选。有了 MCP：/heyreach-export accepted，CSV 文件就在我的仓库里生成了。\n\n每一个 AI 输出和生产操作之间的手动步骤都是摩擦。MCP 消除了这种摩擦。代理在一步之内从生成输出到执行操作。这就是 AI 作为工具和 AI 作为操作者之间的区别。',
      },
      {
        heading: 'MCP 服务器故障时怎么办',
        type: 'anti-pattern',
        content:
          'MCP 服务器出故障的原因是可预测的。认证过期：API 令牌有有效期。如果服务器突然不工作了，先检查令牌。速率限制：调用外部 API 太频繁。在调用之间添加延迟或减少批次大小。服务器启动失败：配置中的命令不对，或者缺少依赖。检查配置路径并手动运行命令看报什么错。\n\n最大的反模式是添加你不用的 MCP 服务器。每个服务器都增加启动时间和上下文消耗。只安装你在工作流中实际使用的。五个专注的 MCP 服务器胜过十五个闲置的。',
      },
    ],
  },
]

import type { WebDevTranslations } from './types'

export const zh: WebDevTranslations = {
  locale: 'zh',
  dir: 'ltr',

  hero: {
    eyebrow: '面向服务型企业的网站开发',
    headlineLine1: '你的网站看起来还行。',
    headlineLine2: '但它在让你亏钱。',
    subheadline: '我们可以证明。',
    description:
      '大多数服务型企业的网站加载太慢、排名太低、什么都不追踪。我们构建的网站加载不到1秒，出现在 Google 搜索结果中，并精确告诉你下一个客户从哪来。',
    ctaPrimary: '查看价格',
    ctaSecondary: '获取免费网站审计',
    textUs: '或发短信给我们',
    scroll: '滚动',
  },

  transformationFlow: {
    steps: [
      { label: '慢速 WordPress', detail: '4.2秒加载时间' },
      { label: '性能审计', detail: '速度与性能检查' },
      { label: 'Next.js 重建', detail: '快速、安全的托管' },
      { label: 'Google 认可', detail: '95+ PageSpeed 评分' },
      { label: '线索管道', detail: '+40% 转化率' },
    ],
  },

  problem: {
    headline: '你的网站正在让你流失客户',
    sub: '大多数企业网站都是拖累。加载慢、过时、在 Google 上隐形。',
    stats: [
      { stat: '4-6秒', label: 'WordPress 在移动端的平均加载时间' },
      { stat: '7%', label: '每多1秒加载时间损失的转化率' },
      { stat: '53%', label: '的移动用户会在3秒以上时离开' },
      { stat: '0', label: '大多数小企业网站上的分析工具' },
    ],
    footnote:
      'Google 2026年2月的核心更新提高了性能标准。已升级的竞争对手正在抢走你的客户。',
  },

  interlude: {
    title: '还在用 WordPress？',
    subtitle: '大多数企业不知道他们的网站正在让他们流失客户。',
  },

  performance: {
    headline: 'WordPress vs Next.js',
    sub: '真实的性能基准测试。不是营销话术 - 是影响你 Google 排名的可衡量结果。',
    vitals: [
      {
        metric: '页面加载速度',
        techName: 'LCP（最大内容绘制）',
        wordpress: 4.2,
        nextjs: 1.1,
        unit: '秒',
        threshold: 2.5,
        lower: true,
        whatItIs: '你的页面加载有多快。Google 会惩罚超过2.5秒的页面。',
        whatItMeans: 'WordPress 让客户等4秒以上。我们的大约1秒就加载完成。',
      },
      {
        metric: '按钮响应时间',
        techName: 'INP（交互到下次绘制）',
        wordpress: 380,
        nextjs: 85,
        unit: '毫秒',
        threshold: 200,
        lower: true,
        whatItIs: '点击按钮后多快有响应。Google 会惩罚超过200毫秒的页面。',
        whatItMeans:
          '在 WordPress 上，点击"立即拨打"感觉什么都没发生。我们的即时响应。',
      },
      {
        metric: '布局稳定性',
        techName: 'CLS（累积布局偏移）',
        wordpress: 0.25,
        nextjs: 0.02,
        unit: '',
        threshold: 0.1,
        lower: true,
        whatItIs: '页面在加载时会不会跳来跳去？Google 会惩罚超过0.1的分数。',
        whatItMeans: 'WordPress 在插件加载时会移动内容。我们的一切都锁定到位。',
      },
    ],
    gaugeGood: '良好',
    gaugeNeedsWork: '需要改进',
    gaugeMeetsStandard: '达到 Google 标准',
    gaugeMayLower: 'Google 可能降低你的排名',
  },

  deliverables: {
    headline: '你将获得什么',
    sub: '我们构建的每个网站都包含这些基础功能。没有附加费。没有意外。',
    items: [
      {
        title: '定制设计',
        desc: '没有模板。围绕你的业务、品牌和客户量身设计。',
      },
      {
        title: '性能优先',
        desc: '亚秒级加载时间。每个页面都针对速度和搜索排名进行优化。',
      },
      {
        title: '内置 SEO',
        desc: '结构化数据、元标签、站点地图、Google 商业资料 - 从第一天起就有。',
      },
      {
        title: '线索获取',
        desc: '表单、预约系统、聊天机器人。自动将访客转化为客户。',
      },
      {
        title: '分析仪表盘',
        desc: '精确了解什么在起作用。流量、转化、页面性能 - 全部追踪。',
      },
      {
        title: '持续支持',
        desc: '我们不会建完就消失。每个套餐都包含上线后的支持。',
      },
    ],
  },

  howItWorks: {
    headline: '工作流程',
    sub: '从第一次通话到网站上线，1-4周完成。以下是流程。',
    steps: [
      {
        title: '免费网站审计',
        summary: '我们检查你的网站实际表现如何。',
        detail:
          '我们用 Google PageSpeed Insights 测试你的当前网站，检查你的 Core Web Vitals 分数，审查你的 Google 搜索表现。你会收到一份清晰的报告，精确显示你的网站状况 - 加载速度、移动端体验、SEO 差距，以及这些问题让你流失了多少客户。',
        timeline: '~24小时',
      },
      {
        title: '策略通话',
        summary: '我们搞清楚你的网站需要做什么。',
        detail:
          '一次30分钟的对话，聊你的业务、客户和目标。我们讨论你提供什么服务、服务哪些区域、客户今天怎么找到你。没有术语。通话结束时，你会有一个清晰的方案，知道新网站长什么样、能做什么。',
        timeline: '30分钟通话',
      },
      {
        title: '设计与构建',
        summary: '我们在每一步都征求你的意见。',
        detail:
          '我们从零开始设计和构建你的网站 - 不用模板。你可以看到进展，在任何内容上线前给出反馈。我们处理技术细节（托管、速度优化、SEO设置），你专注于确保它看起来对、说出你需要说的话。',
        timeline: '1-3周',
      },
      {
        title: '上线与验证',
        summary: '你的网站上线，我们证明它的表现。',
        detail:
          '你的新网站零停机上线。我们验证每个页面加载速度快，通过 Google PageSpeed 确认分数，设置分析仪表盘，确保 Google 商业资料已连接。第一天你就能看到性能数据。',
        timeline: '上线日',
      },
      {
        title: '支持与优化',
        summary: '上线后我们继续改进。',
        detail:
          '每个套餐都包含上线后支持。我们监控你的网站速度，追踪哪些页面带来最多线索，并进行调整以改善结果。你会收到定期更新，显示网站表现。支持期结束后，你的网站继续运行 - 你可以升级到托管支持或自行管理。',
        timeline: '持续进行',
      },
    ],
  },

  pricing: {
    headline: '价格',
    sub: '透明定价。没有意外。每个套餐都包含部署、托管和支持。',
    tiers: [
      {
        name: '基础版',
        price: '$3,500',
        tag: '开始使用',
        timeline: '1-2周',
        supportPeriod: '1个月',
        features: [
          '5-7页定制网站',
          '移动端优化响应式设计',
          '服务区域页面',
          '线索获取表单',
          'Google 商业资料设置',
          '评价板块',
          '基础 SEO + 站点地图',
        ],
      },
      {
        name: '成长版',
        price: '$5,500',
        tag: '最受欢迎',
        recommended: true,
        timeline: '2-3周',
        supportPeriod: '3个月',
        features: [
          '包含基础版全部内容',
          '8-12页',
          '英语 + 西班牙语（双语）',
          'AI 聊天机器人集成',
          '预约系统',
          '内容策略（3篇博客文章）',
          '分析仪表盘',
        ],
      },
      {
        name: '主导版',
        price: '$8,500',
        tag: '全套方案',
        timeline: '3-4周',
        supportPeriod: '6个月',
        features: [
          '包含成长版全部内容',
          '12-20页',
          '支持3种以上语言',
          '完整 SEO 审计 + 结构化标记',
          '分析仪表盘 + 月度报告',
          'Google 广告咨询',
          '竞争对手分析报告',
        ],
      },
      {
        name: '全栈主导版',
        price: '预约通话',
        tag: '仅限邀请',
        inviteOnly: true,
        features: [
          '包含主导版全部内容',
          '完整 Reddit 账号管理 + 策略',
          'Reddit 广告设置 + 管理',
          'Karma 积累营销活动',
          '内容分发（Reddit、LinkedIn、X）',
          '每周内容创作（博客、Reddit帖子、社交媒体）',
          '月度分析 + 流量归因',
          '为搜索引擎 + AI 模型优化的内容',
          '专属内容策略师',
        ],
      },
    ],
    managed: {
      badge: '任何套餐之后',
      name: '托管服务',
      price: '$500-$1,000',
      priceUnit: '/月',
      description:
        '持续的内容更新、SEO 优化、月度分析报告、优先支持和 Google 广告管理。构建你网站的同一支团队持续改进它。',
      features: [
        '持续内容更新',
        'SEO 优化',
        '月度性能报告',
        '优先支持',
        '包含 Google 广告',
      ],
      cta: '预约通话',
    },
    supportNote: '包含支持。',
    getStarted: '开始使用',
  },

  techStack: {
    headline: '这个页面就是证明',
    sub: '你正在看的这个网站，用的就是我们为每个客户使用的相同工具。',
    tools: [
      { name: 'Next.js', why: '让你的网站在1秒内加载的框架。' },
      { name: 'Vercel', why: '从离每个访客最近的服务器交付你的网站。' },
      { name: 'Cloudflare', why: '保护你的网站免受攻击，并使其更快。' },
      {
        name: 'PostHog',
        why: '精确显示访客从哪里来、做了什么。',
      },
      { name: 'GitHub', why: '你网站的每次更改都被追踪且可回滚。' },
    ],
    verifyLink: '在 PageSpeed Insights 上自行验证',
  },

  notRightFit: {
    title: '注意：如果你是这样的情况，我们可能不太合适...',
    subtitle: '我们宁可提前说清楚，也不想浪费你的时间。',
    cards: [
      {
        title: '...想要$500的模板网站',
        desc: '我们围绕你的业务定制网站。模板有它存在的理由 - 但我们的客户需要更多。',
      },
      {
        title: '...明天就要上线',
        desc: '好的网站需要1-4周。赶工做出的烂网站会让你流失客户。',
      },
      {
        title: '...想继续用 WordPress',
        desc: '我们的方案基于更快的技术。WordPress 不在我们的技术栈里。',
      },
      {
        title: '...不在乎性能',
        desc: '速度和排名是我们的基础。如果这对你不重要，我们可能不太合适。',
      },
      {
        title: '...想自己编辑网站',
        desc: '我们通过支持套餐处理更新。你专注于你的业务。',
      },
      {
        title: '...只需要一个 Logo',
        desc: '我们做的是完整网站，不是品牌标识。我们可以推荐品牌设计合作伙伴。',
      },
    ],
  },

  faq: {
    headline: '常见问题',
    items: [
      {
        q: '服务型企业做一个网站要多少钱？',
        a: '我们的套餐从$3,500起，包含5-7页定制网站，移动端优化、线索获取表单和基础SEO。大多数服务型企业选择$5,500的成长版，增加了预约系统、双语支持、分析和3个月的支持。投资通常在1-2个月内通过新线索收回成本。',
      },
      {
        q: '为什么不像其他人一样用 WordPress？',
        a: 'WordPress 网站在移动端平均加载4-6秒。我们的网站不到1秒。Google 2026年2月的核心更新后，页面速度直接影响搜索排名。更快的网站意味着更多曝光、更多点击、更多客户。我们的方案还消除了插件漏洞，不需要维护更新，托管零成本。',
      },
      {
        q: '构建需要多长时间？',
        a: '基础版网站1-2周上线。成长版需要2-3周。主导版项目需要3-4周。我们从策略通话开始，然后在每个阶段获取你的反馈。',
      },
      {
        q: '我需要懂技术吗？',
        a: '不需要。我们处理一切 - 设计、开发、托管和持续支持。你专注于运营你的业务。我们构建为你带来客户的网站。',
      },
      {
        q: '"支持"具体意味着什么？',
        a: '在你的支持期内，我们监控你的网站速度，修复任何问题，进行内容更新，追踪分析数据，并优化以获得更好的结果。你可以直接联系我们进行更改。这不是一个呼叫中心 - 而是构建你网站的同一支团队。',
      },
      {
        q: '支持期结束后会怎样？',
        a: '你的网站会继续正常运行。托管是免费的，所以除非你想要，否则没有持续费用。你可以升级到我们的托管计划以持续优化，或自行管理。网站是你的。',
      },
      {
        q: '你们做其他语言的网站吗？',
        a: '做。成长版包含双语支持（英语 + 西班牙语）。主导版支持3种以上语言。每种语言都有自己优化的页面 - 不只是一个翻译插件。',
      },
      {
        q: '能帮忙做 Google 商业资料和本地搜索吗？',
        a: '能。基础版包含 Google 商业资料设置。主导版包含完整的本地 SEO 审计、丰富搜索结果的结构化标记，以及多地点支持。我们确保 Google 准确理解你做什么以及在哪里做。',
      },
      {
        q: '持续管理费用是多少？',
        a: '我们的托管计划每月$500-$1,000，视范围而定。包括持续的内容更新、SEO优化、分析报告和优先支持。大多数企业先选择建站套餐，看到效果后再添加托管服务。',
      },
      {
        q: '全栈主导版套餐是什么？',
        a: '全栈主导版将我们的网站开发与完整的内容分发运营相结合。你得到主导版网站建设加上 Reddit 账号管理、Karma积累活动、跨 Reddit、LinkedIn 和 X 的内容创作，以及月度流量归因报告。我们曾为一位客户在24小时内带来527名访客和75,000+次 Reddit 浏览。此套餐仅限邀请 - 预约通话看看是否适合你。',
      },
      {
        q: '你们和其他网站开发者有什么不同？',
        a: '证据。我们构建的每个网站都带有可衡量的性能数据 - 加载时间、搜索排名、转化追踪。我们不只是建一个网站然后走人。我们建一个有表现的网站，用数据证明它，并持续优化。你正在阅读的这个页面就是用同样的技术构建的。',
      },
    ],
  },

  sources: {
    headline: '了解更多',
    links: [
      {
        label: 'Google Core Web Vitals 文档',
        href: 'https://web.dev/articles/vitals',
      },
      { label: 'Google PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
      {
        label: 'Google 结构化数据指南',
        href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      },
    ],
  },

  cta: {
    headline: '准备好看看不同了吗？',
    description:
      '预约一次免费网站审计。我们会用 PageSpeed 测试你的当前网站，告诉你现在的状况，并精确规划新网站能为你的业务做什么。',
    ctaPrimary: '预约免费网站审计',
    ctaSecondary: '发短信给我们：(347) 452-0467',
  },
}

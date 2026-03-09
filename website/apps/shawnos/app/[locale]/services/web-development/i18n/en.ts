import type { WebDevTranslations } from './types'

export const en: WebDevTranslations = {
  locale: 'en',
  dir: 'ltr',

  hero: {
    eyebrow: 'WEB DEVELOPMENT FOR SERVICE BUSINESSES',
    headlineLine1: 'Your Website Looks Fine.',
    headlineLine2: "It's Losing You Money.",
    subheadline: 'We can prove it.',
    description:
      'Most service business websites load too slow, rank too low, and track nothing. We build sites that load in under 1 second, show up on Google, and tell you exactly where your next customer came from.',
    ctaPrimary: 'See Pricing',
    ctaSecondary: 'Get a Free Site Audit',
    textUs: 'or text us at',
    scroll: 'scroll',
  },

  transformationFlow: {
    steps: [
      { label: 'Slow WordPress', detail: '4.2s load time' },
      { label: 'Performance Audit', detail: 'Speed & performance check' },
      { label: 'Next.js Rebuild', detail: 'Fast, secure hosting' },
      { label: 'Google Approved', detail: '95+ PageSpeed' },
      { label: 'Lead Pipeline', detail: '+40% Conversions' },
    ],
  },

  problem: {
    headline: 'Your Website Is Costing You Customers',
    sub: 'Most business websites are dead weight. Slow, outdated, and invisible to Google.',
    stats: [
      { stat: '4-6s', label: 'Average WordPress load time on mobile' },
      { stat: '7%', label: 'Conversions lost per second of load time' },
      { stat: '53%', label: 'Of mobile users leave if a site takes 3+ seconds' },
      { stat: '0', label: 'Analytics on most small business sites' },
    ],
    footnote:
      "Google's February 2026 core update raised the bar on performance. Your competitors who upgraded are getting your customers.",
  },

  interlude: {
    title: 'Still Running on WordPress?',
    subtitle: "Most businesses don't know their site is losing them customers.",
  },

  performance: {
    headline: 'WordPress vs Next.js',
    sub: 'Real performance benchmarks. Not marketing claims - measurable results that affect your Google ranking.',
    vitals: [
      {
        metric: 'Page Load Speed',
        techName: 'LCP (Largest Contentful Paint)',
        wordpress: 4.2,
        nextjs: 1.1,
        unit: 's',
        threshold: 2.5,
        lower: true,
        whatItIs: 'How fast your page loads. Google penalizes anything over 2.5 seconds.',
        whatItMeans: 'WordPress makes customers wait 4+ seconds. Ours loads in about 1 second.',
      },
      {
        metric: 'Button Response Time',
        techName: 'INP (Interaction to Next Paint)',
        wordpress: 380,
        nextjs: 85,
        unit: 'ms',
        threshold: 200,
        lower: true,
        whatItIs: 'How fast buttons respond when tapped. Google penalizes anything over 200ms.',
        whatItMeans:
          'On WordPress, tapping "Call Now" feels like nothing happened. Ours responds instantly.',
      },
      {
        metric: 'Layout Stability',
        techName: 'CLS (Cumulative Layout Shift)',
        wordpress: 0.25,
        nextjs: 0.02,
        unit: '',
        threshold: 0.1,
        lower: true,
        whatItIs: 'Does the page jump around while loading? Google penalizes scores over 0.1.',
        whatItMeans: 'WordPress shifts content as plugins load. Ours locks everything in place.',
      },
    ],
    gaugeGood: 'GOOD',
    gaugeNeedsWork: 'NEEDS WORK',
    gaugeMeetsStandard: "Meets Google's standard",
    gaugeMayLower: 'Google may lower your ranking',
  },

  deliverables: {
    headline: 'What You Get',
    sub: 'Every site we build comes with these fundamentals. No add-on fees. No surprises.',
    items: [
      {
        title: 'Custom Design',
        desc: 'No templates. Designed around your business, your brand, your customers.',
      },
      {
        title: 'Performance-First',
        desc: 'Sub-1-second load times. Every page optimized for speed and search rankings.',
      },
      {
        title: 'SEO Built In',
        desc: 'Structured data, meta tags, sitemaps, Google Business Profile - from day one.',
      },
      {
        title: 'Lead Capture',
        desc: 'Forms, booking systems, chatbots. Turn visitors into customers automatically.',
      },
      {
        title: 'Analytics Dashboard',
        desc: 'Know exactly what is working. Traffic, conversions, page performance - all tracked.',
      },
      {
        title: 'Ongoing Support',
        desc: 'We do not build and disappear. Every package includes post-launch support.',
      },
    ],
  },

  howItWorks: {
    headline: 'How It Works',
    sub: 'From first call to live site in 1-4 weeks. Here is the process.',
    steps: [
      {
        title: 'Free Site Audit',
        summary: 'We check how your site is actually performing.',
        detail:
          'We run your current website through Google PageSpeed Insights, check your Core Web Vitals scores, and review your Google search presence. You get a clear report showing exactly where your site stands - load speed, mobile experience, SEO gaps, and what it is costing you in lost customers.',
        timeline: '~24 hours',
      },
      {
        title: 'Strategy Call',
        summary: 'We figure out what your website needs to do.',
        detail:
          'A 30-minute conversation about your business, your customers, and your goals. We talk about what services you offer, what areas you serve, and how customers find you today. No jargon. By the end, you have a clear plan for what your new site will look like and what it will do.',
        timeline: '30-min call',
      },
      {
        title: 'Design & Build',
        summary: 'We build with your input at every step.',
        detail:
          'We design and build your site from scratch - no templates. You see progress along the way and give feedback before anything goes live. We handle the technical side (hosting, speed optimization, SEO setup) while you focus on making sure it looks right and says what you need it to say.',
        timeline: '1-3 weeks',
      },
      {
        title: 'Launch & Verify',
        summary: 'Your site goes live and we prove it performs.',
        detail:
          'Your new site goes live with zero downtime. We verify every page loads fast, run it through Google PageSpeed to confirm scores, set up your analytics dashboard, and make sure your Google Business Profile is connected. You see the performance numbers on day one.',
        timeline: 'Launch day',
      },
      {
        title: 'Support & Optimize',
        summary: 'We keep improving it after launch.',
        detail:
          'Every package includes post-launch support. We monitor your site speed, track which pages bring in the most leads, and make adjustments to improve results. You get regular updates showing how your site is performing. When your support period ends, your site keeps running - you can upgrade to managed support or self-manage.',
        timeline: 'Ongoing',
      },
    ],
  },

  pricing: {
    headline: 'Pricing',
    sub: 'Transparent pricing. No surprises. Every package includes deployment, hosting, and support.',
    tiers: [
      {
        name: 'Foundation',
        price: '$3,500',
        tag: 'Get Started',
        timeline: '1-2 weeks',
        supportPeriod: '1 month',
        features: [
          '5-7 page custom website',
          'Mobile-optimized responsive design',
          'Service area pages',
          'Lead capture forms',
          'Google Business Profile setup',
          'Reviews section',
          'Basic SEO + sitemap',
        ],
      },
      {
        name: 'Growth',
        price: '$5,500',
        tag: 'Most Popular',
        recommended: true,
        timeline: '2-3 weeks',
        supportPeriod: '3 months',
        features: [
          'Everything in Foundation',
          '8-12 pages',
          'English + Spanish (bilingual)',
          'AI chatbot integration',
          'Booking system',
          'Content strategy (3 blog posts)',
          'Analytics dashboard',
        ],
      },
      {
        name: 'Dominance',
        price: '$8,500',
        tag: 'Full Package',
        timeline: '3-4 weeks',
        supportPeriod: '6 months',
        features: [
          'Everything in Growth',
          '12-20 pages',
          '3+ languages supported',
          'Full SEO audit + schema markup',
          'Analytics dashboard + monthly reports',
          'Google Ads consultation',
          'Competitor analysis report',
        ],
      },
    ],
    managed: {
      badge: 'After any package',
      name: 'Managed',
      price: '$500-$1,000',
      priceUnit: '/month',
      description:
        'Ongoing content updates, SEO optimization, monthly analytics reports, priority support, and Google Ads management. The same team that built your site keeps improving it.',
      features: [
        'Ongoing content updates',
        'SEO optimization',
        'Monthly performance reports',
        'Priority support',
        'Google Ads included',
      ],
      cta: 'Book a Call',
    },
    supportNote: 'support included.',
    getStarted: 'Get Started',
  },

  techStack: {
    headline: 'This Page Is the Proof',
    sub: 'You are looking at a site built with the same tools we use for every client.',
    tools: [
      { name: 'Next.js', why: 'The framework that makes your site load in under 1 second.' },
      { name: 'Vercel', why: 'Delivers your site from the closest server to every visitor.' },
      { name: 'Cloudflare', why: 'Protects your site from attacks and makes it even faster.' },
      {
        name: 'PostHog',
        why: 'Shows you exactly where visitors come from and what they do.',
      },
      { name: 'GitHub', why: 'Every change to your site is tracked and reversible.' },
    ],
    verifyLink: 'Verify it yourself on PageSpeed Insights',
  },

  notRightFit: {
    title: "Heads Up: We're Not the Right Fit If You...",
    subtitle: "We'd rather be honest upfront than waste your time.",
    cards: [
      {
        title: '...Want a $500 Template Site',
        desc: 'We build custom sites designed around your business. Templates exist for a reason - but our clients need more.',
      },
      {
        title: '...Need It Done Tomorrow',
        desc: 'Good sites take 1-4 weeks. Rush jobs make bad sites that cost you customers.',
      },
      {
        title: '...Want to Stay on WordPress',
        desc: 'Our approach is built on faster technology. WordPress is not part of our stack.',
      },
      {
        title: "...Don't Care About Performance",
        desc: 'Speed and rankings are our foundation. If that does not matter to you, we are not the right fit.',
      },
      {
        title: '...Want to Edit It Yourself',
        desc: 'We handle updates through support packages. You focus on your business.',
      },
      {
        title: '...Just Need a Logo',
        desc: 'We build full websites, not brand identities. We can recommend branding partners.',
      },
    ],
  },

  faq: {
    headline: 'Frequently Asked Questions',
    items: [
      {
        q: 'How much does a website for a service business cost?',
        a: 'Our packages start at $3,500 for a 5-7 page custom site with mobile optimization, lead capture forms, and basic SEO. Most service businesses choose the Growth package at $5,500 which adds a booking system, bilingual support, analytics, and 3 months of support. The investment typically pays for itself within 1-2 months through new leads.',
      },
      {
        q: 'Why not just use WordPress like everyone else?',
        a: "WordPress sites average 4-6 seconds to load on mobile. Our sites load in under 1 second. After Google's February 2026 core update, page speed directly impacts your search rankings. A faster site means more visibility, more clicks, and more customers. Our approach also eliminates plugin vulnerabilities, requires no maintenance updates, and costs nothing to host.",
      },
      {
        q: 'How long does it take to build?',
        a: 'Foundation sites launch in 1-2 weeks. Growth sites take 2-3 weeks. Dominance projects run 3-4 weeks. We start with a strategy call, then move through design and development with your feedback at every stage.',
      },
      {
        q: 'Do I need to know anything about technology?',
        a: 'No. We handle everything - design, development, hosting, and ongoing support. You focus on running your business. We build the site that brings you customers.',
      },
      {
        q: 'What does "support" actually mean?',
        a: 'During your support period, we monitor your site speed, fix any issues, make content updates, track your analytics, and optimize for better results. You can reach us directly for changes. It is not a call center - it is the same team that built your site.',
      },
      {
        q: 'What happens after my support period ends?',
        a: 'Your site keeps running exactly as it was. Hosting is free, so there are no ongoing costs unless you want them. You can upgrade to our Managed plan for ongoing optimization, or self-manage. The site is yours.',
      },
      {
        q: 'Do you build sites in other languages?',
        a: 'Yes. The Growth package includes bilingual support (English + Spanish). The Dominance package supports 3 or more languages. Every language gets its own optimized pages - not just a translation plugin.',
      },
      {
        q: 'Can you help with Google Business Profile and local search?',
        a: 'Yes. The Foundation package includes Google Business Profile setup. The Dominance package includes a full local SEO audit, schema markup for rich search results, and multi-location support. We make sure Google understands exactly what you do and where you do it.',
      },
      {
        q: 'How much does ongoing management cost?',
        a: 'Our Managed plan runs $500-$1,000/month depending on scope. It includes ongoing content updates, SEO optimization, analytics reporting, and priority support. Most businesses start with a build package and add Managed later once they see results.',
      },
      {
        q: 'What makes you different from other web developers?',
        a: 'Proof. Every site we build comes with measurable performance data - load times, search rankings, conversion tracking. We do not just build a site and walk away. We build a site that performs, prove it with data, and keep optimizing. This page you are reading right now is built with the same technology.',
      },
    ],
  },

  sources: {
    headline: 'Learn More',
    links: [
      {
        label: 'Google Core Web Vitals Documentation',
        href: 'https://web.dev/articles/vitals',
      },
      { label: 'Google PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
      {
        label: 'Google Structured Data Guide',
        href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      },
    ],
  },

  cta: {
    headline: 'Ready to See the Difference?',
    description:
      'Book a free site audit. We will run your current site through PageSpeed, show you where you stand, and map out exactly what a new site would do for your business.',
    ctaPrimary: 'Book a Free Site Audit',
    ctaSecondary: 'Text Us: (347) 452-0467',
  },
}

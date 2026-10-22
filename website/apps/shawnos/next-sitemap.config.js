/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shawnos.ai',
  generateRobotsTxt: true,
  outDir: './public',
  // English is the default locale with localePrefix 'as-needed', so every /en/* URL answers 307 to /*.
  // Emit the unprefixed canonical URL instead of the redirecting one (769 URLs per build before this).
  transform: async (config, path) => {
    const loc = path === '/en' ? '/' : path.startsWith('/en/') ? path.slice(3) : path
    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
    ],
    additionalSitemaps: [
      'https://shawnos.ai/feed.xml',
    ],
  },
}

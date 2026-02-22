/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shawnos.ai',
  generateRobotsTxt: true,
  outDir: './public',
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

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thegtmos.ai',
  generateRobotsTxt: true,
  outDir: './public',
  exclude: ['/for/s*-advisors', '/for/cl*-cove'],
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
      'https://thegtmos.ai/feed/updates.xml',
    ],
  },
}

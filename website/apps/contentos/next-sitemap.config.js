/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thecontentos.ai',
  generateRobotsTxt: true,
  outDir: './public',
  transform: async (config, path) => {
    // High-priority pages
    const highPriority = ['/', '/services', '/anti-slop', '/showcase', '/content-wiki']
    // Medium-priority pages
    const mediumPriority = ['/how-to', '/knowledge', '/about', '/community']

    let priority = 0.5
    let changefreq = 'weekly'

    if (highPriority.includes(path)) {
      priority = 1.0
      changefreq = 'daily'
    } else if (mediumPriority.includes(path) || path.startsWith('/how-to/') || path.startsWith('/knowledge/') || path.startsWith('/content-wiki/')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.startsWith('/blog/') || path.startsWith('/posts/')) {
      priority = 0.7
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
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
      'https://thecontentos.ai/feed.xml',
    ],
  },
}

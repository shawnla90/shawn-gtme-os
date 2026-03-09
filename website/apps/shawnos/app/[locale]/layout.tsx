import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { JetBrains_Mono, Bricolage_Grotesque, Heebo } from 'next/font/google'
import { Navigation, NetworkBanner, Footer, PostHogProvider, CursorGlow } from '@shawnos/shared/components'
import { ThemeProvider } from '@shawnos/shared/hooks/useTheme'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FooterCredit } from '../FooterCredit'
import { NioChat } from '../NioChat'
import { FeedbackButton } from '../components/FeedbackButton'
import { routing } from '../../i18n/routing'
import { locales } from '../../i18n/config'
import '../globals.css'

const themeScript = `(function(){try{var t=localStorage.getItem('shawnos-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`

const SITE_URL = 'https://shawnos.ai'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hebrew',
  display: 'swap',
})

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shawn Tenam',
  url: SITE_URL,
  jobTitle: 'GTM Engineer',
  description:
    'GTM engineer who builds AI-native pipelines, agent-driven workflows, and content systems that compound — all shipped from a single monorepo.',
  knowsAbout: [
    'GTM Engineering',
    'AI Agent Development',
    'Sales Operations',
    'Revenue Operations',
    'Pipeline Automation',
    'Cold Email Infrastructure',
    'LinkedIn Outreach Automation',
    'Data Enrichment Pipelines',
    'Content-as-Code Publishing',
    'Next.js',
    'TypeScript',
    'Python',
    'Vercel Deployment',
    'Monorepo Architecture',
    'Clay Workflows',
    'HubSpot Automation',
    'MCP Servers',
    'Cursor IDE',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'GTM Engineer',
    description:
      'Designs and builds go-to-market infrastructure — AI-native pipelines, enrichment workflows, outbound automation, and content systems.',
    skills:
      'Clay, HeyReach, Instantly, HubSpot, Next.js, TypeScript, Python, Vercel, Cursor IDE, Claude AI',
    occupationLocation: {
      '@type': 'Country',
      name: 'US',
    },
  },
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'Plumbing Industry',
      description: 'Licensed plumber turned GTM engineer — career pivot from trades to tech',
    },
    {
      '@type': 'Role',
      roleName: 'SDR / BDR',
      description: 'Sales development representative building outbound systems and pipeline automation',
    },
  ],
  sameAs: [
    'https://linkedin.com/in/shawntenam',
    'https://x.com/shawntenam',
    'https://shawntenam.substack.com',
    'https://github.com/shawnla90',
    'https://thegtmos.ai',
    'https://thecontentos.ai',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShawnOS.ai',
  url: SITE_URL,
  description: 'GTM engineering, built in public. One monorepo. One operating system.',
  author: { '@type': 'Person', name: 'Shawn Tenam' },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const nav = await getTranslations('Nav')
  const dir = locale === 'he' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${jetbrains.variable} ${bricolage.variable} ${locale === 'he' ? heebo.variable : ''}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script async src="https://p.midbound.click/Yvy2M9X0v59ygzOV0tP2tNSRyJnzOGyk" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
        <PostHogProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...personSchema, inLanguage: locale }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...websiteSchema, inLanguage: locale }) }}
        />
        <Navigation
          siteName="ShawnOS.ai"
          links={[
            { href: '/', label: nav('home') },
            { href: '/services/web-development', label: nav('services') },
            { href: '/blog', label: nav('blog') },
            { href: '/media', label: nav('media') },
            { href: '/about', label: nav('about') },
            { href: '#', label: nav('wiki'), children: [
              { href: '/knowledge', label: nav('knowledge') },
              { href: '/how-to', label: nav('howTo') },
              { href: '/clay-wiki', label: nav('clayWiki') },
              { href: '/content-wiki', label: nav('contentWiki') },
              { href: '/context-wiki', label: nav('contextWiki') },
            ]},
            { href: '#', label: nav('more'), children: [
              { href: '/log', label: nav('log') },
              { href: '/rpg-preview', label: nav('rpg') },
              { href: '/vitals', label: nav('vitals') },
              { href: '/method', label: nav('method') },
              { href: '/showcase', label: nav('showcase') },
              { href: '/updates', label: nav('updates') },
              { href: '/search', label: nav('search') },
              { href: '/api', label: nav('api') },
            ]},
          ]}
        />
        <main>
          <div className="page-enter">{children}</div>
        </main>
        <NetworkBanner currentSite="shawnos" />
        <Footer siteName="ShawnOS.ai" />
        <FooterCredit />
        <NioChat />
        <FeedbackButton />
        <CursorGlow />
        <Analytics />
        <SpeedInsights />
        </PostHogProvider>
        </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

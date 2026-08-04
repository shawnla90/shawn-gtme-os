import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'

const INVITE_URL =
  'https://gtmelite.communities.buzz.xyz/invite/v2.Ob8-wOkY5qvDLRK2uuTra19aSzA5a8oj7hZNPVnXmY4'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Cracked GTM | shawnos.ai'
  const description =
    'The show where go-to-market engineers walk through systems they actually built. Screen share, receipts, no talking-head takes. Twice a week.'
  return {
    title,
    description,
    keywords: [
      'GTM engineer',
      'go-to-market engineering',
      'GTM podcast',
      'build in public',
      'Cracked GTM',
    ],
    alternates: {
      canonical: 'https://shawnos.ai/cracked',
      languages: hreflang('/cracked'),
    },
    openGraph: {
      title,
      description,
      url: 'https://shawnos.ai/cracked',
      images: [
        {
          url: '/og?title=Cracked+GTM&subtitle=engineers+who+show+the+work',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: ['/og?title=Cracked+GTM&subtitle=engineers+who+show+the+work'],
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

const STEPS = [
  {
    n: '01',
    title: 'Build something and post it',
    body: 'Join the builder community and drop what you are working on in #build-in-public. A week or two of real posts. Broken things count, they are usually the better story.',
  },
  {
    n: '02',
    title: 'Raise your hand',
    body: 'Say so in #podcast, or I will come find you. No follower minimum, no title check. If you built it and you can explain it, you qualify.',
  },
  {
    n: '03',
    title: 'Record',
    body: 'Riverside, 35 to 45 minutes. You need a camera, a quiet room, and something you can share your screen on. That is the whole list.',
  },
]

const SEGMENTS = [
  {
    label: 'How you got here',
    body: 'The real version, not the LinkedIn version. Most people in this field arrived sideways and that path is more useful than the polished one.',
  },
  {
    label: 'The build',
    body: 'You share your screen and walk through one thing. Why you made each call, what broke, what you would do differently. This is the bulk of it.',
  },
  {
    label: 'Rapid fire',
    body: 'Your stack, your hottest take, and one thing you think people should steal from you.',
  },
]

const GETS = [
  'The full episode on YouTube.',
  'A pack of captioned vertical clips cut from your best moments, sized for LinkedIn, Shorts, TikTok, and Reels.',
  'The clips are yours. Run them anywhere, no attribution games, no permission needed.',
  'An episode thread in the community so the room can pile on.',
]

export default async function CrackedPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const kicker: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  }

  const h2: React.CSSProperties = {
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    margin: '0 0 14px',
  }

  const body: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.65,
    color: 'var(--text-secondary)',
    margin: '0 0 16px',
  }

  const card: React.CSSProperties = {
    padding: 24,
    background: 'var(--canvas-subtle)',
    border: '1px solid var(--canvas-border)',
    borderRadius: 'var(--radius-lg)',
  }

  const section: React.CSSProperties = {
    padding: '0 24px 56px',
    maxWidth: 760,
    margin: '0 auto',
  }

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Cracked GTM', url: 'https://shawnos.ai/cracked' }]}
      />

      <section className="full-bleed" style={{ padding: '72px 24px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ ...kicker, marginBottom: 14 }}>the show · twice a week</div>
          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--text-primary)',
              margin: '0 0 18px',
            }}
          >
            Cracked GTM
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: 620,
            }}
          >
            Go-to-market engineers walk through systems they actually built.
            Screen share, receipts, and the parts that broke. No talking-head
            takes about the future of AI in sales.
          </p>
        </div>
      </section>

      <section style={{ ...section, paddingTop: 40 }}>
        <h2 style={h2}>Why this exists</h2>
        <p style={body}>
          People ask me constantly how to become a GTM engineer. My answer has
          always been three words: build in public.
        </p>
        <p style={body}>
          That advice is getting weaker, and it is not because it stopped being
          true. It is because text became trivially fakeable. Anyone can
          generate a convincing thread about a pipeline they never touched, and
          plenty of people do it daily.
        </p>
        <p style={body}>
          Video is where that falls apart. You either share your screen and
          explain why you picked the waterfall order you picked, or you cannot.
          There is no prompt for having actually done the thing.
        </p>
        <p style={{ ...body, margin: 0 }}>
          So this show is the receipts layer. Not interviews about strategy.
          Someone opening their actual work and narrating it.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>How you get on</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={card}>
              <div style={{ ...kicker, marginBottom: 10 }}>{s.n}</div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  marginBottom: 8,
                }}
              >
                {s.title}
              </div>
              <p style={{ ...body, margin: 0, fontSize: 14 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, marginTop: 18, marginBottom: 0 }}>
          The community step is not a gate. It is the prep. Your posts end up
          being the episode outline, which is why guests who post first have the
          easiest recordings.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>What happens on the call</h2>
        <div style={{ display: 'grid', gap: 20 }}>
          {SEGMENTS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <p style={{ ...body, margin: 0, fontSize: 14 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={section}>
        <h2 style={h2}>What you walk away with</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
          {GETS.map((g) => (
            <li
              key={g}
              style={{
                ...body,
                margin: 0,
                fontSize: 14,
                paddingLeft: 18,
                borderLeft: '2px solid var(--canvas-border)',
              }}
            >
              {g}
            </li>
          ))}
        </ul>
        <p style={{ ...body, marginTop: 18, marginBottom: 0 }}>
          I am not looking for people with audiences. I am looking for people
          who built something real and have no idea how to show it. If that is
          you, that is the entire pitch.
        </p>
      </section>

      <section style={{ ...section, paddingBottom: 96 }}>
        <div style={{ ...card, padding: 32 }}>
          <div style={{ ...kicker, marginBottom: 12 }}>the on-ramp</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 10,
            }}
          >
            Come build in public first
          </div>
          <p style={{ ...body, fontSize: 14 }}>
            Guests come out of the builder community. People post what they are
            working on, tear each other&rsquo;s work apart, and test tools
            themselves instead of arguing about them. It runs on Buzz, so you
            will need the desktop app.
          </p>
          <a
            href={INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 22px',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'var(--text-primary)',
              color: 'var(--canvas-base, #fff)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            join the community →
          </a>
        </div>
      </section>
    </>
  )
}

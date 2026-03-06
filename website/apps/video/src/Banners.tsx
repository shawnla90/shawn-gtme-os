/**
 * Social media profile banners — 1500×500
 *
 * 1. Nio/ShawnOS   — text left, Nio warrior right (transparent PNG)
 * 2. Recon/GTMOS   — hero text left, Recon bot right (transparent PNG + glow)
 * 3. Rem/ContentOS — hero text centered, no bot
 * 4. Unified       — single LinkedIn banner, no avatars, all 3 sites
 */
import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLORS, FONTS, SITE_ACCENTS } from './lib/tokens';
import { SceneWrapper } from './components/SceneWrapper';

const NETWORK = [
  { label: 'shawnos.ai', key: 'shawnos', accent: SITE_ACCENTS.shawnos },
  { label: 'thegtmos.ai', key: 'gtmos', accent: SITE_ACCENTS.gtmos },
  { label: 'thecontentos.ai', key: 'contentos', accent: SITE_ACCENTS.contentos },
] as const;

const NetworkFooter: React.FC<{ active: string; accent: string }> = ({ active, accent }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 24,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      fontFamily: FONTS.mono,
      fontSize: 13,
    }}
  >
    {NETWORK.map((n, i) => (
      <React.Fragment key={n.key}>
        {i > 0 && <span style={{ color: COLORS.textMuted }}>{'\u00b7'}</span>}
        <span
          style={{
            color: n.key === active ? accent : COLORS.textMuted,
            fontWeight: n.key === active ? 700 : 400,
          }}
        >
          {n.label}
        </span>
      </React.Fragment>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   1. ShawnOS — Nio warrior left text, avatar right
   ═══════════════════════════════════════════════════ */

export const NioBanner: React.FC = () => {
  const accent = SITE_ACCENTS.shawnos;
  return (
    <SceneWrapper accentColor={accent} particleCount={15} scanlineOpacity={0.03}>
      {/* Text */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 160,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          fontFamily: FONTS.mono,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, color: accent, textShadow: `0 0 20px ${accent}44`, lineHeight: 1.1 }}>
          ShawnOS.ai
        </div>
        <div style={{ fontSize: 22, color: COLORS.textSecondary, letterSpacing: 0.5 }}>
          the AI operating system
        </div>
        <div style={{ fontSize: 16, color: `${accent}B3`, marginTop: 8 }}>
          {'> 3 sites \u00b7 500+ pages \u00b7 built in public'}
        </div>
      </div>

      {/* Nio avatar glow */}
      <div
        style={{
          position: 'absolute',
          left: 1200 - 140 - 60,
          top: 230 - 140 - 60,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}26 0%, ${accent}14 40%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Nio avatar */}
      <Img
        src={staticFile('avatars/nio-static.png')}
        style={{
          position: 'absolute',
          left: 1200 - 140,
          top: 230 - 140,
          width: 280,
          height: 280,
        }}
      />

      <NetworkFooter active="shawnos" accent={accent} />
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   2. GTMOS — Hero text + Recon bot with glow
   ═══════════════════════════════════════════════════ */

export const ReconBanner: React.FC = () => {
  const accent = SITE_ACCENTS.gtmos;
  return (
    <SceneWrapper accentColor={accent} particleCount={15} scanlineOpacity={0.03}>
      {/* Hero text (left) */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          fontFamily: FONTS.mono,
        }}
      >
        {/* Boot line */}
        <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>
          $ ./boot theGTMOS.ai
        </div>

        {/* the GTM OS */}
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.0 }}>
          <span style={{ color: COLORS.textSecondary }}>the </span>
          <span style={{ color: accent, textShadow: `0 0 30px ${accent}44` }}>GTM OS</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 18, color: COLORS.textSecondary, marginTop: 16, maxWidth: 700, lineHeight: 1.5 }}>
          Pipeline orchestration, outbound automation, and partner workflows. One repo. One operating system.
        </div>

        {/* CTA */}
        <div style={{ fontSize: 18, fontWeight: 700, color: accent, marginTop: 16, letterSpacing: 2 }}>
          Go. To. Market.
        </div>
      </div>

      {/* Recon glow */}
      <div
        style={{
          position: 'absolute',
          left: 1200 - 150,
          top: 130 - 80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}30 0%, ${accent}15 40%, transparent 70%)`,
          filter: 'blur(25px)',
        }}
      />

      {/* Recon avatar */}
      <Img
        src={staticFile('avatars/recon-static.png')}
        style={{
          position: 'absolute',
          left: 1200 - 90,
          top: 130 - 120,
          width: 220,
          height: 293,
          filter: `drop-shadow(0 0 12px ${accent}66) drop-shadow(0 0 30px ${accent}33)`,
        }}
      />

      <NetworkFooter active="gtmos" accent={accent} />
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   3. ContentOS — Hero text centered, no bot
   ═══════════════════════════════════════════════════ */

export const RemBanner: React.FC = () => {
  const accent = SITE_ACCENTS.contentos;
  return (
    <SceneWrapper accentColor={accent} particleCount={15} scanlineOpacity={0.03}>
      {/* Centered hero text */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.mono,
          paddingBottom: 30,
        }}
      >
        {/* Boot line */}
        <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>
          $ ./boot theContentOS.ai
        </div>

        {/* the Content OS */}
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.0, textAlign: 'center' }}>
          <span style={{ color: COLORS.textSecondary }}>the </span>
          <span style={{ color: accent, textShadow: `0 0 30px ${accent}44` }}>Content OS</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 18, color: COLORS.textSecondary, marginTop: 20, textAlign: 'center', maxWidth: 700, lineHeight: 1.5 }}>
          One voice across every platform. AI-powered content that sounds like you, not AI slop.
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 16, fontWeight: 700, color: accent, marginTop: 16, letterSpacing: 1 }}>
          voice engine + platform
        </div>
      </div>

      <NetworkFooter active="contentos" accent={accent} />
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   4. Unified — single LinkedIn banner, all 3 sites
   ═══════════════════════════════════════════════════ */

export const UnifiedBanner: React.FC = () => {
  const accent = SITE_ACCENTS.shawnos;
  return (
    <SceneWrapper accentColor={accent} particleCount={12} scanlineOpacity={0.03}>
      {/* Centered hero block */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.mono,
          paddingBottom: 50,
        }}
      >
        {/* Hero — two lines */}
        <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
          <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.textPrimary }}>
            GTM Engineering,
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, color: accent, textShadow: `0 0 24px ${accent}44` }}>
            Built in Public
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 17,
            color: COLORS.textSecondary,
            marginTop: 20,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          1 repo. 3 operating systems. Every skill, post, and campaign runs through the same codebase.
        </div>
      </div>

      {/* All 3 site links in their accent colors */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          fontFamily: FONTS.mono,
          fontSize: 15,
        }}
      >
        {NETWORK.map((n, i) => (
          <React.Fragment key={n.key}>
            {i > 0 && <span style={{ color: COLORS.textMuted }}>{'\u00b7'}</span>}
            <span style={{ color: n.accent, fontWeight: 600 }}>
              {n.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </SceneWrapper>
  );
};

/**
 * Static thumbnail compositions for LinkedIn carousels.
 * Each renders as a single frame (no animation) showing
 * the full value of each brand in one dense image.
 *
 * 1080×1350 (4:5 LinkedIn) — matches useScale base design.
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { useVideoConfig } from 'remotion';
import { COLORS, FONTS } from './lib/tokens';
import { SceneWrapper } from './components/SceneWrapper';
import {
  SITES,
  TOTAL_ENTRIES,
  WIKI_MONTAGE,
  SHAWNOS_BLITZ,
  GTM_OS_MONTAGE,
  GTM_OS_TOTAL,
  GTM_OS_BLITZ,
  CONTENT_OS_MONTAGE,
  CONTENT_OS_TOTAL,
  CONTENT_OS_PLATFORMS,
} from './lib/data';

/* ─── Shared helpers ─────────────────────────────── */

const Badge: React.FC<{
  label: string;
  color: string;
  fontSize?: number;
  px?: number;
  py?: number;
}> = ({ label, color, fontSize = 16, px = 16, py = 8 }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: `${py}px ${px}px`,
      borderRadius: 6,
      border: `1px solid ${color}44`,
      backgroundColor: `${color}12`,
      fontFamily: FONTS.mono,
      fontSize,
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}66`,
        flexShrink: 0,
      }}
    />
    {label}
  </div>
);

const StatBlock: React.FC<{
  value: string;
  label: string;
  color: string;
  valueFontSize?: number;
  labelFontSize?: number;
}> = ({ value, label, color, valueFontSize = 44, labelFontSize = 15 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <span style={{ color, fontWeight: 800, fontSize: valueFontSize, lineHeight: 1.1 }}>
      {value}
    </span>
    <span style={{ fontSize: labelFontSize, color: COLORS.textSecondary }}>{label}</span>
  </div>
);

const Divider: React.FC = () => (
  <span style={{ color: COLORS.border, fontSize: 28 }}>|</span>
);

const MiniCard: React.FC<{
  name: string;
  count: number;
  label: string;
  highlights: string[];
  accent: string;
}> = ({ name, count, label, highlights, accent }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 20,
      borderRadius: 10,
      border: `1px solid ${COLORS.border}`,
      backgroundColor: COLORS.canvasSubtle,
      fontFamily: FONTS.mono,
      flex: 1,
      minWidth: 0,
    }}
  >
    <div style={{ fontSize: 15, fontWeight: 700, color: accent }}>{name}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>
        {count}
      </span>
      <span style={{ fontSize: 14, color: COLORS.textSecondary }}>{label}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {highlights.map((h) => (
        <div key={h} style={{ fontSize: 13, color: COLORS.textSecondary }}>
          <span style={{ color: accent, marginRight: 4 }}>{'>'}</span>
          {h}
        </div>
      ))}
    </div>
  </div>
);

const SiteWindow: React.FC<{
  name: string;
  tagline: string;
  color: string;
  width: number;
  height: number;
}> = ({ name, tagline, color, width, height }) => (
  <div
    style={{
      width,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 8,
      border: `1px solid ${color}33`,
      overflow: 'hidden',
      boxShadow: `0 0 30px ${color}22, 0 0 60px ${color}11`,
      backgroundColor: COLORS.canvas,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 28,
        backgroundColor: COLORS.canvasSubtle,
        paddingLeft: 10,
        paddingRight: 10,
        gap: 5,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.trafficRed }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.trafficYellow }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.trafficGreen }} />
      <span
        style={{
          fontSize: 10,
          color: COLORS.textSecondary,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: FONTS.mono,
        }}
      >
        {name}
      </span>
    </div>
    {/* Content */}
    <div
      style={{
        padding: 16,
        minHeight: height - 28,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color,
          fontFamily: FONTS.mono,
          textShadow: `0 0 12px ${color}33`,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6, fontFamily: FONTS.mono }}>
        {tagline}
      </div>
    </div>
  </div>
);

/* ─── Connection lines (static SVG) ─────────────── */

const StaticConnectionLines: React.FC<{
  points: Array<{ x: number; y: number }>;
  color: string;
}> = ({ points, color }) => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
  >
    {points.slice(0, -1).map((p, i) => {
      const next = points[i + 1];
      return (
        <line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={next.x}
          y2={next.y}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.5}
        />
      );
    })}
    {points.map((p, i) => (
      <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={4} fill={color} opacity={0.7} />
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════════
   1. ShawnOS Thumbnail — "The Ecosystem"
   ═══════════════════════════════════════════════════ */

export const ShawnOsThumbnail: React.FC = () => {
  const { width, height } = useVideoConfig();

  const windowW = Math.round(width * 0.30);
  const windowH = 130;
  const gap = Math.round(width * 0.02);
  const totalW = windowW * 3 + gap * 2;
  const startX = (width - totalW) / 2;
  const networkY = 170;

  const connectionPoints = [
    { x: startX + windowW / 2, y: networkY + windowH / 2 },
    { x: startX + windowW + gap + windowW / 2, y: networkY + windowH / 2 },
    { x: startX + (windowW + gap) * 2 + windowW / 2, y: networkY + windowH / 2 },
  ];

  // Pick top 4 wikis for the grid
  const topWikis = WIKI_MONTAGE.slice(0, 4);

  // Split blitz into platforms vs tools
  const platforms = SHAWNOS_BLITZ.slice(0, 5);
  const tools = SHAWNOS_BLITZ.slice(5);

  // Properly capitalized display names for thumbnails
  const siteDisplayNames = ['ShawnOS.ai', 'TheGTMOS.ai', 'TheContentOS.ai'];

  return (
    <SceneWrapper accentColor={COLORS.green} particleCount={20}>
      {/* ── Header ── */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.green,
            fontFamily: FONTS.mono,
            textShadow: `0 0 20px ${COLORS.green}44`,
          }}
        >
          ShawnOS.ai
        </div>
        <div style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          The AI OS — 3 sites. {Math.floor(TOTAL_ENTRIES / 10) * 10}+ pages. 100% free.
        </div>
      </div>

      {/* ── 3 Site Network ── */}
      <div style={{ position: 'absolute', top: networkY, left: 0, width: '100%', height: windowH + 40 }}>
        <StaticConnectionLines points={connectionPoints} color={COLORS.green} />
        <div style={{ display: 'flex', justifyContent: 'center', gap }}>
          {SITES.map((site, i) => (
            <SiteWindow
              key={site.name}
              name={siteDisplayNames[i]}
              tagline={site.tagline}
              color={site.color}
              width={windowW}
              height={windowH}
            />
          ))}
        </div>
      </div>

      {/* ── Wiki Knowledge Grid (2×2) ── */}
      <div
        style={{
          position: 'absolute',
          top: 370,
          left: 24,
          right: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {topWikis.map((w) => (
          <MiniCard
            key={w.name}
            name={w.name}
            count={w.count}
            label={w.label}
            highlights={w.highlights}
            accent={COLORS.green}
          />
        ))}
      </div>

      {/* ── Platform Badges ── */}
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONTS.mono, letterSpacing: 3 }}>
          PLATFORMS
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: width - 48 }}>
          {platforms.map((p) => (
            <Badge key={p.name} label={p.name} color={p.color} fontSize={20} px={20} py={10} />
          ))}
        </div>
      </div>

      {/* ── Tool Badges ── */}
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONTS.mono, letterSpacing: 3 }}>
          GTM TOOLS
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: width - 48 }}>
          {tools.map((t) => (
            <Badge key={t.name} label={t.name} color={t.color} fontSize={20} px={20} py={10} />
          ))}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 1020,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            padding: '20px 40px',
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.canvasSubtle,
            fontFamily: FONTS.mono,
          }}
        >
          <StatBlock value={`${Math.floor(TOTAL_ENTRIES / 10) * 10}+`} label="pages" color={COLORS.green} />
          <Divider />
          <StatBlock value="7" label="wikis" color={COLORS.green} />
          <Divider />
          <StatBlock value="3" label="sites" color={COLORS.green} />
          <Divider />
          <StatBlock value="100%" label="free" color={COLORS.green} />
        </div>
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          position: 'absolute',
          top: 1160,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: COLORS.green,
            fontFamily: FONTS.mono,
            textShadow: `0 0 16px ${COLORS.green}33`,
          }}
        >
          ShawnOS.ai
        </div>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          Free. Open. Updated daily.
        </div>
      </div>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   2. GTM OS Thumbnail — "The GTM Stack"
   ═══════════════════════════════════════════════════ */

export const GtmOsThumbnail: React.FC = () => {
  const { width } = useVideoConfig();

  const gtmTools = [
    { name: 'Clay', color: '#3DBFA0', subtitle: 'enrichment + scoring' },
    { name: 'Instantly', color: '#4EC373', subtitle: 'email sequences' },
    { name: 'HeyReach', color: '#6366F1', subtitle: 'LinkedIn outbound' },
    { name: 'Firecrawl', color: '#FF6B35', subtitle: 'web scraping MCP' },
  ];

  const mcpServers = [
    { name: 'Clay MCP', color: '#3DBFA0' },
    { name: 'Slack MCP', color: '#E01E5A' },
    { name: 'HeyReach MCP', color: '#6366F1' },
    { name: 'OpenClaw', color: '#4EC373' },
    { name: 'Firecrawl MCP', color: '#FF6B35' },
  ];

  // Top 4 GTM wikis
  const topWikis = GTM_OS_MONTAGE.slice(0, 4);

  return (
    <SceneWrapper accentColor={COLORS.teal} particleCount={20}>
      {/* ── Header ── */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.teal,
            fontFamily: FONTS.mono,
            textShadow: `0 0 20px ${COLORS.teal}44`,
          }}
        >
          TheGTMOS.ai
        </div>
        <div style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          The GTM Operating System
        </div>
      </div>

      {/* ── Tool Cards (2×2 Grid) ── */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 24,
          right: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {gtmTools.map((tool) => (
          <div
            key={tool.name}
            style={{
              flex: '1 1 calc(50% - 6px)',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 24,
              borderRadius: 12,
              border: `1px solid ${tool.color}33`,
              backgroundColor: COLORS.canvasSubtle,
              fontFamily: FONTS.mono,
              boxShadow: `0 0 20px ${tool.color}15`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: tool.color,
                  boxShadow: `0 0 8px ${tool.color}66`,
                }}
              />
              <span style={{ fontSize: 26, fontWeight: 700, color: tool.color }}>{tool.name}</span>
            </div>
            <div style={{ fontSize: 15, color: COLORS.textSecondary }}>{tool.subtitle}</div>
          </div>
        ))}
      </div>

      {/* ── MCP Servers ── */}
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONTS.mono, letterSpacing: 3 }}>
            MCP SERVERS
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.teal,
              fontFamily: FONTS.mono,
            }}
          >
            17
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: width - 48 }}>
          {mcpServers.map((s) => (
            <Badge key={s.name} label={s.name} color={s.color} fontSize={18} px={18} py={9} />
          ))}
        </div>
      </div>

      {/* ── Wiki Knowledge Grid (2×2) ── */}
      <div
        style={{
          position: 'absolute',
          top: 570,
          left: 40,
          right: 40,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {topWikis.map((w) => (
          <MiniCard
            key={w.name}
            name={w.name}
            count={w.count}
            label={w.label}
            highlights={w.highlights}
            accent={COLORS.teal}
          />
        ))}
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 970,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            padding: '20px 40px',
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.canvasSubtle,
            fontFamily: FONTS.mono,
          }}
        >
          <StatBlock value="17" label="MCP servers" color={COLORS.teal} />
          <Divider />
          <StatBlock value={`${Math.floor(GTM_OS_TOTAL / 10) * 10}+`} label="guides" color={COLORS.teal} />
          <Divider />
          <StatBlock value="100%" label="free" color={COLORS.teal} />
        </div>
      </div>

      {/* ── 3-Site Network (compact) ── */}
      <div
        style={{
          position: 'absolute',
          top: 1100,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {(['ShawnOS.ai', 'TheGTMOS.ai', 'TheContentOS.ai'] as const).map((name, i) => (
          <div
            key={name}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: `1px solid ${SITES[i].color}33`,
              fontSize: 15,
              fontWeight: 600,
              color: SITES[i].color,
              fontFamily: FONTS.mono,
              backgroundColor: `${SITES[i].color}08`,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          position: 'absolute',
          top: 1190,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: COLORS.teal,
            fontFamily: FONTS.mono,
            textShadow: `0 0 16px ${COLORS.teal}33`,
          }}
        >
          TheGTMOS.ai
        </div>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          Free. Open. Built for operators.
        </div>
      </div>
    </SceneWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   3. ContentOS Thumbnail — "Every Platform. One Voice."
   ═══════════════════════════════════════════════════ */

export const ContentOsThumbnail: React.FC = () => {
  const { width, height } = useVideoConfig();

  const allPlatforms = [
    { name: 'LinkedIn', color: '#0A66C2' },
    { name: 'X / Twitter', color: '#E7E9EA' },
    { name: 'Reddit', color: '#FF4500' },
    { name: 'Substack', color: '#FF6719' },
    { name: 'YouTube', color: '#FF0000' },
  ];

  const contentTools = [
    { name: 'Typefully MCP', color: '#9B72CF' },
    { name: 'Image Gen', color: '#D2A53C' },
    { name: 'Figma', color: '#FF6B35' },
    { name: 'Claude Code', color: '#4EC373' },
  ];

  // Top 4 content wikis
  const topWikis = CONTENT_OS_MONTAGE.slice(0, 4);

  // Platform circle layout — centered hub with spokes
  const centerX = width / 2;
  const centerY = 340;
  const radius = 160;

  const platformPositions = allPlatforms.map((p, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / allPlatforms.length;
    return {
      ...p,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  return (
    <SceneWrapper accentColor={COLORS.purple} particleCount={20}>
      {/* ── Header ── */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.purple,
            fontFamily: FONTS.mono,
            textShadow: `0 0 20px ${COLORS.purple}44`,
          }}
        >
          TheContentOS.ai
        </div>
        <div style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          The Content Operating System
        </div>
      </div>

      {/* ── Platform Network (hub + spoke) ── */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {/* Spokes from center to each platform */}
        {platformPositions.map((p) => (
          <line
            key={`line-${p.name}`}
            x1={centerX}
            y1={centerY}
            x2={p.x}
            y2={p.y}
            stroke={COLORS.purple}
            strokeWidth={1.5}
            strokeDasharray="4,3"
            opacity={0.35}
          />
        ))}
        {/* Outer ring connecting platforms */}
        {platformPositions.map((p, i) => {
          const next = platformPositions[(i + 1) % platformPositions.length];
          return (
            <line
              key={`ring-${i}`}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={COLORS.purple}
              strokeWidth={1}
              strokeDasharray="3,4"
              opacity={0.2}
            />
          );
        })}
        {/* Center hub dot */}
        <circle cx={centerX} cy={centerY} r={6} fill={COLORS.purple} opacity={0.6} />
        <circle cx={centerX} cy={centerY} r={18} fill="none" stroke={COLORS.purple} strokeWidth={1} opacity={0.2} />
      </svg>

      {/* Center hub label */}
      <div
        style={{
          position: 'absolute',
          top: centerY - 10,
          left: centerX - 50,
          width: 100,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: COLORS.purple,
          fontFamily: FONTS.mono,
          letterSpacing: 2,
          zIndex: 6,
        }}
      >
        1 VOICE
      </div>

      {/* Platform badges at their positions */}
      {platformPositions.map((p) => (
        <div
          key={p.name}
          style={{
            position: 'absolute',
            left: p.x - 58,
            top: p.y - 18,
            zIndex: 10,
          }}
        >
          <Badge label={p.name} color={p.color} fontSize={14} px={14} py={7} />
        </div>
      ))}

      {/* ── Wiki Knowledge Grid (2×2) ── */}
      <div
        style={{
          position: 'absolute',
          top: 550,
          left: 24,
          right: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {topWikis.map((w) => (
          <MiniCard
            key={w.name}
            name={w.name}
            count={w.count}
            label={w.label}
            highlights={w.highlights}
            accent={COLORS.purple}
          />
        ))}
      </div>

      {/* ── Content Tools ── */}
      <div
        style={{
          position: 'absolute',
          top: 870,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ fontSize: 15, color: COLORS.textMuted, fontFamily: FONTS.mono, letterSpacing: 3 }}>
          CONTENT TOOLS
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: width - 48 }}>
          {contentTools.map((t) => (
            <Badge key={t.name} label={t.name} color={t.color} fontSize={20} px={20} py={10} />
          ))}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 980,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            padding: '20px 40px',
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.canvasSubtle,
            fontFamily: FONTS.mono,
          }}
        >
          <StatBlock value="6" label="platforms" color={COLORS.purple} />
          <Divider />
          <StatBlock value="1" label="voice" color={COLORS.purple} />
          <Divider />
          <StatBlock value={`${Math.floor(CONTENT_OS_TOTAL / 10) * 10}+`} label="guides" color={COLORS.purple} />
          <Divider />
          <StatBlock value="100%" label="free" color={COLORS.purple} />
        </div>
      </div>

      {/* ── 3-Site Network (compact) ── */}
      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {(['ShawnOS.ai', 'TheGTMOS.ai', 'TheContentOS.ai'] as const).map((name, i) => (
          <div
            key={name}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: `1px solid ${SITES[i].color}33`,
              fontSize: 15,
              fontWeight: 600,
              color: SITES[i].color,
              fontFamily: FONTS.mono,
              backgroundColor: `${SITES[i].color}08`,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          position: 'absolute',
          top: 1200,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: COLORS.purple,
            fontFamily: FONTS.mono,
            textShadow: `0 0 16px ${COLORS.purple}33`,
          }}
        >
          TheContentOS.ai
        </div>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: FONTS.mono, letterSpacing: 1 }}>
          Every platform. One voice.
        </div>
      </div>
    </SceneWrapper>
  );
};

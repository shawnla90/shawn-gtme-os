import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';
import { SITES, STATS } from '../lib/data';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';

/**
 * Scene 5 — Network Reveal (360 frames / 12s)
 * Show this isn't one page — it's an interconnected 3-site system.
 */
export const NetworkReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Three terminal windows slide in (frames 0-60) ---
  // Left: slides from left
  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [-100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  // Center: slides from bottom
  const centerY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  // Right: slides from right
  const rightX = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [100, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Stats overlay (frames 120-200) ---
  const statsScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const statsVisible = frame >= 120;

  // --- Connection lines (frames 200-280) ---
  const lineProgress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const linesVisible = frame >= 200;

  // Window width calculation (responsive to viewport)
  const windowWidth = Math.round(width * 0.28);
  const gap = Math.round(width * 0.03);
  const totalWidth = windowWidth * 3 + gap * 2;
  const startX = (width - totalWidth) / 2;

  // Vertical positions
  const windowY = height * 0.2;
  const windowHeight = height * 0.4;

  const windows = [
    {
      site: SITES[0],
      x: startX,
      transform: `translate(${leftX}%, 0)`,
      taglineStart: 60,
    },
    {
      site: SITES[1],
      x: startX + windowWidth + gap,
      transform: `translate(0, ${centerY}%)`,
      taglineStart: 70,
    },
    {
      site: SITES[2],
      x: startX + (windowWidth + gap) * 2,
      transform: `translate(${rightX}%, 0)`,
      taglineStart: 80,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Three terminal windows */}
      {windows.map(({ site, x, transform, taglineStart }, i) => (
        <div
          key={site.name}
          style={{
            position: 'absolute',
            left: x,
            top: windowY,
            width: windowWidth,
            transform,
          }}
        >
          <TerminalChrome title={site.name} accentColor={site.color}>
            <div
              style={{
                minHeight: windowHeight - 80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '12px 0',
              }}
            >
              {/* Site name */}
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: site.color,
                  marginBottom: 16,
                }}
              >
                {site.name}
              </div>

              {/* Tagline typed out */}
              {frame >= taglineStart && (
                <TypewriterText
                  text={site.tagline}
                  startFrame={taglineStart}
                  speed={0.5}
                  color={COLORS.textSecondary}
                  fontSize={15}
                  showCursor={frame < taglineStart + 80}
                  cursorColor={site.color}
                />
              )}
            </div>
          </TerminalChrome>
        </div>
      ))}

      {/* Connection lines between windows */}
      {linesVisible && (
        <>
          {/* Line: left to center */}
          <div
            style={{
              position: 'absolute',
              top: windowY + windowHeight / 2,
              left: startX + windowWidth,
              width: gap * lineProgress,
              height: 2,
              backgroundColor: COLORS.border,
            }}
          />
          {/* Line: center to right */}
          <div
            style={{
              position: 'absolute',
              top: windowY + windowHeight / 2,
              left: startX + windowWidth * 2 + gap,
              width: gap * lineProgress,
              height: 2,
              backgroundColor: COLORS.border,
            }}
          />
        </>
      )}

      {/* Stats overlay — centered below windows */}
      {statsVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: height * 0.15,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${statsScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              fontSize: 24,
              color: COLORS.textPrimary,
              backgroundColor: COLORS.canvasSubtle,
              padding: '16px 32px',
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <span>
              <span style={{ color: COLORS.green, fontWeight: 700 }}>
                {STATS.routes}
              </span>{' '}
              routes
            </span>
            <span style={{ color: COLORS.textMuted }}>|</span>
            <span>Updated daily</span>
            <span style={{ color: COLORS.textMuted }}>|</span>
            <span>
              <span style={{ color: COLORS.green, fontWeight: 700 }}>100%</span>{' '}
              free
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

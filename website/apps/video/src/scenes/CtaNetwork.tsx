import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS } from '../lib/tokens';
import { SITES, STATS } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';
import { ConnectionLines } from '../components/ConnectionLines';
import { MatrixRain } from '../components/MatrixRain';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

/**
 * Scene 4 — CTA + Network (94 frames / ~3.1s)
 * Compressed: network reveal → stats flash → CTA end card.
 *
 * Frames 0-30:   3 site cards slide in (0/2/4f stagger)
 * Frames 10-28:  SVG connection lines draw on
 * Frames 32-48:  Stats overlay flashes
 * Frames 40-50:  Network fades out
 * Frames 50-60:  CTA text types out
 * Frames 62-72:  Subtitle fades in
 * Frames 75-94:  Matrix rain + hold
 */
export const CtaNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { s, sv } = useScale();

  // ── Network Phase (frames 0-50) ──

  // Three cards slide in with tight stagger
  const leftSlide = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const centerSlide = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 180 } });
  const rightSlide = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 180 } });

  const leftX = interpolate(leftSlide, [0, 1], [-120, 0]);
  const centerY = interpolate(centerSlide, [0, 1], [80, 0]);
  const rightX = interpolate(rightSlide, [0, 1], [120, 0]);

  // Stats overlay (frames 32-48)
  const statsScale = spring({
    frame: frame - 32,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const statsVisible = frame >= 32 && frame < 50;

  // ── Transition to CTA (frames 40-50) ──
  const networkFade = interpolate(frame, [40, 50], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── CTA Phase (frames 50+) ──
  const ctaVisible = frame >= 50;
  const ctaOpacity = interpolate(frame, [50, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle (frames 62+)
  const subtitleOpacity = interpolate(frame, [62, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Matrix rain (frames 75+)
  const matrixOpacity = interpolate(frame, [75, 88], [0, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Window layout (scaled)
  const windowWidth = Math.round(width * 0.28);
  const gap = Math.round(width * 0.03);
  const totalW = windowWidth * 3 + gap * 2;
  const startX = (width - totalW) / 2;
  const windowY = height * 0.18;
  const windowH = height * 0.35;

  // Connection line points (center of each window)
  const connectionPoints = [
    { x: startX + windowWidth / 2, y: windowY + windowH / 2 },
    { x: startX + windowWidth + gap + windowWidth / 2, y: windowY + windowH / 2 },
    { x: startX + (windowWidth + gap) * 2 + windowWidth / 2, y: windowY + windowH / 2 },
  ];

  const windows = [
    { site: SITES[0], x: startX, transform: `translateX(${leftX}px)` },
    { site: SITES[1], x: startX + windowWidth + gap, transform: `translateY(${centerY}px)` },
    { site: SITES[2], x: startX + (windowWidth + gap) * 2, transform: `translateX(${rightX}px)` },
  ];

  return (
    <SceneWrapper accentColor={COLORS.teal} particleCount={25}>
      {/* Whoosh SFX at scene start */}
      <Sequence from={0} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh} />
      </Sequence>

      {/* Resolve SFX at CTA reveal */}
      <Sequence from={50} durationInFrames={20}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve} />
      </Sequence>

      {/* Matrix rain background — CTA phase */}
      {frame >= 75 && (
        <MatrixRain opacity={matrixOpacity} color={COLORS.green} columns={25} speed={0.6} />
      )}

      {/* Network phase */}
      <div style={{ opacity: networkFade }}>
        {/* Three terminal windows */}
        {windows.map(({ site, x, transform }) => (
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
            <TerminalChrome
              title={site.name}
              accentColor={site.color}
              glowColor={site.color}
              titleBarHeight={s(40)}
              contentPadding={s(24)}
              borderRadius={s(8)}
              trafficLightSize={s(12)}
              titleFontSize={s(13)}
            >
              <div
                style={{
                  minHeight: windowH - s(80),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: `${s(12)}px 0`,
                }}
              >
                <div
                  style={{
                    fontSize: s(18),
                    fontWeight: 700,
                    color: site.color,
                    marginBottom: s(12),
                    textShadow: `0 0 ${s(15)}px ${site.color}33`,
                  }}
                >
                  {site.name}
                </div>
                <div
                  style={{
                    fontSize: s(14),
                    color: COLORS.textSecondary,
                  }}
                >
                  {site.tagline}
                </div>
              </div>
            </TerminalChrome>
          </div>
        ))}

        {/* Connection lines */}
        <ConnectionLines
          points={connectionPoints}
          startFrame={10}
          durationFrames={18}
          color={COLORS.teal}
          strokeWidth={2}
        />

        {/* Stats overlay */}
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
                gap: s(28),
                fontSize: s(20),
                color: COLORS.textPrimary,
                backgroundColor: COLORS.canvasSubtle,
                padding: `${s(16)}px ${s(32)}px`,
                borderRadius: s(12),
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: COLORS.green, fontWeight: 800, fontSize: s(36) }}>{STATS.routes}+</span>
                <span style={{ fontSize: s(14), color: COLORS.textSecondary }}>routes</span>
              </span>
              <span style={{ color: COLORS.border, fontSize: s(32) }}>|</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: COLORS.green, fontWeight: 800, fontSize: s(36) }}>100%</span>
                <span style={{ fontSize: s(14), color: COLORS.textSecondary }}>free</span>
              </span>
              <span style={{ color: COLORS.border, fontSize: s(32) }}>|</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: COLORS.green, fontWeight: 800, fontSize: s(20) }}>Updated</span>
                <span style={{ fontSize: s(14), color: COLORS.textSecondary }}>daily</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA phase */}
      {ctaVisible && (
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
            gap: s(24),
            opacity: ctaOpacity,
            zIndex: 10,
          }}
        >
          <TypewriterText
            text="shawnos.ai"
            startFrame={52}
            speed={0.4}
            color={COLORS.green}
            fontSize={s(64)}
            showCursor={true}
            cursorColor={COLORS.green}
          />

          <div
            style={{
              fontSize: s(22),
              color: COLORS.textSecondary,
              opacity: subtitleOpacity,
              textAlign: 'center',
              letterSpacing: 1,
              textShadow: `0 0 ${s(15)}px ${COLORS.green}22`,
            }}
          >
            Free. Open. Updated daily.
          </div>
        </div>
      )}
    </SceneWrapper>
  );
};

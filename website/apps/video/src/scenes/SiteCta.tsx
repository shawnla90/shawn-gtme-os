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
import { SITES } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';

import { TypewriterText } from '../components/TypewriterText';
import { ConnectionLines } from '../components/ConnectionLines';
import { MatrixRain } from '../components/MatrixRain';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

interface SiteCtaProps {
  ctaUrl: string;
  subtitle: string;
  accentColor?: string;
  stats?: Array<{ value: string; label: string }>;
  /** Frame where stats overlay appears (default 32) */
  statsStart?: number;
  /** Frame where CTA phase begins (default 50) */
  ctaStart?: number;
}

/**
 * Generic CTA + Network scene.
 * Network reveal -> stats flash -> CTA end card.
 * Timing configurable via statsStart / ctaStart props.
 */
export const SiteCta: React.FC<SiteCtaProps> = ({
  ctaUrl,
  subtitle,
  accentColor = COLORS.teal,
  stats,
  statsStart: ssStart,
  ctaStart: csStart,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { s } = useScale();

  const STATS_START = ssStart ?? 32;
  const CTA_START = csStart ?? 50;
  const compressed = CTA_START <= 30;

  // Derived timing
  const statsEnd = STATS_START + 10;
  const networkFadeStart = CTA_START - (compressed ? 6 : 10);
  const ctaFadeEnd = CTA_START + 5;
  const typewriterStart = CTA_START + 2;
  const subtitleStart = CTA_START + (compressed ? 8 : 12);
  const subtitleEnd = subtitleStart + 8;
  const matrixStart = CTA_START + (compressed ? 14 : 25);
  const matrixEnd = matrixStart + 10;
  const resolveSfxFrame = CTA_START;

  // Network phase
  const leftSlide = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const centerSlide = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 180 } });
  const rightSlide = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 180 } });

  const leftX = interpolate(leftSlide, [0, 1], [-120, 0]);
  const centerY = interpolate(centerSlide, [0, 1], [80, 0]);
  const rightX = interpolate(rightSlide, [0, 1], [120, 0]);

  const statsScale = spring({
    frame: frame - STATS_START,
    fps,
    config: { damping: compressed ? 10 : 12, stiffness: compressed ? 250 : 200 },
  });
  const statsVisible = frame >= STATS_START && frame < statsEnd;

  const networkFade = interpolate(frame, [networkFadeStart, CTA_START], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA phase
  const ctaVisible = frame >= CTA_START;
  const ctaOpacity = interpolate(frame, [CTA_START, ctaFadeEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [subtitleStart, subtitleEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const matrixOpacity = interpolate(frame, [matrixStart, matrixEnd], [0, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Window layout
  const windowWidth = Math.round(width * 0.28);
  const gap = Math.round(width * 0.03);
  const totalW = windowWidth * 3 + gap * 2;
  const startX = (width - totalW) / 2;
  const windowY = height * 0.18;
  const windowH = height * 0.35;

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

  const defaultStats = [
    { value: '98+', label: 'routes' },
    { value: '100%', label: 'free' },
    { value: 'Updated', label: 'daily' },
  ];

  const displayStats = stats ?? defaultStats;

  return (
    <SceneWrapper accentColor={accentColor} particleCount={25}>
      <Sequence from={0} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh} />
      </Sequence>

      <Sequence from={resolveSfxFrame} durationInFrames={20}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve} />
      </Sequence>

      {frame >= matrixStart && (
        <MatrixRain opacity={matrixOpacity} color={accentColor} columns={25} speed={0.6} />
      )}

      {/* Network phase */}
      <div style={{ opacity: networkFade }}>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: s(8),
                border: `1px solid ${site.color}33`,
                overflow: 'hidden',
                boxShadow: `0 0 40px ${site.color}22, 0 0 80px ${site.color}11`,
                backgroundColor: COLORS.canvas,
                padding: s(24),
              }}
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
                <div style={{ fontSize: s(14), color: COLORS.textSecondary }}>
                  {site.tagline}
                </div>
              </div>
            </div>
          </div>
        ))}

        <ConnectionLines
          points={connectionPoints}
          startFrame={10}
          durationFrames={compressed ? 12 : 18}
          color={accentColor}
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
              {displayStats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <span style={{ color: COLORS.border, fontSize: s(32) }}>|</span>}
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: accentColor, fontWeight: 800, fontSize: s(36) }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: s(14), color: COLORS.textSecondary }}>
                      {stat.label}
                    </span>
                  </span>
                </React.Fragment>
              ))}
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
            text={ctaUrl}
            startFrame={typewriterStart}
            speed={0.4}
            color={accentColor}
            fontSize={s(64)}
            showCursor={true}
            cursorColor={accentColor}
          />

          <div
            style={{
              fontSize: s(22),
              color: COLORS.textSecondary,
              opacity: subtitleOpacity,
              textAlign: 'center',
              letterSpacing: 1,
              textShadow: `0 0 ${s(15)}px ${accentColor}22`,
            }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </SceneWrapper>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { SITES, STATS } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';
import { ConnectionLines } from '../components/ConnectionLines';
import { MatrixRain } from '../components/MatrixRain';

/**
 * Scene 4 — CTA + Network (255 frames / ~8.5s)
 * Merged scene: 3-site network reveal → shawnos.ai CTA.
 *
 * Frames 0-60:    3 site cards slide in from different directions
 * Frames 40-100:  SVG connection lines draw on
 * Frames 100-130: Stats overlay fades in
 * Frames 140-180: Everything fades, shawnos.ai types out
 * Frames 180-200: "Free. Open. Updated daily." fades in
 * Frames 200-255: Hold with cursor blink + matrix rain
 */
export const CtaNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Network Phase (frames 0-130) ──

  // Three cards slide in
  const leftSlide = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const centerSlide = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 120 } });
  const rightSlide = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 120 } });

  const leftX = interpolate(leftSlide, [0, 1], [-120, 0]);
  const centerY = interpolate(centerSlide, [0, 1], [80, 0]);
  const rightX = interpolate(rightSlide, [0, 1], [120, 0]);

  // Stats overlay (frames 100-130)
  const statsScale = spring({
    frame: frame - 100,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const statsVisible = frame >= 100 && frame < 140;

  // ── Transition to CTA (frames 130-140) ──
  const networkFade = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── CTA Phase (frames 140+) ──
  const ctaVisible = frame >= 140;
  const ctaOpacity = interpolate(frame, [140, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle (frames 180-200)
  const subtitleOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Matrix rain (frames 200+)
  const matrixOpacity = interpolate(frame, [200, 220], [0, 0.08], {
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
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Whoosh SFX at scene start */}
      <Sequence from={0} durationInFrames={15}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh} />
      </Sequence>

      {/* Resolve SFX at CTA reveal */}
      <Sequence from={140} durationInFrames={20}>
        <Audio src={AUDIO.resolve} volume={VOLUMES.resolve} />
      </Sequence>

      {/* Matrix rain background — CTA phase */}
      {frame >= 200 && (
        <MatrixRain opacity={matrixOpacity} color={COLORS.green} columns={25} speed={0.6} />
      )}

      {/* Network phase */}
      <div style={{ opacity: networkFade }}>
        {/* Three terminal windows */}
        {windows.map(({ site, x, transform }, i) => (
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
                  minHeight: windowH - 80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '12px 0',
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: site.color,
                    marginBottom: 12,
                  }}
                >
                  {site.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
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
          startFrame={40}
          durationFrames={60}
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
                gap: 24,
                fontSize: 22,
                color: COLORS.textPrimary,
                backgroundColor: COLORS.canvasSubtle,
                padding: '14px 28px',
                borderRadius: 12,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <span>
                <span style={{ color: COLORS.green, fontWeight: 700 }}>{STATS.routes}</span> routes
              </span>
              <span style={{ color: COLORS.textMuted }}>|</span>
              <span>Updated daily</span>
              <span style={{ color: COLORS.textMuted }}>|</span>
              <span>
                <span style={{ color: COLORS.green, fontWeight: 700 }}>100%</span> free
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA phase */}
      {ctaVisible && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            opacity: ctaOpacity,
            zIndex: 10,
          }}
        >
          <TypewriterText
            text="shawnos.ai"
            startFrame={145}
            speed={0.35}
            color={COLORS.green}
            fontSize={64}
            showCursor={true}
            cursorColor={COLORS.green}
          />

          <div
            style={{
              fontSize: 22,
              color: COLORS.textSecondary,
              opacity: subtitleOpacity,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Free. Open. Updated daily.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

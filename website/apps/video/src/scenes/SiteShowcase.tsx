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
import { AUDIO, VOLUMES } from '../lib/sounds';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

interface Concept {
  readonly name: string;
  readonly color: string;
  readonly subtitle: string;
}

interface RevealStat {
  readonly value: string;
  readonly label: string;
}

interface SiteShowcaseProps {
  concepts: readonly Concept[];
  revealStats: readonly RevealStat[];
  holdText: string;
}

const FRAMES_PER_CONCEPT = 10;
const FLASH_START = 50;
const FLASH_END = 60;
const REVEAL_START = 58;
const HOLD_START = 82;

/**
 * Generic Showcase scene (100 frames / ~3.3s).
 * Text-based concept montage -> flash -> stat reveal -> hold.
 *
 * Frames 0-50:   5 concepts x 10f each
 * Frames 50-60:  White flash + level-up SFX
 * Frames 58-82:  3 stats reveal (staggered springs)
 * Frames 82-100: Hold with summary text
 */
export const SiteShowcase: React.FC<SiteShowcaseProps> = ({
  concepts,
  revealStats,
  holdText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  // ── Concept montage (frames 0-50) ──
  const conceptIndex = Math.min(
    Math.floor(frame / FRAMES_PER_CONCEPT),
    concepts.length - 1,
  );
  const localFrame = frame - conceptIndex * FRAMES_PER_CONCEPT;
  const current = concepts[conceptIndex];

  const nameScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 300 },
  });

  const subtitleOpacity = interpolate(localFrame, [2, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Flash (frames 50-60) ──
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, 55, FLASH_END],
    [0, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Stat reveal (frames 58+) ──
  // Three stats stagger 6 frames apart
  const stat1Scale = spring({
    frame: frame - 58,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const stat1Y = interpolate(
    spring({ frame: frame - 58, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1],
    [40, 0],
  );

  const stat2Scale = spring({
    frame: frame - 64,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const stat2Y = interpolate(
    spring({ frame: frame - 64, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1],
    [40, 0],
  );

  const stat3Scale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const stat3Y = interpolate(
    spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 200 } }),
    [0, 1],
    [50, 0],
  );

  const holdOpacity = interpolate(frame, [HOLD_START, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isMontagePhase = frame < FLASH_START;
  const isFlashPhase = frame >= FLASH_START && frame < FLASH_END;
  const showReveal = frame >= REVEAL_START;
  const isHoldPhase = frame >= HOLD_START;

  const accentColor = isMontagePhase ? current.color : COLORS.green;

  const statScales = [stat1Scale, stat2Scale, stat3Scale];
  const statYs = [stat1Y, stat2Y, stat3Y];
  const statStarts = [58, 64, 70];

  return (
    <SceneWrapper accentColor={accentColor} particleCount={20}>
      {/* Level-up SFX */}
      <Sequence from={FLASH_START} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {/* Concept montage phase */}
      {isMontagePhase && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: s(16),
          }}
        >
          {/* Big concept name */}
          <div
            style={{
              fontSize: s(56),
              fontWeight: 800,
              color: current.color,
              transform: `scale(${nameScale})`,
              transformOrigin: 'center center',
              textAlign: 'center',
              letterSpacing: s(1),
              textShadow: `0 0 ${s(20)}px ${current.color}44`,
            }}
          >
            {current.name}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: s(22),
              fontWeight: 500,
              color: COLORS.textSecondary,
              opacity: subtitleOpacity,
              textAlign: 'center',
              letterSpacing: s(2),
              textTransform: 'uppercase',
            }}
          >
            {current.subtitle}
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: 'flex',
              gap: s(8),
              marginTop: s(4),
            }}
          >
            {concepts.map((c, i) => (
              <div
                key={c.name}
                style={{
                  width: s(8),
                  height: s(8),
                  borderRadius: '50%',
                  backgroundColor: i === conceptIndex ? c.color : COLORS.textMuted,
                  opacity: i === conceptIndex ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Post-flash: stat reveal */}
      {showReveal && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: s(24),
          }}
        >
          {/* 3-stat row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: s(40),
            }}
          >
            {revealStats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: s(8),
                  transform: `scale(${statScales[i] ?? 0}) translateY(${statYs[i] ?? 40}px)`,
                  transformOrigin: 'center center',
                  opacity: frame >= statStarts[i] ? 1 : 0,
                }}
              >
                <div
                  style={{
                    fontSize: i === 2 ? s(64) : s(52),
                    fontWeight: 800,
                    color: COLORS.textPrimary,
                    textShadow: `0 0 ${s(18)}px ${COLORS.green}55`,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: s(16),
                    fontWeight: 500,
                    color: COLORS.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: s(1),
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Hold text */}
          {isHoldPhase && (
            <div
              style={{
                fontSize: s(28),
                fontWeight: 700,
                color: COLORS.textPrimary,
                textAlign: 'center',
                textShadow: `0 0 ${s(15)}px ${COLORS.green}33`,
                opacity: holdOpacity,
              }}
            >
              {holdText}
            </div>
          )}
        </div>
      )}

      {/* White flash */}
      {isFlashPhase && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: flashOpacity,
            zIndex: 50,
          }}
        />
      )}
    </SceneWrapper>
  );
};

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
  framesPerConcept?: number;
}

/**
 * Generic Showcase scene.
 * Text-based concept montage -> flash -> stat reveal -> hold.
 * Timing configurable via framesPerConcept prop.
 */
export const SiteShowcase: React.FC<SiteShowcaseProps> = ({
  concepts,
  revealStats,
  holdText,
  framesPerConcept: fpcProp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  const FRAMES_PER_CONCEPT = fpcProp ?? 10;
  const FLASH_START = FRAMES_PER_CONCEPT * concepts.length;
  const compressed = FRAMES_PER_CONCEPT <= 8;
  const FLASH_END = FLASH_START + (compressed ? 8 : 10);
  const REVEAL_START = FLASH_START + (compressed ? 5 : 8);
  const statStagger = compressed ? 2 : 6;
  const HOLD_START = REVEAL_START + statStagger * 2 + (compressed ? 6 : 12);

  // ── Concept montage ──
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

  // ── Flash ──
  const flashMid = FLASH_START + Math.round((FLASH_END - FLASH_START) / 2);
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, flashMid, FLASH_END],
    [0, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Stat reveal ──
  const statStarts = [
    REVEAL_START,
    REVEAL_START + statStagger,
    REVEAL_START + statStagger * 2,
  ];

  const statScales = statStarts.map((start, i) =>
    spring({
      frame: frame - start,
      fps,
      config: i === 2
        ? { damping: 10, stiffness: 220 }
        : { damping: 12, stiffness: 200 },
    }),
  );

  const statYs = statStarts.map((start, i) =>
    interpolate(
      spring({
        frame: frame - start,
        fps,
        config: i === 2
          ? { damping: 12, stiffness: 200 }
          : { damping: 14, stiffness: 180 },
      }),
      [0, 1],
      [i === 2 ? 50 : 40, 0],
    ),
  );

  const holdOpacity = interpolate(frame, [HOLD_START, HOLD_START + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isMontagePhase = frame < FLASH_START;
  const isFlashPhase = frame >= FLASH_START && frame < FLASH_END;
  const showReveal = frame >= REVEAL_START;
  const isHoldPhase = frame >= HOLD_START;

  const accentColor = isMontagePhase ? current.color : COLORS.green;

  return (
    <SceneWrapper accentColor={accentColor} particleCount={20}>
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

import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Audio,
  Sequence,
} from 'remotion';
import { Trail } from '@remotion/motion-blur';
import { COLORS } from '../lib/tokens';
import { CHARACTER_CLASSES } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

const FRAMES_PER_CLASS = 10;
const MONTAGE_END = FRAMES_PER_CLASS * CHARACTER_CLASSES.length; // 50
const FLASH_START = 50;
const FLASH_END = 60;
const REVEAL_START = 58;
const HOLD_START = 82;

/**
 * Scene 3 — Progression (100 frames / ~3.3s)
 * Fast class montage → flash → sequential avatar reveal → hold.
 *
 * Frames 0-50:   Class montage — 5 classes × 10f each (snappy)
 * Frames 50-60:  White flash + level-up SFX
 * Frames 58-82:  Sequential avatar reveal — each enters with its own spring
 *   58: Polymath slides up
 *   64: Tier-5 slides up
 *   70: Grand Master slides up (largest, most dramatic)
 *   68: "LEVEL UP" springs in
 * Frames 82-100: Hold — "5 classes. Built-in progression."
 */
export const ProgressionV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  // ── Class montage phase (frames 0-50) ──
  const classIndex = Math.min(
    Math.floor(frame / FRAMES_PER_CLASS),
    CHARACTER_CLASSES.length - 1,
  );
  const localClassFrame = frame - classIndex * FRAMES_PER_CLASS;
  const currentClass = CHARACTER_CLASSES[classIndex];

  // Avatar spring-in per class (snappier)
  const classAvatarScale = spring({
    frame: localClassFrame,
    fps,
    config: { damping: 10, stiffness: 300 },
  });

  // Class name fade in (faster)
  const classNameOpacity = interpolate(localClassFrame, [2, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Level-up flash (frames 50-60) ──
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, 55, FLASH_END],
    [0, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Sequential avatar reveal (frames 58+) ──
  // Each avatar gets its own spring with staggered start for a dramatic build

  // Avatar 1: Polymath (left) — enters at frame 58
  const polymathScale = spring({
    frame: frame - 58,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const polymathSlideY = interpolate(
    spring({ frame: frame - 58, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1],
    [40, 0],
  );

  // Avatar 2: Tier-5 (center) — enters at frame 64
  const tier5Scale = spring({
    frame: frame - 64,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const tier5SlideY = interpolate(
    spring({ frame: frame - 64, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1],
    [40, 0],
  );

  // Avatar 3: Grand Master (right, largest) — enters at frame 70
  const grandMasterScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const grandMasterSlideY = interpolate(
    spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 200 } }),
    [0, 1],
    [50, 0],
  );

  // "LEVEL UP" text — springs at frame 68
  const levelUpScale = spring({
    frame: frame - 68,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // ── Hold state (frames 82-100) ──
  const holdOpacity = interpolate(frame, [HOLD_START, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isMontagePhase = frame < MONTAGE_END;
  const isFlashPhase = frame >= FLASH_START && frame < FLASH_END;
  const showReveal = frame >= REVEAL_START;
  const isHoldPhase = frame >= HOLD_START;

  // Determine accent color based on phase
  const accentColor = isMontagePhase ? currentClass.color : COLORS.green;

  // Level-up content with sequential avatar reveal
  const LevelUpContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s(20),
        width: '100%',
        height: '100%',
      }}
    >
      {/* 3-avatar row: sequential reveal, centered vertically */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s(32),
        }}
      >
        {/* Polymath (left) — enters first */}
        <div
          style={{
            width: s(130),
            height: s(130),
            transform: `scale(${polymathScale}) translateY(${polymathSlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(14)}px #00ff4155)`,
            opacity: frame >= 58 ? 0.9 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/class-polymath-static.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Tier-5 (center) — enters second */}
        <div
          style={{
            width: s(150),
            height: s(150),
            transform: `scale(${tier5Scale}) translateY(${tier5SlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(18)}px ${COLORS.green}77)`,
            opacity: frame >= 64 ? 0.95 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/tier-5-static.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Grand Master (right, largest) — enters last, biggest impact */}
        <div
          style={{
            width: s(190),
            height: s(190),
            transform: `scale(${grandMasterScale}) translateY(${grandMasterSlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(28)}px #f59e0b99) drop-shadow(0 0 ${s(48)}px #f59e0b55)`,
            opacity: frame >= 70 ? 1 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/tier-6-static.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>

      {/* "LEVEL UP" text or hold state */}
      {!isHoldPhase && (
        <div
          style={{
            fontSize: s(48),
            fontWeight: 800,
            color: COLORS.green,
            transform: `scale(${levelUpScale})`,
            transformOrigin: 'center center',
            textAlign: 'center',
            letterSpacing: s(4),
            textShadow: `0 0 ${s(20)}px ${COLORS.green}66, 0 0 ${s(40)}px ${COLORS.green}33`,
            opacity: frame >= 68 ? 1 : 0,
          }}
        >
          LEVEL UP
        </div>
      )}

      {isHoldPhase && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: s(8),
            opacity: holdOpacity,
          }}
        >
          <div
            style={{
              fontSize: s(28),
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: 'center',
              textShadow: `0 0 ${s(15)}px ${COLORS.green}33`,
            }}
          >
            5 classes. Built-in progression.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SceneWrapper accentColor={accentColor} particleCount={20}>
      {/* Level-up SFX */}
      <Sequence from={FLASH_START} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {/* Class montage phase */}
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
          {/* Class avatar — bigger for impact */}
          <div
            style={{
              width: s(180),
              height: s(180),
              transform: `scale(${classAvatarScale})`,
              transformOrigin: 'center center',
              filter: `drop-shadow(0 0 ${s(18)}px ${currentClass.color}77)`,
            }}
          >
            <Img
              src={staticFile(`progression/avatars/${currentClass.avatar}`)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          </div>

          {/* Class name */}
          <div
            style={{
              fontSize: s(36),
              fontWeight: 700,
              color: currentClass.color,
              opacity: classNameOpacity,
              textAlign: 'center',
              letterSpacing: s(2),
              textShadow: `0 0 ${s(20)}px ${currentClass.color}44`,
            }}
          >
            {currentClass.name}
          </div>

          {/* Class index dots */}
          <div
            style={{
              display: 'flex',
              gap: s(8),
              marginTop: s(4),
            }}
          >
            {CHARACTER_CLASSES.map((cls, i) => (
              <div
                key={cls.name}
                style={{
                  width: s(8),
                  height: s(8),
                  borderRadius: '50%',
                  backgroundColor: i === classIndex ? cls.color : COLORS.textMuted,
                  opacity: i === classIndex ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Post-flash: Sequential avatar reveal with Trail */}
      {showReveal && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Trail layers={3} lagInFrames={0.4} trailOpacity={0.35}>
            <LevelUpContent />
          </Trail>
        </div>
      )}

      {/* White flash overlay */}
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

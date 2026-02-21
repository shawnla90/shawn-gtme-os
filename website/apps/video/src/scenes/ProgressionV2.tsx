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

const FRAMES_PER_CLASS = 8;
const MONTAGE_END = FRAMES_PER_CLASS * CHARACTER_CLASSES.length; // 40
const FLASH_START = 40;
const FLASH_END = 48;
const REVEAL_START = 45;
const HOLD_START = 53;

/**
 * Scene 3 — Progression (58 frames / ~1.93s)
 * Fast class montage → flash → quick avatar reveal → brief hold.
 *
 * Frames 0-40:   Class montage — 5 classes × 8f each
 * Frames 40-48:  White flash + level-up SFX
 * Frames 45-53:  Quick avatar reveal (3 avatars, 2f stagger)
 * Frames 53-58:  Brief hold
 */
export const ProgressionV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  // ── Class montage phase (frames 0-35) ──
  const classIndex = Math.min(
    Math.floor(frame / FRAMES_PER_CLASS),
    CHARACTER_CLASSES.length - 1,
  );
  const localClassFrame = frame - classIndex * FRAMES_PER_CLASS;
  const currentClass = CHARACTER_CLASSES[classIndex];

  const classAvatarScale = spring({
    frame: localClassFrame,
    fps,
    config: { damping: 8, stiffness: 350 },
  });

  const classNameOpacity = interpolate(localClassFrame, [1, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Flash (frames 35-43) ──
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, 44, FLASH_END],
    [0, 0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Quick avatar reveal (frames 40+, 2f stagger) ──
  const polymathScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 10, stiffness: 250 },
  });
  const polymathSlideY = interpolate(
    spring({ frame: frame - 45, fps, config: { damping: 12, stiffness: 220 } }),
    [0, 1],
    [30, 0],
  );

  const tier5Scale = spring({
    frame: frame - 47,
    fps,
    config: { damping: 10, stiffness: 250 },
  });
  const tier5SlideY = interpolate(
    spring({ frame: frame - 47, fps, config: { damping: 12, stiffness: 220 } }),
    [0, 1],
    [30, 0],
  );

  const grandMasterScale = spring({
    frame: frame - 49,
    fps,
    config: { damping: 8, stiffness: 280 },
  });
  const grandMasterSlideY = interpolate(
    spring({ frame: frame - 49, fps, config: { damping: 10, stiffness: 250 } }),
    [0, 1],
    [40, 0],
  );

  const levelUpScale = spring({
    frame: frame - 48,
    fps,
    config: { damping: 10, stiffness: 250 },
  });

  const holdOpacity = interpolate(frame, [HOLD_START, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isMontagePhase = frame < MONTAGE_END;
  const isFlashPhase = frame >= FLASH_START && frame < FLASH_END;
  const showReveal = frame >= REVEAL_START;
  const isHoldPhase = frame >= HOLD_START;

  const accentColor = isMontagePhase ? currentClass.color : COLORS.green;

  const LevelUpContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s(16),
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s(28),
        }}
      >
        <div
          style={{
            width: s(110),
            height: s(110),
            transform: `scale(${polymathScale}) translateY(${polymathSlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(12)}px #00ff4155)`,
            opacity: frame >= 45 ? 0.9 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/class-polymath-static.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
          />
        </div>

        <div
          style={{
            width: s(130),
            height: s(130),
            transform: `scale(${tier5Scale}) translateY(${tier5SlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(16)}px ${COLORS.green}77)`,
            opacity: frame >= 47 ? 0.95 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/tier-5-static.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
          />
        </div>

        <div
          style={{
            width: s(160),
            height: s(160),
            transform: `scale(${grandMasterScale}) translateY(${grandMasterSlideY}px)`,
            transformOrigin: 'center center',
            filter: `drop-shadow(0 0 ${s(24)}px #f59e0b99) drop-shadow(0 0 ${s(40)}px #f59e0b55)`,
            opacity: frame >= 49 ? 1 : 0,
          }}
        >
          <Img
            src={staticFile('progression/avatars/tier-6-static.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {!isHoldPhase && (
        <div
          style={{
            fontSize: s(40),
            fontWeight: 800,
            color: COLORS.green,
            transform: `scale(${levelUpScale})`,
            transformOrigin: 'center center',
            textAlign: 'center',
            letterSpacing: s(3),
            textShadow: `0 0 ${s(18)}px ${COLORS.green}66, 0 0 ${s(36)}px ${COLORS.green}33`,
            opacity: frame >= 48 ? 1 : 0,
          }}
        >
          LEVEL UP
        </div>
      )}

      {isHoldPhase && (
        <div style={{ opacity: holdOpacity }}>
          <div
            style={{
              fontSize: s(24),
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: 'center',
              textShadow: `0 0 ${s(12)}px ${COLORS.green}33`,
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
      <Sequence from={FLASH_START} durationInFrames={20}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {isMontagePhase && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: s(12),
          }}
        >
          <div
            style={{
              width: s(150),
              height: s(150),
              transform: `scale(${classAvatarScale})`,
              transformOrigin: 'center center',
              filter: `drop-shadow(0 0 ${s(16)}px ${currentClass.color}77)`,
            }}
          >
            <Img
              src={staticFile(`progression/avatars/${currentClass.avatar}`)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
            />
          </div>

          <div
            style={{
              fontSize: s(32),
              fontWeight: 700,
              color: currentClass.color,
              opacity: classNameOpacity,
              textAlign: 'center',
              letterSpacing: s(2),
              textShadow: `0 0 ${s(18)}px ${currentClass.color}44`,
            }}
          >
            {currentClass.name}
          </div>

          <div style={{ display: 'flex', gap: s(6) }}>
            {CHARACTER_CLASSES.map((cls, i) => (
              <div
                key={cls.name}
                style={{
                  width: s(7),
                  height: s(7),
                  borderRadius: '50%',
                  backgroundColor: i === classIndex ? cls.color : COLORS.textMuted,
                  opacity: i === classIndex ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

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
          <Trail layers={3} lagInFrames={0.3} trailOpacity={0.3}>
            <LevelUpContent />
          </Trail>
        </div>
      )}

      {isFlashPhase && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'white',
            opacity: flashOpacity,
            zIndex: 50,
          }}
        />
      )}
    </SceneWrapper>
  );
};

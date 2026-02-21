import React from 'react';
import {
  AbsoluteFill,
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
import { COLORS, FONTS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';

/**
 * Scene 3 — Progression (250 frames / ~8.3s)
 * The "wow" moment. RPG + learning = dopamine.
 * Compressed from V1's 15s to 8s. Trail motion blur on level-up.
 *
 * Frames 0-30:   Tier-3 avatar springs in
 * Frames 30-50:  "Built-in progression" title
 * Frames 50-80:  XP bar animates 0→22,500
 * Frames 80-120: Quick feature text flashes
 * Frames 120-140: White flash + Trail motion blur (level-up)
 * Frames 140-160: Tier-5 avatar springs in
 * Frames 160-180: "LEVEL UP" text with bouncy spring
 * Frames 180-250: Hold — "Voice Alchemist | Lv 30"
 */
export const ProgressionV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Avatar scale-in (frames 0-30) ---
  const avatarScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // --- Title (frames 30-50) ---
  const titleSlide = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const titleOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- XP bar (frames 50-80) ---
  const xpBarWidth = interpolate(frame, [50, 80], [0, 75], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xpBarOpacity = interpolate(frame, [50, 58], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xpValue = Math.round(
    interpolate(frame, [50, 80], [0, 22500], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // --- Quick feature texts (frames 80-120, ~13f each) ---
  const featureTexts = [
    { text: '5 character classes', start: 80, end: 93 },
    { text: 'Quest board with challenges', start: 93, end: 106 },
    { text: 'Daily log with stats', start: 106, end: 120 },
  ];

  // --- Level-up flash (frames 120-140) ---
  const flashOpacity = interpolate(
    frame,
    [120, 130, 140],
    [0, 0.7, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- New avatar (frames 140-160) ---
  const newAvatarScale = spring({
    frame: frame - 140,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // --- "LEVEL UP" text (frames 160-180) ---
  const levelUpScale = spring({
    frame: frame - 160,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // --- Hold state (frames 180-250) ---
  const holdOpacity = interpolate(frame, [180, 195], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isLevelUpPhase = frame >= 120;
  const showLevelUpAvatar = frame >= 140;
  const showLevelUpText = frame >= 160;
  const isHoldPhase = frame >= 180;

  // Level-up content wrapped in Trail for motion blur effect
  const LevelUpContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* Tier-5 avatar */}
      <div
        style={{
          width: 192,
          height: 192,
          transform: `scale(${newAvatarScale})`,
          transformOrigin: 'center center',
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

      {/* "LEVEL UP" text */}
      {showLevelUpText && !isHoldPhase && (
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.green,
            transform: `scale(${levelUpScale})`,
            transformOrigin: 'center center',
            textAlign: 'center',
            letterSpacing: 4,
          }}
        >
          LEVEL UP
        </div>
      )}

      {/* Hold state info */}
      {isHoldPhase && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: holdOpacity,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: 'center',
            }}
          >
            Voice Alchemist
          </div>
          <div
            style={{
              fontSize: 22,
              color: COLORS.purple,
              textAlign: 'center',
            }}
          >
            Lv 30
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.mono,
        gap: 20,
      }}
    >
      {/* Level-up SFX */}
      <Sequence from={120} durationInFrames={30}>
        <Audio src={AUDIO.levelUp} volume={VOLUMES.levelUp} />
      </Sequence>

      {/* Pre-level-up: tier-3 avatar + progression content */}
      {!isLevelUpPhase && (
        <>
          <div
            style={{
              width: 192,
              height: 192,
              transform: `scale(${avatarScale})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile('progression/avatars/tier-3-static.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          </div>

          {/* Title */}
          {frame >= 30 && (
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.textPrimary,
                opacity: titleOpacity,
                transform: `translateY(${(1 - titleSlide) * 20}px)`,
                textAlign: 'center',
              }}
            >
              Built-in progression system
            </div>
          )}

          {/* XP Bar */}
          {frame >= 50 && (
            <div
              style={{
                width: '60%',
                opacity: xpBarOpacity,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 16,
                  color: COLORS.textSecondary,
                }}
              >
                <span>XP</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {xpValue.toLocaleString()} / 30,000
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 12,
                  backgroundColor: COLORS.canvasSubtle,
                  borderRadius: 6,
                  overflow: 'hidden',
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    width: `${xpBarWidth}%`,
                    height: '100%',
                    backgroundColor: COLORS.purple,
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          )}

          {/* Feature text cuts */}
          {featureTexts.map(({ text, start, end }) => {
            const featureOpacity = interpolate(
              frame,
              [start, start + 5, end - 5, end],
              [0, 1, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            if (frame < start || frame > end) return null;
            return (
              <div
                key={text}
                style={{
                  fontSize: 24,
                  color: COLORS.green,
                  opacity: featureOpacity,
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                {text}
              </div>
            );
          })}
        </>
      )}

      {/* Post-level-up: Trail-wrapped content */}
      {showLevelUpAvatar && (
        <Trail layers={4} lagInFrames={0.5} trailOpacity={0.4}>
          <LevelUpContent />
        </Trail>
      )}

      {/* White flash overlay */}
      {frame >= 120 && frame <= 140 && (
        <AbsoluteFill
          style={{
            backgroundColor: 'white',
            opacity: flashOpacity,
            zIndex: 50,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

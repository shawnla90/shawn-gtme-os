import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';

/**
 * Scene 4 — Progression (450 frames / 15s)
 * The "wow" moment. RPG + learning = dopamine.
 */
export const Progression: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // --- Avatar scale-in (frames 0-40) ---
  const avatarScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // --- "Built-in progression system" text (frames 40-80) ---
  const titleSlide = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const titleOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- XP bar (frames 80-120) ---
  const xpBarWidth = interpolate(frame, [80, 120], [0, 75], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xpBarOpacity = interpolate(frame, [80, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xpValue = Math.round(
    interpolate(frame, [80, 120], [0, 22500], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // --- Quick text cuts (frames 120-200) ---
  const featureTexts = [
    { text: '5 character classes', start: 120, end: 150 },
    { text: 'Quest board with 5 challenges', start: 150, end: 180 },
    { text: 'Daily log with stats tracking', start: 180, end: 200 },
  ];

  // --- Level-up flash (frames 200-220) ---
  const flashOpacity = interpolate(
    frame,
    [200, 210, 220],
    [0, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- New avatar (frames 220-250) ---
  const newAvatarScale = spring({
    frame: frame - 220,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // --- "LEVEL UP" text (frames 250-280) ---
  const levelUpScale = spring({
    frame: frame - 250,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // --- Hold state (frames 280-450) ---
  const holdOpacity = interpolate(frame, [280, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isLevelUpPhase = frame >= 200;
  const showLevelUpAvatar = frame >= 220;
  const showLevelUpText = frame >= 250;
  const isHoldPhase = frame >= 280;

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
      {/* Avatar — tier-3 before level-up, tier-5 after */}
      {!showLevelUpAvatar && (
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
      )}

      {showLevelUpAvatar && (
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
      )}

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

      {/* Pre-level-up content */}
      {!isLevelUpPhase && (
        <>
          {/* Title */}
          {frame >= 40 && (
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
          {frame >= 80 && (
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

          {/* Feature text cuts (frames 120-200) */}
          {featureTexts.map(({ text, start, end }) => {
            const featureOpacity = interpolate(
              frame,
              [start, start + 8, end - 8, end],
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

      {/* Hold state — title below leveled-up avatar */}
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

      {/* White flash overlay */}
      {frame >= 200 && frame <= 220 && (
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

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SceneWrapper } from '../components/SceneWrapper';
import { ChatBubble } from '../components/ChatBubble';
import { TypingDots } from '../components/TypingDots';
import { COLORS, FONTS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { NIO_CHAT_EXCHANGES } from '../lib/data';
import { useScale } from '../lib/useScale';

/**
 * Scene 4: Chat Reveal — 420f / 14s
 *
 * Chat window slides up with Nio avatar + XP ring in header.
 * Two chat exchanges with typing indicators.
 * "+10 XP" float animation.
 */

// Timing
const WINDOW_SLIDE = 0;
const USER_1 = 50;
const TYPING_1 = 80;
const NIO_1 = 120;
const USER_2 = 200;
const TYPING_2 = 230;
const NIO_2 = 270;
const XP_FLOAT = 310;

export const NioChatReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // Chat window slide up
  const slideUp = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80, mass: 1 },
    durationInFrames: 40,
  });

  const windowY = interpolate(slideUp, [0, 1], [sv(200), 0]);
  const windowOpacity = interpolate(slideUp, [0, 1], [0, 1]);

  // XP ring progress (conic gradient)
  const xpProgress = interpolate(frame, [0, 300], [0.55, 0.65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // +10 XP float
  const xpFloatOpacity = interpolate(frame, [XP_FLOAT, XP_FLOAT + 10, XP_FLOAT + 50, XP_FLOAT + 70], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xpFloatY = interpolate(frame, [XP_FLOAT, XP_FLOAT + 70], [0, -sv(40)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper
      accentColor={COLORS.nioBlue}
      particleCount={8}
      scanlineOpacity={0.01}
    >
      {/* SFX */}
      <Sequence from={0} durationInFrames={20}>
        <Audio src={AUDIO.whoosh} volume={VOLUMES.whoosh * 0.5} />
      </Sequence>
      <Sequence from={USER_1} durationInFrames={10}>
        <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick} />
      </Sequence>
      <Sequence from={NIO_1} durationInFrames={10}>
        <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip} />
      </Sequence>
      <Sequence from={USER_2} durationInFrames={10}>
        <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick} />
      </Sequence>
      <Sequence from={NIO_2} durationInFrames={10}>
        <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip} />
      </Sequence>

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Chat window container */}
        <div
          style={{
            width: s(800),
            maxHeight: sv(1000),
            transform: `translateY(${windowY}px)`,
            opacity: windowOpacity,
            backgroundColor: COLORS.canvas,
            border: `1px solid ${COLORS.border}`,
            borderRadius: s(16),
            overflow: 'hidden',
            boxShadow: `0 ${s(8)}px ${s(40)}px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: s(12),
              padding: `${s(14)}px ${s(18)}px`,
              borderBottom: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.canvasSubtle,
            }}
          >
            {/* XP Ring + Avatar */}
            <div
              style={{
                position: 'relative',
                width: s(44),
                height: s(44),
              }}
            >
              {/* Conic gradient XP ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `conic-gradient(${COLORS.nioBlue} ${xpProgress * 360}deg, ${COLORS.border} ${xpProgress * 360}deg)`,
                  padding: s(3),
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: COLORS.canvas,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Img
                    src={staticFile('avatars/nio-tier-2-static.png')}
                    style={{
                      width: s(30),
                      height: s(30),
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: s(15), color: COLORS.textPrimary, fontWeight: 600 }}>
                Nio
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: s(10), color: COLORS.textSecondary }}>
                Blade tier &middot; 620 XP
              </div>
            </div>

            {/* Online indicator */}
            <div
              style={{
                marginLeft: 'auto',
                width: s(8),
                height: s(8),
                borderRadius: '50%',
                backgroundColor: COLORS.green,
                boxShadow: `0 0 ${s(6)}px ${COLORS.green}80`,
              }}
            />
          </div>

          {/* Chat messages area */}
          <div
            style={{
              padding: `${s(20)}px ${s(18)}px`,
              display: 'flex',
              flexDirection: 'column',
              minHeight: sv(500),
            }}
          >
            {/* Exchange 1 */}
            <ChatBubble
              text={NIO_CHAT_EXCHANGES[0].user}
              sender="user"
              appearFrame={USER_1}
            />
            <TypingDots
              appearFrame={TYPING_1}
              durationFrames={NIO_1 - TYPING_1}
            />
            <ChatBubble
              text={NIO_CHAT_EXCHANGES[0].nio}
              sender="agent"
              appearFrame={NIO_1}
              typewriter
              typewriterSpeed={1}
            />

            {/* Spacer */}
            <div style={{ height: s(20) }} />

            {/* Exchange 2 */}
            <ChatBubble
              text={NIO_CHAT_EXCHANGES[1].user}
              sender="user"
              appearFrame={USER_2}
            />
            <TypingDots
              appearFrame={TYPING_2}
              durationFrames={NIO_2 - TYPING_2}
            />
            <ChatBubble
              text={NIO_CHAT_EXCHANGES[1].nio}
              sender="agent"
              appearFrame={NIO_2}
              typewriter
              typewriterSpeed={1.2}
            />
          </div>
        </div>

        {/* +10 XP float */}
        {frame >= XP_FLOAT && (
          <div
            style={{
              position: 'absolute',
              top: sv(250),
              right: s(200),
              fontFamily: FONTS.mono,
              fontSize: s(22),
              fontWeight: 700,
              color: COLORS.nioBlue,
              opacity: xpFloatOpacity,
              transform: `translateY(${xpFloatY}px)`,
              textShadow: `0 0 ${s(12)}px ${COLORS.nioBlue}80`,
            }}
          >
            +10 XP
          </div>
        )}
      </AbsoluteFill>
    </SceneWrapper>
  );
};

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { Gif } from '@remotion/gif';
import { COLORS, FONTS } from '../lib/tokens';
import { useScale } from '../lib/useScale';
import type { Slide } from '../lib/slideshow-data';
import type { NioAnimationName } from '../lib/nio-animation-state';
import { resolveAnimation, getAnimFrameCount } from '../lib/nio-animation-state';

interface TikTokSlideProps {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
}

/**
 * Single slide for TikTok slideshow — vertical 9:16 layout.
 * Supports: text-only, sprite pair (Nio x Claude), and chat exchange modes.
 */
export const TikTokSlide: React.FC<TikTokSlideProps> = ({
  slide,
  slideIndex,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // Headline spring entrance
  const headlineScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const headlineY = interpolate(headlineScale, [0, 1], [40, 0]);

  // Body fade in slightly delayed
  const bodyOpacity = interpolate(
    frame,
    [8, 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const bodyY = interpolate(
    frame,
    [8, 18],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Icon pulse
  const iconScale = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 8, stiffness: 300 },
  });

  // Subtle glow pulse on accent
  const glowOpacity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.03, 0.08],
  );

  const isChat = !!slide.chat;
  const hasSprites = !!slide.sprites;
  const hasGif = !!slide.gif;

  // Split-screen layout: top = content, bottom = GIF
  if (hasGif) {
    return (
      <SplitScreenSlide
        slide={slide}
        slideIndex={slideIndex}
        totalSlides={totalSlides}
        frame={frame}
        fps={fps}
        headlineScale={headlineScale}
        headlineY={headlineY}
        bodyOpacity={bodyOpacity}
        bodyY={bodyY}
        iconScale={iconScale}
        glowOpacity={glowOpacity}
        s={s}
        sv={sv}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${sv(120)}px ${s(60)}px`,
        position: 'relative' as const,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Background accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: s(600),
          height: sv(600),
          borderRadius: '50%',
          background: `radial-gradient(circle, ${slide.accent}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${s(80)}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── CHAT MODE ── */}
      {isChat && (
        <>
          {slide.sprites && (
            <div style={{ marginBottom: sv(24) }}>
              <SpritePair frame={frame} fps={fps} s={s} sv={sv} nioTier={slide.nioTier} nioAnimation={slide.nioAnimation} />
            </div>
          )}
          <ChatSlide
            userText={slide.chat!.user}
            agentText={slide.chat!.agent as string | string[]}
            accent={slide.accent}
            frame={frame}
            fps={fps}
            s={s}
            sv={sv}
            nioTier={slide.nioTier}
          />
        </>
      )}

      {/* ── NORMAL TEXT MODE ── */}
      {!isChat && (
        <>
          {/* Icon */}
          {slide.icon && !hasSprites && (
            <div
              style={{
                fontSize: sv(80),
                transform: `scale(${iconScale})`,
                marginBottom: sv(32),
              }}
            >
              {slide.icon}
            </div>
          )}

          {/* Sprite pair: Nio x Claude */}
          {hasSprites && (
            <SpritePair frame={frame} fps={fps} s={s} sv={sv} nioTier={slide.nioTier} nioAnimation={slide.nioAnimation} />
          )}

          {/* Headline */}
          <div
            style={{
              fontSize: s(52),
              fontWeight: 800,
              color: COLORS.textPrimary,
              textAlign: 'center',
              lineHeight: 1.2,
              transform: `translateY(${headlineY}px) scale(${headlineScale})`,
              whiteSpace: 'pre-line',
              letterSpacing: -0.5,
            }}
          >
            {slide.headline}
          </div>

          {/* Body */}
          <div
            style={{
              fontSize: s(26),
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 1.5,
              marginTop: sv(28),
              opacity: bodyOpacity,
              transform: `translateY(${bodyY}px)`,
              whiteSpace: 'pre-line',
              maxWidth: s(800),
            }}
          >
            {slide.body}
          </div>

          {/* Accent underline */}
          <div
            style={{
              width: interpolate(headlineScale, [0, 1], [0, s(120)]),
              height: 3,
              backgroundColor: slide.accent,
              borderRadius: 2,
              marginTop: sv(24),
              boxShadow: `0 0 ${s(12)}px ${slide.accent}66`,
            }}
          />
        </>
      )}

      {/* Progress dots — bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(80),
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(12),
        }}
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === slideIndex ? s(24) : s(8),
              height: s(8),
              borderRadius: s(4),
              backgroundColor: i === slideIndex ? slide.accent : COLORS.textMuted,
              opacity: i === slideIndex ? 1 : 0.4,
              transition: 'width 0.2s',
              boxShadow: i === slideIndex ? `0 0 ${s(8)}px ${slide.accent}44` : 'none',
            }}
          />
        ))}
      </div>

      {/* Slide counter — top right */}
      <div
        style={{
          position: 'absolute',
          top: sv(48),
          right: s(36),
          fontSize: s(16),
          color: COLORS.textMuted,
          letterSpacing: 1,
        }}
      >
        {slideIndex + 1}/{totalSlides}
      </div>

      {/* Brand watermark — top left */}
      <div
        style={{
          position: 'absolute',
          top: sv(48),
          left: s(36),
          fontSize: s(14),
          color: COLORS.textMuted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        shawnos.ai
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Split Screen — top text, bottom GIF (TikTok style)
   ═══════════════════════════════════════════════════ */

const SplitScreenSlide: React.FC<{
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  frame: number;
  fps: number;
  headlineScale: number;
  headlineY: number;
  bodyOpacity: number;
  bodyY: number;
  iconScale: number;
  glowOpacity: number;
  s: (v: number) => number;
  sv: (v: number) => number;
}> = ({ slide, slideIndex, totalSlides, frame, fps, headlineScale, headlineY, bodyOpacity, bodyY, iconScale, glowOpacity, s, sv }) => {
  const gifAppear = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: FONTS.mono,
      }}
    >
      {/* Top half — content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${sv(60)}px ${s(50)}px`,
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: s(400),
            height: sv(400),
            borderRadius: '50%',
            background: `radial-gradient(circle, ${slide.accent}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: `blur(${s(60)}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Icon */}
        {slide.icon && (
          <div
            style={{
              fontSize: sv(60),
              transform: `scale(${iconScale})`,
              marginBottom: sv(16),
            }}
          >
            {slide.icon}
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            fontSize: s(44),
            fontWeight: 800,
            color: COLORS.textPrimary,
            textAlign: 'center',
            lineHeight: 1.2,
            transform: `translateY(${headlineY}px) scale(${headlineScale})`,
            whiteSpace: 'pre-line',
            letterSpacing: -0.5,
          }}
        >
          {slide.headline}
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: s(22),
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 1.5,
            marginTop: sv(16),
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
            whiteSpace: 'pre-line',
            maxWidth: s(700),
          }}
        >
          {slide.body}
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          width: '100%',
          height: 2,
          backgroundColor: COLORS.border,
        }}
      />

      {/* Bottom half — GIF */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          opacity: gifAppear,
          transform: `scale(${interpolate(gifAppear, [0, 1], [1.05, 1])})`,
        }}
      >
        <Img
          src={staticFile(`gifs/${slide.gif}`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Progress dots — bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: sv(30),
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: s(12),
        }}
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === slideIndex ? s(24) : s(8),
              height: s(8),
              borderRadius: s(4),
              backgroundColor: i === slideIndex ? slide.accent : COLORS.textMuted,
              opacity: i === slideIndex ? 1 : 0.4,
              boxShadow: i === slideIndex ? `0 0 ${s(8)}px ${slide.accent}44` : 'none',
            }}
          />
        ))}
      </div>

      {/* Slide counter — top right */}
      <div
        style={{
          position: 'absolute',
          top: sv(48),
          right: s(36),
          fontSize: s(16),
          color: COLORS.textMuted,
          letterSpacing: 1,
        }}
      >
        {slideIndex + 1}/{totalSlides}
      </div>

      {/* Brand watermark — top left */}
      <div
        style={{
          position: 'absolute',
          top: sv(48),
          left: s(36),
          fontSize: s(14),
          color: COLORS.textMuted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        shawnos.ai
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Sprite Pair — Nio x Claude
   ═══════════════════════════════════════════════════ */

/** Tier display names for labels */
const TIER_NAMES: Record<number, string> = {
  1: 'Spark',
  2: 'Blade',
  3: 'Warden',
  4: 'Sentinel',
  5: 'Ascended',
};

const SpritePair: React.FC<{
  frame: number;
  fps: number;
  s: (v: number) => number;
  sv: (v: number) => number;
  nioTier?: 1 | 2 | 3 | 4 | 5;
  nioAnimation?: 'idle' | 'think' | 'chat' | 'backflip';
}> = ({ frame, fps, s, sv, nioTier = 2, nioAnimation }) => {
  const nioScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const claudeScale = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Gentle idle bob (only when not animating)
  const nioBob = nioAnimation ? 0 : Math.sin(frame * 0.12) * sv(4);
  const claudeBob = Math.sin(frame * 0.12 + 1.5) * sv(4);

  const spriteSize = s(140);

  // Resolve sprite sheet animation if specified
  const resolved = nioAnimation
    ? resolveAnimation(
        [{ animation: nioAnimation as NioAnimationName, startFrame: 6, loop: true }],
        frame,
        fps,
      )
    : null;

  const totalSpriteFrames = resolved ? getAnimFrameCount(resolved.animation) : 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: s(32),
        marginBottom: sv(36),
      }}
    >
      {/* Nio */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: spriteSize,
            height: spriteSize,
            transform: `scale(${nioScale}) translateY(${nioBob}px)`,
            transformOrigin: 'bottom center',
            overflow: 'hidden',
          }}
        >
          {resolved ? (
            /* Animated sprite sheet */
            <img
              src={staticFile(`avatars/nio-tier-${nioTier}-${resolved.animation}-sheet-256.png`)}
              style={{
                width: spriteSize * totalSpriteFrames,
                height: spriteSize,
                marginLeft: -(resolved.spriteFrame * spriteSize),
                imageRendering: 'pixelated',
                display: 'block',
              }}
            />
          ) : (
            /* Static sprite */
            <Img
              src={staticFile(`avatars/nio-tier-${nioTier}-static.png`)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          )}
        </div>
        <div
          style={{
            fontSize: s(14),
            color: COLORS.textMuted,
            marginTop: sv(8),
            opacity: nioScale,
          }}
        >
          Nio {TIER_NAMES[nioTier] ? `· ${TIER_NAMES[nioTier]}` : ''}
        </div>
      </div>

      {/* x */}
      <div
        style={{
          fontSize: s(20),
          color: COLORS.textMuted,
          opacity: claudeScale,
          marginBottom: sv(40),
        }}
      >
        ×
      </div>

      {/* Claude */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: spriteSize,
            height: spriteSize,
            transform: `scale(${claudeScale}) translateY(${claudeBob}px)`,
            transformOrigin: 'bottom center',
          }}
        >
          <Img
            src={staticFile('avatars/claude-sprite.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </div>
        <div
          style={{
            fontSize: s(14),
            color: COLORS.textMuted,
            marginTop: sv(8),
            opacity: claudeScale,
          }}
        >
          Claude
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Chat Slide — mini chat window with exchange
   ═══════════════════════════════════════════════════ */

const ChatSlide: React.FC<{
  userText: string;
  agentText: string | string[];
  accent: string;
  frame: number;
  fps: number;
  s: (v: number) => number;
  sv: (v: number) => number;
  nioTier?: 1 | 2 | 3 | 4 | 5;
}> = ({ userText, agentText, accent, frame, fps, s, sv, nioTier = 2 }) => {
  const agentMessages = Array.isArray(agentText) ? agentText : [agentText];
  const isMulti = agentMessages.length > 1;

  // Window slide up
  const windowSlide = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const windowY = interpolate(windowSlide, [0, 1], [sv(100), 0]);

  // User message appears at frame 8
  const userStartFrame = 8;
  const userAppear = spring({
    frame: Math.max(0, frame - userStartFrame),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });
  const userSlideX = interpolate(userAppear, [0, 1], [40, 0]);

  // Typing dots before first agent message
  const dotsStart = 18;
  const dotsEnd = 28;
  const dotsVisible = frame >= dotsStart && frame < dotsEnd;
  const dotsOpacity = dotsVisible
    ? interpolate(frame, [dotsStart, dotsStart + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Multi-message timing: stagger agent messages evenly across remaining frames
  const firstAgentFrame = dotsEnd;
  const framesBetween = isMulti ? Math.min(15, Math.floor(50 / agentMessages.length)) : 0;

  return (
    <div
      style={{
        width: s(860),
        transform: `translateY(${windowY}px)`,
        opacity: windowSlide,
        backgroundColor: COLORS.canvas,
        border: `1px solid ${COLORS.border}`,
        borderRadius: s(16),
        overflow: 'hidden',
        boxShadow: `0 ${s(8)}px ${s(40)}px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Header */}
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
        <div style={{ width: s(36), height: s(36), borderRadius: '50%', overflow: 'hidden', backgroundColor: COLORS.canvas }}>
          <Img
            src={staticFile(`avatars/nio-tier-${nioTier}-static.png`)}
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
          />
        </div>
        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: s(15), color: COLORS.textPrimary, fontWeight: 600 }}>
            Nio
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: s(10), color: COLORS.textSecondary }}>
            {TIER_NAMES[nioTier] ?? 'Blade'} tier
          </div>
        </div>
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

      {/* Messages */}
      <div
        style={{
          padding: `${s(16)}px ${s(18)}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: sv(420),
          justifyContent: 'flex-end',
        }}
      >
        {/* User message */}
        {frame >= userStartFrame && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              opacity: userAppear,
              transform: `translateX(${userSlideX}px)`,
              marginBottom: s(12),
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: `${s(10)}px ${s(14)}px`,
                borderRadius: s(14),
                borderTopRightRadius: s(4),
                backgroundColor: '#2563EB',
                fontFamily: FONTS.mono,
                fontSize: s(16),
                lineHeight: 1.4,
                color: '#ffffff',
              }}
            >
              {userText}
            </div>
          </div>
        )}

        {/* Typing dots */}
        {dotsVisible && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              opacity: dotsOpacity,
              marginBottom: s(10),
            }}
          >
            <div
              style={{
                padding: `${s(10)}px ${s(16)}px`,
                borderRadius: s(14),
                borderTopLeftRadius: s(4),
                backgroundColor: COLORS.canvasSubtle,
                border: `1px solid ${COLORS.border}`,
                display: 'flex',
                gap: s(6),
              }}
            >
              {[0, 1, 2].map((i) => {
                const bounce = Math.sin(((frame / 30) * Math.PI * 3) - i * 1.2);
                const y = Math.max(0, bounce) * -s(6);
                return (
                  <div
                    key={i}
                    style={{
                      width: s(8),
                      height: s(8),
                      borderRadius: '50%',
                      backgroundColor: COLORS.textSecondary,
                      transform: `translateY(${y}px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Agent replies — staggered */}
        {agentMessages.map((msg, idx) => {
          const msgStartFrame = firstAgentFrame + idx * framesBetween;
          if (frame < msgStartFrame) return null;

          const msgAppear = spring({
            frame: Math.max(0, frame - msgStartFrame),
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });
          const msgSlideX = interpolate(msgAppear, [0, 1], [-40, 0]);

          // Typewriter
          const localFrame = Math.max(0, frame - msgStartFrame);
          const visibleText = msg.slice(0, Math.floor(localFrame * 2));

          // Check mark gets green color
          const isSuccess = msg.startsWith('✓');

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                opacity: msgAppear,
                transform: `translateX(${msgSlideX}px)`,
                marginBottom: s(8),
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: `${s(10)}px ${s(14)}px`,
                  borderRadius: s(14),
                  borderTopLeftRadius: s(4),
                  backgroundColor: isSuccess ? 'rgba(74, 195, 115, 0.15)' : COLORS.canvasSubtle,
                  border: `1px solid ${isSuccess ? 'rgba(74, 195, 115, 0.4)' : COLORS.border}`,
                  fontFamily: FONTS.mono,
                  fontSize: s(16),
                  lineHeight: 1.4,
                  color: isSuccess ? '#4EC373' : COLORS.textPrimary,
                }}
              >
                {visibleText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   GIF Overlay — small corner GIF for humor/attention
   ═══════════════════════════════════════════════════ */

const GifOverlay: React.FC<{
  gifFile: string;
  frame: number;
  fps: number;
  s: (v: number) => number;
  sv: (v: number) => number;
}> = ({ gifFile, frame, fps, s, sv }) => {
  const appearScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const bob = Math.sin(frame * 0.1) * sv(3);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: sv(140),
        right: s(30),
        width: s(260),
        height: s(260),
        borderRadius: s(20),
        overflow: 'hidden',
        transform: `scale(${appearScale}) translateY(${bob}px)`,
        opacity: Math.min(appearScale, 0.95),
        border: `3px solid ${COLORS.border}`,
        boxShadow: `0 ${s(6)}px ${s(30)}px rgba(0,0,0,0.6)`,
      }}
    >
      <Gif
        src={staticFile(`gifs/${gifFile}`)}
        width={s(260)}
        height={s(260)}
        fit="cover"
      />
    </div>
  );
};

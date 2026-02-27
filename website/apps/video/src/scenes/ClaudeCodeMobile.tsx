import { AbsoluteFill, Img, useCurrentFrame, interpolate, staticFile } from 'remotion';
import { ScanlineOverlay } from '../components/ScanlineOverlay';

export const CLAUDE_MOBILE_FPS = 15;
export const CLAUDE_MOBILE_FRAMES = CLAUDE_MOBILE_FPS * 4; // 4 seconds

/**
 * Animated GIF for Claude Code Mobile post.
 * Flipped image + slow zoom + scanlines + orange glow + shawnos.ai branding.
 * LinkedIn landscape: 1200x628
 */
export const ClaudeCodeMobile: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, CLAUDE_MOBILE_FRAMES], [1, 1.08], {
    extrapolateRight: 'clamp',
  });

  const glowOpacity = interpolate(
    Math.sin((frame / CLAUDE_MOBILE_FRAMES) * Math.PI * 3),
    [-1, 1],
    [0.0, 0.15],
  );

  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Branding pulse
  const brandGlow = interpolate(
    Math.sin((frame / CLAUDE_MOBILE_FRAMES) * Math.PI * 2),
    [-1, 1],
    [0.6, 1],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Flipped + zooming image */}
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          transform: `scaleX(-1) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile('claude-code-mobile.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Orange glow vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(255, 120, 0, ${glowOpacity}) 100%)`,
          pointerEvents: 'none',
        }}
      />

      <ScanlineOverlay opacity={0.08} lineSpacing={3} speed={0.8} />

      {/* Top/bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 80%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* shawnos.ai branding - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: brandGlow,
        }}
      >
        <span
          style={{
            fontFamily: 'SF Mono, Menlo, monospace',
            fontSize: 22,
            fontWeight: 700,
            color: '#ff7800',
            letterSpacing: 2,
            textShadow: '0 0 12px rgba(255, 120, 0, 0.6), 0 0 24px rgba(255, 120, 0, 0.3)',
          }}
        >
          shawnos.ai
        </span>
      </div>

      {/* Subtle "the gtme alchemist" tag - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 26,
          left: 32,
          opacity: brandGlow * 0.5,
        }}
      >
        <span
          style={{
            fontFamily: 'SF Mono, Menlo, monospace',
            fontSize: 14,
            fontWeight: 500,
            color: '#aaa',
            letterSpacing: 1,
          }}
        >
          the gtme alchemist
        </span>
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useScale } from '../lib/useScale';

interface GraphNodeProps {
  /** Label displayed below the node */
  label: string;
  /** Node accent color */
  color: string;
  /** Absolute X position (in base 1080w coords) */
  x: number;
  /** Absolute Y position (in base 1350h coords) */
  y: number;
  /** Node radius in base coords */
  radius?: number;
  /** Frame at which this node appears */
  appearFrame?: number;
  /** Optional avatar image filename (in public/avatars/) */
  avatar?: string;
  /** Whether to show a continuous pulse */
  pulse?: boolean;
  /** Font size for the label */
  labelSize?: number;
}

export const GraphNode: React.FC<GraphNodeProps> = ({
  label,
  color,
  x,
  y,
  radius = 30,
  appearFrame = 0,
  avatar,
  pulse = false,
  labelSize = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  // Spring entrance
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  // Label fade
  const labelOpacity = interpolate(localFrame, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse animation
  const pulseScale = pulse
    ? 1 + 0.05 * Math.sin((frame / 30) * Math.PI * 2 * 0.5)
    : 1;

  const pulseGlow = pulse
    ? 0.3 + 0.15 * Math.sin((frame / 30) * Math.PI * 2 * 0.5)
    : 0.3;

  const r = s(radius);
  const avatarSize = r * 1.4;

  return (
    <div
      style={{
        position: 'absolute',
        left: s(x) - r,
        top: sv(y) - r,
        width: r * 2,
        height: r * 2,
        transform: `scale(${scale * pulseScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: 'absolute',
          width: r * 2 + s(12),
          height: r * 2 + s(12),
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}${Math.round(pulseGlow * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          top: -s(6),
          left: -s(6),
        }}
      />

      {/* Core circle */}
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, ${color}33, ${COLORS.canvas} 80%)`,
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {avatar && (
          <Img
            src={staticFile(`avatars/${avatar}`)}
            style={{
              width: avatarSize,
              height: avatarSize,
              imageRendering: 'pixelated',
            }}
          />
        )}
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: r * 2 + s(6),
          opacity: labelOpacity,
          fontFamily: FONTS.mono,
          fontSize: s(labelSize),
          color: COLORS.textPrimary,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );
};

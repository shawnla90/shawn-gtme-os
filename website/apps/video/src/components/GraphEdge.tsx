import type { CSSProperties } from 'react';
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { useScale } from '../lib/useScale';

interface GraphEdgeProps {
  /** Start point (base 1080×1350 coords) */
  from: { x: number; y: number };
  /** End point (base 1080×1350 coords) */
  to: { x: number; y: number };
  /** Edge color */
  color: string;
  /** Frame at which draw-on starts */
  startFrame?: number;
  /** How many frames the draw-on takes */
  durationFrames?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Curve intensity — positive curves up, negative curves down */
  curvature?: number;
}

export const GraphEdge: React.FC<GraphEdgeProps> = ({
  from,
  to,
  color,
  startFrame = 0,
  durationFrames = 30,
  strokeWidth = 2,
  curvature = -40,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { s, sv } = useScale();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (progress <= 0) return null;

  const x1 = s(from.x);
  const y1 = sv(from.y);
  const x2 = s(to.x);
  const y2 = sv(to.y);

  // Control point for quadratic bezier
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + sv(curvature);

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  const evolved = evolvePath(progress, pathD);

  const svgStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <svg style={svgStyle} viewBox={`0 0 ${width} ${height}`}>
      {/* Glow layer */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        opacity={0.12 * progress}
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.7}
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </svg>
  );
};

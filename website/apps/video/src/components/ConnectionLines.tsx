import type { CSSProperties } from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { COLORS } from '../lib/tokens';

interface Point {
  x: number;
  y: number;
}

interface ConnectionLinesProps {
  points: Point[];
  startFrame?: number;
  durationFrames?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * SVG connection lines that draw-on between points using evolvePath.
 */
export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  points,
  startFrame = 0,
  durationFrames = 60,
  color = COLORS.teal,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (points.length < 2) return null;

  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Build path string connecting all points with curved lines
  const pathSegments: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - 30; // arc upward

    if (i === 0) {
      pathSegments.push(`M ${from.x} ${from.y}`);
    }
    pathSegments.push(`Q ${midX} ${midY} ${to.x} ${to.y}`);
  }

  const pathD = pathSegments.join(' ');
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
        opacity={0.15 * progress}
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
        opacity={0.8}
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
      {/* Dots at connection points */}
      {points.map((p, i) => {
        const dotProgress = interpolate(
          progress,
          [i / points.length, Math.min(1, (i + 0.5) / points.length)],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            opacity={dotProgress}
          />
        );
      })}
    </svg>
  );
};

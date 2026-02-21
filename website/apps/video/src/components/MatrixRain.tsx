import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '@remotion/noise';
import { COLORS } from '../lib/tokens';

interface MatrixRainProps {
  opacity?: number;
  color?: string;
  columns?: number;
  speed?: number;
}

/**
 * Deterministic matrix-rain effect using @remotion/noise for organic
 * character generation. Each column drifts with Perlin noise.
 */
export const MatrixRain: React.FC<MatrixRainProps> = ({
  opacity = 0.12,
  color = COLORS.green,
  columns = 30,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const colWidth = width / columns;
  const charHeight = 18;
  const rows = Math.ceil(height / charHeight) + 4;

  // Noise-driven character selection (organic variation)
  const noiseChar = (col: number, row: number, f: number): string => {
    const n = noise2D(`char-${col}`, row * 0.3, f * speed * 0.05);
    const code = Math.floor(((n + 1) / 2) * 94) + 33;
    return String.fromCharCode(code);
  };

  // Noise-driven opacity (organic shimmer)
  const noiseOpacity = (col: number, row: number, f: number): number => {
    const n = noise2D(`op-${col}`, row * 0.2, f * speed * 0.03);
    const v = (n + 1) / 2; // 0-1
    const rowFade = 1 - row / rows;
    return v * rowFade;
  };

  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    opacity,
    pointerEvents: 'none',
  };

  const colElements: React.ReactNode[] = [];

  for (let c = 0; c < columns; c++) {
    const chars: React.ReactNode[] = [];
    // Noise-based offset for organic drift
    const driftOffset = noise2D('drift', c * 0.5, frame * speed * 0.01);
    const offset = Math.floor((driftOffset + 1) * rows * 0.5) + Math.floor(frame * speed * 0.3);

    for (let r = 0; r < rows; r++) {
      const adjustedRow = (r + offset) % (rows + 8);
      const charOpacity = noiseOpacity(c, adjustedRow, frame);
      chars.push(
        <div
          key={r}
          style={{
            height: charHeight,
            fontSize: 14,
            lineHeight: `${charHeight}px`,
            color,
            opacity: charOpacity,
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          {noiseChar(c, adjustedRow, frame)}
        </div>,
      );
    }
    colElements.push(
      <div
        key={c}
        style={{
          position: 'absolute',
          left: c * colWidth,
          top: 0,
          width: colWidth,
        }}
      >
        {chars}
      </div>,
    );
  }

  return <div style={containerStyle}>{colElements}</div>;
};

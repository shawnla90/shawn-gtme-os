/** Design tokens — ported from @shawnos/shared/styles/tokens.css */

export const COLORS = {
  // Canvas
  canvas: '#0D1117',
  canvasSubtle: '#161B22',
  border: '#30363D',

  // Text
  textPrimary: '#C9D1D9',
  textSecondary: '#8B949E',
  textMuted: '#484F58',

  // ShawnOS palette
  green: '#4EC373',
  purple: '#9B72CF',
  amber: '#D2A53C',

  // GTMOS palette
  teal: '#3DBFA0',
  red: '#E05555',

  // Traffic lights
  trafficRed: '#E05555',
  trafficYellow: '#D2A53C',
  trafficGreen: '#4EC373',
} as const;

export const FONTS = {
  mono: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
} as const;

/** Per-site accent colors for the 3-site network */
export const SITE_ACCENTS = {
  shawnos: COLORS.green,
  gtmos: COLORS.teal,
  contentos: COLORS.purple,
} as const;

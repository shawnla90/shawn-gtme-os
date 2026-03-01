/** Anti-Slop Reel data — violation definitions, sloppy/clean text segments */

export type ViolationType = 'filler' | 'ai-tell' | 'passive' | 'vague-opener';

export interface TextSegment {
  text: string;
  type?: ViolationType;
  order?: number;
}

export const VIOLATION_COLORS: Record<ViolationType, string> = {
  filler: '#E05555',
  'ai-tell': '#50BED2',
  passive: '#D2A53C',
  'vague-opener': '#E08C45',
};

export const VIOLATION_POINTS: Record<ViolationType, number> = {
  filler: 8,
  'ai-tell': 7,
  passive: 6,
  'vague-opener': 10,
};

/**
 * Sloppy LinkedIn post segmented for highlight animation.
 * Each violation has an `order` controlling when it reveals during the scan.
 * Score builds: 10 → 17 → 25 → 33 → 41 → 49 → 57 → 65 → 73 → 81 → 89 → 95 → 100
 */
export const SLOPPY_SEGMENTS: TextSegment[] = [
  { text: "In today's", type: 'vague-opener', order: 0 },
  { text: ' rapidly evolving landscape, ' },
  { text: "it's worth noting", type: 'ai-tell', order: 1 },
  { text: ' that ' },
  { text: 'innovative', type: 'filler', order: 2 },
  { text: ' companies are ' },
  { text: 'leveraging', type: 'filler', order: 3 },
  { text: ' ' },
  { text: 'cutting-edge', type: 'filler', order: 4 },
  { text: ' solutions to ' },
  { text: 'seamlessly', type: 'filler', order: 5 },
  { text: ' ' },
  { text: 'navigate', type: 'filler', order: 6 },
  { text: ' this ' },
  { text: 'game-changing', type: 'filler', order: 7 },
  { text: ' ' },
  { text: 'paradigm', type: 'filler', order: 8 },
  { text: ' shift. This ' },
  { text: 'holistic', type: 'filler', order: 9 },
  { text: ' approach ' },
  { text: 'empower', type: 'filler', order: 10 },
  { text: 's ' },
  { text: 'has been designed', type: 'passive', order: 11 },
  { text: ' for ' },
  { text: 'thought leaders', type: 'filler', order: 12 },
  { text: '.' },
];

export const SLOPPY_FULL_TEXT = SLOPPY_SEGMENTS.map((s) => s.text).join('');

export const CLEAN_TEXT =
  'We shipped 47 landing pages in 6 weeks. Claude Code wrote every first draft. A scoring system checked each line against 20 rules. Zero templates. Real research. Actual voice.';

export const TOTAL_VIOLATIONS = SLOPPY_SEGMENTS.filter((s) => s.type).length;

/* ── Violation type details (used in 60s breakdown scene) ── */

export const VIOLATION_LABELS: Record<ViolationType, string> = {
  filler: 'Corporate Filler',
  'ai-tell': 'AI Tell Phrases',
  passive: 'Passive Voice',
  'vague-opener': 'Vague Openers',
};

export const VIOLATION_PENALTIES: Record<ViolationType, string> = {
  filler: '8 pts each',
  'ai-tell': '7 pts each',
  passive: '6 pts each',
  'vague-opener': '10 pts each',
};

export const VIOLATION_EXAMPLES: Record<ViolationType, { bad: string; good: string }[]> = {
  filler: [
    { bad: 'leverage', good: 'use' },
    { bad: 'innovative', good: 'new' },
    { bad: 'seamlessly', good: 'cut it' },
  ],
  'ai-tell': [
    { bad: "it's worth noting", good: 'just say it' },
    { bad: "let's dive in", good: 'just start' },
    { bad: "here's the thing", good: 'skip it' },
  ],
  passive: [
    { bad: 'has been designed', good: 'we designed' },
    { bad: 'was built', good: 'we built' },
    { bad: 'is considered', good: 'is' },
  ],
  'vague-opener': [
    { bad: "In today's...", good: 'delete it' },
    { bad: "It's no secret...", good: 'delete it' },
    { bad: 'As we all know...', good: 'skip it' },
  ],
};

/** Ordered list for the breakdown scene animation */
export const VIOLATION_TYPE_ORDER: ViolationType[] = ['filler', 'ai-tell', 'passive', 'vague-opener'];

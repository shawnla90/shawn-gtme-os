/** NioVideo scene timing constants — ~43.7s at 30fps */

export const FPS_NIO = 30;

export const TRANSITION_NIO = 10; // ~0.33s overlap between scenes

export const SCENES_NIO = {
  genesis:        135,  // 4.5s  — core node fade-in
  knowledgeGraph: 570,  // 19s   — 16 nodes + edges + counter
  graphComplete:  105,  // 3.5s  — energy pulse + flash
  chatReveal:     420,  // 14s   — chat window + 2 exchanges
  cta:            120,  // 4s    — "Meet Nio" + fade out
} as const;

/** Total frames accounting for 4 transitions between 5 scenes */
export const NIO_TOTAL_FRAMES =
  SCENES_NIO.genesis +
  SCENES_NIO.knowledgeGraph +
  SCENES_NIO.graphComplete +
  SCENES_NIO.chatReveal +
  SCENES_NIO.cta -
  4 * TRANSITION_NIO; // 1350 - 40 = 1310

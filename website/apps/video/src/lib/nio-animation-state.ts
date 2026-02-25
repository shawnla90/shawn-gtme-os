/**
 * Animation cue resolver for Nio sprite sheet animations.
 * Takes a list of cues and returns which animation should be active
 * at any given Remotion frame.
 */

export type NioAnimationName =
  | 'idle'
  | 'blink'
  | 'think'
  | 'chat'
  | 'backflip'
  | 'evolve_out'
  | 'evolve_in';

export interface AnimationCue {
  animation: NioAnimationName;
  startFrame: number;
  /** For evolve animations — the target tier to transition to */
  evolveTo?: number;
  /** Whether this animation loops (default: true for idle, false for others) */
  loop?: boolean;
}

/** Frame counts for each animation (must match Python AnimationSpec) */
const ANIM_FRAMES: Record<NioAnimationName, number> = {
  idle: 8,
  blink: 6,
  think: 10,
  chat: 8,
  backflip: 12,
  evolve_out: 8,
  evolve_in: 8,
};

/** Duration per sprite frame in ms (must match Python AnimationSpec) */
const ANIM_DURATION_MS: Record<NioAnimationName, number> = {
  idle: 150,
  blink: 100,
  think: 120,
  chat: 120,
  backflip: 80,
  evolve_out: 100,
  evolve_in: 100,
};

/** Convert Python ms-per-frame to Remotion frames at given fps */
export function spriteFrameToRemotionFrames(
  animName: NioAnimationName,
  fps: number,
): number {
  return Math.max(1, Math.round((ANIM_DURATION_MS[animName] / 1000) * fps));
}

export interface ResolvedAnimation {
  animation: NioAnimationName;
  /** Current sprite frame index (0-based) within the animation */
  spriteFrame: number;
  /** Whether we're in a looping animation */
  looping: boolean;
  /** For evolve: the target tier */
  evolveTo?: number;
}

/**
 * Given a list of animation cues and the current Remotion frame,
 * resolve which animation + sprite frame should be displayed.
 * Falls back to idle when no cue is active.
 */
export function resolveAnimation(
  cues: AnimationCue[],
  currentFrame: number,
  fps: number,
): ResolvedAnimation {
  // Sort cues by startFrame descending so we find the latest active one
  const sorted = [...cues].sort((a, b) => b.startFrame - a.startFrame);

  for (const cue of sorted) {
    if (currentFrame < cue.startFrame) continue;

    const elapsed = currentFrame - cue.startFrame;
    const framesPerSprite = spriteFrameToRemotionFrames(cue.animation, fps);
    const totalSpriteFrames = ANIM_FRAMES[cue.animation];
    const totalRemotionFrames = framesPerSprite * totalSpriteFrames;

    const shouldLoop = cue.loop ?? cue.animation === 'idle';

    if (!shouldLoop && elapsed >= totalRemotionFrames) {
      // One-shot animation has ended — continue to check earlier cues or fallback
      continue;
    }

    const effectiveElapsed = shouldLoop
      ? elapsed % totalRemotionFrames
      : elapsed;

    const spriteFrame = Math.min(
      Math.floor(effectiveElapsed / framesPerSprite),
      totalSpriteFrames - 1,
    );

    return {
      animation: cue.animation,
      spriteFrame,
      looping: shouldLoop,
      evolveTo: cue.evolveTo,
    };
  }

  // Fallback: idle loop
  const idleFramesPerSprite = spriteFrameToRemotionFrames('idle', fps);
  const idleSpriteFrames = ANIM_FRAMES.idle;
  const idleTotalRemotionFrames = idleFramesPerSprite * idleSpriteFrames;
  const idleElapsed = currentFrame % idleTotalRemotionFrames;
  const idleSpriteFrame = Math.floor(idleElapsed / idleFramesPerSprite);

  return {
    animation: 'idle',
    spriteFrame: Math.min(idleSpriteFrame, idleSpriteFrames - 1),
    looping: true,
  };
}

/** Get the total number of sprite frames for an animation */
export function getAnimFrameCount(animName: NioAnimationName): number {
  return ANIM_FRAMES[animName];
}

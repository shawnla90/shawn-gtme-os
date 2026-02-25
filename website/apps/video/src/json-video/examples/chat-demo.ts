import type { TimelineSpec } from '@json-render/remotion';
import { COLORS } from '../../lib/tokens';

/**
 * 10-second reel clip (1080x960) demonstrating the full json-video system.
 *
 * Timeline:
 *   0–300f  SceneWrapper background (nioBlue accent)
 *   0–300f  NioReelMascot bottom-right (idle→think→chat→backflip)
 *  30–120f  User ChatBubble: "deploy the blog and run SEO check"
 *  120–180f TypingDots
 *  180–270f Agent ChatBubble with typewriter
 *  120–270f TerminalCommandLine: nio deploy + nio seo
 *  240–300f XpBar fill
 */
export const CHAT_DEMO_SPEC: TimelineSpec = {
  composition: {
    id: 'JsonVideo',
    fps: 30,
    width: 1080,
    height: 960,
    durationInFrames: 300,
  },
  tracks: [
    { id: 'bg', name: 'Background', type: 'scene', enabled: true },
    { id: 'main', name: 'Main', type: 'scene', enabled: true },
    { id: 'overlay', name: 'Overlay', type: 'overlay', enabled: true },
  ],
  clips: [
    // ── Background ──
    {
      id: 'scene-bg',
      trackId: 'bg',
      component: 'SceneWrapper',
      from: 0,
      durationInFrames: 300,
      props: {
        accentColor: COLORS.nioBlue,
        particleCount: 40,
        scanlineOpacity: 0.03,
      },
    },

    // ── Nio mascot (full duration, corner presence) ──
    {
      id: 'nio-mascot',
      trackId: 'overlay',
      component: 'NioReelMascot',
      from: 0,
      durationInFrames: 300,
      props: {
        tier: 2,
        size: 120,
        position: 'bottom-right',
        enterDelay: 10,
        animationCues: [
          { animation: 'idle', startFrame: 0 },
          { animation: 'think', startFrame: 30 },
          { animation: 'chat', startFrame: 180 },
          { animation: 'backflip', startFrame: 260 },
        ],
      },
      motion: {
        enter: { opacity: 0, y: 40, duration: 15 },
        spring: { damping: 18, stiffness: 120 },
      },
    },

    // ── User message ──
    {
      id: 'user-msg',
      trackId: 'main',
      component: 'ChatBubble',
      from: 30,
      durationInFrames: 90,
      props: {
        text: 'deploy the blog and run SEO check',
        sender: 'user',
      },
      transitionIn: { type: 'slideRight', durationInFrames: 10 },
    },

    // ── Typing indicator ──
    {
      id: 'typing',
      trackId: 'main',
      component: 'TypingDots',
      from: 120,
      durationInFrames: 60,
      props: {},
      transitionIn: { type: 'fade', durationInFrames: 8 },
      transitionOut: { type: 'fade', durationInFrames: 8 },
    },

    // ── Agent reply ──
    {
      id: 'agent-msg',
      trackId: 'main',
      component: 'ChatBubble',
      from: 180,
      durationInFrames: 90,
      props: {
        text: 'Done. Blog deployed, 14 pages indexed. SEO score: 94/100.',
        sender: 'agent',
        typewriter: true,
        typewriterSpeed: 1.5,
      },
      transitionIn: { type: 'slideLeft', durationInFrames: 10 },
    },

    // ── Terminal commands ──
    {
      id: 'terminal',
      trackId: 'main',
      component: 'TerminalCommandLine',
      from: 120,
      durationInFrames: 150,
      props: {
        commands: [
          { cmd: 'nio deploy --blog', output: 'Deployed 14 pages to shawnos.ai/blog', status: 'success' },
          { cmd: 'nio seo --check', output: 'Score: 94/100 — all green', status: 'success' },
        ],
        interval: 45,
        startFrame: 0,
      },
      motion: {
        enter: { opacity: 0, y: 20, duration: 12 },
      },
    },

    // ── XP bar fill ──
    {
      id: 'xp-bar',
      trackId: 'overlay',
      component: 'XpBar',
      from: 240,
      durationInFrames: 60,
      props: {
        from: 60,
        to: 85,
        max: 100,
        tierLabel: 'Tier 2',
        tierColor: COLORS.nioBlue,
        fillFrames: 40,
      },
      transitionIn: { type: 'slideUp', durationInFrames: 10 },
    },
  ],
  audio: { tracks: [] },
};

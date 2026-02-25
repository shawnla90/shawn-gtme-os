// Core
export { JsonVideo } from './JsonVideo';
export type { JsonVideoProps } from './JsonVideo';

// Catalog & registry
export { catalog, componentRegistry } from './catalog';

// Schemas
export * from './schemas';

// Adapters
export {
  SceneWrapperClip,
  ChatBubbleClip,
  TypingDotsClip,
  GraphNodeClip,
  GraphEdgeClip,
  TerminalCommandLineClip,
  CostMeterClip,
  XpBarClip,
  NioReelMascotClip,
  EvolutionFlashClip,
} from './adapters';

// Prompt builder
export { buildVideoPrompt } from './prompt';
export type { PromptOptions } from './prompt';

// Example specs
export { CHAT_DEMO_SPEC } from './examples/chat-demo';

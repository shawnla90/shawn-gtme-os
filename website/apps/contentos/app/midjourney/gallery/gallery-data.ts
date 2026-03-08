/* ── MidJourney Gallery - Data ────────────────────────── */

/* ── Theme ─────────────────────────────────────────────── */

export const MJ = {
  accent: '#FF69B4',
  mjBlue: '#5B8DEF',
  gridBg: '#0A0E14',
  promptGreen: '#4EC373',
  neonRed: '#FF073A',
  blossomPink: '#E8B4D8',
  dark: '#0D1117',
  darkSubtle: '#161B22',
  border: '#30363D',
  text: '#C9D1D9',
  textMuted: '#8B949E',
}

/* ── Gallery Entry ─────────────────────────────────────── */

export interface GalleryEntry {
  id: string
  title: string
  prompt: string
  techniques: string[]
  style: string
  aspectRatio: string
  imagePath: string
  parameters: { key: string; value: string }[]
  tags: string[]
  recipeCategory?: RecipeId
}

/* ── Recipe Types ──────────────────────────────────────── */

export type RecipeId = 'build-a-bot' | 'create-a-spirit' | 'design-a-scene'

export interface WizardStep {
  id: string
  label: string
  options: {
    value: string
    label: string
    description: string
    promptFragment: string
  }[]
}

export interface Recipe {
  id: RecipeId
  title: string
  subtitle: string
  description: string
  icon: string
  accentColor: string
  steps: [WizardStep, WizardStep, WizardStep]
  basePrompt: string
  defaultParams: string
}

/* ── 3 Recipes ─────────────────────────────────────────── */

export const recipes: Recipe[] = [
  {
    id: 'build-a-bot',
    title: 'Build a Bot',
    subtitle: 'Create your chibi warrior',
    description:
      'Design a unique bot character with custom style, colors, and pose. Perfect for avatars and mascots.',
    icon: '\u2694\uFE0F',
    accentColor: MJ.promptGreen,
    steps: [
      {
        id: 'style',
        label: 'Style',
        options: [
          { value: 'chibi', label: 'Chibi', description: 'Cute oversized head, small body', promptFragment: 'chibi style, cute proportions, oversized head' },
          { value: 'mecha', label: 'Mecha', description: 'Armored robot warrior', promptFragment: 'mecha armor style, mechanical joints, plated design' },
          { value: 'pixel', label: 'Pixel', description: 'Retro pixel art aesthetic', promptFragment: 'pixel art style, 16-bit retro, blocky design' },
          { value: 'minimalist', label: 'Minimalist', description: 'Clean lines, flat design', promptFragment: 'minimalist flat design, clean lines, geometric shapes' },
        ],
      },
      {
        id: 'color',
        label: 'Color Palette',
        options: [
          { value: 'neon-green', label: 'Neon Green', description: 'Matrix-style energy', promptFragment: 'glitch art teal, neon green glow, dark background' },
          { value: 'electric-blue', label: 'Electric Blue', description: 'Cybernetic cool', promptFragment: 'electric blue, ice cyan accents, holographic shimmer' },
          { value: 'sunset-orange', label: 'Sunset Orange', description: 'Warm intensity', promptFragment: 'matter orange, warm amber, golden highlights' },
          { value: 'cosmic-purple', label: 'Cosmic Purple', description: 'Space royalty vibes', promptFragment: 'cosmic purple, deep violet, nebula glow accents' },
        ],
      },
      {
        id: 'pose',
        label: 'Pose',
        options: [
          { value: 'battle-ready', label: 'Battle Ready', description: 'Weapon drawn, stance set', promptFragment: 'battle ready stance, weapon drawn, intense focus' },
          { value: 'victory', label: 'Victory', description: 'Triumphant celebration', promptFragment: 'victory pose, triumphant stance, radial effects' },
          { value: 'idle-float', label: 'Idle Float', description: 'Hovering serenely', promptFragment: 'floating idle pose, levitating, serene energy aura' },
          { value: 'speed-rush', label: 'Speed Rush', description: 'Motion blur action', promptFragment: 'speed rush motion, blur trails, dynamic action pose' },
        ],
      },
    ],
    basePrompt:
      'bot character, {style}, {color}, {pose}, studio lighting, dark background, clean render',
    defaultParams: '--ar 1:1 --v 7',
  },
  {
    id: 'create-a-spirit',
    title: 'Create a Spirit',
    subtitle: 'Conjure an ethereal creature',
    description:
      'Bring a spirit creature to life with custom form, energy, and mood. Floating, glowing, alive.',
    icon: '\uD83D\uDD25',
    accentColor: MJ.neonRed,
    steps: [
      {
        id: 'form',
        label: 'Form',
        options: [
          { value: 'jellyfish', label: 'Jellyfish', description: 'Translucent flowing tentacles', promptFragment: 'jellyfish spirit creature, translucent bell, flowing tentacles' },
          { value: 'phoenix', label: 'Phoenix', description: 'Fiery wings spread wide', promptFragment: 'phoenix spirit creature, fiery wings spread wide, rebirth energy' },
          { value: 'wisp', label: 'Wisp', description: 'Tiny floating orb of light', promptFragment: 'wisp spirit, tiny glowing orb, trailing light particles' },
          { value: 'crystal', label: 'Crystal', description: 'Geometric crystal entity', promptFragment: 'crystal spirit entity, geometric facets, prismatic light refraction' },
        ],
      },
      {
        id: 'energy',
        label: 'Energy',
        options: [
          { value: 'fire', label: 'Fire', description: 'Dancing flames and embers', promptFragment: 'dancing flames, floating embers, heat distortion' },
          { value: 'electric', label: 'Electric', description: 'Crackling lightning arcs', promptFragment: 'electric arcs, crackling energy, plasma trails' },
          { value: 'ethereal', label: 'Ethereal', description: 'Soft ghostly glow', promptFragment: 'soft ethereal energy aura, translucent glow' },
          { value: 'void', label: 'Void', description: 'Dark matter absorption', promptFragment: 'void energy, dark matter particles, light absorption' },
        ],
      },
      {
        id: 'mood',
        label: 'Mood',
        options: [
          { value: 'calm', label: 'Calm Drift', description: 'Peaceful floating presence', promptFragment: 'calm floating drift, serene presence' },
          { value: 'aggressive', label: 'Aggressive', description: 'Intense attack stance', promptFragment: 'aggressive intense presence, attack stance' },
          { value: 'playful', label: 'Playful', description: 'Curious and mischievous', promptFragment: 'playful curious energy, mischievous expression' },
          { value: 'mysterious', label: 'Mysterious', description: 'Ancient and unknowable', promptFragment: 'mysterious ancient presence, unknowable aura' },
        ],
      },
    ],
    basePrompt:
      '{form}, {energy}, {mood}, neon red core glow, dark background',
    defaultParams: '--ar 1:1 --v 7',
  },
  {
    id: 'design-a-scene',
    title: 'Design a Scene',
    subtitle: 'Build an immersive world',
    description:
      'Craft a cinematic environment with custom setting, lighting, and composition. Frame the perfect shot.',
    icon: '\uD83C\uDFA8',
    accentColor: MJ.mjBlue,
    steps: [
      {
        id: 'environment',
        label: 'Environment',
        options: [
          { value: 'dark-forest', label: 'Dark Forest', description: 'Moody ancient woodland', promptFragment: 'dark moody forest, ancient trees, volumetric mist' },
          { value: 'neon-city', label: 'Neon City', description: 'Cyberpunk metropolis', promptFragment: 'neon-lit cyberpunk city, rain-slicked streets, holographic signs' },
          { value: 'space-station', label: 'Space Station', description: 'Orbital facility', promptFragment: 'orbital space station interior, zero gravity, starfield windows' },
          { value: 'underwater', label: 'Underwater', description: 'Deep ocean depths', promptFragment: 'deep underwater scene, bioluminescent creatures, coral structures' },
        ],
      },
      {
        id: 'lighting',
        label: 'Lighting',
        options: [
          { value: 'golden-hour', label: 'Golden Hour', description: 'Warm sunset rays', promptFragment: 'golden hour lighting, warm sun rays, long shadows' },
          { value: 'neon-glow', label: 'Neon Glow', description: 'Electric artificial light', promptFragment: 'neon glow lighting, electric colors, artificial ambiance' },
          { value: 'moonlit', label: 'Moonlit', description: 'Cold silver moonlight', promptFragment: 'moonlit scene, cold silver light, deep shadows' },
          { value: 'volumetric', label: 'Volumetric Fog', description: 'Light beams through haze', promptFragment: 'volumetric fog, god rays, atmospheric haze' },
        ],
      },
      {
        id: 'composition',
        label: 'Composition',
        options: [
          { value: 'wide-epic', label: 'Wide Epic', description: 'Vast landscape panorama', promptFragment: 'wide angle epic shot, vast scale, panoramic view' },
          { value: 'close-detail', label: 'Close Detail', description: 'Macro texture focus', promptFragment: 'close-up detail shot, macro focus, texture emphasis' },
          { value: 'vertical-story', label: 'Vertical Story', description: 'Tall narrative frame', promptFragment: 'vertical composition, layered depth, narrative framing' },
          { value: 'symmetrical', label: 'Symmetrical', description: 'Perfect center balance', promptFragment: 'perfect symmetry, centered composition, mirror balance' },
        ],
      },
    ],
    basePrompt:
      '{environment}, {lighting}, {composition}, cinematic color grading, 35mm film grain',
    defaultParams: '--ar 16:9 --style raw --v 7',
  },
]

/* ── Style options (for prompt builder) ──────────────── */

export const styleOptions = [
  { value: 'clean vector style', label: 'Vector / Flat' },
  { value: 'cinematic photography', label: 'Cinematic' },
  { value: 'digital illustration', label: 'Illustration' },
  { value: 'anime style', label: 'Anime' },
  { value: 'watercolor painting', label: 'Watercolor' },
  { value: '3D render, octane', label: '3D Render' },
  { value: 'pixel art', label: 'Pixel Art' },
  { value: 'concept art', label: 'Concept Art' },
]

export const aspectRatioOptions = [
  { value: '1:1', label: '1:1 Square', description: 'Avatars, icons' },
  { value: '16:9', label: '16:9 Wide', description: 'Hero banners, video' },
  { value: '9:16', label: '9:16 Tall', description: 'Stories, mobile' },
  { value: '2:3', label: '2:3 Portrait', description: 'Character sheets' },
  { value: '3:4', label: '3:4 Portrait', description: 'Posters' },
  { value: '4:3', label: '4:3 Landscape', description: 'Presentations' },
]

export const versionOptions = [
  { value: '6.1', label: 'V6.1 (Latest)' },
  { value: '6', label: 'V6' },
  { value: '5.2', label: 'V5.2' },
  { value: 'niji 6', label: 'Niji 6 (Anime)' },
]

/* ── Gallery Entries ─────────────────────────────────── */

export const galleryEntries: GalleryEntry[] = [
  {
    id: 'nio-action-pose',
    title: 'Nio - Action Pose',
    prompt:
      'chibi warrior character, green armor, holding glowing katana, dynamic action pose, motion blur slash effect, studio lighting, white background, clean vector style --ar 1:1 --v 6.1',
    techniques: ['prompting-fundamentals', 'cref-character-reference'],
    style: 'Vector / Flat',
    aspectRatio: '1:1',
    imagePath: '/midjourney/nio-action-pose.png',
    parameters: [
      { key: '--ar', value: '1:1' },
      { key: '--v', value: '6.1' },
    ],
    tags: ['character', 'chibi', 'action', 'avatar'],
    recipeCategory: 'build-a-bot',
  },
  {
    id: 'nio-victory',
    title: 'Nio - Victory Celebration',
    prompt:
      'chibi character with green armor standing in victory pose, celebrating, confetti, sparkle effects, white background --cref [reference_url] --cw 100 --ar 1:1 --v 6.1',
    techniques: ['cref-character-reference', 'prompting-fundamentals'],
    style: 'Vector / Flat',
    aspectRatio: '1:1',
    imagePath: '/midjourney/nio-victory.png',
    parameters: [
      { key: '--cref', value: '[url]' },
      { key: '--cw', value: '100' },
      { key: '--ar', value: '1:1' },
    ],
    tags: ['character', 'chibi', 'CREF', 'celebration'],
    recipeCategory: 'build-a-bot',
  },
  {
    id: 'nio-sword-detail',
    title: 'Nio - Sword Detail',
    prompt:
      'magical katana, glowing green blade, intricate hilt design, dark background, dramatic lighting, weapon concept art --oref [sword_url] --ow 100 --ar 3:4 --v 6.1',
    techniques: ['oref-object-reference'],
    style: 'Concept Art',
    aspectRatio: '3:4',
    imagePath: '/midjourney/nio-sword-detail.png',
    parameters: [
      { key: '--oref', value: '[url]' },
      { key: '--ow', value: '100' },
      { key: '--ar', value: '3:4' },
    ],
    tags: ['weapon', 'OREF', 'concept art', 'detail'],
  },
  {
    id: 'recon-portrait',
    title: 'Recon - Character Portrait',
    prompt:
      'chibi character with blue tactical armor, visor helmet, surveillance drones floating nearby, tech HUD elements, dark background, rim lighting --cref [reference_url] --cw 100 --ar 1:1 --v 6.1',
    techniques: ['cref-character-reference', 'style-consistency'],
    style: 'Vector / Flat',
    aspectRatio: '1:1',
    imagePath: '/midjourney/recon-portrait.png',
    parameters: [
      { key: '--cref', value: '[url]' },
      { key: '--cw', value: '100' },
      { key: '--ar', value: '1:1' },
    ],
    tags: ['character', 'chibi', 'CREF', 'portrait'],
    recipeCategory: 'build-a-bot',
  },
  {
    id: 'rem-portrait',
    title: 'Rem - Character Portrait',
    prompt:
      'chibi character with purple robes, magical aura, floating spell books, mystical particles, dark background, ethereal lighting --cref [reference_url] --cw 100 --ar 1:1 --v 6.1',
    techniques: ['cref-character-reference', 'style-consistency'],
    style: 'Vector / Flat',
    aspectRatio: '1:1',
    imagePath: '/midjourney/rem-portrait.png',
    parameters: [
      { key: '--cref', value: '[url]' },
      { key: '--cw', value: '100' },
      { key: '--ar', value: '1:1' },
    ],
    tags: ['character', 'chibi', 'CREF', 'portrait'],
    recipeCategory: 'create-a-spirit',
  },
  {
    id: 'forest-environment',
    title: 'Dark Forest Environment',
    prompt:
      'dark moody forest, volumetric fog, single beam of golden light breaking through canopy, cinematic color grading, 35mm film grain --ar 16:9 --style raw --v 6.1',
    techniques: ['prompting-fundamentals', 'aspect-ratios-composition'],
    style: 'Cinematic',
    aspectRatio: '16:9',
    imagePath: '/midjourney/forest-environment.png',
    parameters: [
      { key: '--ar', value: '16:9' },
      { key: '--style', value: 'raw' },
      { key: '--v', value: '6.1' },
    ],
    tags: ['environment', 'cinematic', 'landscape', 'raw'],
    recipeCategory: 'design-a-scene',
  },
  {
    id: 'style-bible-sheet',
    title: 'Style Bible Reference Sheet',
    prompt:
      'character design reference sheet, chibi style, clean flat illustration, thick outlines, pastel color palette, multiple poses, white background, studio lighting --sref [style_url] --sw 100 --ar 16:9 --v 6.1',
    techniques: ['style-consistency', 'aspect-ratios-composition'],
    style: 'Vector / Flat',
    aspectRatio: '16:9',
    imagePath: '/midjourney/style-bible-sheet.png',
    parameters: [
      { key: '--sref', value: '[url]' },
      { key: '--sw', value: '100' },
      { key: '--ar', value: '16:9' },
    ],
    tags: ['style bible', 'SREF', 'reference sheet', 'design'],
  },
  {
    id: 'trio-lineup',
    title: 'NeoBot Trio Lineup',
    prompt:
      'three chibi characters standing together, green warrior, blue tech specialist, purple mage, team lineup, consistent style, white background --sref [style_url] --sw 100 --ar 16:9 --v 6.1',
    techniques: [
      'cref-character-reference',
      'style-consistency',
      'aspect-ratios-composition',
    ],
    style: 'Vector / Flat',
    aspectRatio: '16:9',
    imagePath: '/midjourney/trio-lineup.png',
    parameters: [
      { key: '--sref', value: '[url]' },
      { key: '--sw', value: '100' },
      { key: '--ar', value: '16:9' },
    ],
    tags: ['character', 'team', 'SREF', 'lineup'],
    recipeCategory: 'build-a-bot',
  },
  {
    id: 'mobile-wallpaper',
    title: 'Nio Mobile Wallpaper',
    prompt:
      'chibi warrior character with green armor, standing heroically on cliff edge, vast starry sky background, epic scale, clean illustration style --cref [reference_url] --cw 100 --ar 9:16 --v 6.1',
    techniques: ['cref-character-reference', 'aspect-ratios-composition'],
    style: 'Illustration',
    aspectRatio: '9:16',
    imagePath: '/midjourney/nio-mobile-wallpaper.png',
    parameters: [
      { key: '--cref', value: '[url]' },
      { key: '--cw', value: '100' },
      { key: '--ar', value: '9:16' },
    ],
    tags: ['wallpaper', 'mobile', 'CREF', 'vertical'],
    recipeCategory: 'design-a-scene',
  },
]

/* ── Suggested Combinations (for prompt builder) ───── */

export const suggestedCombinations = [
  {
    label: 'Character Avatar',
    subject: 'chibi character, clean design, centered composition',
    style: 'clean vector style',
    ar: '1:1',
    version: '6.1',
    extras: ['--cref [url] --cw 100'],
  },
  {
    label: 'Hero Banner',
    subject: 'epic landscape with character, vast sky, dramatic lighting',
    style: 'cinematic photography',
    ar: '16:9',
    version: '6.1',
    extras: ['--style raw'],
  },
  {
    label: 'Character Sheet',
    subject: 'character design reference sheet, multiple poses, turnaround',
    style: 'concept art',
    ar: '16:9',
    version: '6.1',
    extras: ['--sref [url] --sw 100'],
  },
  {
    label: 'Story Format',
    subject: 'character in dramatic pose, vertical composition, moody lighting',
    style: 'digital illustration',
    ar: '9:16',
    version: '6.1',
    extras: ['--cref [url] --cw 100'],
  },
]

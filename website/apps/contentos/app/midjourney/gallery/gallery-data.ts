/* ── MidJourney Gallery - Data ────────────────────────── */

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
}

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

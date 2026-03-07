/* ── MidJourney Mastery - Data ────────────────────────── */

export interface MJParameter {
  key: string
  value: string
  description: string
}

export interface MJPrompt {
  text: string
  label?: string
  parameters?: MJParameter[]
}

export interface MJTechnique {
  id: string
  title: string
  subtitle: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'prompting' | 'reference' | 'style' | 'workflow'
  prompts: MJPrompt[]
  images: { src: string; alt: string; label?: string }[]
  tips: string[]
  tags: string[]
}

/* ── Techniques ──────────────────────────────────────── */

export const techniques: MJTechnique[] = [
  {
    id: 'prompting-fundamentals',
    title: 'Prompting Fundamentals',
    subtitle: 'Subject-first grammar, lighting keywords, style modifiers',
    description:
      'The foundation of every great MidJourney image starts with how you structure your prompt. Lead with the subject, layer in environment and lighting, then close with style modifiers. Order matters - MJ weights early tokens more heavily.',
    difficulty: 'beginner',
    category: 'prompting',
    prompts: [
      {
        text: 'chibi warrior character, green armor, holding katana, dynamic action pose, studio lighting, white background, clean vector style --ar 1:1 --v 6.1',
        label: 'Character prompt - subject first',
        parameters: [
          { key: '--ar', value: '1:1', description: 'Square aspect ratio for avatar use' },
          { key: '--v', value: '6.1', description: 'MidJourney model version' },
        ],
      },
      {
        text: 'dark moody forest, volumetric fog, single beam of golden light breaking through canopy, cinematic color grading, 35mm film grain --ar 16:9 --style raw',
        label: 'Environment prompt - atmosphere stacking',
        parameters: [
          { key: '--ar', value: '16:9', description: 'Widescreen cinematic ratio' },
          { key: '--style', value: 'raw', description: 'Less MJ stylization, more photographic' },
        ],
      },
    ],
    images: [],
    tips: [
      'Put the most important element first - MJ weights early tokens more heavily',
      'Stack 2-3 lighting keywords for depth: "studio lighting, rim light, soft shadows"',
      'Use "clean background" or "white background" for assets you need to extract',
      'Avoid negative prompts unless necessary - describe what you want, not what you don\'t',
    ],
    tags: ['fundamentals', 'prompt structure', 'lighting', 'style modifiers'],
  },
  {
    id: 'cref-character-reference',
    title: 'CREF - Character Reference',
    subtitle: 'Lock face and proportions across generations',
    description:
      'CREF (Character Reference) is MidJourney\'s way of maintaining character consistency. Upload a reference image and MJ will match the character\'s face, proportions, and overall design. This is how you generate 20 poses of the same character without them morphing into someone else.',
    difficulty: 'intermediate',
    category: 'reference',
    prompts: [
      {
        text: 'chibi character with green armor standing in victory pose, celebrating, confetti, white background --cref [reference_url] --cw 100 --ar 1:1',
        label: 'Full character lock',
        parameters: [
          { key: '--cref', value: '[url]', description: 'Character reference image URL' },
          { key: '--cw', value: '100', description: 'Character weight: 100 = full lock (face + outfit + proportions)' },
        ],
      },
      {
        text: 'portrait of character looking determined, dramatic lighting, dark background --cref [reference_url] --cw 50 --ar 3:4',
        label: 'Face-only lock',
        parameters: [
          { key: '--cw', value: '50', description: 'Lower weight: locks face but allows outfit/style variation' },
        ],
      },
    ],
    images: [],
    tips: [
      '--cw 100 locks everything: face, outfit, proportions, accessories',
      '--cw 0-50 locks mostly face/expression - lets outfit and style change',
      'Use your best generation as the CREF source - quality in = quality out',
      'Combine with OREF for absolute consistency (face from CREF + weapon from OREF)',
    ],
    tags: ['CREF', 'character consistency', 'face lock', 'multi-pose'],
  },
  {
    id: 'oref-object-reference',
    title: 'OREF - Object Reference',
    subtitle: 'Lock specific objects and accessories across generations',
    description:
      'OREF (Object Reference) locks specific objects - weapons, accessories, logos, vehicles - across generations. While CREF handles the character, OREF handles the stuff they carry. Together they give you full production-grade consistency.',
    difficulty: 'intermediate',
    category: 'reference',
    prompts: [
      {
        text: 'chibi warrior character holding magical katana, glowing green blade, action pose --oref [sword_url] --ow 100 --cref [char_url] --cw 100 --ar 1:1',
        label: 'Combined CREF + OREF',
        parameters: [
          { key: '--oref', value: '[url]', description: 'Object reference image URL' },
          { key: '--ow', value: '100', description: 'Object weight: how closely to match the reference object' },
          { key: '--cref', value: '[url]', description: 'Character reference (used alongside OREF)' },
        ],
      },
    ],
    images: [],
    tips: [
      'Isolate the object on a clean background for best OREF results',
      'OREF works best for distinct objects: weapons, vehicles, logos, jewelry',
      'Stack CREF + OREF together for character + object consistency',
      'Lower --ow (50-75) for "inspired by" rather than exact match',
    ],
    tags: ['OREF', 'object consistency', 'accessories', 'weapons'],
  },
  {
    id: 'style-consistency',
    title: 'Style Consistency',
    subtitle: 'Maintain visual coherence across a series',
    description:
      'Creating a visually cohesive series requires more than just CREF. Style references (--sref), consistent prompt structure, and deliberate style tokens keep your entire project looking like it came from one artist, not a random generator.',
    difficulty: 'intermediate',
    category: 'style',
    prompts: [
      {
        text: 'chibi character portrait, clean flat illustration, thick outlines, pastel color palette, white background, studio lighting --sref [style_url] --sw 100 --ar 1:1',
        label: 'Style reference lock',
        parameters: [
          { key: '--sref', value: '[url]', description: 'Style reference image URL' },
          { key: '--sw', value: '100', description: 'Style weight: how closely to match the reference style' },
        ],
      },
      {
        text: 'same scene, different angle, maintaining consistent lighting and color grading --sref [style_url] --cref [char_url] --ar 16:9',
        label: 'Triple lock: style + character + composition',
      },
    ],
    images: [],
    tips: [
      'Keep a "style bible" - save your best generation and use it as --sref for everything',
      'Repeat the same style tokens in every prompt: "clean flat illustration, thick outlines"',
      'Use --sref + --cref together for maximum consistency',
      'Create a template prompt and only swap the action/pose for each generation',
    ],
    tags: ['SREF', 'visual cohesion', 'series', 'style bible'],
  },
  {
    id: 'aspect-ratios-composition',
    title: 'Aspect Ratios & Composition',
    subtitle: 'The --ar flag, framing, and negative space',
    description:
      'Aspect ratio isn\'t just cropping - it changes how MJ composes the entire image. A 1:1 square centers the subject. A 16:9 creates cinematic depth. A 9:16 produces vertical portraits. Understanding this lets you generate production-ready assets without post-processing.',
    difficulty: 'beginner',
    category: 'workflow',
    prompts: [
      {
        text: 'character avatar, centered composition, symmetrical, clean background --ar 1:1',
        label: '1:1 - Avatars, profile pics, social icons',
        parameters: [
          { key: '--ar', value: '1:1', description: 'Square - centers subject, tight framing' },
        ],
      },
      {
        text: 'epic landscape with character in lower third, vast sky, cinematic --ar 16:9',
        label: '16:9 - Hero banners, video thumbnails',
        parameters: [
          { key: '--ar', value: '16:9', description: 'Widescreen - cinematic, environmental' },
        ],
      },
      {
        text: 'full body character design, standing pose, concept art sheet --ar 2:3',
        label: '2:3 - Character sheets, mobile screens',
        parameters: [
          { key: '--ar', value: '2:3', description: 'Portrait - full body, vertical emphasis' },
        ],
      },
    ],
    images: [],
    tips: [
      '1:1 for avatars and icons - forces tight, centered composition',
      '16:9 for hero images and banners - creates cinematic negative space',
      '2:3 or 3:4 for character design sheets - shows full body',
      '9:16 for mobile wallpapers and story-format content',
    ],
    tags: ['aspect ratio', 'composition', 'framing', 'production assets'],
  },
]

/* ── Prompting Principles (horizontal scroll) ─────── */

export const principles = [
  {
    number: '01',
    title: 'Subject First',
    description:
      'MidJourney weighs tokens by position. The first words in your prompt get the most attention. Always lead with your primary subject before adding modifiers.',
    example: '"chibi warrior character" not "a cool illustration of what might be a warrior"',
  },
  {
    number: '02',
    title: 'Stack, Don\'t Stuff',
    description:
      'Layer 2-3 complementary modifiers instead of dumping every keyword you know. "studio lighting, rim light, soft shadows" beats "amazing incredible beautiful stunning lighting."',
    example: 'Quality > quantity. Three precise keywords beat ten vague ones.',
  },
  {
    number: '03',
    title: 'Parameters Are Power',
    description:
      'The real control lives in the flags: --ar for composition, --cref for character lock, --sref for style, --style raw for photographic realism. Learn the parameters before memorizing prompt hacks.',
    example: '--cref + --sref + --ar = 90% of production-grade output control',
  },
  {
    number: '04',
    title: 'Iterate, Don\'t Regenerate',
    description:
      'Found a 70% generation? Use variations (V1-V4), upscale, then CREF the result. Building on good outputs beats rolling the dice on fresh prompts.',
    example: 'Generate > select best > vary > CREF lock > produce series',
  },
  {
    number: '05',
    title: 'Reference Everything',
    description:
      'CREF for characters, OREF for objects, SREF for style. If you\'re not using references, you\'re leaving consistency on the table. Your best generation is your next reference.',
    example: 'A "style bible" image used as --sref across 50 generations = cohesive brand.',
  },
]

/* ── Process Steps ───────────────────────────────────── */

export const processSteps = [
  {
    title: 'Concept',
    description: 'Define the character, scene, or asset you need. Sketch the brief.',
  },
  {
    title: 'Prompt',
    description: 'Structure your prompt: subject first, then environment, lighting, style modifiers, and parameters.',
  },
  {
    title: 'Generate',
    description: 'Run the prompt. Evaluate the 4 outputs. Select the best candidate.',
  },
  {
    title: 'Iterate',
    description: 'Use V1-V4 variations on your best pick. Refine until you hit 90%+.',
  },
  {
    title: 'CREF Lock',
    description: 'Save your best generation. Use it as --cref for all future poses and scenes.',
  },
  {
    title: 'Production',
    description: 'Upscale, remove background, format for target platform. Ship it.',
  },
]

/* ── FAQ ─────────────────────────────────────────────── */

export const faqItems = [
  {
    question: 'What MidJourney version should I use?',
    answer:
      'V6.1 is the current production version. It handles text rendering, character consistency, and photorealistic output better than any previous version. Use --v 6.1 unless you have a specific reason for an older version.',
  },
  {
    question: 'How is CREF different from image prompting?',
    answer:
      'Image prompting (/imagine [url] prompt) uses the image as general inspiration - it captures mood, color, composition. CREF (--cref [url]) specifically locks the character\'s face, proportions, and identity. Use image prompting for vibes. Use CREF for character consistency.',
  },
  {
    question: 'Can I use CREF and SREF together?',
    answer:
      'Yes, and you should. --cref locks the character, --sref locks the artistic style. Together they let you generate consistent characters in a consistent visual style across dozens of images. Add --ar and you control composition too.',
  },
  {
    question: 'What does --style raw actually do?',
    answer:
      '--style raw reduces MidJourney\'s default beautification. Images come out more photographic, less "AI-pretty." Use it when you want realistic textures, natural lighting, or documentary-style images. Skip it for illustration and stylized work.',
  },
  {
    question: 'How do I maintain consistency across a whole series?',
    answer:
      'Three layers: (1) Use the same --sref style reference across all prompts. (2) Use --cref for every character appearance. (3) Keep a template prompt structure and only swap the action/pose. This is how we generated all three NeoBot characters with consistent style.',
  },
  {
    question: 'What aspect ratio should I use?',
    answer:
      'It depends on the asset type. 1:1 for avatars and icons. 16:9 for hero images and video thumbnails. 2:3 or 3:4 for character sheets and mobile. 9:16 for stories and vertical video. The aspect ratio changes how MJ composes the image, not just how it crops.',
  },
]

import React from 'react'
import {
  Ban,
  Bot,
  Brain,
  Copy,
  DoorClosed,
  Eye,
  EyeOff,
  Flame,
  Gem,
  Gift,
  Hammer,
  HelpCircle,
  Home,
  Laugh,
  Link,
  Link2Off,
  ListFilter,
  Mail,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Package,
  Radar,
  RefreshCw,
  Repeat,
  Rocket,
  Scale,
  Search,
  Send,
  Settings2,
  Shield,
  Shuffle,
  Sparkles,
  Swords,
  Target,
  Timer,
  TrendingDown,
  User,
  UserCheck,
  Wrench,
  Zap,
} from 'lucide-react'

/**
 * The report's step markers.
 *
 * These were emoji. At 3,000 words with a data layer under it, a row of
 * 📡🏗️❓😂 down the left margin read as a child project, and emoji render as
 * a different typeface on every platform. lucide is already a dependency, it
 * inherits the accent colour, and it holds the line at 18px.
 *
 * The data files carry a name, not a component, so reportData.ts stays a data
 * module with no React in it. IconName keeps the two honest: a name that is
 * not in this map will not compile.
 */
const ICONS = {
  Ban,
  Bot,
  Brain,
  Copy,
  DoorClosed,
  Eye,
  EyeOff,
  Flame,
  Gem,
  Gift,
  Hammer,
  HelpCircle,
  Home,
  Laugh,
  Link,
  Link2Off,
  ListFilter,
  Mail,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Package,
  Radar,
  RefreshCw,
  Repeat,
  Rocket,
  Scale,
  Search,
  Send,
  Settings2,
  Shield,
  Shuffle,
  Sparkles,
  Swords,
  Target,
  Timer,
  TrendingDown,
  User,
  UserCheck,
  Wrench,
  Zap,
} as const

export type IconName = keyof typeof ICONS

export function ReportIcon({
  name,
  size = 18,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const Glyph = ICONS[name]
  return <Glyph size={size} strokeWidth={1.75} aria-hidden className={className} />
}

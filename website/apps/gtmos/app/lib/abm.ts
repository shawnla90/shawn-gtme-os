import { supabase } from './supabase'

/* -- PageData types ---------------------------------------- */

export interface PageTheme {
  primary: string
  primaryLight: string
  primaryGlow: string
}

export interface PageStat {
  value: string
  label: string
}

export interface PageChallenge {
  icon: string
  title: string
  desc: string
}

export interface PageDeliverable {
  title: string
  desc: string
  tags: string[]
}

export interface PageEngagementStep {
  title: string
  subtitle: string
  desc: string
}

export interface PageFaqItem {
  question: string
  answer: string
}

export interface PageStackItem {
  name: string
  role: string
}

export interface PageContact {
  id: string
  name: string
  role: string
}

export interface PageData {
  slug: string
  company: string
  domain: string
  contactName: string
  contactRole: string
  contacts?: PageContact[]
  theme: PageTheme
  headline: string
  subheadline: string
  stats: PageStat[]
  challenges: PageChallenge[]
  deliverables: PageDeliverable[]
  engagementSteps: PageEngagementStep[]
  faqItems: PageFaqItem[]
  stackItems?: PageStackItem[]
  generatedAt: string
}

/* -- helpers ------------------------------------------------ */

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('slug')
  if (error || !data) return []
  return data.map((row) => row.slug)
}

export async function getPageData(slug: string): Promise<PageData | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('page_data')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data.page_data as PageData
}

export async function getAllPages(): Promise<PageData[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('page_data')
  if (error || !data) return []
  return data.map((row) => row.page_data as PageData)
}

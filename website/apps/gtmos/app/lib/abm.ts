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

/* -- result types ------------------------------------------- */

export interface PageResult {
  pageData: PageData
  depersonalized: boolean
  deprecated: boolean
}

export interface PageListItem {
  pageData: PageData
  depersonalized: boolean
  deprecated: boolean
}

/* -- helpers ------------------------------------------------ */

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('slug')
    .eq('deprecated', false)
  if (error || !data) return []
  return data.map((row) => row.slug)
}

export async function getPageData(slug: string): Promise<PageResult | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('page_data, depersonalized, deprecated')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return {
    pageData: data.page_data as PageData,
    depersonalized: data.depersonalized ?? false,
    deprecated: data.deprecated ?? false,
  }
}

export async function getAllPages(): Promise<PageListItem[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('page_data, depersonalized, deprecated')
    .eq('deprecated', false)
  if (error || !data) return []
  return data.map((row) => ({
    pageData: row.page_data as PageData,
    depersonalized: row.depersonalized ?? false,
    deprecated: row.deprecated ?? false,
  }))
}

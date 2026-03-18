export { getPostSlugs, getPostBySlug, getAllPosts } from './posts'
export type { Post } from './posts'
export { markdownToHtml, extractFAQs } from './markdown'
export type { FAQItem } from './markdown'
export { getSiteUrl } from './related'
export { getLogDates, getLogByDate, getAllLogs, getLogAggregates, getWeeklyContext } from './logs'
export type {
  DailyLog,
  DailyLogSummary,
  LogAggregates,
  Accomplishment,
  PipelineDraft,
  Pipeline,
  Todo,
  TokenEntry,
  ScoreBreakdownItem,
  PlatformBreakdown,
  Stats,
  GitSummary,
  Commit,
  DevEquivalent,
  CostSection,
  TokenEfficiency,
  WeekDaySummary,
} from './logs'
export { TITLE_TABLE, DEFAULT_PROFILE, tierColor } from './rpg'
export type { RPGProfile, RPGClass, Milestone, TitleTier, ScoringLogEntry } from './rpg'
export {
  getTierAvatarUrls,
  getAvatarUrlsForProfile,
  isAdvancedVariant,
  getClassAvatarUrls,
  getToolAvatarUrls,
} from './rpg'
export { getRPGProfile, getAvatarPath, getAvatarGifPath, hasRPGData } from './rpg.server'
export { resolveDataRoot } from './dataRoot'
export {
  getNioAvatarUrls,
  totalLOC,
  formatNumber,
  gradeColor,
  LANGUAGE_COLORS,
  NIO_TIERS,
} from './vitals'
export type {
  WebsiteStats,
  SiteStats,
  SiteLOC,
  TechnicalFeature,
  NioProgress,
  SharedStats,
  InfraStats,
  NioTierInfo,
} from './vitals'
export { getWebsiteStats } from './vitals.server'

// V2/V3 progression — removed from barrel exports (V4 migration)
// Files retained for reference but no longer re-exported.

// Cost analytics
export type { CostBreakdown, CostAnalytics } from './costs'
export { getCostAnalytics } from './costs.server'

// Crews
export type { CrewAgent, Crew, CrewsConfig, CrewStatus } from './crews'

// Analytics
export {
  capture,
  extractUTMParams,
  trackContentView,
  trackScrollDepth,
  trackTimeOnPage,
  trackOutboundClick,
  trackCtaClick,
  trackNewsletterSignup,
  trackCrossSiteNav,
} from './analytics'
export type { ContentMeta, UTMParams, SiteKey as AnalyticsSiteKey } from './analytics'

export { buildFeed, feedResponse, getFeedConfig } from './rss'
export {
  blogPostsToFeedItems,
  dailyLogsToFeedItems,
  apolloWikiToFeedItems,
  clayWikiToFeedItems,
  contentWikiToFeedItems,
  contextWikiToFeedItems,
  howToWikiToFeedItems,
  knowledgeToFeedItems,
  gtmTermsToFeedItems,
  geoWikiToFeedItems,
  mergeFeedItems,
} from './rss'
export type { FeedConfig, FeedItem, FeedAuthor, SiteKey as RssSiteKey } from './rss'

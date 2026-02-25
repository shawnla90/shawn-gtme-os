import Foundation

struct WebsiteStats: Codable {
    let generatedAt: String?
    let totalScore: Int?
    let grade: String?
    let nioTier: Int?
    let nioTierName: String?
    let nioProgress: NioProgress?
    let sites: [String: SiteStats]?
    let shared: SharedStats?
    let infra: InfraStats?

    enum CodingKeys: String, CodingKey {
        case generatedAt = "generated_at"
        case totalScore = "total_score"
        case grade
        case nioTier = "nio_tier"
        case nioTierName = "nio_tier_name"
        case nioProgress = "nio_progress"
        case sites, shared, infra
    }
}

struct NioProgress: Codable {
    let current: Int?
    let needed: Int?
    let percent: Double?
    let nextTier: Int?
    let nextTierName: String?

    enum CodingKeys: String, CodingKey {
        case current, needed, percent
        case nextTier = "next_tier"
        case nextTierName = "next_tier_name"
    }
}

struct SiteStats: Codable, Identifiable {
    var id: String { name }
    let name: String
    let accent: String?
    let score: Int?
    let grade: String?
    let loc: [String: Int]?
    let routes: Int?
    let routeList: [String]?
    let components: Int?
    let apiEndpoints: Int?
    let apiEndpointList: [String]?
    let features: [String]?
    let featureCount: Int?

    enum CodingKeys: String, CodingKey {
        case name, accent, score, grade, loc, routes
        case routeList = "route_list"
        case components
        case apiEndpoints = "api_endpoints"
        case apiEndpointList = "api_endpoint_list"
        case features
        case featureCount = "feature_count"
    }

    var totalLOC: Int {
        loc?.values.reduce(0, +) ?? 0
    }
}

struct SharedStats: Codable {
    let components: Int?
    let componentList: [String]?
    let designTokens: Bool?
    let loc: [String: Int]?

    enum CodingKeys: String, CodingKey {
        case components
        case componentList = "component_list"
        case designTokens = "design_tokens"
        case loc
    }
}

struct InfraStats: Codable {
    let monorepo: Bool?
    let vercelSites: Int?
    let totalLoc: Int?
    let locByLanguage: [String: Int]?
    let languages: [String]?
    let technicalFeatures: [TechnicalFeature]?

    enum CodingKeys: String, CodingKey {
        case monorepo
        case vercelSites = "vercel_sites"
        case totalLoc = "total_loc"
        case locByLanguage = "loc_by_language"
        case languages
        case technicalFeatures = "technical_features"
    }
}

struct TechnicalFeature: Codable, Identifiable {
    var id: String { name }
    let name: String
    let description: String?
    let points: Int?
}

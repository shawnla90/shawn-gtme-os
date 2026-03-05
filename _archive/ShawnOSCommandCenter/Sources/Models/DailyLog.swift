import Foundation

struct DailyLog: Codable {
    let date: String
    let generatedAt: String?
    let version: Int?
    let accomplishments: [Accomplishment]
    let commits: [Commit]
    let pipeline: Pipeline?
    let stats: DailyStats?
    let gitSummary: GitSummary?
    let devEquivalent: DevEquivalent?
    let cost: DailyCost?

    enum CodingKeys: String, CodingKey {
        case date
        case generatedAt = "generated_at"
        case version
        case accomplishments
        case commits
        case pipeline
        case stats
        case gitSummary = "git_summary"
        case devEquivalent = "dev_equivalent"
        case cost
    }
}

struct Accomplishment: Codable, Identifiable {
    var id: String { "\(type)-\(title)-\(timestamp ?? "")" }
    let type: String
    let title: String
    let path: String?
    let source: String?
    let timestamp: String?
    let words: Int?
    let valueScore: Int?
    let shipped: Bool?

    enum CodingKeys: String, CodingKey {
        case type, title, path, source, timestamp, words
        case valueScore = "value_score"
        case shipped
    }
}

struct Commit: Codable, Identifiable {
    var id: String { hash }
    let hash: String
    let message: String
    let type: String
    let score: Int
    let filesChanged: Int?
    let linesAdded: Int?
    let linesRemoved: Int?
    let linesNet: Int?
    let directories: [String]?
    let timestamp: String?

    enum CodingKeys: String, CodingKey {
        case hash, message, type, score
        case filesChanged = "files_changed"
        case linesAdded = "lines_added"
        case linesRemoved = "lines_removed"
        case linesNet = "lines_net"
        case directories, timestamp
    }
}

struct Pipeline: Codable {
    let draftsActive: [PipelineDraft]?
    let finalizedToday: [PipelineFinalized]?

    enum CodingKeys: String, CodingKey {
        case draftsActive = "drafts_active"
        case finalizedToday = "finalized_today"
    }
}

struct PipelineDraft: Codable {
    let platform: String?
    let title: String?
    let path: String?
    let targetDate: String?
    let words: Int?

    enum CodingKeys: String, CodingKey {
        case platform, title, path
        case targetDate = "target_date"
        case words
    }
}

struct PipelineFinalized: Codable {
    let platform: String?
    let path: String?
}

struct DailyStats: Codable {
    let outputScore: Int?
    let letterGrade: String?
    let wordsToday: Int?
    let shippedCount: Int?
    let draftCount: Int?
    let agentCost: Double?
    let commitsToday: Int?
    let efficiencyRating: Double?
    let linesAdded: Int?
    let linesRemoved: Int?
    let linesNet: Int?
    let shipRate: Double?
    let platformBreakdown: [String: Int]?
    let scoreBreakdown: [ScoreBreakdownItem]?

    enum CodingKeys: String, CodingKey {
        case outputScore = "output_score"
        case letterGrade = "letter_grade"
        case wordsToday = "words_today"
        case shippedCount = "shipped_count"
        case draftCount = "draft_count"
        case agentCost = "agent_cost"
        case commitsToday = "commits_today"
        case efficiencyRating = "efficiency_rating"
        case linesAdded = "lines_added"
        case linesRemoved = "lines_removed"
        case linesNet = "lines_net"
        case shipRate = "ship_rate"
        case platformBreakdown = "platform_breakdown"
        case scoreBreakdown = "score_breakdown"
    }
}

struct ScoreBreakdownItem: Codable {
    let type: String?
    let title: String?
    let points: Int?
}

struct GitSummary: Codable {
    let commitsToday: Int?
    let linesAddedCount: Int?
    let linesRemovedCount: Int?
    let linesNet: Int?

    enum CodingKeys: String, CodingKey {
        case commitsToday = "commits_today"
        case linesAddedCount = "lines_added_count"
        case linesRemovedCount = "lines_removed_count"
        case linesNet = "lines_net"
    }
}

struct DevEquivalent: Codable {
    let netLines: Int?
    let devDays: Double?
    let costEstimate: Int?
    let explanation: String?

    enum CodingKeys: String, CodingKey {
        case netLines = "net_lines"
        case devDays = "dev_days"
        case costEstimate = "cost_estimate"
        case explanation
    }
}

struct DailyCost: Codable {
    let apiEquivalent: Int?
    let actualCost: Double?
    let pricingMode: String?

    enum CodingKeys: String, CodingKey {
        case apiEquivalent = "api_equivalent"
        case actualCost = "actual_cost"
        case pricingMode = "pricing_mode"
    }
}

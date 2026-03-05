import Foundation

struct ProgressionProfile: Codable {
    let name: String
    let title: String
    let level: Int
    let xpTotal: Int
    let xpNextLevel: Int
    let `class`: String
    let avatarTier: Int
    let scoringLog: [ScoringLogEntry]?
    let milestones: [Milestone]?
    let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case name, title, level
        case xpTotal = "xp_total"
        case xpNextLevel = "xp_next_level"
        case `class`
        case avatarTier = "avatar_tier"
        case scoringLog = "scoring_log"
        case milestones
        case updatedAt = "updated_at"
    }

    var xpProgress: Double {
        guard xpNextLevel > 0 else { return 0 }
        return Double(xpTotal) / Double(xpNextLevel)
    }
}

struct ScoringLogEntry: Codable, Identifiable {
    var id: String { date }
    let date: String
    let outputScore: Int
    let letterGrade: String
    let commits: Int

    enum CodingKeys: String, CodingKey {
        case date
        case outputScore = "output_score"
        case letterGrade = "letter_grade"
        case commits
    }
}

struct Milestone: Codable, Identifiable {
    let id: String
    let title: String
    let description: String
    let unlockedAt: String?

    enum CodingKeys: String, CodingKey {
        case id, title, description
        case unlockedAt = "unlocked_at"
    }
}

import Foundation

struct NioDNA {
    let xp: Int
    let tier: Int
    let level: Int
    let streak: Int
    let lastActiveDate: String?
    let skillXP: [String: Int]
    let totalMessages: Int
    let totalConversations: Int

    var tierName: String {
        switch tier {
        case 1: return "Spark"
        case 2: return "Blade"
        case 3: return "Warden"
        case 4: return "Oracle"
        case 5: return "Sovereign"
        default: return "Unknown"
        }
    }

    var xpForNextTier: Int {
        switch tier {
        case 1: return 500
        case 2: return 2000
        case 3: return 5000
        case 4: return 10000
        default: return 99999
        }
    }

    var xpToNextTier: Int {
        max(0, xpForNextTier - xp)
    }

    var tierProgress: Double {
        let prevThreshold: Int
        switch tier {
        case 1: prevThreshold = 0
        case 2: prevThreshold = 500
        case 3: prevThreshold = 2000
        case 4: prevThreshold = 5000
        default: prevThreshold = 10000
        }
        let range = xpForNextTier - prevThreshold
        guard range > 0 else { return 1.0 }
        return Double(xp - prevThreshold) / Double(range)
    }

    var nextTierName: String {
        switch tier {
        case 1: return "Blade"
        case 2: return "Warden"
        case 3: return "Oracle"
        case 4: return "Sovereign"
        default: return "Max"
        }
    }

    static let empty = NioDNA(
        xp: 0, tier: 1, level: 1, streak: 0,
        lastActiveDate: nil, skillXP: [:],
        totalMessages: 0, totalConversations: 0
    )
}

struct NioEvolutionEvent: Identifiable {
    let id: Int
    let xpGained: Int
    let source: String
    let skillId: String?
    let multiplier: Double
    let createdAt: String
}

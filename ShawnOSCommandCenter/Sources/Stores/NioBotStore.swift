import Foundation
import GRDB

final class NioBotStore: Sendable {
    private let dbPool: DatabasePool?

    init() {
        let dbPath = RepoConfig.nioBotDB
        do {
            var config = Configuration()
            config.readonly = true
            self.dbPool = try DatabasePool(path: dbPath, configuration: config)
        } catch {
            print("[NioBotStore] Failed to open niobot.db: \(error)")
            self.dbPool = nil
        }
    }

    // MARK: - DNA State

    func loadDNAState() -> NioDNA {
        guard let db = dbPool else { return .empty }
        do {
            return try db.read { db in
                let row = try Row.fetchOne(db, sql: """
                    SELECT xp, tier, level, streak, last_active_date,
                           skill_xp, total_messages, total_conversations
                    FROM dna_state WHERE user_id = 'default'
                """)

                guard let row = row else { return .empty }

                let skillXPJSON = row["skill_xp"] as? String ?? "{}"
                let skillXP = parseSkillXP(skillXPJSON)

                return NioDNA(
                    xp: row["xp"] as? Int ?? 0,
                    tier: row["tier"] as? Int ?? 1,
                    level: row["level"] as? Int ?? 1,
                    streak: row["streak"] as? Int ?? 0,
                    lastActiveDate: row["last_active_date"] as? String,
                    skillXP: skillXP,
                    totalMessages: row["total_messages"] as? Int ?? 0,
                    totalConversations: row["total_conversations"] as? Int ?? 0
                )
            }
        } catch {
            print("[NioBotStore] Error loading DNA state: \(error)")
            return .empty
        }
    }

    // MARK: - Evolution History

    func recentEvolution(limit: Int = 20) -> [NioEvolutionEvent] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                let rows = try Row.fetchAll(db, sql: """
                    SELECT id, xp_gained, source, skill_id, multiplier, created_at
                    FROM evolution_history
                    ORDER BY id DESC LIMIT ?
                """, arguments: [limit])

                return rows.map { row in
                    NioEvolutionEvent(
                        id: row["id"] as? Int ?? 0,
                        xpGained: row["xp_gained"] as? Int ?? 0,
                        source: row["source"] as? String ?? "",
                        skillId: row["skill_id"] as? String,
                        multiplier: row["multiplier"] as? Double ?? 1.0,
                        createdAt: row["created_at"] as? String ?? ""
                    )
                }
            }
        } catch {
            print("[NioBotStore] Error loading evolution history: \(error)")
            return []
        }
    }

    // MARK: - Skill XP

    func loadSkills() -> [(skill: String, xp: Int)] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                let rows = try Row.fetchAll(db, sql: """
                    SELECT skill_id, xp FROM evolution_skills
                    WHERE user_id = 'default'
                    ORDER BY xp DESC
                """)
                return rows.map { row in
                    (skill: row["skill_id"] as? String ?? "", xp: row["xp"] as? Int ?? 0)
                }
            }
        } catch {
            print("[NioBotStore] Error loading skills: \(error)")
            return []
        }
    }

    // MARK: - Heartbeat

    struct Heartbeat {
        let xp: Int
        let tier: Int
        let level: Int
        let streak: Int
        let totalMessages: Int
        let lastActiveDate: String?
        let updatedAt: Int64
        let lastMessage: String?
        let lastMessageTime: Int64?

        var lastActiveAgo: String {
            guard updatedAt > 0 else { return "unknown" }
            let date = Date(timeIntervalSince1970: Double(updatedAt) / 1000.0)
            let formatter = RelativeDateTimeFormatter()
            formatter.unitsStyle = .abbreviated
            return formatter.localizedString(for: date, relativeTo: Date())
        }

        var isActive: Bool {
            guard updatedAt > 0 else { return false }
            let date = Date(timeIntervalSince1970: Double(updatedAt) / 1000.0)
            return Date().timeIntervalSince(date) < 300 // active within 5 min
        }

        static let empty = Heartbeat(
            xp: 0, tier: 1, level: 1, streak: 0,
            totalMessages: 0, lastActiveDate: nil, updatedAt: 0,
            lastMessage: nil, lastMessageTime: nil
        )
    }

    func loadHeartbeat() -> Heartbeat {
        guard let db = dbPool else { return .empty }
        do {
            return try db.read { db in
                let dna = try Row.fetchOne(db, sql: """
                    SELECT xp, tier, level, streak, total_messages,
                           last_active_date, updated_at
                    FROM dna_state WHERE user_id = 'default'
                """)

                let lastMsg = try Row.fetchOne(db, sql: """
                    SELECT content, created_at FROM messages
                    WHERE role = 'assistant'
                    ORDER BY created_at DESC LIMIT 1
                """)

                return Heartbeat(
                    xp: dna?["xp"] as? Int ?? 0,
                    tier: dna?["tier"] as? Int ?? 1,
                    level: dna?["level"] as? Int ?? 1,
                    streak: dna?["streak"] as? Int ?? 0,
                    totalMessages: dna?["total_messages"] as? Int ?? 0,
                    lastActiveDate: dna?["last_active_date"] as? String,
                    updatedAt: dna?["updated_at"] as? Int64 ?? 0,
                    lastMessage: (lastMsg?["content"] as? String).map {
                        String($0.prefix(80))
                    },
                    lastMessageTime: lastMsg?["created_at"] as? Int64
                )
            }
        } catch {
            print("[NioBotStore] Heartbeat error: \(error)")
            return .empty
        }
    }

    // MARK: - Helpers

    private func parseSkillXP(_ json: String) -> [String: Int] {
        guard let data = json.data(using: .utf8),
              let dict = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            return [:]
        }
        var result: [String: Int] = [:]
        for (key, value) in dict {
            if let intVal = value as? Int {
                result[key] = intVal
            }
        }
        return result
    }
}

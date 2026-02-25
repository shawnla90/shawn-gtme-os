import Foundation
import GRDB

final class SQLiteStore: Sendable {
    private let dbPool: DatabasePool?

    init() {
        do {
            var config = Configuration()
            config.readonly = true
            self.dbPool = try DatabasePool(path: RepoConfig.indexDB, configuration: config)
        } catch {
            print("[SQLiteStore] Failed to open database: \(error)")
            self.dbPool = nil
        }
    }

    // MARK: - Content

    func allContent() -> [ContentItem] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                try ContentItem
                    .order(ContentItem.CodingKeys.date.desc)
                    .fetchAll(db)
            }
        } catch {
            print("[SQLiteStore] Error fetching content: \(error)")
            return []
        }
    }

    func contentFiltered(platform: String? = nil, stage: String? = nil, search: String? = nil) -> [ContentItem] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                var query = ContentItem.all()
                if let platform = platform, !platform.isEmpty {
                    query = query.filter(ContentItem.CodingKeys.platform == platform)
                }
                if let stage = stage, !stage.isEmpty {
                    query = query.filter(ContentItem.CodingKeys.stage == stage)
                }
                if let search = search, !search.isEmpty {
                    let pattern = "%\(search)%"
                    query = query.filter(
                        ContentItem.CodingKeys.title.like(pattern) ||
                        ContentItem.CodingKeys.slug.like(pattern) ||
                        ContentItem.CodingKeys.pillar.like(pattern)
                    )
                }
                return try query.order(ContentItem.CodingKeys.date.desc).fetchAll(db)
            }
        } catch {
            print("[SQLiteStore] Error filtering content: \(error)")
            return []
        }
    }

    // MARK: - Assets

    func allAssets() -> [AssetItem] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                try AssetItem.fetchAll(db)
            }
        } catch {
            print("[SQLiteStore] Error fetching assets: \(error)")
            return []
        }
    }

    func assetsFiltered(assetType: String? = nil, tier: Int? = nil, search: String? = nil) -> [AssetItem] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                var query = AssetItem.all()
                if let assetType = assetType, !assetType.isEmpty {
                    query = query.filter(AssetItem.CodingKeys.assetType == assetType)
                }
                if let tier = tier {
                    query = query.filter(AssetItem.CodingKeys.tier == tier)
                }
                if let search = search, !search.isEmpty {
                    let pattern = "%\(search)%"
                    query = query.filter(
                        AssetItem.CodingKeys.name.like(pattern) ||
                        AssetItem.CodingKeys.filePath.like(pattern)
                    )
                }
                return try query.fetchAll(db)
            }
        } catch {
            print("[SQLiteStore] Error filtering assets: \(error)")
            return []
        }
    }

    // MARK: - Skills

    func allSkills() -> [SkillItem] {
        guard let db = dbPool else { return [] }
        do {
            return try db.read { db in
                try SkillItem.order(SkillItem.CodingKeys.name.asc).fetchAll(db)
            }
        } catch {
            print("[SQLiteStore] Error fetching skills: \(error)")
            return []
        }
    }

    // MARK: - Search

    func searchAll(query: String) -> (content: [ContentItem], assets: [AssetItem], skills: [SkillItem]) {
        let content = contentFiltered(search: query)
        let assets = assetsFiltered(search: query)
        let skills: [SkillItem] = {
            guard let db = dbPool else { return [] }
            do {
                return try db.read { db in
                    let pattern = "%\(query)%"
                    return try SkillItem
                        .filter(
                            SkillItem.CodingKeys.name.like(pattern) ||
                            SkillItem.CodingKeys.description.like(pattern)
                        )
                        .fetchAll(db)
                }
            } catch { return [] }
        }()
        return (content, assets, skills)
    }
}

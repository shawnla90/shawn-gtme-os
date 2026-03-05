import Foundation
import GRDB

struct SkillItem: Identifiable, Codable, FetchableRecord, TableRecord {
    static let databaseTableName = "skills"

    var id: Int64?
    var name: String
    var slug: String
    var description: String?
    var filePath: String?
    var category: String?
    var lastModified: String?
    var indexedAt: String?

    enum CodingKeys: String, CodingKey, ColumnExpression {
        case id, name, slug, description
        case filePath = "file_path"
        case category
        case lastModified = "last_modified"
        case indexedAt = "indexed_at"
    }
}

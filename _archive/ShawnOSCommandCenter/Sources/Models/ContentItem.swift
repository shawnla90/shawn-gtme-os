import Foundation
import GRDB

struct ContentItem: Identifiable, Codable, FetchableRecord, TableRecord {
    static let databaseTableName = "content"

    var id: Int64?
    var filePath: String
    var platform: String
    var stage: String
    var title: String?
    var slug: String?
    var date: String?
    var pillar: String?
    var arc: String?
    var series: String?
    var seriesPosition: Int?
    var statusText: String?
    var energy: String?
    var cta: String?
    var structure: String?
    var source: String?
    var wordCount: Int?
    var createdAt: String?
    var updatedAt: String?
    var indexedAt: String?

    enum CodingKeys: String, CodingKey, ColumnExpression {
        case id
        case filePath = "file_path"
        case platform
        case stage
        case title
        case slug
        case date
        case pillar
        case arc
        case series
        case seriesPosition = "series_position"
        case statusText = "status_text"
        case energy
        case cta
        case structure
        case source
        case wordCount = "word_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case indexedAt = "indexed_at"
    }

    var displayTitle: String {
        title ?? slug ?? filePath.components(separatedBy: "/").last ?? "Untitled"
    }

    var platformColor: String {
        RepoConfig.platformColors[platform] ?? "#4EC373"
    }

    var absolutePath: String {
        "\(RepoConfig.repoRoot)/\(filePath)"
    }
}

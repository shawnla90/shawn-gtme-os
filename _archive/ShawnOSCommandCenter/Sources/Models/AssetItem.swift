import Foundation
import GRDB

struct AssetItem: Identifiable, Codable, FetchableRecord, TableRecord {
    static let databaseTableName = "assets"

    var id: Int64?
    var filePath: String
    var site: String
    var assetType: String
    var name: String?
    var tier: Int?
    var className: String?
    var variant: String?
    var sizePx: Int?
    var fileSizeBytes: Int?
    var indexedAt: String?

    enum CodingKeys: String, CodingKey, ColumnExpression {
        case id
        case filePath = "file_path"
        case site
        case assetType = "asset_type"
        case name
        case tier
        case className = "class_name"
        case variant
        case sizePx = "size_px"
        case fileSizeBytes = "file_size_bytes"
        case indexedAt = "indexed_at"
    }

    var displayName: String {
        name ?? filePath.components(separatedBy: "/").last ?? "Unknown"
    }

    var absolutePath: String {
        "\(RepoConfig.repoRoot)/\(filePath)"
    }

    var fileSizeFormatted: String {
        guard let bytes = fileSizeBytes else { return "—" }
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }

    var isImage: Bool {
        let ext = (filePath as NSString).pathExtension.lowercased()
        return ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"].contains(ext)
    }
}

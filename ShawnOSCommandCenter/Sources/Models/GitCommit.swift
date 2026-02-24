import Foundation

struct GitCommit: Identifiable {
    var id: String { hash }
    let hash: String
    let shortHash: String
    let date: Date
    let author: String
    let message: String
    let filesChanged: Int
    let insertions: Int
    let deletions: Int
    let files: [FileChange]

    var area: String {
        // Determine primary area from file paths
        let areas = files.compactMap { $0.path.components(separatedBy: "/").first }
        let counts = Dictionary(areas.map { ($0, 1) }, uniquingKeysWith: +)
        return counts.max(by: { $0.value < $1.value })?.key ?? "root"
    }

    var dateFormatted: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        return formatter.string(from: date)
    }

    var relativeDate: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct FileChange: Identifiable {
    var id: String { path }
    let path: String
    let changeType: ChangeType
    let insertions: Int
    let deletions: Int

    enum ChangeType: String {
        case added = "A"
        case modified = "M"
        case deleted = "D"
        case renamed = "R"

        var label: String {
            switch self {
            case .added: return "ADD"
            case .modified: return "MOD"
            case .deleted: return "DEL"
            case .renamed: return "REN"
            }
        }
    }

    var area: String {
        path.components(separatedBy: "/").first ?? "root"
    }
}

struct RecentFile: Identifiable {
    var id: String { path }
    let path: String
    let filename: String
    let changeType: FileChange.ChangeType
    let timeAgo: String
    let area: String
}

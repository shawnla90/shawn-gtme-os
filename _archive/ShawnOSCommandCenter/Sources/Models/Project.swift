import Foundation

struct Project: Identifiable {
    var id: String { name }
    let name: String
    let path: String
    let description: String
    let icon: String
    let accentColor: String
    let recentCommits: Int
    let totalLOC: Int
    let routeCount: Int
    let score: Int?
    let status: ProjectStatus
    let campaigns: [(name: String, path: String)]
    let strategyDocs: [(name: String, path: String)]

    enum ProjectStatus: String {
        case active = "Active"
        case maintenance = "Maintenance"
        case development = "Development"

        var color: String {
            switch self {
            case .active: return "#4EC373"
            case .maintenance: return "#FFD700"
            case .development: return "#4A9EFF"
            }
        }
    }
}

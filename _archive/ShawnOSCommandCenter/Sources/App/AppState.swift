import SwiftUI

enum AppModule: String, CaseIterable, Identifiable {
    case contentHub
    case dailyOps
    case leveling
    case commits
    case projects
    case assetGallery
    case websiteDashboard
    case nioConsole
    case gtmPartners
    case showcase

    var id: String { rawValue }

    var title: String {
        switch self {
        case .contentHub: return "Content Hub"
        case .dailyOps: return "Daily Ops"
        case .leveling: return "Leveling"
        case .commits: return "Commits"
        case .projects: return "Projects"
        case .assetGallery: return "Asset Gallery"
        case .websiteDashboard: return "Website Dashboard"
        case .nioConsole: return "Nio Console"
        case .gtmPartners: return "GTM & Partners"
        case .showcase: return "Showcase"
        }
    }

    var icon: String {
        switch self {
        case .contentHub: return "doc.richtext"
        case .dailyOps: return "chart.bar.fill"
        case .leveling: return "arrow.up.right.circle.fill"
        case .commits: return "clock.arrow.circlepath"
        case .projects: return "folder.fill"
        case .assetGallery: return "photo.on.rectangle.angled"
        case .websiteDashboard: return "globe"
        case .nioConsole: return "terminal.fill"
        case .gtmPartners: return "person.3.fill"
        case .showcase: return "sparkles"
        }
    }

    var shortcutKey: KeyEquivalent {
        switch self {
        case .contentHub: return "1"
        case .dailyOps: return "2"
        case .leveling: return "3"
        case .commits: return "4"
        case .projects: return "5"
        case .assetGallery: return "6"
        case .websiteDashboard: return "7"
        case .nioConsole: return "8"
        case .gtmPartners: return "9"
        case .showcase: return "0"
        }
    }
}

@MainActor
class AppState: ObservableObject {
    @Published var selectedModule: AppModule = .contentHub
    @Published var isSearching = false
    @Published var searchQuery = ""

    let sqliteStore: SQLiteStore
    let fileStore: FileSystemStore
    let fileWatcher: FileWatcher
    let gitStore: GitStore
    let nioBotStore: NioBotStore

    init() {
        self.sqliteStore = SQLiteStore()
        self.fileStore = FileSystemStore()
        self.fileWatcher = FileWatcher(paths: [
            RepoConfig.contentDir,
            RepoConfig.dataDir,
            RepoConfig.reportsDir,
            RepoConfig.soulsDir,
            RepoConfig.gitHeadRef,
        ])
        self.gitStore = GitStore()
        self.nioBotStore = NioBotStore()
    }
}

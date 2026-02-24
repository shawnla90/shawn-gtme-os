import SwiftUI

struct ProjectDetailView: View {
    @EnvironmentObject var appState: AppState
    let project: Project
    @State private var selectedTab: ProjectTab = .overview
    @State private var commits: [GitCommit] = []

    enum ProjectTab: String, CaseIterable {
        case overview = "Overview"
        case commits = "Commits"
        case marketing = "Marketing"
    }

    var body: some View {
        VStack(spacing: 0) {
            // Tab bar
            HStack(spacing: 0) {
                ForEach(ProjectTab.allCases, id: \.self) { tab in
                    let isActive = selectedTab == tab
                    Button {
                        selectedTab = tab
                    } label: {
                        Text(tab.rawValue)
                            .font(.system(size: 11, weight: .medium, design: .monospaced))
                            .foregroundColor(isActive ? Theme.accent : Theme.textSecondary)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(isActive ? Theme.accent.opacity(0.1) : Color.clear)
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
            .background(Theme.surface)
            Divider().background(Theme.border)

            // Tab content
            ScrollView {
                switch selectedTab {
                case .overview:
                    overviewContent
                case .commits:
                    commitsContent
                case .marketing:
                    marketingContent
                }
            }
        }
        .background(Theme.background)
        .task { await loadDataAsync() }
    }

    // MARK: - Overview

    private var overviewContent: some View {
        VStack(spacing: 16) {
            // Project header
            TerminalPanel(title: project.name.lowercased()) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: project.icon)
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: project.accentColor))
                        VStack(alignment: .leading, spacing: 2) {
                            Text(project.name)
                                .font(.system(size: 16, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textPrimary)
                            Text(project.description)
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textSecondary)
                        }
                        Spacer()
                        HStack(spacing: 4) {
                            StatusDot(color: Color(hex: project.status.color))
                            Text(project.status.rawValue)
                                .font(.system(size: 10, weight: .medium, design: .monospaced))
                                .foregroundColor(Theme.textSecondary)
                        }
                    }

                    Divider().background(Theme.border)

                    HStack(spacing: 16) {
                        statItem("Path", project.path)
                        statItem("Commits", "\(project.recentCommits)")
                        statItem("LOC", "\(project.totalLOC)")
                        statItem("Routes", "\(project.routeCount)")
                    }
                }
            }

            // Stats grid
            HStack(spacing: 12) {
                StatCard(title: "Commits", value: "\(project.recentCommits)", color: Color(hex: "#4A9EFF"))
                StatCard(title: "LOC", value: "\(project.totalLOC)", color: Theme.accent)
                StatCard(title: "Routes", value: "\(project.routeCount)", color: Color(hex: "#FFD700"))
                if let score = project.score {
                    StatCard(title: "Score", value: "\(score)", color: Color(hex: "#FF6719"))
                }
            }
        }
        .padding(16)
    }

    // MARK: - Commits

    private var commitsContent: some View {
        VStack(alignment: .leading, spacing: 8) {
            if commits.isEmpty {
                Text("No commits found for this project")
                    .font(Theme.monoSmall)
                    .foregroundColor(Theme.textMuted)
                    .frame(maxWidth: .infinity, minHeight: 100)
            } else {
                ForEach(commits) { commit in
                    HStack(spacing: 10) {
                        Text(commit.shortHash)
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Color(hex: "#4A9EFF"))
                        Text(commit.relativeDate)
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                            .frame(width: 50)
                        Text(commit.message)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textPrimary)
                            .lineLimit(1)
                        Spacer()
                        if commit.insertions > 0 {
                            Text("+\(commit.insertions)")
                                .font(.system(size: 9, design: .monospaced))
                                .foregroundColor(Theme.accent)
                        }
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Theme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 3))
                }
            }
        }
        .padding(16)
    }

    // MARK: - Marketing

    private var marketingContent: some View {
        VStack(alignment: .leading, spacing: 12) {
            if !project.campaigns.isEmpty {
                TerminalPanel(title: "campaigns (\(project.campaigns.count))") {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(project.campaigns, id: \.path) { item in
                            HStack(spacing: 8) {
                                Image(systemName: "megaphone.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "#FF6719"))
                                Text(item.name.replacingOccurrences(of: ".md", with: ""))
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textPrimary)
                            }
                        }
                    }
                }
            }

            if !project.strategyDocs.isEmpty {
                TerminalPanel(title: "strategy docs (\(project.strategyDocs.count))") {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(project.strategyDocs, id: \.path) { item in
                            HStack(spacing: 8) {
                                Image(systemName: "doc.text")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "#4A9EFF"))
                                Text(item.name.replacingOccurrences(of: ".md", with: ""))
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textPrimary)
                            }
                        }
                    }
                }
            }

            if project.campaigns.isEmpty && project.strategyDocs.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "megaphone")
                        .font(.system(size: 32))
                        .foregroundColor(Theme.textMuted)
                    Text("No marketing assets linked")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity, minHeight: 100)
            }
        }
        .padding(16)
    }

    // MARK: - Helpers

    private func statItem(_ label: String, _ value: String) -> some View {
        VStack(spacing: 2) {
            Text(label.uppercased())
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 11, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
        }
    }

    private func loadDataAsync() async {
        let store = appState.gitStore
        let path = project.path
        let result = await Task.detached {
            let allCommits = store.loadCommits(limit: 200)
            return allCommits.filter { commit in
                commit.files.contains { $0.path.hasPrefix(path) }
            }
        }.value
        commits = result
    }
}

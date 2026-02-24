import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject var appState: AppState
    @State private var projects: [Project] = []
    @State private var selectedProject: Project?
    @State private var isLoading = true

    var body: some View {
        VStack(spacing: 0) {
            if let project = selectedProject {
                // Drill-down
                HStack {
                    Button {
                        withAnimation { selectedProject = nil }
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "chevron.left")
                                .font(.system(size: 11))
                            Text("Projects")
                                .font(.system(size: 12, weight: .medium, design: .monospaced))
                        }
                        .foregroundColor(Theme.accent)
                    }
                    .buttonStyle(.plain)
                    .padding(.leading, 16)
                    .padding(.vertical, 8)
                    Spacer()
                }
                .background(Theme.surface)
                Divider().background(Theme.border)

                ProjectDetailView(project: project)
            } else if isLoading {
                Spacer()
                VStack(spacing: 12) {
                    ProgressView()
                    Text("Loading projects...")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                }
                Spacer()
            } else {
                // Grid view
                ScrollView {
                    VStack(spacing: 16) {
                        HStack {
                            Text("PROJECTS")
                                .font(.system(size: 12, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                            Spacer()
                            Text("\(projects.count) apps")
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textSecondary)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 16)

                        LazyVGrid(columns: [
                            GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()),
                        ], spacing: 12) {
                            ForEach(projects) { project in
                                projectCard(project)
                                    .onTapGesture {
                                        withAnimation(.easeInOut(duration: 0.15)) {
                                            selectedProject = project
                                        }
                                    }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)
                    }
                }
            }
        }
        .background(Theme.background)
        .navigationTitle("Projects")
        .task { await loadProjectsAsync() }
    }

    private func projectCard(_ project: Project) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            // Header
            HStack {
                Image(systemName: project.icon)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: project.accentColor))
                Text(project.name)
                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.textPrimary)
                    .lineLimit(1)
                Spacer()
            }

            // Status badge
            HStack(spacing: 6) {
                StatusDot(color: Color(hex: project.status.color))
                Text(project.status.rawValue)
                    .font(.system(size: 9, weight: .medium, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)
            }

            // Description
            Text(project.description)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(Theme.textMuted)
                .lineLimit(2)

            Divider().background(Theme.border)

            // Stats
            HStack(spacing: 0) {
                miniStat("Commits", "\(project.recentCommits)")
                miniStat("LOC", formatLOC(project.totalLOC))
                miniStat("Routes", "\(project.routeCount)")
            }

            if let score = project.score {
                HStack {
                    Text("Score: \(score)")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.accent)
                    Spacer()
                }
            }
        }
        .padding(12)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Theme.border, lineWidth: 1)
        )
    }

    private func miniStat(_ label: String, _ value: String) -> some View {
        VStack(spacing: 1) {
            Text(label.uppercased())
                .font(.system(size: 7, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
        }
        .frame(maxWidth: .infinity)
    }

    private func formatLOC(_ loc: Int) -> String {
        if loc >= 1000 {
            return String(format: "%.1fk", Double(loc) / 1000.0)
        }
        return "\(loc)"
    }

    private func loadProjectsAsync() async {
        let gitStore = appState.gitStore
        let fileStore = appState.fileStore

        let result: [Project] = await Task.detached {
            let webStats = fileStore.loadWebsiteStats()
            let sites = webStats?.sites ?? [:]
            let allMarOps = fileStore.marOpsFiles()
            let campaigns = allMarOps.filter { $0.path.contains("campaign") }
            let strategyDocs = allMarOps.filter { $0.path.contains("strategy") }

            func make(_ name: String, _ path: String, _ desc: String, _ icon: String,
                      _ color: String, _ siteKey: String?, _ status: Project.ProjectStatus,
                      _ camp: [(name: String, path: String)], _ strat: [(name: String, path: String)]) -> Project {
                let siteStats = siteKey.flatMap { sites[$0] }
                return Project(
                    name: name, path: path, description: desc, icon: icon, accentColor: color,
                    recentCommits: gitStore.commitCountForPath(path),
                    totalLOC: siteStats?.totalLOC ?? 0,
                    routeCount: siteStats?.routes ?? 0,
                    score: siteStats?.score,
                    status: status, campaigns: camp, strategyDocs: strat
                )
            }

            return [
                make("Nio Chat", "website/apps/nio-chat", "AI assistant chat interface with DNA evolution",
                     "bubble.left.and.bubble.right.fill", "#4EC373", "nio-chat", .active, campaigns, strategyDocs),
                make("ShawnOS.ai", "website/apps/shawnos", "Personal portfolio & AI operating system showcase",
                     "desktopcomputer", "#4A9EFF", "shawnos", .active, [], []),
                make("TheGTMOS.ai", "website/apps/gtmos", "GTM operating system for go-to-market strategy",
                     "chart.line.uptrend.xyaxis", "#FF6719", "gtmos", .active, [], []),
                make("TheContentOS.ai", "website/apps/contentos", "Content operating system for creation pipelines",
                     "doc.richtext", "#FFD700", "contentos", .active, [], []),
                make("Mission Control", "website/apps/mission-control", "Internal dashboard for monitoring & ops",
                     "gauge.with.dots.needle.33percent", "#FF4444", nil, .development, [], []),
                make("Video", "website/apps/video", "Remotion video generation for content distribution",
                     "film", "#EE1D52", nil, .development, [], []),
            ]
        }.value

        projects = result
        isLoading = false
    }
}

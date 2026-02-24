import SwiftUI

enum NioTab: String, CaseIterable, Identifiable {
    case soul, crons, skills, ipRegistry, plans
    var id: String { rawValue }

    var title: String {
        switch self {
        case .soul: return "Soul Files"
        case .crons: return "Nio Cron Jobs"
        case .skills: return "Skills"
        case .ipRegistry: return "IP Registry"
        case .plans: return "Plans"
        }
    }

    var icon: String {
        switch self {
        case .soul: return "brain"
        case .crons: return "clock.arrow.2.circlepath"
        case .skills: return "bolt.fill"
        case .ipRegistry: return "lock.shield"
        case .plans: return "doc.text.magnifyingglass"
        }
    }
}

struct NioConsoleView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedTab: NioTab = .soul

    var body: some View {
        VStack(spacing: 0) {
            // Tab bar
            HStack(spacing: 0) {
                ForEach(NioTab.allCases) { tab in
                    Button {
                        selectedTab = tab
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: tab.icon)
                                .font(.system(size: 11))
                            Text(tab.title)
                                .font(.system(size: 11, weight: .medium, design: .monospaced))
                        }
                        .foregroundColor(selectedTab == tab ? Theme.accent : Theme.textSecondary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(selectedTab == tab ? Theme.accent.opacity(0.1) : Color.clear)
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
            .background(Theme.surface)

            Divider().background(Theme.border)

            // Tab content
            switch selectedTab {
            case .soul:
                SoulFilesView()
            case .crons:
                CronJobsView()
            case .skills:
                SkillsBrowserView()
            case .ipRegistry:
                IPRegistryView()
            case .plans:
                PlansBrowserView()
            }
        }
        .background(Theme.background)
        .navigationTitle("Nio Console")
    }
}

// MARK: - Soul Files

struct SoulFilesView: View {
    @EnvironmentObject var appState: AppState
    @State private var files: [(name: String, path: String)] = []
    @State private var selectedFile: String?
    @State private var content: String = ""

    var body: some View {
        NavigationSplitView {
            List(files, id: \.path, selection: $selectedFile) { file in
                HStack(spacing: 8) {
                    Image(systemName: "doc.text")
                        .foregroundColor(Theme.accent)
                        .font(.system(size: 12))
                    Text(file.name)
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textPrimary)
                }
                .tag(file.path)
            }
            .listStyle(.plain)
            .frame(minWidth: 200)
        } detail: {
            if selectedFile != nil {
                TerminalPanel(title: files.first { $0.path == selectedFile }?.name ?? "") {
                    MarkdownView(source: content)
                }
                .padding(16)
            } else {
                Text("Select a file")
                    .font(Theme.monoBody)
                    .foregroundColor(Theme.textMuted)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .onAppear { files = appState.fileStore.nioWorkspaceFiles() }
        .onChange(of: selectedFile) { _, path in
            if let path = path {
                content = appState.fileStore.readMarkdown(at: path) ?? "File not found"
            }
        }
    }
}

// MARK: - Cron Jobs

struct CronJobsView: View {
    @EnvironmentObject var appState: AppState
    @State private var jobs: [CronJob] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                HStack {
                    Text("\(jobs.count) NIO CRON JOBS")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    Spacer()
                    let enabled = jobs.filter(\.enabled).count
                    Text("\(enabled) enabled")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.accent)
                }
                .padding(.horizontal, 4)

                ForEach(jobs) { job in
                    cronJobRow(job)
                }
            }
            .padding(16)
        }
        .background(Theme.background)
        .onAppear { jobs = appState.fileStore.loadCronJobs() }
    }

    private func cronJobRow(_ job: CronJob) -> some View {
        HStack(spacing: 12) {
            // Status dot
            StatusDot(color: Color(hex: job.statusColor))

            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(job.name)
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
                    .foregroundColor(job.enabled ? Theme.textPrimary : Theme.textMuted)

                HStack(spacing: 8) {
                    Text(job.scheduleDescription)
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(Theme.textSecondary)

                    if let model = job.payload?.model {
                        Text(model.components(separatedBy: "/").last ?? model)
                            .font(.system(size: 9, design: .monospaced))
                            .foregroundColor(Theme.accent)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(Theme.accent.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 2))
                    }
                }
            }

            Spacer()

            // Status info
            VStack(alignment: .trailing, spacing: 2) {
                Text(job.enabled ? "ENABLED" : "DISABLED")
                    .font(.system(size: 8, weight: .bold, design: .monospaced))
                    .foregroundColor(job.enabled ? Theme.accent : Theme.textMuted)

                Text(job.lastRunFormatted)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)

                if let errors = job.state?.consecutiveErrors, errors > 0 {
                    Text("\(errors) errors")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.statusError)
                }
            }
        }
        .padding(10)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 6))
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .stroke(Theme.border, lineWidth: 1)
        )
    }
}

// MARK: - Skills Browser

struct SkillsBrowserView: View {
    @EnvironmentObject var appState: AppState
    @State private var skills: [SkillItem] = []
    @State private var searchText: String = ""

    var filteredSkills: [SkillItem] {
        guard !searchText.isEmpty else { return skills }
        return skills.filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            ($0.description?.localizedCaseInsensitiveContains(searchText) ?? false) ||
            ($0.category?.localizedCaseInsensitiveContains(searchText) ?? false)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Theme.textMuted)
                    .font(.system(size: 12))
                TextField("Search skills...", text: $searchText)
                    .textFieldStyle(.plain)
                    .font(Theme.monoSmall)
                Spacer()
                Text("\(filteredSkills.count) skills")
                    .font(Theme.monoSmall)
                    .foregroundColor(Theme.textMuted)
            }
            .padding(8)
            .background(Theme.surface)

            Divider().background(Theme.border)

            List(filteredSkills) { skill in
                VStack(alignment: .leading, spacing: 3) {
                    HStack {
                        Text(skill.name)
                            .font(.system(size: 12, weight: .medium, design: .monospaced))
                            .foregroundColor(Theme.textPrimary)
                        if let cat = skill.category {
                            Spacer()
                            Text(cat)
                                .font(.system(size: 9, design: .monospaced))
                                .foregroundColor(Theme.accent)
                                .padding(.horizontal, 4)
                                .padding(.vertical, 1)
                                .background(Theme.accent.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 2))
                        }
                    }
                    if let desc = skill.description {
                        Text(desc)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(Theme.textSecondary)
                            .lineLimit(2)
                    }
                }
                .padding(.vertical, 2)
            }
            .listStyle(.plain)
        }
        .background(Theme.background)
        .onAppear { skills = appState.sqliteStore.allSkills() }
    }
}

// MARK: - IP Registry

struct IPRegistryView: View {
    @EnvironmentObject var appState: AppState
    @State private var content: String = ""

    var body: some View {
        if content.isEmpty {
            ProgressView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .onAppear {
                    content = appState.fileStore.readMarkdown(at: RepoConfig.ipRegistry) ?? "IP_REGISTRY.md not found"
                }
        } else {
            TerminalPanel(title: "IP_REGISTRY.md") {
                MarkdownView(source: content)
            }
            .padding(16)
        }
    }
}

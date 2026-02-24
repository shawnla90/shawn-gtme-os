import SwiftUI

struct CommitTrackerView: View {
    @EnvironmentObject var appState: AppState
    @State private var commits: [GitCommit] = []
    @State private var searchText = ""
    @State private var dateFilter: DateFilter = .all
    @State private var areaFilter: String = ""
    @State private var selectedCommit: GitCommit?
    @State private var totalCount = 0
    @State private var weekCount = 0
    @State private var isLoading = true

    enum DateFilter: String, CaseIterable {
        case today = "Today"
        case thisWeek = "This Week"
        case thisMonth = "This Month"
        case all = "All"
    }

    var filteredCommits: [GitCommit] {
        commits.filter { commit in
            let matchesSearch = searchText.isEmpty ||
                commit.message.localizedCaseInsensitiveContains(searchText) ||
                commit.files.contains { $0.path.localizedCaseInsensitiveContains(searchText) }

            let matchesDate: Bool = {
                switch dateFilter {
                case .today:
                    return Calendar.current.isDateInToday(commit.date)
                case .thisWeek:
                    return Calendar.current.isDate(commit.date, equalTo: Date(), toGranularity: .weekOfYear)
                case .thisMonth:
                    return Calendar.current.isDate(commit.date, equalTo: Date(), toGranularity: .month)
                case .all:
                    return true
                }
            }()

            let matchesArea = areaFilter.isEmpty || commit.area == areaFilter

            return matchesSearch && matchesDate && matchesArea
        }
    }

    var areaOptions: [String] {
        let areas = Set(commits.map(\.area))
        return areas.sorted()
    }

    var body: some View {
        VStack(spacing: 0) {
            if isLoading {
                Spacer()
                VStack(spacing: 12) {
                    ProgressView()
                        .scaleEffect(1.2)
                    Text("Loading git history...")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                }
                Spacer()
            } else {
                // Stats header
                statsHeader
                    .padding(16)

                Divider().background(Theme.border)

                // Filters
                filterBar
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)

                Divider().background(Theme.border)

                // Commit list
                if selectedCommit != nil {
                    HStack(spacing: 0) {
                        commitList
                            .frame(maxWidth: .infinity)
                        Divider().background(Theme.border)
                        if let commit = selectedCommit {
                            CommitDetailView(commit: commit)
                                .frame(maxWidth: .infinity)
                        }
                    }
                } else {
                    commitList
                }
            }
        }
        .background(Theme.background)
        .navigationTitle("Commits")
        .task { await loadDataAsync() }
    }

    // MARK: - Stats Header

    private var statsHeader: some View {
        HStack(spacing: 12) {
            StatCard(
                title: "Total Commits",
                value: "\(totalCount)",
                color: Theme.accent
            )
            StatCard(
                title: "This Week",
                value: "\(weekCount)",
                color: Color(hex: "#4A9EFF")
            )
            StatCard(
                title: "Showing",
                value: "\(filteredCommits.count)",
                subtitle: "of \(commits.count) loaded",
                color: Color(hex: "#FFD700")
            )

            if !commits.isEmpty {
                let topAreas = appState.gitStore.topAreas(from: Array(commits.prefix(50)))
                StatCard(
                    title: "Top Area",
                    value: topAreas.first?.area ?? "-",
                    subtitle: "\(topAreas.first?.count ?? 0) files",
                    color: Color(hex: "#FF6719")
                )
            }
        }
    }

    // MARK: - Filter Bar

    private var filterBar: some View {
        HStack(spacing: 8) {
            // Search
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Theme.textMuted)
                    .font(.system(size: 11))
                TextField("Search commits...", text: $searchText)
                    .textFieldStyle(.plain)
                    .font(Theme.monoSmall)
            }
            .padding(6)
            .background(Theme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 4))
            .frame(maxWidth: 250)

            // Date filter chips
            ForEach(DateFilter.allCases, id: \.self) { filter in
                Button {
                    dateFilter = filter
                } label: {
                    Text(filter.rawValue)
                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                        .foregroundColor(dateFilter == filter ? Theme.accent : Theme.textSecondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(dateFilter == filter ? Theme.accent.opacity(0.1) : Color.clear)
                        .clipShape(RoundedRectangle(cornerRadius: 3))
                }
                .buttonStyle(.plain)
            }

            Spacer()

            // Area filter
            if !areaOptions.isEmpty {
                Picker("Area", selection: $areaFilter) {
                    Text("All Areas").tag("")
                    ForEach(areaOptions, id: \.self) { area in
                        Text(area).tag(area)
                    }
                }
                .pickerStyle(.menu)
                .font(Theme.monoSmall)
            }
        }
    }

    // MARK: - Commit List

    private var commitList: some View {
        ScrollView {
            LazyVStack(spacing: 2) {
                ForEach(filteredCommits) { commit in
                    commitRow(commit)
                        .onTapGesture {
                            withAnimation(.easeInOut(duration: 0.15)) {
                                if selectedCommit?.hash == commit.hash {
                                    selectedCommit = nil
                                } else {
                                    selectedCommit = commit
                                }
                            }
                        }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
    }

    private func commitRow(_ commit: GitCommit) -> some View {
        HStack(spacing: 10) {
            // Hash
            Text(commit.shortHash)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(Color(hex: "#4A9EFF"))
                .frame(width: 55, alignment: .leading)

            // Date
            Text(commit.relativeDate)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(Theme.textMuted)
                .frame(width: 50, alignment: .leading)

            // Message
            Text(commit.message)
                .font(Theme.monoSmall)
                .foregroundColor(Theme.textPrimary)
                .lineLimit(1)

            Spacer()

            // Files changed
            Text("\(commit.filesChanged)F")
                .font(.system(size: 9, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textSecondary)

            // Insertions
            if commit.insertions > 0 {
                Text("+\(commit.insertions)")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.accent)
            }

            // Deletions
            if commit.deletions > 0 {
                Text("-\(commit.deletions)")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.statusError)
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(selectedCommit?.hash == commit.hash ? Theme.accent.opacity(0.1) : Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 4))
        .overlay(
            RoundedRectangle(cornerRadius: 4)
                .stroke(selectedCommit?.hash == commit.hash ? Theme.accent.opacity(0.3) : Theme.border, lineWidth: 1)
        )
    }

    // MARK: - Data Loading

    private func loadDataAsync() async {
        let store = appState.gitStore
        let result = await Task.detached {
            let c = store.loadCommits(limit: 200)
            let total = store.commitCount()
            let week = store.commitsThisWeek()
            return (c, total, week)
        }.value
        commits = result.0
        totalCount = result.1
        weekCount = result.2
        isLoading = false
    }
}

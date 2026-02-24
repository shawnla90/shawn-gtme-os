import SwiftUI

struct DailyOpsView: View {
    @EnvironmentObject var appState: AppState
    @State private var dailyLog: DailyLog?
    @State private var profile: ProgressionProfile?
    @State private var availableDates: [String] = []
    @State private var selectedDate: String = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Date picker
                dateSelector
                    .padding(.horizontal, 16)
                    .padding(.top, 16)

                if let log = dailyLog {
                    // Scorecard
                    scorecardSection(log)
                        .padding(.horizontal, 16)

                    // Progression
                    if let profile = profile {
                        progressionSection(profile)
                            .padding(.horizontal, 16)
                    }

                    // Accomplishments
                    accomplishmentsSection(log)
                        .padding(.horizontal, 16)

                    // Recent Files
                    RecentFilesView()
                        .padding(.horizontal, 16)

                    // Commits
                    commitsSection(log)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)
                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "chart.bar.fill")
                            .font(.system(size: 48))
                            .foregroundColor(Theme.textMuted)
                        Text("No daily log available")
                            .font(Theme.monoBody)
                            .foregroundColor(Theme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, minHeight: 300)
                }
            }
        }
        .background(Theme.background)
        .navigationTitle("Daily Ops")
        .onAppear { loadData() }
    }

    private var dateSelector: some View {
        HStack {
            Text("DATE")
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)

            Picker("", selection: $selectedDate) {
                ForEach(availableDates, id: \.self) { date in
                    Text(date).tag(date)
                }
            }
            .pickerStyle(.menu)
            .onChange(of: selectedDate) { _, newDate in
                dailyLog = appState.fileStore.loadDailyLog(date: newDate)
            }

            Spacer()

            if let stats = dailyLog?.stats, let grade = stats.letterGrade {
                GradeBadge(grade: grade, size: 36)
            }
        }
    }

    private func scorecardSection(_ log: DailyLog) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("SCORECARD")
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)

            LazyVGrid(columns: [
                GridItem(.flexible()), GridItem(.flexible()),
                GridItem(.flexible()), GridItem(.flexible()),
            ], spacing: 8) {
                StatCard(
                    title: "Output Score",
                    value: "\(log.stats?.outputScore ?? 0)",
                    color: Theme.accent
                )
                StatCard(
                    title: "Words",
                    value: formatNumber(log.stats?.wordsToday ?? 0),
                    color: Color(hex: "#4A9EFF")
                )
                StatCard(
                    title: "Shipped",
                    value: "\(log.stats?.shippedCount ?? 0)",
                    subtitle: "\(log.stats?.draftCount ?? 0) drafts",
                    color: Theme.accent
                )
                StatCard(
                    title: "Commits",
                    value: "\(log.stats?.commitsToday ?? log.commits.count)",
                    subtitle: "\(log.stats?.linesNet ?? 0) net lines",
                    color: Color(hex: "#FFD700")
                )
            }

            if let cost = log.cost {
                HStack(spacing: 16) {
                    StatCard(
                        title: "Cost",
                        value: String(format: "$%.2f", cost.actualCost ?? 0),
                        subtitle: cost.pricingMode ?? "",
                        color: Theme.textSecondary
                    )
                    if let dev = log.devEquivalent {
                        StatCard(
                            title: "Dev Equivalent",
                            value: String(format: "%.0f days", dev.devDays ?? 0),
                            subtitle: "$\(dev.costEstimate ?? 0) value",
                            color: Theme.accent
                        )
                    }
                }
            }
        }
    }

    private func progressionSection(_ profile: ProgressionProfile) -> some View {
        TerminalPanel(title: "progression") {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(profile.name)
                            .font(.system(size: 16, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textPrimary)
                        Text(profile.title)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.accent)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("LVL \(profile.level)")
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                            .foregroundColor(Theme.accent)
                        Text("Tier \(profile.avatarTier) \(profile.class)")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textSecondary)
                    }
                }

                // XP Bar
                VStack(alignment: .leading, spacing: 2) {
                    HStack {
                        Text("XP")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                        Spacer()
                        Text("\(profile.xpTotal) / \(profile.xpNextLevel)")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textSecondary)
                    }
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Theme.surfaceElevated)
                                .frame(height: 8)
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Theme.accent)
                                .frame(width: geo.size.width * profile.xpProgress, height: 8)
                        }
                    }
                    .frame(height: 8)
                }

                // Recent milestones
                if let milestones = profile.milestones?.suffix(3) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("RECENT MILESTONES")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                        ForEach(Array(milestones), id: \.id) { milestone in
                            HStack(spacing: 6) {
                                Image(systemName: "trophy.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "#FFD700"))
                                Text(milestone.title)
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textPrimary)
                                Spacer()
                                Text(milestone.description)
                                    .font(.system(size: 10, design: .monospaced))
                                    .foregroundColor(Theme.textMuted)
                            }
                        }
                    }
                }
            }
        }
    }

    private func accomplishmentsSection(_ log: DailyLog) -> some View {
        TerminalPanel(title: "accomplishments (\(log.accomplishments.count))") {
            VStack(alignment: .leading, spacing: 4) {
                ForEach(log.accomplishments) { item in
                    HStack(spacing: 8) {
                        Text(item.shipped == true ? "SHIP" : "DRFT")
                            .font(.system(size: 8, weight: .bold, design: .monospaced))
                            .foregroundColor(item.shipped == true ? .black : Theme.textMuted)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(item.shipped == true ? Theme.accent : Theme.surfaceElevated)
                            .clipShape(RoundedRectangle(cornerRadius: 2))

                        Text(item.title)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textPrimary)
                            .lineLimit(1)

                        Spacer()

                        if let score = item.valueScore {
                            Text("+\(score)")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.accent)
                        }

                        if let words = item.words, words > 0 {
                            Text("\(words)w")
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                        }

                        if let ts = item.timestamp {
                            Text(ts)
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                        }
                    }
                }
            }
        }
    }

    private func commitsSection(_ log: DailyLog) -> some View {
        TerminalPanel(title: "commits (\(log.commits.count))") {
            VStack(alignment: .leading, spacing: 4) {
                ForEach(log.commits) { commit in
                    HStack(spacing: 8) {
                        Text(commit.hash.prefix(7))
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Color(hex: "#4A9EFF"))

                        Text(commit.type)
                            .font(.system(size: 8, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(Theme.surfaceElevated)
                            .clipShape(RoundedRectangle(cornerRadius: 2))

                        Text(commit.message)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textPrimary)
                            .lineLimit(1)

                        Spacer()

                        Text("+\(commit.score)")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.accent)
                    }
                }
            }
        }
    }

    private func loadData() {
        availableDates = appState.fileStore.availableDailyLogDates()
        if let first = availableDates.first {
            selectedDate = first
            dailyLog = appState.fileStore.loadDailyLog(date: first)
        }
        profile = appState.fileStore.loadProfile()
    }

    private func formatNumber(_ n: Int) -> String {
        if n >= 1000 {
            return String(format: "%.1fk", Double(n) / 1000.0)
        }
        return "\(n)"
    }
}

import SwiftUI

struct DailyLevelCard: View {
    @EnvironmentObject var appState: AppState
    @State private var todayLog: DailyLog?
    @State private var recentLogs: [DailyLog] = []
    @State private var streak: Int = 0
    @State private var totalPoints: Int = 0

    var body: some View {
        TerminalPanel(title: "daily leveling") {
            VStack(alignment: .leading, spacing: 12) {
                // Today's grade (big)
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("TODAY")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                        if let grade = todayLog?.stats?.letterGrade {
                            GradeBadge(grade: grade, size: 48)
                        } else {
                            Text("--")
                                .font(.system(size: 32, weight: .black, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 4) {
                        HStack(spacing: 4) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#FF6719"))
                            Text("\(streak) day streak")
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textSecondary)
                        }
                        Text("\(totalPoints) pts total")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textMuted)
                    }
                }

                // Last 7 days trend
                VStack(alignment: .leading, spacing: 4) {
                    Text("LAST 7 DAYS")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)

                    HStack(spacing: 6) {
                        ForEach(Array(recentLogs.suffix(7).enumerated()), id: \.offset) { _, log in
                            VStack(spacing: 2) {
                                Circle()
                                    .fill(Theme.gradeColor(log.stats?.letterGrade ?? "F"))
                                    .frame(width: 12, height: 12)
                                Text(log.stats?.letterGrade ?? "?")
                                    .font(.system(size: 8, weight: .bold, design: .monospaced))
                                    .foregroundColor(Theme.textMuted)
                            }
                        }
                        Spacer()
                    }
                }

                // Progress bar to next grade
                if let score = todayLog?.stats?.outputScore {
                    VStack(alignment: .leading, spacing: 2) {
                        HStack {
                            Text("OUTPUT SCORE")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                            Spacer()
                            Text("\(score)")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.accent)
                        }
                        GeometryReader { geo in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(Theme.surfaceElevated)
                                    .frame(height: 6)
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(Theme.accent)
                                    .frame(width: geo.size.width * min(Double(score) / 100.0, 1.0), height: 6)
                            }
                        }
                        .frame(height: 6)
                    }
                }

                // Quick stats
                if let stats = todayLog?.stats {
                    HStack(spacing: 8) {
                        miniMetric("Words", value: "\(stats.wordsToday ?? 0)")
                        miniMetric("Shipped", value: "\(stats.shippedCount ?? 0)")
                        miniMetric("Commits", value: "\(stats.commitsToday ?? 0)")
                    }
                }
            }
        }
        .onAppear { loadData() }
    }

    private func miniMetric(_ label: String, value: String) -> some View {
        VStack(spacing: 1) {
            Text(label.uppercased())
                .font(.system(size: 7, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 13, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
        }
        .frame(maxWidth: .infinity)
    }

    private func loadData() {
        let dates = appState.fileStore.availableDailyLogDates()
        if let today = dates.first {
            todayLog = appState.fileStore.loadDailyLog(date: today)
        }
        // Load recent logs for trend
        for date in dates.prefix(7) {
            if let log = appState.fileStore.loadDailyLog(date: date) {
                recentLogs.append(log)
            }
        }
        recentLogs.reverse() // oldest first for display

        // Calculate streak
        var currentStreak = 0
        for date in dates {
            if let log = appState.fileStore.loadDailyLog(date: date),
               let score = log.stats?.outputScore, score > 0 {
                currentStreak += 1
            } else {
                break
            }
        }
        streak = currentStreak

        // Total points
        totalPoints = dates.prefix(30).compactMap { date in
            appState.fileStore.loadDailyLog(date: date)?.stats?.outputScore
        }.reduce(0, +)
    }
}

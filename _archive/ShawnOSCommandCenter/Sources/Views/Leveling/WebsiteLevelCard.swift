import SwiftUI

struct WebsiteLevelCard: View {
    @EnvironmentObject var appState: AppState
    @State private var profile: ProgressionProfile?
    @State private var webStats: WebsiteStats?

    var body: some View {
        TerminalPanel(title: "website leveling") {
            VStack(alignment: .leading, spacing: 12) {
                if let profile = profile {
                    // Level + Title
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("LEVEL")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                            Text("\(profile.level)")
                                .font(.system(size: 36, weight: .black, design: .monospaced))
                                .foregroundColor(Theme.accent)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text(profile.title)
                                .font(.system(size: 12, weight: .medium, design: .monospaced))
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
                            Text("(\(Int(profile.xpProgress * 100))%)")
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(Theme.accent)
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

                    // Milestones
                    if let milestones = profile.milestones {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("MILESTONES (\(milestones.count) unlocked)")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textMuted)

                            ForEach(Array(milestones.suffix(4)), id: \.id) { milestone in
                                HStack(spacing: 6) {
                                    Image(systemName: "trophy.fill")
                                        .font(.system(size: 9))
                                        .foregroundColor(Color(hex: "#FFD700"))
                                    Text(milestone.title)
                                        .font(.system(size: 10, design: .monospaced))
                                        .foregroundColor(Theme.textPrimary)
                                        .lineLimit(1)
                                    Spacer()
                                }
                            }
                        }
                    }

                    // Website grade
                    if let grade = webStats?.grade {
                        HStack {
                            Text("SITE GRADE")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                            Spacer()
                            GradeBadge(grade: grade, size: 24)
                            if let score = webStats?.totalScore {
                                Text("\(score) pts")
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textSecondary)
                            }
                        }
                    }
                } else {
                    VStack(spacing: 8) {
                        Image(systemName: "globe")
                            .font(.system(size: 32))
                            .foregroundColor(Theme.textMuted)
                        Text("No progression data")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, minHeight: 100)
                }
            }
        }
        .onAppear { loadData() }
    }

    private func loadData() {
        profile = appState.fileStore.loadProfile()
        webStats = appState.fileStore.loadWebsiteStats()
    }
}

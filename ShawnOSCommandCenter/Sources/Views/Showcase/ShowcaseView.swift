import SwiftUI

struct ShowcaseView: View {
    @EnvironmentObject var appState: AppState
    @State private var webStats: WebsiteStats?
    @State private var profile: ProgressionProfile?
    @State private var dna: NioDNA = .empty
    @State private var commitCount = 0
    @State private var skillCount = 0
    @State private var cronJobs: [CronJob] = []
    @State private var ipContent: String = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                heroSection
                systemOverview
                ipHighlights
                nioIdentity
                techStack
                architectureDiagram
            }
            .padding(24)
        }
        .background(Theme.background)
        .navigationTitle("Showcase")
        .onAppear { loadData() }
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(spacing: 12) {
            Text("ShawnOS")
                .font(.system(size: 36, weight: .black, design: .monospaced))
                .foregroundColor(Theme.accent)

            Text("An AI Operating System")
                .font(.system(size: 18, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textPrimary)

            Text("One human. One AI. Building the future of solo engineering.")
                .font(.system(size: 13, design: .monospaced))
                .foregroundColor(Theme.textSecondary)
                .multilineTextAlignment(.center)

            // Key stats
            HStack(spacing: 20) {
                heroStat("\(webStats?.sites?.count ?? 3)", "Websites")
                heroStat("\(skillCount)", "Skills")
                heroStat("\(cronJobs.filter(\.enabled).count)", "Cron Jobs")
                heroStat("\(commitCount)", "Commits")
                heroStat("LVL \(profile?.level ?? 0)", "Progression")
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Theme.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Theme.accent.opacity(0.3), lineWidth: 1)
                )
        )
    }

    private func heroStat(_ value: String, _ label: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 22, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.accent)
            Text(label)
                .font(.system(size: 10, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textMuted)
        }
    }

    // MARK: - System Overview

    private var systemOverview: some View {
        TerminalPanel(title: "system overview") {
            VStack(alignment: .leading, spacing: 12) {
                // Websites
                VStack(alignment: .leading, spacing: 6) {
                    Text("WEBSITES")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)

                    if let sites = webStats?.sites {
                        ForEach(Array(sites.keys.sorted()), id: \.self) { key in
                            if let site = sites[key] {
                                HStack(spacing: 8) {
                                    StatusDot(color: Theme.accent)
                                    Text(site.name)
                                        .font(.system(size: 12, weight: .medium, design: .monospaced))
                                        .foregroundColor(Theme.textPrimary)
                                    Spacer()
                                    if let grade = site.grade {
                                        GradeBadge(grade: grade, size: 20)
                                    }
                                    Text("\(site.totalLOC) LOC")
                                        .font(.system(size: 10, design: .monospaced))
                                        .foregroundColor(Theme.textSecondary)
                                    Text("\(site.routes ?? 0) routes")
                                        .font(.system(size: 10, design: .monospaced))
                                        .foregroundColor(Theme.textMuted)
                                }
                            }
                        }
                    }
                }

                Divider().background(Theme.border)

                // Infrastructure
                if let infra = webStats?.infra {
                    HStack(spacing: 16) {
                        miniLabel("Total LOC", "\(infra.totalLoc ?? 0)")
                        miniLabel("Vercel Sites", "\(infra.vercelSites ?? 0)")
                        miniLabel("Languages", "\(infra.languages?.count ?? 0)")
                        miniLabel("Monorepo", infra.monorepo == true ? "Yes" : "No")
                    }
                }
            }
        }
    }

    // MARK: - IP Highlights

    private var ipHighlights: some View {
        TerminalPanel(title: "ip highlights") {
            VStack(alignment: .leading, spacing: 8) {
                let tiers = parseIPTiers()
                ForEach(tiers, id: \.tier) { item in
                    HStack(spacing: 8) {
                        Text("TIER \(item.tier)")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(tierDisplayColor(item.tier))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(tierDisplayColor(item.tier).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 3))

                        Text(item.label)
                            .font(.system(size: 10, weight: .medium, design: .monospaced))
                            .foregroundColor(Theme.textSecondary)

                        Spacer()

                        Text("\(item.count) items")
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                    }
                }
            }
        }
    }

    // MARK: - Nio Identity

    private var nioIdentity: some View {
        TerminalPanel(title: "nio identity") {
            HStack(spacing: 16) {
                // Avatar area
                VStack(spacing: 4) {
                    Image(systemName: "brain.head.profile")
                        .font(.system(size: 36))
                        .foregroundColor(nioTierColor)
                    Text("Tier \(dna.tier)")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(nioTierColor)
                    Text(dna.tierName)
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textPrimary)
                }
                .frame(width: 80)

                // Stats
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text("\(dna.xp) XP")
                            .font(.system(size: 16, weight: .bold, design: .monospaced))
                            .foregroundColor(nioTierColor)
                        Text("Level \(dna.level)")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textSecondary)
                    }

                    HStack(spacing: 12) {
                        miniLabel("Messages", "\(dna.totalMessages)")
                        miniLabel("Streak", "\(dna.streak)d")
                        miniLabel("Skills", "\(dna.skillXP.count)")
                    }

                    // Skill breakdown
                    HStack(spacing: 8) {
                        ForEach(Array(dna.skillXP.sorted(by: { $0.value > $1.value })), id: \.key) { skill, xp in
                            HStack(spacing: 3) {
                                Text(skill)
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundColor(Theme.textMuted)
                                Text("\(xp)")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(Theme.textSecondary)
                            }
                        }
                    }
                }
            }
        }
    }

    // MARK: - Tech Stack

    private var techStack: some View {
        TerminalPanel(title: "tech stack") {
            LazyVGrid(columns: [
                GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()),
            ], spacing: 8) {
                techBadge("SwiftUI", "macOS app", "#FF6719")
                techBadge("Next.js", "3 websites", "#FFFFFF")
                techBadge("SQLite/GRDB", "data layer", "#4A9EFF")
                techBadge("Claude API", "AI backbone", "#FFD700")
                techBadge("Remotion", "video gen", "#EE1D52")
                techBadge("Turborepo", "monorepo", "#4EC373")
            }
        }
    }

    private func techBadge(_ name: String, _ desc: String, _ color: String) -> some View {
        VStack(spacing: 4) {
            Text(name)
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .foregroundColor(Color(hex: color))
            Text(desc)
                .font(.system(size: 9, design: .monospaced))
                .foregroundColor(Theme.textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(10)
        .background(Theme.surfaceElevated)
        .clipShape(RoundedRectangle(cornerRadius: 6))
    }

    // MARK: - Architecture Diagram

    private var architectureDiagram: some View {
        TerminalPanel(title: "architecture") {
            VStack(alignment: .leading, spacing: 4) {
                diagramLine("                    [ShawnOS Command Center]")
                diagramLine("                           |")
                diagramLine("        +------------------+------------------+")
                diagramLine("        |                  |                  |")
                diagramLine("   [Git Store]      [SQLite Store]    [NioBot Store]")
                diagramLine("        |                  |                  |")
                diagramLine("   git log/diff       index.db           niobot.db")
                diagramLine("        |                  |                  |")
                diagramLine("  +-----+-----+    +------+------+    +------+------+")
                diagramLine("  |     |     |    |      |      |    |      |      |")
                diagramLine(" web  data  content skills assets  content  dna   evolution")
                diagramLine("  |                                          |")
                diagramLine("  +--- shawnos.ai                  Claude Sonnet 4 API")
                diagramLine("  +--- thegtmos.ai                         |")
                diagramLine("  +--- thecontentos.ai              Nio Chat PWA")
                diagramLine("  +--- nio-chat")
            }
        }
    }

    private func diagramLine(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 10, design: .monospaced))
            .foregroundColor(Theme.textSecondary)
    }

    // MARK: - Helpers

    private func miniLabel(_ label: String, _ value: String) -> some View {
        VStack(spacing: 1) {
            Text(label.uppercased())
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
        }
    }

    private var nioTierColor: Color {
        switch dna.tier {
        case 1: return Color(hex: "#4EC373")
        case 2: return Color(hex: "#4A9EFF")
        case 3: return Color(hex: "#FFD700")
        case 4: return Color(hex: "#FF6719")
        default: return Theme.accent
        }
    }

    private func tierDisplayColor(_ tier: Int) -> Color {
        switch tier {
        case 1: return Color(hex: "#4EC373")
        case 2: return Color(hex: "#4A9EFF")
        case 3: return Color(hex: "#FFD700")
        case 4: return Color(hex: "#FF6719")
        default: return Theme.textSecondary
        }
    }

    struct IPTierItem {
        let tier: Int
        let label: String
        let count: Int
    }

    private func parseIPTiers() -> [IPTierItem] {
        // Parse IP_REGISTRY.md for tier counts
        guard !ipContent.isEmpty else {
            return [
                IPTierItem(tier: 1, label: "Core Frameworks", count: 0),
                IPTierItem(tier: 2, label: "Systems & Tools", count: 0),
                IPTierItem(tier: 3, label: "Content & Strategy", count: 0),
                IPTierItem(tier: 4, label: "Concepts & Ideas", count: 0),
            ]
        }

        var tiers: [IPTierItem] = []
        let lines = ipContent.components(separatedBy: "\n")
        var currentTier = 0
        var currentLabel = ""
        var currentCount = 0

        for line in lines {
            if line.contains("## Tier") || line.contains("## TIER") {
                if currentTier > 0 {
                    tiers.append(IPTierItem(tier: currentTier, label: currentLabel, count: currentCount))
                }
                currentTier += 1
                currentLabel = line
                    .replacingOccurrences(of: "#", with: "")
                    .replacingOccurrences(of: "Tier \(currentTier)", with: "")
                    .replacingOccurrences(of: "TIER \(currentTier)", with: "")
                    .trimmingCharacters(in: CharacterSet.whitespaces.union(CharacterSet(charactersIn: "—-:")))
                currentCount = 0
            } else if line.hasPrefix("- ") || line.hasPrefix("* ") {
                currentCount += 1
            }
        }
        if currentTier > 0 {
            tiers.append(IPTierItem(tier: currentTier, label: currentLabel, count: currentCount))
        }

        return tiers.isEmpty ? [
            IPTierItem(tier: 1, label: "Core Frameworks", count: 0),
            IPTierItem(tier: 2, label: "Systems & Tools", count: 0),
            IPTierItem(tier: 3, label: "Content & Strategy", count: 0),
            IPTierItem(tier: 4, label: "Concepts & Ideas", count: 0),
        ] : tiers
    }

    // MARK: - Data Loading

    private func loadData() {
        webStats = appState.fileStore.loadWebsiteStats()
        profile = appState.fileStore.loadProfile()
        dna = appState.nioBotStore.loadDNAState()
        commitCount = appState.gitStore.commitCount()
        skillCount = appState.sqliteStore.allSkills().count
        cronJobs = appState.fileStore.loadCronJobs()
        ipContent = appState.fileStore.readMarkdown(at: RepoConfig.ipRegistry) ?? ""
    }
}

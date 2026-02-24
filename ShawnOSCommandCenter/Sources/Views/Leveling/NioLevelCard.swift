import SwiftUI

struct NioLevelCard: View {
    @EnvironmentObject var appState: AppState
    @State private var dna: NioDNA = .empty

    private let skillOrder = ["ops", "architecture", "writing"]

    var body: some View {
        TerminalPanel(title: "nio leveling") {
            VStack(alignment: .leading, spacing: 12) {
                // Tier + XP
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("TIER \(dna.tier)")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                        Text(dna.tierName)
                            .font(.system(size: 28, weight: .black, design: .monospaced))
                            .foregroundColor(tierColor)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(dna.xp) XP")
                            .font(.system(size: 18, weight: .bold, design: .monospaced))
                            .foregroundColor(tierColor)
                        Text("Level \(dna.level)/50")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textSecondary)
                    }
                }

                // Skill bars
                VStack(alignment: .leading, spacing: 6) {
                    Text("SKILLS")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)

                    ForEach(skillOrder, id: \.self) { skill in
                        let xp = dna.skillXP[skill] ?? 0
                        skillBar(skill: skill, xp: xp)
                    }
                }

                // Streak
                HStack {
                    Image(systemName: "flame.fill")
                        .font(.system(size: 12))
                        .foregroundColor(dna.streak > 0 ? Color(hex: "#FF6719") : Theme.textMuted)
                    Text("\(dna.streak) day streak")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                    Spacer()
                    Text("\(dna.totalMessages) msgs")
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                }

                // XP to next tier
                VStack(alignment: .leading, spacing: 2) {
                    HStack {
                        Text("NEXT: \(dna.nextTierName.uppercased())")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                        Spacer()
                        Text("\(dna.xpToNextTier) XP to go")
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(Theme.textSecondary)
                    }
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Theme.surfaceElevated)
                                .frame(height: 6)
                            RoundedRectangle(cornerRadius: 3)
                                .fill(tierColor)
                                .frame(width: geo.size.width * dna.tierProgress, height: 6)
                        }
                    }
                    .frame(height: 6)
                }
            }
        }
        .onAppear { loadData() }
    }

    private var tierColor: Color {
        switch dna.tier {
        case 1: return Color(hex: "#4EC373")
        case 2: return Color(hex: "#4A9EFF")
        case 3: return Color(hex: "#FFD700")
        case 4: return Color(hex: "#FF6719")
        case 5: return Color(hex: "#FF4444")
        default: return Theme.accent
        }
    }

    private func skillBar(skill: String, xp: Int) -> some View {
        HStack(spacing: 8) {
            Text(skill.uppercased())
                .font(.system(size: 9, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textSecondary)
                .frame(width: 80, alignment: .leading)

            GeometryReader { geo in
                let maxXP = max(Double(dna.skillXP.values.max() ?? 1), 1)
                let progress = Double(xp) / maxXP
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(Theme.surfaceElevated)
                        .frame(height: 6)
                    RoundedRectangle(cornerRadius: 2)
                        .fill(skillColor(skill))
                        .frame(width: geo.size.width * progress, height: 6)
                }
            }
            .frame(height: 6)

            Text("\(xp)")
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
                .frame(width: 35, alignment: .trailing)
        }
    }

    private func skillColor(_ skill: String) -> Color {
        switch skill {
        case "ops": return Color(hex: "#4EC373")
        case "architecture": return Color(hex: "#4A9EFF")
        case "writing": return Color(hex: "#FF6719")
        default: return Theme.accent
        }
    }

    private func loadData() {
        dna = appState.nioBotStore.loadDNAState()
    }
}

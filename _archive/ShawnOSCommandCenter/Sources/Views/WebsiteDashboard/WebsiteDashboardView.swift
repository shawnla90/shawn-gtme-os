import SwiftUI

struct WebsiteDashboardView: View {
    @EnvironmentObject var appState: AppState
    @State private var stats: WebsiteStats?
    @State private var selectedSite: String?

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if let stats = stats {
                    // Overview
                    overviewSection(stats)

                    // Site cards
                    if let sites = stats.sites {
                        siteCardsSection(sites)
                    }

                    // Selected site detail
                    if let key = selectedSite, let site = stats.sites?[key] {
                        siteDetailSection(site)
                    }

                    // Infrastructure
                    if let infra = stats.infra {
                        infraSection(infra)
                    }
                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "globe")
                            .font(.system(size: 48))
                            .foregroundColor(Theme.textMuted)
                        Text("Loading website stats...")
                            .font(Theme.monoBody)
                            .foregroundColor(Theme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, minHeight: 300)
                }
            }
            .padding(16)
        }
        .background(Theme.background)
        .navigationTitle("Website Dashboard")
        .onAppear { stats = appState.fileStore.loadWebsiteStats() }
    }

    private func overviewSection(_ stats: WebsiteStats) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("OVERVIEW")
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)

            LazyVGrid(columns: [
                GridItem(.flexible()), GridItem(.flexible()),
                GridItem(.flexible()), GridItem(.flexible()),
            ], spacing: 8) {
                StatCard(
                    title: "Total Score",
                    value: "\(stats.totalScore ?? 0)",
                    color: Theme.accent
                )
                StatCard(
                    title: "Grade",
                    value: stats.grade ?? "—",
                    color: Theme.gradeColor(stats.grade ?? "")
                )
                StatCard(
                    title: "Nio Tier",
                    value: "\(stats.nioTier ?? 0)",
                    subtitle: stats.nioTierName,
                    color: Color(hex: "#FFD700")
                )
                StatCard(
                    title: "Total LOC",
                    value: formatNumber(stats.infra?.totalLoc ?? 0),
                    color: Color(hex: "#4A9EFF")
                )
            }
        }
    }

    private func siteCardsSection(_ sites: [String: SiteStats]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("SITES")
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)

            LazyVGrid(columns: [
                GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()),
            ], spacing: 8) {
                ForEach(sites.sorted(by: { ($0.value.score ?? 0) > ($1.value.score ?? 0) }), id: \.key) { key, site in
                    siteCard(key: key, site: site)
                        .onTapGesture { selectedSite = selectedSite == key ? nil : key }
                }
            }
        }
    }

    private func siteCard(key: String, site: SiteStats) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Circle()
                    .fill(Color(hex: site.accent ?? "#4EC373"))
                    .frame(width: 8, height: 8)
                Text(site.name)
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.textPrimary)
                Spacer()
                if let grade = site.grade {
                    GradeBadge(grade: grade, size: 22)
                }
            }

            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 1) {
                    Text("SCORE")
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    Text("\(site.score ?? 0)")
                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.accent)
                }
                VStack(alignment: .leading, spacing: 1) {
                    Text("ROUTES")
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    Text("\(site.routes ?? 0)")
                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textPrimary)
                }
                VStack(alignment: .leading, spacing: 1) {
                    Text("LOC")
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    Text(formatNumber(site.totalLOC))
                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textPrimary)
                }
            }

            HStack(spacing: 4) {
                Text("\(site.components ?? 0) components")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
                Text("·")
                    .foregroundColor(Theme.textMuted)
                Text("\(site.featureCount ?? 0) features")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
            }
        }
        .padding(12)
        .background(selectedSite == key ? Theme.accent.opacity(0.1) : Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(selectedSite == key ? Theme.accent : Theme.border, lineWidth: 1)
        )
    }

    private func siteDetailSection(_ site: SiteStats) -> some View {
        TerminalPanel(title: site.name.lowercased()) {
            VStack(alignment: .leading, spacing: 8) {
                if let routes = site.routeList, !routes.isEmpty {
                    Text("ROUTES")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    ForEach(routes, id: \.self) { route in
                        Text(route)
                            .font(Theme.monoSmall)
                            .foregroundColor(Color(hex: "#4A9EFF"))
                    }
                }

                if let features = site.features, !features.isEmpty {
                    Divider().background(Theme.border)
                    Text("FEATURES")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    ForEach(features, id: \.self) { feature in
                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 10))
                                .foregroundColor(Theme.accent)
                            Text(feature)
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textPrimary)
                        }
                    }
                }

                if let loc = site.loc, !loc.isEmpty {
                    Divider().background(Theme.border)
                    Text("LOC BY LANGUAGE")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    ForEach(loc.sorted(by: { $0.value > $1.value }), id: \.key) { lang, count in
                        HStack {
                            Text(lang)
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textSecondary)
                            Spacer()
                            Text(formatNumber(count))
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textPrimary)
                        }
                    }
                }
            }
        }
    }

    private func infraSection(_ infra: InfraStats) -> some View {
        TerminalPanel(title: "infrastructure") {
            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 16) {
                    if let loc = infra.totalLoc {
                        metaItem("Total LOC", formatNumber(loc))
                    }
                    if let sites = infra.vercelSites {
                        metaItem("Vercel Sites", "\(sites)")
                    }
                    if let langs = infra.languages {
                        metaItem("Languages", "\(langs.count)")
                    }
                }

                if let features = infra.technicalFeatures, !features.isEmpty {
                    Divider().background(Theme.border)
                    Text("TECHNICAL FEATURES")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    ForEach(features) { feature in
                        HStack {
                            Text(feature.name)
                                .font(Theme.monoSmall)
                                .foregroundColor(Theme.textPrimary)
                            Spacer()
                            if let desc = feature.description {
                                Text(desc)
                                    .font(.system(size: 10, design: .monospaced))
                                    .foregroundColor(Theme.textMuted)
                                    .lineLimit(1)
                            }
                            if let pts = feature.points {
                                Text("+\(pts)")
                                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                                    .foregroundColor(Theme.accent)
                            }
                        }
                    }
                }
            }
        }
    }

    private func metaItem(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(label.uppercased())
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(Theme.monoSmall)
                .foregroundColor(Theme.textPrimary)
        }
    }

    private func formatNumber(_ n: Int) -> String {
        if n >= 1000 {
            return String(format: "%.1fk", Double(n) / 1000.0)
        }
        return "\(n)"
    }
}

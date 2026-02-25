import SwiftUI

struct UniversalSearchView: View {
    @EnvironmentObject var appState: AppState
    @State private var query: String = ""
    @State private var contentResults: [ContentItem] = []
    @State private var assetResults: [AssetItem] = []
    @State private var skillResults: [SkillItem] = []
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            // Search bar
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Theme.accent)
                    .font(.system(size: 16))
                TextField("Search everything...", text: $query)
                    .textFieldStyle(.plain)
                    .font(.system(size: 16, design: .monospaced))
                    .foregroundColor(Theme.textPrimary)
                    .onSubmit { performSearch() }

                Button("ESC") {
                    dismiss()
                }
                .buttonStyle(.plain)
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(Theme.surfaceElevated)
                .clipShape(RoundedRectangle(cornerRadius: 3))
            }
            .padding(16)
            .background(Theme.surface)

            Divider().background(Theme.border)

            // Results
            if query.isEmpty {
                VStack(spacing: 8) {
                    Spacer()
                    Text("Type to search across content, assets, and skills")
                        .font(Theme.monoBody)
                        .foregroundColor(Theme.textMuted)
                    HStack(spacing: 4) {
                        Text("CMD+F")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(Theme.accent)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Theme.surfaceElevated)
                            .clipShape(RoundedRectangle(cornerRadius: 2))
                        Text("to toggle search")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textMuted)
                    }
                    Spacer()
                }
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 12) {
                        if !contentResults.isEmpty {
                            searchSection("Content", count: contentResults.count, icon: "doc.richtext") {
                                ForEach(contentResults.prefix(10)) { item in
                                    searchResultRow(
                                        title: item.displayTitle,
                                        subtitle: "\(item.platform) · \(item.stage) · \(item.date ?? "")",
                                        action: {
                                            appState.selectedModule = .contentHub
                                            dismiss()
                                        }
                                    )
                                }
                            }
                        }

                        if !assetResults.isEmpty {
                            searchSection("Assets", count: assetResults.count, icon: "photo") {
                                ForEach(assetResults.prefix(10)) { item in
                                    searchResultRow(
                                        title: item.displayName,
                                        subtitle: "\(item.assetType) · \(item.site) · \(item.fileSizeFormatted)",
                                        action: {
                                            appState.selectedModule = .assetGallery
                                            dismiss()
                                        }
                                    )
                                }
                            }
                        }

                        if !skillResults.isEmpty {
                            searchSection("Skills", count: skillResults.count, icon: "bolt.fill") {
                                ForEach(skillResults.prefix(10)) { item in
                                    searchResultRow(
                                        title: item.name,
                                        subtitle: item.description ?? "",
                                        action: {
                                            appState.selectedModule = .nioConsole
                                            dismiss()
                                        }
                                    )
                                }
                            }
                        }

                        if contentResults.isEmpty && assetResults.isEmpty && skillResults.isEmpty {
                            VStack(spacing: 8) {
                                Image(systemName: "magnifyingglass")
                                    .font(.system(size: 32))
                                    .foregroundColor(Theme.textMuted)
                                Text("No results for \"\(query)\"")
                                    .font(Theme.monoBody)
                                    .foregroundColor(Theme.textSecondary)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.top, 40)
                        }
                    }
                    .padding(16)
                }
            }
        }
        .frame(width: 600, height: 500)
        .background(Theme.background)
        .onChange(of: query) { _, _ in performSearch() }
    }

    private func searchSection<Content: View>(_ title: String, count: Int, icon: String,
                                                @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 10))
                    .foregroundColor(Theme.accent)
                Text("\(title.uppercased()) (\(count))")
                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
            }
            content()
        }
    }

    private func searchResultRow(title: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 12, weight: .medium, design: .monospaced))
                        .foregroundColor(Theme.textPrimary)
                        .lineLimit(1)
                    Text(subtitle)
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                        .lineLimit(1)
                }
                Spacer()
                Image(systemName: "arrow.right")
                    .font(.system(size: 10))
                    .foregroundColor(Theme.textMuted)
            }
            .padding(6)
            .background(Theme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 4))
        }
        .buttonStyle(.plain)
    }

    private func performSearch() {
        guard query.count >= 2 else {
            contentResults = []
            assetResults = []
            skillResults = []
            return
        }
        let results = appState.sqliteStore.searchAll(query: query)
        contentResults = results.content
        assetResults = results.assets
        skillResults = results.skills
    }
}

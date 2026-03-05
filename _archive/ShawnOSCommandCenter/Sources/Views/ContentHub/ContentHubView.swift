import SwiftUI

struct ContentHubView: View {
    @EnvironmentObject var appState: AppState
    @State private var items: [ContentItem] = []
    @State private var selectedItem: ContentItem?
    @State private var selectedPlatform: String = ""
    @State private var selectedStage: String = ""
    @State private var searchText: String = ""

    var body: some View {
        NavigationSplitView {
            VStack(spacing: 0) {
                // Filters
                filterBar
                    .padding(8)

                Divider().background(Theme.border)

                // Content List
                List(filteredItems, selection: Binding(
                    get: { selectedItem?.id },
                    set: { id in selectedItem = filteredItems.first { $0.id == id } }
                )) { item in
                    ContentRowView(item: item)
                        .tag(item.id)
                }
                .listStyle(.plain)
            }
            .frame(minWidth: 300)
            .background(Theme.background)
            .navigationTitle("Content Hub")
        } detail: {
            if let item = selectedItem {
                ContentDetailView(item: item)
            } else {
                emptyState
            }
        }
        .onAppear { loadContent() }
        .onChange(of: appState.fileWatcher.lastChange) { _, _ in loadContent() }
    }

    private var filterBar: some View {
        VStack(spacing: 6) {
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Theme.textMuted)
                    .font(.system(size: 12))
                TextField("Search content...", text: $searchText)
                    .textFieldStyle(.plain)
                    .font(Theme.monoSmall)
                    .foregroundColor(Theme.textPrimary)
            }
            .padding(6)
            .background(Theme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 6))

            HStack(spacing: 4) {
                FilterChip(title: "All", isSelected: selectedPlatform.isEmpty) {
                    selectedPlatform = ""
                }
                ForEach(RepoConfig.platforms, id: \.self) { platform in
                    FilterChip(title: platform.prefix(3).uppercased(), isSelected: selectedPlatform == platform,
                               color: Theme.platformColor(platform)) {
                        selectedPlatform = selectedPlatform == platform ? "" : platform
                    }
                }
            }

            HStack(spacing: 4) {
                FilterChip(title: "All", isSelected: selectedStage.isEmpty) {
                    selectedStage = ""
                }
                FilterChip(title: "Draft", isSelected: selectedStage == "draft") {
                    selectedStage = selectedStage == "draft" ? "" : "draft"
                }
                FilterChip(title: "Final", isSelected: selectedStage == "final",
                           color: Theme.accent) {
                    selectedStage = selectedStage == "final" ? "" : "final"
                }
                Spacer()
                Text("\(filteredItems.count) items")
                    .font(Theme.monoSmall)
                    .foregroundColor(Theme.textMuted)
            }
        }
    }

    private var filteredItems: [ContentItem] {
        items.filter { item in
            (selectedPlatform.isEmpty || item.platform == selectedPlatform) &&
            (selectedStage.isEmpty || item.stage == selectedStage) &&
            (searchText.isEmpty || item.displayTitle.localizedCaseInsensitiveContains(searchText) ||
             (item.pillar?.localizedCaseInsensitiveContains(searchText) ?? false))
        }
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "doc.richtext")
                .font(.system(size: 48))
                .foregroundColor(Theme.textMuted)
            Text("Select content to preview")
                .font(Theme.monoBody)
                .foregroundColor(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.background)
    }

    private func loadContent() {
        items = appState.sqliteStore.allContent()
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    var color: Color = Theme.accent
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(isSelected ? .black : Theme.textSecondary)
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(isSelected ? color : Theme.surfaceElevated)
                .clipShape(RoundedRectangle(cornerRadius: 4))
        }
        .buttonStyle(.plain)
    }
}

struct ContentRowView: View {
    let item: ContentItem

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                PlatformBadge(platform: item.platform)
                StageBadge(stage: item.stage)
                Spacer()
                if let date = item.date {
                    Text(date)
                        .font(.system(size: 9, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                }
            }
            Text(item.displayTitle)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Theme.textPrimary)
                .lineLimit(2)
            HStack(spacing: 8) {
                if let pillar = item.pillar {
                    Text(pillar)
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(Theme.accent)
                }
                if let wc = item.wordCount, wc > 0 {
                    Text("\(wc) words")
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

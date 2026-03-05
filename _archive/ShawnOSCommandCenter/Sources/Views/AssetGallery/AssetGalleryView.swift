import SwiftUI

struct AssetGalleryView: View {
    @EnvironmentObject var appState: AppState
    @State private var assets: [AssetItem] = []
    @State private var selectedAsset: AssetItem?
    @State private var searchText: String = ""
    @State private var selectedType: String = ""
    @State private var assetTypes: [String] = []

    private let columns = [
        GridItem(.adaptive(minimum: 120, maximum: 160), spacing: 8)
    ]

    var body: some View {
        NavigationSplitView {
            VStack(spacing: 0) {
                // Search + filters
                VStack(spacing: 6) {
                    HStack(spacing: 6) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Theme.textMuted)
                            .font(.system(size: 12))
                        TextField("Search assets...", text: $searchText)
                            .textFieldStyle(.plain)
                            .font(Theme.monoSmall)
                    }
                    .padding(6)
                    .background(Theme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 6))

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 4) {
                            FilterChip(title: "All", isSelected: selectedType.isEmpty) {
                                selectedType = ""
                            }
                            ForEach(assetTypes, id: \.self) { type in
                                FilterChip(title: type, isSelected: selectedType == type) {
                                    selectedType = selectedType == type ? "" : type
                                }
                            }
                        }
                    }

                    HStack {
                        Text("\(filteredAssets.count) assets")
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textMuted)
                        Spacer()
                    }
                }
                .padding(8)

                Divider().background(Theme.border)

                // Grid
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 8) {
                        ForEach(filteredAssets) { asset in
                            AssetThumbnail(asset: asset, isSelected: selectedAsset?.id == asset.id)
                                .onTapGesture { selectedAsset = asset }
                        }
                    }
                    .padding(8)
                }
            }
            .frame(minWidth: 400)
            .background(Theme.background)
            .navigationTitle("Asset Gallery")
        } detail: {
            if let asset = selectedAsset {
                AssetDetailView(asset: asset)
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 48))
                        .foregroundColor(Theme.textMuted)
                    Text("Select an asset to preview")
                        .font(Theme.monoBody)
                        .foregroundColor(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Theme.background)
            }
        }
        .onAppear { loadAssets() }
        .onChange(of: appState.fileWatcher.lastChange) { _, _ in loadAssets() }
    }

    private var filteredAssets: [AssetItem] {
        assets.filter { asset in
            (selectedType.isEmpty || asset.assetType == selectedType) &&
            (searchText.isEmpty || asset.displayName.localizedCaseInsensitiveContains(searchText) ||
             asset.filePath.localizedCaseInsensitiveContains(searchText))
        }
    }

    private func loadAssets() {
        assets = appState.sqliteStore.allAssets()
        assetTypes = Array(Set(assets.map(\.assetType))).sorted()
    }
}

struct AssetThumbnail: View {
    let asset: AssetItem
    let isSelected: Bool

    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                RoundedRectangle(cornerRadius: 6)
                    .fill(Theme.surface)
                    .frame(height: 100)

                if asset.isImage, let nsImage = NSImage(contentsOfFile: asset.absolutePath) {
                    Image(nsImage: nsImage)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 90)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                } else {
                    Image(systemName: iconForType(asset.assetType))
                        .font(.system(size: 28))
                        .foregroundColor(Theme.textMuted)
                }
            }

            Text(asset.displayName)
                .font(.system(size: 9, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
                .lineLimit(1)
                .truncationMode(.middle)
        }
        .padding(4)
        .background(isSelected ? Theme.accent.opacity(0.15) : Color.clear)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(isSelected ? Theme.accent : Color.clear, lineWidth: 1)
        )
    }

    private func iconForType(_ type: String) -> String {
        switch type.lowercased() {
        case "avatar", "sprite": return "person.crop.square"
        case "video", "cover": return "play.rectangle"
        case "thumbnail": return "photo"
        case "icon", "favicon": return "app.badge"
        default: return "doc"
        }
    }
}

struct AssetDetailView: View {
    let asset: AssetItem

    var body: some View {
        VStack(spacing: 0) {
            // Preview
            ZStack {
                Theme.surface

                if asset.isImage, let nsImage = NSImage(contentsOfFile: asset.absolutePath) {
                    Image(nsImage: nsImage)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .padding(20)
                } else {
                    Image(systemName: "doc.fill")
                        .font(.system(size: 64))
                        .foregroundColor(Theme.textMuted)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            Divider().background(Theme.border)

            // Metadata
            VStack(alignment: .leading, spacing: 6) {
                Text(asset.displayName)
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.textPrimary)

                HStack(spacing: 16) {
                    metaItem("Type", asset.assetType)
                    metaItem("Site", asset.site)
                    if let tier = asset.tier { metaItem("Tier", "\(tier)") }
                    if let cls = asset.className { metaItem("Class", cls) }
                    if let px = asset.sizePx { metaItem("Size", "\(px)px") }
                    metaItem("File Size", asset.fileSizeFormatted)
                }

                Text(asset.filePath)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
                    .textSelection(.enabled)
            }
            .padding(16)
            .background(Theme.surface)
        }
        .background(Theme.background)
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
}

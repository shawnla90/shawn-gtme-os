import SwiftUI

struct RecentFilesView: View {
    @EnvironmentObject var appState: AppState
    @State private var files: [RecentFile] = []

    private var groupedFiles: [(area: String, files: [RecentFile])] {
        let grouped = Dictionary(grouping: files, by: \.area)
        return grouped.sorted { $0.key < $1.key }
            .map { (area: $0.key, files: $0.value) }
    }

    var body: some View {
        TerminalPanel(title: "recent files (\(files.count))") {
            if files.isEmpty {
                Text("No recent changes")
                    .font(Theme.monoSmall)
                    .foregroundColor(Theme.textMuted)
                    .frame(maxWidth: .infinity, minHeight: 40)
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(groupedFiles, id: \.area) { group in
                        VStack(alignment: .leading, spacing: 3) {
                            // Area header
                            HStack(spacing: 4) {
                                Image(systemName: "folder.fill")
                                    .font(.system(size: 9))
                                    .foregroundColor(Theme.accent)
                                Text(group.area.uppercased())
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(Theme.accent)
                                Text("(\(group.files.count))")
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundColor(Theme.textMuted)
                            }

                            ForEach(group.files) { file in
                                HStack(spacing: 8) {
                                    // Change type indicator
                                    Text(file.changeType.label)
                                        .font(.system(size: 7, weight: .bold, design: .monospaced))
                                        .foregroundColor(changeColor(file.changeType))
                                        .padding(.horizontal, 3)
                                        .padding(.vertical, 1)
                                        .background(changeColor(file.changeType).opacity(0.15))
                                        .clipShape(RoundedRectangle(cornerRadius: 2))

                                    Text(file.filename)
                                        .font(Theme.monoSmall)
                                        .foregroundColor(Theme.textPrimary)
                                        .lineLimit(1)

                                    Spacer()

                                    Text(file.timeAgo)
                                        .font(.system(size: 9, design: .monospaced))
                                        .foregroundColor(Theme.textMuted)
                                }
                            }
                        }
                    }
                }
            }
        }
        .task { await loadDataAsync() }
    }

    private func changeColor(_ type: FileChange.ChangeType) -> Color {
        switch type {
        case .added: return Theme.accent
        case .modified: return Color(hex: "#4A9EFF")
        case .deleted: return Theme.statusError
        case .renamed: return Color(hex: "#FFD700")
        }
    }

    private func loadDataAsync() async {
        let store = appState.gitStore
        let result = await Task.detached {
            store.recentlyModifiedFiles(count: 20)
        }.value
        files = result
    }
}

import SwiftUI

struct CommitDetailView: View {
    let commit: GitCommit

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                TerminalPanel(title: "commit \(commit.shortHash)") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(commit.message)
                            .font(.system(size: 14, weight: .medium, design: .monospaced))
                            .foregroundColor(Theme.textPrimary)

                        HStack(spacing: 16) {
                            Label {
                                Text(commit.author)
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textSecondary)
                            } icon: {
                                Image(systemName: "person")
                                    .font(.system(size: 10))
                                    .foregroundColor(Theme.textMuted)
                            }

                            Label {
                                Text(commit.dateFormatted)
                                    .font(Theme.monoSmall)
                                    .foregroundColor(Theme.textSecondary)
                            } icon: {
                                Image(systemName: "calendar")
                                    .font(.system(size: 10))
                                    .foregroundColor(Theme.textMuted)
                            }
                        }

                        HStack(spacing: 12) {
                            Text("\(commit.hash)")
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(Theme.textMuted)
                                .lineLimit(1)
                        }
                    }
                }

                // Stats
                HStack(spacing: 8) {
                    miniStat("Files", value: "\(commit.filesChanged)", color: Color(hex: "#4A9EFF"))
                    miniStat("Insertions", value: "+\(commit.insertions)", color: Theme.accent)
                    miniStat("Deletions", value: "-\(commit.deletions)", color: Theme.statusError)
                    miniStat("Net", value: "\(commit.insertions - commit.deletions)", color: Color(hex: "#FFD700"))
                }

                // File list
                TerminalPanel(title: "files changed (\(commit.files.count))") {
                    VStack(alignment: .leading, spacing: 3) {
                        ForEach(commit.files) { file in
                            fileRow(file)
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Theme.background)
    }

    private func miniStat(_ title: String, value: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(title.uppercased())
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 16, weight: .bold, design: .monospaced))
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(8)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 6))
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .stroke(Theme.border, lineWidth: 1)
        )
    }

    private func fileRow(_ file: FileChange) -> some View {
        HStack(spacing: 8) {
            // Change type badge
            Text(file.changeType.label)
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(changeTypeColor(file.changeType))
                .padding(.horizontal, 4)
                .padding(.vertical, 1)
                .background(changeTypeColor(file.changeType).opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 2))

            // File path
            Text(file.path)
                .font(.system(size: 11, design: .monospaced))
                .foregroundColor(Theme.textPrimary)
                .lineLimit(1)

            Spacer()

            // Stats
            if file.insertions > 0 {
                Text("+\(file.insertions)")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.accent)
            }
            if file.deletions > 0 {
                Text("-\(file.deletions)")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.statusError)
            }
        }
        .padding(.vertical, 2)
    }

    private func changeTypeColor(_ type: FileChange.ChangeType) -> Color {
        switch type {
        case .added: return Theme.accent
        case .modified: return Color(hex: "#4A9EFF")
        case .deleted: return Theme.statusError
        case .renamed: return Color(hex: "#FFD700")
        }
    }
}

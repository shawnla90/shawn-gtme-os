import SwiftUI

struct ToastOverlay: View {
    @EnvironmentObject var appState: AppState
    @State private var visibleToast: NewFileEvent?
    @State private var dismissTask: Task<Void, Never>?

    var body: some View {
        VStack {
            HStack {
                Spacer()
                if let toast = visibleToast {
                    toastCard(toast)
                        .transition(.move(edge: .trailing).combined(with: .opacity))
                        .padding(.top, 12)
                        .padding(.trailing, 12)
                }
            }
            Spacer()
        }
        .animation(.spring(duration: 0.3), value: visibleToast?.id)
        .onChange(of: appState.fileWatcher.latestNewFile?.id) { _, _ in
            guard let event = appState.fileWatcher.latestNewFile else { return }
            showToast(event)
        }
    }

    private func toastCard(_ event: NewFileEvent) -> some View {
        Button {
            navigateToFile(event)
            dismiss()
        } label: {
            HStack(spacing: 10) {
                Image(systemName: "doc.badge.plus")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.accent)

                VStack(alignment: .leading, spacing: 2) {
                    Text("New file")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Theme.textSecondary)
                    Text(event.filename)
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textPrimary)
                        .lineLimit(1)
                }

                Spacer(minLength: 8)

                Text("Jump to")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(Theme.accent)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .frame(maxWidth: 280)
            .background(Theme.surfaceElevated)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Theme.accent.opacity(0.4), lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
    }

    private func showToast(_ event: NewFileEvent) {
        dismissTask?.cancel()
        withAnimation { visibleToast = event }
        dismissTask = Task {
            try? await Task.sleep(for: .seconds(5))
            guard !Task.isCancelled else { return }
            await MainActor.run { dismiss() }
        }
    }

    private func dismiss() {
        withAnimation { visibleToast = nil }
    }

    private func navigateToFile(_ event: NewFileEvent) {
        let path = event.path
        if path.hasPrefix(RepoConfig.contentDir) {
            appState.selectedModule = .contentHub
        } else if path.hasPrefix(RepoConfig.reportsDir) {
            appState.selectedModule = .dailyOps
        } else if path.hasPrefix(RepoConfig.soulsDir) {
            appState.selectedModule = .nioConsole
        } else if path.contains("/data/progression/") {
            appState.selectedModule = .assetGallery
        } else {
            appState.selectedModule = .dailyOps
        }
    }
}

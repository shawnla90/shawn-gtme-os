import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ZStack {
            NavigationSplitView {
                SidebarView()
            } detail: {
                ZStack {
                    Theme.background.ignoresSafeArea()
                    moduleView
                }
            }
            .navigationSplitViewStyle(.balanced)
            .background(Theme.background)
            .sheet(isPresented: $appState.isSearching) {
                UniversalSearchView()
                    .environmentObject(appState)
            }

            ToastOverlay()
        }
    }

    @ViewBuilder
    private var moduleView: some View {
        switch appState.selectedModule {
        case .contentHub:
            ContentHubView()
        case .dailyOps:
            DailyOpsView()
        case .leveling:
            LevelingView()
        case .commits:
            CommitTrackerView()
        case .projects:
            ProjectsView()
        case .assetGallery:
            AssetGalleryView()
        case .websiteDashboard:
            WebsiteDashboardView()
        case .nioConsole:
            NioConsoleView()
        case .gtmPartners:
            GTMPartnersView()
        case .showcase:
            ShowcaseView()
        }
    }
}

struct SidebarView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 0) {
            List(AppModule.allCases, selection: $appState.selectedModule) { module in
                Label {
                    Text(module.title)
                        .font(.system(size: 13, weight: .medium))
                } icon: {
                    Image(systemName: module.icon)
                        .foregroundColor(Theme.accent)
                }
                .tag(module)
            }
            .listStyle(.sidebar)

            Divider().background(Theme.border)

            NioHeartbeatWidget()
                .padding(12)
        }
        .navigationTitle("ShawnOS")
        .background(Theme.background)
    }
}

struct NioHeartbeatWidget: View {
    @EnvironmentObject var appState: AppState
    @State private var heartbeat: NioBotStore.Heartbeat = .empty

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Circle()
                    .fill(heartbeat.isActive ? Theme.statusOK : Theme.textMuted)
                    .frame(width: 6, height: 6)
                Text("Nio")
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(Theme.textPrimary)
                Spacer()
                Text("T\(heartbeat.tier) L\(heartbeat.level)")
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundColor(Theme.accent)
            }

            HStack(spacing: 8) {
                Label("\(heartbeat.xp) XP", systemImage: "bolt.fill")
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)
                Label("\(heartbeat.totalMessages)", systemImage: "message.fill")
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)
            }

            if let lastMsg = heartbeat.lastMessage {
                Text(lastMsg)
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
                    .lineLimit(2)
            }

            HStack {
                Spacer()
                Text(heartbeat.lastActiveAgo)
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(Theme.textMuted)
            }
        }
        .padding(10)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 6))
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .stroke(Theme.border, lineWidth: 1)
        )
        .onAppear { refresh() }
        .onChange(of: appState.fileWatcher.lastChange) { _, _ in refresh() }
    }

    private func refresh() {
        heartbeat = appState.nioBotStore.loadHeartbeat()
    }
}

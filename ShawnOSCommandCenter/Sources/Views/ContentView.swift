import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
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
        .navigationTitle("ShawnOS")
        .background(Theme.background)
    }
}

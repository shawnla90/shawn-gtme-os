import SwiftUI

@main
struct ShawnOSCommandCenterApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .frame(minWidth: 900, minHeight: 600)
                .preferredColorScheme(.dark)
        }
        .windowStyle(.titleBar)
        .defaultSize(width: 1280, height: 800)
        .commands {
            CommandGroup(replacing: .newItem) {}
            CommandMenu("Modules") {
                ForEach(AppModule.allCases) { module in
                    Button(module.title) {
                        appState.selectedModule = module
                    }
                    .keyboardShortcut(module.shortcutKey, modifiers: .command)
                }
            }
            CommandGroup(after: .toolbar) {
                Button("Search") {
                    appState.isSearching = true
                }
                .keyboardShortcut("f", modifiers: .command)
            }
        }
    }
}

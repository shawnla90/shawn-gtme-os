import SwiftUI

struct PlansBrowserView: View {
    @EnvironmentObject var appState: AppState
    @State private var plans: [(name: String, path: String)] = []
    @State private var selectedPlan: String?
    @State private var content: String = ""

    var body: some View {
        NavigationSplitView {
            List(plans, id: \.path, selection: $selectedPlan) { plan in
                HStack(spacing: 8) {
                    Image(systemName: "doc.text")
                        .foregroundColor(Color(hex: "#4A9EFF"))
                        .font(.system(size: 12))
                    VStack(alignment: .leading, spacing: 2) {
                        Text(planDisplayName(plan.name))
                            .font(.system(size: 11, weight: .medium, design: .monospaced))
                            .foregroundColor(Theme.textPrimary)
                            .lineLimit(1)
                        Text(plan.name)
                            .font(.system(size: 9, design: .monospaced))
                            .foregroundColor(Theme.textMuted)
                            .lineLimit(1)
                    }
                }
                .tag(plan.path)
            }
            .listStyle(.plain)
            .frame(minWidth: 200)
        } detail: {
            if selectedPlan != nil {
                ScrollView {
                    TerminalPanel(title: plans.first { $0.path == selectedPlan }?.name ?? "") {
                        MarkdownView(source: content)
                    }
                    .padding(16)
                }
                .background(Theme.background)
            } else {
                VStack(spacing: 8) {
                    Image(systemName: "doc.text.magnifyingglass")
                        .font(.system(size: 32))
                        .foregroundColor(Theme.textMuted)
                    Text("Select a plan")
                        .font(Theme.monoBody)
                        .foregroundColor(Theme.textMuted)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .onAppear { loadPlans() }
        .onChange(of: selectedPlan) { _, path in
            if let path = path {
                content = appState.fileStore.readMarkdown(at: path) ?? "Plan not found"
            }
        }
    }

    private func planDisplayName(_ filename: String) -> String {
        filename
            .replacingOccurrences(of: ".plan.md", with: "")
            .replacingOccurrences(of: "_", with: " ")
            .replacingOccurrences(of: "-", with: " ")
            .capitalized
    }

    private func loadPlans() {
        let dir = RepoConfig.plansDir
        guard let files = try? FileManager.default.contentsOfDirectory(atPath: dir) else { return }
        plans = files
            .filter { $0.hasSuffix(".plan.md") || $0.hasSuffix(".md") }
            .sorted()
            .map { (name: $0, path: "\(dir)/\($0)") }
    }
}

import SwiftUI

struct GTMPartnersView: View {
    @EnvironmentObject var appState: AppState
    @State private var partners: [(name: String, path: String)] = []
    @State private var workflows: [(name: String, path: String)] = []
    @State private var marOps: [(name: String, path: String)] = []
    @State private var selectedFile: String?
    @State private var fileContent: String = ""

    enum Section: String, CaseIterable, Identifiable {
        case partners, workflows, marOps
        var id: String { rawValue }
        var title: String {
            switch self {
            case .partners: return "Partners"
            case .workflows: return "Workflows"
            case .marOps: return "Marketing Ops"
            }
        }
        var icon: String {
            switch self {
            case .partners: return "person.3"
            case .workflows: return "arrow.triangle.branch"
            case .marOps: return "megaphone"
            }
        }
    }

    var body: some View {
        NavigationSplitView {
            List {
                ForEach(Section.allCases) { section in
                    DisclosureGroup {
                        ForEach(filesForSection(section), id: \.path) { file in
                            Button {
                                selectedFile = file.path
                                loadContent(file.path)
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: section == .partners ? "folder" : "doc.text")
                                        .font(.system(size: 10))
                                        .foregroundColor(Theme.accent)
                                    Text(file.name)
                                        .font(Theme.monoSmall)
                                        .foregroundColor(selectedFile == file.path ? Theme.accent : Theme.textPrimary)
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    } label: {
                        Label {
                            Text(section.title)
                                .font(.system(size: 12, weight: .medium, design: .monospaced))
                        } icon: {
                            Image(systemName: section.icon)
                                .foregroundColor(Theme.accent)
                        }
                    }
                }
            }
            .listStyle(.sidebar)
            .frame(minWidth: 220)
        } detail: {
            if selectedFile != nil && !fileContent.isEmpty {
                TerminalPanel(title: (selectedFile as? NSString)?.lastPathComponent ?? "") {
                    MarkdownView(source: fileContent)
                }
                .padding(16)
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "person.3.fill")
                        .font(.system(size: 48))
                        .foregroundColor(Theme.textMuted)
                    Text("Select a file to preview")
                        .font(Theme.monoBody)
                        .foregroundColor(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Theme.background)
        .navigationTitle("GTM & Partners")
        .onAppear { loadData() }
    }

    private func filesForSection(_ section: Section) -> [(name: String, path: String)] {
        switch section {
        case .partners: return partners
        case .workflows: return workflows
        case .marOps: return marOps
        }
    }

    private func loadData() {
        partners = appState.fileStore.partnerDirectories()
        workflows = appState.fileStore.workflowFiles()
        marOps = appState.fileStore.marOpsFiles()
    }

    private func loadContent(_ path: String) {
        // If it's a directory, list files inside
        var isDir: ObjCBool = false
        if FileManager.default.fileExists(atPath: path, isDirectory: &isDir), isDir.boolValue {
            let files = (try? FileManager.default.contentsOfDirectory(atPath: path))?.sorted() ?? []
            fileContent = "# \((path as NSString).lastPathComponent)\n\n" +
                files.map { "- \($0)" }.joined(separator: "\n")
        } else {
            fileContent = appState.fileStore.readFile(at: path) ?? "File not found"
        }
    }
}

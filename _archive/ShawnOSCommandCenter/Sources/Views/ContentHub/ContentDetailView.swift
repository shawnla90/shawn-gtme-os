import SwiftUI

struct ContentDetailView: View {
    let item: ContentItem
    @EnvironmentObject var appState: AppState
    @State private var markdownContent: String?
    @State private var parsed: ParsedMarkdown?
    @State private var isEditing = false
    @State private var editBuffer = ""
    @State private var saveStatus: SaveStatus = .idle

    enum SaveStatus: Equatable {
        case idle, saving, saved, error(String)
    }

    private var canEdit: Bool {
        appState.fileStore.isEditable(item.absolutePath)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header with edit toggle
            HStack {
                contentHeader
                Spacer()
                if canEdit {
                    editorControls
                }
            }
            .padding(16)
            .background(Theme.surface)

            Divider().background(Theme.border)

            // Body — view or edit mode
            if isEditing {
                editorView
            } else if let parsed = parsed {
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        if !parsed.frontmatter.isEmpty {
                            frontmatterView(parsed.frontmatter)
                                .padding(16)
                        }

                        Divider().background(Theme.border)

                        MarkdownView(source: parsed.body)
                            .padding(.horizontal, 8)
                    }
                }
            } else {
                VStack {
                    ProgressView()
                        .progressViewStyle(.circular)
                    Text("Loading...")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textMuted)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Theme.background)
        .onAppear { loadFile() }
        .onChange(of: item.id) { _, _ in
            isEditing = false
            saveStatus = .idle
            loadFile()
        }
    }

    private var editorControls: some View {
        HStack(spacing: 8) {
            if case .saved = saveStatus {
                Text("Saved")
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundColor(Theme.statusOK)
            } else if case .error(let msg) = saveStatus {
                Text(msg)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.statusError)
                    .lineLimit(1)
            }

            Picker("", selection: $isEditing) {
                Text("View").tag(false)
                Text("Edit").tag(true)
            }
            .pickerStyle(.segmented)
            .frame(width: 120)
            .onChange(of: isEditing) { _, editing in
                if editing {
                    editBuffer = markdownContent ?? ""
                }
            }

            if isEditing {
                Button("Save") { saveFile() }
                    .buttonStyle(.borderedProminent)
                    .tint(Theme.accent)
                    .font(.system(size: 11, weight: .semibold))
                    .keyboardShortcut("s", modifiers: .command)
            }
        }
    }

    private var editorView: some View {
        TextEditor(text: $editBuffer)
            .font(.system(size: 13, design: .monospaced))
            .scrollContentBackground(.hidden)
            .background(Theme.background)
            .foregroundColor(Theme.textPrimary)
            .padding(8)
    }

    private func saveFile() {
        saveStatus = .saving
        let result = appState.fileStore.saveMarkdown(at: item.absolutePath, content: editBuffer)
        switch result {
        case .success:
            markdownContent = editBuffer
            parsed = FrontmatterParser.parse(editBuffer)
            saveStatus = .saved
        case .failure(let error):
            saveStatus = .error(error.localizedDescription)
        }
    }

    private var contentHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                PlatformBadge(platform: item.platform)
                StageBadge(stage: item.stage)
                if let status = item.statusText {
                    Text(status)
                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                        .foregroundColor(Theme.statusWarning)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Theme.statusWarning.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 3))
                }
                Spacer()
                if let wc = item.wordCount, wc > 0 {
                    HStack(spacing: 4) {
                        Image(systemName: "text.word.spacing")
                            .font(.system(size: 10))
                        Text("\(wc)")
                            .font(Theme.monoSmall)
                    }
                    .foregroundColor(Theme.textSecondary)
                }
            }

            Text(item.displayTitle)
                .font(.system(size: 18, weight: .bold, design: .monospaced))
                .foregroundColor(Theme.textPrimary)

            HStack(spacing: 16) {
                if let date = item.date {
                    Label(date, systemImage: "calendar")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                }
                if let pillar = item.pillar {
                    Label(pillar, systemImage: "target")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.accent)
                }
                if let arc = item.arc {
                    Label(arc, systemImage: "arrow.triangle.branch")
                        .font(Theme.monoSmall)
                        .foregroundColor(Theme.textSecondary)
                }
            }

            Text(item.filePath)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(Theme.textMuted)
        }
    }

    private func frontmatterView(_ fm: [String: String]) -> some View {
        TerminalPanel(title: "frontmatter") {
            VStack(alignment: .leading, spacing: 4) {
                ForEach(fm.sorted(by: { $0.key < $1.key }), id: \.key) { key, value in
                    HStack(alignment: .top, spacing: 8) {
                        Text(key)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.accent)
                            .frame(width: 80, alignment: .trailing)
                        Text(value)
                            .font(Theme.monoSmall)
                            .foregroundColor(Theme.textPrimary)
                            .textSelection(.enabled)
                    }
                }
            }
        }
    }

    private func loadFile() {
        let content = appState.fileStore.readFile(at: item.absolutePath) ?? "File not found: \(item.absolutePath)"
        markdownContent = content
        parsed = FrontmatterParser.parse(content)
    }
}

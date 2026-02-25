import Foundation

final class FileSystemStore: Sendable {
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        return d
    }()

    // MARK: - Daily Logs

    func latestDailyLog() -> DailyLog? {
        let dir = RepoConfig.dailyLogDir
        guard let files = try? FileManager.default.contentsOfDirectory(atPath: dir) else { return nil }
        let jsonFiles = files.filter { $0.hasSuffix(".json") }.sorted().reversed()
        for file in jsonFiles {
            if let log = loadDailyLog(date: String(file.dropLast(5))) {
                return log
            }
        }
        return nil
    }

    func loadDailyLog(date: String) -> DailyLog? {
        let path = "\(RepoConfig.dailyLogDir)/\(date).json"
        return decodeJSON(at: path)
    }

    func availableDailyLogDates() -> [String] {
        let dir = RepoConfig.dailyLogDir
        guard let files = try? FileManager.default.contentsOfDirectory(atPath: dir) else { return [] }
        return files
            .filter { $0.hasSuffix(".json") }
            .map { String($0.dropLast(5)) }
            .sorted()
            .reversed()
    }

    // MARK: - Progression

    func loadProfile() -> ProgressionProfile? {
        decodeJSON(at: RepoConfig.progressionProfile)
    }

    // MARK: - Website Stats

    func loadWebsiteStats() -> WebsiteStats? {
        decodeJSON(at: RepoConfig.websiteStats)
    }

    // MARK: - Cron Jobs

    func loadCronJobs() -> [CronJob] {
        let file: CronJobsFile? = decodeJSON(at: RepoConfig.nioCronJobs)
        return file?.jobs ?? []
    }

    // MARK: - Markdown Files

    func readMarkdown(at path: String) -> String? {
        try? String(contentsOfFile: path, encoding: .utf8)
    }

    func readFile(at path: String) -> String? {
        try? String(contentsOfFile: path, encoding: .utf8)
    }

    // MARK: - Nio Workspace Files

    func nioWorkspaceFiles() -> [(name: String, path: String)] {
        let dir = RepoConfig.nioWorkspace
        guard let files = try? FileManager.default.contentsOfDirectory(atPath: dir) else { return [] }
        return files
            .filter { $0.hasSuffix(".md") }
            .sorted()
            .map { (name: $0, path: "\(dir)/\($0)") }
    }

    // MARK: - Partner / GTM Files

    func partnerDirectories() -> [(name: String, path: String)] {
        listSubdirectories(at: RepoConfig.clientsDir)
    }

    func workflowFiles() -> [(name: String, path: String)] {
        listMarkdownFiles(in: RepoConfig.workflowsDir)
    }

    func marOpsFiles() -> [(name: String, path: String)] {
        listMarkdownFiles(in: RepoConfig.nioMarOpsDir)
    }

    // MARK: - Write (restricted directories)

    private static let editablePrefixes = [
        RepoConfig.contentDir,
        RepoConfig.soulsDir,
        RepoConfig.nioMemoryDir,
    ]

    func isEditable(_ path: String) -> Bool {
        Self.editablePrefixes.contains { path.hasPrefix($0) }
    }

    func saveMarkdown(at path: String, content: String) -> Result<Void, FileStoreError> {
        guard isEditable(path) else {
            return .failure(.notEditable(path))
        }
        do {
            try content.write(toFile: path, atomically: true, encoding: .utf8)
            return .success(())
        } catch {
            return .failure(.writeFailed(error.localizedDescription))
        }
    }

    enum FileStoreError: LocalizedError {
        case notEditable(String)
        case writeFailed(String)

        var errorDescription: String? {
            switch self {
            case .notEditable(let path): return "File not in editable directory: \(path)"
            case .writeFailed(let msg): return "Write failed: \(msg)"
            }
        }
    }

    // MARK: - Helpers

    private func decodeJSON<T: Decodable>(at path: String) -> T? {
        guard let data = FileManager.default.contents(atPath: path) else {
            print("[FileSystemStore] File not found: \(path)")
            return nil
        }
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            print("[FileSystemStore] Decode error at \(path): \(error)")
            return nil
        }
    }

    private func listSubdirectories(at path: String) -> [(name: String, path: String)] {
        guard let items = try? FileManager.default.contentsOfDirectory(atPath: path) else { return [] }
        return items.compactMap { item in
            let fullPath = "\(path)/\(item)"
            var isDir: ObjCBool = false
            guard FileManager.default.fileExists(atPath: fullPath, isDirectory: &isDir), isDir.boolValue else { return nil }
            return (name: item, path: fullPath)
        }.sorted { $0.name < $1.name }
    }

    private func listMarkdownFiles(in path: String) -> [(name: String, path: String)] {
        guard let items = try? FileManager.default.contentsOfDirectory(atPath: path) else { return [] }
        return items
            .filter { $0.hasSuffix(".md") }
            .sorted()
            .map { (name: $0, path: "\(path)/\($0)") }
    }
}

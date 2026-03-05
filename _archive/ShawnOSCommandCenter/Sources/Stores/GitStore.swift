import Foundation

final class GitStore: Sendable {
    private let repoPath: String

    init(repoPath: String = RepoConfig.repoRoot) {
        self.repoPath = repoPath
    }

    // MARK: - Commit Log

    func loadCommits(limit: Int = 200) -> [GitCommit] {
        // Get commit data with stats
        let format = "%H%n%h%n%aI%n%an%n%s"
        let logOutput = shell("git -C \(repoPath) log --format='\(format)' --numstat -n \(limit)")
        return parseCommits(logOutput)
    }

    func commitCount() -> Int {
        let output = shell("git -C \(repoPath) rev-list --count HEAD")
        return Int(output.trimmingCharacters(in: .whitespacesAndNewlines)) ?? 0
    }

    func commitsThisWeek() -> Int {
        let output = shell("git -C \(repoPath) rev-list --count --since='1 week ago' HEAD")
        return Int(output.trimmingCharacters(in: .whitespacesAndNewlines)) ?? 0
    }

    // MARK: - Recent Files

    func recentlyModifiedFiles(count: Int = 20) -> [RecentFile] {
        let output = shell("git -C \(repoPath) diff --name-status HEAD~\(count) HEAD 2>/dev/null")
        let lines = output.components(separatedBy: "\n").filter { !$0.isEmpty }

        var seen = Set<String>()
        var files: [RecentFile] = []

        for line in lines {
            let parts = line.components(separatedBy: "\t")
            guard parts.count >= 2 else { continue }

            let status = parts[0].trimmingCharacters(in: .whitespaces)
            let path = parts.last ?? ""
            guard !seen.contains(path) else { continue }
            seen.insert(path)

            let changeType: FileChange.ChangeType
            if status.hasPrefix("A") { changeType = .added }
            else if status.hasPrefix("D") { changeType = .deleted }
            else if status.hasPrefix("R") { changeType = .renamed }
            else { changeType = .modified }

            let filename = (path as NSString).lastPathComponent
            let area = path.components(separatedBy: "/").first ?? "root"

            // Get modification time from filesystem
            let fullPath = "\(repoPath)/\(path)"
            let timeAgo: String
            if let attrs = try? FileManager.default.attributesOfItem(atPath: fullPath),
               let modDate = attrs[.modificationDate] as? Date {
                let formatter = RelativeDateTimeFormatter()
                formatter.unitsStyle = .abbreviated
                timeAgo = formatter.localizedString(for: modDate, relativeTo: Date())
            } else {
                timeAgo = "unknown"
            }

            files.append(RecentFile(
                path: path,
                filename: filename,
                changeType: changeType,
                timeAgo: timeAgo,
                area: area
            ))
        }

        return Array(files.prefix(count))
    }

    // MARK: - Area Stats

    func topAreas(from commits: [GitCommit]) -> [(area: String, count: Int)] {
        var areaCounts: [String: Int] = [:]
        for commit in commits {
            for file in commit.files {
                areaCounts[file.area, default: 0] += 1
            }
        }
        return areaCounts.sorted { $0.value > $1.value }
            .prefix(5)
            .map { (area: $0.key, count: $0.value) }
    }

    // MARK: - Project Commit Counts

    func commitCountForPath(_ path: String, limit: Int = 50) -> Int {
        let output = shell("git -C \(repoPath) rev-list --count -n \(limit) HEAD -- \(path) 2>/dev/null")
        return Int(output.trimmingCharacters(in: .whitespacesAndNewlines)) ?? 0
    }

    // MARK: - Parsing

    private func parseCommits(_ output: String) -> [GitCommit] {
        var commits: [GitCommit] = []
        let lines = output.components(separatedBy: "\n")
        var i = 0

        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime]

        while i < lines.count {
            // Skip empty lines
            while i < lines.count && lines[i].trimmingCharacters(in: .whitespaces).isEmpty {
                i += 1
            }
            guard i + 4 < lines.count else { break }

            let fullHash = lines[i].trimmingCharacters(in: CharacterSet(charactersIn: "'").union(.whitespaces))
            let shortHash = lines[i + 1].trimmingCharacters(in: CharacterSet(charactersIn: "'").union(.whitespaces))
            let dateStr = lines[i + 2].trimmingCharacters(in: CharacterSet(charactersIn: "'").union(.whitespaces))
            let author = lines[i + 3].trimmingCharacters(in: CharacterSet(charactersIn: "'").union(.whitespaces))
            let message = lines[i + 4].trimmingCharacters(in: CharacterSet(charactersIn: "'").union(.whitespaces))
            i += 5

            guard fullHash.count >= 7, !fullHash.contains(" ") else { continue }

            let date = dateFormatter.date(from: dateStr) ?? Date.distantPast

            // Skip empty line after message
            while i < lines.count && lines[i].trimmingCharacters(in: .whitespaces).isEmpty {
                i += 1
            }

            // Parse numstat lines (additions \t deletions \t filepath)
            var files: [FileChange] = []
            var totalInsertions = 0
            var totalDeletions = 0

            while i < lines.count {
                let line = lines[i]
                let trimmed = line.trimmingCharacters(in: .whitespaces)
                guard !trimmed.isEmpty else { break }

                let parts = line.components(separatedBy: "\t")
                guard parts.count >= 3 else { break }

                let ins = Int(parts[0].trimmingCharacters(in: .whitespaces)) ?? 0
                let del = Int(parts[1].trimmingCharacters(in: .whitespaces)) ?? 0
                let path = parts[2]

                let changeType: FileChange.ChangeType
                if ins > 0 && del == 0 { changeType = .added }
                else if ins == 0 && del > 0 { changeType = .deleted }
                else { changeType = .modified }

                files.append(FileChange(
                    path: path,
                    changeType: changeType,
                    insertions: ins,
                    deletions: del
                ))
                totalInsertions += ins
                totalDeletions += del
                i += 1
            }

            commits.append(GitCommit(
                hash: fullHash,
                shortHash: shortHash,
                date: date,
                author: author,
                message: message,
                filesChanged: files.count,
                insertions: totalInsertions,
                deletions: totalDeletions,
                files: files
            ))
        }

        return commits
    }

    // MARK: - Shell

    private func shell(_ command: String) -> String {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/zsh")
        process.arguments = ["-c", command]
        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = Pipe()
        do {
            try process.run()
            // Read data BEFORE waitUntilExit to avoid pipe buffer deadlock
            let data = pipe.fileHandleForReading.readDataToEndOfFile()
            process.waitUntilExit()
            return String(data: data, encoding: .utf8) ?? ""
        } catch {
            print("[GitStore] Shell error: \(error)")
            return ""
        }
    }
}

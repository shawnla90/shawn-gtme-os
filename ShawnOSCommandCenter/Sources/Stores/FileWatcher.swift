import Foundation
import Combine

struct NewFileEvent: Identifiable {
    let id = UUID()
    let path: String
    let filename: String
    let timestamp: Date
}

final class FileWatcher: ObservableObject {
    @Published var lastChange = Date()
    @Published var latestNewFile: NewFileEvent?

    private var stream: FSEventStreamRef?
    private let paths: [String]
    private var knownFiles: Set<String> = []
    private var isInitialScan = true

    init(paths: [String]) {
        self.paths = paths
        buildInitialFileSet()
        startWatching()
    }

    deinit {
        stopWatching()
    }

    /// Build a set of all existing files so we can detect truly new ones
    private func buildInitialFileSet() {
        let fm = FileManager.default
        for dir in paths {
            // Skip .git paths — they're single files, not directories to enumerate
            if dir.contains("/.git/") { continue }
            guard let enumerator = fm.enumerator(atPath: dir) else { continue }
            while let relativePath = enumerator.nextObject() as? String {
                knownFiles.insert("\(dir)/\(relativePath)")
            }
        }
        isInitialScan = false
    }

    private func startWatching() {
        let pathsCF = paths as CFArray
        var context = FSEventStreamContext()
        context.info = Unmanaged.passUnretained(self).toOpaque()

        let callback: FSEventStreamCallback = { _, info, numEvents, eventPaths, eventFlags, _ in
            guard let info = info else { return }
            let watcher = Unmanaged<FileWatcher>.fromOpaque(info).takeUnretainedValue()

            // Cast eventPaths to get individual file paths
            guard let paths = unsafeBitCast(eventPaths, to: NSArray.self) as? [String] else {
                DispatchQueue.main.async { watcher.lastChange = Date() }
                return
            }

            let flags = UnsafeBufferPointer(start: eventFlags, count: numEvents)

            var foundNewFile: String?
            for i in 0..<numEvents {
                let flag = Int32(flags[i])
                let isCreated = (flag & Int32(kFSEventStreamEventFlagItemCreated)) != 0
                let isFile = (flag & Int32(kFSEventStreamEventFlagItemIsFile)) != 0

                if isCreated && isFile && !watcher.isInitialScan {
                    let path = paths[i]
                    if !watcher.knownFiles.contains(path) {
                        watcher.knownFiles.insert(path)
                        foundNewFile = path
                    }
                }
            }

            DispatchQueue.main.async {
                watcher.lastChange = Date()
                if let newPath = foundNewFile {
                    let filename = (newPath as NSString).lastPathComponent
                    watcher.latestNewFile = NewFileEvent(
                        path: newPath,
                        filename: filename,
                        timestamp: Date()
                    )
                }
            }
        }

        stream = FSEventStreamCreate(
            nil,
            callback,
            &context,
            pathsCF,
            FSEventStreamEventId(kFSEventStreamEventIdSinceNow),
            1.0,
            FSEventStreamCreateFlags(kFSEventStreamCreateFlagUseCFTypes | kFSEventStreamCreateFlagFileEvents)
        )

        if let stream = stream {
            FSEventStreamSetDispatchQueue(stream, DispatchQueue.main)
            FSEventStreamStart(stream)
        }
    }

    private func stopWatching() {
        if let stream = stream {
            FSEventStreamStop(stream)
            FSEventStreamInvalidate(stream)
            FSEventStreamRelease(stream)
        }
        stream = nil
    }
}

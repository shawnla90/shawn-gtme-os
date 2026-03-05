import Foundation

enum RepoConfig {
    static let repoRoot = "/Users/shawnos.ai/shawn-gtme-os"
    static let contentDir = "\(repoRoot)/content"
    static let dataDir = "\(repoRoot)/data"
    static let reportsDir = "\(repoRoot)/reports"
    static let soulsDir = "\(repoRoot)/souls"
    static let nioMemoryDir = "\(dataDir)/nio-memory"
    static let gitHeadRef = "\(repoRoot)/.git/refs/heads/main"
    static let indexDB = "\(dataDir)/index.db"
    static let dailyLogDir = "\(dataDir)/daily-log"
    static let progressionProfile = "\(dataDir)/progression/profile.json"
    static let avatarDir = "\(dataDir)/progression/avatars"
    static let websiteStats = "\(dataDir)/website-stats.json"
    static let repoStats = "\(dataDir)/repo-stats.json"

    // Nio paths (souls and memory now live in repo)
    static let nioWorkspace = "\(repoRoot)/souls"
    static let nioCronJobs = "\(dataDir)/cron/jobs.json"
    static let soulFile = "\(nioWorkspace)/SOUL.md"
    static let memoryFile = "\(nioWorkspace)/MEMORY.md"
    static let identityFile = "\(nioWorkspace)/IDENTITY.md"
    static let voiceFile = "\(nioWorkspace)/VOICE.md"
    static let nioBotDB = NSHomeDirectory() + "/.niobot/data/niobot.db"

    // Plans directory
    static let plansDir = "\(repoRoot)/.cursor/plans"

    // Partner / GTM paths
    static let clientsDir = "\(repoRoot)/clients"
    static let nioMarOpsDir = "\(repoRoot)/nio-mar-ops"
    static let workflowsDir = "\(repoRoot)/workflows"

    // Asset directories
    static let contentImagesDir = "\(contentDir)/images"
    static let videoCoversDir = "\(repoRoot)/website/apps/video/covers"

    // IP Registry
    static let ipRegistry = "\(repoRoot)/IP_REGISTRY.md"

    // Content platforms
    static let platforms = ["linkedin", "x", "substack", "website", "reddit", "tiktok", "youtube"]
    static let stages = ["draft", "final"]

    // Platform colors
    static let platformColors: [String: String] = [
        "linkedin": "#0A66C2",
        "x": "#000000",
        "substack": "#FF6719",
        "website": "#4EC373",
        "reddit": "#FF4500",
        "tiktok": "#010101",
        "youtube": "#FF0000",
    ]
}

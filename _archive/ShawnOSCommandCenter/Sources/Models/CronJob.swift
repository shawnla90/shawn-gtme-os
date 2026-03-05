import Foundation

struct CronJobsFile: Codable {
    let version: Int?
    let jobs: [CronJob]
}

struct CronJob: Codable, Identifiable {
    let id: String
    let agentId: String?
    let name: String
    let enabled: Bool
    let createdAtMs: Int64?
    let updatedAtMs: Int64?
    let schedule: CronSchedule?
    let sessionTarget: String?
    let payload: CronPayload?
    let state: CronJobState?

    var scheduleDescription: String {
        guard let schedule = schedule else { return "—" }
        switch schedule.kind {
        case "cron":
            return schedule.expr ?? "—"
        case "every":
            if let ms = schedule.everyMs {
                let hours = ms / 3_600_000
                let mins = (ms % 3_600_000) / 60_000
                if hours > 0 { return "Every \(hours)h" }
                return "Every \(mins)m"
            }
            return "—"
        default:
            return schedule.kind ?? "—"
        }
    }

    var statusColor: String {
        guard enabled else { return "#666666" }
        guard let state = state else { return "#4EC373" }
        if state.lastStatus == "error" { return "#FF4444" }
        if state.lastStatus == "ok" { return "#4EC373" }
        return "#FFD700"
    }

    var lastRunFormatted: String {
        guard let ms = state?.lastRunAtMs else { return "Never" }
        let date = Date(timeIntervalSince1970: Double(ms) / 1000.0)
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct CronSchedule: Codable {
    let kind: String?
    let expr: String?
    let tz: String?
    let staggerMs: Int?
    let everyMs: Int64?
    let anchorMs: Int64?

    enum CodingKeys: String, CodingKey {
        case kind, expr, tz
        case staggerMs = "stagger_ms"
        case everyMs = "every_ms"
        case anchorMs = "anchor_ms"
    }
}

struct CronPayload: Codable {
    let kind: String?
    let message: String?
    let model: String?
    let timeoutSeconds: Int?

    enum CodingKeys: String, CodingKey {
        case kind, message, model
        case timeoutSeconds = "timeout_seconds"
    }
}

struct CronJobState: Codable {
    let nextRunAtMs: Int64?
    let lastRunAtMs: Int64?
    let lastStatus: String?
    let lastDurationMs: Int64?
    let consecutiveErrors: Int?
    let lastError: String?

    enum CodingKeys: String, CodingKey {
        case nextRunAtMs = "next_run_at_ms"
        case lastRunAtMs = "last_run_at_ms"
        case lastStatus = "last_status"
        case lastDurationMs = "last_duration_ms"
        case consecutiveErrors = "consecutive_errors"
        case lastError = "last_error"
    }
}

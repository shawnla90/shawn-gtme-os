import SwiftUI

enum Theme {
    // Core colors
    static let background = Color(hex: "#0D0D0D")
    static let surface = Color(hex: "#1A1A1A")
    static let surfaceElevated = Color(hex: "#242424")
    static let border = Color(hex: "#333333")
    static let accent = Color(hex: "#4EC373")
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: "#999999")
    static let textMuted = Color(hex: "#666666")

    // Platform colors
    static func platformColor(_ platform: String) -> Color {
        switch platform.lowercased() {
        case "linkedin": return Color(hex: "#0A66C2")
        case "x": return Color(hex: "#FFFFFF")
        case "substack": return Color(hex: "#FF6719")
        case "website": return Color(hex: "#4EC373")
        case "reddit": return Color(hex: "#FF4500")
        case "tiktok": return Color(hex: "#EE1D52")
        case "youtube": return Color(hex: "#FF0000")
        default: return accent
        }
    }

    // Grade colors
    static func gradeColor(_ grade: String) -> Color {
        switch grade.uppercased() {
        case "S+", "S": return Color(hex: "#FFD700")
        case "A+", "A", "A-": return Color(hex: "#4EC373")
        case "B+", "B", "B-": return Color(hex: "#4A9EFF")
        case "C+", "C", "C-": return Color(hex: "#FFD700")
        case "D+", "D", "D-": return Color(hex: "#FF4444")
        case "F": return Color(hex: "#FF0000")
        default: return textSecondary
        }
    }

    // Status colors
    static let statusOK = Color(hex: "#4EC373")
    static let statusError = Color(hex: "#FF4444")
    static let statusWarning = Color(hex: "#FFD700")
    static let statusDisabled = Color(hex: "#666666")

    // Fonts
    static let monoSmall = Font.system(size: 11, design: .monospaced)
    static let monoBody = Font.system(size: 13, design: .monospaced)
    static let monoTitle = Font.system(size: 15, weight: .semibold, design: .monospaced)
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: Double
        switch hex.count {
        case 6:
            r = Double((int >> 16) & 0xFF) / 255.0
            g = Double((int >> 8) & 0xFF) / 255.0
            b = Double(int & 0xFF) / 255.0
        default:
            r = 1; g = 1; b = 1
        }
        self.init(red: r, green: g, blue: b)
    }
}

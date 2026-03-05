import SwiftUI

struct PlatformBadge: View {
    let platform: String

    var body: some View {
        Text(platform.uppercased())
            .font(.system(size: 9, weight: .bold, design: .monospaced))
            .foregroundColor(.white)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(Theme.platformColor(platform))
            .clipShape(RoundedRectangle(cornerRadius: 3))
    }
}

struct StageBadge: View {
    let stage: String

    var body: some View {
        Text(stage.uppercased())
            .font(.system(size: 9, weight: .bold, design: .monospaced))
            .foregroundColor(stage == "final" ? .black : Theme.textSecondary)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(stage == "final" ? Theme.accent : Theme.surfaceElevated)
            .clipShape(RoundedRectangle(cornerRadius: 3))
    }
}

struct GradeBadge: View {
    let grade: String
    var size: CGFloat = 28

    var body: some View {
        Text(grade)
            .font(.system(size: size * 0.5, weight: .black, design: .monospaced))
            .foregroundColor(Theme.gradeColor(grade))
            .frame(width: size, height: size)
            .background(Theme.gradeColor(grade).opacity(0.15))
            .clipShape(RoundedRectangle(cornerRadius: 4))
            .overlay(
                RoundedRectangle(cornerRadius: 4)
                    .stroke(Theme.gradeColor(grade).opacity(0.3), lineWidth: 1)
            )
    }
}

struct StatusDot: View {
    let color: Color

    var body: some View {
        Circle()
            .fill(color)
            .frame(width: 8, height: 8)
    }
}

struct StatCard: View {
    let title: String
    let value: String
    var subtitle: String? = nil
    var color: Color = Theme.accent

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(.system(size: 9, weight: .medium, design: .monospaced))
                .foregroundColor(Theme.textMuted)
            Text(value)
                .font(.system(size: 22, weight: .bold, design: .monospaced))
                .foregroundColor(color)
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Theme.border, lineWidth: 1)
        )
    }
}

struct TerminalPanel<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Title bar
            HStack(spacing: 6) {
                Circle().fill(Color(hex: "#FF5F56")).frame(width: 8, height: 8)
                Circle().fill(Color(hex: "#FFBD2E")).frame(width: 8, height: 8)
                Circle().fill(Color(hex: "#27C93F")).frame(width: 8, height: 8)
                Spacer()
                Text(title)
                    .font(.system(size: 11, weight: .medium, design: .monospaced))
                    .foregroundColor(Theme.textSecondary)
                Spacer()
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(hex: "#2D2D2D"))

            // Content
            content
                .padding(12)
        }
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Theme.border, lineWidth: 1)
        )
    }
}

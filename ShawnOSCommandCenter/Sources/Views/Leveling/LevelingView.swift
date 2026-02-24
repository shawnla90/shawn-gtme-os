import SwiftUI

struct LevelingView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Title
                HStack {
                    Text("TRIPLE LEVELING")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(Theme.textMuted)
                    Spacer()
                    Text("Three systems. One operator.")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundColor(Theme.textSecondary)
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)

                // Three columns
                HStack(alignment: .top, spacing: 12) {
                    DailyLevelCard()
                        .frame(maxWidth: .infinity)
                    WebsiteLevelCard()
                        .frame(maxWidth: .infinity)
                    NioLevelCard()
                        .frame(maxWidth: .infinity)
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .background(Theme.background)
        .navigationTitle("Leveling")
    }
}

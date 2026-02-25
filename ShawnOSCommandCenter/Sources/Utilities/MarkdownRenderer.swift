import SwiftUI
import Markdown

struct MarkdownView: View {
    let source: String

    var body: some View {
        let document = Document(parsing: source)
        var visitor = MarkdownToAttributedString()
        let attributed = visitor.visit(document)

        ScrollView {
            Text(attributed)
                .textSelection(.enabled)
                .font(Theme.monoBody)
                .foregroundColor(Theme.textPrimary)
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

private struct MarkdownToAttributedString: MarkupVisitor {
    typealias Result = AttributedString

    mutating func defaultVisit(_ markup: any Markup) -> AttributedString {
        var result = AttributedString()
        for child in markup.children {
            result.append(visit(child))
        }
        return result
    }

    mutating func visitDocument(_ document: Document) -> AttributedString {
        var result = AttributedString()
        for child in document.children {
            result.append(visit(child))
        }
        return result
    }

    mutating func visitHeading(_ heading: Heading) -> AttributedString {
        var result = AttributedString()
        for child in heading.children {
            result.append(visit(child))
        }
        let size: CGFloat = heading.level == 1 ? 22 : heading.level == 2 ? 18 : 15
        result.font = .system(size: size, weight: .bold, design: .monospaced)
        result.foregroundColor = .white

        var newline = AttributedString("\n\n")
        newline.font = .system(size: 8)
        result.append(newline)
        return result
    }

    mutating func visitParagraph(_ paragraph: Paragraph) -> AttributedString {
        var result = AttributedString()
        for child in paragraph.children {
            result.append(visit(child))
        }
        result.append(AttributedString("\n\n"))
        return result
    }

    mutating func visitText(_ text: Markdown.Text) -> AttributedString {
        var str = AttributedString(text.string)
        str.font = .system(size: 13, design: .monospaced)
        str.foregroundColor = Color(hex: "#CCCCCC")
        return str
    }

    mutating func visitStrong(_ strong: Strong) -> AttributedString {
        var result = AttributedString()
        for child in strong.children {
            result.append(visit(child))
        }
        result.font = .system(size: 13, weight: .bold, design: .monospaced)
        result.foregroundColor = .white
        return result
    }

    mutating func visitEmphasis(_ emphasis: Emphasis) -> AttributedString {
        var result = AttributedString()
        for child in emphasis.children {
            result.append(visit(child))
        }
        result.font = .system(size: 13, design: .monospaced).italic()
        return result
    }

    mutating func visitCodeBlock(_ codeBlock: CodeBlock) -> AttributedString {
        var str = AttributedString(codeBlock.code)
        str.font = .system(size: 12, design: .monospaced)
        str.foregroundColor = Color(hex: "#4EC373")
        str.backgroundColor = Color(hex: "#1A1A1A")
        var result = AttributedString("\n")
        result.append(str)
        result.append(AttributedString("\n\n"))
        return result
    }

    mutating func visitInlineCode(_ inlineCode: InlineCode) -> AttributedString {
        var str = AttributedString(inlineCode.code)
        str.font = .system(size: 12, design: .monospaced)
        str.foregroundColor = Color(hex: "#4EC373")
        str.backgroundColor = Color(hex: "#1A1A1A")
        return str
    }

    mutating func visitListItem(_ listItem: ListItem) -> AttributedString {
        var result = AttributedString("  • ")
        result.font = .system(size: 13, design: .monospaced)
        result.foregroundColor = Color(hex: "#4EC373")
        for child in listItem.children {
            result.append(visit(child))
        }
        return result
    }

    mutating func visitBlockQuote(_ blockQuote: BlockQuote) -> AttributedString {
        var result = AttributedString()
        for child in blockQuote.children {
            var childResult = visit(child)
            childResult.foregroundColor = Color(hex: "#999999")
            result.append(AttributedString("│ "))
            result.append(childResult)
        }
        return result
    }

    mutating func visitLink(_ link: Markdown.Link) -> AttributedString {
        var result = AttributedString()
        for child in link.children {
            result.append(visit(child))
        }
        result.foregroundColor = Color(hex: "#4A9EFF")
        result.underlineStyle = .single
        return result
    }

    mutating func visitSoftBreak(_ softBreak: SoftBreak) -> AttributedString {
        AttributedString("\n")
    }

    mutating func visitLineBreak(_ lineBreak: LineBreak) -> AttributedString {
        AttributedString("\n")
    }

    mutating func visitThematicBreak(_ thematicBreak: ThematicBreak) -> AttributedString {
        var str = AttributedString("\n────────────────────────────\n\n")
        str.foregroundColor = Color(hex: "#333333")
        return str
    }
}

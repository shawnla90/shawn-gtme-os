import Foundation

struct ParsedMarkdown {
    let frontmatter: [String: String]
    let body: String
}

enum FrontmatterParser {
    /// Parse blockquote-style metadata: `> **Key**: Value`
    static func parseBlockquote(_ text: String) -> [String: String] {
        var result: [String: String] = [:]
        let pattern = #"^>\s*\*\*(.+?)\*\*:\s*(.+)$"#
        guard let regex = try? NSRegularExpression(pattern: pattern, options: .anchorsMatchLines) else { return result }
        let matches = regex.matches(in: text, range: NSRange(text.startIndex..., in: text))
        for match in matches {
            if let keyRange = Range(match.range(at: 1), in: text),
               let valueRange = Range(match.range(at: 2), in: text) {
                let key = String(text[keyRange]).lowercased().trimmingCharacters(in: .whitespaces)
                let value = String(text[valueRange]).trimmingCharacters(in: .whitespaces)
                result[key] = value
            }
        }
        return result
    }

    /// Parse YAML frontmatter: `---\nkey: value\n---`
    static func parseYAML(_ text: String) -> [String: String] {
        var result: [String: String] = [:]
        guard text.hasPrefix("---") else { return result }
        let lines = text.components(separatedBy: "\n")
        var inFrontmatter = false
        for line in lines {
            if line.trimmingCharacters(in: .whitespaces) == "---" {
                if inFrontmatter { break }
                inFrontmatter = true
                continue
            }
            if inFrontmatter {
                let parts = line.split(separator: ":", maxSplits: 1)
                if parts.count == 2 {
                    let key = String(parts[0]).trimmingCharacters(in: .whitespaces).lowercased()
                    var value = String(parts[1]).trimmingCharacters(in: .whitespaces)
                    // Strip quotes
                    if value.hasPrefix("\"") && value.hasSuffix("\"") {
                        value = String(value.dropFirst().dropLast())
                    }
                    result[key] = value
                }
            }
        }
        return result
    }

    /// Parse a markdown file, extracting frontmatter (YAML or blockquote) and body
    static func parse(_ text: String) -> ParsedMarkdown {
        // Try YAML first
        if text.hasPrefix("---") {
            let yaml = parseYAML(text)
            if !yaml.isEmpty {
                // Strip frontmatter from body
                let lines = text.components(separatedBy: "\n")
                var bodyStart = 0
                var foundFirst = false
                for (i, line) in lines.enumerated() {
                    if line.trimmingCharacters(in: .whitespaces) == "---" {
                        if foundFirst {
                            bodyStart = i + 1
                            break
                        }
                        foundFirst = true
                    }
                }
                let body = lines.dropFirst(bodyStart).joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines)
                return ParsedMarkdown(frontmatter: yaml, body: body)
            }
        }

        // Try blockquote
        let blockquote = parseBlockquote(text)
        if !blockquote.isEmpty {
            // Strip blockquote lines from body
            let lines = text.components(separatedBy: "\n")
            let bodyLines = lines.filter { !$0.hasPrefix("> **") }
            let body = bodyLines.joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines)
            return ParsedMarkdown(frontmatter: blockquote, body: body)
        }

        return ParsedMarkdown(frontmatter: [:], body: text)
    }
}

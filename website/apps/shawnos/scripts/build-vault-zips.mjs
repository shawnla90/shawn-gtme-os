#!/usr/bin/env node
// Prebuild: package content/vault/ into static downloads under public/downloads/vault/
//   <category>.zip   per category
//   vault-all.zip    everything
//   <category>/<file>.md   raw copies for per-file download links
// Also a safety gate: fails the build if any vault file leaks private strings.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const VAULT = path.join(HERE, '../../../../content/vault')
const OUT = path.join(HERE, '../public/downloads/vault')

// Anything matching these must never ship. `source:` frontmatter lines are
// allowed to reference ~/.claude/... provenance, so they're excluded per-line.
const BLOCKLIST = [
  /\/Users\//,
  /niobot/i,
  /leadalchemy/i,
  /DISCORD_/,
  /XAI_/,
  /hooks\.slack\.com|discord\.com\/api\/webhooks/i,
  /sk-[a-zA-Z0-9]{20,}/,
  /clearbox-gtm\.db|content-intel\.db/i,
]

if (!fs.existsSync(VAULT)) {
  console.log('[vault-zips] no content/vault dir — skipping (nothing to package)')
  process.exit(0)
}

const categories = fs
  .readdirSync(VAULT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

// ── safety gate ──────────────────────────────────────────────────────────────
let violations = 0
for (const cat of categories) {
  const dir = path.join(VAULT, cat)
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (/^source:\s/.test(line.trim())) return
      for (const re of BLOCKLIST) {
        if (re.test(line)) {
          console.error(`[vault-zips] BLOCKED ${cat}/${f}:${i + 1} matches ${re} → ${line.trim().slice(0, 120)}`)
          violations++
        }
      }
    })
  }
}
if (violations > 0) {
  console.error(`[vault-zips] ${violations} blocklist hit(s) — refusing to package. Clean content/vault and rebuild.`)
  process.exit(1)
}

// ── package ──────────────────────────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

function zipDir(entries, outFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outFile)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', resolve)
    archive.on('error', reject)
    archive.pipe(output)
    for (const { src, nameInZip } of entries) archive.file(src, { name: nameInZip })
    archive.finalize()
  })
}

const all = []
for (const cat of categories) {
  const dir = path.join(VAULT, cat)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const entries = files.map((f) => ({ src: path.join(dir, f), nameInZip: `${cat}/${f}` }))
  all.push(...entries)

  // raw per-file copies
  fs.mkdirSync(path.join(OUT, cat), { recursive: true })
  for (const f of files) fs.copyFileSync(path.join(dir, f), path.join(OUT, cat, f))

  await zipDir(entries, path.join(OUT, `${cat}.zip`))
  console.log(`[vault-zips] ${cat}.zip (${files.length} files)`)
}

await zipDir(all, path.join(OUT, 'vault-all.zip'))
console.log(`[vault-zips] vault-all.zip (${all.length} files) → ${OUT}`)

// Generates public/precache-manifest.json after `next build`.
// Lists every hashed /_next/static JS/CSS/font asset so the Service Worker can
// precache them and guarantee EVERY route boots offline (not just visited ones).
import { readdir, writeFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const STATIC_DIR = join(root, '.next', 'static')
const OUT = join(root, 'public', 'precache-manifest.json')
const INCLUDE = /\.(js|css|woff2?)$/i

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(full)))
    } else if (INCLUDE.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

async function main() {
  const files = await walk(STATIC_DIR)
  const urls = files.map(
    (f) => '/_next/static/' + relative(STATIC_DIR, f).split('\\').join('/'),
  )
  urls.sort()
  let bytes = 0
  for (const f of files) bytes += (await stat(f)).size
  await writeFile(OUT, JSON.stringify(urls), 'utf8')
  console.log(
    `[precache-manifest] wrote ${urls.length} assets (${(bytes / 1048576).toFixed(1)} MB) → public/precache-manifest.json`,
  )
}

main().catch((err) => {
  console.error('[precache-manifest] failed:', err)
  process.exit(1)
})

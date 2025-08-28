// Build .github/labels.json from src/labels sources
// Usage:
//   bun scripts/build-labels.ts [--include-optional]
// By default includes: core.json
// If --include-optional is provided, also merges scopes-optional.json

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

type Label = {
  name: string
  color: string
  description?: string
  replaces?: string[]
}

function dedupeMerge(arrays: Label[][]): Label[] {
  const map = new Map<string, Label>()
  for (const arr of arrays) {
    for (const item of arr) {
      // Later sources override earlier ones for the same name
      map.set(item.name, item)
    }
  }
  return Array.from(map.values())
}

async function readJsonArray<T = any>(path: string): Promise<T[]> {
  const raw = await readFile(path, 'utf8')
  try {
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) throw new Error('Expected array JSON')
    return data
  } catch (e) {
    throw new Error(`Failed parsing JSON at ${path}: ${(e as Error).message}`)
  }
}

async function main() {
  const includeOptional = process.argv.includes('--include-optional')

  const root = process.cwd()
  const src = (p: string) => resolve(root, 'src/labels', p)
  const outPath = resolve(root, '.github/labels.json')

  const core = await readJsonArray<Label>(src('core.json'))

  let parts: Label[][] = [core]

  if (includeOptional) {
    try {
      const scopesOptional = await readJsonArray<Label>(src('scopes-optional.json'))
      parts.push(scopesOptional)
    } catch (e) {
      console.warn('Optional scopes not included:', (e as Error).message)
    }
  }

  const merged = dedupeMerge(parts)

  // Basic validation
  for (const l of merged) {
    if (!l.name || !l.color) throw new Error(`Invalid label (missing name/color): ${JSON.stringify(l)}`)
  }

  const json = JSON.stringify(merged, null, 2) + '\n'
  await writeFile(outPath, json, 'utf8')
  console.log(`Wrote ${merged.length} labels to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


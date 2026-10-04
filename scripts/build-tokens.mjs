import { readFile, writeFile } from 'node:fs/promises'

const folder = new URL('../src/tokens/', import.meta.url)
const tokens = JSON.parse(await readFile(new URL('tokens.json', folder), 'utf8'))
await writeFile(new URL('theme.css', folder), `@theme {\n${Object.entries(tokens).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}\n`)

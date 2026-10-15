import { copyFile } from 'node:fs/promises'

await copyFile(new URL('../src/tokens/theme.css', import.meta.url), new URL('../dist/theme.css', import.meta.url))

await copyFile(new URL('../src/tokens/tokens.json', import.meta.url), new URL('../dist/tokens/tokens.json', import.meta.url))
await copyFile(new URL('../src/locales/resources.json', import.meta.url), new URL('../dist/locales/resources.json', import.meta.url))

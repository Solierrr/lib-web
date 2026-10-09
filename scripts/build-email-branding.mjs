import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'

await sharp(fileURLToPath(new URL('../src/assets/snowflake.svg', import.meta.url)))
  .resize(168, 168)
  .png()
  .toFile(fileURLToPath(new URL('../src/assets/email-logo.png', import.meta.url)))

const tokens = JSON.parse(await readFile(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'))
const width = 92
const height = 460
const gap = 46
const marks = []
for (let y = 0; y <= height; y += gap) {
  marks.push(`<path d="M0 ${y}H${width}"/><rect x="0" y="${y}" width="2" height="2" fill="${tokens['--color-black']}" stroke="none" opacity="0.6"/>`)
}
for (let x = 0; x <= width; x += gap) marks.push(`<path d="M${x} 0V${height}"/>`)
for (const [x, y] of [[4, 50], [50, 142], [4, 326]]) marks.push(`<rect x="${x}" y="${y}" width="38" height="38" rx="5" fill="${tokens['--color-orange']}" stroke="none" opacity="0.9"/>`)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="edge"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="ends" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset="0.12" stop-color="white"/><stop offset="0.82" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><mask id="fade"><rect width="100%" height="100%" fill="url(#edge)"/></mask><mask id="vertical"><rect width="100%" height="100%" fill="url(#ends)"/></mask></defs><g mask="url(#fade)"><g mask="url(#vertical)" stroke="${tokens['--color-black']}" stroke-width="0.7" opacity="0.18">${marks.join('')}</g></g></svg>`
const frame = await sharp(Buffer.from(svg)).resize(width * 2, height * 2).png().toBuffer()
await sharp(frame).toFile(fileURLToPath(new URL('../src/assets/email-canvas-left.png', import.meta.url)))
await sharp(frame).flop().toFile(fileURLToPath(new URL('../src/assets/email-canvas-right.png', import.meta.url)))

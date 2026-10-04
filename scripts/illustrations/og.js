// Genera la imagen para redes (Open Graph, 1200 × 630) de cada herramienta a partir de su ilustración SVG:
// la escena 16:9 se dibuja a 1120 × 630 y se completa a los lados repitiendo el borde (sirve también para fondos con degradado).
// Uso: node scripts/illustrations/og.js   (escribe public/images/og/{nombre}.webp)

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..', '..')
const TOOLS_DIR = path.join(ROOT, 'public', 'images', 'tools')
const OG_DIR = path.join(ROOT, 'public', 'images', 'og')
const W = 1200
const H = 630

async function main() {
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'))
  fs.mkdirSync(OG_DIR, { recursive: true })
  const faltan = []
  for (const t of tools) {
    const nombre = (t.image?.file || `${t.slug}.webp`).replace(/\.webp$/, '')
    const svgPath = path.join(TOOLS_DIR, `${nombre}.svg`)
    if (!fs.existsSync(svgPath)) {
      faltan.push(t.slug)
      continue
    }
    const escena = await sharp(svgPath, { density: (72 * H) / 450 }).resize({ height: H }).png().toBuffer()
    const { width } = await sharp(escena).metadata()
    const lado = Math.floor((W - width) / 2)
    await sharp(escena)
      .extend({ left: lado, right: W - width - lado, top: 0, bottom: 0, extendWith: 'copy' })
      .flatten({ background: '#FFFFFF' })
      .webp({ quality: 85 })
      .toFile(path.join(OG_DIR, `${nombre}.webp`))
  }
  console.log(`Imágenes OG: ${tools.length - faltan.length} generadas${faltan.length ? `, sin SVG: ${faltan.join(', ')}` : ''}`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})

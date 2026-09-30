// Genera las ilustraciones de las herramientas: SVG y WebP con nombre de palabra clave long tail.
// Uso: node scripts/illustrations/build.js [--solo=slug1,slug2] [--hoja=archivo.png]
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { svg } = require('./kit')

const ROOT = path.join(__dirname, '..', '..')
const OUT = path.join(ROOT, 'public', 'images', 'tools')
const args = process.argv.slice(2)
const solo = (args.find((a) => a.startsWith('--solo=')) || '').slice(7).split(',').filter(Boolean)
const hoja = (args.find((a) => a.startsWith('--hoja=')) || '').slice(7)

const escenas = fs
  .readdirSync(__dirname)
  .filter((f) => /^scenes-\d+\.js$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))
  .flatMap((f) => require(path.join(__dirname, f)))

async function main() {
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'))
  const slugs = new Set(tools.map((t) => t.slug))
  const archivos = new Set()
  const lista = solo.length ? escenas.filter((e) => solo.includes(e.slug)) : escenas
  const generadas = []
  for (const e of lista) {
    if (!slugs.has(e.slug)) throw new Error(`Escena para una herramienta inexistente: ${e.slug}`)
    if (archivos.has(e.file) || slugs.has(e.file)) throw new Error(`Nombre de archivo repetido o igual a un slug: ${e.file}`)
    archivos.add(e.file)
    const code = svg(e.draw(), e.alt)
    fs.writeFileSync(path.join(OUT, `${e.file}.svg`), code)
    const webp = path.join(OUT, `${e.file}.webp`)
    await sharp(Buffer.from(code)).webp({ quality: 88 }).toFile(webp)
    generadas.push({ ...e, webp })
  }
  console.log(`Generadas ${generadas.length} ilustraciones`)
  if (hoja) {
    // Hoja de contacto para revisar varias ilustraciones de un vistazo.
    const cols = 3
    const tw = 400
    const th = 225
    const composites = await Promise.all(
      generadas.map(async (g, i) => ({ input: await sharp(g.webp).resize(tw, th).toBuffer(), left: (i % cols) * tw, top: Math.floor(i / cols) * (th + 24) }))
    )
    const labels = generadas.map((g, i) => `<text x="${(i % cols) * tw + 8}" y="${Math.floor(i / cols) * (th + 24) + th + 17}" font-family="Arial" font-size="14" fill="#111">${g.slug}</text>`).join('')
    const H = Math.ceil(generadas.length / cols) * (th + 24)
    await sharp({ create: { width: cols * tw, height: H, channels: 3, background: '#ffffff' } })
      .composite([...composites, { input: Buffer.from(`<svg width="${cols * tw}" height="${H}">${labels}</svg>`), left: 0, top: 0 }])
      .png()
      .toFile(hoja)
    console.log(`Hoja de contacto: ${hoja}`)
  }
  // Manifiesto con archivo y texto alternativo de cada herramienta, para enlazarlo en data/tools.json.
  const manifiesto = Object.fromEntries(escenas.map((e) => [e.slug, { file: `${e.file}.webp`, alt: e.alt }]))
  fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifiesto, null, 2) + '\n')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})

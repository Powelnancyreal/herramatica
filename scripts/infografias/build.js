// Genera las infografías de contenido de las herramientas (public/images/infografias/*.webp).
// A diferencia de las ilustraciones, cada infografía explica algo con datos reales: una fórmula, una tabla
// oficial o un ejemplo resuelto. Ancho fijo de 800 px y texto de 20 px o más para que se lea en el móvil.
// Uso: node scripts/infografias/build.js [--solo=archivo1,archivo2]

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const piezas = require('./piezas')

const ROOT = path.join(__dirname, '..', '..')
const OUT = path.join(ROOT, 'public', 'images', 'infografias')
const solo = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7).split(',').filter(Boolean)

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const lista = solo.length ? piezas.filter((p) => solo.includes(p.archivo)) : piezas
  const manifiesto = {}
  for (const p of lista) {
    const { svg, alto } = p.dibujar()
    fs.writeFileSync(path.join(OUT, `${p.archivo}.svg`), svg)
    await sharp(Buffer.from(svg), { density: 144 }).resize(1600).webp({ quality: 86 }).toFile(path.join(OUT, `${p.archivo}.webp`))
    manifiesto[p.archivo] = { archivo: `${p.archivo}.webp`, alt: p.alt, ancho: 800, alto }
    console.log(`${p.archivo}.webp  800×${alto}`)
  }
  const ruta = path.join(__dirname, 'manifest.json')
  const previo = fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta, 'utf8')) : {}
  fs.writeFileSync(ruta, JSON.stringify({ ...previo, ...manifiesto }, null, 2) + '\n')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})

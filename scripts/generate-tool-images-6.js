const path = require('path')
const sharp = require('sharp')

const slugs = [
  'cm-a-pulgadas',
  'arroba-a-kilos',
  'calculadora-tiempo-lectura',
  'calcular-indemnizacion-despido',
  'calcular-sac-argentina',
  'calculadora-alquiler-argentina',
  'calculadora-plazo-fijo',
  'calculadora-interes-compuesto',
  'calculadora-sueldo-neto-argentina',
  'calculadora-area',
]

async function main() {
  const dir = path.join(__dirname, '..', 'public', 'images', 'tools')
  for (const slug of slugs) {
    const inputPath = path.join(dir, `${slug}.svg`)
    const outputPath = path.join(dir, `${slug}.webp`)
    await sharp(inputPath).webp({ quality: 90 }).toFile(outputPath)
    console.log(`Converted ${slug}.svg -> ${slug}.webp`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

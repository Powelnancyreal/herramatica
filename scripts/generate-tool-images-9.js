const path = require('path')
const sharp = require('sharp')

const slugs = [
  'calcular-gratificacion-peru',
  'calculadora-de-igv',
  'calcular-detraccion',
  'calculadora-de-matrices',
  'calculadora-de-ecuaciones',
  'calculadora-precios-influencers-tiktok',
  'calculadora-ip',
  'calculadora-regla-de-tres',
  'calculadora-de-pendiente',
  'calculadora-derivadas-integrales',
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

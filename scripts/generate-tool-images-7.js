const path = require('path')
const sharp = require('sharp')

const slugs = [
  'calculadora-volumen',
  'calculadora-calculos-combinados',
  'calculadora-resistencias',
  'calculadora-calorias',
  'calculadora-embarazo',
  'calculadora-peso-ideal',
  'calculadora-ciclos-sueno',
  'calculadora-de-escalas',
  'sopa-de-letras',
  'generador-de-letras-grandes',
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

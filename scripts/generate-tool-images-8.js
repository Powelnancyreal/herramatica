const path = require('path')
const sharp = require('sharp')

const slugs = [
  'generador-codigo-de-barras',
  'generador-de-crucigramas',
  'generador-de-nombres-para-free-fire',
  'generador-de-link-de-whatsapp',
  'calculadora-engagement-instagram',
  'calculador-de-horarios',
  'hexadecimal-a-texto',
  'ruleta-aleatoria-online',
  'calculadora-promedio-ponderado',
  'calculadora-cts-peru',
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

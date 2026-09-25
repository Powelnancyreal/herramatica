const path = require('path')
const sharp = require('sharp')

const slugs = [
  'calcular-velocidad-distancia-tiempo',
  'calcular-gasolina',
  'calcular-volumen-cilindro',
  'calcular-ritmo',
  'cronometro-online',
  'palabras-al-reves',
  'celsius-a-fahrenheit',
  'bar-a-psi',
  'medidas-de-cocina',
  'tipografia-para-instagram',
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

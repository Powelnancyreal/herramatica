const path = require('path')
const sharp = require('sharp')

const slugs = [
  'calcular-hipoteca',
  'calcular-letra-dni',
  'calculo-pension-jubilacion',
  'calculadora-apiretal',
  'calculadora-del-amor',
  'calcular-nit',
  'calcular-cuil',
  'calcular-rut',
  'calcular-area-circulo',
  'calcular-hexadecimal-a-decimal',
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

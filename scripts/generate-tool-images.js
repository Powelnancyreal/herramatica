const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function convertDir(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'))
  for (const file of files) {
    const inputPath = path.join(dir, file)
    const outputPath = path.join(dir, file.replace(/\.svg$/, '.webp'))
    await sharp(inputPath).webp({ quality: 90 }).toFile(outputPath)
    console.log(`Converted ${file} -> ${path.basename(outputPath)}`)
  }
}

async function main() {
  await convertDir(path.join(__dirname, '..', 'public', 'images', 'tools'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

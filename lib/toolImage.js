import fs from 'fs'
import path from 'path'

// Ilustración de cada herramienta en /images/tools. Las nuevas declaran en tools.json un nombre de archivo
// con palabra clave long-tail y su texto alternativo (tool.image); las antiguas usan el slug como nombre.
export function getToolImage(tool) {
  const file = tool.image?.file || `${tool.slug}.webp`
  if (!fs.existsSync(path.join(process.cwd(), 'public', 'images', 'tools', file))) return null
  return { src: `/images/tools/${file}`, alt: tool.image?.alt || null }
}

// Versión 1200 × 630 para Open Graph y Twitter (scripts/illustrations/og.js), con el mismo nombre de archivo.
export function getToolOgImage(tool) {
  const file = tool.image?.file || `${tool.slug}.webp`
  if (!fs.existsSync(path.join(process.cwd(), 'public', 'images', 'og', file))) return null
  return { src: `/images/og/${file}`, alt: tool.image?.alt || null }
}

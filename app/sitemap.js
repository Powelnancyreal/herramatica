import fs from 'fs'
import path from 'path'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import fechas from '@/data/fechas.json'
import { todosLosArticulos } from '@/lib/blog'

const SITE_URL = 'https://herramatica.com'

export const dynamic = 'force-static'

function imageIfExists(relativePath) {
  const filePath = path.join(process.cwd(), 'public', relativePath)
  return fs.existsSync(filePath) ? [`${SITE_URL}/${relativePath}`] : undefined
}

// <lastmod> = fecha real del último cambio de contenido de cada página (data/fechas.json, generado por
// scripts/fechas-actualizacion.js antes de cada build). Nunca la fecha de compilación: Google deja de
// confiar en el lastmod de un sitio cuando no coincide con los cambios reales.
const fecha = (iso) => new Date(`${iso}T12:00:00Z`)
const masReciente = (...isos) => isos.filter(Boolean).sort().at(-1)
const herramienta = (slug) => fechas.herramientas[slug]

export default function sitemap() {
  const articulos = todosLosArticulos()
  const ultimaHerramienta = masReciente(...toolsData.map((t) => herramienta(t.slug)?.creado))
  const ultimoArticulo = masReciente(...articulos.map((a) => a.actualizado))

  // La portada lista las herramientas más recientes: cambia cuando cambia ella o cuando se publica algo nuevo.
  const homeRoute = {
    url: SITE_URL,
    lastModified: fecha(masReciente(fechas.paginas.inicio, ultimaHerramienta, ultimoArticulo)),
    changeFrequency: 'weekly',
    priority: 1.0,
    images: imageIfExists('images/hero-home.webp'),
  }

  // Una categoría cambia cuando se edita su página o cuando se le añade una herramienta.
  const categoryRoutes = categoriesData.map((cat) => {
    const altas = toolsData.filter((t) => t.category === cat.slug).map((t) => herramienta(t.slug)?.creado)
    return {
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: fecha(masReciente(fechas.paginas[cat.slug], ...altas)),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: imageIfExists(`images/cat-${cat.slug}.webp`),
    }
  })

  const toolRoutes = toolsData.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: fecha(herramienta(tool.slug).actualizado),
    changeFrequency: 'monthly',
    priority: 0.8,
    images: imageIfExists(`images/tools/${tool.image?.file || `${tool.slug}.webp`}`),
  }))

  const blogRoutes = articulos.length
    ? [
        { url: `${SITE_URL}/blog`, lastModified: fecha(ultimoArticulo), changeFrequency: 'weekly', priority: 0.7 },
        ...articulos.map((a) => ({
          url: `${SITE_URL}/blog/${a.slug}`,
          lastModified: fecha(a.actualizado),
          changeFrequency: 'monthly',
          priority: 0.7,
        })),
      ]
    : []

  const legalRoutes = ['privacidad', 'terminos', 'cookies', 'acerca', 'contacto'].map((p) => ({
    url: `${SITE_URL}/${p}`,
    lastModified: fecha(fechas.paginas[p]),
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [homeRoute, ...categoryRoutes, ...toolRoutes, ...blogRoutes, ...legalRoutes]
}

import fs from 'fs'
import path from 'path'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import { todosLosArticulos } from '@/lib/blog'

const SITE_URL = 'https://herramatica.com'

export const dynamic = 'force-static'

function imageIfExists(relativePath) {
  const filePath = path.join(process.cwd(), 'public', relativePath)
  return fs.existsSync(filePath) ? [`${SITE_URL}/${relativePath}`] : undefined
}

export default function sitemap() {
  const now = new Date()

  const homeRoute = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
    images: imageIfExists('images/hero-home.webp'),
  }

  const categoryRoutes = categoriesData.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
    images: imageIfExists(`images/cat-${cat.slug}.webp`),
  }))

  const toolRoutes = toolsData.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
    images: imageIfExists(`images/tools/${tool.image?.file || `${tool.slug}.webp`}`),
  }))

  const legalRoutes = ['/privacidad', '/terminos', '/cookies', '/acerca', '/contacto'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  // Blog: la fecha de cada artículo es la de su última actualización real, no la de compilación.
  const articulos = todosLosArticulos()
  const blogRoutes = articulos.length
    ? [
        {
          url: `${SITE_URL}/blog`,
          lastModified: new Date(articulos.map((a) => a.actualizado).sort().at(-1)),
          changeFrequency: 'weekly',
          priority: 0.7,
        },
        ...articulos.map((a) => ({
          url: `${SITE_URL}/blog/${a.slug}`,
          lastModified: new Date(a.actualizado),
          changeFrequency: 'monthly',
          priority: 0.7,
        })),
      ]
    : []

  return [homeRoute, ...categoryRoutes, ...toolRoutes, ...blogRoutes, ...legalRoutes]
}

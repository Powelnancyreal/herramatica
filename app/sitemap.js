import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'

const SITE_URL = 'https://herramatica.com'

export const dynamic = 'force-static'

export default function sitemap() {
  const staticRoutes = ['', '/privacidad', '/terminos', '/cookies', '/acerca', '/contacto'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))

  const categoryRoutes = categoriesData.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: new Date(),
  }))

  const toolRoutes = toolsData.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}

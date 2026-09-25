import fs from 'fs'
import path from 'path'

const SITE_NAME = 'Herramatica'
const SITE_URL = 'https://herramatica.com'
const SITE_DESCRIPTION = 'Más de 90 herramientas online gratuitas en español: calculadoras, generadores, convertidores, texto y juegos. Sin registro, sin límites. Completamente gratis.'
const OG_LOCALE = 'es'
const OG_ALTERNATE_LOCALES = ['es_MX', 'es_AR', 'es_CO', 'es_PE', 'es_CL', 'es_ES']

function getToolShareImage(tool) {
  const hasToolImage = fs.existsSync(path.join(process.cwd(), 'public', 'images', 'tools', `${tool.slug}.webp`))
  if (hasToolImage) {
    return { url: `${SITE_URL}/images/tools/${tool.slug}.webp`, width: 800, height: 450, alt: tool.name }
  }
  return {
    url: `${SITE_URL}/images/og-image.webp`,
    width: 1200,
    height: 630,
    alt: 'Herramatica - Herramientas online gratuitas en español',
  }
}

export function generateToolMetadata(tool) {
  const shareImage = getToolShareImage(tool)

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `${SITE_URL}/${tool.slug}`,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      alternateLocale: OG_ALTERNATE_LOCALES,
      type: 'website',
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [shareImage.url],
    },
    alternates: {
      canonical: `${SITE_URL}/${tool.slug}`,
    },
  }
}

export function generateCategoryMetadata(category) {
  const titles = {
    generadores: 'Generadores Online Gratis | Herramatica',
    calculadoras: 'Calculadoras Online Gratis | Herramatica',
    texto: 'Herramientas de Texto Online Gratis | Herramatica',
    juegos: 'Juegos Online Gratis | Herramatica',
    convertidores: 'Convertidores Online Gratis | Herramatica',
  }
  const descriptions = {
    generadores: 'Descubre todos nuestros generadores online gratuitos. Genera texto, contenido y más con un solo clic.',
    calculadoras: 'Calculadoras online precisas y gratuitas. Calcula edades, porcentajes, conversiones y mucho más.',
    texto: 'Herramientas de texto gratuitas. Transforma, analiza y manipula texto de forma sencilla.',
    juegos: 'Juegos y ejercicios interactivos gratuitos para entrenar tu mente, sin registro.',
    convertidores: 'Convierte monedas y unidades de medida al instante, gratis y sin registro.',
  }

  return {
    title: titles[category.slug] || `${category.name} | ${SITE_NAME}`,
    description: descriptions[category.slug] || category.description,
    openGraph: {
      title: titles[category.slug] || `${category.name} | ${SITE_NAME}`,
      description: descriptions[category.slug] || category.description,
      url: `${SITE_URL}/${category.slug}`,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      alternateLocale: OG_ALTERNATE_LOCALES,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${category.slug}`,
    },
  }
}

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION }

import { getToolImage } from '@/lib/toolImage'
import { REDES } from '@/lib/redes'

const SITE = 'https://herramatica.com'
// Identificadores estables para enlazar las entidades entre sí en el grafo de cada página.
export const ORG_ID = `${SITE}/#organization`
export const SITE_ID = `${SITE}/#website`

// Google solo reconoce ciertos valores de applicationCategory; los demás se traducen al más cercano.
const CATEGORIA_APP = { EducationApplication: 'EducationalApplication', MedicalApplication: 'HealthApplication', ProductivityApplication: 'BusinessApplication' }

function getToolImageUrl(tool) {
  const image = getToolImage(tool)
  return image ? `https://herramatica.com${image.src}` : null
}

export function generateFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateWebPageSchema({ title, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    inLanguage: 'es',
  }
}

export function generateWebAppSchema(tool) {
  const imageUrl = getToolImageUrl(tool)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE}/${tool.slug}#app`,
    name: tool.name,
    description: tool.metaDescription,
    url: `${SITE}/${tool.slug}`,
    applicationCategory: CATEGORIA_APP[tool.appCategory] || tool.appCategory || 'UtilitiesApplication',
    publisher: { '@id': ORG_ID },
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
    inLanguage: 'es',
    isAccessibleForFree: true,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 800,
        height: 450,
      },
    }),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

export function generateSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: 'Herramatica',
    publisher: { '@id': ORG_ID },
    url: 'https://herramatica.com',
    description: 'Más de 230 herramientas online gratuitas en español',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://herramatica.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Herramatica',
    foundingDate: '2026-08',
    knowsLanguage: 'es',
    url: 'https://herramatica.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://herramatica.com/images/logo.svg',
    },
    email: 'info@herramatica.com',
    sameAs: REDES.map((r) => r.url),
    description: 'Herramientas online gratuitas en español para todos los países hispanohablantes.',
    areaServed: [
      'México', 'Argentina', 'Colombia',
      'Chile', 'Perú', 'España',
      'Venezuela', 'Ecuador', 'Bolivia',
      'Paraguay', 'Uruguay', 'Guatemala',
      'Cuba', 'Honduras', 'El Salvador',
      'Nicaragua', 'Costa Rica', 'Panamá',
      'República Dominicana',
    ],
  }
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(articulo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articulo.titulo,
    description: articulo.metaDescription,
    url: articulo.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articulo.url },
    datePublished: articulo.publicado,
    dateModified: articulo.actualizado,
    inLanguage: 'es-MX',
    wordCount: articulo.palabras,
    ...(articulo.imagen && { image: { '@type': 'ImageObject', url: articulo.imagen.url, width: articulo.imagen.width, height: articulo.imagen.height } }),
    author: { '@type': 'Organization', name: 'Equipo Herramatica', url: 'https://herramatica.com/acerca' },
    publisher: {
      '@type': 'Organization',
      name: 'Herramatica',
      url: 'https://herramatica.com',
      logo: { '@type': 'ImageObject', url: 'https://herramatica.com/images/logo.svg' },
    },
  }
}

// Página de herramienta: quién la publica y la revisa, cuándo, con qué fuentes y dónde está en el sitio.
// Refuerza las señales de experiencia y fiabilidad (E-E-A-T) y conecta la página con la organización y el sitio.
export function generateToolPageSchema(tool, { creado, actualizado, categoria }) {
  const url = `${SITE}/${tool.slug}`
  const fuentes = (tool.bloques || []).filter((b) => b.tipo === 'fuentes').flatMap((b) => b.items)
  const infografias = (tool.bloques || []).filter((b) => b.tipo === 'infografia')
  const ilustracion = getToolImageUrl(tool)
  const imagenes = [
    ...(ilustracion ? [{ '@type': 'ImageObject', url: ilustracion, width: 800, height: 450, caption: tool.image?.alt || tool.name }] : []),
    ...infografias.map((b) => ({ '@type': 'ImageObject', url: `${SITE}/images/infografias/${b.archivo}`, width: b.ancho || 800, height: b.alto, caption: b.alt })),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: tool.metaTitle,
    description: tool.metaDescription,
    inLanguage: 'es',
    isPartOf: { '@id': SITE_ID },
    about: { '@type': 'Thing', name: tool.shortName || tool.name },
    mainEntity: { '@id': `${url}#app` },
    ...(creado && { datePublished: creado }),
    ...(actualizado && { dateModified: actualizado, lastReviewed: actualizado }),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    reviewedBy: { '@id': ORG_ID },
    ...(imagenes.length && { primaryImageOfPage: imagenes[0], image: imagenes }),
    ...(fuentes.length && { citation: fuentes.map((f) => ({ '@type': 'CreativeWork', name: f.texto, url: f.url })) }),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
        { '@type': 'ListItem', position: 2, name: categoria.name, item: `${SITE}/${categoria.slug}` },
        { '@type': 'ListItem', position: 3, name: tool.shortName || tool.name, item: url },
      ],
    },
  }
}

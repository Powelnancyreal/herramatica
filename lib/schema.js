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
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.metaTitle,
    description: tool.metaDescription,
    url: `https://herramatica.com/${tool.slug}`,
    applicationCategory: tool.appCategory || 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
    inLanguage: 'es',
    isAccessibleForFree: true,
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
    name: 'Herramatica',
    url: 'https://herramatica.com',
    description: 'Herramientas online gratuitas en español',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://herramatica.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

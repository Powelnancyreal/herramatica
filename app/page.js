import Link from 'next/link'
import Image from 'next/image'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import { SITE_DESCRIPTION } from '@/lib/seo'

export const metadata = {
  title: 'Herramatica | Herramientas Online Gratuitas en Español',
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: 'https://herramatica.com',
    languages: {
      'es-MX': 'https://herramatica.com',
      'es-AR': 'https://herramatica.com',
      'es-CO': 'https://herramatica.com',
      'es-PE': 'https://herramatica.com',
      'es-CL': 'https://herramatica.com',
      'es-ES': 'https://herramatica.com',
      es: 'https://herramatica.com',
      'x-default': 'https://herramatica.com',
    },
  },
}

const categoryColors = {
  generadores: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'bg-blue-100 text-blue-600',
    hover: 'hover:border-blue-400',
  },
  calculadoras: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    icon: 'bg-green-100 text-green-600',
    hover: 'hover:border-green-400',
  },
  texto: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    icon: 'bg-purple-100 text-purple-600',
    hover: 'hover:border-purple-400',
  },
  juegos: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    icon: 'bg-orange-100 text-orange-600',
    hover: 'hover:border-orange-400',
  },
  convertidores: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    icon: 'bg-teal-100 text-teal-600',
    hover: 'hover:border-teal-400',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Herramientas online<br className="hidden sm:block" /> gratuitas en español
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto text-center mt-4 mb-8">
            Herramatica es tu colección de herramientas online gratuitas en español. Más de 90 utilidades para
            calcular, convertir y generar contenido al instante. Sin registro, sin límites, disponibles para México,
            Argentina, Colombia, Chile, Perú, España y todos los países de habla hispana.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesData.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Image
          src="/images/hero-home.webp"
          alt="Herramientas online gratuitas en español - calculadoras, generadores y más"
          width={1200}
          height={600}
          priority={true}
          unoptimized={true}
          className="w-full rounded-xl my-8"
        />

        {/* Categories */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Herramientas por Categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categoriesData.map((cat) => {
              const c = categoryColors[cat.slug] || {}
              const catTools = toolsData.filter((t) => t.category === cat.slug)
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={`group p-6 rounded-2xl border-2 ${c.bg} ${c.border} ${c.hover} transition-all hover:shadow-md`}
                >
                  <Image
                    src={`/images/cat-${cat.slug}.webp`}
                    alt={`${cat.name} - herramientas online gratis en español`}
                    width={800}
                    height={400}
                    unoptimized={true}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
                  <p className="text-xs text-gray-500 mt-3 font-medium">
                    {catTools.length} herramienta{catTools.length !== 1 ? 's' : ''}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* All tools */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las Herramientas Gratuitas en Español</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolsData.map((tool) => {
              const c = categoryColors[tool.category] || {}
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {tool.name}
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tool.metaDescription}</p>
                  <span
                    className={`inline-block mt-3 text-xs font-medium px-2.5 py-0.5 rounded-full ${c.badge || 'bg-gray-100 text-gray-600'}`}
                  >
                    {tool.category}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* SEO content block */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir Herramatica?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {[
              {
                icon: '⚡',
                title: 'Rápido y ligero',
                desc: 'Todas las herramientas funcionan directamente en tu navegador, sin servidores externos.',
              },
              {
                icon: '🔒',
                title: 'Privado y seguro',
                desc: 'Tus datos nunca salen de tu dispositivo. No almacenamos ninguna información.',
              },
              {
                icon: '🆓',
                title: 'Siempre gratuito',
                desc: 'Sin registro, sin suscripciones, sin límites. Todas las herramientas son 100% gratuitas.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

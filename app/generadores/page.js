import Link from 'next/link'
import toolsData from '@/data/tools.json'

export const metadata = {
  title: 'Generadores Online Gratis | Herramatica',
  description:
    'Descubre todos nuestros generadores online gratuitos. Genera texto invisible, nombres, contraseñas y mucho más con un solo clic.',
  alternates: { canonical: 'https://herramatica.com/generadores' },
}

export default function GeneradoresPage() {
  const tools = toolsData.filter((t) => t.category === 'generadores')

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Generadores</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">✨</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Generadores</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Herramientas para generar contenido de forma automática y rápida. Selecciona la que necesitas y empieza a usar.
        </p>
      </div>

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {tool.name}
                </h2>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tool.metaDescription}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Próximamente habrá herramientas en esta categoría.</p>
        </div>
      )}

      {/* SEO text */}
      <section className="mt-14 prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Qué son los generadores online?</h2>
        <p className="text-gray-700 leading-relaxed">
          Los generadores online son herramientas que crean contenido de forma automática a partir de tus parámetros. En Herramatica encontrarás generadores de todo tipo: texto invisible, nombres, contraseñas, y mucho más. Todas las herramientas funcionan directamente en tu navegador y son completamente gratuitas.
        </p>
      </section>
    </main>
  )
}

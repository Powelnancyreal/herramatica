import Link from 'next/link'
import toolsData from '@/data/tools.json'

export const metadata = {
  title: 'Juegos Online Gratis | Herramatica',
  description:
    'Juegos y ejercicios interactivos gratuitos para entrenar tu mente. Cálculo mental, memoria y más, directamente en tu navegador.',
  alternates: { canonical: 'https://herramatica.com/juegos' },
}

export default function JuegosPage() {
  const tools = toolsData.filter((t) => t.category === 'juegos')

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Juegos</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🧠</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Juegos</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Juegos y ejercicios interactivos para entrenar tu mente. Practica sin registro y mejora con cada partida.
        </p>
      </div>

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {tool.name}
                </h2>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-orange-500 flex-shrink-0 mt-0.5 transition-colors"
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
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Por qué usar nuestros juegos educativos?</h2>
        <p className="text-gray-700 leading-relaxed">
          Nuestros juegos funcionan directamente en tu navegador, sin instalar nada y sin crear una cuenta. Están pensados para entrenar habilidades concretas (como el cálculo mental) con niveles de dificultad ajustables, seguimiento de tu progreso y retos contrarreloj. Todos son gratuitos y accesibles desde cualquier dispositivo.
        </p>
      </section>
    </main>
  )
}

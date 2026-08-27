import Link from 'next/link'
import toolsData from '@/data/tools.json'

export const metadata = {
  title: 'Calculadoras Online Gratis | Herramatica',
  description:
    'Calculadoras online precisas y gratuitas. Calcula edades, porcentajes, conversiones y mucho más al instante.',
  alternates: { canonical: 'https://herramatica.com/calculadoras' },
}

export default function CalculadorasPage() {
  const tools = toolsData.filter((t) => t.category === 'calculadoras')

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">Calculadoras</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔢</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Calculadoras</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Calculadoras precisas para resolver tus necesidades matemáticas y de cálculo. Resultados instantáneos sin necesidad de apps.
        </p>
      </div>

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-snug">
                  {tool.name}
                </h2>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-green-500 flex-shrink-0 mt-0.5 transition-colors"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Por qué usar nuestras calculadoras online?</h2>
        <p className="text-gray-700 leading-relaxed">
          Nuestras calculadoras online son herramientas precisas que funcionan directamente en tu navegador. No necesitas instalar ninguna aplicación ni crear una cuenta. Ofrecemos calculadoras de edad, porcentajes, conversiones de unidades y muchas más. Todas son gratuitas y accesibles desde cualquier dispositivo.
        </p>
      </section>
    </main>
  )
}

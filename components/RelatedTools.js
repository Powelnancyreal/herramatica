import Link from 'next/link'
import toolsData from '@/data/tools.json'

export default function RelatedTools({ relatedSlugs }) {
  if (!relatedSlugs || relatedSlugs.length === 0) return null

  const related = relatedSlugs
    .map((slug) => toolsData.find((t) => t.slug === slug))
    .filter(Boolean)

  if (related.length === 0) return null

  const categoryColors = {
    generadores: 'bg-blue-100 text-blue-700',
    calculadoras: 'bg-green-100 text-green-700',
    texto: 'bg-purple-100 text-purple-700',
    juegos: 'bg-orange-100 text-orange-700',
    convertidores: 'bg-teal-100 text-teal-700',
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Herramientas relacionadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.metaDescription}</p>
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                  categoryColors[tool.category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {tool.category}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  )
}

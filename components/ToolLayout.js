import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import FAQ from '@/components/FAQ'
import RelatedTools from '@/components/RelatedTools'

const toolImageOverrides = {
  'generador-qr': 'tool-qr',
}

function getToolImage(slug) {
  const baseName = toolImageOverrides[slug] || `tool-${slug}`
  const filePath = path.join(process.cwd(), 'public', 'images', `${baseName}.webp`)
  return fs.existsSync(filePath) ? `/images/${baseName}.webp` : null
}

export default function ToolLayout({ tool, children }) {
  const toolImage = getToolImage(tool.slug)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </a>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <a href={`/${tool.category}`} className="hover:text-blue-600 capitalize transition-colors">
              {tool.category}
            </a>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium truncate">{tool.shortName}</li>
        </ol>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{tool.name}</h1>

      {toolImage && (
        <Image
          src={toolImage}
          alt={`${tool.name} - herramienta online gratis`}
          width={800}
          height={450}
          unoptimized={true}
          className="w-full rounded-xl my-6"
        />
      )}

      {/* Tool UI */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        {children}
      </div>

      {/* Intro */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{tool.intro}</p>
      </section>

      {/* Cómo usar */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo usar</h2>
          <ol className="space-y-3">
            {tool.howToUse.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Beneficios */}
      {tool.benefits && tool.benefits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beneficios</h2>
          <ul className="space-y-2">
            {tool.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Extended SEO content sections (optional, per-tool) */}
      {tool.contentSections && tool.contentSections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
          <p className="text-gray-700 leading-relaxed">{section.body}</p>
        </section>
      ))}

      {/* FAQ */}
      <FAQ faqs={tool.faqs} />

      {/* Related tools */}
      <RelatedTools relatedSlugs={tool.relatedTools} />
    </main>
  )
}

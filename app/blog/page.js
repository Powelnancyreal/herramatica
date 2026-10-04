import Link from 'next/link'
import { articulosPorCluster, todosLosArticulos, fechaLarga } from '@/lib/blog'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { hreflang } from '@/lib/seo'

const URL = 'https://herramatica.com/blog'
const TITULO = 'Blog de Herramatica: guías laborales y fiscales'
const DESCRIPCION = 'Guías claras sobre RFC, aguinaldo, vacaciones, prima vacacional y finiquito en México, con ejemplos reales y calculadoras gratis.'

export const metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: URL, languages: hreflang(URL) },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website' },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRIPCION },
}

export default function BlogIndex() {
  const clusters = articulosPorCluster()
  const total = todosLosArticulos().length
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://herramatica.com' },
    { name: 'Blog', url: URL },
  ])

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Ruta de navegación" className="text-sm text-stone-500 mb-8">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-purple-700">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-700" aria-current="page">Blog</li>
          </ol>
        </nav>

        <header className="max-w-3xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-4">Blog</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">Guías prácticas sobre tu trabajo y tus impuestos</h1>
          <p className="mt-5 text-lg text-stone-600 leading-relaxed">
            Explicaciones paso a paso, con ejemplos en pesos y la ley citada, para que entiendas qué te corresponde. Cada guía enlaza a la calculadora gratuita que te da tu cifra exacta.
          </p>
        </header>

        {total === 0 ? (
          <p className="text-stone-600">Muy pronto publicaremos las primeras guías.</p>
        ) : (
          clusters.map((c) => (
            <section key={c.id} className="mb-14" aria-labelledby={`cluster-${c.id}`}>
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-stone-900 pb-2 mb-6">
                <h2 id={`cluster-${c.id}`} className="font-serif text-2xl font-bold text-stone-900">{c.nombre}</h2>
                <span className="text-sm text-stone-500">{c.articulos.length} artículo{c.articulos.length !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-stone-600 -mt-3 mb-6">{c.descripcion}</p>
              <ul className="divide-y divide-stone-200">
                {c.articulos.map((a) => (
                  <li key={a.slug} className="py-5">
                    <Link href={`/blog/${a.slug}`} className="group block">
                      <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-purple-700 transition-colors">{a.titulo}</h3>
                      <p className="mt-1 text-stone-600">{a.extracto}</p>
                      <p className="mt-2 text-xs text-stone-500">
                        <time dateTime={a.actualizado}>{fechaLarga(a.actualizado)}</time>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

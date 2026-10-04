import Link from 'next/link'
import { CLUSTERS, fechaLarga } from '@/lib/blog'

// Plantilla editorial de los artículos: deliberadamente distinta de la de herramientas
// (columna de lectura estrecha, titulares con serifa, índice lateral y fondo blanco).
export default function ArticuloLayout({ articulo, relacionados }) {
  const cluster = CLUSTERS[articulo.cluster]

  return (
    <div className="bg-white">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <nav aria-label="Ruta de navegación" className="text-sm text-stone-500 mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-purple-700">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-purple-700">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-700 truncate max-w-[60vw]" aria-current="page">{articulo.titulo}</li>
          </ol>
        </nav>

        <header className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-4">{cluster?.nombre}</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">{articulo.titulo}</h1>
          <p className="mt-5 text-lg sm:text-xl text-stone-600 leading-relaxed">{articulo.extracto}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500 border-t border-stone-200 pt-4">
            <span>Por <strong className="text-stone-700 font-semibold">Equipo Herramatica</strong></span>
            <span>Publicado el <time dateTime={articulo.publicado}>{fechaLarga(articulo.publicado)}</time></span>
            {articulo.actualizado !== articulo.publicado && (
              <span>Actualizado el <time dateTime={articulo.actualizado}>{fechaLarga(articulo.actualizado)}</time></span>
            )}
            <span>{articulo.minutos} min de lectura</span>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
          <div className="max-w-3xl min-w-0">
            {articulo.indice.length > 2 && (
              <details className="lg:hidden mb-8 rounded-xl border border-stone-200 bg-stone-50">
                <summary className="cursor-pointer px-5 py-3 font-semibold text-stone-800">Contenido del artículo</summary>
                <Indice indice={articulo.indice} />
              </details>
            )}

            <div className="articulo" dangerouslySetInnerHTML={{ __html: articulo.html }} />

            {articulo.faqs?.length > 0 && (
              <section className="articulo mt-4" aria-labelledby="preguntas-frecuentes">
                <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
                <div className="not-articulo space-y-3">
                  {articulo.faqs.map((f) => (
                    <details key={f.question} className="group rounded-xl border border-stone-200 bg-stone-50 open:bg-white">
                      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-stone-900 flex justify-between gap-4">
                        <h3 className="text-base">{f.question}</h3>
                        <span className="text-purple-700 group-open:rotate-45 transition-transform text-xl leading-none" aria-hidden="true">+</span>
                      </summary>
                      <p className="px-5 pb-5 text-stone-700 leading-relaxed">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {articulo.herramienta && (
              <aside className="mt-12 rounded-2xl bg-purple-700 text-white p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-200">Herramienta gratuita</p>
                <p className="font-serif text-2xl font-bold mt-2">{articulo.herramienta.titulo}</p>
                <p className="mt-2 text-purple-100">{articulo.herramienta.texto}</p>
                <Link href={articulo.herramienta.href} className="inline-block mt-5 bg-white text-purple-800 font-bold px-5 py-3 rounded-xl hover:bg-purple-50">
                  {articulo.herramienta.boton} →
                </Link>
              </aside>
            )}

            {relacionados.length > 0 && (
              <section className="mt-12" aria-labelledby="relacionados">
                <h2 id="relacionados" className="font-serif text-2xl font-bold text-stone-900 mb-5">Artículos relacionados</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {relacionados.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/blog/${r.slug}`} className="block h-full rounded-xl border border-stone-200 p-5 hover:border-purple-400 hover:shadow-sm transition">
                        <span className="font-serif text-lg font-bold text-stone-900">{r.titulo}</span>
                        <span className="block mt-2 text-sm text-stone-600 line-clamp-2">{r.extracto}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {articulo.indice.length > 2 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 border-l-2 border-purple-200 pl-5">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">En este artículo</p>
                <Indice indice={articulo.indice} />
              </div>
            </aside>
          )}
        </div>
      </article>
    </div>
  )
}

function Indice({ indice }) {
  return (
    <nav aria-label="Contenido del artículo">
      <ol className="space-y-2 text-sm px-5 pb-4 lg:p-0">
        {indice.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-stone-600 hover:text-purple-700 leading-snug block">{h.texto}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

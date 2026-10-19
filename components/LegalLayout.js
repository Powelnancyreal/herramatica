import Link from 'next/link'

export const EMAIL = 'info@herramatica.com'
// Fecha de la última revisión de los textos legales. Cámbiala solo cuando cambie el contenido.
export const LEGAL_ACTUALIZADO = { iso: '2026-10-20', texto: '20 de octubre de 2026' }

export function Correo({ asunto }) {
  const href = asunto ? `mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}` : `mailto:${EMAIL}`
  return <a href={href} className="text-blue-600 underline underline-offset-2 hover:text-blue-700">{EMAIL}</a>
}

// Plantilla común de Privacidad, Términos y Cookies: resumen, índice y secciones numeradas.
export default function LegalLayout({ titulo, migaja, intro, resumen, secciones, otros }) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">{migaja}</li>
        </ol>
      </nav>

      <header className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{titulo}</h1>
        <p className="text-sm text-gray-500 mt-3">
          Última actualización: <time dateTime={LEGAL_ACTUALIZADO.iso}>{LEGAL_ACTUALIZADO.texto}</time>
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">{intro}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-12">
        <div className="max-w-3xl min-w-0">
          {resumen && (
            <aside className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6 mb-10">
              <p className="font-semibold text-gray-900 mb-3">En pocas palabras</p>
              <ul className="space-y-2 text-gray-700">
                {resumen.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <details className="lg:hidden mb-8 rounded-xl border border-gray-200 p-4">
            <summary className="cursor-pointer font-medium text-gray-900">Contenido</summary>
            <Indice secciones={secciones} />
          </details>

          <div className="space-y-10">
            {secciones.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  <span className="text-gray-400 mr-2">{i + 1}.</span>{s.titulo}
                </h2>
                <div className="legal-cuerpo space-y-3 text-gray-700 leading-relaxed">{s.cuerpo}</div>
              </section>
            ))}
          </div>

          {otros && (
            <nav aria-label="Otros textos legales" className="mt-14 border-t border-gray-200 pt-6 flex flex-wrap gap-3 text-sm">
              {otros.map((o) => (
                <Link key={o.href} href={o.href} className="rounded-full border border-gray-200 px-4 py-2 text-gray-700 hover:border-blue-300 hover:text-blue-700">
                  {o.texto}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Contenido</p>
            <Indice secciones={secciones} />
          </div>
        </aside>
      </div>
    </main>
  )
}

function Indice({ secciones }) {
  return (
    <ol className="mt-3 space-y-2 text-sm">
      {secciones.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="text-gray-600 hover:text-blue-700">{i + 1}. {s.titulo}</a>
        </li>
      ))}
    </ol>
  )
}

export function Tabla({ cabeceras, filas }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 my-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>{cabeceras.map((c) => <th key={c} className="px-3 py-2 font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.map((f, i) => (
            <tr key={i} className="align-top">{f.map((c, j) => <td key={j} className="px-3 py-2">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const OTROS_LEGALES = [
  { href: '/privacidad', texto: 'Política de privacidad' },
  { href: '/cookies', texto: 'Política de cookies' },
  { href: '/terminos', texto: 'Términos de uso' },
  { href: '/acerca', texto: 'Acerca de Herramatica' },
  { href: '/contacto', texto: 'Contacto' },
]

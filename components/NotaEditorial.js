import Link from 'next/link'

const EMAIL = 'info@herramatica.com'
const formato = (iso) =>
  new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))

// Quién elabora la página, cuándo se revisó, con qué fuentes y cómo avisar de un error.
// Es la información que un lector (y un buscador) necesita para decidir si puede fiarse del resultado.
export default function NotaEditorial({ tool, actualizado }) {
  const fuentes = (tool.bloques || []).filter((b) => b.tipo === 'fuentes').flatMap((b) => b.items)
  const asunto = encodeURIComponent(`Error en ${tool.shortName || tool.name}`)
  const cuerpo = encodeURIComponent(`Página: https://herramatica.com/${tool.slug}\nDatos que usé:\nResultado que obtuve:\nResultado que esperaba:\n`)

  return (
    <aside aria-labelledby="sobre-esta-pagina" className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 text-sm text-gray-700">
      <h2 id="sobre-esta-pagina" className="text-base font-bold text-gray-900">Sobre esta página</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-gray-900">Elaborada por</dt>
          <dd>
            El equipo editorial de Herramatica, que programa cada herramienta y la comprueba con casos reales.{' '}
            <Link href="/acerca#como-trabajamos" className="text-blue-600 underline underline-offset-2">Cómo trabajamos</Link>
          </dd>
        </div>
        {actualizado && (
          <div>
            <dt className="font-semibold text-gray-900">Última revisión</dt>
            <dd><time dateTime={actualizado}>{formato(actualizado)}</time></dd>
          </div>
        )}
        {fuentes.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="font-semibold text-gray-900">Basada en</dt>
            <dd>{fuentes.map((f) => f.texto).join(' · ')}</dd>
          </div>
        )}
        <div className="sm:col-span-2">
          <dt className="font-semibold text-gray-900">¿Ves un error?</dt>
          <dd>
            Escríbenos a{' '}
            <a href={`mailto:${EMAIL}?subject=${asunto}&body=${cuerpo}`} className="text-blue-600 underline underline-offset-2">{EMAIL}</a>{' '}
            con los datos que usaste. Revisamos cada aviso y, si hay un error, lo corregimos y actualizamos la fecha de revisión.
          </dd>
        </div>
      </dl>
    </aside>
  )
}

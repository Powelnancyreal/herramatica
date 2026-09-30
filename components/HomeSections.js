import Link from 'next/link'
import Image from 'next/image'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import home from '@/data/home.json'
import { getToolImage } from '@/lib/toolImage'

const porSlug = new Map(toolsData.map((t) => [t.slug, t]))
const categoria = new Map(categoriesData.map((c) => [c.slug, c]))

const ESTILOS = {
  generadores: { chip: 'bg-blue-100 text-blue-700', icono: 'bg-blue-100' },
  calculadoras: { chip: 'bg-green-100 text-green-700', icono: 'bg-green-100' },
  texto: { chip: 'bg-purple-100 text-purple-700', icono: 'bg-purple-100' },
  juegos: { chip: 'bg-orange-100 text-orange-700', icono: 'bg-orange-100' },
  convertidores: { chip: 'bg-teal-100 text-teal-700', icono: 'bg-teal-100' },
}

// Solo se enlazan herramientas que existen, para que un cambio en data/home.json nunca genere un enlace roto.
const herramientas = (slugs) => slugs.map((s) => porSlug.get(s)).filter(Boolean)
const nombreCorto = (t) => t.shortName || t.name
// Banderas dibujadas con CSS: los emojis de banderas no se ven en Windows.
const BANDERAS = {
  mexico: 'linear-gradient(to right, #006847 33.3%, #fff 33.3% 66.6%, #CE1126 66.6%)',
  espana: 'linear-gradient(to bottom, #AA151B 25%, #F1BF00 25% 75%, #AA151B 75%)',
  argentina: 'radial-gradient(circle at 50% 50%, #F6B40E 0 9%, transparent 10%), linear-gradient(to bottom, #74ACDF 33.3%, #fff 33.3% 66.6%, #74ACDF 66.6%)',
  chile: 'linear-gradient(#0039A6, #0039A6) 0 0 / 33.3% 50% no-repeat, linear-gradient(to bottom, #fff 50%, #D52B1E 50%)',
  colombia: 'linear-gradient(to bottom, #FCD116 50%, #003893 50% 75%, #CE1126 75%)',
  peru: 'linear-gradient(to right, #D91023 33.3%, #fff 33.3% 66.6%, #D91023 66.6%)',
  ecuador: 'radial-gradient(ellipse at 50% 50%, #7a5c2e 0 7%, transparent 8%), linear-gradient(to bottom, #FFDD00 50%, #034EA2 50% 75%, #ED1C24 75%)',
  uruguay: 'radial-gradient(circle at 17% 25%, #FCD116 0 11%, transparent 12%), linear-gradient(#fff, #fff) 0 0 / 33.3% 55.5% no-repeat, repeating-linear-gradient(to bottom, #fff 0 11.1%, #0038A8 11.1% 22.2%)',
}

function Encabezado({ titulo, subtitulo, enlace }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{titulo}</h2>
        {subtitulo && <p className="text-gray-600 mt-1">{subtitulo}</p>}
      </div>
      {enlace && (
        <Link href={enlace.href} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          {enlace.texto} →
        </Link>
      )}
    </div>
  )
}

function Chip({ slug }) {
  const c = categoria.get(slug)
  return <span className={`self-start inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${ESTILOS[slug]?.chip || 'bg-gray-100 text-gray-600'}`}>{c ? c.name : slug}</span>
}

function Destacadas() {
  const lista = herramientas(home.destacadas)
  return (
    <section className="mb-16" aria-labelledby="destacadas">
      <Encabezado titulo={<span id="destacadas">⭐ Las herramientas más usadas</span>} subtitulo="Las favoritas de quienes nos visitan cada día." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lista.map((t) => {
          const img = getToolImage(t)
          return (
            <Link key={t.slug} href={`/${t.slug}`} className="group flex sm:flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
              {img ? (
                <Image src={img.src} alt={img.alt || `${t.name}: herramienta online gratis`} width={800} height={450} unoptimized className="w-28 sm:w-full flex-shrink-0 aspect-square sm:aspect-video object-cover bg-gray-50" />
              ) : (
                <div className={`w-28 sm:w-full flex-shrink-0 aspect-square sm:aspect-video flex items-center justify-center text-5xl ${ESTILOS[t.category]?.icono || 'bg-gray-100'}`}>{categoria.get(t.category)?.icon}</div>
              )}
              <div className="flex flex-col flex-1 min-w-0 p-4 sm:p-5">
                <Chip slug={t.category} />
                <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{nombreCorto(t)}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">{t.metaDescription}</p>
                <span className="hidden sm:inline mt-4 text-sm font-semibold text-blue-600">Usar herramienta →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Recientes() {
  const lista = toolsData.slice(-home.recientes).reverse()
  return (
    <section className="mb-16" aria-labelledby="recientes">
      <Encabezado titulo={<span id="recientes">🆕 Recién publicadas</span>} subtitulo="Las últimas herramientas que añadimos a Herramatica." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="group flex gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
            <span className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl ${ESTILOS[t.category]?.icono || 'bg-gray-100'}`}>{categoria.get(t.category)?.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{nombreCorto(t)}</h3>
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Nuevo</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.metaDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function PorPais() {
  const visibles = 5
  return (
    <section className="mb-16" aria-labelledby="por-pais">
      <Encabezado titulo={<span id="por-pais">🌎 Herramientas para tu país</span>} subtitulo="Calculadoras laborales y fiscales con la legislación vigente de cada país." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {home.paises.map((p) => {
          const lista = herramientas(p.herramientas)
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-8 flex-shrink-0 rounded-md shadow ring-1 ring-black/10" style={{ background: BANDERAS[p.id] }} role="img" aria-label={`Bandera de ${p.nombre}`} />
                <div>
                  <h3 className="font-bold text-gray-900">{p.nombre}</h3>
                  <p className="text-xs text-gray-500">{p.codigo} · {lista.length} herramientas</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm">
                {lista.slice(0, visibles).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}`} className="text-gray-700 hover:text-blue-600 hover:underline">{nombreCorto(t)}</Link>
                  </li>
                ))}
              </ul>
              {lista.length > visibles && (
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-blue-600 font-medium">Ver {lista.length - visibles} más</summary>
                  <ul className="space-y-1.5 mt-2">
                    {lista.slice(visibles).map((t) => (
                      <li key={t.slug}>
                        <Link href={`/${t.slug}`} className="text-gray-700 hover:text-blue-600 hover:underline">{nombreCorto(t)}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function Estadisticas() {
  const paises = home.paises.length
  const datos = [
    [toolsData.length, 'herramientas gratis'],
    [categoriesData.length, 'categorías'],
    [paises, 'países con herramientas propias'],
    ['0', 'registros necesarios'],
  ]
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {datos.map(([n, t]) => (
        <div key={t} className="bg-blue-50 rounded-xl p-4 text-center">
          <dt className="sr-only">{t}</dt>
          <dd className="text-3xl font-extrabold text-blue-700">{n}</dd>
          <dd className="text-xs text-gray-600 mt-1">{t}</dd>
        </div>
      ))}
    </dl>
  )
}

// Índice completo plegado: mantiene un enlace a cada herramienta desde la portada sin saturar el diseño.
export function IndiceHerramientas() {
  return (
    <section aria-labelledby="indice">
      <details className="group bg-white border border-gray-200 rounded-2xl">
        <summary className="cursor-pointer list-none p-6 flex items-center justify-between gap-3">
          <span>
            <span id="indice" className="text-xl font-bold text-gray-900">📚 Índice de todas las herramientas</span>
            <span className="block text-sm text-gray-500 mt-1">Las {toolsData.length} herramientas ordenadas por categoría y de la A a la Z.</span>
          </span>
          <span className="text-blue-600 font-semibold text-sm group-open:hidden">Ver todas ↓</span>
          <span className="text-blue-600 font-semibold text-sm hidden group-open:inline">Ocultar ↑</span>
        </summary>
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesData.map((c) => {
            const lista = toolsData.filter((t) => t.category === c.slug).sort((a, b) => nombreCorto(a).localeCompare(nombreCorto(b), 'es'))
            return (
              <div key={c.slug}>
                <h3 className="font-bold text-gray-900 mb-2">
                  <Link href={`/${c.slug}`} className="hover:text-blue-600">{c.icon} {c.name}</Link> <span className="text-xs font-normal text-gray-500">({lista.length})</span>
                </h3>
                <ul className="space-y-1 text-sm">
                  {lista.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/${t.slug}`} className="text-gray-600 hover:text-blue-600 hover:underline">{nombreCorto(t)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </details>
    </section>
  )
}

export default function HomeSections() {
  return (
    <>
      <Destacadas />
      <Recientes />
      <PorPais />
    </>
  )
}

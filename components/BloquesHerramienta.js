import Image from 'next/image'
import TextoConEnlaces from '@/components/TextoConEnlaces'

// Bloques de contenido propios de cada herramienta (campo `bloques` de data/tools.json). Cada página elige
// qué bloques usa y en qué orden, así que dos herramientas no comparten la misma estructura.
// Todos los textos admiten enlaces internos con la sintaxis [texto](/ruta), que se validan al compilar.

// Ancla de cada bloque con título, a partir del propio título (o de b.id si lo fija el bloque).
export const idBloque = (b) =>
  b.id || (b.tipo === 'fuentes' ? 'fuentes' : b.titulo?.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80))

// Índice «En esta página» con las preguntas de la herramienta, para saltar directo a la que interesa.
export function IndiceBloques({ tool }) {
  const items = tool.bloques.filter((b) => b.titulo && b.tipo !== 'fuentes')
  if (items.length < 3) return null
  return (
    <nav aria-label="En esta página" className="mb-12 rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">En esta página</p>
      <ul className="mt-3 space-y-2">
        {items.map((b) => (
          <li key={idBloque(b)}>
            <a href={`#${idBloque(b)}`} className="text-gray-700 hover:text-blue-700 underline decoration-gray-300 underline-offset-4 hover:decoration-blue-600">{b.titulo}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const T = ({ t, origen }) => <TextoConEnlaces texto={t} origen={origen} />
const H2 = ({ children, id }) => <h2 id={id} className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-24">{children}</h2>

const TONOS = {
  azul: 'border-blue-200 bg-blue-50 text-blue-900',
  verde: 'border-green-200 bg-green-50 text-green-900',
  ambar: 'border-amber-200 bg-amber-50 text-amber-900',
  rojo: 'border-red-200 bg-red-50 text-red-900',
  gris: 'border-gray-200 bg-gray-50 text-gray-900',
}

function Texto({ b, o }) {
  return (
    <section>
      {b.titulo && <H2 id={idBloque(b)}>{b.titulo}</H2>}
      <div className="space-y-4 text-gray-700 leading-relaxed">
        {b.parrafos.map((p, i) => <p key={i}><T t={p} origen={o} /></p>)}
      </div>
    </section>
  )
}

function Pasos({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      <ol className="relative border-l-2 border-blue-100 ml-4 space-y-6">
        {b.pasos.map((p, i) => (
          <li key={i} className="pl-8 relative">
            <span aria-hidden="true" className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white ring-4 ring-white">{i + 1}</span>
            <p className="font-semibold text-gray-900">{p.titulo}</p>
            {p.texto && <p className="mt-1 text-gray-700 leading-relaxed"><T t={p.texto} origen={o} /></p>}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Ejemplo({ b, o }) {
  return (
    <section className="rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Ejemplo resuelto</p>
        <h2 id={idBloque(b)} className="mt-1 text-xl font-bold scroll-mt-24">{b.titulo}</h2>
      </div>
      <div className="p-5 space-y-5">
        {b.intro && <p className="text-gray-700 leading-relaxed"><T t={b.intro} origen={o} /></p>}
        {b.datos && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {b.datos.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <dt className="text-gray-600">{k}</dt>
                <dd className="font-semibold text-gray-900 text-right">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <ol className="space-y-3">
          {b.pasos.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-gray-700 leading-relaxed"><T t={p.texto} origen={o} /></p>
                {p.operacion && <p className="mt-1 font-mono text-sm text-gray-900 bg-gray-50 rounded px-2 py-1 inline-block break-all">{p.operacion}</p>}
              </div>
            </li>
          ))}
        </ol>
        {b.resultado && (
          <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <span className="font-medium text-green-900">{b.resultado[0]}</span>
            <span className="text-2xl font-bold text-green-700 tabular-nums">{b.resultado[1]}</span>
          </div>
        )}
      </div>
    </section>
  )
}

function Tabla({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      {b.intro && <p className="text-gray-700 leading-relaxed mb-4"><T t={b.intro} origen={o} /></p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          {b.leyenda && <caption className="text-left text-xs text-gray-500 px-3 py-2 caption-bottom">{b.leyenda}</caption>}
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>{b.cabeceras.map((c) => <th key={c} scope="col" className="px-3 py-2.5 font-semibold whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {b.filas.map((f, i) => (
              <tr key={i} className={b.destacar === i ? 'bg-blue-50 font-medium' : ''}>
                {f.map((c, j) => <td key={j} className={`px-3 py-2.5 ${j === 0 ? 'text-gray-900' : 'text-gray-700'}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.nota && <p className="mt-3 text-sm text-gray-500"><T t={b.nota} origen={o} /></p>}
    </section>
  )
}

function Infografia({ b }) {
  return (
    <figure>
      {b.titulo && <H2 id={idBloque(b)}>{b.titulo}</H2>}
      <Image
        src={`/images/infografias/${b.archivo}`}
        alt={b.alt}
        width={b.ancho || 800}
        height={b.alto}
        unoptimized
        loading="lazy"
        className="w-full h-auto rounded-2xl border border-gray-200"
      />
      <figcaption className="mt-2 text-sm text-gray-500">{b.pie || `Infografía: ${b.alt.charAt(0).toLowerCase()}${b.alt.slice(1)}.`}</figcaption>
    </figure>
  )
}

function Comparacion({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      {b.intro && <p className="text-gray-700 leading-relaxed mb-4"><T t={b.intro} origen={o} /></p>}
      <div className={`grid gap-4 ${b.columnas.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {b.columnas.map((c) => (
          <div key={c.titulo} className={`rounded-2xl border p-5 ${TONOS[c.tono || 'gris']}`}>
            <p className="font-bold">{c.titulo}</p>
            {c.subtitulo && <p className="text-sm opacity-80 mt-0.5">{c.subtitulo}</p>}
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              {c.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  <span><T t={it} origen={o} /></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Aviso({ b, o }) {
  return (
    <aside className={`rounded-2xl border-l-4 p-5 ${TONOS[b.tono || 'ambar']}`}>
      {b.titulo && <p className="font-bold mb-1">{b.titulo}</p>}
      <p className="leading-relaxed"><T t={b.texto} origen={o} /></p>
    </aside>
  )
}

function Consejos({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {b.items.map((it) => (
          <div key={it.titulo} className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="font-semibold text-gray-900">{it.titulo}</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed"><T t={it.texto} origen={o} /></p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Cifras({ b }) {
  return (
    <section>
      {b.titulo && <H2 id={idBloque(b)}>{b.titulo}</H2>}
      <dl className={`grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 grid-cols-2 ${b.items.length > 3 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {b.items.map(([valor, texto]) => (
          <div key={texto} className="bg-white px-4 py-4">
            <dt className="sr-only">{texto}</dt>
            <dd>
              <span className="block text-2xl font-bold text-gray-900 tabular-nums">{valor}</span>
              <span className="text-sm text-gray-600">{texto}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Fuentes({ b }) {
  return (
    <section className="rounded-2xl bg-gray-50 p-5">
      <h2 id={idBloque(b)} className="text-lg font-bold text-gray-900 scroll-mt-24">{b.titulo || 'Fuentes oficiales'}</h2>
      {b.intro && <p className="mt-1 text-sm text-gray-600">{b.intro}</p>}
      <ul className="mt-3 space-y-2 text-sm">
        {b.items.map((f) => (
          <li key={f.url} className="flex gap-2">
            <span aria-hidden="true" className="text-gray-400">↗</span>
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2 hover:text-blue-900">{f.texto}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Ilustracion({ imagen }) {
  if (!imagen) return null
  return (
    <Image src={imagen.src} alt={imagen.alt} width={800} height={450} unoptimized loading="lazy" className="w-full rounded-2xl" />
  )
}

// Mito frente a realidad: corrige creencias habituales sobre el tema de la herramienta.
function Mitos({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      <ul className="space-y-3">
        {b.items.map((m, i) => (
          <li key={i} className="grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
            <div className="bg-red-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">Mito</p>
              <p className="mt-1 text-gray-800 line-through decoration-red-300">{m.mito}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">Realidad</p>
              <p className="mt-1 text-gray-700 leading-relaxed"><T t={m.realidad} origen={o} /></p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Glosario de términos técnicos que aparecen en la herramienta.
function Glosario({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
        {b.items.map(([termino, def]) => (
          <div key={termino} className="grid gap-1 p-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="font-semibold text-gray-900">{termino}</dt>
            <dd className="text-gray-700 leading-relaxed"><T t={def} origen={o} /></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// Lista de comprobación: pasos o requisitos que el lector puede ir revisando.
function Checklist({ b, o }) {
  return (
    <section className="rounded-2xl bg-green-50/60 border border-green-100 p-5 sm:p-6">
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      <ul className="space-y-3">
        {b.items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-green-600 text-green-700 text-xs font-bold">✓</span>
            <span className="text-gray-800 leading-relaxed"><T t={it} origen={o} /></span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Escenarios: situaciones concretas con su resultado, para que el lector se reconozca en una.
function Escenarios({ b, o }) {
  return (
    <section>
      <H2 id={idBloque(b)}>{b.titulo}</H2>
      {b.intro && <p className="text-gray-700 leading-relaxed mb-4"><T t={b.intro} origen={o} /></p>}
      <div className="grid gap-4 sm:grid-cols-3">
        {b.items.map((e) => (
          <div key={e.titulo} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-500">{e.titulo}</p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed flex-1"><T t={e.situacion} origen={o} /></p>
            <p className="mt-4 border-t border-gray-100 pt-3 text-2xl font-bold text-gray-900 tabular-nums">{e.resultado}</p>
            {e.detalle && <p className="text-xs text-gray-500">{e.detalle}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

const BLOQUES = {
  mitos: Mitos, glosario: Glosario, checklist: Checklist, escenarios: Escenarios,
  texto: Texto, pasos: Pasos, ejemplo: Ejemplo, tabla: Tabla, infografia: Infografia, comparacion: Comparacion,
  aviso: Aviso, consejos: Consejos, cifras: Cifras, fuentes: Fuentes,
}

export default function BloquesHerramienta({ tool, ilustracion }) {
  return (
    <div className="space-y-12">
      {tool.bloques.map((b, i) => {
        if (b.tipo === 'ilustracion') return <Ilustracion key={i} imagen={ilustracion} />
        const Bloque = BLOQUES[b.tipo]
        if (!Bloque) throw new Error(`[${tool.slug}] Tipo de bloque desconocido: ${b.tipo}`)
        return <Bloque key={i} b={b} o={tool.slug} />
      })}
    </div>
  )
}

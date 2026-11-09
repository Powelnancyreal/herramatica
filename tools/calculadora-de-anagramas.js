'use client'

import { useMemo, useState } from 'react'
import { buttonClass, CopyButton, inputClass, labelClass, secondaryButtonClass, Tabs } from '@/components/calc-ui'
import { barajar } from '@/lib/calc/dev'
import { cabe, clave, coincidePatron, comparar, contar, desordenar, MAX_COMODINES, normalizar, ordenaciones } from '@/lib/calc/anagramas'

const MODOS = [
  { id: 'buscar', label: 'Buscar anagramas' },
  { id: 'comprobar', label: '¿Son anagramas?' },
  { id: 'ejercicio', label: 'Crear ejercicio' },
]
const EJEMPLOS = ['amor', 'delira', 'precio', 'colombia', 'matemática']
const MAX_EXACTO = 18 // la palabra más larga del diccionario
const MAX_FORMABLES = 12 // por encima, habría que descargar casi todo el diccionario
const POR_GRUPO = 40
const fmt = (n) => (typeof n === 'bigint' ? n : BigInt(n)).toLocaleString('es-MX')

// Un archivo por longitud de palabra; cada línea agrupa las palabras con las mismas letras.
const cache = new Map()
function cargarLongitud(n) {
  if (!cache.has(n)) {
    cache.set(
      n,
      fetch(`/datos/anagramas/es-${n}.txt`)
        .then((r) => {
          if (!r.ok) throw new Error('No se pudo cargar el diccionario.')
          return r.text()
        })
        .then((txt) => {
          const grupos = new Map()
          const palabras = []
          for (const linea of txt.split('\n')) {
            if (!linea) continue
            const lista = linea.split(' ')
            grupos.set(clave(lista[0]), lista)
            for (const p of lista) palabras.push({ p, c: contar(p) })
          }
          return { grupos, palabras }
        })
        .catch((e) => {
          cache.delete(n)
          throw e
        })
    )
  }
  return cache.get(n)
}

function Chips({ palabras, marcar }) {
  return (
    <div className="flex flex-wrap gap-2">
      {palabras.map((p) => (
        <span key={p} className={`px-2.5 py-1 rounded-lg border text-sm font-medium ${p === marcar ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-800'}`}>
          {p}
        </span>
      ))}
    </div>
  )
}

function Buscar() {
  const [entrada, setEntrada] = useState('')
  const [patron, setPatron] = useState('')
  const [minimo, setMinimo] = useState('3')
  const [estado, setEstado] = useState({ cargando: false, error: '', res: null })
  const [abiertos, setAbiertos] = useState({})

  async function buscar(valor = entrada) {
    const letras = normalizar(valor, { comodines: true })
    const comodines = (letras.match(/\?/g) || []).length
    const fijas = letras.replace(/\?/g, '')
    if (fijas.length < 2) return setEstado({ cargando: false, error: 'Escribe una palabra o al menos dos letras.', res: null })
    if (comodines > MAX_COMODINES) return setEstado({ cargando: false, error: `Puedes usar como máximo ${MAX_COMODINES} signos «?».`, res: null })
    setAbiertos({})
    const n = letras.length
    const base = { letras, comodines, fijas, cuenta: comodines ? null : ordenaciones(fijas), exactos: [], formables: [], sinDiccionario: n > MAX_EXACTO, formablesOmitidas: n > MAX_FORMABLES }
    if (n > MAX_EXACTO) return setEstado({ cargando: false, error: '', res: base })
    setEstado({ cargando: true, error: '', res: null })
    try {
      const conteo = contar(fijas)
      const exacto = await cargarLongitud(n)
      const exactos = comodines
        ? exacto.palabras.filter((x) => cabe(x.c, conteo, comodines)).map((x) => x.p)
        : exacto.grupos.get(clave(fijas)) || []
      const formables = []
      if (n <= MAX_FORMABLES) {
        const longitudes = []
        for (let l = 2; l < n; l++) longitudes.push(l)
        const datos = await Promise.all(longitudes.map(cargarLongitud))
        datos.forEach((d, i) => {
          const lista = d.palabras.filter((x) => cabe(x.c, conteo, comodines)).map((x) => x.p)
          if (lista.length) formables.push({ largo: longitudes[i], lista })
        })
        formables.reverse()
      }
      setEstado({ cargando: false, error: '', res: { ...base, exactos, formables } })
    } catch (e) {
      setEstado({ cargando: false, error: e.message || 'No se pudo cargar el diccionario. Revisa tu conexión.', res: null })
    }
  }

  const r = estado.res
  const pat = normalizar(patron, { comodines: true })
  const minimoN = r ? Math.max(2, Math.min(parseInt(minimo, 10) || 2, r.letras.length - 1)) : 2
  const formablesFiltradas = useMemo(
    () => (r ? r.formables.filter((g) => g.largo >= minimoN).map((g) => ({ ...g, lista: g.lista.filter((p) => coincidePatron(p, pat)) })).filter((g) => g.lista.length) : []),
    [r, pat, minimoN]
  )
  const exactosFiltrados = r ? r.exactos.filter((p) => coincidePatron(p, pat)) : []
  const todoTexto = r ? [...exactosFiltrados, ...formablesFiltradas.flatMap((g) => g.lista)].join(', ') : ''

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          buscar()
        }}
        className="space-y-3"
      >
        <label className={labelClass} htmlFor="anagrama-entrada">Palabra o letras</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="anagrama-entrada"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            className={inputClass}
            placeholder="Ej.: amor, precio o letras sueltas como «aemrt»"
            maxLength={40}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <button type="submit" disabled={estado.cargando} className={`${buttonClass} sm:w-auto`}>
            {estado.cargando ? 'Buscando…' : 'Calcular'}
          </button>
        </div>
        <p className="text-xs text-gray-500">Escribe «?» en lugar de una letra que no conoces (hasta {MAX_COMODINES}). Las tildes no cuentan; la ñ sí.</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Prueba con:</span>
          {EJEMPLOS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setEntrada(e)
                buscar(e)
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {e}
            </button>
          ))}
        </div>
      </form>

      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}

      {r && (
        <div className="space-y-5">
          {r.cuenta && (
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ordenaciones posibles de «{r.fijas}»</p>
              <p className="text-3xl font-bold text-blue-700 mt-1 break-all">{fmt(r.cuenta.total)}</p>
              <p className="text-sm text-gray-700 mt-2">
                {r.cuenta.repetidas.length === 0 ? (
                  <>Ninguna letra se repite: {r.cuenta.n}! = {fmt(r.cuenta.total)}.</>
                ) : (
                  <>
                    {r.cuenta.n}! ÷ ({r.cuenta.repetidas.map(([l, k]) => `${k}!`).join(' × ')}) = {fmt(r.cuenta.numerador)} ÷ {fmt(r.cuenta.divisor)} = {fmt(r.cuenta.total)}.{' '}
                    Se divide porque se repite{r.cuenta.repetidas.length > 1 ? 'n' : ''} {r.cuenta.repetidas.map(([l, k]) => `la «${l}» (${k} veces)`).join(', ')}.
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">Son todas las formas de ordenar las letras, tengan sentido o no. Abajo ves cuáles son palabras reales.</p>
            </div>
          )}
          {r.comodines > 0 && <p className="text-sm text-gray-600">Con comodines no se calcula el número de ordenaciones, porque las letras desconocidas pueden ser cualquiera.</p>}

          {r.sinDiccionario ? (
            <p className="text-sm text-gray-600">El diccionario llega hasta palabras de {MAX_EXACTO} letras, así que con este texto solo se calcula el número de ordenaciones. Para comparar frases usa la pestaña «¿Son anagramas?».</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="anagrama-patron">Filtrar por posición (opcional)</label>
                  <input id="anagrama-patron" value={patron} onChange={(e) => setPatron(e.target.value)} className={inputClass} placeholder="Ej.: r??a = 4 letras, empieza por r y termina en a" autoComplete="off" spellCheck={false} />
                </div>
                {!r.formablesOmitidas && (
                  <div>
                    <label className={labelClass} htmlFor="anagrama-minimo">Largo mínimo de las palabras</label>
                    <select id="anagrama-minimo" value={String(minimoN)} onChange={(e) => setMinimo(e.target.value)} className={inputClass}>
                      {Array.from({ length: Math.max(1, r.letras.length - 2) }, (_, i) => i + 2).map((l) => (
                        <option key={l} value={l}>{l} letras o más</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900">Anagramas con todas las letras</h3>
                {exactosFiltrados.length ? (
                  <div className="mt-3">
                    <Chips palabras={exactosFiltrados} marcar={r.comodines ? null : r.fijas} />
                    {!r.comodines && r.exactos.includes(r.fijas) && <p className="text-xs text-gray-500 mt-2">En amarillo, la palabra que escribiste.</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-2">No hay palabras del diccionario que usen exactamente estas letras{pat ? ' con ese filtro' : ''}.</p>
                )}
              </section>

              {r.formablesOmitidas ? (
                <p className="text-sm text-gray-600">Con más de {MAX_FORMABLES} letras solo se buscan los anagramas exactos, para no descargar todo el diccionario.</p>
              ) : (
                <section className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-bold text-gray-900">Otras palabras que puedes formar</h3>
                  {formablesFiltradas.length === 0 && <p className="text-sm text-gray-600 mt-2">No hay palabras más cortas con estos filtros.</p>}
                  <div className="space-y-4 mt-3">
                    {formablesFiltradas.map((g) => {
                      const abierto = abiertos[g.largo]
                      const visibles = abierto ? g.lista : g.lista.slice(0, POR_GRUPO)
                      return (
                        <div key={g.largo}>
                          <p className="text-sm font-semibold text-gray-700 mb-2">{g.largo} letras <span className="font-normal text-gray-500">({fmt(g.lista.length)})</span></p>
                          <Chips palabras={visibles} />
                          {g.lista.length > POR_GRUPO && (
                            <button type="button" onClick={() => setAbiertos((a) => ({ ...a, [g.largo]: !abierto }))} className="mt-2 text-sm font-medium text-blue-600 hover:underline">
                              {abierto ? 'Ver menos' : `Ver las ${fmt(g.lista.length)}`}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
              <div className="flex flex-wrap gap-2">
                <CopyButton text={todoTexto} label="Copiar todas las palabras" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Comprobar() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const r = useMemo(() => (normalizar(a) && normalizar(b) ? comparar(a, b) : null), [a, b])
  const lista = (x) => x.map(([l, n]) => (n > 1 ? `${l} ×${n}` : l)).join(', ')
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="comparar-a">Primera palabra o frase</label>
          <input id="comparar-a" value={a} onChange={(e) => setA(e.target.value)} className={inputClass} placeholder="Ej.: Salvador Dalí" autoComplete="off" />
        </div>
        <div>
          <label className={labelClass} htmlFor="comparar-b">Segunda palabra o frase</label>
          <input id="comparar-b" value={b} onChange={(e) => setB(e.target.value)} className={inputClass} placeholder="Ej.: Avida Dollars" autoComplete="off" />
        </div>
      </div>
      <p className="text-xs text-gray-500">Se ignoran los espacios, las tildes, las mayúsculas y los signos de puntuación.</p>
      {r && (
        <div className={`rounded-xl border-2 p-5 ${r.anagramas ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`text-xl font-bold ${r.anagramas ? 'text-green-700' : 'text-red-700'}`}>{r.anagramas ? 'Sí, son anagramas' : 'No son anagramas'}</p>
          <p className="text-sm text-gray-700 mt-1">
            La primera tiene {r.letrasA} letras y la segunda {r.letrasB}.
            {r.anagramas && ' Usan exactamente las mismas letras, las mismas veces.'}
          </p>
          {!r.anagramas && (
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              {r.soloA.length > 0 && <li>Le sobran a la primera: <strong>{lista(r.soloA)}</strong></li>}
              {r.soloB.length > 0 && <li>Le sobran a la segunda: <strong>{lista(r.soloB)}</strong></li>}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function Ejercicio() {
  const [texto, setTexto] = useState('mesa\nroma\nprecio\nlibro')
  const [semilla, setSemilla] = useState(0)
  const [soluciones, setSoluciones] = useState(false)
  const filas = useMemo(() => {
    const palabras = texto.split(/[\n,]+/).map((p) => normalizar(p)).filter((p) => p.length > 1).slice(0, 30)
    return palabras.map((p) => ({ p, d: desordenar(p, barajar) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, semilla])
  const salida = filas.map((f, i) => `${i + 1}. ${f.d.toUpperCase()}${soluciones ? ` → ${f.p}` : ''}`).join('\n')

  function imprimir() {
    const w = window.open('', '_blank')
    if (!w) return
    const items = filas.map((f) => `<li><span class="l">${f.d.toUpperCase()}</span> ${soluciones ? `<span class="s">${f.p}</span>` : '<span class="r"></span>'}</li>`).join('')
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Ejercicio de anagramas</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#111}h1{font-size:22px}p{color:#555}li{margin:14px 0;font-size:20px}.l{letter-spacing:6px;font-weight:bold}.r{display:inline-block;width:220px;border-bottom:1px solid #999;margin-left:16px}.s{margin-left:16px;color:#2563eb}</style><h1>Ordena las letras y descubre la palabra</h1><p>Nombre: ______________________ Fecha: __________</p><ol>${items}</ol>`)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="ejercicio-palabras">Palabras del ejercicio (una por línea, máximo 30)</label>
        <textarea id="ejercicio-palabras" value={texto} onChange={(e) => setTexto(e.target.value)} rows={5} className={inputClass} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setSemilla((s) => s + 1)} className={secondaryButtonClass}>Mezclar de nuevo</button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={soluciones} onChange={(e) => setSoluciones(e.target.checked)} /> Mostrar soluciones
        </label>
      </div>
      {filas.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <ol className="space-y-2">
            {filas.map((f, i) => (
              <li key={`${f.p}-${i}`} className="flex flex-wrap items-baseline gap-3">
                <span className="text-gray-400 w-6 text-right">{i + 1}.</span>
                <span className="font-mono text-lg font-bold tracking-[0.3em] text-gray-900">{f.d.toUpperCase()}</span>
                {soluciones && <span className="text-blue-700">{f.p}</span>}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 mt-4">
            <CopyButton text={salida} label="Copiar ejercicio" />
            <button type="button" onClick={imprimir} className={secondaryButtonClass}>Imprimir</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CalculadoraDeAnagramas() {
  const [modo, setModo] = useState('buscar')
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'buscar' && <Buscar />}
      {modo === 'comprobar' && <Comprobar />}
      {modo === 'ejercicio' && <Ejercicio />}
    </div>
  )
}

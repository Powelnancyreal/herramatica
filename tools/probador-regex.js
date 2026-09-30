'use client'

import { useEffect, useRef, useState } from 'react'
import { Field, inputClass } from '@/components/calc-ui'

const LIMITE_MS = 1500
const MAX_COINCIDENCIAS = 1000

// Se ejecuta en un Web Worker para que un patrón con backtracking catastrófico no congele la página.
const CODIGO_WORKER = `
self.onmessage = (e) => {
  const { patron, banderas, texto, reemplazo, max } = e.data
  try {
    const re = new RegExp(patron, banderas)
    const coincidencias = []
    if (re.global || re.sticky) {
      for (const m of texto.matchAll(re.global ? re : new RegExp(patron, banderas + 'g'))) {
        coincidencias.push({ indice: m.index, texto: m[0], grupos: m.slice(1), nombrados: m.groups || null })
        if (coincidencias.length >= max) break
        if (!re.global) break
      }
    } else {
      const m = re.exec(texto)
      if (m) coincidencias.push({ indice: m.index, texto: m[0], grupos: m.slice(1), nombrados: m.groups || null })
    }
    const reemplazado = reemplazo !== null ? texto.replace(re, reemplazo) : null
    self.postMessage({ ok: true, coincidencias, reemplazado })
  } catch (err) {
    self.postMessage({ ok: false, error: err.message })
  }
}`

const BANDERAS = [
  { id: 'g', label: 'g', desc: 'global: todas las coincidencias' },
  { id: 'i', label: 'i', desc: 'ignorar mayúsculas y minúsculas' },
  { id: 'm', label: 'm', desc: 'multilínea: ^ y $ por línea' },
  { id: 's', label: 's', desc: 'el punto incluye saltos de línea' },
  { id: 'u', label: 'u', desc: 'Unicode completo' },
]

const EJEMPLOS = [
  { nombre: 'Correo', patron: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', texto: 'Escríbenos a info@herramatica.com o a ventas@ejemplo.com.mx' },
  { nombre: 'Teléfono MX', patron: '\\b\\d{2}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', texto: 'Llama al 55 1234 5678 o al 33-8765-4321.' },
  { nombre: 'Fecha dd/mm/aaaa', patron: '(\\d{2})/(\\d{2})/(\\d{4})', texto: 'Entrega el 15/09/2026 y pago el 30/09/2026.' },
  { nombre: 'RFC persona física', patron: '[A-ZÑ&]{4}\\d{6}[A-Z\\d]{3}', texto: 'RFC: GODE561231GR8' },
]

export default function ProbadorRegex() {
  const [patron, setPatron] = useState(EJEMPLOS[0].patron)
  const [banderas, setBanderas] = useState('g')
  const [texto, setTexto] = useState(EJEMPLOS[0].texto)
  const [reemplazo, setReemplazo] = useState('')
  const [usarReemplazo, setUsarReemplazo] = useState(false)
  const [resultado, setResultado] = useState(null)
  const workerUrl = useRef(null)

  useEffect(() => {
    workerUrl.current = URL.createObjectURL(new Blob([CODIGO_WORKER], { type: 'text/javascript' }))
    return () => URL.revokeObjectURL(workerUrl.current)
  }, [])

  useEffect(() => {
    if (!workerUrl.current || !patron) {
      setResultado(null)
      return
    }
    const worker = new Worker(workerUrl.current)
    const temporizador = setTimeout(() => {
      worker.terminate()
      setResultado({ ok: false, error: 'La búsqueda tardó demasiado: el patrón probablemente provoca "backtracking catastrófico" (por ejemplo, (a+)+). Simplifícalo.' })
    }, LIMITE_MS)
    worker.onmessage = (e) => {
      clearTimeout(temporizador)
      worker.terminate()
      setResultado(e.data)
    }
    worker.postMessage({ patron, banderas, texto, reemplazo: usarReemplazo ? reemplazo : null, max: MAX_COINCIDENCIAS })
    return () => {
      clearTimeout(temporizador)
      worker.terminate()
    }
  }, [patron, banderas, texto, reemplazo, usarReemplazo])

  function alternar(b) {
    setBanderas((f) => (f.includes(b) ? f.replace(b, '') : f + b))
  }

  const partes = []
  if (resultado?.ok) {
    let cursor = 0
    resultado.coincidencias.forEach((m, i) => {
      if (m.indice > cursor) partes.push(<span key={`t${i}`}>{texto.slice(cursor, m.indice)}</span>)
      partes.push(
        <mark key={`m${i}`} className={`rounded px-0.5 ${i % 2 ? 'bg-yellow-200' : 'bg-green-200'}`}>
          {m.texto || '∅'}
        </mark>
      )
      cursor = m.indice + m.texto.length
    })
    partes.push(<span key="fin">{texto.slice(cursor)}</span>)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {EJEMPLOS.map((e) => (
          <button
            key={e.nombre}
            type="button"
            onClick={() => {
              setPatron(e.patron)
              setTexto(e.texto)
            }}
            className="px-3 py-1 rounded-full text-xs border bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {e.nombre}
          </button>
        ))}
      </div>
      <Field label="Expresión regular">
        <div className="flex items-center gap-1 font-mono">
          <span className="text-gray-400 text-lg">/</span>
          <input value={patron} onChange={(e) => setPatron(e.target.value)} spellCheck={false} className={`${inputClass} font-mono`} />
          <span className="text-gray-400 text-lg">/{banderas}</span>
        </div>
      </Field>
      <div className="flex flex-wrap gap-2">
        {BANDERAS.map((b) => (
          <button
            key={b.id}
            type="button"
            title={b.desc}
            onClick={() => alternar(b.id)}
            className={`px-3 py-1 rounded-lg text-sm font-mono border ${
              banderas.includes(b.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <Field label="Texto de prueba">
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={5} spellCheck={false} className={`${inputClass} font-mono text-sm`} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={usarReemplazo} onChange={(e) => setUsarReemplazo(e.target.checked)} />
        Probar reemplazo (usa $1, $2 o $&lt;nombre&gt; para los grupos)
      </label>
      {usarReemplazo && (
        <input value={reemplazo} onChange={(e) => setReemplazo(e.target.value)} placeholder="Ej: $3-$2-$1" className={`${inputClass} font-mono`} />
      )}

      {resultado && !resultado.ok && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{resultado.error}</p>}
      {resultado?.ok && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800">
            {resultado.coincidencias.length === 0
              ? 'Sin coincidencias'
              : `${resultado.coincidencias.length}${resultado.coincidencias.length >= MAX_COINCIDENCIAS ? '+' : ''} coincidencia${resultado.coincidencias.length === 1 ? '' : 's'}`}
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm whitespace-pre-wrap break-words">{partes}</pre>
          {resultado.coincidencias.some((m) => m.grupos.length) && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-2 py-1">#</th>
                    <th className="text-left px-2 py-1">Coincidencia</th>
                    {resultado.coincidencias[0].grupos.map((_, g) => (
                      <th key={g} className="text-left px-2 py-1">Grupo {g + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono divide-y divide-gray-100">
                  {resultado.coincidencias.slice(0, 50).map((m, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="px-2 py-1">{m.texto}</td>
                      {m.grupos.map((g, j) => (
                        <td key={j} className="px-2 py-1">{g ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {resultado.reemplazado !== null && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Resultado del reemplazo</p>
              <pre className="bg-gray-900 text-green-300 rounded-lg p-3 text-sm whitespace-pre-wrap">{resultado.reemplazado}</pre>
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">Usa el motor de expresiones regulares de JavaScript (ECMAScript) de tu navegador.</p>
    </div>
  )
}

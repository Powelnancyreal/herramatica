'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, inputClass, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'ver', label: 'Ver e imprimir' },
  { id: 'practicar', label: 'Practicar' },
]

export default function TablasDeMultiplicar() {
  const [modo, setModo] = useState('ver')
  const [seleccion, setSeleccion] = useState([2, 3, 4, 5])
  const [hasta, setHasta] = useState('10')
  const [pregunta, setPregunta] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [marcador, setMarcador] = useState({ bien: 0, mal: 0 })
  const [aviso, setAviso] = useState('')

  const limite = Math.min(20, Math.max(5, parseInt(hasta, 10) || 10))
  const toggle = (n) => setSeleccion((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort((a, b) => a - b)))

  function nueva() {
    if (!seleccion.length) return
    setPregunta({ a: seleccion[enteroAleatorio(0, seleccion.length - 1)], b: enteroAleatorio(1, limite) })
    setRespuesta('')
  }

  function comprobar(e) {
    e.preventDefault()
    if (!pregunta || respuesta === '') return
    const ok = parseInt(respuesta, 10) === pregunta.a * pregunta.b
    setMarcador((m) => ({ bien: m.bien + (ok ? 1 : 0), mal: m.mal + (ok ? 0 : 1) }))
    setAviso(ok ? '¡Correcto! 🎉' : `Casi: ${pregunta.a} × ${pregunta.b} = ${pregunta.a * pregunta.b}`)
    nueva()
  }

  return (
    <div className="space-y-5">
      <div className="print:hidden space-y-4">
        <Tabs tabs={MODOS} value={modo} onChange={setModo} />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Elige las tablas</p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold border ${seleccion.includes(n) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                aria-pressed={seleccion.includes(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm text-gray-700">Multiplicar hasta</label>
          <select value={hasta} onChange={(e) => setHasta(e.target.value)} className={`${inputClass} max-w-[7rem]`}>
            {[10, 12, 15, 20].map((n) => (
              <option key={n} value={n}>× {n}</option>
            ))}
          </select>
          {modo === 'ver' && (
            <button type="button" onClick={() => window.print()} className={secondaryButtonClass}>🖨️ Imprimir tablas</button>
          )}
        </div>
      </div>

      {modo === 'ver' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {seleccion.map((t) => (
            <div key={t} className="rounded-xl border-2 border-blue-100 p-3 break-inside-avoid">
              <p className="font-bold text-blue-700 text-center mb-1">Tabla del {t}</p>
              <ul className="text-sm font-mono space-y-0.5">
                {Array.from({ length: limite }, (_, i) => i + 1).map((m) => (
                  <li key={m} className="flex justify-between">
                    <span>{t} × {m}</span>
                    <span className="font-semibold">= {t * m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!seleccion.length && <p className="text-sm text-gray-500">Elige al menos una tabla.</p>}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4 text-center">
          {pregunta ? (
            <form onSubmit={comprobar} className="space-y-3">
              <p className="text-4xl font-bold text-gray-900">{pregunta.a} × {pregunta.b} = ?</p>
              <input
                type="number"
                inputMode="numeric"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className={`${inputClass} max-w-[10rem] mx-auto text-center text-2xl`}
                autoFocus
                aria-label="Tu respuesta"
              />
              <button type="submit" className={buttonClass}>Comprobar</button>
            </form>
          ) : (
            <button type="button" onClick={nueva} disabled={!seleccion.length} className={buttonClass}>Empezar a practicar</button>
          )}
          <p className="text-sm font-medium h-5" aria-live="polite">{aviso}</p>
          <p className="text-sm text-gray-700">
            ✅ {marcador.bien} correctas · ❌ {marcador.mal} por repasar
            {marcador.bien + marcador.mal > 0 && ` · ${Math.round((marcador.bien / (marcador.bien + marcador.mal)) * 100)}% de aciertos`}
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, inputClass } from '@/components/calc-ui'

const NOMBRES = [
  { id: 'es', label: 'Cara o cruz (España)', lados: ['Cara', 'Cruz'] },
  { id: 'mx', label: 'Águila o sol (México)', lados: ['Águila', 'Sol'] },
  { id: 'cl', label: 'Cara o sello (Chile, Colombia)', lados: ['Cara', 'Sello'] },
  { id: 'ar', label: 'Cara o ceca (Argentina)', lados: ['Cara', 'Ceca'] },
]

export default function CaraOCruz() {
  const [nombreId, setNombreId] = useState('es')
  const [lado, setLado] = useState(null)
  const [giros, setGiros] = useState(0)
  const [lanzando, setLanzando] = useState(false)
  const [historial, setHistorial] = useState([])
  const nombres = NOMBRES.find((n) => n.id === nombreId).lados

  function lanzar() {
    if (lanzando) return
    const r = enteroAleatorio(0, 1)
    setLanzando(true)
    setGiros((g) => g + 5 * 360 + (r === 1 ? 180 : 0) - (g % 360))
    setTimeout(() => {
      setLado(r)
      setHistorial((h) => [r, ...h].slice(0, 100))
      setLanzando(false)
    }, 1200)
  }

  const conteo = [historial.filter((x) => x === 0).length, historial.filter((x) => x === 1).length]

  return (
    <div className="space-y-5">
      <select value={nombreId} onChange={(e) => setNombreId(e.target.value)} className={`${inputClass} max-w-xs`}>
        {NOMBRES.map((n) => (
          <option key={n.id} value={n.id}>{n.label}</option>
        ))}
      </select>

      <div className="flex justify-center py-4" style={{ perspective: '800px' }}>
        <button
          type="button"
          onClick={lanzar}
          aria-label="Lanzar la moneda"
          className="relative w-40 h-40"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 1.2s cubic-bezier(.2,.8,.3,1)', transform: `rotateY(${giros}deg)` }}
        >
          {nombres.map((n, i) => (
            <span
              key={n}
              className={`absolute inset-0 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 ${
                i === 0 ? 'bg-yellow-300 border-yellow-500 text-yellow-900' : 'bg-gray-200 border-gray-400 text-gray-800'
              }`}
              style={{ backfaceVisibility: 'hidden', transform: i === 1 ? 'rotateY(180deg)' : undefined }}
            >
              {n}
            </span>
          ))}
        </button>
      </div>

      <p className="text-center text-3xl font-bold text-gray-900 h-10" aria-live="polite">
        {lanzando ? '…' : lado !== null ? `¡${nombres[lado]}!` : 'Pulsa para lanzar'}
      </p>
      <button onClick={lanzar} disabled={lanzando} className={buttonClass}>🪙 Lanzar moneda</button>

      {historial.length > 0 && (
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            {historial.length} lanzamientos · {nombres[0]}: {conteo[0]} ({Math.round((conteo[0] / historial.length) * 100)}%) ·{' '}
            {nombres[1]}: {conteo[1]} ({Math.round((conteo[1] / historial.length) * 100)}%)
          </p>
          <div className="flex flex-wrap gap-1">
            {historial.slice(0, 40).map((r, i) => (
              <span key={i} className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-semibold ${r === 0 ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-200 text-gray-700'}`}>
                {nombres[r][0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

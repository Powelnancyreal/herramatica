'use client'

import { useMemo, useState } from 'react'

const VELOCIDADES = [
  { id: 'lenta', label: 'Lectura lenta', wpm: 150 },
  { id: 'media', label: 'Lectura media', wpm: 200 },
  { id: 'rapida', label: 'Lectura rápida', wpm: 260 },
]

function contarPalabras(texto) {
  const trimmed = texto.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

function formatMinutos(minutos) {
  if (minutos < 1) return '< 1 min'
  const min = Math.floor(minutos)
  const seg = Math.round((minutos - min) * 60)
  if (min === 0) return `${seg} s`
  return seg > 0 ? `${min} min ${seg} s` : `${min} min`
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraTiempoLectura() {
  const [modo, setModo] = useState('texto')
  const [texto, setTexto] = useState('')
  const [numPalabras, setNumPalabras] = useState('')

  const palabras = modo === 'texto' ? contarPalabras(texto) : parseInt(numPalabras, 10) || 0

  const tiempos = useMemo(() => {
    if (palabras <= 0) return null
    return VELOCIDADES.map((v) => ({ ...v, minutos: palabras / v.wpm }))
  }, [palabras])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('texto')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'texto' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pegar texto
        </button>
        <button
          onClick={() => setModo('numero')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'numero' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Indicar número de palabras
        </button>
      </div>

      {modo === 'texto' ? (
        <div>
          <label className={labelClass}>Tu texto</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pega aquí tu artículo, ensayo o texto..."
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
          />
          <p className="text-xs text-gray-500 mt-1.5">{palabras.toLocaleString('es')} palabras</p>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Número de palabras</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={numPalabras}
            onChange={(e) => setNumPalabras(e.target.value)}
            placeholder="Ej: 1500"
            className={inputClass}
          />
        </div>
      )}

      {tiempos && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiempos.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl border-2 p-4 text-center ${
                v.id === 'media' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {v.label} ({v.wpm} ppm)
              </p>
              <p className="text-2xl font-bold text-blue-700">{formatMinutos(v.minutos)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

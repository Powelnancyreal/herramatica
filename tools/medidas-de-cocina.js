'use client'

import { useMemo, useState } from 'react'

// Factores de conversión a mililitros (ml), estándar de EE.UU. usado en la mayoría de recetas en español
const UNIDADES = {
  cucharadita: { label: 'Cucharadita (5 ml)', factor: 5 },
  cucharada: { label: 'Cucharada (15 ml)', factor: 15 },
  taza: { label: 'Taza (240 ml)', factor: 240 },
  ml: { label: 'Mililitros', factor: 1 },
  l: { label: 'Litros', factor: 1000 },
}

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(6)).toLocaleString('es', { maximumFractionDigits: 4 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function MedidasDeCocina() {
  const [valor, setValor] = useState('')
  const [desde, setDesde] = useState('cucharada')

  const resultados = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    const ml = v * UNIDADES[desde].factor
    const out = {}
    for (const key in UNIDADES) out[key] = ml / UNIDADES[key].factor
    return out
  }, [valor, desde])

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {Object.entries(UNIDADES).map(([id, u]) => (
          <button
            key={id}
            onClick={() => setDesde(id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              desde === id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {u.label.split(' (')[0]}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Cantidad en {UNIDADES[desde].label.split(' (')[0].toLowerCase()}</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 2"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(UNIDADES).map(([id, u]) => (
          <div
            key={id}
            className={`rounded-xl border-2 p-4 text-center ${
              id === desde ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
            }`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{u.label}</p>
            <p className="text-2xl font-bold text-blue-700 break-all">{resultados ? formatNum(resultados[id]) : '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

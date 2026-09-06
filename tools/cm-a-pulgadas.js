'use client'

import { useMemo, useState } from 'react'

const CM_POR_PULGADA = 2.54

const UNIDADES = [
  { id: 'cm', label: 'Centímetros' },
  { id: 'in', label: 'Pulgadas' },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CmAPulgadas() {
  const [valor, setValor] = useState('')
  const [desde, setDesde] = useState('cm')

  const resultado = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    return desde === 'cm' ? v / CM_POR_PULGADA : v * CM_POR_PULGADA
  }, [valor, desde])

  const hacia = desde === 'cm' ? 'in' : 'cm'

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {UNIDADES.map((u) => (
          <button
            key={u.id}
            onClick={() => setDesde(u.id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              desde === u.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Desde {u.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>{UNIDADES.find((u) => u.id === desde).label}</label>
        <input
          type="number"
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 10"
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {UNIDADES.find((u) => u.id === hacia).label}
        </p>
        <p className="text-4xl font-bold text-blue-700 break-all">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </div>
    </div>
  )
}

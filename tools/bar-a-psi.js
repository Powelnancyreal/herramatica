'use client'

import { useMemo, useState } from 'react'

// Factores de conversión a pascales (Pa)
const UNIDADES = {
  bar: { label: 'Bar', factor: 100000 },
  psi: { label: 'PSI', factor: 6894.757293168 },
  kpa: { label: 'Kilopascales (kPa)', factor: 1000 },
  atm: { label: 'Atmósferas (atm)', factor: 101325 },
}

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function BarAPsi() {
  const [valor, setValor] = useState('')
  const [desde, setDesde] = useState('bar')

  const resultados = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    const pascales = v * UNIDADES[desde].factor
    const out = {}
    for (const key in UNIDADES) out[key] = pascales / UNIDADES[key].factor
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
            Desde {u.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Presión en {UNIDADES[desde].label}</label>
        <input
          type="number"
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 2.5"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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

'use client'

import { useMemo, useState } from 'react'

function celsiusA(valor, unidad) {
  if (unidad === 'c') return valor
  if (unidad === 'f') return (valor * 9) / 5 + 32
  return valor + 273.15 // kelvin
}
function aCelsius(valor, unidad) {
  if (unidad === 'c') return valor
  if (unidad === 'f') return ((valor - 32) * 5) / 9
  return valor - 273.15 // kelvin
}
export function convertirTemperatura(valor, desde, hasta) {
  return celsiusA(aCelsius(valor, desde), hasta)
}

const UNIDADES = [
  { id: 'c', label: 'Celsius (°C)' },
  { id: 'f', label: 'Fahrenheit (°F)' },
  { id: 'k', label: 'Kelvin (K)' },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(2)).toLocaleString('es', { maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CelsiusAFahrenheit() {
  const [valor, setValor] = useState('')
  const [desde, setDesde] = useState('c')

  const resultados = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    return {
      c: convertirTemperatura(v, desde, 'c'),
      f: convertirTemperatura(v, desde, 'f'),
      k: convertirTemperatura(v, desde, 'k'),
    }
  }, [valor, desde])

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {UNIDADES.map((u) => (
          <button
            key={u.id}
            onClick={() => setDesde(u.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              desde === u.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Desde {u.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Temperatura en {UNIDADES.find((u) => u.id === desde).label}</label>
        <input
          type="number"
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 37"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {UNIDADES.map((u) => (
          <div
            key={u.id}
            className={`rounded-xl border-2 p-4 text-center ${
              u.id === desde ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
            }`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{u.label}</p>
            <p className="text-2xl font-bold text-blue-700">{resultados ? formatNum(resultados[u.id]) : '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

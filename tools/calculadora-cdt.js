'use client'

import { useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraCdt() {
  const [capital, setCapital] = useState('')
  const [tea, setTea] = useState('')
  const [dias, setDias] = useState('180')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const c = parseFloat(capital)
    const t = parseFloat(tea)
    const d = parseInt(dias, 10)
    if (!c || c <= 0) return setError('Introduce el monto a invertir.')
    if (isNaN(t) || t < 0) return setError('Introduce la tasa efectiva anual (TEA) que ofrece la entidad.')
    if (!d || d <= 0) return setError('Introduce el plazo en días.')

    setError('')
    const montoFinal = c * Math.pow(1 + t / 100, d / 365)
    const interes = montoFinal - c

    setResult({ interes, montoFinal })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Monto a invertir</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="Ej: 5000000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>TEA ofrecida (%)</label>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={tea} onChange={(e) => setTea(e.target.value)} placeholder="Ej: 11" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Plazo (días)</label>
          <select value={dias} onChange={(e) => setDias(e.target.value)} className={inputClass}>
            <option value="30">30 días</option>
            <option value="90">90 días</option>
            <option value="180">180 días</option>
            <option value="360">360 días</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular CDT
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monto final al vencimiento</p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-4">${formatMoney(result.montoFinal)}</p>
          <div className="bg-white rounded-lg px-3 py-2 border border-blue-100 inline-block">
            <p className="text-gray-500 text-sm">Interés ganado</p>
            <p className="font-semibold text-gray-900">${formatMoney(result.interes)}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Cálculo basado en la Tasa Efectiva Anual (TEA) que te informa tu entidad financiera, capitalizada según el
        plazo del CDT. No incluye la retención en la fuente que puede aplicar sobre los rendimientos financieros
        según tu situación fiscal.
      </p>
    </div>
  )
}

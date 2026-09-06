'use client'

import { useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPlazoFijo() {
  const [capital, setCapital] = useState('')
  const [tna, setTna] = useState('')
  const [dias, setDias] = useState('30')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const c = parseFloat(capital)
    const t = parseFloat(tna)
    const d = parseInt(dias, 10)
    if (!c || c <= 0) return setError('Introduce el capital a depositar.')
    if (isNaN(t) || t < 0) return setError('Introduce la TNA (tasa nominal anual) que ofrece el banco.')
    if (!d || d <= 0) return setError('Introduce el plazo en días.')

    setError('')
    const interes = c * (t / 100 / 365) * d
    const tea = Math.pow(1 + t / 100 / 365, 365) - 1
    setResult({ interes, montoFinal: c + interes, tea: tea * 100 })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Capital</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="Ej: 500000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>TNA del banco (%)</label>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={tna} onChange={(e) => setTna(e.target.value)} placeholder="Ej: 35" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Plazo (días)</label>
          <select value={dias} onChange={(e) => setDias(e.target.value)} className={inputClass}>
            <option value="30">30 días</option>
            <option value="60">60 días</option>
            <option value="90">90 días</option>
            <option value="180">180 días</option>
            <option value="365">365 días</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular plazo fijo
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monto final al vencimiento</p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-4">${formatMoney(result.montoFinal)}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Interés ganado</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.interes)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">TEA equivalente</p>
              <p className="font-semibold text-gray-900">{result.tea.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Cálculo basado en interés simple sobre el capital (fórmula estándar de plazo fijo tradicional), usando la
        TNA que te informa tu banco. No incluye impuestos ni retenciones que puedan aplicar según tu situación fiscal.
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'

const FRECUENCIAS = [
  { id: 'anual', label: 'Anual', n: 1 },
  { id: 'semestral', label: 'Semestral', n: 2 },
  { id: 'trimestral', label: 'Trimestral', n: 4 },
  { id: 'mensual', label: 'Mensual', n: 12 },
  { id: 'diaria', label: 'Diaria', n: 365 },
]

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraInteresCompuesto() {
  const [capital, setCapital] = useState('')
  const [tasa, setTasa] = useState('')
  const [anios, setAnios] = useState('')
  const [frecuencia, setFrecuencia] = useState('anual')
  const [aporteMensual, setAporteMensual] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const p = parseFloat(capital)
    const r = parseFloat(tasa)
    const t = parseFloat(anios)
    const aporte = parseFloat(aporteMensual) || 0
    if (!p && p !== 0) return setError('Introduce el capital inicial.')
    if (isNaN(r) || r < 0) return setError('Introduce la tasa de interés anual.')
    if (!t || t <= 0) return setError('Introduce el plazo en años.')

    setError('')
    const n = FRECUENCIAS.find((f) => f.id === frecuencia).n
    const tasaDecimal = r / 100
    const totalPeriodos = n * t

    let saldo = p
    let totalAportado = p
    const aportePorPeriodo = (aporte * 12) / n
    for (let i = 0; i < totalPeriodos; i++) {
      saldo = saldo * (1 + tasaDecimal / n) + aportePorPeriodo
      totalAportado += aportePorPeriodo
    }

    const interesGanado = saldo - totalAportado
    setResult({ montoFinal: saldo, interesGanado, totalAportado })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Capital inicial</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="Ej: 100000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tasa de interés anual (%)</label>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={tasa} onChange={(e) => setTasa(e.target.value)} placeholder="Ej: 8" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Plazo (años)</label>
          <input type="number" inputMode="decimal" min="0" value={anios} onChange={(e) => setAnios(e.target.value)} placeholder="Ej: 10" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Frecuencia de capitalización</label>
          <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className={inputClass}>
            {FRECUENCIAS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Aporte mensual adicional (opcional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={aporteMensual} onChange={(e) => setAporteMensual(e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular interés compuesto
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monto final</p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-4">${formatMoney(result.montoFinal)}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Total aportado</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.totalAportado)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Interés ganado</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.interesGanado)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

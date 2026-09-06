'use client'

import { useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraSueldoNetoArgentina() {
  const [bruto, setBruto] = useState('')
  const [cuotaSindical, setCuotaSindical] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const b = parseFloat(bruto)
    const sindical = parseFloat(cuotaSindical) || 0
    if (!b || b <= 0) return setError('Introduce tu sueldo bruto.')

    setError('')
    const jubilacion = b * 0.11
    const obraSocial = b * 0.03
    const pami = b * 0.03
    const cuota = b * (sindical / 100)
    const totalDescuentos = jubilacion + obraSocial + pami + cuota
    const neto = b - totalDescuentos

    setResult({ jubilacion, obraSocial, pami, cuota, totalDescuentos, neto })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Sueldo bruto mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={bruto} onChange={(e) => setBruto(e.target.value)} placeholder="Ej: 900000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Cuota sindical (%, si aplica)</label>
          <input type="number" inputMode="decimal" min="0" step="0.1" value={cuotaSindical} onChange={(e) => setCuotaSindical(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular sueldo neto
      </button>

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Sueldo neto estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">${formatMoney(result.neto)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Jubilación (11%)</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.jubilacion)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Obra social (3%)</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.obraSocial)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">PAMI - Ley 19032 (3%)</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.pami)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Cuota sindical</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.cuota)}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Incluye los descuentos estándar de todo trabajador en relación de dependencia (17%: jubilación, obra
        social y PAMI). No incluye la retención del Impuesto a las Ganancias, que depende de tu situación personal y
        de las escalas vigentes; consulta tu recibo de sueldo o a tu contador para ese cálculo.
      </p>
    </div>
  )
}

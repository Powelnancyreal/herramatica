'use client'

import { useMemo, useState } from 'react'

const PROPINAS_SUGERIDAS = [10, 15, 18, 20, 25]

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPropinas() {
  const [cuenta, setCuenta] = useState('')
  const [porcentaje, setPorcentaje] = useState(15)
  const [personalizado, setPersonalizado] = useState('')
  const [personas, setPersonas] = useState('1')

  const porcentajeActivo = personalizado !== '' ? parseFloat(personalizado) : porcentaje

  const result = useMemo(() => {
    const monto = parseFloat(cuenta)
    const p = porcentajeActivo
    const num = Math.max(1, parseInt(personas, 10) || 1)
    if (isNaN(monto) || isNaN(p) || monto < 0) return null
    const propina = monto * (p / 100)
    const total = monto + propina
    return {
      propina,
      total,
      porPersonaCuenta: monto / num,
      porPersonaPropina: propina / num,
      porPersonaTotal: total / num,
      num,
    }
  }, [cuenta, porcentajeActivo, personas])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Monto de la cuenta</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={cuenta}
            onChange={(e) => setCuenta(e.target.value)}
            placeholder="Ej: 850"
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Porcentaje de propina</label>
        <div className="grid grid-cols-5 gap-2">
          {PROPINAS_SUGERIDAS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPorcentaje(p)
                setPersonalizado('')
              }}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                personalizado === '' && porcentaje === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
        <div className="relative mt-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={personalizado}
            onChange={(e) => setPersonalizado(e.target.value)}
            placeholder="Otro porcentaje personalizado"
            className={`${inputClass} pr-8`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
        </div>
      </div>

      <div>
        <label className={labelClass}>Dividir entre (personas)</label>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          value={personas}
          onChange={(e) => setPersonas(e.target.value)}
          placeholder="1"
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Propina ({porcentajeActivo || 0}%)</p>
            <p className="text-2xl font-bold text-gray-900">${formatMoney(result?.propina)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total a pagar</p>
            <p className="text-2xl font-bold text-blue-700">${formatMoney(result?.total)}</p>
          </div>
        </div>

        {result && result.num > 1 && (
          <div className="bg-white rounded-lg border border-blue-100 p-4 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Cada persona paga ({result.num} personas)</p>
            <p className="text-3xl font-bold text-gray-900">${formatMoney(result.porPersonaTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Cuenta ${formatMoney(result.porPersonaCuenta)} + propina ${formatMoney(result.porPersonaPropina)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

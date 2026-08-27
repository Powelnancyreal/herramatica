'use client'

import { useMemo, useState } from 'react'

const TASAS = [
  { id: '16', label: '16%', sub: 'General', valor: 16 },
  { id: '8', label: '8%', sub: 'Frontera', valor: 8 },
  { id: '0', label: '0%', sub: 'Tasa cero', valor: 0 },
  { id: 'custom', label: 'Otra', sub: 'Personalizada', valor: null },
]

function formatMXN(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function calcularIVA({ monto, tasa, modo }) {
  if (modo === 'agregar') {
    const subtotal = monto
    const iva = subtotal * (tasa / 100)
    const total = subtotal + iva
    return { subtotal, iva, total }
  }
  const total = monto
  const subtotal = total / (1 + tasa / 100)
  const iva = total - subtotal
  return { subtotal, iva, total }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularIVA() {
  const [modo, setModo] = useState('agregar')
  const [monto, setMonto] = useState('')
  const [tasaId, setTasaId] = useState('16')
  const [tasaCustom, setTasaCustom] = useState('')
  const [copiado, setCopiado] = useState(false)

  const tasaValor = tasaId === 'custom' ? parseFloat(tasaCustom) : TASAS.find((t) => t.id === tasaId).valor
  const montoNum = parseFloat(monto)
  const valido = monto !== '' && !isNaN(montoNum) && montoNum >= 0 && !isNaN(tasaValor) && tasaValor >= 0

  const result = useMemo(() => {
    if (!valido) return null
    return calcularIVA({ monto: montoNum, tasa: tasaValor, modo })
  }, [valido, montoNum, tasaValor, modo])

  function copiarDesglose() {
    if (!result) return
    const texto = `Subtotal: ${formatMXN(result.subtotal)}\nIVA (${tasaValor}%): ${formatMXN(result.iva)}\nTotal: ${formatMXN(result.total)}`
    navigator.clipboard
      ?.writeText(texto)
      .then(() => {
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div className="space-y-5">
      {/* Modo */}
      <div className="flex gap-2">
        <button
          onClick={() => setModo('agregar')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'agregar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Agregar IVA
        </button>
        <button
          onClick={() => setModo('quitar')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'quitar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Quitar IVA
        </button>
      </div>

      {/* Monto */}
      <div>
        <label className={labelClass}>{modo === 'agregar' ? 'Monto sin IVA (subtotal)' : 'Monto con IVA (total)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 1500"
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      {/* Tasa */}
      <div>
        <label className={labelClass}>Tasa de IVA</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TASAS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTasaId(t.id)}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                tasaId === t.id ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
              <span className="block text-[10px] font-normal text-gray-400">{t.sub}</span>
            </button>
          ))}
        </div>
        {tasaId === 'custom' && (
          <div className="relative mt-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={tasaCustom}
              onChange={(e) => setTasaCustom(e.target.value)}
              placeholder="Ej: 19"
              className={`${inputClass} pr-8`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        )}
      </div>

      {/* Result */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
        <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
          <Row label="Subtotal (sin IVA)" value={result?.subtotal} highlight={modo === 'quitar'} />
          <Row label={`IVA (${isNaN(tasaValor) ? '--' : tasaValor}%)`} value={result?.iva} />
          <Row label="Total (con IVA)" value={result?.total} highlight={modo === 'agregar'} bold />
        </div>
        <button
          onClick={copiarDesglose}
          disabled={!result}
          className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200 text-blue-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          {copiado ? '✓ Copiado' : 'Copiar desglose'}
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, bold, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-2.5 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-gray-600 ${bold ? 'font-semibold text-gray-900' : ''}`}>{label}</span>
      <span className={`flex-shrink-0 ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-blue-700 font-semibold' : ''}`}>
        {value !== undefined && value !== null ? formatMXN(value) : '—'}
      </span>
    </div>
  )
}

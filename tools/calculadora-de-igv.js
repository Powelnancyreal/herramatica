'use client'

import { useMemo, useState } from 'react'

const TASA_IGV = 0.18

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraDeIgv() {
  const [modo, setModo] = useState('agregar')
  const [valor, setValor] = useState('')

  const resultado = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v) || v < 0) return null
    if (modo === 'agregar') {
      const igv = v * TASA_IGV
      return { base: v, igv, total: v + igv }
    }
    const base = v / (1 + TASA_IGV)
    return { base, igv: v - base, total: v }
  }, [valor, modo])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('agregar')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'agregar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Agregar IGV (precio sin IGV)
        </button>
        <button
          onClick={() => setModo('quitar')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'quitar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Quitar IGV (precio con IGV)
        </button>
      </div>

      <div>
        <label className={labelClass}>{modo === 'agregar' ? 'Precio sin IGV (valor de venta)' : 'Precio con IGV (precio de venta)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ej: 100"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{modo === 'agregar' ? 'Precio con IGV' : 'Precio sin IGV (valor de venta)'}</p>
            <p className="text-4xl font-bold text-blue-700">S/ {formatMoney(modo === 'agregar' ? resultado.total : resultado.base)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Valor de venta (sin IGV)</p>
              <p className="font-semibold text-gray-900">S/ {formatMoney(resultado.base)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">IGV (18%)</p>
              <p className="font-semibold text-gray-900">S/ {formatMoney(resultado.igv)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

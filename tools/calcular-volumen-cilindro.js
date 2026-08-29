'use client'

import { useMemo, useState } from 'react'

const MODOS_BASE = [
  { id: 'radio', label: 'Radio' },
  { id: 'diametro', label: 'Diámetro' },
]

function calcularCilindro(r, h) {
  const volumen = Math.PI * r * r * h
  const areaLateral = 2 * Math.PI * r * h
  const areaTotal = 2 * Math.PI * r * (r + h)
  return { volumen, areaLateral, areaTotal }
}

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularVolumenCilindro() {
  const [modoBase, setModoBase] = useState('radio')
  const [valorBase, setValorBase] = useState('')
  const [altura, setAltura] = useState('')

  const resultado = useMemo(() => {
    const vb = parseFloat(valorBase)
    const h = parseFloat(altura)
    if (isNaN(vb) || vb <= 0 || isNaN(h) || h <= 0) return null
    const r = modoBase === 'radio' ? vb : vb / 2
    return calcularCilindro(r, h)
  }, [valorBase, modoBase, altura])

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {MODOS_BASE.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setModoBase(m.id)
              setValorBase('')
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              modoBase === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m.label} de la base
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{modoBase === 'radio' ? 'Radio de la base' : 'Diámetro de la base'}</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={valorBase}
            onChange={(e) => setValorBase(e.target.value)}
            placeholder="Ej: 4"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Altura del cilindro</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Ej: 10"
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Volumen del cilindro</p>
        <p className="text-4xl font-bold text-blue-700 break-all">
          {resultado ? formatNum(resultado.volumen) : '—'}
        </p>
        {resultado && <p className="text-sm text-gray-500 mt-2">unidades³ (mismas unidades que introdujiste, al cubo)</p>}
      </div>

      {resultado && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Área lateral</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.areaLateral)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Área total</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.areaTotal)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

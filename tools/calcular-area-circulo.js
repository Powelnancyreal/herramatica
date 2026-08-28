'use client'

import { useMemo, useState } from 'react'

const MODOS = [
  { id: 'radio', label: 'Radio' },
  { id: 'diametro', label: 'Diámetro' },
  { id: 'circunferencia', label: 'Circunferencia' },
]

function calcularDesdeRadio(r) {
  const area = Math.PI * r * r
  const diametro = r * 2
  const circunferencia = 2 * Math.PI * r
  return { radio: r, diametro, circunferencia, area }
}

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularAreaCirculo() {
  const [modo, setModo] = useState('radio')
  const [valor, setValor] = useState('')

  const resultado = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v) || v <= 0) return null
    let r
    if (modo === 'radio') r = v
    else if (modo === 'diametro') r = v / 2
    else r = v / (2 * Math.PI) // circunferencia
    return calcularDesdeRadio(r)
  }, [valor, modo])

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {MODOS.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setModo(m.id)
              setValor('')
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              modo === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>
          {modo === 'radio' && 'Radio del círculo'}
          {modo === 'diametro' && 'Diámetro del círculo'}
          {modo === 'circunferencia' && 'Circunferencia (perímetro) del círculo'}
        </label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 5"
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Área del círculo</p>
        <p className="text-4xl font-bold text-blue-700 break-all">
          {resultado ? formatNum(resultado.area) : '—'}
        </p>
        {resultado && <p className="text-sm text-gray-500 mt-2">unidades² (mismas unidades que introdujiste, al cuadrado)</p>}
      </div>

      {resultado && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Radio</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.radio)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Diámetro</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.diametro)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Circunferencia</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.circunferencia)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

const VARIANTES = [
  { id: 'castellana', label: 'Arroba castellana (España)', kg: 11.502 },
  { id: '12_5', label: 'Arroba de 12.5 kg (uso agrícola/ganadero)', kg: 12.5 },
  { id: '15', label: 'Arroba de 15 kg (uso agrícola/ganadero)', kg: 15 },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 4 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function ArrobaAKilos() {
  const [valor, setValor] = useState('')
  const [variante, setVariante] = useState('castellana')
  const [direccion, setDireccion] = useState('arroba_a_kg')

  const kgPorArroba = VARIANTES.find((v) => v.id === variante).kg

  const resultado = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    return direccion === 'arroba_a_kg' ? v * kgPorArroba : v / kgPorArroba
  }, [valor, direccion, kgPorArroba])

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Equivalencia de arroba a usar</label>
        <select value={variante} onChange={(e) => setVariante(e.target.value)} className={inputClass}>
          {VARIANTES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} = {v.kg} kg
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1.5">
          ⚠️ El valor de la arroba varía según el país y el producto. Elige la equivalencia que corresponda a tu contexto.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setDireccion('arroba_a_kg')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            direccion === 'arroba_a_kg' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Arrobas → Kilos
        </button>
        <button
          onClick={() => setDireccion('kg_a_arroba')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            direccion === 'kg_a_arroba' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Kilos → Arrobas
        </button>
      </div>

      <div>
        <label className={labelClass}>{direccion === 'arroba_a_kg' ? 'Arrobas' : 'Kilogramos'}</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 2"
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {direccion === 'arroba_a_kg' ? 'Kilogramos' : 'Arrobas'}
        </p>
        <p className="text-4xl font-bold text-blue-700 break-all">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

const BASES = [
  { id: 2, label: 'Binario (base 2)', prefix: '0b', regex: /^[01]+$/ },
  { id: 8, label: 'Octal (base 8)', prefix: '0o', regex: /^[0-7]+$/ },
  { id: 10, label: 'Decimal (base 10)', prefix: '', regex: /^[0-9]+$/ },
  { id: 16, label: 'Hexadecimal (base 16)', prefix: '0x', regex: /^[0-9a-fA-F]+$/ },
]

export function convertirBase(valor, baseOrigen, baseDestino) {
  const decimal = parseInt(valor, baseOrigen)
  if (isNaN(decimal)) return null
  return decimal.toString(baseDestino).toUpperCase()
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function ConvertidorBinario() {
  const [valor, setValor] = useState('')
  const [baseOrigen, setBaseOrigen] = useState(10)

  const origen = BASES.find((b) => b.id === baseOrigen)
  const valido = valor === '' || origen.regex.test(valor)

  const resultados = useMemo(() => {
    if (!valor || !valido) return null
    const out = {}
    for (const b of BASES) {
      out[b.id] = convertirBase(valor, baseOrigen, b.id)
    }
    return out
  }, [valor, baseOrigen, valido])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Base de origen</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BASES.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setBaseOrigen(b.id)
                setValor('')
              }}
              className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                baseOrigen === b.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Valor ({origen.label})</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value.trim())}
          placeholder={baseOrigen === 2 ? 'Ej: 1010' : baseOrigen === 8 ? 'Ej: 17' : baseOrigen === 16 ? 'Ej: 1F' : 'Ej: 42'}
          className={`${inputClass} ${!valido ? 'border-red-400' : ''}`}
        />
        {!valido && <p className="text-xs text-red-600 mt-1">Ese valor no es válido en {origen.label.toLowerCase()}.</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASES.map((b) => (
          <div key={b.id} className={`rounded-xl border-2 p-4 ${b.id === baseOrigen ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{b.label}</p>
            <p className="text-xl font-bold text-gray-900 font-mono break-all">
              {resultados ? resultados[b.id] : '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

const HEX_REGEX = /^[0-9a-fA-F]+$/
const DEC_REGEX = /^[0-9]+$/

function hexADecimal(hex) {
  const n = parseInt(hex, 16)
  return isNaN(n) ? null : n
}

function decimalAHex(dec) {
  const n = parseInt(dec, 10)
  return isNaN(n) ? null : n.toString(16).toUpperCase()
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularHexadecimalADecimal() {
  const [modo, setModo] = useState('hexADec')
  const [hex, setHex] = useState('')
  const [dec, setDec] = useState('')

  const hexValido = hex === '' || HEX_REGEX.test(hex)
  const decValido = dec === '' || DEC_REGEX.test(dec)

  const resultadoHexADec = useMemo(() => {
    if (!hex || !hexValido) return null
    return hexADecimal(hex)
  }, [hex, hexValido])

  const resultadoDecAHex = useMemo(() => {
    if (!dec || !decValido) return null
    return decimalAHex(dec)
  }, [dec, decValido])

  const binarioEquivalente = useMemo(() => {
    if (modo === 'hexADec' && resultadoHexADec !== null) return resultadoHexADec.toString(2)
    if (modo === 'decAHex' && resultadoDecAHex !== null) return parseInt(dec, 10).toString(2)
    return null
  }, [modo, resultadoHexADec, resultadoDecAHex, dec])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('hexADec')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'hexADec' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Hexadecimal → Decimal
        </button>
        <button
          onClick={() => setModo('decAHex')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'decAHex' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Decimal → Hexadecimal
        </button>
      </div>

      {modo === 'hexADec' ? (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Número hexadecimal</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value.trim())}
              placeholder="Ej: 1F4"
              className={`${inputClass} ${!hexValido ? 'border-red-400' : ''}`}
            />
            {!hexValido && <p className="text-xs text-red-600 mt-1">Solo se permiten dígitos 0-9 y letras A-F.</p>}
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado en decimal</p>
            <p className="text-4xl font-bold text-blue-700 break-all font-mono">
              {resultadoHexADec !== null ? resultadoHexADec.toLocaleString('es') : '—'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Número decimal</label>
            <input
              type="text"
              inputMode="numeric"
              value={dec}
              onChange={(e) => setDec(e.target.value.trim())}
              placeholder="Ej: 500"
              className={`${inputClass} ${!decValido ? 'border-red-400' : ''}`}
            />
            {!decValido && <p className="text-xs text-red-600 mt-1">Solo se permiten dígitos numéricos (0-9).</p>}
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado en hexadecimal</p>
            <p className="text-4xl font-bold text-blue-700 break-all font-mono">
              {resultadoDecAHex !== null ? resultadoDecAHex : '—'}
            </p>
          </div>
        </div>
      )}

      {binarioEquivalente !== null && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Equivalente en binario</p>
          <p className="font-semibold text-gray-900 font-mono break-all">{binarioEquivalente}</p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

export function hexATexto(hex) {
  const limpio = hex.replace(/\s+/g, '').replace(/^0x/i, '')
  if (limpio.length === 0) return { error: null, valor: '' }
  if (!/^[0-9a-fA-F]+$/.test(limpio)) return { error: 'Solo se permiten dígitos hexadecimales (0-9, A-F) y espacios.', valor: null }
  if (limpio.length % 2 !== 0) return { error: 'La cadena hexadecimal debe tener un número par de dígitos.', valor: null }
  try {
    const bytes = new Uint8Array(limpio.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(limpio.substr(i * 2, 2), 16)
    }
    return { error: null, valor: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { error: 'Esos bytes no forman texto UTF-8 válido.', valor: null }
  }
}

export function textoAHex(texto) {
  const bytes = new TextEncoder().encode(texto)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function HexadecimalATexto() {
  const [modo, setModo] = useState('hexATexto')
  const [hex, setHex] = useState('48 65 72 72 61 6d 61 74 69 63 61')
  const [texto, setTexto] = useState('Herramatica')

  const resultadoHex = useMemo(() => hexATexto(hex), [hex])
  const resultadoTexto = useMemo(() => textoAHex(texto), [texto])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('hexATexto')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'hexATexto' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Hexadecimal → Texto
        </button>
        <button
          onClick={() => setModo('textoAHex')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'textoAHex' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Texto → Hexadecimal
        </button>
      </div>

      {modo === 'hexATexto' ? (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Código hexadecimal</label>
            <textarea
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              rows={3}
              placeholder="Ej: 48 65 6c 6c 6f"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y font-mono text-sm"
            />
          </div>
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Texto</p>
            {resultadoHex.error ? (
              <p className="text-red-600 text-sm">{resultadoHex.error}</p>
            ) : (
              <p className="text-xl font-semibold text-blue-700 break-all min-h-[1.75rem]">{resultadoHex.valor || '—'}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Texto</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
              placeholder="Escribe cualquier texto..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
            />
          </div>
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Hexadecimal</p>
            <p className="text-sm font-mono text-blue-700 break-all min-h-[1.5rem]">{resultadoTexto || '—'}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Interpreta los bytes como texto codificado en UTF-8, el estándar usado en la mayoría de sistemas y páginas
        web actuales, compatible con tildes y la letra ñ.
      </p>
    </div>
  )
}

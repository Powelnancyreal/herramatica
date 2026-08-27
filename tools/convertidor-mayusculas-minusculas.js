'use client'

import { useState } from 'react'

function aTitulo(texto) {
  const minusculas = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'en', 'a', 'un', 'una', 'con', 'del', 'al', 'o', 'que'])
  return texto
    .toLowerCase()
    .split(' ')
    .map((palabra, i) => {
      if (i > 0 && minusculas.has(palabra)) return palabra
      return palabra.charAt(0).toUpperCase() + palabra.slice(1)
    })
    .join(' ')
}

function aOracion(texto) {
  const lower = texto.toLowerCase()
  return lower.replace(/(^\s*[a-záéíóúñ]|[.!?]\s+[a-záéíóúñ])/g, (m) => m.toUpperCase())
}

function alternado(texto) {
  return [...texto].map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('')
}

const OPCIONES = [
  { id: 'mayusculas', label: 'MAYÚSCULAS', fn: (t) => t.toUpperCase() },
  { id: 'minusculas', label: 'minúsculas', fn: (t) => t.toLowerCase() },
  { id: 'titulo', label: 'Cada Palabra En Mayúscula', fn: aTitulo },
  { id: 'oracion', label: 'Primera letra de cada oración', fn: aOracion },
  { id: 'alternado', label: 'aLtErNaDo', fn: alternado },
]

export default function ConvertidorMayusculasMinusculas() {
  const [texto, setTexto] = useState('')
  const [copiado, setCopiado] = useState(null)

  async function copiar(id, valor) {
    try {
      await navigator.clipboard.writeText(valor)
    } catch {
      /* noop */
    }
    setCopiado(id)
    setTimeout(() => setCopiado(null), 1500)
  }

  return (
    <div className="space-y-5">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe o pega tu texto aquí..."
        rows={6}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
      />

      <div className="space-y-2">
        {OPCIONES.map((op) => {
          const resultado = texto ? op.fn(texto) : ''
          return (
            <div key={op.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{op.label}</span>
                <button
                  onClick={() => copiar(op.id, resultado)}
                  disabled={!texto}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  {copiado === op.id ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-gray-900 break-words min-h-[1.5em]">{resultado || <span className="text-gray-300">—</span>}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

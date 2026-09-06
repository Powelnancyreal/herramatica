'use client'

import { useMemo, useState } from 'react'

function invertirCaracteres(texto) {
  return [...texto].reverse().join('')
}

function invertirOrdenPalabras(texto) {
  return texto.split(/(\s+)/).reverse().join('')
}

function invertirCadaPalabra(texto) {
  return texto.replace(/\S+/g, (palabra) => [...palabra].reverse().join(''))
}

const MODOS = [
  { id: 'caracteres', label: 'Invertir todo el texto', fn: invertirCaracteres },
  { id: 'orden_palabras', label: 'Invertir el orden de las palabras', fn: invertirOrdenPalabras },
  { id: 'cada_palabra', label: 'Invertir cada palabra', fn: invertirCadaPalabra },
]

export default function PalabrasAlReves() {
  const [texto, setTexto] = useState('')
  const [modo, setModo] = useState('caracteres')
  const [copiado, setCopiado] = useState(false)

  const resultado = useMemo(() => {
    const activo = MODOS.find((m) => m.id === modo)
    return activo.fn(texto)
  }, [texto, modo])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resultado)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // portapapeles no disponible
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {MODOS.map((m) => (
          <button
            key={m.id}
            onClick={() => setModo(m.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              modo === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu texto</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe o pega tu texto aquí..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Resultado</p>
        <p className="text-xl font-semibold text-blue-700 break-words min-h-[2rem]">{resultado || '—'}</p>
      </div>

      <button
        onClick={copiar}
        disabled={!resultado}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          copiado ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {copiado ? '¡Copiado!' : 'Copiar resultado'}
      </button>
    </div>
  )
}

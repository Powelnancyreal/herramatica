'use client'

import { useState } from 'react'

const PALABRAS = [
  'Ninja', 'Sombra', 'Fantasma', 'Lobo', 'Dragón', 'Fénix', 'Sniper', 'Asesino',
  'Guerrero', 'Alfa', 'Bestia', 'Cazador', 'Killer', 'Legend', 'Master', 'Rey',
  'Reina', 'Salvaje', 'Demonio', 'Ángel', 'Estrella', 'Fuego', 'Hielo', 'Rayo',
  'Noche', 'Luna', 'Toxic', 'Pro', 'God', 'Beast', 'Shadow', 'Dark', 'King',
]

const SIMBOLOS = ['✿', '➹', '⚡', '亗', '❦', '☆', '兀', '✞', '﹏', 'ᴳᴳ', '⚔', '✦', '☬', '气']

function randInt(max) {
  return Math.floor(Math.random() * max)
}

function generarNombre({ base, usarSimbolos, usarNumero, combinarDos }) {
  const partes = []
  if (usarSimbolos) partes.push(SIMBOLOS[randInt(SIMBOLOS.length)])

  if (base.trim()) {
    partes.push(base.trim())
  } else {
    partes.push(PALABRAS[randInt(PALABRAS.length)])
    if (combinarDos) partes.push(PALABRAS[randInt(PALABRAS.length)])
  }

  if (usarNumero) partes.push(String(randInt(999)).padStart(2, '0'))
  if (usarSimbolos) partes.push(SIMBOLOS[randInt(SIMBOLOS.length)])

  return partes.join(usarSimbolos ? '' : '')
}

export default function GeneradorDeNombresParaFreeFire() {
  const [base, setBase] = useState('')
  const [usarSimbolos, setUsarSimbolos] = useState(true)
  const [usarNumero, setUsarNumero] = useState(true)
  const [combinarDos, setCombinarDos] = useState(true)
  const [nombres, setNombres] = useState([])
  const [copiado, setCopiado] = useState(null)

  function generar() {
    const opciones = { base, usarSimbolos, usarNumero, combinarDos }
    setNombres(Array.from({ length: 10 }, () => generarNombre(opciones)))
  }

  async function copiar(nombre, i) {
    try {
      await navigator.clipboard.writeText(nombre)
      setCopiado(i)
      setTimeout(() => setCopiado(null), 1500)
    } catch {
      // portapapeles no disponible
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu nombre o apodo (opcional)</label>
        <input
          type="text"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          placeholder="Déjalo vacío para generar uno aleatorio"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={usarSimbolos} onChange={(e) => setUsarSimbolos(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Añadir símbolos decorativos
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={usarNumero} onChange={(e) => setUsarNumero(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Añadir número
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={combinarDos} onChange={(e) => setCombinarDos(e.target.checked)} disabled={!!base.trim()} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40" />
          Combinar dos palabras (solo si no escribes un nombre)
        </label>
      </div>

      <button onClick={generar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
        Generar nombres
      </button>

      {nombres.length > 0 && (
        <div className="space-y-2">
          {nombres.map((nombre, i) => (
            <button
              key={i}
              onClick={() => copiar(nombre, i)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                copiado === i ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="text-lg font-semibold text-gray-900 break-all">{nombre}</span>
              <span className="flex-shrink-0 text-xs font-semibold text-gray-400">{copiado === i ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

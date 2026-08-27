'use client'

import { useState } from 'react'

function normalizar(nombre) {
  return nombre
    .trim()
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
}

// Algoritmo determinista: el mismo par de nombres siempre da el mismo resultado,
// y el orden de los nombres no importa (se ordenan antes de combinar).
export function calcularCompatibilidad(nombre1, nombre2) {
  const n1 = normalizar(nombre1)
  const n2 = normalizar(nombre2)
  const combinado = [n1, n2].sort().join('+')
  let hash = 0
  for (let i = 0; i < combinado.length; i++) {
    hash = (hash * 31 + combinado.charCodeAt(i)) % 1000000007
  }
  return Math.abs(hash) % 101
}

const NIVELES = [
  { max: 20, emoji: '💔', mensaje: 'Puede que ahora mismo no haya mucha química... ¡pero el amor a veces sorprende!' },
  { max: 40, emoji: '🤔', mensaje: 'Hay una pequeña chispa. Con algo de esfuerzo y paciencia, podría crecer.' },
  { max: 60, emoji: '💗', mensaje: 'Hay potencial de verdad. La compatibilidad está ahí, solo hace falta cultivarla.' },
  { max: 80, emoji: '💞', mensaje: '¡Buena compatibilidad! Parece que hay una conexión especial entre vosotros.' },
  { max: 95, emoji: '💕', mensaje: '¡Gran compatibilidad! Esto pinta muy bien.' },
  { max: 101, emoji: '💘', mensaje: '¡Compatibilidad casi perfecta! Parece que estáis hechos el uno para el otro.' },
]

function getNivel(porcentaje) {
  return NIVELES.find((n) => porcentaje <= n.max)
}

export default function CalculadoraDelAmor() {
  const [nombre1, setNombre1] = useState('')
  const [nombre2, setNombre2] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

  function handleCalcular() {
    if (!nombre1.trim() || !nombre2.trim()) {
      setError('Introduce ambos nombres para calcular la compatibilidad.')
      return
    }
    setError('')
    const porcentaje = calcularCompatibilidad(nombre1, nombre2)
    setResult({ porcentaje, nivel: getNivel(porcentaje) })
    setCopiado(false)
  }

  async function copiarResultado() {
    if (!result) return
    const texto = `💘 ${nombre1.trim()} + ${nombre2.trim()} = ${result.porcentaje}% de compatibilidad según la Calculadora del Amor`
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      /* noop */
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu nombre</label>
          <input
            type="text"
            value={nombre1}
            onChange={(e) => setNombre1(e.target.value)}
            placeholder="Ej: Ana"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Su nombre</label>
          <input
            type="text"
            value={nombre2}
            onChange={(e) => setNombre2(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalcular()}
            placeholder="Ej: Juan"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
      >
        💘 Calcular compatibilidad
      </button>

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-red-50 p-6 text-center">
            <p className="text-5xl mb-2">{result.nivel.emoji}</p>
            <p className="text-lg text-gray-700 mb-1">
              {nombre1.trim()} <span className="text-pink-500">♥</span> {nombre2.trim()}
            </p>
            <p className="text-6xl font-bold text-pink-600 my-3">{result.porcentaje}%</p>

            <div className="h-3 rounded-full bg-white border border-pink-100 overflow-hidden max-w-xs mx-auto mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-all"
                style={{ width: `${result.porcentaje}%` }}
              />
            </div>

            <p className="text-gray-700">{result.nivel.mensaje}</p>
          </div>

          <button
            onClick={copiarResultado}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${
              copiado ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            {copiado ? '¡Copiado!' : 'Copiar resultado'}
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Solo por diversión — este resultado no tiene ninguna base científica.
      </p>
    </div>
  )
}

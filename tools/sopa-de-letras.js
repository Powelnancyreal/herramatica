'use client'

import { useMemo, useState } from 'react'

const DIRECCIONES = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]
const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function limpiarPalabra(palabra) {
  return palabra
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

export function generarSopaDeLetras(palabrasInput, size) {
  const palabras = [...new Set(palabrasInput.map(limpiarPalabra).filter((w) => w.length > 0 && w.length <= size))].sort(
    (a, b) => b.length - a.length
  )

  const grid = Array.from({ length: size }, () => Array(size).fill(null))
  const colocadas = []
  const noColocadas = []

  for (const palabra of palabras) {
    let colocada = false
    for (let intento = 0; intento < 200 && !colocada; intento++) {
      const [dr, dc] = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)]
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      const endRow = row + dr * (palabra.length - 1)
      const endCol = col + dc * (palabra.length - 1)
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue

      let cabe = true
      for (let i = 0; i < palabra.length; i++) {
        const existente = grid[row + dr * i][col + dc * i]
        if (existente !== null && existente !== palabra[i]) {
          cabe = false
          break
        }
      }
      if (!cabe) continue

      for (let i = 0; i < palabra.length; i++) {
        grid[row + dr * i][col + dc * i] = palabra[i]
      }
      colocadas.push({ palabra, row, col, dr, dc })
      colocada = true
    }
    if (!colocada) noColocadas.push(palabra)
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) grid[r][c] = ALFABETO[Math.floor(Math.random() * ALFABETO.length)]
    }
  }

  return { grid, colocadas, noColocadas }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function SopaDeLetras() {
  const [texto, setTexto] = useState('SOL\nLUNA\nESTRELLA\nCIELO\nNUBE\nLLUVIA')
  const [tamano, setTamano] = useState('12')
  const [mostrarSolucion, setMostrarSolucion] = useState(false)
  const [seed, setSeed] = useState(0)

  const resultado = useMemo(() => {
    const palabras = texto.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean)
    if (palabras.length === 0) return null
    const size = parseInt(tamano, 10)
    return { ...generarSopaDeLetras(palabras, size), size }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, tamano, seed])

  const celdasResaltadas = useMemo(() => {
    if (!resultado || !mostrarSolucion) return new Set()
    const set = new Set()
    resultado.colocadas.forEach(({ palabra, row, col, dr, dc }) => {
      for (let i = 0; i < palabra.length; i++) set.add(`${row + dr * i},${col + dc * i}`)
    })
    return set
  }, [resultado, mostrarSolucion])

  function imprimir() {
    window.print()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Palabras (una por línea o separadas por coma)</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y font-mono text-sm"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tamaño de la cuadrícula</label>
            <select value={tamano} onChange={(e) => setTamano(e.target.value)} className={inputClass}>
              <option value="10">10 × 10</option>
              <option value="12">12 × 12</option>
              <option value="15">15 × 15</option>
              <option value="18">18 × 18</option>
            </select>
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors"
          >
            🔄 Generar otra distribución
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={mostrarSolucion} onChange={(e) => setMostrarSolucion(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Mostrar solución
          </label>
          <button onClick={imprimir} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {resultado && (
        <div className="space-y-3">
          {resultado.noColocadas.length > 0 && (
            <p className="text-xs text-amber-600">
              ⚠️ No se pudieron colocar: {resultado.noColocadas.join(', ')}. Prueba con una cuadrícula más grande o palabras más cortas.
            </p>
          )}
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-0.5 bg-gray-100 p-2 rounded-lg mx-auto"
              style={{ gridTemplateColumns: `repeat(${resultado.size}, minmax(0, 1fr))` }}
            >
              {resultado.grid.map((row, r) =>
                row.map((letra, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold rounded-sm ${
                      celdasResaltadas.has(`${r},${c}`) ? 'bg-blue-200 text-blue-800' : 'bg-white text-gray-800'
                    }`}
                  >
                    {letra}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {resultado.colocadas.map(({ palabra }) => (
              <span key={palabra} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {palabra}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

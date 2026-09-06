'use client'

import { useMemo, useState } from 'react'

function limpiarPalabra(palabra) {
  return palabra
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

export function generarCrucigrama(entradasInput, size) {
  const palabras = entradasInput
    .map((e) => ({ ...e, palabra: limpiarPalabra(e.palabra) }))
    .filter((e) => e.palabra.length > 1 && e.palabra.length <= size)
    .sort((a, b) => b.palabra.length - a.palabra.length)

  if (palabras.length === 0) return { grid: null, colocadas: [], noColocadas: [] }

  const grid = Array.from({ length: size }, () => Array(size).fill(null))
  const colocadas = []
  const noColocadas = []

  function cabe(palabra, row, col, dr, dc) {
    for (let i = 0; i < palabra.length; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r < 0 || r >= size || c < 0 || c >= size) return false
      const existente = grid[r][c]
      if (existente !== null && existente !== palabra[i]) return false
    }
    return true
  }
  function colocar(palabra, row, col, dr, dc) {
    for (let i = 0; i < palabra.length; i++) grid[row + dr * i][col + dc * i] = palabra[i]
  }

  const primera = palabras[0]
  const startRow = Math.floor(size / 2)
  const startCol = Math.floor((size - primera.palabra.length) / 2)
  colocar(primera.palabra, startRow, startCol, 0, 1)
  colocadas.push({ ...primera, row: startRow, col: startCol, dr: 0, dc: 1, orientacion: 'horizontal' })

  for (let idx = 1; idx < palabras.length; idx++) {
    const entrada = palabras[idx]
    const palabra = entrada.palabra
    let mejor = null

    for (const colocada of colocadas) {
      const otraDr = colocada.dc
      const otraDc = colocada.dr
      for (let i = 0; i < palabra.length && !mejor; i++) {
        for (let j = 0; j < colocada.palabra.length; j++) {
          if (palabra[i] !== colocada.palabra[j]) continue
          const interRow = colocada.row + colocada.dr * j
          const interCol = colocada.col + colocada.dc * j
          const row = interRow - otraDr * i
          const col = interCol - otraDc * i
          if (cabe(palabra, row, col, otraDr, otraDc)) {
            mejor = { row, col, dr: otraDr, dc: otraDc }
            break
          }
        }
        if (mejor) break
      }
      if (mejor) break
    }

    if (mejor) {
      colocar(palabra, mejor.row, mejor.col, mejor.dr, mejor.dc)
      colocadas.push({ ...entrada, row: mejor.row, col: mejor.col, dr: mejor.dr, dc: mejor.dc, orientacion: mejor.dc === 1 ? 'horizontal' : 'vertical' })
    } else {
      noColocadas.push(entrada)
    }
  }

  const posiciones = [...new Set(colocadas.map((c) => `${c.row},${c.col}`))]
    .map((s) => s.split(',').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const numeroPorPosicion = {}
  posiciones.forEach(([r, c], i) => {
    numeroPorPosicion[`${r},${c}`] = i + 1
  })
  colocadas.forEach((c) => {
    c.numero = numeroPorPosicion[`${c.row},${c.col}`]
  })

  return { grid, colocadas, noColocadas }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function GeneradorDeCrucigramas() {
  const [texto, setTexto] = useState(
    'CALCULADORA: Herramienta para hacer cuentas\nLETRA: Símbolo del alfabeto\nONLINE: Conectado a internet\nGRATIS: Sin costo\nJUEGO: Actividad de entretenimiento\nRED: Conjunto de conexiones\nCASA: Donde vives'
  )
  const [tamano, setTamano] = useState('15')
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false)
  const [seed, setSeed] = useState(0)

  const resultado = useMemo(() => {
    const entradas = texto
      .split('\n')
      .map((linea) => {
        const [palabra, ...resto] = linea.split(':')
        return { palabra: (palabra || '').trim(), clue: resto.join(':').trim() || '(sin pista)' }
      })
      .filter((e) => e.palabra)
    if (entradas.length === 0) return null
    return generarCrucigrama(entradas, parseInt(tamano, 10))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, tamano, seed])

  function imprimir() {
    window.print()
  }

  const across = resultado?.colocadas.filter((c) => c.orientacion === 'horizontal').sort((a, b) => a.numero - b.numero) || []
  const down = resultado?.colocadas.filter((c) => c.orientacion === 'vertical').sort((a, b) => a.numero - b.numero) || []

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Palabras y pistas (formato: PALABRA: pista)</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={7}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Tamaño de la cuadrícula</label>
          <select value={tamano} onChange={(e) => setTamano(e.target.value)} className={inputClass}>
            <option value="12">12 × 12</option>
            <option value="15">15 × 15</option>
            <option value="18">18 × 18</option>
            <option value="20">20 × 20</option>
          </select>
        </div>
        <button onClick={() => setSeed((s) => s + 1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors">
          🔄 Reorganizar
        </button>
        <button onClick={imprimir} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
          🖨️ Imprimir
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={mostrarRespuestas} onChange={(e) => setMostrarRespuestas(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        Mostrar respuestas
      </label>

      {resultado?.grid && (
        <div className="space-y-4">
          {resultado.noColocadas.length > 0 && (
            <p className="text-xs text-amber-600">
              ⚠️ No se pudieron colocar (no comparten letras con las demás): {resultado.noColocadas.map((e) => e.palabra).join(', ')}.
            </p>
          )}
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-0.5 bg-gray-800 p-1 rounded-lg mx-auto"
              style={{ gridTemplateColumns: `repeat(${resultado.grid.length}, minmax(0, 1fr))` }}
            >
              {resultado.grid.map((row, r) =>
                row.map((letra, c) => {
                  const numero = resultado.colocadas.find((w) => w.row === r && w.col === c)?.numero
                  return (
                    <div key={`${r}-${c}`} className={`relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs font-bold ${letra ? 'bg-white text-gray-800' : 'bg-gray-800'}`}>
                      {numero && <span className="absolute top-0 left-0.5 text-[8px] text-gray-400 font-normal">{numero}</span>}
                      {letra && mostrarRespuestas ? letra : ''}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Horizontales</h3>
              <ul className="space-y-1 text-gray-700">
                {across.map((w) => (
                  <li key={`${w.numero}-h`}>
                    <strong>{w.numero}.</strong> {w.clue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verticales</h3>
              <ul className="space-y-1 text-gray-700">
                {down.map((w) => (
                  <li key={`${w.numero}-v`}>
                    <strong>{w.numero}.</strong> {w.clue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

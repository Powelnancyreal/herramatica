'use client'

import { useMemo, useState } from 'react'

function limpiarPalabra(palabra) {
  return palabra
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

// Generador pseudoaleatorio con semilla (mulberry32): la misma semilla da siempre el mismo crucigrama.
function crearAzar(semilla) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// semilla 0: colocación fija (la que se ve al cargar). Otras semillas: otra disposición válida.
export function generarCrucigrama(entradasInput, size, semilla = 0) {
  const azar = semilla ? crearAzar(semilla) : null
  let palabras = entradasInput
    .map((e) => ({ ...e, palabra: limpiarPalabra(e.palabra) }))
    .filter((e) => e.palabra.length > 1 && e.palabra.length <= size)
  if (azar) {
    for (let i = palabras.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1))
      ;[palabras[i], palabras[j]] = [palabras[j], palabras[i]]
    }
  }
  palabras = palabras.sort((a, b) => b.palabra.length - a.palabra.length)

  if (palabras.length === 0) return { grid: null, colocadas: [], noColocadas: [] }

  const grid = Array.from({ length: size }, () => Array(size).fill(null))
  // Dirección de las palabras que pasan por cada casilla, para no montar una palabra sobre otra paralela.
  const dirs = Array.from({ length: size }, () => Array.from({ length: size }, () => ({ h: false, v: false })))
  const colocadas = []
  const dentro = (r, c) => r >= 0 && r < size && c >= 0 && c < size

  // Reglas de un crucigrama: cada letra nueva no puede tocar otra por los lados, la palabra no puede
  // continuar pegada a otra por sus extremos y solo se cruza en perpendicular con letras iguales.
  function cabe(palabra, row, col, dr, dc) {
    if (dentro(row - dr, col - dc) && grid[row - dr][col - dc] !== null) return false
    const finR = row + dr * palabra.length
    const finC = col + dc * palabra.length
    if (dentro(finR, finC) && grid[finR][finC] !== null) return false
    let cruces = 0
    for (let i = 0; i < palabra.length; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (!dentro(r, c)) return false
      const existente = grid[r][c]
      if (existente !== null) {
        if (existente !== palabra[i]) return false
        if (dr === 0 ? dirs[r][c].h : dirs[r][c].v) return false
        cruces++
      } else {
        for (const s of [-1, 1]) {
          const nr = r + dc * s
          const nc = c + dr * s
          if (dentro(nr, nc) && grid[nr][nc] !== null) return false
        }
      }
    }
    return cruces > 0
  }
  function colocar(entrada, row, col, dr, dc) {
    const { palabra } = entrada
    for (let i = 0; i < palabra.length; i++) {
      grid[row + dr * i][col + dc * i] = palabra[i]
      dirs[row + dr * i][col + dc * i][dr === 0 ? 'h' : 'v'] = true
    }
    colocadas.push({ ...entrada, row, col, dr, dc, orientacion: dc === 1 ? 'horizontal' : 'vertical' })
  }

  const primera = palabras[0]
  colocar(primera, Math.floor(size / 2), Math.floor((size - primera.palabra.length) / 2), 0, 1)

  // Se repite mientras alguna palabra pendiente encuentre sitio: una palabra colocada tarde puede abrir cruces nuevos.
  let pendientes = palabras.slice(1)
  let avance = true
  while (pendientes.length && avance) {
    avance = false
    const siguen = []
    for (const entrada of pendientes) {
      const { palabra } = entrada
      const opciones = []
      for (const otra of colocadas) {
        const dr = otra.dc
        const dc = otra.dr
        for (let i = 0; i < palabra.length; i++) {
          for (let j = 0; j < otra.palabra.length; j++) {
            if (palabra[i] !== otra.palabra[j]) continue
            const row = otra.row + otra.dr * j - dr * i
            const col = otra.col + otra.dc * j - dc * i
            if (cabe(palabra, row, col, dr, dc)) opciones.push({ row, col, dr, dc })
          }
        }
      }
      if (opciones.length) {
        const o = azar ? opciones[Math.floor(azar() * opciones.length)] : opciones[0]
        colocar(entrada, o.row, o.col, o.dr, o.dc)
        avance = true
      } else {
        siguen.push(entrada)
      }
    }
    pendientes = siguen
  }
  const noColocadas = pendientes

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

// Huella de una disposición, para que «Reorganizar» busque una que se vea distinta.
export const firmaCrucigrama = (r) => (r?.colocadas || []).map((c) => `${c.palabra}${c.row},${c.col}${c.orientacion[0]}`).sort().join('|')

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

  const entradas = useMemo(
    () =>
      texto
        .split('\n')
        .map((linea) => {
          const [palabra, ...resto] = linea.split(':')
          return { palabra: (palabra || '').trim(), clue: resto.join(':').trim() || '(sin pista)' }
        })
        .filter((e) => e.palabra),
    [texto]
  )
  const resultado = useMemo(
    () => (entradas.length === 0 ? null : generarCrucigrama(entradas, parseInt(tamano, 10), seed)),
    [entradas, tamano, seed]
  )

  // Busca la siguiente semilla que dé una disposición distinta de la que se ve ahora.
  function reorganizar() {
    if (!resultado) return
    const actual = firmaCrucigrama(resultado)
    for (let s = seed + 1; s <= seed + 40; s++) {
      const otro = generarCrucigrama(entradas, parseInt(tamano, 10), s)
      if (firmaCrucigrama(otro) !== actual && otro.noColocadas.length <= resultado.noColocadas.length) return setSeed(s)
    }
    setSeed(seed + 1)
  }

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
        <button onClick={reorganizar} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors">
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
              ⚠️ No se pudieron colocar (no encontraron un cruce libre; pulsa «Reorganizar» o añade palabras con letras en común): {resultado.noColocadas.map((e) => e.palabra).join(', ')}.
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

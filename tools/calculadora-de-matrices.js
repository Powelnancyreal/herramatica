'use client'

import { useMemo, useState } from 'react'

function crearMatriz(n, m) {
  return Array.from({ length: n }, () => Array(m).fill(0))
}

function sumar(A, B, signo = 1) {
  return A.map((fila, i) => fila.map((v, j) => v + signo * B[i][j]))
}

function multiplicar(A, B) {
  const filas = A.length
  const cols = B[0].length
  const inter = B.length
  const R = crearMatriz(filas, cols)
  for (let i = 0; i < filas; i++)
    for (let j = 0; j < cols; j++)
      for (let k = 0; k < inter; k++) R[i][j] += A[i][k] * B[k][j]
  return R
}

function transponer(A) {
  return A[0].map((_, j) => A.map((fila) => fila[j]))
}

export function determinante(m) {
  const n = m.length
  if (n === 1) return m[0][0]
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
  let det = 0
  for (let j = 0; j < n; j++) {
    const menor = m.slice(1).map((fila) => fila.filter((_, c) => c !== j))
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinante(menor)
  }
  return det
}

export function inversa(m) {
  const n = m.length
  const det = determinante(m)
  if (Math.abs(det) < 1e-10) return null
  const a = m.map((fila, i) => [...fila, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))])
  for (let col = 0; col < n; col++) {
    let pivotFila = col
    for (let r = col + 1; r < n; r++) if (Math.abs(a[r][col]) > Math.abs(a[pivotFila][col])) pivotFila = r
    ;[a[col], a[pivotFila]] = [a[pivotFila], a[col]]
    const piv = a[col][col]
    for (let j = 0; j < 2 * n; j++) a[col][j] /= piv
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = a[r][col]
      for (let j = 0; j < 2 * n; j++) a[r][j] -= factor * a[col][j]
    }
  }
  return a.map((fila) => fila.slice(n))
}

const OPERACIONES = [
  { id: 'suma', label: 'A + B' },
  { id: 'resta', label: 'A − B' },
  { id: 'mult', label: 'A × B' },
  { id: 'det', label: 'Determinante de A' },
  { id: 'inv', label: 'Inversa de A' },
  { id: 'transp', label: 'Transpuesta de A' },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(4))
}

function MatrizInput({ matriz, onChange, label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${matriz[0].length}, minmax(0, 1fr))` }}>
        {matriz.map((fila, i) =>
          fila.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={(e) => onChange(i, j, parseFloat(e.target.value) || 0)}
              className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))
        )}
      </div>
    </div>
  )
}

function MatrizResultado({ matriz }) {
  return (
    <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${matriz[0].length}, minmax(0, 1fr))` }}>
      {matriz.map((fila, i) =>
        fila.map((val, j) => (
          <div key={`${i}-${j}`} className="w-16 border border-blue-200 bg-white rounded-lg px-2 py-2 text-center font-semibold text-blue-700">
            {formatNum(val)}
          </div>
        ))
      )}
    </div>
  )
}

export default function CalculadoraDeMatrices() {
  const [tamano, setTamano] = useState(2)
  const [matrizA, setMatrizA] = useState(() => crearMatriz(2, 2))
  const [matrizB, setMatrizB] = useState(() => crearMatriz(2, 2))
  const [operacion, setOperacion] = useState('suma')

  function cambiarTamano(n) {
    setTamano(n)
    setMatrizA(crearMatriz(n, n))
    setMatrizB(crearMatriz(n, n))
  }

  function actualizarCelda(matriz, setMatriz, i, j, valor) {
    setMatriz(matriz.map((fila, fi) => (fi === i ? fila.map((v, fj) => (fj === j ? valor : v)) : fila)))
  }

  const resultado = useMemo(() => {
    try {
      if (operacion === 'suma') return { tipo: 'matriz', valor: sumar(matrizA, matrizB, 1) }
      if (operacion === 'resta') return { tipo: 'matriz', valor: sumar(matrizA, matrizB, -1) }
      if (operacion === 'mult') return { tipo: 'matriz', valor: multiplicar(matrizA, matrizB) }
      if (operacion === 'det') return { tipo: 'numero', valor: determinante(matrizA) }
      if (operacion === 'transp') return { tipo: 'matriz', valor: transponer(matrizA) }
      if (operacion === 'inv') {
        const inv = inversa(matrizA)
        return inv ? { tipo: 'matriz', valor: inv } : { tipo: 'error', valor: 'La matriz A no tiene inversa (su determinante es 0).' }
      }
    } catch {
      return { tipo: 'error', valor: 'No se pudo calcular. Revisa las dimensiones de las matrices.' }
    }
  }, [matrizA, matrizB, operacion])

  const necesitaB = operacion === 'suma' || operacion === 'resta' || operacion === 'mult'

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => cambiarTamano(n)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              tamano === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {n}×{n}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Operación</label>
        <div className="flex gap-2 flex-wrap">
          {OPERACIONES.map((op) => (
            <button
              key={op.id}
              onClick={() => setOperacion(op.id)}
              className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
                operacion === op.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <MatrizInput matriz={matrizA} onChange={(i, j, v) => actualizarCelda(matrizA, setMatrizA, i, j, v)} label="Matriz A" />
        {necesitaB && <MatrizInput matriz={matrizB} onChange={(i, j, v) => actualizarCelda(matrizB, setMatrizB, i, j, v)} label="Matriz B" />}
      </div>

      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Resultado</p>
        {resultado?.tipo === 'matriz' && <MatrizResultado matriz={resultado.valor} />}
        {resultado?.tipo === 'numero' && <p className="text-4xl font-bold text-blue-700">{formatNum(resultado.valor)}</p>}
        {resultado?.tipo === 'error' && <p className="text-red-600 text-sm">{resultado.valor}</p>}
      </div>
    </div>
  )
}

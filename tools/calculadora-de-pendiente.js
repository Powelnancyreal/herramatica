'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return '—'
  return parseFloat(n.toFixed(4))
}

export default function CalculadoraDePendiente() {
  const [x1, setX1] = useState('')
  const [y1, setY1] = useState('')
  const [x2, setX2] = useState('')
  const [y2, setY2] = useState('')

  const resultado = useMemo(() => {
    const vx1 = parseFloat(x1)
    const vy1 = parseFloat(y1)
    const vx2 = parseFloat(x2)
    const vy2 = parseFloat(y2)
    if ([vx1, vy1, vx2, vy2].some(isNaN)) return null
    if (vx1 === vx2) return { vertical: true }
    const m = (vy2 - vy1) / (vx2 - vx1)
    const b = vy1 - m * vx1
    return { m, b, vertical: false }
  }, [x1, y1, x2, y2])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Punto 1: x₁</label>
          <input type="number" inputMode="decimal" value={x1} onChange={(e) => setX1(e.target.value)} placeholder="Ej: 1" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Punto 1: y₁</label>
          <input type="number" inputMode="decimal" value={y1} onChange={(e) => setY1(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Punto 2: x₂</label>
          <input type="number" inputMode="decimal" value={x2} onChange={(e) => setX2(e.target.value)} placeholder="Ej: 3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Punto 2: y₂</label>
          <input type="number" inputMode="decimal" value={y2} onChange={(e) => setY2(e.target.value)} placeholder="Ej: 8" className={inputClass} />
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pendiente (m)</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.vertical && <p className="text-lg font-semibold text-blue-700">Recta vertical (pendiente indefinida)</p>}
        {resultado && !resultado.vertical && <p className="text-4xl font-bold text-blue-700">{formatNum(resultado.m)}</p>}
      </div>

      {resultado && !resultado.vertical && (
        <p className="text-sm text-gray-600 text-center font-mono">
          Ecuación de la recta: y = {formatNum(resultado.m)}x {resultado.b >= 0 ? '+' : '−'} {formatNum(Math.abs(resultado.b))}
        </p>
      )}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'que_es', label: '¿Qué es X% de Y?' },
  { id: 'que_porcentaje', label: 'X es qué % de Y?' },
  { id: 'variacion', label: 'Aumento / Descuento' },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(4)).toLocaleString('es')
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPorcentaje() {
  const [tab, setTab] = useState('que_es')

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'que_es' && <QueEsXDeY />}
      {tab === 'que_porcentaje' && <QuePorcentajeEs />}
      {tab === 'variacion' && <Variacion />}
    </div>
  )
}

function ResultBox({ children }) {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
      {children}
    </div>
  )
}

// ─── Tab 1: ¿Qué es X% de Y? ─────────────────────────────────────────

function QueEsXDeY() {
  const [porcentaje, setPorcentaje] = useState('')
  const [valor, setValor] = useState('')

  const resultado = useMemo(() => {
    const p = parseFloat(porcentaje)
    const v = parseFloat(valor)
    if (isNaN(p) || isNaN(v)) return null
    return (p / 100) * v
  }, [porcentaje, valor])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Porcentaje (%)</label>
          <input type="number" inputMode="decimal" value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} placeholder="Ej: 20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Del número</label>
          <input type="number" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ej: 150" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        <p className="text-4xl font-bold text-blue-700">{formatNum(resultado)}</p>
        {resultado !== null && (
          <p className="text-sm text-gray-500 mt-2">
            {porcentaje}% de {valor} es {formatNum(resultado)}
          </p>
        )}
      </ResultBox>
    </div>
  )
}

// ─── Tab 2: X es qué % de Y? ──────────────────────────────────────────

function QuePorcentajeEs() {
  const [x, setX] = useState('')
  const [y, setY] = useState('')

  const resultado = useMemo(() => {
    const a = parseFloat(x)
    const b = parseFloat(y)
    if (isNaN(a) || isNaN(b) || b === 0) return null
    return (a / b) * 100
  }, [x, y])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Número (X)</label>
          <input type="number" inputMode="decimal" value={x} onChange={(e) => setX(e.target.value)} placeholder="Ej: 30" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Es qué % de (Y)</label>
          <input type="number" inputMode="decimal" value={y} onChange={(e) => setY(e.target.value)} placeholder="Ej: 150" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? `${formatNum(resultado)}%` : '—'}</p>
        {resultado !== null && (
          <p className="text-sm text-gray-500 mt-2">
            {x} es el {formatNum(resultado)}% de {y}
          </p>
        )}
      </ResultBox>
    </div>
  )
}

// ─── Tab 3: Aumento / Descuento (en ambos sentidos) ──────────────────

function Variacion() {
  const [inicial, setInicial] = useState('')
  const [final, setFinal] = useState('')
  const [porcentaje, setPorcentaje] = useState('')
  const [operacion, setOperacion] = useState('aumento')

  const valorFinalCalculado = useMemo(() => {
    const v = parseFloat(inicial)
    const p = parseFloat(porcentaje)
    if (isNaN(v) || isNaN(p)) return null
    return operacion === 'aumento' ? v * (1 + p / 100) : v * (1 - p / 100)
  }, [inicial, porcentaje, operacion])

  const variacionCalculada = useMemo(() => {
    const a = parseFloat(inicial)
    const b = parseFloat(final)
    if (isNaN(a) || isNaN(b) || a === 0) return null
    return ((b - a) / Math.abs(a)) * 100
  }, [inicial, final])

  return (
    <div className="space-y-8">
      {/* Sub-tool A: apply a % increase/decrease to a value */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Aplicar un % de aumento o descuento</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOperacion('aumento')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${operacion === 'aumento' ? 'bg-green-100 text-green-700 ring-1 ring-green-400' : 'bg-gray-100 text-gray-500'}`}
          >
            ↑ Aumento
          </button>
          <button
            onClick={() => setOperacion('descuento')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${operacion === 'descuento' ? 'bg-red-100 text-red-700 ring-1 ring-red-400' : 'bg-gray-100 text-gray-500'}`}
          >
            ↓ Descuento
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Valor inicial</label>
            <input type="number" inputMode="decimal" value={inicial} onChange={(e) => setInicial(e.target.value)} placeholder="Ej: 200" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Porcentaje (%)</label>
            <input type="number" inputMode="decimal" value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} placeholder="Ej: 15" className={inputClass} />
          </div>
        </div>
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Valor final</p>
          <p className="text-4xl font-bold text-blue-700">{formatNum(valorFinalCalculado)}</p>
        </ResultBox>
      </div>

      {/* Sub-tool B: find % variation between two values */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-semibold text-gray-900">¿Qué % de variación hay entre dos valores?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Valor inicial</label>
            <input type="number" inputMode="decimal" value={inicial} onChange={(e) => setInicial(e.target.value)} placeholder="Ej: 200" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Valor final</label>
            <input type="number" inputMode="decimal" value={final} onChange={(e) => setFinal(e.target.value)} placeholder="Ej: 230" className={inputClass} />
          </div>
        </div>
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Variación</p>
          <p className={`text-4xl font-bold ${variacionCalculada > 0 ? 'text-green-600' : variacionCalculada < 0 ? 'text-red-600' : 'text-blue-700'}`}>
            {variacionCalculada !== null ? `${variacionCalculada > 0 ? '+' : ''}${formatNum(variacionCalculada)}%` : '—'}
          </p>
          {variacionCalculada !== null && (
            <p className="text-sm text-gray-500 mt-2">{variacionCalculada >= 0 ? 'Aumento' : 'Descuento'} respecto al valor inicial</p>
          )}
        </ResultBox>
      </div>
    </div>
  )
}

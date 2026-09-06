'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(6))
}

const TABS = [
  { id: 'lineal', label: 'Ecuación Lineal (ax + b = 0)' },
  { id: 'cuadratica', label: 'Ecuación Cuadrática (ax² + bx + c = 0)' },
]

export default function CalculadoraDeEcuaciones() {
  const [tab, setTab] = useState('lineal')
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
      {tab === 'lineal' ? <Lineal /> : <Cuadratica />}
    </div>
  )
}

function Lineal() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const resultado = useMemo(() => {
    const va = parseFloat(a)
    const vb = parseFloat(b)
    if (isNaN(va) || isNaN(vb)) return null
    if (va === 0) return vb === 0 ? { tipo: 'infinitas' } : { tipo: 'sinsolucion' }
    return { tipo: 'una', x: -vb / va }
  }, [a, b])

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 text-center font-mono">a·x + b = 0</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>a</label>
          <input type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>b</label>
          <input type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="Ej: -8" className={inputClass} />
        </div>
      </div>
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Solución</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.tipo === 'una' && <p className="text-4xl font-bold text-blue-700">x = {formatNum(resultado.x)}</p>}
        {resultado?.tipo === 'infinitas' && <p className="text-lg font-semibold text-blue-700">Infinitas soluciones (0 = 0)</p>}
        {resultado?.tipo === 'sinsolucion' && <p className="text-lg font-semibold text-red-600">Sin solución (ecuación imposible)</p>}
      </div>
    </div>
  )
}

function Cuadratica() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')

  const resultado = useMemo(() => {
    const va = parseFloat(a)
    const vb = parseFloat(b)
    const vc = parseFloat(c)
    if (isNaN(va) || isNaN(vb) || isNaN(vc)) return null
    if (va === 0) return null
    const disc = vb * vb - 4 * va * vc
    if (disc > 0) {
      const sq = Math.sqrt(disc)
      return { tipo: 'dos', x1: (-vb + sq) / (2 * va), x2: (-vb - sq) / (2 * va), disc }
    }
    if (disc === 0) return { tipo: 'una', x: -vb / (2 * va), disc }
    const sq = Math.sqrt(-disc)
    return { tipo: 'complejas', re: -vb / (2 * va), im: sq / (2 * va), disc }
  }, [a, b, c])

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 text-center font-mono">a·x² + b·x + c = 0</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>a</label>
          <input type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="1" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>b</label>
          <input type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="-5" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>c</label>
          <input type="number" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="6" className={inputClass} />
        </div>
      </div>
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Solución</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.tipo === 'dos' && (
          <p className="text-3xl font-bold text-blue-700">
            x₁ = {formatNum(resultado.x1)}, x₂ = {formatNum(resultado.x2)}
          </p>
        )}
        {resultado?.tipo === 'una' && <p className="text-4xl font-bold text-blue-700">x = {formatNum(resultado.x)} (raíz doble)</p>}
        {resultado?.tipo === 'complejas' && (
          <p className="text-2xl font-bold text-blue-700">
            x = {formatNum(resultado.re)} ± {formatNum(resultado.im)}i
          </p>
        )}
      </div>
      {resultado && <p className="text-xs text-gray-500 text-center">Discriminante (b² − 4ac) = {formatNum(resultado.disc)}</p>}
    </div>
  )
}

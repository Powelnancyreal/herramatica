'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'a_escala', label: 'Real → Escala' },
  { id: 'a_real', label: 'Escala → Real' },
  { id: 'calcular_escala', label: 'Calcular la escala' },
]

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(8)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function ResultBox({ children }) {
  return <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">{children}</div>
}

export default function CalculadoraDeEscalas() {
  const [tab, setTab] = useState('a_escala')
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
      {tab === 'a_escala' && <RealAEscala />}
      {tab === 'a_real' && <EscalaAReal />}
      {tab === 'calcular_escala' && <CalcularEscala />}
    </div>
  )
}

function RealAEscala() {
  const [real, setReal] = useState('')
  const [escala, setEscala] = useState('100')
  const resultado = useMemo(() => {
    const r = parseFloat(real)
    const e = parseFloat(escala)
    if (isNaN(r) || isNaN(e) || e <= 0) return null
    return r / e
  }, [real, escala])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Medida real</label>
          <input type="number" inputMode="decimal" min="0" value={real} onChange={(e) => setReal(e.target.value)} placeholder="Ej: 500" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Escala (1:N)</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">1 :</span>
            <input type="number" inputMode="decimal" min="0" value={escala} onChange={(e) => setEscala(e.target.value)} placeholder="Ej: 100" className={inputClass} />
          </div>
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Medida a escala</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
        <p className="text-xs text-gray-500 mt-1">(en las mismas unidades que la medida real)</p>
      </ResultBox>
    </div>
  )
}

function EscalaAReal() {
  const [medida, setMedida] = useState('')
  const [escala, setEscala] = useState('100')
  const resultado = useMemo(() => {
    const m = parseFloat(medida)
    const e = parseFloat(escala)
    if (isNaN(m) || isNaN(e) || e <= 0) return null
    return m * e
  }, [medida, escala])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Medida en el plano/mapa/modelo</label>
          <input type="number" inputMode="decimal" min="0" value={medida} onChange={(e) => setMedida(e.target.value)} placeholder="Ej: 5" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Escala (1:N)</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">1 :</span>
            <input type="number" inputMode="decimal" min="0" value={escala} onChange={(e) => setEscala(e.target.value)} placeholder="Ej: 100" className={inputClass} />
          </div>
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Medida real</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
        <p className="text-xs text-gray-500 mt-1">(en las mismas unidades que la medida del plano)</p>
      </ResultBox>
    </div>
  )
}

function CalcularEscala() {
  const [real, setReal] = useState('')
  const [dibujo, setDibujo] = useState('')
  const resultado = useMemo(() => {
    const r = parseFloat(real)
    const d = parseFloat(dibujo)
    if (isNaN(r) || isNaN(d) || d <= 0) return null
    return r / d
  }, [real, dibujo])

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500">Introduce ambas medidas en la misma unidad (por ejemplo, ambas en cm).</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Medida real</label>
          <input type="number" inputMode="decimal" min="0" value={real} onChange={(e) => setReal(e.target.value)} placeholder="Ej: 500" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Medida en el plano/dibujo</label>
          <input type="number" inputMode="decimal" min="0" value={dibujo} onChange={(e) => setDibujo(e.target.value)} placeholder="Ej: 5" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Escala</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? `1 : ${formatNum(resultado)}` : '—'}</p>
      </ResultBox>
    </div>
  )
}

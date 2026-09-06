'use client'

import { useMemo, useState } from 'react'

const COLORES_DIGITO = [
  { id: 'negro', label: 'Negro', valor: 0, hex: '#1a1a1a' },
  { id: 'marron', label: 'Marrón', valor: 1, hex: '#8b4513' },
  { id: 'rojo', label: 'Rojo', valor: 2, hex: '#dc2626' },
  { id: 'naranja', label: 'Naranja', valor: 3, hex: '#f97316' },
  { id: 'amarillo', label: 'Amarillo', valor: 4, hex: '#eab308' },
  { id: 'verde', label: 'Verde', valor: 5, hex: '#16a34a' },
  { id: 'azul', label: 'Azul', valor: 6, hex: '#2563eb' },
  { id: 'violeta', label: 'Violeta', valor: 7, hex: '#7c3aed' },
  { id: 'gris', label: 'Gris', valor: 8, hex: '#6b7280' },
  { id: 'blanco', label: 'Blanco', valor: 9, hex: '#f3f4f6' },
]

const MULTIPLICADORES = [
  ...COLORES_DIGITO.map((c) => ({ ...c, mult: Math.pow(10, c.valor) })),
  { id: 'dorado', label: 'Dorado', mult: 0.1, hex: '#ca8a04' },
  { id: 'plateado', label: 'Plateado', mult: 0.01, hex: '#9ca3af' },
]

const TOLERANCIAS = [
  { id: 'marron', label: 'Marrón (±1%)', pct: 1 },
  { id: 'rojo', label: 'Rojo (±2%)', pct: 2 },
  { id: 'dorado', label: 'Dorado (±5%)', pct: 5 },
  { id: 'plateado', label: 'Plateado (±10%)', pct: 10 },
  { id: 'ninguno', label: 'Sin banda (±20%)', pct: 20 },
]

function formatOhms(n) {
  if (n >= 1e6) return `${parseFloat((n / 1e6).toFixed(3))} MΩ`
  if (n >= 1e3) return `${parseFloat((n / 1e3).toFixed(3))} kΩ`
  return `${parseFloat(n.toFixed(3))} Ω`
}

const selectClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'resistencia', label: 'Código de Colores' },
  { id: 'ohm', label: "Ley de Ohm" },
]

export default function CalculadoraResistencias() {
  const [tab, setTab] = useState('resistencia')
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
      {tab === 'resistencia' ? <CodigoColores /> : <LeyDeOhm />}
    </div>
  )
}

function CodigoColores() {
  const [d1, setD1] = useState('marron')
  const [d2, setD2] = useState('negro')
  const [mult, setMult] = useState('rojo')
  const [tol, setTol] = useState('dorado')

  const resultado = useMemo(() => {
    const digito1 = COLORES_DIGITO.find((c) => c.id === d1).valor
    const digito2 = COLORES_DIGITO.find((c) => c.id === d2).valor
    const multiplicador = MULTIPLICADORES.find((c) => c.id === mult).mult
    const tolerancia = TOLERANCIAS.find((c) => c.id === tol).pct
    const ohms = (digito1 * 10 + digito2) * multiplicador
    return { ohms, tolerancia }
  }, [d1, d2, mult, tol])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>1ª banda</label>
          <select value={d1} onChange={(e) => setD1(e.target.value)} className={selectClass}>
            {COLORES_DIGITO.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.valor})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>2ª banda</label>
          <select value={d2} onChange={(e) => setD2(e.target.value)} className={selectClass}>
            {COLORES_DIGITO.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.valor})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Multiplicador</label>
          <select value={mult} onChange={(e) => setMult(e.target.value)} className={selectClass}>
            {MULTIPLICADORES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} (×{c.mult})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tolerancia</label>
          <select value={tol} onChange={(e) => setTol(e.target.value)} className={selectClass}>
            {TOLERANCIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 py-2">
        <div className="w-4 h-16 rounded-sm border border-gray-300" style={{ backgroundColor: COLORES_DIGITO.find((c) => c.id === d1).hex }} />
        <div className="w-4 h-16 rounded-sm border border-gray-300" style={{ backgroundColor: COLORES_DIGITO.find((c) => c.id === d2).hex }} />
        <div className="w-4 h-16 rounded-sm border border-gray-300" style={{ backgroundColor: MULTIPLICADORES.find((c) => c.id === mult).hex }} />
        <div className="w-3" />
        <div className="w-4 h-16 rounded-sm border border-gray-300" style={{ backgroundColor: TOLERANCIAS.find((c) => c.id === tol).id === 'ninguno' ? '#fff' : TOLERANCIAS.find((c) => c.id === tol).id === 'marron' ? '#8b4513' : TOLERANCIAS.find((c) => c.id === tol).id === 'rojo' ? '#dc2626' : TOLERANCIAS.find((c) => c.id === tol).id === 'dorado' ? '#ca8a04' : '#9ca3af' }} />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resistencia</p>
        <p className="text-4xl font-bold text-blue-700">
          {formatOhms(resultado.ohms)} <span className="text-2xl">±{resultado.tolerancia}%</span>
        </p>
      </div>
    </div>
  )
}

function LeyDeOhm() {
  const [v, setV] = useState('')
  const [i, setI] = useState('')
  const [r, setR] = useState('')

  const calculado = useMemo(() => {
    const vv = parseFloat(v)
    const ii = parseFloat(i)
    const rr = parseFloat(r)
    const disponibles = [!isNaN(vv), !isNaN(ii), !isNaN(rr)].filter(Boolean).length
    if (disponibles < 2) return null
    if (isNaN(vv)) return { v: ii * rr, i: ii, r: rr, p: ii * ii * rr }
    if (isNaN(ii)) return { v: vv, i: vv / rr, r: rr, p: (vv * vv) / rr }
    return { v: vv, i: ii, r: vv / ii, p: vv * ii }
  }, [v, i, r])

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">Completa dos de los tres campos (voltaje, corriente o resistencia) para calcular el tercero, junto con la potencia.</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Voltaje (V)</label>
          <input type="number" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} placeholder="Volts" className={selectClass} />
        </div>
        <div>
          <label className={labelClass}>Corriente (I)</label>
          <input type="number" inputMode="decimal" value={i} onChange={(e) => setI(e.target.value)} placeholder="Amperes" className={selectClass} />
        </div>
        <div>
          <label className={labelClass}>Resistencia (R)</label>
          <input type="number" inputMode="decimal" value={r} onChange={(e) => setR(e.target.value)} placeholder="Ohms" className={selectClass} />
        </div>
      </div>
      {calculado && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Voltaje</p>
            <p className="font-bold text-blue-700">{calculado.v.toFixed(3)} V</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Corriente</p>
            <p className="font-bold text-blue-700">{calculado.i.toFixed(3)} A</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Resistencia</p>
            <p className="font-bold text-blue-700">{calculado.r.toFixed(3)} Ω</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Potencia</p>
            <p className="font-bold text-blue-700">{calculado.p.toFixed(3)} W</p>
          </div>
        </div>
      )}
    </div>
  )
}

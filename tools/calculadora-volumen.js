'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'cubo', label: 'Cubo' },
  { id: 'esfera', label: 'Esfera' },
  { id: 'cono', label: 'Cono' },
  { id: 'prisma', label: 'Prisma rectangular' },
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

export default function CalculadoraVolumen() {
  const [tab, setTab] = useState('cubo')
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
      {tab === 'cubo' && <Cubo />}
      {tab === 'esfera' && <Esfera />}
      {tab === 'cono' && <Cono />}
      {tab === 'prisma' && <Prisma />}
      <p className="text-xs text-gray-400">¿Necesitas el volumen de un cilindro? Usa nuestra calculadora dedicada de volumen del cilindro.</p>
    </div>
  )
}

function Cubo() {
  const [lado, setLado] = useState('')
  const resultado = useMemo(() => {
    const l = parseFloat(lado)
    return isNaN(l) || l <= 0 ? null : l * l * l
  }, [lado])
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Lado</label>
        <input type="number" inputMode="decimal" min="0" value={lado} onChange={(e) => setLado(e.target.value)} placeholder="Ej: 4" className={inputClass} />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Volumen</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

function Esfera() {
  const [radio, setRadio] = useState('')
  const resultado = useMemo(() => {
    const r = parseFloat(radio)
    return isNaN(r) || r <= 0 ? null : (4 / 3) * Math.PI * r * r * r
  }, [radio])
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Radio</label>
        <input type="number" inputMode="decimal" min="0" value={radio} onChange={(e) => setRadio(e.target.value)} placeholder="Ej: 3" className={inputClass} />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Volumen</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

function Cono() {
  const [radio, setRadio] = useState('')
  const [altura, setAltura] = useState('')
  const resultado = useMemo(() => {
    const r = parseFloat(radio)
    const h = parseFloat(altura)
    return isNaN(r) || isNaN(h) || r <= 0 || h <= 0 ? null : (1 / 3) * Math.PI * r * r * h
  }, [radio, altura])
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Radio de la base</label>
          <input type="number" inputMode="decimal" min="0" value={radio} onChange={(e) => setRadio(e.target.value)} placeholder="Ej: 3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Altura</label>
          <input type="number" inputMode="decimal" min="0" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ej: 8" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Volumen</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

function Prisma() {
  const [largo, setLargo] = useState('')
  const [ancho, setAncho] = useState('')
  const [alto, setAlto] = useState('')
  const resultado = useMemo(() => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const h = parseFloat(alto)
    return isNaN(l) || isNaN(a) || isNaN(h) || l <= 0 || a <= 0 || h <= 0 ? null : l * a * h
  }, [largo, ancho, alto])
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Largo</label>
          <input type="number" inputMode="decimal" min="0" value={largo} onChange={(e) => setLargo(e.target.value)} placeholder="Ej: 5" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ancho</label>
          <input type="number" inputMode="decimal" min="0" value={ancho} onChange={(e) => setAncho(e.target.value)} placeholder="Ej: 3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Alto</label>
          <input type="number" inputMode="decimal" min="0" value={alto} onChange={(e) => setAlto(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Volumen</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

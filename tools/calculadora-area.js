'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'cuadrado', label: 'Cuadrado' },
  { id: 'rectangulo', label: 'Rectángulo' },
  { id: 'triangulo', label: 'Triángulo' },
  { id: 'pitagoras', label: 'Teorema de Pitágoras' },
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

export default function CalculadoraArea() {
  const [tab, setTab] = useState('cuadrado')
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
      {tab === 'cuadrado' && <Cuadrado />}
      {tab === 'rectangulo' && <Rectangulo />}
      {tab === 'triangulo' && <Triangulo />}
      {tab === 'pitagoras' && <Pitagoras />}
    </div>
  )
}

function Cuadrado() {
  const [lado, setLado] = useState('')
  const resultado = useMemo(() => {
    const l = parseFloat(lado)
    if (isNaN(l) || l <= 0) return null
    return { area: l * l, perimetro: l * 4 }
  }, [lado])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Lado</label>
        <input type="number" inputMode="decimal" min="0" value={lado} onChange={(e) => setLado(e.target.value)} placeholder="Ej: 5" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Área</p>
          <p className="text-3xl font-bold text-blue-700">{resultado ? formatNum(resultado.area) : '—'}</p>
        </ResultBox>
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Perímetro</p>
          <p className="text-3xl font-bold text-blue-700">{resultado ? formatNum(resultado.perimetro) : '—'}</p>
        </ResultBox>
      </div>
    </div>
  )
}

function Rectangulo() {
  const [base, setBase] = useState('')
  const [altura, setAltura] = useState('')
  const resultado = useMemo(() => {
    const b = parseFloat(base)
    const h = parseFloat(altura)
    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return null
    return { area: b * h, perimetro: 2 * (b + h) }
  }, [base, altura])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Base</label>
          <input type="number" inputMode="decimal" min="0" value={base} onChange={(e) => setBase(e.target.value)} placeholder="Ej: 8" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Altura</label>
          <input type="number" inputMode="decimal" min="0" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ej: 4" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Área</p>
          <p className="text-3xl font-bold text-blue-700">{resultado ? formatNum(resultado.area) : '—'}</p>
        </ResultBox>
        <ResultBox>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Perímetro</p>
          <p className="text-3xl font-bold text-blue-700">{resultado ? formatNum(resultado.perimetro) : '—'}</p>
        </ResultBox>
      </div>
    </div>
  )
}

function Triangulo() {
  const [base, setBase] = useState('')
  const [altura, setAltura] = useState('')
  const resultado = useMemo(() => {
    const b = parseFloat(base)
    const h = parseFloat(altura)
    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return null
    return (b * h) / 2
  }, [base, altura])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Base</label>
          <input type="number" inputMode="decimal" min="0" value={base} onChange={(e) => setBase(e.target.value)} placeholder="Ej: 6" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Altura</label>
          <input type="number" inputMode="decimal" min="0" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ej: 4" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Área</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

function Pitagoras() {
  const [modo, setModo] = useState('hipotenusa')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const resultado = useMemo(() => {
    const va = parseFloat(a)
    const vb = parseFloat(b)
    if (isNaN(va) || isNaN(vb) || va <= 0 || vb <= 0) return null
    if (modo === 'hipotenusa') return Math.sqrt(va * va + vb * vb)
    if (vb >= va) return null
    return Math.sqrt(va * va - vb * vb)
  }, [modo, a, b])

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('hipotenusa')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'hipotenusa' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          Calcular hipotenusa (con 2 catetos)
        </button>
        <button
          onClick={() => setModo('cateto')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'cateto' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          Calcular un cateto (con hipotenusa y otro cateto)
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{modo === 'hipotenusa' ? 'Cateto a' : 'Hipotenusa'}</label>
          <input type="number" inputMode="decimal" min="0" value={a} onChange={(e) => setA(e.target.value)} placeholder="Ej: 3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{modo === 'hipotenusa' ? 'Cateto b' : 'Cateto conocido'}</label>
          <input type="number" inputMode="decimal" min="0" value={b} onChange={(e) => setB(e.target.value)} placeholder="Ej: 4" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{modo === 'hipotenusa' ? 'Hipotenusa' : 'Cateto'}</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? formatNum(resultado) : '—'}</p>
      </ResultBox>
    </div>
  )
}

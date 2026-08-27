'use client'

import { useMemo, useState } from 'react'

function mcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export function simplificarFraccion(num, den) {
  if (den === 0) return null
  const signo = num * den < 0 ? -1 : 1
  num = Math.abs(num)
  den = Math.abs(den)
  const divisor = mcd(num, den)
  return { num: signo * (num / divisor), den: den / divisor }
}

export function fraccionADecimal(num, den) {
  if (den === 0) return null
  return num / den
}

// Convierte un decimal a fracción exacta usando su representación decimal (no periódica)
export function decimalAFraccion(decimalStr) {
  const str = decimalStr.trim()
  if (!/^-?\d+(\.\d+)?$/.test(str)) return null
  const negativo = str.startsWith('-')
  const limpio = negativo ? str.slice(1) : str
  const [enteroStr, decStr = ''] = limpio.split('.')
  const den = Math.pow(10, decStr.length)
  const num = parseInt(enteroStr + decStr, 10) || 0
  const simplificado = simplificarFraccion(negativo ? -num : num, den)
  return simplificado
}

export function impropiaAMixta(num, den) {
  const signo = num < 0 ? -1 : 1
  num = Math.abs(num)
  const entero = Math.floor(num / den)
  const resto = num % den
  return { entero: signo * entero, num: resto, den }
}

export function mixtaAImpropia(entero, num, den) {
  const signo = entero < 0 ? -1 : 1
  return { num: signo * (Math.abs(entero) * den + num), den }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'fraccion_decimal', label: 'Fracción → Decimal' },
  { id: 'decimal_fraccion', label: 'Decimal → Fracción' },
  { id: 'mixta_impropia', label: 'Mixta ↔ Impropia' },
]

export default function ConvertidorFracciones() {
  const [tab, setTab] = useState('fraccion_decimal')

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

      {tab === 'fraccion_decimal' && <FraccionADecimalUI />}
      {tab === 'decimal_fraccion' && <DecimalAFraccionUI />}
      {tab === 'mixta_impropia' && <MixtaImpropiaUI />}
    </div>
  )
}

function ResultBox({ children }) {
  return <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">{children}</div>
}

function FraccionADecimalUI() {
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')

  const resultado = useMemo(() => {
    const n = parseFloat(num)
    const d = parseFloat(den)
    if (isNaN(n) || isNaN(d) || d === 0) return null
    return fraccionADecimal(n, d)
  }, [num, den])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className={labelClass}>Numerador</label>
          <input type="number" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Ej: 3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Denominador</label>
          <input type="number" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} placeholder="Ej: 4" className={inputClass} />
        </div>
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? parseFloat(resultado.toFixed(8)) : '—'}</p>
      </ResultBox>
    </div>
  )
}

function DecimalAFraccionUI() {
  const [decimal, setDecimal] = useState('')

  const resultado = useMemo(() => {
    if (!decimal.trim()) return null
    return decimalAFraccion(decimal)
  }, [decimal])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Número decimal</label>
        <input type="text" inputMode="decimal" value={decimal} onChange={(e) => setDecimal(e.target.value)} placeholder="Ej: 0.75" className={inputClass} />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Fracción simplificada</p>
        {resultado ? (
          <p className="text-4xl font-bold text-blue-700">
            {resultado.num}/{resultado.den}
          </p>
        ) : (
          <p className="text-2xl text-gray-400">—</p>
        )}
      </ResultBox>
      <p className="text-xs text-gray-400">
        Funciona con decimales exactos (por ejemplo, 0.75 o 1.5). Los decimales periódicos (como 0.333…) no tienen una
        fracción exacta representable a partir de su forma escrita.
      </p>
    </div>
  )
}

function MixtaImpropiaUI() {
  const [modo, setModo] = useState('a_mixta') // a_mixta | a_impropia
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')
  const [entero, setEntero] = useState('')

  const resultado = useMemo(() => {
    const d = parseFloat(den)
    if (isNaN(d) || d === 0) return null
    if (modo === 'a_mixta') {
      const n = parseFloat(num)
      if (isNaN(n)) return null
      return { tipo: 'mixta', ...impropiaAMixta(n, d) }
    }
    const e = parseFloat(entero)
    const n = parseFloat(num)
    if (isNaN(e) || isNaN(n)) return null
    return { tipo: 'impropia', ...mixtaAImpropia(e, n, d) }
  }, [modo, num, den, entero])

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setModo('a_mixta')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'a_mixta' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          Impropia → Mixta
        </button>
        <button
          onClick={() => setModo('a_impropia')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'a_impropia' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          Mixta → Impropia
        </button>
      </div>

      {modo === 'a_mixta' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Numerador</label>
            <input type="number" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Ej: 11" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Denominador</label>
            <input type="number" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} placeholder="Ej: 4" className={inputClass} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Entero</label>
            <input type="number" inputMode="decimal" value={entero} onChange={(e) => setEntero(e.target.value)} placeholder="Ej: 2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Numerador</label>
            <input type="number" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Ej: 3" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Denominador</label>
            <input type="number" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} placeholder="Ej: 4" className={inputClass} />
          </div>
        </div>
      )}

      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        {resultado && resultado.tipo === 'mixta' && (
          <p className="text-3xl font-bold text-blue-700">
            {resultado.entero} {resultado.num > 0 && `${resultado.num}/${resultado.den}`}
          </p>
        )}
        {resultado && resultado.tipo === 'impropia' && (
          <p className="text-3xl font-bold text-blue-700">
            {resultado.num}/{resultado.den}
          </p>
        )}
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
      </ResultBox>
    </div>
  )
}

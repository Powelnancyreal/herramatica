'use client'

import { useMemo, useState } from 'react'

// Parser de expresiones con variable x, funciones básicas y potencias. Uso interno para evaluación numérica.
function crearEvaluador(input) {
  const s = input.replace(/\s+/g, '').toLowerCase()

  return function evaluar(xVal) {
    let i = 0
    function peek() {
      return s[i]
    }
    function error(msg) {
      throw new Error(msg)
    }
    function parseExpression() {
      let val = parseTerm()
      while (peek() === '+' || peek() === '-') {
        const op = s[i++]
        const rhs = parseTerm()
        val = op === '+' ? val + rhs : val - rhs
      }
      return val
    }
    function parseTerm() {
      let val = parseFactor()
      while (peek() === '*' || peek() === '/') {
        const op = s[i++]
        const rhs = parseFactor()
        val = op === '/' ? val / rhs : val * rhs
      }
      return val
    }
    function parseFactor() {
      if (peek() === '-') {
        i++
        return -parseFactor()
      }
      if (peek() === '+') {
        i++
        return parseFactor()
      }
      return parsePower()
    }
    function parsePower() {
      const base = parsePrimary()
      if (peek() === '^') {
        i++
        return Math.pow(base, parseFactor())
      }
      return base
    }
    function parsePrimary() {
      if (peek() === '(') {
        i++
        const val = parseExpression()
        if (peek() !== ')') error('Falta un paréntesis de cierre')
        i++
        return val
      }
      for (const [nombre, fn] of [
        ['sin', Math.sin],
        ['cos', Math.cos],
        ['tan', Math.tan],
        ['sqrt', Math.sqrt],
        ['ln', Math.log],
        ['exp', Math.exp],
      ]) {
        if (s.slice(i, i + nombre.length) === nombre) {
          i += nombre.length
          return fn(parsePrimary())
        }
      }
      if (peek() === 'x') {
        i++
        return xVal
      }
      if (s.slice(i, i + 1) === 'e' && !/[0-9]/.test(s[i + 1] || '')) {
        i++
        return Math.E
      }
      const start = i
      while (peek() !== undefined && /[0-9.]/.test(peek())) i++
      if (i === start) error(`Carácter inesperado en la posición ${i + 1}`)
      return parseFloat(s.slice(start, i))
    }
    if (s.length === 0) error('Escribe una función')
    const resultado = parseExpression()
    if (i !== s.length) error(`Carácter inesperado en la posición ${i + 1}`)
    return resultado
  }
}

function derivadaNumerica(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h)
}
function integralSimpson(f, a, b, n = 1000) {
  if (n % 2 !== 0) n++
  const h = (b - a) / n
  let suma = f(a) + f(b)
  for (let i = 1; i < n; i++) suma += (i % 2 === 0 ? 2 : 4) * f(a + i * h)
  return (suma * h) / 3
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'limite', label: 'Límite' },
  { id: 'derivada', label: 'Derivada en un punto' },
  { id: 'integral', label: 'Integral definida' },
]

export default function CalculadoraDerivadasIntegrales() {
  const [tab, setTab] = useState('derivada')
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
      {tab === 'limite' && <Limite />}
      {tab === 'derivada' && <Derivada />}
      {tab === 'integral' && <Integral />}
      <p className="text-xs text-gray-500">
        ⚠️ Esta calculadora evalúa límites, derivadas e integrales de forma <strong>numérica</strong> (aproximada), no
        simbólica: no te da la fórmula de la derivada o la primitiva, sino su valor numérico en un punto o intervalo.
        Usa x como variable, y funciones como sin(x), cos(x), sqrt(x), ln(x), exp(x) y potencias con ^.
      </p>
    </div>
  )
}

function Limite() {
  const [funcion, setFuncion] = useState('(x^2-1)/(x-1)')
  const [punto, setPunto] = useState('1')

  const resultado = useMemo(() => {
    const a = parseFloat(punto)
    if (isNaN(a)) return null
    try {
      const f = crearEvaluador(funcion)
      const h = 1e-6
      const izq = f(a - h)
      const der = f(a + h)
      if (!isFinite(izq) || !isFinite(der)) return { error: 'La función no está definida cerca de ese punto (posible división por cero).' }
      const convergen = Math.abs(izq - der) < 1e-2
      return { izq, der, convergen, valorAprox: (izq + der) / 2 }
    } catch (e) {
      return { error: e.message }
    }
  }, [funcion, punto])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>f(x)</label>
          <input type="text" value={funcion} onChange={(e) => setFuncion(e.target.value)} placeholder="Ej: (x^2-1)/(x-1)" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>x tiende a</label>
          <input type="number" inputMode="decimal" value={punto} onChange={(e) => setPunto(e.target.value)} placeholder="Ej: 1" className={inputClass} />
        </div>
      </div>
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Límite aproximado</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.error && <p className="text-red-600 text-sm">{resultado.error}</p>}
        {resultado && !resultado.error && (
          <>
            <p className="text-4xl font-bold text-blue-700">{parseFloat(resultado.valorAprox.toFixed(6))}</p>
            {!resultado.convergen && <p className="text-xs text-amber-600 mt-2">⚠️ Los límites laterales no coinciden claramente; el límite podría no existir.</p>}
          </>
        )}
      </div>
    </div>
  )
}

function Derivada() {
  const [funcion, setFuncion] = useState('x^3')
  const [punto, setPunto] = useState('2')

  const resultado = useMemo(() => {
    const a = parseFloat(punto)
    if (isNaN(a)) return null
    try {
      const f = crearEvaluador(funcion)
      return { valor: derivadaNumerica(f, a) }
    } catch (e) {
      return { error: e.message }
    }
  }, [funcion, punto])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>f(x)</label>
          <input type="text" value={funcion} onChange={(e) => setFuncion(e.target.value)} placeholder="Ej: x^3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>En el punto x =</label>
          <input type="number" inputMode="decimal" value={punto} onChange={(e) => setPunto(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
      </div>
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">f&apos;(x) en ese punto</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.error && <p className="text-red-600 text-sm">{resultado.error}</p>}
        {resultado && !resultado.error && <p className="text-4xl font-bold text-blue-700">{parseFloat(resultado.valor.toFixed(6))}</p>}
      </div>
    </div>
  )
}

function Integral() {
  const [funcion, setFuncion] = useState('x^2')
  const [a, setA] = useState('0')
  const [b, setB] = useState('1')

  const resultado = useMemo(() => {
    const va = parseFloat(a)
    const vb = parseFloat(b)
    if (isNaN(va) || isNaN(vb)) return null
    try {
      const f = crearEvaluador(funcion)
      return { valor: integralSimpson(f, va, vb) }
    } catch (e) {
      return { error: e.message }
    }
  }, [funcion, a, b])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>f(x)</label>
          <input type="text" value={funcion} onChange={(e) => setFuncion(e.target.value)} placeholder="Ej: x^2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Límite inferior (a)</label>
          <input type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Límite superior (b)</label>
          <input type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">∫ f(x) dx de a a b</p>
        {!resultado && <p className="text-2xl text-gray-400">—</p>}
        {resultado?.error && <p className="text-red-600 text-sm">{resultado.error}</p>}
        {resultado && !resultado.error && <p className="text-4xl font-bold text-blue-700">{parseFloat(resultado.valor.toFixed(6))}</p>}
      </div>
    </div>
  )
}

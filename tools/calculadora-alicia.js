'use client'

import { useState } from 'react'

// ─── Column position names (Spanish) ─────────────────────────────
const COL_NAMES = [
  'unidades', 'decenas', 'centenas', 'millares',
  'decenas de millar', 'centenas de millar',
]
const colName = (i) => COL_NAMES[i] ?? `posición ${i + 1}`

// ─── Math algorithms ──────────────────────────────────────────────

function calcAdd(a, b) {
  const d1 = [...String(a)].map(Number).reverse()
  const d2 = [...String(b)].map(Number).reverse()
  const len = Math.max(d1.length, d2.length)
  const steps = [], res = []
  let carry = 0
  for (let i = 0; i < len; i++) {
    const n1 = d1[i] ?? 0, n2 = d2[i] ?? 0, cIn = carry
    const sum = n1 + n2 + cIn
    carry = Math.floor(sum / 10)
    steps.push({ pos: i, n1, n2, cIn, sum, digit: sum % 10, cOut: carry })
    res.push(sum % 10)
  }
  if (carry) res.push(carry)
  return { op: 'add', a, b, result: +[...res].reverse().join(''), steps }
}

function calcSub(a, b) {
  if (a < b) return { ...calcSub(b, a), swapped: true }
  const d1 = [...String(a)].map(Number).reverse()
  const d2 = [...String(b)].map(Number).reverse()
  const work = [...d1]
  const steps = []
  for (let i = 0; i < d1.length; i++) {
    const n2 = d2[i] ?? 0
    const orig = d1[i]
    let borrowed = false
    if (work[i] < n2) {
      work[i] += 10
      if (i + 1 < work.length) work[i + 1] -= 1
      borrowed = true
    }
    const diff = work[i] - n2
    steps.push({ pos: i, orig, n1: work[i], n2, borrowed, diff })
  }
  const digits = steps.map(s => s.diff).reverse()
  while (digits.length > 1 && digits[0] === 0) digits.shift()
  return { op: 'sub', a, b, result: +digits.join(''), steps, swapped: false }
}

function calcDiv(dividend, divisor) {
  if (!divisor) return null
  const digits = [...String(dividend)].map(Number)
  const steps = []
  let rem = 0
  for (let i = 0; i < digits.length; i++) {
    rem = rem * 10 + digits[i]
    const q = Math.floor(rem / divisor)
    const prod = q * divisor
    steps.push({ step: i + 1, brought: digits[i], current: rem, q, prod, newRem: rem - prod })
    rem -= prod
  }
  return {
    op: 'div', dividend, divisor,
    quotient: +steps.map(s => s.q).join(''),
    remainder: rem, steps,
  }
}

// ─── Column visual helpers ────────────────────────────────────────

// One fixed-width digit cell
function DC({ v, className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center w-9 h-10 text-xl font-mono font-bold select-none ${className}`}>
      {v ?? '\u00a0'}
    </span>
  )
}

// A row of digits, right-padded to totalLen with the operator in first cell
function DigitRow({ number, totalLen, operator, opColor = 'text-gray-400', digitClass = 'text-gray-800' }) {
  const str = String(number)
  const pad = totalLen - str.length
  return (
    <div className="flex">
      <DC v={operator} className={`text-lg ${opColor}`} />
      {Array(pad).fill(0).map((_, i) => <DC key={`p${i}`} />)}
      {[...str].map((d, i) => <DC key={i} v={d} className={digitClass} />)}
    </div>
  )
}

// ─── Addition / Subtraction Visual ────────────────────────────────

function VerticalCalc({ data }) {
  const { op, a, b, result, steps } = data

  if (data.swapped) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
        <span className="font-semibold">Nota:</span> {b} es mayor que {a}.
        El resultado de {b} − {a} = <span className="font-bold">{result}</span>.
      </div>
    )
  }

  const totalLen = Math.max(String(a).length, String(b).length, String(result).length)

  // Build carry row: carry from step at pos goes above column (pos+1)
  // display index of column pos from LSB = totalLen - 1 - pos
  // carry-target display index = totalLen - 1 - (pos+1) = totalLen - 2 - pos
  const carries = Array(totalLen).fill('\u00a0')
  if (op === 'add') {
    steps.forEach(s => {
      if (s.cOut > 0) {
        const idx = totalLen - 2 - s.pos
        if (idx >= 0) carries[idx] = String(s.cOut)
      }
    })
  }

  const hasCarries = op === 'add' && carries.some(c => c !== '\u00a0')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="overflow-x-auto pb-1">
        <div className="inline-block">

          {/* Carries row */}
          {hasCarries && (
            <div className="flex mb-0.5 h-6">
              <span className="inline-flex items-center justify-center w-9 h-6" />
              {carries.map((c, i) => (
                <span key={i} className="inline-flex items-center justify-center w-9 h-6 text-xs font-bold font-mono text-blue-500">
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Number 1 */}
          <DigitRow number={a} totalLen={totalLen} />

          {/* Number 2 with operator */}
          <DigitRow
            number={b}
            totalLen={totalLen}
            operator={op === 'add' ? '+' : '−'}
            opColor={op === 'add' ? 'text-green-500' : 'text-orange-500'}
          />

          {/* Line */}
          <div
            className="border-t-2 border-gray-700 my-1"
            style={{ width: `${(totalLen + 1) * 2.25}rem` }}
          />

          {/* Result */}
          <DigitRow number={result} totalLen={totalLen} digitClass="text-blue-700" />

        </div>
      </div>

      {/* Step-by-step */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Procedimiento paso a paso</p>
        {[...steps].reverse().map((s, idx) => {
          const stepNum = idx + 1
          const name = colName(steps.length - 1 - idx)

          let text
          if (op === 'add') {
            const carry = s.cIn > 0 ? ` + ${s.cIn} (llevado)` : ''
            const carryOut = s.cOut > 0 ? `, llevo ${s.cOut}` : ''
            text = `${s.n1} + ${s.n2}${carry} = ${s.sum} → escribo ${s.digit}${carryOut}`
          } else {
            if (s.borrowed) {
              text = `${s.orig} pide prestado a la columna de la izquierda → se convierte en ${s.n1} − ${s.n2} = ${s.diff}`
            } else {
              text = `${s.n1} − ${s.n2} = ${s.diff}`
            }
          }

          const bubble = op === 'add'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-orange-100 text-orange-700'

          return (
            <div key={idx} className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${bubble}`}>
                {stepNum}
              </span>
              <p className="text-sm text-gray-700 pt-0.5">
                <span className="font-semibold capitalize text-gray-900">{name}:</span> {text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Division Visual ──────────────────────────────────────────────

function DivisionDisplay({ data }) {
  const { dividend, divisor, quotient, remainder, steps } = data
  const isExact = remainder === 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

      {/* Garita (box) visual */}
      <div className="flex items-stretch mb-6 overflow-x-auto">
        {/* Dividend cell */}
        <div className="border-b-2 border-r-2 border-gray-700 px-4 py-2 min-w-max">
          <span className="text-3xl font-mono font-bold text-gray-800">{dividend}</span>
        </div>
        {/* Divisor + Quotient cell */}
        <div className="px-4 py-1 min-w-max">
          <div className="text-lg font-mono font-semibold text-gray-500 border-b border-gray-400 pb-1 mb-1">
            {divisor}
          </div>
          <div className="text-2xl font-mono font-bold text-blue-700">{quotient}</div>
        </div>
      </div>

      {/* Result chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center min-w-[80px]">
          <div className="text-xs text-blue-500 font-medium mb-0.5">Cociente</div>
          <div className="text-2xl font-bold text-blue-700 font-mono">{quotient}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center min-w-[80px]">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Resto</div>
          <div className="text-2xl font-bold text-gray-700 font-mono">{remainder}</div>
        </div>
        {isExact && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center">
            <span className="text-sm font-semibold text-green-700">✓ División exacta</span>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="pt-4 border-t border-gray-100 space-y-2.5">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Procedimiento paso a paso</p>
        {steps.map((s, idx) => {
          const intro = idx === 0
            ? `Tomamos el primer dígito: ${s.current}.`
            : `Bajamos el ${s.brought} → queda ${s.current}.`
          const explain = s.q > 0
            ? `${divisor} cabe ${s.q} ${s.q === 1 ? 'vez' : 'veces'} en ${s.current} (${divisor} × ${s.q} = ${s.prod}). Resto: ${s.newRem}.`
            : `${s.current} es menor que ${divisor} → no cabe, ponemos 0. Resto: ${s.newRem}.`
          return (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-purple-100 text-purple-700">
                {idx + 1}
              </span>
              <p className="text-sm text-gray-700 pt-0.5">{intro} {explain}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────

const TABS = [
  { id: 'suma',     label: 'Suma',     icon: '➕', active: 'bg-green-600 text-white',  inactive: 'border border-green-200 text-green-700 hover:bg-green-50' },
  { id: 'resta',    label: 'Resta',    icon: '➖', active: 'bg-orange-500 text-white', inactive: 'border border-orange-200 text-orange-700 hover:bg-orange-50' },
  { id: 'division', label: 'División', icon: '÷',  active: 'bg-purple-600 text-white', inactive: 'border border-purple-200 text-purple-700 hover:bg-purple-50' },
]

const LABELS = {
  suma:     ['Primer número', 'Segundo número'],
  resta:    ['Minuendo (el mayor)', 'Sustraendo'],
  division: ['Dividendo', 'Divisor'],
}

const BTN_COLOR = {
  suma:     'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  resta:    'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
  division: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
}

const BTN_LABEL = {
  suma: 'Calcular suma', resta: 'Calcular resta', division: 'Calcular división',
}

export default function CalculadoraAlicia() {
  const [tab, setTab]     = useState('suma')
  const [num1, setNum1]   = useState('')
  const [num2, setNum2]   = useState('')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  function switchTab(t) {
    setTab(t); setResult(null); setError(''); setNum1(''); setNum2('')
  }

  function handleCalc() {
    const n1 = parseInt(num1, 10)
    const n2 = parseInt(num2, 10)
    if (!num1.trim() || isNaN(n1) || n1 < 0) return setError('Introduce un número válido en el primer campo (sin decimales).')
    if (!num2.trim() || isNaN(n2) || n2 < 0) return setError('Introduce un número válido en el segundo campo.')
    if (n1 > 9_999_999 || n2 > 9_999_999)    return setError('Los números no pueden superar 9.999.999.')
    if (tab === 'division' && n2 === 0)        return setError('No se puede dividir entre 0.')
    setError('')
    if (tab === 'suma')     setResult(calcAdd(n1, n2))
    else if (tab === 'resta') setResult(calcSub(n1, n2))
    else                    setResult(calcDiv(n1, n2))
  }

  const activeTab = TABS.find(t => t.id === tab)

  return (
    <div className="space-y-5">

      {/* Operation tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? t.active : t.inactive
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {LABELS[tab][i]}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={i === 0 ? num1 : num2}
              min="0"
              onChange={e => {
                i === 0 ? setNum1(e.target.value) : setNum2(e.target.value)
                setError('')
              }}
              placeholder={i === 0 ? 'Ej: 145' : 'Ej: 278'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 -mt-1">{error}</p>}

      {/* Calculate button */}
      <button
        onClick={handleCalc}
        className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${BTN_COLOR[tab]}`}
      >
        {BTN_LABEL[tab]}
      </button>

      {/* Result */}
      {result && (
        result.op === 'div'
          ? <DivisionDisplay data={result} />
          : <VerticalCalc data={result} />
      )}
    </div>
  )
}

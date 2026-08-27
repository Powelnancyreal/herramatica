'use client'

import { useEffect, useMemo, useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Math engine: tokenizer -> recursive-descent parser -> evaluator
// No eval()/Function() — everything is parsed by hand.
// ─────────────────────────────────────────────────────────────────

const FUNCS = [
  'asinh', 'acosh', 'atanh',
  'sinh', 'cosh', 'tanh',
  'asin', 'acos', 'atan', 'sqrt', 'cbrt', 'root', 'logy',
  'abs', 'log', 'sin', 'cos', 'tan',
  'ln',
].sort((a, b) => b.length - a.length)

function tokenize(input) {
  const s = input.replace(/\s+/g, '')
  const tokens = []
  let i = 0
  while (i < s.length) {
    const c = s[i]

    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      const raw = s.slice(i, j)
      if ((raw.match(/\./g) || []).length > 1) throw new Error('Número con más de un punto decimal')
      tokens.push({ type: 'num', value: parseFloat(raw) })
      i = j
      continue
    }

    if (c === 'π') { tokens.push({ type: 'const', value: Math.PI }); i++; continue }
    if (c === '×') { tokens.push({ type: 'op', value: '*' }); i++; continue }
    if (c === '÷') { tokens.push({ type: 'op', value: '/' }); i++; continue }

    if (c === '(') { tokens.push({ type: 'lparen' }); i++; continue }
    if (c === ')') { tokens.push({ type: 'rparen' }); i++; continue }
    if (c === '!') { tokens.push({ type: 'fact' }); i++; continue }
    if (c === '%') { tokens.push({ type: 'percent' }); i++; continue }
    if (c === ',') { tokens.push({ type: 'comma' }); i++; continue }
    if ('+-*/^'.includes(c)) { tokens.push({ type: 'op', value: c }); i++; continue }

    if (s.slice(i, i + 3) === 'Ans') { tokens.push({ type: 'ans' }); i += 3; continue }

    let matched = null
    for (const f of FUNCS) {
      if (s.slice(i, i + f.length) === f) { matched = f; break }
    }
    if (matched) { tokens.push({ type: 'func', value: matched }); i += matched.length; continue }

    if (c === 'e') { tokens.push({ type: 'const', value: Math.E }); i++; continue }

    throw new Error(`Carácter no reconocido: "${c}"`)
  }
  return tokens
}

function isImplicitMultTrigger(tok) {
  return !!tok && (tok.type === 'num' || tok.type === 'const' || tok.type === 'func' || tok.type === 'lparen' || tok.type === 'ans')
}

function parse(tokens) {
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]

  function parseAddSub() {
    let node = parseMulDiv()
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = next().value
      node = { type: 'binop', op, left: node, right: parseMulDiv() }
    }
    return node
  }

  function parseMulDiv() {
    let node = parseUnary()
    while (peek() && ((peek().type === 'op' && (peek().value === '*' || peek().value === '/')) || isImplicitMultTrigger(peek()))) {
      let op = '*'
      if (peek().type === 'op') op = next().value
      node = { type: 'binop', op, left: node, right: parseUnary() }
    }
    return node
  }

  function parseUnary() {
    if (peek() && peek().type === 'op' && peek().value === '-') { next(); return { type: 'neg', value: parseUnary() } }
    if (peek() && peek().type === 'op' && peek().value === '+') { next(); return parseUnary() }
    return parsePow()
  }

  function parsePow() {
    let node = parsePostfix()
    if (peek() && peek().type === 'op' && peek().value === '^') {
      next()
      node = { type: 'binop', op: '^', left: node, right: parseUnary() }
    }
    return node
  }

  function parsePostfix() {
    let node = parsePrimary()
    while (peek() && (peek().type === 'fact' || peek().type === 'percent')) {
      const t = next()
      node = { type: t.type === 'fact' ? 'factorial' : 'percent', value: node }
    }
    return node
  }

  function parsePrimary() {
    const tok = peek()
    if (!tok) throw new Error('Expresión incompleta')

    if (tok.type === 'num') { next(); return { type: 'num', value: tok.value } }
    if (tok.type === 'const') { next(); return { type: 'num', value: tok.value } }
    if (tok.type === 'ans') { next(); return { type: 'ans' } }

    if (tok.type === 'lparen') {
      next()
      const inner = parseAddSub()
      if (!peek() || peek().type !== 'rparen') throw new Error('Falta un paréntesis de cierre')
      next()
      return inner
    }

    if (tok.type === 'func') {
      next()
      if (!peek() || peek().type !== 'lparen') throw new Error(`Falta "(" después de ${tok.value}`)
      next()
      const args = [parseAddSub()]
      while (peek() && peek().type === 'comma') { next(); args.push(parseAddSub()) }
      if (!peek() || peek().type !== 'rparen') throw new Error('Falta un paréntesis de cierre')
      next()
      return { type: 'call', name: tok.value, args }
    }

    throw new Error('Expresión no válida')
  }

  const result = parseAddSub()
  if (pos < tokens.length) throw new Error('Expresión no válida')
  return result
}

function toRad(v, mode) {
  if (mode === 'DEG') return (v * Math.PI) / 180
  if (mode === 'GRAD') return (v * Math.PI) / 200
  return v
}
function fromRad(v, mode) {
  if (mode === 'DEG') return (v * 180) / Math.PI
  if (mode === 'GRAD') return (v * 200) / Math.PI
  return v
}

function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('El factorial solo aplica a enteros no negativos')
  if (n > 170) throw new Error('El número es demasiado grande para calcular el factorial')
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function applyFunc(name, args, mode) {
  const v = args[0]
  switch (name) {
    case 'sin': return Math.sin(toRad(v, mode))
    case 'cos': return Math.cos(toRad(v, mode))
    case 'tan': return Math.tan(toRad(v, mode))
    case 'asin':
      if (v < -1 || v > 1) throw new Error('El valor de asin debe estar entre -1 y 1')
      return fromRad(Math.asin(v), mode)
    case 'acos':
      if (v < -1 || v > 1) throw new Error('El valor de acos debe estar entre -1 y 1')
      return fromRad(Math.acos(v), mode)
    case 'atan': return fromRad(Math.atan(v), mode)
    case 'sinh': return Math.sinh(v)
    case 'cosh': return Math.cosh(v)
    case 'tanh': return Math.tanh(v)
    case 'asinh': return Math.asinh(v)
    case 'acosh':
      if (v < 1) throw new Error('El valor de acosh debe ser mayor o igual que 1')
      return Math.acosh(v)
    case 'atanh':
      if (v <= -1 || v >= 1) throw new Error('El valor de atanh debe estar entre -1 y 1 (sin incluir)')
      return Math.atanh(v)
    case 'log':
      if (v <= 0) throw new Error('El logaritmo solo está definido para números positivos')
      return Math.log10(v)
    case 'ln':
      if (v <= 0) throw new Error('El logaritmo natural solo está definido para números positivos')
      return Math.log(v)
    case 'sqrt':
      if (v < 0) throw new Error('No se puede calcular la raíz cuadrada de un número negativo')
      return Math.sqrt(v)
    case 'cbrt': return Math.cbrt(v)
    case 'abs': return Math.abs(v)
    case 'root': {
      const [n, x] = args
      if (n === 0) throw new Error('El índice de la raíz no puede ser 0')
      if (x < 0 && n % 2 === 0) throw new Error('No existe una raíz par de un número negativo')
      return x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)
    }
    case 'logy': {
      const [base, x] = args
      if (base <= 0 || base === 1) throw new Error('La base del logaritmo debe ser positiva y distinta de 1')
      if (x <= 0) throw new Error('El logaritmo solo está definido para números positivos')
      return Math.log(x) / Math.log(base)
    }
    default:
      throw new Error(`Función desconocida: ${name}`)
  }
}

function evaluate(node, ctx) {
  switch (node.type) {
    case 'num': return node.value
    case 'ans': return ctx.ans
    case 'neg': return -evaluate(node.value, ctx)
    case 'factorial': return factorial(evaluate(node.value, ctx))
    case 'percent': return evaluate(node.value, ctx) / 100
    case 'binop': {
      const l = evaluate(node.left, ctx)
      const r = evaluate(node.right, ctx)
      switch (node.op) {
        case '+': return l + r
        case '-': return l - r
        case '*': return l * r
        case '/':
          if (r === 0) throw new Error('No se puede dividir entre 0')
          return l / r
        case '^': return Math.pow(l, r)
        default: throw new Error('Operador desconocido')
      }
    }
    case 'call': return applyFunc(node.name, node.args.map((a) => evaluate(a, ctx)), ctx.mode)
    default: throw new Error('Nodo no válido')
  }
}

function autoClose(expr) {
  let open = 0
  for (const ch of expr) {
    if (ch === '(') open++
    else if (ch === ')') open--
  }
  return open > 0 ? expr + ')'.repeat(open) : expr
}

function safeEvaluate(expr, mode, ans) {
  const trimmed = expr.trim()
  if (!trimmed) return { value: null, error: null }
  try {
    const tokens = tokenize(autoClose(trimmed))
    if (tokens.length === 0) return { value: null, error: null }
    const ast = parse(tokens)
    const value = evaluate(ast, { mode, ans })
    if (typeof value !== 'number' || Number.isNaN(value)) return { value: null, error: 'Expresión no válida' }
    return { value, error: null }
  } catch (e) {
    return { value: null, error: e.message || 'Expresión no válida' }
  }
}

function formatNumber(n) {
  if (n === null || n === undefined) return ''
  if (Number.isNaN(n)) return 'Error'
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e15 || abs < 1e-6) {
    const [coefRaw, expPart] = n.toExponential(6).split('e')
    const coef = parseFloat(coefRaw).toString()
    return `${coef}×10^${parseInt(expPart, 10)}`
  }
  return parseFloat(n.toPrecision(15)).toString()
}

const FUNC_TOKENS_FOR_BACKSPACE = [...FUNCS.map((f) => `${f}(`), '×', '÷', 'π', 'Ans'].sort((a, b) => b.length - a.length)

function smartBackspace(expr) {
  for (const tok of FUNC_TOKENS_FOR_BACKSPACE) {
    if (expr.endsWith(tok)) return expr.slice(0, -tok.length)
  }
  return expr.slice(0, -1)
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export default function CalculadoraCientifica() {
  const [expr, setExpr] = useState('')
  const [mode, setMode] = useState('DEG')
  const [shift, setShift] = useState(false)
  const [memory, setMemory] = useState(0)
  const [ans, setAns] = useState(0)
  const [history, setHistory] = useState([])
  const [submitError, setSubmitError] = useState(null)

  const preview = useMemo(() => safeEvaluate(expr, mode, ans), [expr, mode, ans])

  function insertText(text) {
    setExpr((prev) => prev + text)
    setSubmitError(null)
  }

  function insertShiftable(normal, shifted) {
    insertText(shift ? shifted : normal)
    if (shift) setShift(false)
  }

  function handleEquals() {
    const trimmed = expr.trim()
    if (!trimmed) return
    const res = safeEvaluate(expr, mode, ans)
    if (res.error || res.value === null) {
      setSubmitError(res.error || 'Expresión no válida')
      return
    }
    setSubmitError(null)
    setAns(res.value)
    setHistory((h) => [{ expr: autoClose(trimmed), result: res.value }, ...h].slice(0, 30))
    setExpr(formatNumber(res.value))
  }

  function handleClear() {
    setExpr('')
    setSubmitError(null)
  }

  function handleBackspace() {
    setExpr((prev) => smartBackspace(prev))
    setSubmitError(null)
  }

  function toggleSign() {
    setExpr((prev) => {
      if (!prev) return prev
      if (prev.startsWith('-(') && prev.endsWith(')')) return prev.slice(2, -1)
      const last = prev[prev.length - 1]
      if (['+', '-', '×', '÷', '^', '(', ','].includes(last)) return prev + '-'
      return `-(${prev})`
    })
  }

  function cycleMode() {
    setMode((m) => (m === 'DEG' ? 'RAD' : m === 'RAD' ? 'GRAD' : 'DEG'))
  }

  function copyResult() {
    const text = formatNumber(preview.value !== null ? preview.value : ans)
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  function loadFromHistory(item) {
    setExpr(formatNumber(item.result))
    setSubmitError(null)
  }

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key
      if (/^[0-9]$/.test(key)) { insertText(key); e.preventDefault(); return }
      if (key === '.') { insertText('.'); e.preventDefault(); return }
      if (key === '+') { insertText('+'); e.preventDefault(); return }
      if (key === '-') { insertText('-'); e.preventDefault(); return }
      if (key === '*') { insertText('×'); e.preventDefault(); return }
      if (key === '/') { insertText('÷'); e.preventDefault(); return }
      if (key === '^') { insertText('^'); e.preventDefault(); return }
      if (key === '(') { insertText('('); e.preventDefault(); return }
      if (key === ')') { insertText(')'); e.preventDefault(); return }
      if (key === '%') { insertText('%'); e.preventDefault(); return }
      if (key === ',') { insertText(','); e.preventDefault(); return }
      if (key === 'Enter' || key === '=') { handleEquals(); e.preventDefault(); return }
      if (key === 'Backspace') { handleBackspace(); e.preventDefault(); return }
      if (key === 'Escape') { handleClear(); e.preventDefault(); return }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expr, mode, ans])

  const fnBtn = 'py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors'
  const fnBtnActive = 'py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors ring-1 ring-blue-400'
  const numBtn = 'py-3.5 rounded-lg text-lg font-semibold bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 transition-colors'
  const opBtn = 'py-3.5 rounded-lg text-lg font-semibold bg-gray-100 hover:bg-gray-200 text-blue-600 transition-colors'

  return (
    <div className="space-y-5">
      {/* Top bar: mode + memory */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-1.5">
          <button
            onClick={() => setShift((s) => !s)}
            className={`px-2.5 py-1 rounded-md font-bold transition-colors ${shift ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title="Funciones inversas (2nd)"
          >
            2nd
          </button>
          <button
            onClick={cycleMode}
            className="px-2.5 py-1 rounded-md font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Cambiar entre grados, radianes y gradianes"
          >
            {mode}
          </button>
        </div>
        {memory !== 0 && (
          <span className="px-2.5 py-1 rounded-md font-bold bg-amber-100 text-amber-700">M = {formatNumber(memory)}</span>
        )}
      </div>

      {/* Display */}
      <div className="bg-gray-900 rounded-xl px-4 py-5 min-h-[104px] flex flex-col justify-end gap-1">
        <div className="text-gray-400 text-sm min-h-[20px] break-all text-right">
          {submitError ? <span className="text-red-400">{submitError}</span> : preview.value !== null && preview.error === null ? `= ${formatNumber(preview.value)}` : ' '}
        </div>
        <div className="text-white text-2xl sm:text-3xl font-mono break-all text-right min-h-[36px]">
          {expr || '0'}
        </div>
      </div>

      {submitError === null && (
        <div className="flex justify-end -mt-3">
          <button onClick={copyResult} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Copiar resultado
          </button>
        </div>
      )}

      {/* Scientific function grid */}
      <div className="grid grid-cols-6 gap-1.5">
        <button onClick={() => setMemory(0)} className={fnBtn} title="Borrar memoria">MC</button>
        <button onClick={() => insertText(formatNumber(memory))} className={fnBtn} title="Recuperar memoria">MR</button>
        <button onClick={() => setMemory((m) => m + (preview.value !== null ? preview.value : ans))} className={fnBtn} title="Sumar a memoria">M+</button>
        <button onClick={() => setMemory((m) => m - (preview.value !== null ? preview.value : ans))} className={fnBtn} title="Restar de memoria">M−</button>
        <button onClick={() => insertText('Ans')} className={fnBtn} title="Última respuesta">Ans</button>
        <button onClick={handleBackspace} className={fnBtn} title="Borrar último carácter">⌫</button>

        <button onClick={() => insertShiftable('sin(', 'asin(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'sin⁻¹' : 'sin'}</button>
        <button onClick={() => insertShiftable('cos(', 'acos(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'cos⁻¹' : 'cos'}</button>
        <button onClick={() => insertShiftable('tan(', 'atan(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'tan⁻¹' : 'tan'}</button>
        <button onClick={() => insertText('π')} className={fnBtn}>π</button>
        <button onClick={() => insertText('e')} className={fnBtn}>e</button>
        <button onClick={toggleSign} className={fnBtn} title="Cambiar signo">±</button>

        <button onClick={() => insertShiftable('sinh(', 'asinh(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'sinh⁻¹' : 'sinh'}</button>
        <button onClick={() => insertShiftable('cosh(', 'acosh(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'cosh⁻¹' : 'cosh'}</button>
        <button onClick={() => insertShiftable('tanh(', 'atanh(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'tanh⁻¹' : 'tanh'}</button>
        <button onClick={() => insertShiftable('^(2)', 'sqrt(')} className={shift ? fnBtnActive : fnBtn}>{shift ? '√x' : 'x²'}</button>
        <button onClick={() => insertShiftable('^(3)', 'cbrt(')} className={shift ? fnBtnActive : fnBtn}>{shift ? '∛x' : 'x³'}</button>
        <button onClick={() => insertText('1/(')} className={fnBtn} title="Inverso">1/x</button>

        <button onClick={() => insertShiftable('log(', '10^(')} className={shift ? fnBtnActive : fnBtn}>{shift ? '10ˣ' : 'log'}</button>
        <button onClick={() => insertShiftable('ln(', 'e^(')} className={shift ? fnBtnActive : fnBtn}>{shift ? 'eˣ' : 'ln'}</button>
        <button onClick={() => insertText('^(')} className={fnBtn} title="Potencia xʸ">xʸ</button>
        <button onClick={() => insertText('root(')} className={fnBtn} title="Raíz de índice y: root(índice, número)">ʸ√x</button>
        <button onClick={() => insertText('logy(')} className={fnBtn} title="Logaritmo en base y: logy(base, número)">logᵧ</button>
        <button onClick={() => insertText('abs(')} className={fnBtn} title="Valor absoluto">|x|</button>

        <button onClick={() => insertText('(')} className={fnBtn}>(</button>
        <button onClick={() => insertText(')')} className={fnBtn}>)</button>
        <button onClick={() => insertText(',')} className={fnBtn} title="Separador de argumentos">,</button>
        <button onClick={() => insertText('!')} className={fnBtn} title="Factorial">n!</button>
        <button onClick={() => insertText('%')} className={fnBtn} title="Porcentaje">%</button>
        <button onClick={handleClear} className="py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition-colors">AC</button>
      </div>

      {/* Numeric keypad */}
      <div className="grid grid-cols-4 gap-1.5">
        <button onClick={() => insertText('7')} className={numBtn}>7</button>
        <button onClick={() => insertText('8')} className={numBtn}>8</button>
        <button onClick={() => insertText('9')} className={numBtn}>9</button>
        <button onClick={() => insertText('÷')} className={opBtn}>÷</button>

        <button onClick={() => insertText('4')} className={numBtn}>4</button>
        <button onClick={() => insertText('5')} className={numBtn}>5</button>
        <button onClick={() => insertText('6')} className={numBtn}>6</button>
        <button onClick={() => insertText('×')} className={opBtn}>×</button>

        <button onClick={() => insertText('1')} className={numBtn}>1</button>
        <button onClick={() => insertText('2')} className={numBtn}>2</button>
        <button onClick={() => insertText('3')} className={numBtn}>3</button>
        <button onClick={() => insertText('-')} className={opBtn}>−</button>

        <button onClick={() => insertText('0')} className={numBtn}>0</button>
        <button onClick={() => insertText('.')} className={numBtn}>.</button>
        <button onClick={() => insertText('+')} className={opBtn}>+</button>
        <button
          onClick={handleEquals}
          className="py-3.5 rounded-lg text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          =
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Historial</h3>
            <button onClick={() => setHistory([])} className="text-xs text-gray-400 hover:text-red-500 font-medium">
              Borrar historial
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(h)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm transition-colors text-left"
              >
                <span className="text-gray-500 truncate mr-3">{h.expr}</span>
                <span className="font-semibold text-gray-900 flex-shrink-0">{formatNumber(h.result)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

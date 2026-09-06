'use client'

import { useMemo, useState } from 'react'

export function evaluarExpresion(input) {
  let i = 0
  const s = input.replace(/\s+/g, '')

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
      if (op === '/') {
        if (rhs === 0) error('División por cero')
        val = val / rhs
      } else val = val * rhs
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
      const exp = parseFactor()
      return Math.pow(base, exp)
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
    if (peek() === '√') {
      i++
      const val = parseFactor()
      if (val < 0) error('No se puede calcular la raíz de un número negativo')
      return Math.sqrt(val)
    }
    const start = i
    while (peek() !== undefined && /[0-9.]/.test(peek())) i++
    if (i === start) error(`Se esperaba un número en la posición ${i + 1}`)
    return parseFloat(s.slice(start, i))
  }

  if (s.length === 0) error('Escribe una expresión')
  const result = parseExpression()
  if (i !== s.length) error(`Carácter inesperado en la posición ${i + 1}`)
  return result
}

const BOTONES = ['7', '8', '9', '(', ')', '4', '5', '6', '+', '-', '1', '2', '3', '*', '/', '0', '.', '^', '√', 'C']

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-3 text-xl text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'

export default function CalculadoraCalculosCombinados() {
  const [expresion, setExpresion] = useState('')

  const resultado = useMemo(() => {
    if (!expresion.trim()) return { valor: null, error: null }
    try {
      return { valor: evaluarExpresion(expresion), error: null }
    } catch (e) {
      return { valor: null, error: e.message }
    }
  }, [expresion])

  function pulsar(simbolo) {
    if (simbolo === 'C') return setExpresion('')
    setExpresion((prev) => prev + simbolo)
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expresión matemática</label>
        <input
          type="text"
          value={expresion}
          onChange={(e) => setExpresion(e.target.value)}
          placeholder="Ej: 2 + 3 × (4 − 1)^2"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {BOTONES.map((b) => (
          <button
            key={b}
            onClick={() => pulsar(b === 'C' ? 'C' : b)}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              b === 'C' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center min-h-[6rem] flex flex-col justify-center">
        {resultado.error ? (
          <p className="text-red-600 font-medium">{resultado.error}</p>
        ) : (
          <>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
            <p className="text-4xl font-bold text-blue-700 break-all">
              {resultado.valor !== null ? parseFloat(resultado.valor.toFixed(10)) : '—'}
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Respeta el orden de las operaciones (PEMDAS/PAPOMUDAS): primero paréntesis, luego potencias y raíces, luego
        multiplicación y división, y por último suma y resta.
      </p>
    </div>
  )
}

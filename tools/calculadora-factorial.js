'use client'

import { useMemo, useState } from 'react'
import { cerosFinalesFactorial, factorial } from '@/lib/calc/mates'
import { CopyButton, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const MAX = 5000

// Aproximación de Stirling para mostrar el orden de magnitud: log10(n!) ≈ Σ log10(k).
function log10Factorial(n) {
  let s = 0
  for (let k = 2; k <= n; k++) s += Math.log10(k)
  return s
}

export default function CalculadoraFactorial() {
  const [n, setN] = useState('10')
  const [verTodo, setVerTodo] = useState(false)

  const r = useMemo(() => {
    const v = Number(n)
    if (n === '' || !Number.isInteger(v) || v < 0) return { error: 'El factorial solo está definido para enteros no negativos (0, 1, 2, 3…).' }
    if (v > MAX) return { error: `Para mantener la página rápida, el máximo es ${MAX.toLocaleString('es-MX')}!` }
    const valor = factorial(v).toString()
    const l = log10Factorial(v)
    const exp = Math.floor(l)
    return {
      v,
      valor,
      digitos: valor.length,
      ceros: cerosFinalesFactorial(v),
      cientifica: v < 2 ? '1' : `${formatNumber(Math.pow(10, l - exp), 6)} × 10^${exp}`,
      desarrollo: v <= 12 ? (v < 2 ? '1' : Array.from({ length: v }, (_, i) => v - i).join(' × ')) : `${v} × ${v - 1} × ${v - 2} × … × 3 × 2 × 1`,
    }
  }, [n])

  const mostrar = r.valor && !verTodo && r.valor.length > 600 ? `${r.valor.slice(0, 300)}…${r.valor.slice(-100)}` : r.valor

  return (
    <div className="space-y-5">
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Número (n)</label>
        <NumberInput value={n} onChange={(v) => { setN(v); setVerTodo(false) }} min="0" max={MAX} step="1" suffix="!" />
      </div>
      {r.error ? (
        <p className="text-sm text-red-600">{r.error}</p>
      ) : (
        <ResultBox label={`${r.v}! =`}>
          <p className="font-mono text-lg text-blue-800 break-all bg-white rounded-lg border border-blue-100 p-3 max-h-72 overflow-y-auto">{mostrar}</p>
          <div className="flex gap-2">
            <CopyButton text={r.valor} label="Copiar resultado" />
            {r.valor.length > 600 && (
              <button type="button" onClick={() => setVerTodo((x) => !x)} className="text-sm text-blue-600 font-medium">
                {verTodo ? 'Mostrar resumido' : 'Mostrar todos los dígitos'}
              </button>
            )}
          </div>
          <Rows>
            <Row label="Desarrollo" value={r.desarrollo} />
            <Row label="Notación científica" value={r.cientifica} />
            <Row label="Cantidad de dígitos" value={formatNumber(r.digitos, 0)} />
            <Row label="Ceros al final" value={formatNumber(r.ceros, 0)} />
          </Rows>
          <Note>
            Los ceros finales se cuentan con la fórmula de Legendre: ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … Cada cero sale de un par 2 × 5, y
            en un factorial siempre sobran doses.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}

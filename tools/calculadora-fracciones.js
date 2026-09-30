'use client'

import { useMemo, useState } from 'react'
import { aMixto, operarFracciones, simplificar } from '@/lib/calc/mates'
import { formatNumber, inputClass, Note, ResultBox } from '@/components/calc-ui'

const OPERACIONES = ['+', '-', '×', '÷']

function Fraccion({ n, d, grande }) {
  if (d === 1) return <span className={grande ? 'text-4xl font-bold' : ''}>{n}</span>
  return (
    <span className={`inline-flex flex-col items-center align-middle leading-none ${grande ? 'text-3xl font-bold' : ''}`}>
      <span className="px-1">{n}</span>
      <span className="border-t-2 border-current w-full" />
      <span className="px-1">{d}</span>
    </span>
  )
}

function Entrada({ f, onChange, etiqueta }) {
  const campo = (k, placeholder) => (
    <input
      type="number"
      inputMode="numeric"
      value={f[k]}
      onChange={(e) => onChange({ ...f, [k]: e.target.value })}
      className={`${inputClass} text-center w-20`}
      placeholder={placeholder}
      aria-label={`${etiqueta}: ${placeholder}`}
    />
  )
  return (
    <div className="flex items-center gap-2">
      {campo('e', 'entero')}
      <div className="flex flex-col gap-1">
        {campo('n', 'num.')}
        {campo('d', 'den.')}
      </div>
    </div>
  )
}

// Convierte una entrada (entero opcional + fracción) en una fracción impropia.
function aImpropia({ e, n, d }) {
  const E = parseInt(e || '0', 10)
  const N = parseInt(n || '0', 10)
  const D = parseInt(d || '1', 10)
  if ([E, N, D].some((x) => isNaN(x)) || D === 0) return null
  if (E === 0) return simplificar(N, D)
  // En un número mixto el signo del entero afecta a todo el número: -2 ¾ = -11/4.
  return simplificar((E < 0 ? -1 : 1) * (Math.abs(E) * Math.abs(D) + Math.abs(N)), Math.abs(D))
}

export default function CalculadoraFracciones() {
  const [a, setA] = useState({ e: '', n: '1', d: '2' })
  const [b, setB] = useState({ e: '', n: '1', d: '3' })
  const [op, setOp] = useState('+')

  const r = useMemo(() => {
    const A = aImpropia(a)
    const B = aImpropia(b)
    if (!A || !B) return { error: 'Revisa los números: el denominador no puede ser 0.' }
    const res = operarFracciones(A, op, B)
    if (!res) return { error: 'No se puede dividir entre cero.' }
    return { A, B, ...res, mixto: aMixto(res.resultado) }
  }, [a, b, op])

  const pasos = () => {
    const { A, B } = r
    if (op === '+' || op === '-')
      return `${A.n}/${A.d} ${op} ${B.n}/${B.d} = (${A.n}×${B.d} ${op} ${B.n}×${A.d}) / (${A.d}×${B.d}) = ${r.sinSimplificar.n}/${r.sinSimplificar.d}`
    if (op === '×') return `${A.n}/${A.d} × ${B.n}/${B.d} = (${A.n}×${B.n}) / (${A.d}×${B.d}) = ${r.sinSimplificar.n}/${r.sinSimplificar.d}`
    return `${A.n}/${A.d} ÷ ${B.n}/${B.d} = ${A.n}/${A.d} × ${B.d}/${B.n} = ${r.sinSimplificar.n}/${r.sinSimplificar.d}`
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Entrada f={a} onChange={setA} etiqueta="Primera fracción" />
        <div className="flex gap-1">
          {OPERACIONES.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOp(o)}
              className={`w-10 h-10 rounded-lg text-lg font-bold border ${op === o ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700'}`}
              aria-label={{ '+': 'Sumar', '-': 'Restar', '×': 'Multiplicar', '÷': 'Dividir' }[o]}
            >
              {o}
            </button>
          ))}
        </div>
        <Entrada f={b} onChange={setB} etiqueta="Segunda fracción" />
      </div>
      <p className="text-xs text-gray-500">Deja el entero vacío para fracciones simples. Para números mixtos (como 2 ¾) escribe el entero y la fracción.</p>

      {r.error ? (
        <p className="text-sm text-red-600">{r.error}</p>
      ) : (
        <ResultBox>
          <div className="flex flex-wrap items-center gap-4 text-gray-900">
            <Fraccion n={r.A.n} d={r.A.d} /> <span className="text-xl">{op}</span> <Fraccion n={r.B.n} d={r.B.d} /> <span className="text-xl">=</span>
            <span className="text-blue-700"><Fraccion n={r.resultado.n} d={r.resultado.d} grande /></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg border border-blue-100 p-3">
              <p className="text-xs text-gray-500">Número mixto</p>
              <p className="font-semibold">
                {r.mixto.resto === 0 ? `${r.mixto.signo}${r.mixto.entero}` : `${r.mixto.signo}${r.mixto.entero ? r.mixto.entero + ' ' : ''}${r.mixto.resto}/${r.mixto.d}`}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 p-3">
              <p className="text-xs text-gray-500">Decimal</p>
              <p className="font-semibold">{formatNumber(r.resultado.n / r.resultado.d, 6)}</p>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 p-3">
              <p className="text-xs text-gray-500">Porcentaje</p>
              <p className="font-semibold">{formatNumber((r.resultado.n / r.resultado.d) * 100, 4)}%</p>
            </div>
          </div>
          <Note>
            Procedimiento: {pasos()}
            {(r.sinSimplificar.n !== r.resultado.n || Math.abs(r.sinSimplificar.d) !== r.resultado.d) && ` → simplificada: ${r.resultado.n}/${r.resultado.d}`}
          </Note>
        </ResultBox>
      )}
    </div>
  )
}

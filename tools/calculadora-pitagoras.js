'use client'

import { useMemo, useState } from 'react'
import { formatNumber, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const INCOGNITAS = [
  { id: 'c', label: 'Hipotenusa (c)' },
  { id: 'a', label: 'Cateto a' },
  { id: 'b', label: 'Cateto b' },
]

const grados = (rad) => (rad * 180) / Math.PI

export default function CalculadoraPitagoras() {
  const [incognita, setIncognita] = useState('c')
  const [a, setA] = useState('3')
  const [b, setB] = useState('4')
  const [c, setC] = useState('5')

  const r = useMemo(() => {
    const A = parseFloat(a)
    const B = parseFloat(b)
    const C = parseFloat(c)
    let lados
    let pasos
    if (incognita === 'c') {
      if (!(A > 0 && B > 0)) return null
      const v = Math.sqrt(A * A + B * B)
      lados = { a: A, b: B, c: v }
      pasos = `c = √(a² + b²) = √(${A}² + ${B}²) = √(${formatNumber(A * A, 4)} + ${formatNumber(B * B, 4)}) = √${formatNumber(A * A + B * B, 4)} = ${formatNumber(v, 6)}`
    } else {
      const conocido = incognita === 'a' ? B : A
      if (!(conocido > 0 && C > 0)) return null
      if (C <= conocido) return { error: 'La hipotenusa debe ser mayor que cualquiera de los catetos.' }
      const v = Math.sqrt(C * C - conocido * conocido)
      lados = incognita === 'a' ? { a: v, b: B, c: C } : { a: A, b: v, c: C }
      pasos = `${incognita} = √(c² − ${incognita === 'a' ? 'b' : 'a'}²) = √(${C}² − ${conocido}²) = √${formatNumber(C * C - conocido * conocido, 4)} = ${formatNumber(v, 6)}`
    }
    const alfa = grados(Math.atan2(lados.a, lados.b))
    return {
      lados,
      pasos,
      valor: lados[incognita],
      area: (lados.a * lados.b) / 2,
      perimetro: lados.a + lados.b + lados.c,
      alfa,
      beta: 90 - alfa,
      altura: (lados.a * lados.b) / lados.c,
      entero: [lados.a, lados.b, lados.c].every((x) => Math.abs(x - Math.round(x)) < 1e-9),
    }
  }, [incognita, a, b, c])

  const escala = r?.lados ? 160 / Math.max(r.lados.a, r.lados.b) : 1

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">¿Qué lado quieres calcular?</p>
        <Tabs tabs={INCOGNITAS} value={incognita} onChange={setIncognita} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {incognita !== 'a' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cateto a</label>
            <NumberInput value={a} onChange={setA} min="0" step="any" />
          </div>
        )}
        {incognita !== 'b' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cateto b</label>
            <NumberInput value={b} onChange={setB} min="0" step="any" />
          </div>
        )}
        {incognita !== 'c' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hipotenusa c</label>
            <NumberInput value={c} onChange={setC} min="0" step="any" />
          </div>
        )}
      </div>

      {r?.error && <p className="text-sm text-red-600">{r.error}</p>}
      {r?.lados && (
        <ResultBox label={INCOGNITAS.find((x) => x.id === incognita).label} value={formatNumber(r.valor, 6)}>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <svg viewBox="-20 -10 220 200" className="w-48 h-44 flex-shrink-0" role="img" aria-label="Triángulo rectángulo con sus lados">
              <polygon points={`0,${r.lados.a * escala} ${r.lados.b * escala},${r.lados.a * escala} 0,0`} fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
              <rect x="0" y={r.lados.a * escala - 12} width="12" height="12" fill="none" stroke="#2563eb" />
              <text x="-16" y={(r.lados.a * escala) / 2} fontSize="14" fill="#1e3a8a">a</text>
              <text x={(r.lados.b * escala) / 2} y={r.lados.a * escala + 18} fontSize="14" fill="#1e3a8a">b</text>
              <text x={(r.lados.b * escala) / 2 + 8} y={(r.lados.a * escala) / 2 - 6} fontSize="14" fill="#1e3a8a">c</text>
            </svg>
            <div className="flex-1 w-full">
              <Rows>
                <Row label="Cateto a · cateto b · hipotenusa c" value={`${formatNumber(r.lados.a, 4)} · ${formatNumber(r.lados.b, 4)} · ${formatNumber(r.lados.c, 4)}`} />
                <Row label="Ángulo opuesto a a (α)" value={`${formatNumber(r.alfa, 4)}°`} />
                <Row label="Ángulo opuesto a b (β)" value={`${formatNumber(r.beta, 4)}°`} />
                <Row label="Área (a × b ÷ 2)" value={formatNumber(r.area, 4)} />
                <Row label="Perímetro" value={formatNumber(r.perimetro, 4)} />
                <Row label="Altura sobre la hipotenusa" value={formatNumber(r.altura, 4)} />
              </Rows>
            </div>
          </div>
          <Note>
            {r.pasos}
            {r.entero && ' · Es una terna pitagórica: los tres lados son números enteros.'}
          </Note>
        </ResultBox>
      )}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { factorizar, formatearFactores, mcdMcm, parseNumeros, pasosEuclides } from '@/lib/calc/mates'
import { inputClass, Note, ResultBox, Row, Rows } from '@/components/calc-ui'

const MAX = 1e12

export default function CalculadoraMcdMcm() {
  const [texto, setTexto] = useState('12, 18, 30')

  const r = useMemo(() => {
    const { numeros } = parseNumeros(texto)
    const enteros = numeros.filter((x) => Number.isInteger(x) && x !== 0).map(Math.abs)
    if (enteros.length < 2) return { error: 'Escribe al menos dos números enteros distintos de cero.' }
    if (enteros.some((x) => x > MAX)) return { error: 'Usa números menores de un billón (10¹²) para factorizarlos al instante.' }
    const { mcd, mcm } = mcdMcm(enteros)
    const factores = enteros.map((x) => ({ x, f: factorizar(x) }))
    // Primos comunes con menor exponente (MCD) y todos los primos con mayor exponente (MCM).
    const primos = [...new Set(factores.flatMap(({ f }) => [...f.keys()]))].sort((a, b) => a - b)
    const comunes = new Map()
    const todos = new Map()
    for (const p of primos) {
      const exps = factores.map(({ f }) => f.get(p) || 0)
      if (Math.min(...exps) > 0) comunes.set(p, Math.min(...exps))
      todos.set(p, Math.max(...exps))
    }
    return { enteros, mcd, mcm, factores, comunes, todos, euclides: enteros.length === 2 ? pasosEuclides(enteros[0], enteros[1]) : null }
  }, [texto])

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Números enteros (dos o más)</label>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} className={inputClass} placeholder="Ej: 12, 18, 30" />
      </div>
      {r.error ? (
        <p className="text-sm text-red-600">{r.error}</p>
      ) : (
        <ResultBox>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">MCD (máximo común divisor)</p>
              <p className="text-4xl font-bold text-blue-700">{r.mcd.toLocaleString('es-MX')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">MCM (mínimo común múltiplo)</p>
              <p className="text-4xl font-bold text-blue-700 break-all">{BigInt(r.mcm).toLocaleString('es-MX')}</p>
            </div>
          </div>
          <Rows>
            {r.factores.map(({ x, f }) => (
              <Row key={x} label={`${x.toLocaleString('es-MX')}`} value={formatearFactores(f)} />
            ))}
            <Row label="MCD: primos comunes con su menor exponente" value={r.comunes.size ? formatearFactores(r.comunes) : '1 (son coprimos)'} bold />
            <Row label="MCM: todos los primos con su mayor exponente" value={formatearFactores(r.todos)} bold />
          </Rows>
          {r.euclides && (
            <Note>
              Algoritmo de Euclides: {r.euclides.map((p) => `${p.a} = ${p.b} × ${p.q} + ${p.r}`).join(' → ')}. El último residuo
              distinto de cero ({r.mcd}) es el MCD. Comprobación: MCD × MCM = {r.mcd} × {r.mcm.toString()} = {(BigInt(r.mcd) * r.mcm).toString()} = {r.enteros[0]} × {r.enteros[1]}.
            </Note>
          )}
        </ResultBox>
      )}
    </div>
  )
}

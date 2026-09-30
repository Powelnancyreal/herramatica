'use client'

import { useMemo, useState } from 'react'
import { formatNumber, NumberInput, ResultBox, secondaryButtonClass } from '@/components/calc-ui'

const LB_POR_KG = 2.2046226218
const KG_POR_LB = 0.45359237
const TABLA = [1, 2, 5, 10, 20, 25, 50, 60, 70, 80, 90, 100]

export default function KilosALibras() {
  const [aLibras, setALibras] = useState(true)
  const [valor, setValor] = useState('1')

  const r = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v) || v < 0) return null
    if (aLibras) {
      const lb = v * LB_POR_KG
      const entero = Math.floor(lb)
      return { principal: `${formatNumber(lb, 3)} lb`, detalle: `${entero} lb ${formatNumber((lb - entero) * 16, 1)} oz` }
    }
    const kg = v * KG_POR_LB
    return { principal: `${formatNumber(kg, 3)} kg`, detalle: `${formatNumber(kg * 1000, 0)} gramos` }
  }, [valor, aLibras])

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{aLibras ? 'Kilogramos (kg)' : 'Libras (lb)'}</label>
          <NumberInput value={valor} onChange={setValor} min="0" suffix={aLibras ? 'kg' : 'lb'} />
        </div>
        <button type="button" onClick={() => setALibras((v) => !v)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">
          ⇄
        </button>
      </div>
      {r && (
        <ResultBox label="Equivale a" value={r.principal}>
          <p className="text-sm text-gray-700">{r.detalle}</p>
          <p className="text-xs text-gray-600">
            {aLibras ? '1 kg = 2.20462 libras' : '1 libra = 0.45359237 kg (valor exacto por definición internacional de 1959)'}
          </p>
        </ResultBox>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">Kilogramos</th>
              <th className="text-left px-3 py-2">Libras</th>
              <th className="text-left px-3 py-2">Libras</th>
              <th className="text-left px-3 py-2">Kilogramos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {TABLA.map((n) => (
              <tr key={n}>
                <td className="px-3 py-1.5">{n} kg</td>
                <td className="px-3 py-1.5 font-medium">{formatNumber(n * LB_POR_KG, 2)} lb</td>
                <td className="px-3 py-1.5">{n} lb</td>
                <td className="px-3 py-1.5 font-medium">{formatNumber(n * KG_POR_LB, 2)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

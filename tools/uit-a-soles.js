'use client'

import { useState } from 'react'
import { UIT_HISTORICA } from '@/lib/calc/latam'
import { pen } from '@/components/calc-ui-eur'
import { formatNumber, inputClass, NumberInput, ResultBox, secondaryButtonClass } from '@/components/calc-ui'

const REFERENCIAS = [
  [7, 'Deducción anual de la renta de trabajo'],
  [5, 'Límite del primer tramo de renta (8%)'],
  [3, 'Deducción adicional por gastos'],
  [0.5, 'Referencia de multas menores'],
]

export default function UitASoles() {
  const [anio, setAnio] = useState(String(UIT_HISTORICA[0][0]))
  const [valor, setValor] = useState('1')
  const [aSoles, setASoles] = useState(true)
  const uit = UIT_HISTORICA.find(([a]) => String(a) === anio)[1]
  const v = parseFloat(valor)
  const res = isNaN(v) ? null : aSoles ? v * uit : v / uit

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Año de la UIT</label>
          <select value={anio} onChange={(e) => setAnio(e.target.value)} className={inputClass}>
            {UIT_HISTORICA.map(([a, u]) => (
              <option key={a} value={a}>{a}: {pen(u)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{aSoles ? 'Cantidad de UIT' : 'Monto en soles'}</label>
          <div className="flex gap-2">
            <NumberInput value={valor} onChange={setValor} min="0" step="any" suffix={aSoles ? 'UIT' : 'S/'} />
            <button type="button" onClick={() => setASoles((x) => !x)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">⇄</button>
          </div>
        </div>
      </div>
      {res !== null && <ResultBox label="Equivale a" value={aSoles ? pen(res) : `${formatNumber(res, 4)} UIT`} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="overflow-x-auto">
          <p className="text-sm font-semibold text-gray-900 mb-2">Valor de la UIT por año</p>
          <table className="w-full text-sm border border-gray-200">
            <tbody className="divide-y divide-gray-100">
              {UIT_HISTORICA.map(([a, u], i) => (
                <tr key={a} className={String(a) === anio ? 'bg-blue-50 font-semibold' : ''}>
                  <td className="px-3 py-1.5">{a}</td>
                  <td className="px-3 py-1.5 text-right">{pen(u)}</td>
                  <td className="px-3 py-1.5 text-right text-gray-500">{UIT_HISTORICA[i + 1] ? `+${formatNumber((u / UIT_HISTORICA[i + 1][1] - 1) * 100, 1)}%` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Referencias frecuentes en {anio}</p>
          <ul className="text-sm space-y-1.5">
            {REFERENCIAS.map(([n, t]) => (
              <li key={t} className="flex justify-between gap-3 border-b border-gray-100 pb-1"><span className="text-gray-600">{n} UIT · {t}</span><span className="font-medium">{pen(n * uit)}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs text-gray-500">La UIT de 2026 (S/ 5,500) fue aprobada por el Decreto Supremo N.º 301-2025-EF.</p>
    </div>
  )
}
